/**
 * La conversación con Qwen (Qwen 3.8 27B, servido por Cerebras): el prompt,
 * el esquema de la respuesta y la llamada. Vive aparte del handler para que el
 * script de evaluación (`scripts/eval-detonadoras.mjs`) pruebe exactamente lo
 * mismo que corre en producción. El guion bajo del nombre hace que Vercel no
 * lo publique como una función más.
 *
 * Sólo corre en el servidor. Si algún día este archivo se importa desde
 * `src/`, la llave seguiría a salvo —se lee de `process.env` al llamar—, pero
 * el prompt completo terminaría en el bundle del navegador.
 */
import { AREA_BY_ID } from '../src/data/areas.js'
import { QUESTIONS, SCALE } from '../src/data/questions.js'
import {
  candidateFocuses,
  MAX_OPTION_LENGTH,
  MAX_PROMPT_LENGTH,
  OPTIONS_PER_TRIGGER,
  TRIGGER_COUNT,
  tiedTopAreaIds,
  validateTriggerSet,
} from '../src/lib/refine.js'
import { computeAffinity } from '../src/lib/affinity.js'

/**
 * Cerebras y no Alibaba Cloud Model Studio: a ~1,850 tokens por segundo el
 * razonamiento cabe en la espera de un teléfono, y la cuenta es prepagada sin
 * recarga automática. El endpoint es público, así que el saldo cargado es el
 * tope de lo que alguien puede gastar llamándolo en bucle.
 */
const BASE_URL = 'https://api.cerebras.ai/v1'
/**
 * Corta antes que el navegador (8 s) para que su error llegue primero. Es el
 * tope de las dos llamadas juntas, no de cada una.
 */
const TIMEOUT_MS = 7000
/**
 * Cuánto piensa Qwen antes de redactar (`none`, `low`, `medium`, `high`).
 * En la evaluación del 2026-10-09, con `low` las opciones salieron más finas
 * —"defines SLOs y un proceso de incidentes" frente a caricaturas como
 * "explotar los datos antes de preocuparme por la calidad"—, a cambio de 1 a
 * 2.2 s por llamada (10 de 10 válidas). `medium` no mostró ventaja sobre
 * `low`.
 */
const REASONING_EFFORT = 'low'
/**
 * El razonamiento cuenta dentro de este tope. Con `low` y los límites en
 * palabras, Qwen razonó entre 950 y 2,900 tokens. Si aun así se desboca y
 * llena el tope sin escribir el JSON, 4,000 lo corta hacia los 3 s y deja
 * tiempo para el reintento.
 */
const MAX_TOKENS = 4000
/**
 * El reintento va sin razonamiento: tarda ~1 s, que es lo que cabe después de
 * un primer intento fallido. Sólo se intenta si queda al menos este margen.
 */
const RETRY_EFFORT = 'none'
const RETRY_MIN_MS = 2000
/**
 * Los límites se le dicen a Qwen en palabras, no en caracteres, y más cortos
 * que los que exige `validateTriggerSet`. En la evaluación del 2026-10-09,
 * sin razonamiento, el modelo se pasaba de los 110 caracteres pedidos (llegó a
 * 135), y fue la única causa de rechazo. Con razonamiento fue peor: contaba
 * letra por letra —"T(1)u(2) (3)…"— hasta agotar el tope sin escribir el
 * JSON. Ocho caracteres por palabra es holgado para el español, así que el
 * margen absorbe el exceso sin tocar la interfaz ni la validación.
 */
const STATED_PROMPT_WORDS = Math.floor(MAX_PROMPT_LENGTH / 8)
const STATED_OPTION_WORDS = Math.floor(MAX_OPTION_LENGTH / 8)
/**
 * Alta a propósito: es lo que hace que dos intentos del mismo estudiante no
 * reciban las mismas preguntas. Lo que no varía —qué enfoques pueden salir y
 * cómo se cuenta— lo fija el esquema, no la temperatura.
 */
const TEMPERATURE = 0.9

const QUESTION_BY_ID = Object.fromEntries(QUESTIONS.map((question) => [question.id, question]))
const LABEL_BY_VALUE = Object.fromEntries(SCALE.map((step) => [step.value, step.label]))

/**
 * `retryable` distingue lo que el modelo redactó mal —que otro intento puede
 * arreglar— de lo que respondió Cerebras: un 429 por límite o saldo en cero
 * no se arregla insistiendo.
 */
export class QwenError extends Error {
  name = 'QwenError'

  constructor(message, { retryable = false } = {}) {
    super(message)
    this.retryable = retryable
  }
}

const SYSTEM_PROMPT = `Formas parte de PotroPath, un diagnóstico de afinidad dentro de Ingeniería en Computación para estudiantes universitarios en México. El estudiante ya respondió 50 afirmaciones en una escala de 1 (totalmente en desacuerdo) a 5 (totalmente de acuerdo) y ya sabe cuál es su área de mayor afinidad. Tu trabajo es redactar exactamente ${TRIGGER_COUNT} preguntas de opción múltiple que ayuden a elegir entre los enfoques candidatos que se te dan.

Reglas:
- Español de México, tuteo, tono directo y profesional. Le hablas a un futuro profesional, no a un niño: sin condescendencia, sin entusiasmo exagerado, sin emoji, sin signos de exclamación.
- Cada pregunta plantea una situación concreta y verosímil —un proyecto, un encargo, una decisión en el trabajo— y no una pregunta abstracta como "¿qué te gusta más?".
- Cada pregunta tiene exactamente ${OPTIONS_PER_TRIGGER} opciones, y cada opción corresponde a un enfoque distinto de la lista de candidatos (su focusId). La opción describe lo que haría en esa situación alguien con ese enfoque. No escribas el nombre del enfoque en la opción.
- Las dos preguntas exploran ángulos distintos entre sí. Concéntrate en los enfoques donde las respuestas del estudiante dejaron más duda.
- Puedes aludir al patrón de respuestas del estudiante ("te atrae construir el sistema, no tanto afinar el modelo"), pero nunca cites números, puntajes ni porcentajes.
- Las situaciones son hipotéticas. No afirmes nada sobre la UAEMéx, su facultad, empresas reales, salarios, estadísticas ni eventos. No inventes datos.
- Enunciado de máximo ${STATED_PROMPT_WORDS} palabras; cada opción, una sola frase de máximo ${STATED_OPTION_WORDS} palabras. No cuentes letras ni caracteres: si dudas, recorta.
- Responde únicamente con JSON con esta forma: {"questions":[{"prompt":"…","options":[{"text":"…","focusId":"…"}]}]}.`

function answerLine(questionId, answers) {
  const value = answers[questionId]
  return `  - «${QUESTION_BY_ID[questionId].prompt}» → ${value} (${LABEL_BY_VALUE[value]})`
}

/**
 * El mensaje del estudiante. Lleva lo que Qwen necesita para preguntar donde
 * hay duda —qué afirmaciones alimentan a cada enfoque y qué respondió en
 * ellas— y nada más: no hay nombre, ni correo, ni texto libre, porque el
 * navegador no manda nada de eso.
 */
export function buildUserMessage(answers, candidates) {
  const results = computeAffinity(answers)
  const tied = new Set(tiedTopAreaIds(answers))

  const affinity = results
    .map(({ areaId, percentage }) => `- ${AREA_BY_ID[areaId].name}: ${percentage}`)
    .join('\n')

  const focuses = candidates
    .map((focus) =>
      [
        `- focusId "${focus.id}" — ${focus.name} (${AREA_BY_ID[focus.areaId].name}): ${focus.description}`,
        '  Afirmaciones que lo alimentan y lo que respondió:',
        ...focus.signals.map((id) => answerLine(id, answers)),
      ].join('\n'),
    )
    .join('\n')

  const signalIds = new Set(candidates.flatMap((focus) => focus.signals))
  const context = QUESTIONS.filter((question) => tied.has(question.areaId) && !signalIds.has(question.id))
    .map((question) => answerLine(question.id, answers))
    .join('\n')

  return [
    'Afinidad por área (escala de 20 a 100):',
    affinity,
    '',
    'Enfoques candidatos:',
    focuses,
    '',
    'Otras respuestas del área o áreas en juego, como contexto:',
    context || '  (ninguna)',
  ].join('\n')
}

/**
 * El esquema que se le pide a Qwen. El enum es lo que ata cada opción al
 * catálogo.
 *
 * Usa sólo el subconjunto que Cerebras impone en modo estricto: sin
 * `minItems`/`maxItems` ni, con este modelo, `maxLength` —con ellos la
 * llamada responde 400—. Los conteos van como tuplas (`prefixItems` con
 * `items: false`), que fijan el máximo; el mínimo y las longitudes los exige
 * `validateTriggerSet`, que ya los revisaba. `tests/qwen.test.js` cuida que
 * nadie los vuelva a añadir.
 */
export function responseSchema(candidateIds) {
  const option = {
    type: 'object',
    additionalProperties: false,
    required: ['text', 'focusId'],
    properties: {
      text: { type: 'string' },
      focusId: { type: 'string', enum: candidateIds },
    },
  }
  const question = {
    type: 'object',
    additionalProperties: false,
    required: ['prompt', 'options'],
    properties: {
      prompt: { type: 'string' },
      options: { type: 'array', prefixItems: Array(OPTIONS_PER_TRIGGER).fill(option), items: false },
    },
  }
  return {
    type: 'object',
    additionalProperties: false,
    required: ['questions'],
    properties: {
      questions: { type: 'array', prefixItems: Array(TRIGGER_COUNT).fill(question), items: false },
    },
  }
}

/** Una llamada a Cerebras: devuelve las detonadoras validadas o lanza `QwenError`. */
async function requestTriggers({ apiKey, model, reasoningEffort, timeoutMs, userMessage, candidateIds }) {
  const response = await fetch(`${BASE_URL}/chat/completions`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
    signal: AbortSignal.timeout(timeoutMs),
    body: JSON.stringify({
      model,
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: userMessage },
      ],
      response_format: {
        type: 'json_schema',
        json_schema: { name: 'detonadoras', strict: true, schema: responseSchema(candidateIds) },
      },
      // `reasoning_effort` y no `enable_thinking`: Cerebras pide no mandar los
      // parámetros nativos de Qwen. El razonamiento vuelve aparte del
      // contenido, así que `content` trae sólo el JSON.
      reasoning_effort: reasoningEffort,
      temperature: TEMPERATURE,
      max_completion_tokens: MAX_TOKENS,
    }),
  })

  if (!response.ok) throw new QwenError(`Cerebras respondió ${response.status}`)

  const data = await response.json()
  let parsed
  try {
    parsed = JSON.parse(data?.choices?.[0]?.message?.content ?? '')
  } catch {
    throw new QwenError('la respuesta no es JSON', { retryable: true })
  }

  const questions = validateTriggerSet(parsed?.questions, candidateIds)
  if (!questions) throw new QwenError('la respuesta no pasó la validación', { retryable: true })

  return { questions, usage: data.usage ?? null }
}

/**
 * Pide las dos detonadoras y las devuelve ya validadas, o lanza `QwenError`.
 *
 * Si la primera respuesta viene mal redactada y queda tiempo, reintenta una
 * vez sin razonamiento: una pregunta de Qwen algo menos fina sigue siendo
 * mejor que una de respaldo, que no leyó las respuestas. `attempts` dice
 * cuántas llamadas hicieron falta. `reasoningEffort` sólo se pasa desde la
 * evaluación, para comparar esfuerzos con el mismo prompt.
 */
export async function generateTriggers(answers, options = {}) {
  const {
    apiKey = process.env.CEREBRAS_API_KEY,
    model = process.env.QWEN_MODEL,
    reasoningEffort = REASONING_EFFORT,
  } = options

  const candidates = candidateFocuses(answers)
  const request = {
    apiKey,
    model,
    userMessage: buildUserMessage(answers, candidates),
    candidateIds: candidates.map((focus) => focus.id),
  }
  const deadline = Date.now() + TIMEOUT_MS

  try {
    return { ...(await requestTriggers({ ...request, reasoningEffort, timeoutMs: TIMEOUT_MS })), attempts: 1 }
  } catch (error) {
    const remaining = deadline - Date.now()
    if (!error.retryable || remaining < RETRY_MIN_MS) throw error
    return {
      ...(await requestTriggers({ ...request, reasoningEffort: RETRY_EFFORT, timeoutMs: remaining })),
      attempts: 2,
    }
  }
}

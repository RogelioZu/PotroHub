/**
 * La conversación con Qwen (Alibaba Cloud Model Studio): el prompt, el
 * esquema de la respuesta y la llamada. Vive aparte del handler para que el
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

/** Corta antes que el navegador (8 s) para que su error llegue primero. */
const TIMEOUT_MS = 7000
/** Dos preguntas y seis opciones caben de sobra; el tope acota el gasto. */
const MAX_TOKENS = 700
/**
 * Alta a propósito: es lo que hace que dos intentos del mismo estudiante no
 * reciban las mismas preguntas. Lo que no varía —qué enfoques pueden salir y
 * cómo se cuenta— lo fija el esquema, no la temperatura.
 */
const TEMPERATURE = 0.9

const QUESTION_BY_ID = Object.fromEntries(QUESTIONS.map((question) => [question.id, question]))
const LABEL_BY_VALUE = Object.fromEntries(SCALE.map((step) => [step.value, step.label]))

export class QwenError extends Error {
  name = 'QwenError'
}

const SYSTEM_PROMPT = `Formas parte de PotroPath, un diagnóstico de afinidad dentro de Ingeniería en Computación para estudiantes universitarios en México. El estudiante ya respondió 50 afirmaciones en una escala de 1 (totalmente en desacuerdo) a 5 (totalmente de acuerdo) y ya sabe cuál es su área de mayor afinidad. Tu trabajo es redactar exactamente ${TRIGGER_COUNT} preguntas de opción múltiple que ayuden a elegir entre los enfoques candidatos que se te dan.

Reglas:
- Español de México, tuteo, tono directo y profesional. Le hablas a un futuro profesional, no a un niño: sin condescendencia, sin entusiasmo exagerado, sin emoji, sin signos de exclamación.
- Cada pregunta plantea una situación concreta y verosímil —un proyecto, un encargo, una decisión en el trabajo— y no una pregunta abstracta como "¿qué te gusta más?".
- Cada pregunta tiene exactamente ${OPTIONS_PER_TRIGGER} opciones, y cada opción corresponde a un enfoque distinto de la lista de candidatos (su focusId). La opción describe lo que haría en esa situación alguien con ese enfoque. No escribas el nombre del enfoque en la opción.
- Las dos preguntas exploran ángulos distintos entre sí. Concéntrate en los enfoques donde las respuestas del estudiante dejaron más duda.
- Puedes aludir al patrón de respuestas del estudiante ("te atrae construir el sistema, no tanto afinar el modelo"), pero nunca cites números, puntajes ni porcentajes.
- Las situaciones son hipotéticas. No afirmes nada sobre la UAEMéx, su facultad, empresas reales, salarios, estadísticas ni eventos. No inventes datos.
- Enunciado de máximo ${MAX_PROMPT_LENGTH} caracteres; cada opción, máximo ${MAX_OPTION_LENGTH}.
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

/** El esquema que se le pide a Qwen. El enum es lo que ata cada opción al catálogo. */
export function responseSchema(candidateIds) {
  return {
    type: 'object',
    additionalProperties: false,
    required: ['questions'],
    properties: {
      questions: {
        type: 'array',
        minItems: TRIGGER_COUNT,
        maxItems: TRIGGER_COUNT,
        items: {
          type: 'object',
          additionalProperties: false,
          required: ['prompt', 'options'],
          properties: {
            prompt: { type: 'string', maxLength: MAX_PROMPT_LENGTH },
            options: {
              type: 'array',
              minItems: OPTIONS_PER_TRIGGER,
              maxItems: OPTIONS_PER_TRIGGER,
              items: {
                type: 'object',
                additionalProperties: false,
                required: ['text', 'focusId'],
                properties: {
                  text: { type: 'string', maxLength: MAX_OPTION_LENGTH },
                  focusId: { type: 'string', enum: candidateIds },
                },
              },
            },
          },
        },
      },
    },
  }
}

/**
 * Pide las dos detonadoras y las devuelve ya validadas, o lanza `QwenError`.
 *
 * `QWEN_RESPONSE_FORMAT=json_object` existe porque la documentación de Model
 * Studio se contradice sobre si Singapur soporta JSON Schema. En ese modo el
 * esquema no lo impone el modelo, pero `validateTriggerSet` se aplica igual:
 * la forma la garantiza el servidor en los dos casos.
 */
export async function generateTriggers(answers, options = {}) {
  const {
    apiKey = process.env.DASHSCOPE_API_KEY,
    baseUrl = process.env.DASHSCOPE_BASE_URL,
    model = process.env.QWEN_MODEL,
    responseFormat = process.env.QWEN_RESPONSE_FORMAT || 'json_schema',
  } = options

  const candidates = candidateFocuses(answers)
  const candidateIds = candidates.map((focus) => focus.id)

  const response = await fetch(`${baseUrl.replace(/\/+$/, '')}/chat/completions`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
    signal: AbortSignal.timeout(TIMEOUT_MS),
    body: JSON.stringify({
      model,
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: buildUserMessage(answers, candidates) },
      ],
      response_format:
        responseFormat === 'json_object'
          ? { type: 'json_object' }
          : { type: 'json_schema', json_schema: { name: 'detonadoras', strict: true, schema: responseSchema(candidateIds) } },
      // Sin razonamiento: añade segundos de espera en un teléfono con mala red,
      // y Model Studio advierte que con él el JSON sale menos confiable.
      enable_thinking: false,
      temperature: TEMPERATURE,
      max_tokens: MAX_TOKENS,
    }),
  })

  if (!response.ok) throw new QwenError(`Model Studio respondió ${response.status}`)

  const data = await response.json()
  let parsed
  try {
    parsed = JSON.parse(data?.choices?.[0]?.message?.content ?? '')
  } catch {
    throw new QwenError('la respuesta no es JSON')
  }

  const questions = validateTriggerSet(parsed?.questions, candidateIds)
  if (!questions) throw new QwenError('la respuesta no pasó la validación')

  return { questions, usage: data.usage ?? null }
}

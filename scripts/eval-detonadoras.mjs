/**
 * Evaluación manual de las detonadoras: corre perfiles sintéticos contra uno
 * o varios modelos de Cerebras, con uno o varios esfuerzos de razonamiento, e
 * imprime lo que cada combinación redactó, para elegir `QWEN_MODEL` y
 * `REASONING_EFFORT` leyendo y no adivinando.
 *
 *   npm run eval:detonadoras
 *   QWEN_EVAL_EFFORTS=none,low,medium npm run eval:detonadoras
 *   QWEN_EVAL_MODELS=qwen-3.8-27b,gpt-oss-120b npm run eval:detonadoras
 *
 * Usa `api/_qwen.js` tal cual, así que prueba exactamente el prompt, el
 * esquema, la validación y el reintento de producción. Un caso que necesitó
 * reintento cuenta como válido, pero se marca: ese reintento va sin
 * razonamiento, así que no dice nada del esfuerzo que se está evaluando. Lo que no puede medir por ti es lo
 * que importa: si el español suena a alguien que le habla a un futuro
 * profesional, y si las tres opciones de verdad obligan a elegir.
 *
 * Cada corrida gasta saldo real: ~1.6K tokens de entrada por perfil, más la
 * salida, que con razonamiento `low` ronda los 2K.
 * gpt-oss-120b no acepta el esfuerzo `none`.
 */
import { QUESTIONS } from '../src/data/questions.js'
import { candidateFocuses } from '../src/lib/refine.js'
import { generateTriggers } from '../api/_qwen.js'

/**
 * Una capa sobrescribe respuestas por área (`ia: 4`) o por pregunta
 * (`'ia-1': 5`). Las capas se aplican en orden, así que la de preguntas va
 * después de la de su área.
 */
function apply(answers, layer) {
  const next = { ...answers }
  for (const [prefix, value] of Object.entries(layer)) {
    for (const question of QUESTIONS) {
      if (question.id === prefix || question.areaId === prefix) next[question.id] = value
    }
  }
  return next
}

/** Todas las respuestas en `base`, y luego cada capa encima. */
function profile(base, ...layers) {
  return layers.reduce(apply, Object.fromEntries(QUESTIONS.map((question) => [question.id, base])))
}

const PROFILES = [
  ['IA clara, sin preferencia de enfoque', profile(2, { ia: 5 })],
  ['IA inclinada a lenguaje', profile(2, { ia: 4 }, { 'ia-1': 5, 'ia-9': 5, 'ia-3': 2, 'ia-4': 2 })],
  ['IA dividida entre visión y modelado', profile(2, { ia: 4 }, { 'ia-1': 2, 'ia-9': 2 })],
  ['Ciberseguridad: ofensiva contra defensa', profile(2, { ciberseguridad: 4 }, { 'ciberseguridad-1': 5, 'ciberseguridad-4': 5 })],
  ['Nube con señales de SRE', profile(3, { nube: 4 }, { 'nube-7': 5, 'nube-9': 5 })],
  ['Datos orientado a ingeniería', profile(2, { 'ciencia-datos': 4 }, { 'ciencia-datos-2': 5, 'ciencia-datos-10': 5 })],
  ['Software orientado a calidad', profile(2, { software: 4 }, { 'software-2': 5, 'software-10': 5 })],
  ['Empate doble: IA y Ciencia de Datos', profile(2, { ia: 4, 'ciencia-datos': 4 })],
  ['Todo neutral (empate de cinco áreas)', profile(3)],
  ['Perfil plano alto (todo 5)', profile(5)],
]

const models = (process.env.QWEN_EVAL_MODELS || process.env.QWEN_MODEL || '')
  .split(',')
  .map((model) => model.trim())
  .filter(Boolean)

/** Sin `QWEN_EVAL_EFFORTS`, `undefined` deja el esfuerzo de producción. */
const efforts = (process.env.QWEN_EVAL_EFFORTS || '')
  .split(',')
  .map((effort) => effort.trim())
  .filter(Boolean)

if (!process.env.CEREBRAS_API_KEY || models.length === 0) {
  console.error('Faltan CEREBRAS_API_KEY o QWEN_MODEL en .env (ver .env.example).')
  process.exit(1)
}

for (const model of models) for (const reasoningEffort of efforts.length > 0 ? efforts : [undefined]) {
  const label = reasoningEffort ? `${model} · razonamiento ${reasoningEffort}` : model
  console.log(`\n══════ ${label} ══════`)
  let failures = 0
  let retries = 0
  let totalMs = 0

  for (const [label, answers] of PROFILES) {
    const candidates = candidateFocuses(answers).map((focus) => `${focus.id} (${focus.base.toFixed(1)})`)
    console.log(`\n▸ ${label}\n  candidatos: ${candidates.join(', ')}`)

    const started = performance.now()
    try {
      const { questions, usage, attempts } = await generateTriggers(answers, { model, reasoningEffort })
      const ms = Math.round(performance.now() - started)
      totalMs += ms
      if (attempts > 1) retries += 1
      const reasoning = usage?.completion_tokens_details?.reasoning_tokens ?? '?'
      console.log(
        `  ${ms} ms · tokens: ${usage?.prompt_tokens ?? '?'} entrada, ${usage?.completion_tokens ?? '?'} salida (${reasoning} de razonamiento)${attempts > 1 ? ' · ↻ reintento' : ''}`,
      )
      for (const question of questions) {
        console.log(`  ¿ ${question.prompt}`)
        for (const option of question.options) console.log(`     · [${option.focusId}] ${option.text}`)
      }
    } catch (error) {
      failures += 1
      console.log(`  ✗ ${error.name}: ${error.message}`)
    }
  }

  const ok = PROFILES.length - failures
  console.log(
    `\n${label}: ${ok}/${PROFILES.length} válidas (${retries} con reintento) · promedio ${ok ? Math.round(totalMs / ok) : '—'} ms`,
  )
}

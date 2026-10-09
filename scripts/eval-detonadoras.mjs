/**
 * Evaluación manual de las detonadoras: corre perfiles sintéticos contra uno
 * o varios modelos de Qwen e imprime lo que cada uno redactó, para elegir
 * `QWEN_MODEL` leyendo y no adivinando.
 *
 *   npm run eval:detonadoras
 *   QWEN_EVAL_MODELS=qwen3.8-flash,qwen3.7-plus npm run eval:detonadoras
 *
 * Usa `api/_qwen.js` tal cual, así que prueba exactamente el prompt, el
 * esquema y la validación de producción. Lo que no puede medir por ti es lo
 * que importa: si el español suena a alguien que le habla a un futuro
 * profesional, y si las tres opciones de verdad obligan a elegir.
 *
 * Cada corrida gasta tokens reales (~3.5K por perfil y modelo).
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

if (!process.env.DASHSCOPE_API_KEY || !process.env.DASHSCOPE_BASE_URL || models.length === 0) {
  console.error('Faltan DASHSCOPE_API_KEY, DASHSCOPE_BASE_URL o QWEN_MODEL en .env (ver .env.example).')
  process.exit(1)
}

for (const model of models) {
  console.log(`\n══════ ${model} ══════`)
  let failures = 0
  let totalMs = 0

  for (const [label, answers] of PROFILES) {
    const candidates = candidateFocuses(answers).map((focus) => `${focus.id} (${focus.base.toFixed(1)})`)
    console.log(`\n▸ ${label}\n  candidatos: ${candidates.join(', ')}`)

    const started = performance.now()
    try {
      const { questions, usage } = await generateTriggers(answers, { model })
      const ms = Math.round(performance.now() - started)
      totalMs += ms
      console.log(`  ${ms} ms · tokens: ${usage?.prompt_tokens ?? '?'} entrada, ${usage?.completion_tokens ?? '?'} salida`)
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
  console.log(`\n${model}: ${ok}/${PROFILES.length} válidas · promedio ${ok ? Math.round(totalMs / ok) : '—'} ms`)
}

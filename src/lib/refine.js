import { FALLBACK_TRIGGERS } from '../data/fallbackTriggers.js'
import { FOCUSES } from '../data/focuses.js'
import { computeAffinity } from './affinity.js'

/**
 * La lógica de las preguntas detonadoras, sin React ni red: la comparten el
 * navegador y la función de `/api/detonadoras`. Si el servidor eligiera los
 * candidatos de una forma y el store los revalidara de otra, un empate
 * terminaría descartando preguntas buenas al recargar.
 */

export const TRIGGER_COUNT = 2
export const OPTIONS_PER_TRIGGER = 3
/** Dos preguntas de tres opciones dan seis lugares: más candidatos no caben. */
export const MAX_CANDIDATES = TRIGGER_COUNT * OPTIONS_PER_TRIGGER
export const MAX_PROMPT_LENGTH = 180
export const MAX_OPTION_LENGTH = 110

/** De dónde salieron las preguntas. La interfaz lo dice en voz alta. */
export const SOURCES = new Set(['ia', 'respaldo'])

/** Las áreas que comparten el porcentaje más alto. Casi siempre es una. */
export function tiedTopAreaIds(answers) {
  const results = computeAffinity(answers)
  return results.filter((result) => result.percentage === results[0].percentage).map((result) => result.areaId)
}

/** Promedio de las respuestas que alimentan a un enfoque, de 1 a 5. */
export function focusBase(focus, answers) {
  const values = focus.signals.map((id) => answers[id] ?? 0)
  return values.reduce((sum, value) => sum + value, 0) / values.length
}

/**
 * Los enfoques entre los que pueden elegir las detonadoras: los de todas las
 * áreas empatadas arriba, porque en un empate las dos preguntas desempatan
 * además de afinar.
 *
 * Responder "Neutral" a las cincuenta empata las cinco áreas y deja quince
 * enfoques para seis lugares. El recorte se queda con los de mayor base —lo
 * que las cincuenta sí dijeron— en vez de con las primeras áreas del arreglo,
 * que sería decidir por el orden en que alguien escribió un archivo. Se
 * devuelven en orden de catálogo, que es el último criterio de desempate.
 */
export function candidateFocuses(answers) {
  const areaIds = new Set(tiedTopAreaIds(answers))

  return FOCUSES.map((focus, order) => ({ focus, order, base: focusBase(focus, answers) }))
    .filter(({ focus }) => areaIds.has(focus.areaId))
    .sort((a, b) => b.base - a.base || a.order - b.order)
    .slice(0, MAX_CANDIDATES)
    .sort((a, b) => a.order - b.order)
    .map(({ focus, base }) => ({ ...focus, base }))
}

/**
 * Lo que puede aparecer en unas detonadoras ya guardadas. Es más amplio que
 * `candidateFocuses` a propósito: cada pregunta de respaldo pone frente a
 * frente los tres enfoques de un área, y en un empate de tres áreas el
 * recorte a seis puede haber dejado fuera alguno sin que eso vuelva inválida
 * la pregunta.
 */
export function eligibleFocusIds(answers) {
  const areaIds = new Set(tiedTopAreaIds(answers))
  return FOCUSES.filter((focus) => areaIds.has(focus.areaId)).map((focus) => focus.id)
}

/**
 * Las detonadoras de respaldo para este estudiante. Sin empate son las dos de
 * su área.
 *
 * En un empate, dar las dos de una sola área haría que la otra no pudiera
 * ganar nunca, y la nota de empate promete que estas preguntas desempatan. Se
 * toma la primera pregunta de cada una de las dos áreas cuyo mejor enfoque
 * tiene más base: cada respuesta elige un enfoque dentro de su área, y entre
 * los dos decide la base, que es lo que las cincuenta sí dijeron.
 */
export function fallbackTriggers(answers) {
  const areaIds = [
    ...new Set(
      candidateFocuses(answers)
        .sort((a, b) => b.base - a.base)
        .map((focus) => focus.areaId),
    ),
  ]
  if (areaIds.length === 1) return FALLBACK_TRIGGERS[areaIds[0]]
  return [FALLBACK_TRIGGERS[areaIds[0]][0], FALLBACK_TRIGGERS[areaIds[1]][0]]
}

function cleanText(value, maxLength) {
  if (typeof value !== 'string') return null
  const text = value.trim()
  return text.length > 0 && text.length <= maxLength ? text : null
}

/**
 * Revisa unas detonadoras que vienen de fuera —de Qwen en el servidor, de
 * `localStorage` en el navegador— y devuelve una copia limpia o `null`.
 *
 * El JSON Schema que se le pide a Qwen ya restringe la forma, pero no se le
 * cree: una región sin soporte de esquema, un cambio de versión del modelo o
 * una respuesta truncada dejarían pasar algo que la interfaz no sabe pintar.
 * Lo que se exige es exactamente lo que la interfaz da por hecho: dos
 * preguntas, tres opciones, enfoques conocidos y sin repetirse dentro de una
 * pregunta —dos opciones al mismo enfoque convertirían la pregunta en una
 * elección falsa—.
 */
export function validateTriggerSet(questions, allowedFocusIds) {
  const allowed = new Set(allowedFocusIds)
  if (!Array.isArray(questions) || questions.length !== TRIGGER_COUNT) return null

  const clean = []
  for (const question of questions) {
    const prompt = cleanText(question?.prompt, MAX_PROMPT_LENGTH)
    if (!prompt || !Array.isArray(question.options) || question.options.length !== OPTIONS_PER_TRIGGER) return null

    const options = []
    const seen = new Set()
    for (const option of question.options) {
      const text = cleanText(option?.text, MAX_OPTION_LENGTH)
      const focusId = option?.focusId
      if (!text || !allowed.has(focusId) || seen.has(focusId)) return null
      seen.add(focusId)
      options.push({ text, focusId })
    }

    clean.push({ prompt, options })
  }

  return clean
}

/**
 * El enfoque que eligen las dos respuestas, o `null` si falta alguna.
 *
 * Gana el que tenga más votos. Si las dos respuestas apuntan a enfoques
 * distintos, decide la base —lo que dijeron las cincuenta—, y si también
 * empata, el orden del catálogo. Es determinista a propósito: lo no
 * determinista son las preguntas, no la cuenta, y un jurado que audite el
 * método tiene que poder rehacerla a mano.
 */
export function pickFocus(picks, answers) {
  if (!Array.isArray(picks) || picks.length !== TRIGGER_COUNT || picks.some((pick) => !pick)) return null

  const votes = new Map()
  for (const pick of picks) votes.set(pick, (votes.get(pick) ?? 0) + 1)

  const ranked = FOCUSES.map((focus, order) => ({ focus, order, votes: votes.get(focus.id) ?? 0 }))
    .filter((entry) => entry.votes > 0)
    .sort(
      (a, b) =>
        b.votes - a.votes || focusBase(b.focus, answers) - focusBase(a.focus, answers) || a.order - b.order,
    )

  return ranked[0]?.focus ?? null
}

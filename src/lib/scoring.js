import { AREAS } from '../data/areas.js'
import { QUESTIONS, SCALE } from '../data/questions.js'

/**
 * El puntaje vive aquí y no en el store porque ya no lo calcula sólo el
 * navegador: la función de `/api/detonadoras` necesita saber qué áreas
 * empataron arriba para elegir los enfoques candidatos, y dos copias del
 * mismo cálculo terminarían por discrepar en un empate.
 *
 * Las extensiones `.js` explícitas no son estilo: este módulo lo importa
 * también Node en la función de Vercel, que no resuelve rutas sin extensión.
 */
export const QUESTIONS_PER_AREA = QUESTIONS.length / AREAS.length
const MAX_SCORE_PER_AREA = QUESTIONS_PER_AREA * 5
const VALID_VALUES = new Set(SCALE.map((step) => step.value))
const QUESTION_IDS = new Set(QUESTIONS.map((question) => question.id))

/**
 * Una respuesta es válida si su pregunta existe en el banco y su valor está en
 * la escala. Lo comprueban el store al rehidratar `localStorage` y el servidor
 * al recibir el cuerpo: las dos son entradas que escribe alguien más.
 */
export function isValidAnswer(id, value) {
  return QUESTION_IDS.has(id) && VALID_VALUES.has(value)
}

/** Puntaje por área normalizado a porcentaje (0-100) de afinidad. */
export function computeResults(answers) {
  const totals = Object.fromEntries(AREAS.map((area) => [area.id, 0]))

  for (const question of QUESTIONS) {
    const value = answers[question.id]
    if (value) totals[question.areaId] += value
  }

  return AREAS.map((area) => ({
    areaId: area.id,
    score: totals[area.id],
    percentage: Math.round((totals[area.id] / MAX_SCORE_PER_AREA) * 100),
  })).sort((a, b) => b.percentage - a.percentage)
}

/**
 * El porcentaje mínimo posible: diez preguntas por área respondidas todas con
 * "Totalmente en desacuerdo". No es cero, y la pantalla de resultados lo dice
 * en voz alta en vez de dejar que el estudiante suponga una escala de 0 a 100.
 */
export const MIN_PERCENTAGE = Math.round((QUESTIONS_PER_AREA * 1) / MAX_SCORE_PER_AREA * 100)

/** El porcentaje que produce responder "Neutral" a las diez de un área. */
export const NEUTRAL_PERCENTAGE = Math.round((QUESTIONS_PER_AREA * 3) / MAX_SCORE_PER_AREA * 100)

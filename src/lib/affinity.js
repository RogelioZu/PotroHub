import { AREAS } from '../data/areas.js'
import { QUESTIONS, SCALE } from '../data/questions.js'

/*
 * Cálculo de afinidad, separado del store para poder probarlo sin React ni
 * `localStorage` (ver tests/affinity.test.js), y porque no lo usa sólo el
 * navegador: la función de `/api/detonadoras` necesita saber qué áreas
 * empataron arriba para elegir los enfoques candidatos, y dos copias del mismo
 * cálculo terminarían por discrepar en un empate. Las extensiones `.js`
 * explícitas no son estilo: Node no resuelve rutas sin extensión como Vite.
 *
 * La fórmula es la histórica y no cambia con el rediseño: cada respuesta
 * (1–5) suma sólo a su área, y el total se expresa como porcentaje del
 * máximo posible. Con diez preguntas por área el máximo es 50 puntos, así
 * que una sesión completa va de 20% (todo "Totalmente en desacuerdo") a 100%,
 * y diez respuestas "Neutral" dan 60%.
 *
 * Supone el mismo número de preguntas por área. Si el banco cambia esa
 * distribución, el denominador debe calcularse por área.
 */

const VALID_VALUES = new Set(SCALE.map((step) => step.value))
const QUESTION_IDS = new Set(QUESTIONS.map((question) => question.id))
const NEUTRAL_VALUE = 3
const QUESTIONS_PER_AREA = QUESTIONS.length / AREAS.length
const MAX_SCORE_PER_AREA = QUESTIONS_PER_AREA * Math.max(...VALID_VALUES)

/**
 * Una respuesta es válida si su pregunta existe en el banco y su valor está en
 * la escala. Lo comprueban el store al rehidratar `localStorage` y la función
 * de `/api/detonadoras` al recibir el cuerpo: las dos son entradas que escribe
 * alguien más.
 */
export function isValidAnswer(id, value) {
  return QUESTION_IDS.has(id) && VALID_VALUES.has(value)
}

const toPercentage = (score) => Math.round((score / MAX_SCORE_PER_AREA) * 100)

/** Piso de la escala con el cuestionario completo: no es 0%. */
export const MIN_PERCENTAGE = toPercentage(QUESTIONS_PER_AREA * Math.min(...VALID_VALUES))

/** El punto medio: diez respuestas "Neutral" en un área. */
export const NEUTRAL_PERCENTAGE = toPercentage(QUESTIONS_PER_AREA * NEUTRAL_VALUE)

export { QUESTIONS_PER_AREA, MAX_SCORE_PER_AREA }

/**
 * Afinidad por área, ordenada de mayor a menor. Los valores fuera de la
 * escala (un `localStorage` editado a mano, un banco anterior) no suman.
 *
 * El orden es estable: con empate, las áreas conservan el orden de `AREAS`.
 * Por eso ese orden nunca debe leerse como recomendación — ver
 * `summarizeAffinity`.
 */
export function computeAffinity(answers) {
  const totals = Object.fromEntries(AREAS.map((area) => [area.id, 0]))

  for (const question of QUESTIONS) {
    const value = answers?.[question.id]
    if (VALID_VALUES.has(value)) totals[question.areaId] += value
  }

  return AREAS.map((area) => ({
    areaId: area.id,
    score: totals[area.id],
    percentage: toPercentage(totals[area.id]),
  })).sort((a, b) => b.percentage - a.percentage)
}

/**
 * Lo que la pantalla de resultados puede afirmar con honestidad.
 *
 * - `tied`: todas las áreas que comparten el porcentaje más alto. Si hay más
 *   de una, no hay ganador: la primera versión anunciaba "Inteligencia
 *   Artificial" sólo porque iba primero en el arreglo.
 * - `allNeutral`: todas las respuestas fueron "Neutral". El empate total al
 *   60% no es un perfil equilibrado; es la ausencia de una preferencia.
 */
export function summarizeAffinity(results, answers) {
  const top = results[0]
  const tied = results.filter((result) => result.percentage === top.percentage)
  const values = Object.values(answers ?? {})
  const allNeutral = values.length > 0 && values.every((value) => value === NEUTRAL_VALUE)

  return { top, tied, isTie: tied.length > 1, allNeutral }
}

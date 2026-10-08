import assert from 'node:assert/strict'
import test from 'node:test'
import { AREAS } from '../src/data/areas.js'
import { QUESTIONS } from '../src/data/questions.js'
import {
  computeAffinity,
  MIN_PERCENTAGE,
  NEUTRAL_PERCENTAGE,
  summarizeAffinity,
} from '../src/lib/affinity.js'

/** Respuestas para las 50 preguntas: un valor fijo o uno calculado por pregunta. */
const answersWith = (value) =>
  Object.fromEntries(
    QUESTIONS.map((question) => [question.id, typeof value === 'function' ? value(question) : value]),
  )

const byArea = (results, areaId) => results.find((result) => result.areaId === areaId)

test('el banco conserva 50 preguntas únicas, diez por área', () => {
  assert.equal(QUESTIONS.length, 50)
  assert.equal(new Set(QUESTIONS.map((question) => question.id)).size, 50)
  for (const area of AREAS) {
    assert.equal(QUESTIONS.filter((question) => question.areaId === area.id).length, 10, area.id)
  }
})

test('la escala de una sesión completa va de 20% a 100%', () => {
  assert.equal(MIN_PERCENTAGE, 20)
  assert.ok(computeAffinity(answersWith(1)).every((result) => result.percentage === 20))
  assert.ok(computeAffinity(answersWith(5)).every((result) => result.percentage === 100))
})

test('responder Neutral a todo es un empate total al 60%, no un ganador', () => {
  const answers = answersWith(3)
  const results = computeAffinity(answers)
  const summary = summarizeAffinity(results, answers)

  assert.equal(NEUTRAL_PERCENTAGE, 60)
  assert.ok(results.every((result) => result.score === 30 && result.percentage === 60))
  assert.equal(summary.tied.length, 5)
  assert.equal(summary.isTie, true)
  assert.equal(summary.allNeutral, true)
})

test('una preferencia única gana sin normalizar a las demás áreas', () => {
  const answers = answersWith((question) => (question.areaId === 'software' ? 5 : 2))
  const results = computeAffinity(answers)
  const summary = summarizeAffinity(results, answers)

  assert.equal(results[0].areaId, 'software')
  assert.equal(results[0].percentage, 100)
  assert.ok(results.slice(1).every((result) => result.percentage === 40))
  assert.equal(summary.isTie, false)
  assert.equal(summary.allNeutral, false)
})

test('un empate parcial reconoce a todas las áreas que comparten el primer lugar', () => {
  const answers = answersWith((question) => (['ia', 'software'].includes(question.areaId) ? 4 : 2))
  const summary = summarizeAffinity(computeAffinity(answers), answers)

  assert.deepEqual(new Set(summary.tied.map((result) => result.areaId)), new Set(['ia', 'software']))
  assert.equal(summary.top.percentage, 80)
})

test('los valores fuera de la escala y los ids desconocidos no suman', () => {
  const answers = answersWith(4)
  answers['ia-1'] = 99
  answers['ia-2'] = '5'
  answers['area-inexistente-1'] = 500

  // Ocho respuestas válidas de 4 en IA: 32 puntos de 50.
  assert.equal(byArea(computeAffinity(answers), 'ia').score, 32)
  assert.equal(byArea(computeAffinity(answers), 'ia').percentage, 64)
})

test('una sesión incompleta puede quedar debajo del piso, por eso Resultados exige las 50', () => {
  const partial = { 'ia-1': 5 }
  assert.equal(byArea(computeAffinity(partial), 'ia').percentage, 10)
  assert.equal(byArea(computeAffinity({}), 'nube').percentage, 0)
})

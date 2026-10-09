import assert from 'node:assert/strict'
import test from 'node:test'
import { AREAS } from '../src/data/areas.js'
import { FALLBACK_TRIGGERS } from '../src/data/fallbackTriggers.js'
import { FOCUS_BY_ID, FOCUSES } from '../src/data/focuses.js'
import { QUESTIONS } from '../src/data/questions.js'
import {
  candidateFocuses,
  eligibleFocusIds,
  fallbackTriggers,
  focusBase,
  MAX_CANDIDATES,
  MAX_OPTION_LENGTH,
  MAX_PROMPT_LENGTH,
  pickFocus,
  validateTriggerSet,
} from '../src/lib/refine.js'

/**
 * Respuestas para las 50 preguntas: un valor por área (2 si no se dice) y,
 * encima, valores sueltos por id de pregunta.
 */
const answersWith = (byArea, byId = {}) =>
  Object.fromEntries(
    QUESTIONS.map((question) => [question.id, byId[question.id] ?? byArea[question.areaId] ?? 2]),
  )

const focusIdsOf = (areaId) => FOCUSES.filter((focus) => focus.areaId === areaId).map((focus) => focus.id)

/** Unas detonadoras válidas para IA, con la forma que devuelve Qwen. */
const validIaSet = () => [
  {
    prompt: '  ¿Qué construirías este fin de semana?  ',
    options: [
      { text: 'Un asistente que lea documentos.', focusId: 'ia-lenguaje' },
      { text: 'Un contador de personas con cámara.', focusId: 'ia-vision' },
      { text: 'Un modelo que se reentrena solo.', focusId: 'ia-modelado' },
    ],
  },
  {
    prompt: '¿Qué falla prefieres investigar?',
    options: [
      { text: 'Respuestas inventadas de un chatbot.', focusId: 'ia-lenguaje' },
      { text: 'Detecciones falsas con poca luz.', focusId: 'ia-vision' },
      { text: 'Un modelo que se degrada con el tiempo.', focusId: 'ia-modelado' },
    ],
  },
]

test('el catálogo tiene tres enfoques por área, con ids únicos y señales del banco de su área', () => {
  assert.equal(new Set(FOCUSES.map((focus) => focus.id)).size, FOCUSES.length)
  const questionArea = Object.fromEntries(QUESTIONS.map((question) => [question.id, question.areaId]))

  for (const area of AREAS) assert.equal(focusIdsOf(area.id).length, 3, area.id)
  for (const focus of FOCUSES) {
    assert.ok(focus.signals.length > 0, focus.id)
    for (const signal of focus.signals) assert.equal(questionArea[signal], focus.areaId, `${focus.id} → ${signal}`)
    // "Tu primer paso" muestra la primera habilidad y enumera las demás.
    assert.ok(focus.skills.length >= 2, focus.id)
    assert.ok(focus.firstStep.length > 0, focus.id)
  }
})

test('las detonadoras de respaldo de cada área enfrentan sus tres enfoques y pasan la validación', () => {
  for (const area of AREAS) {
    const set = FALLBACK_TRIGGERS[area.id]
    assert.ok(validateTriggerSet(set, focusIdsOf(area.id)), area.id)
    for (const question of set) {
      assert.deepEqual(question.options.map((option) => option.focusId).sort(), focusIdsOf(area.id).sort())
    }
  }
})

test('sin empate, los candidatos son los tres enfoques del área ganadora en orden de catálogo', () => {
  const answers = answersWith({ ia: 5 })
  assert.deepEqual(
    candidateFocuses(answers).map((focus) => focus.id),
    focusIdsOf('ia'),
  )
  assert.deepEqual(eligibleFocusIds(answers), focusIdsOf('ia'))
})

test('en un empate de dos áreas entran los seis enfoques de ambas', () => {
  const answers = answersWith({ ia: 5, nube: 5 })
  assert.deepEqual(
    candidateFocuses(answers).map((focus) => focus.id),
    [...focusIdsOf('ia'), ...focusIdsOf('nube')],
  )
})

test('en un empate de tres áreas el recorte a seis se queda con la base más alta, no con las primeras áreas', () => {
  // Tres áreas empatadas a 40 puntos. En Software, el enfoque de calidad
  // (software-2, -6, -10) recibe 5 y el resto compensa; IA y Cloud van
  // parejas a 4. Software es la última área del catálogo: si el recorte fuera
  // por orden, su enfoque más fuerte quedaría fuera.
  const answers = answersWith(
    { ia: 4, nube: 4, software: 4 },
    {
      'software-2': 5, 'software-6': 5, 'software-10': 5,
      'software-7': 3, 'software-8': 3, 'software-9': 3,
    },
  )
  const strongest = FOCUSES.find((focus) => focus.signals.join() === 'software-2,software-6,software-10')
  const candidates = candidateFocuses(answers)
  const ids = candidates.map((focus) => focus.id)

  assert.equal(candidates.length, MAX_CANDIDATES)
  assert.ok(ids.includes(strongest.id))
  assert.equal(eligibleFocusIds(answers).length, 9)
  // Se devuelven en orden de catálogo, que es el último criterio de desempate.
  const order = ids.map((id) => FOCUSES.findIndex((focus) => focus.id === id))
  assert.deepEqual(order, [...order].sort((a, b) => a - b))
  // Nada de lo que quedó fuera tiene más base que lo que entró.
  const minIn = Math.min(...candidates.map((focus) => focus.base))
  for (const focus of FOCUSES.filter((f) => eligibleFocusIds(answers).includes(f.id) && !ids.includes(f.id))) {
    assert.ok(focusBase(focus, answers) <= minIn, focus.id)
  }
})

test('el respaldo da las dos preguntas del área, o una de cada área en un empate', () => {
  assert.deepEqual(fallbackTriggers(answersWith({ ciberseguridad: 5 })), FALLBACK_TRIGGERS.ciberseguridad)

  const tie = fallbackTriggers(answersWith({ ia: 5, nube: 5 }))
  assert.deepEqual(tie, [FALLBACK_TRIGGERS.ia[0], FALLBACK_TRIGGERS.nube[0]])
})

test('validateTriggerSet devuelve una copia limpia de unas detonadoras válidas', () => {
  const clean = validateTriggerSet(validIaSet(), focusIdsOf('ia'))
  assert.equal(clean.length, 2)
  assert.equal(clean[0].prompt, '¿Qué construirías este fin de semana?')
  assert.deepEqual(Object.keys(clean[0].options[0]), ['text', 'focusId'])
})

test('validateTriggerSet rechaza cualquier forma que la interfaz no sepa pintar', () => {
  const allowed = focusIdsOf('ia')
  const broken = {
    'no es arreglo': () => ({ questions: [] }),
    'una sola pregunta': (set) => set.slice(0, 1),
    'tres preguntas': (set) => [...set, set[0]],
    'dos opciones': (set) => [{ ...set[0], options: set[0].options.slice(0, 2) }, set[1]],
    'enfoque ajeno': (set) => {
      set[0].options[0].focusId = 'nube-devops'
      return set
    },
    'enfoque repetido en una pregunta': (set) => {
      set[1].options[2].focusId = 'ia-lenguaje'
      return set
    },
    'enunciado vacío': (set) => {
      set[0].prompt = '   '
      return set
    },
    'enunciado demasiado largo': (set) => {
      set[0].prompt = 'a'.repeat(MAX_PROMPT_LENGTH + 1)
      return set
    },
    'opción demasiado larga': (set) => {
      set[1].options[0].text = 'a'.repeat(MAX_OPTION_LENGTH + 1)
      return set
    },
    'opción que no es texto': (set) => {
      set[1].options[1].text = 42
      return set
    },
  }

  for (const [name, breakIt] of Object.entries(broken)) {
    assert.equal(validateTriggerSet(breakIt(validIaSet()), allowed), null, name)
  }
})

test('pickFocus no decide nada hasta tener las dos respuestas', () => {
  const answers = answersWith({ ia: 5 })
  assert.equal(pickFocus(null, answers), null)
  assert.equal(pickFocus([null, null], answers), null)
  assert.equal(pickFocus(['ia-lenguaje', null], answers), null)
  assert.equal(pickFocus(['ia-lenguaje'], answers), null)
})

test('pickFocus: dos votos ganan; repartidas, desempata la base y luego el catálogo', () => {
  // Lenguaje (ia-1, ia-9) en 5 y visión (ia-3, ia-4) en 3.
  const leansLanguage = answersWith({ ia: 4 }, { 'ia-1': 5, 'ia-9': 5, 'ia-3': 3, 'ia-4': 3 })
  // Al revés.
  const leansVision = answersWith({ ia: 4 }, { 'ia-1': 3, 'ia-9': 3, 'ia-3': 5, 'ia-4': 5 })
  const even = answersWith({ ia: 4 })

  assert.equal(pickFocus(['ia-vision', 'ia-vision'], leansLanguage).id, 'ia-vision')
  assert.equal(pickFocus(['ia-vision', 'ia-lenguaje'], leansLanguage).id, 'ia-lenguaje')
  assert.equal(pickFocus(['ia-lenguaje', 'ia-vision'], leansVision).id, 'ia-vision')
  // Con la base igual, gana el que va antes en el catálogo, sin importar el orden de las respuestas.
  assert.equal(pickFocus(['ia-vision', 'ia-lenguaje'], even).id, 'ia-lenguaje')
  assert.equal(pickFocus(['ia-lenguaje', 'ia-vision'], even).id, 'ia-lenguaje')
  assert.equal(pickFocus(['ia-lenguaje', 'ia-vision'], even), FOCUS_BY_ID['ia-lenguaje'])
})

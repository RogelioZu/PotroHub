import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { QUESTIONS, SCALE } from '../data/questions.js'
import { computeAffinity } from '../lib/affinity.js'

export { MIN_PERCENTAGE, NEUTRAL_PERCENTAGE } from '../lib/affinity.js'

const VALID_VALUES = new Set(SCALE.map((step) => step.value))
const QUESTION_IDS = new Set(QUESTIONS.map((question) => question.id))

/**
 * El estado guardado viene de `localStorage`, que es escritura de terceros:
 * otra pestaña, una versión anterior del banco de preguntas, o simplemente un
 * usuario curioso con la consola abierta. Sin esta guarda, un `currentIndex`
 * fuera de rango hacía que `QUESTIONS[currentIndex]` fuera `undefined` y
 * `question.prompt` lanzara en el primer render de `/quiz`: pantalla en blanco
 * y ocho minutos de trabajo perdidos, sin nada que lo explique.
 *
 * Se sanea al rehidratar y no al leer, para que el resto del store pueda dar
 * por hecho que su estado es válido.
 */
function sanitize(state) {
  const answers = {}
  for (const [id, value] of Object.entries(state?.answers ?? {})) {
    if (QUESTION_IDS.has(id) && VALID_VALUES.has(value)) answers[id] = value
  }

  const index = Number(state?.currentIndex)
  const currentIndex = Number.isInteger(index)
    ? Math.min(Math.max(index, 0), QUESTIONS.length - 1)
    : 0

  return { answers, currentIndex }
}

/** La primera pregunta sin responder, o la última si ya están todas. */
function firstUnanswered(answers) {
  const index = QUESTIONS.findIndex((question) => !(question.id in answers))
  return index === -1 ? QUESTIONS.length - 1 : index
}

export const useQuizStore = create(
  persist(
    (set, get) => ({
      currentIndex: 0,
      answers: {},

      answerCurrent(value) {
        const question = QUESTIONS[get().currentIndex]
        // La misma guarda que al rehidratar: un valor fuera de la escala no
        // entra al estado aunque llegue por un atajo de teclado.
        if (!question || !VALID_VALUES.has(value)) return
        set((state) => ({
          answers: { ...state.answers, [question.id]: value },
        }))
      },

      goNext() {
        set((state) => ({
          currentIndex: Math.min(state.currentIndex + 1, QUESTIONS.length - 1),
        }))
      },

      goPrevious() {
        set((state) => ({
          currentIndex: Math.max(state.currentIndex - 1, 0),
        }))
      },

      /**
       * Al llegar a la última pregunta con alguna pendiente (porque se
       * retrocedió o se saneó una sesión vieja), esto lleva directo a la
       * primera que falta en vez de obligar a buscarla con "Anterior".
       */
      goToFirstUnanswered() {
        set((state) => ({ currentIndex: firstUnanswered(state.answers) }))
      },

      /** Afinidad por área: porcentaje del máximo, escala 20–100 con la sesión completa. */
      computeResults() {
        return computeAffinity(get().answers)
      },

      reset() {
        set({ currentIndex: 0, answers: {} })
      },
    }),
    {
      name: 'potropath-quiz',
      merge: (persisted, current) => ({ ...current, ...sanitize(persisted) }),
    },
  ),
)

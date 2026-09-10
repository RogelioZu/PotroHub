import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { AREAS } from '../data/areas'
import { QUESTIONS, SCALE } from '../data/questions'

const QUESTIONS_PER_AREA = QUESTIONS.length / AREAS.length
const MAX_SCORE_PER_AREA = QUESTIONS_PER_AREA * 5
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

export const useQuizStore = create(
  persist(
    (set, get) => ({
      currentIndex: 0,
      answers: {},

      answerCurrent(value) {
        const question = QUESTIONS[get().currentIndex]
        if (!question) return
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

      /** Puntaje por área normalizado a porcentaje (0-100) de afinidad. */
      computeResults() {
        const { answers } = get()
        const totals = Object.fromEntries(AREAS.map((area) => [area.id, 0]))

        for (const question of QUESTIONS) {
          const value = answers[question.id]
          if (value) totals[question.areaId] += value
        }

        const scores = AREAS.map((area) => ({
          areaId: area.id,
          score: totals[area.id],
          percentage: Math.round((totals[area.id] / MAX_SCORE_PER_AREA) * 100),
        })).sort((a, b) => b.percentage - a.percentage)

        return scores
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

/**
 * El porcentaje mínimo posible: diez preguntas por área respondidas todas con
 * "Totalmente en desacuerdo". No es cero, y la pantalla de resultados lo dice
 * en voz alta en vez de dejar que el estudiante suponga una escala de 0 a 100.
 */
export const MIN_PERCENTAGE = Math.round((QUESTIONS_PER_AREA * 1) / MAX_SCORE_PER_AREA * 100)

/** El porcentaje que produce responder "Neutral" a las diez de un área. */
export const NEUTRAL_PERCENTAGE = Math.round((QUESTIONS_PER_AREA * 3) / MAX_SCORE_PER_AREA * 100)

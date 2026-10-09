import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { QUESTIONS } from '../data/questions'
import { eligibleFocusIds, fallbackTriggers, SOURCES, validateTriggerSet } from '../lib/refine'
import { computeResults, isValidAnswer } from '../lib/scoring'

export { MIN_PERCENTAGE, NEUTRAL_PERCENTAGE } from '../lib/scoring'

/**
 * Cuánto se espera a Qwen antes de usar las detonadoras de respaldo (ms). La
 * función del servidor corta a los 7 s; este segundo de más es para que su
 * error llegue antes que el del navegador y no se pague dos veces la espera.
 */
const REFINE_TIMEOUT = 8000

/**
 * Las detonadoras guardadas se revisan igual que las de Qwen: `localStorage`
 * es tan ajeno como la respuesta de un modelo. Si las respuestas cambiaron y
 * los enfoques en juego ya no son los mismos, se descartan — fueron escritas
 * para otro estudiante.
 */
function sanitizeRefinement(refinement, answers) {
  if (!refinement || Object.keys(answers).length < QUESTIONS.length) return null
  if (!SOURCES.has(refinement.source)) return null

  const questions = validateTriggerSet(refinement.questions, eligibleFocusIds(answers))
  if (!questions) return null

  const picks = questions.map((question, index) => {
    const pick = refinement.picks?.[index]
    return question.options.some((option) => option.focusId === pick) ? pick : null
  })

  return { source: refinement.source, questions, picks }
}

/**
 * El estado guardado viene de `localStorage`, que es escritura de terceros:
 * otra pestaña, una versión anterior del banco de preguntas, o simplemente un
 * usuario curioso con la consola abierta. Sin esta guarda, un `currentIndex`
 * fuera de rango hacía que `QUESTIONS[currentIndex]` fuera `undefined` y
 * `question.prompt` lanzara en el primer render de `/quiz`: pantalla en blanco
 * y ocho minutos de trabajo perdidos, sin nada que lo explique.
 *
 * Se sanea al rehidratar y no al leer, para que el resto del store pueda dar
 * por hecho que su estado es válido. Por eso añadir `refinement` no obligó a
 * subir la `version` del persist: un estado guardado antes de que existiera
 * simplemente no lo trae, y aquí eso ya significa `null`.
 */
function sanitize(state) {
  const answers = {}
  for (const [id, value] of Object.entries(state?.answers ?? {})) {
    if (isValidAnswer(id, value)) answers[id] = value
  }

  const index = Number(state?.currentIndex)
  const currentIndex = Number.isInteger(index)
    ? Math.min(Math.max(index, 0), QUESTIONS.length - 1)
    : 0

  return { answers, currentIndex, refinement: sanitizeRefinement(state?.refinement, answers) }
}

export const useQuizStore = create(
  persist(
    (set, get) => ({
      currentIndex: 0,
      answers: {},
      /** `{ source, questions, picks }` de las dos detonadoras, o `null`. */
      refinement: null,
      /** Sólo en memoria: una espera no sobrevive a cerrar la pestaña. */
      refining: false,

      answerCurrent(value) {
        const question = QUESTIONS[get().currentIndex]
        if (!question) return
        set((state) => ({
          answers: { ...state.answers, [question.id]: value },
          // Volver al cuestionario y cambiar una respuesta cambia lo que las
          // detonadoras leyeron. Repetir la misma no las invalida.
          refinement: state.answers[question.id] === value ? state.refinement : null,
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
        return computeResults(get().answers)
      },

      /**
       * Pide las dos detonadoras. Sólo la dispara el botón "Afinar mi ruta":
       * el aviso de qué se envía y a quién tiene que leerse antes, no después.
       *
       * Nunca falla hacia el estudiante. Un error, una respuesta que no pasa la
       * validación o los 8 s sin respuesta terminan igual: en las detonadoras
       * de respaldo, marcadas como tales.
       */
      async requestRefinement() {
        if (get().refining) return
        const { answers } = get()
        set({ refining: true })

        let questions = null
        try {
          const response = await fetch('/api/detonadoras', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ answers }),
            signal: AbortSignal.timeout(REFINE_TIMEOUT),
          })
          if (response.ok) {
            const data = await response.json()
            questions = validateTriggerSet(data?.questions, eligibleFocusIds(answers))
          }
        } catch {
          // Red caída o tiempo agotado: el respaldo de abajo ya cubre los dos.
        }

        // Si mientras esperaba se reinició el diagnóstico o cambió una
        // respuesta, estas preguntas ya no le corresponden a nadie.
        if (get().answers !== answers) {
          set({ refining: false })
          return
        }

        set({
          refining: false,
          refinement: questions
            ? { source: 'ia', questions, picks: [null, null] }
            : { source: 'respaldo', questions: fallbackTriggers(answers), picks: [null, null] },
        })
      },

      pickOption(questionIndex, focusId) {
        set((state) => {
          if (!state.refinement) return {}
          const picks = [...state.refinement.picks]
          picks[questionIndex] = focusId
          return { refinement: { ...state.refinement, picks } }
        })
      },

      reset() {
        set({ currentIndex: 0, answers: {}, refinement: null })
      },
    }),
    {
      name: 'potropath-quiz',
      partialize: ({ currentIndex, answers, refinement }) => ({ currentIndex, answers, refinement }),
      merge: (persisted, current) => ({ ...current, ...sanitize(persisted) }),
    },
  ),
)

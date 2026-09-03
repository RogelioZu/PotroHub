import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { AREAS } from '../data/areas'
import { QUESTIONS } from '../data/questions'

const QUESTIONS_PER_AREA = QUESTIONS.length / AREAS.length
const MAX_SCORE_PER_AREA = QUESTIONS_PER_AREA * 5

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

      isComplete() {
        return Object.keys(get().answers).length === QUESTIONS.length
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
    { name: 'potropath-quiz' },
  ),
)

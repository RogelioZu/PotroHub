import { useNavigate } from 'react-router-dom'
import { AREA_BY_ID } from '../data/areas'
import { QUESTIONS, SCALE } from '../data/questions'
import { useQuizStore } from '../store/quizStore'

function Quiz() {
  const navigate = useNavigate()
  const currentIndex = useQuizStore((state) => state.currentIndex)
  const answers = useQuizStore((state) => state.answers)
  const answerCurrent = useQuizStore((state) => state.answerCurrent)
  const goNext = useQuizStore((state) => state.goNext)
  const goPrevious = useQuizStore((state) => state.goPrevious)

  const question = QUESTIONS[currentIndex]
  const area = AREA_BY_ID[question.areaId]
  const selectedValue = answers[question.id]
  const isLast = currentIndex === QUESTIONS.length - 1
  const progress = Math.round(((currentIndex + 1) / QUESTIONS.length) * 100)

  const handleFinish = () => {
    navigate('/resultados')
  }

  return (
    <section className="mx-auto max-w-2xl px-6 py-16">
      <div className="mb-8">
        <div className="flex items-center justify-between text-xs text-ink-soft">
          <span>
            Pregunta {currentIndex + 1} de {QUESTIONS.length}
          </span>
          <span className="font-semibold text-gold-dark">{area.name}</span>
        </div>
        <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-paper-alt">
          <div
            className="h-full rounded-full bg-green-mid transition-all"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <h1 className="text-2xl font-bold text-ink">{question.prompt}</h1>

      <div className="mt-8 flex flex-col gap-2">
        {SCALE.map(({ value, label }) => (
          <button
            key={value}
            type="button"
            onClick={() => answerCurrent(value)}
            className={`rounded-xl border px-4 py-3 text-left text-sm transition-colors ${
              selectedValue === value
                ? 'border-gold bg-green-soft text-ink'
                : 'border-ink/10 text-ink-soft hover:border-gold/50'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="mt-10 flex justify-between">
        <button
          type="button"
          onClick={goPrevious}
          disabled={currentIndex === 0}
          className="rounded-full px-5 py-2 text-sm text-ink-soft disabled:opacity-30"
        >
          Anterior
        </button>
        {isLast ? (
          <button
            type="button"
            onClick={handleFinish}
            disabled={!selectedValue}
            className="rounded-full bg-gold px-6 py-2 text-sm font-semibold text-ink disabled:opacity-30"
          >
            Ver resultados
          </button>
        ) : (
          <button
            type="button"
            onClick={goNext}
            disabled={!selectedValue}
            className="rounded-full bg-green-mid px-6 py-2 text-sm font-semibold text-paper disabled:opacity-30"
          >
            Siguiente
          </button>
        )}
      </div>
    </section>
  )
}

export default Quiz

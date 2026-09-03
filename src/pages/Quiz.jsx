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
        <div className="flex items-center justify-between text-xs text-potro-white-soft">
          <span>
            Pregunta {currentIndex + 1} de {QUESTIONS.length}
          </span>
          <span className="text-potro-gold-light">{area.name}</span>
        </div>
        <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-potro-black-soft">
          <div
            className="h-full rounded-full bg-potro-green transition-all"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <h1 className="font-display text-2xl text-potro-white">{question.prompt}</h1>

      <div className="mt-8 flex flex-col gap-2">
        {SCALE.map(({ value, label }) => (
          <button
            key={value}
            type="button"
            onClick={() => answerCurrent(value)}
            className={`rounded-xl border px-4 py-3 text-left text-sm transition-colors ${
              selectedValue === value
                ? 'border-potro-gold bg-potro-green/20 text-potro-white'
                : 'border-potro-gold/15 text-potro-white-soft hover:border-potro-gold/40'
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
          className="rounded-full px-5 py-2 text-sm text-potro-white-soft disabled:opacity-30"
        >
          Anterior
        </button>
        {isLast ? (
          <button
            type="button"
            onClick={handleFinish}
            disabled={!selectedValue}
            className="rounded-full bg-potro-gold px-6 py-2 text-sm font-medium text-potro-black disabled:opacity-30"
          >
            Ver resultados
          </button>
        ) : (
          <button
            type="button"
            onClick={goNext}
            disabled={!selectedValue}
            className="rounded-full bg-potro-green px-6 py-2 text-sm font-medium text-potro-white disabled:opacity-30"
          >
            Siguiente
          </button>
        )}
      </div>
    </section>
  )
}

export default Quiz

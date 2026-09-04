import { Link, useNavigate } from 'react-router-dom'
import { AREA_BY_ID } from '../data/areas'
import { QUESTIONS } from '../data/questions'
import { ROADMAP } from '../data/roadmap'
import { useQuizStore } from '../store/quizStore'

function EmptyState() {
  return (
    <section className="mx-auto flex max-w-2xl flex-col items-center gap-4 px-6 py-24 text-center">
      <h1 className="text-3xl font-bold text-ink">Aún no tienes resultados</h1>
      <p className="text-ink-soft">
        Responde el diagnóstico de 50 preguntas para descubrir tu ruta de crecimiento dentro de la
        Ingeniería en Computación.
      </p>
      <Link
        to="/quiz"
        className="rounded-full bg-green-mid px-6 py-3 font-semibold text-paper hover:bg-green"
      >
        Ir al diagnóstico
      </Link>
    </section>
  )
}

function Results() {
  const navigate = useNavigate()
  const answers = useQuizStore((state) => state.answers)
  const computeResults = useQuizStore((state) => state.computeResults)
  const reset = useQuizStore((state) => state.reset)

  const answeredCount = Object.keys(answers).length
  if (answeredCount < QUESTIONS.length) {
    return <EmptyState />
  }

  const results = computeResults()
  const [top, ...rest] = results
  const topArea = AREA_BY_ID[top.areaId]
  const topRoadmap = ROADMAP[top.areaId]

  const handleRetake = () => {
    reset()
    navigate('/quiz')
  }

  return (
    <section className="mx-auto max-w-4xl px-6 py-16">
      <p className="text-sm font-semibold tracking-widest text-gold-dark uppercase">Tu resultado</p>
      <h1 className="mt-2 text-4xl font-bold text-ink">
        Tu mayor afinidad es <span className="text-gradient-gold">{topArea.name}</span>
      </h1>
      <p className="mt-3 text-ink-soft">{topArea.description}</p>

      <div className="mt-10 flex flex-col gap-3">
        {[top, ...rest].map(({ areaId, percentage }) => (
          <div key={areaId}>
            <div className="mb-1 flex justify-between text-sm">
              <span className="font-medium text-ink">{AREA_BY_ID[areaId].name}</span>
              <span className="text-ink-soft">{percentage}%</span>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-paper-alt">
              <div className="h-full rounded-full bg-gold" style={{ width: `${percentage}%` }} />
            </div>
          </div>
        ))}
      </div>

      <div className="mt-12 grid gap-6 sm:grid-cols-2">
        <div className="rounded-xl bg-paper-alt p-5">
          <h2 className="text-lg font-bold text-green-mid">Habilidades demandadas</h2>
          <ul className="mt-3 space-y-1 text-sm text-ink-soft">
            {topRoadmap.skills.map((skill) => (
              <li key={skill}>· {skill}</li>
            ))}
          </ul>
        </div>
        <div className="rounded-xl bg-paper-alt p-5">
          <h2 className="text-lg font-bold text-green-mid">Certificaciones clave</h2>
          <ul className="mt-3 space-y-1 text-sm text-ink-soft">
            {topRoadmap.certifications.map((cert) => (
              <li key={cert}>· {cert}</li>
            ))}
          </ul>
        </div>
      </div>

      <div className="mt-12 flex flex-wrap gap-4">
        <Link
          to="/comunidad"
          className="rounded-full bg-green-mid px-6 py-3 font-semibold text-paper hover:bg-green"
        >
          Unirme a la comunidad
        </Link>
        <button
          type="button"
          onClick={handleRetake}
          className="rounded-full border border-gold/50 px-6 py-3 font-semibold text-ink-soft hover:border-gold hover:text-gold-dark"
        >
          Repetir diagnóstico
        </button>
      </div>
    </section>
  )
}

export default Results

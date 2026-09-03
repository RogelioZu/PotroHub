import { Link, useNavigate } from 'react-router-dom'
import { AREA_BY_ID } from '../data/areas'
import { QUESTIONS } from '../data/questions'
import { ROADMAP } from '../data/roadmap'
import { useQuizStore } from '../store/quizStore'

function EmptyState() {
  return (
    <section className="mx-auto flex max-w-2xl flex-col items-center gap-4 px-6 py-24 text-center">
      <h1 className="font-display text-3xl text-potro-white">Aún no tienes resultados</h1>
      <p className="text-potro-white-soft">
        Responde el diagnóstico de 50 preguntas para descubrir tu ruta de crecimiento dentro de la
        Ingeniería en Computación.
      </p>
      <Link
        to="/quiz"
        className="rounded-full bg-potro-green px-6 py-3 font-medium text-potro-white hover:bg-potro-green-light"
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
      <p className="text-sm tracking-widest text-potro-gold-light uppercase">Tu resultado</p>
      <h1 className="mt-2 font-display text-4xl text-potro-white">
        Tu mayor afinidad es <span className="text-gradient-gold">{topArea.name}</span>
      </h1>
      <p className="mt-3 text-potro-white-soft">{topArea.description}</p>

      <div className="mt-10 flex flex-col gap-3">
        {[top, ...rest].map(({ areaId, percentage }) => (
          <div key={areaId}>
            <div className="mb-1 flex justify-between text-sm">
              <span className="text-potro-white">{AREA_BY_ID[areaId].name}</span>
              <span className="text-potro-white-soft">{percentage}%</span>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-potro-black-soft">
              <div
                className="h-full rounded-full bg-potro-gold"
                style={{ width: `${percentage}%` }}
              />
            </div>
          </div>
        ))}
      </div>

      <div className="mt-12 grid gap-6 sm:grid-cols-3">
        <div className="rounded-xl border border-potro-gold/15 p-5">
          <h2 className="font-display text-lg text-potro-gold-light">Habilidades demandadas</h2>
          <ul className="mt-3 space-y-1 text-sm text-potro-white-soft">
            {topRoadmap.skills.map((skill) => (
              <li key={skill}>· {skill}</li>
            ))}
          </ul>
        </div>
        <div className="rounded-xl border border-potro-gold/15 p-5">
          <h2 className="font-display text-lg text-potro-gold-light">Certificaciones clave</h2>
          <ul className="mt-3 space-y-1 text-sm text-potro-white-soft">
            {topRoadmap.certifications.map((cert) => (
              <li key={cert}>· {cert}</li>
            ))}
          </ul>
        </div>
        <div className="rounded-xl border border-potro-gold/15 p-5">
          <h2 className="font-display text-lg text-potro-gold-light">Materias relacionadas</h2>
          <ul className="mt-3 space-y-1 text-sm text-potro-white-soft">
            {topRoadmap.subjects.map((subject) => (
              <li key={subject}>· {subject}</li>
            ))}
          </ul>
        </div>
      </div>

      <div className="mt-12 flex flex-wrap gap-4">
        <Link
          to="/comunidad"
          className="rounded-full bg-potro-green px-6 py-3 font-medium text-potro-white hover:bg-potro-green-light"
        >
          Unirme a la comunidad
        </Link>
        <button
          type="button"
          onClick={handleRetake}
          className="rounded-full border border-potro-gold/40 px-6 py-3 font-medium text-potro-white-soft hover:border-potro-gold-light hover:text-potro-gold-light"
        >
          Repetir diagnóstico
        </button>
      </div>
    </section>
  )
}

export default Results

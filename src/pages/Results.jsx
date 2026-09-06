import { useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { AREA_BY_ID } from '../data/areas'
import { QUESTIONS } from '../data/questions'
import { ROADMAP } from '../data/roadmap'
import { gsap, useGSAP } from '../lib/gsap'
import { DUR, EASE, FULL_MOTION, STAGGER } from '../lib/motion'
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

/** Duración de una barra de afinidad llenándose. */
const BAR_FILL = 0.8

/**
 * La vista con resultados vive en su propio componente para que sus hooks
 * corran siempre: `Results` decide antes si hay algo que mostrar, y un hook
 * después de ese `return` rompería las reglas de hooks.
 */
function ResultsView({ results, onRetake }) {
  const root = useRef(null)
  const top = results[0]
  const topArea = AREA_BY_ID[top.areaId]
  const topRoadmap = ROADMAP[top.areaId]

  // El pago de 50 preguntas. Es la única secuencia larga del sitio: el nombre
  // del área ganadora recibe el barrido de luz y las cinco barras se llenan
  // con su porcentaje contando en sincronía.
  useGSAP(
    () => {
      const mm = gsap.matchMedia()

      mm.add(FULL_MOTION, () => {
        const bars = gsap.utils.toArray('[data-bar]', root.current)
        const labels = bars.map((bar) => bar.closest('[data-row]').querySelector('[data-pct]'))

        // Antes del primer pintado, para que ningún porcentaje se vea saltar
        // de su valor final a cero.
        labels.forEach((label) => {
          label.textContent = '0%'
        })

        const tl = gsap.timeline()

        tl.from('[data-eyebrow]', { opacity: 0, y: 12, duration: DUR.view, ease: EASE.enter })
          .from('[data-heading]', { opacity: 0, y: 16, duration: DUR.view, ease: EASE.enter }, '-=0.25')
          .fromTo(
            '[data-sweep]',
            { backgroundPosition: '100% 0' },
            { backgroundPosition: '0% 0', duration: DUR.sweep, ease: EASE.sweep },
            '-=0.3',
          )
          .from(
            '[data-description]',
            { opacity: 0, y: 14, duration: DUR.view, ease: EASE.enter },
            '-=0.75',
          )
          .addLabel('bars', '-=0.4')

        const step = STAGGER.bars.amount / Math.max(bars.length - 1, 1)

        bars.forEach((bar, i) => {
          const value = Number(bar.dataset.bar)
          const at = `bars+=${i * step}`
          const counter = { v: 0 }

          tl.fromTo(
            bar,
            { scaleX: 0 },
            { scaleX: value / 100, duration: BAR_FILL, ease: EASE.enter },
            at,
          ).to(
            counter,
            {
              v: value,
              duration: BAR_FILL,
              ease: EASE.enter,
              snap: { v: 1 },
              onUpdate: () => {
                labels[i].textContent = `${Math.round(counter.v)}%`
              },
            },
            at,
          )
        })

        tl.from(
          '[data-card]',
          { opacity: 0, y: 20, duration: DUR.view, ease: EASE.enter, stagger: STAGGER.tight },
          '-=0.35',
        )
          .from(
            '[data-cta] > *',
            { opacity: 0, y: 16, duration: DUR.view, ease: EASE.enter, stagger: STAGGER.tight },
            '-=0.3',
          )
          .from(
            '[data-mascot]',
            {
              opacity: 0,
              scale: 0.6,
              y: 14,
              transformOrigin: 'bottom center',
              duration: DUR.view,
              ease: EASE.land,
            },
            '-=0.5',
          )

        return () => {
          tl.kill()
          // React no vuelve a renderizar estos textos, así que se devuelven a
          // su valor real al desmontar.
          labels.forEach((label) => {
            label.textContent = `${label.dataset.value}%`
          })
        }
      })

      return () => mm.revert()
    },
    { scope: root },
  )

  return (
    <section ref={root} className="relative mx-auto max-w-4xl px-6 py-16">
      <img
        data-mascot
        src="/images/potro-mascota.png"
        alt=""
        aria-hidden="true"
        className="pointer-events-none absolute top-12 right-6 hidden h-24 w-auto rounded-xl bg-paper p-1.5 shadow-lg ring-1 ring-ink/10 md:block"
      />

      <p data-eyebrow className="text-sm font-semibold tracking-widest text-gold-dark uppercase">
        Tu resultado
      </p>
      <h1 data-heading className="mt-2 text-4xl font-bold text-ink">
        Tu mayor afinidad es{' '}
        <span data-sweep className="text-sweep-gold">
          {topArea.name}
        </span>
      </h1>
      <p data-description className="mt-3 text-ink-soft">
        {topArea.description}
      </p>

      <div className="mt-10 flex flex-col gap-3">
        {results.map(({ areaId, percentage }) => (
          <div key={areaId} data-row>
            <div className="mb-1 flex justify-between text-sm">
              <span className="font-medium text-ink">{AREA_BY_ID[areaId].name}</span>
              <span data-pct data-value={percentage} className="text-ink-soft">
                {percentage}%
              </span>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-paper-alt">
              <div
                data-bar={percentage}
                className="h-full w-full origin-left rounded-full bg-gold"
                style={{ transform: `scaleX(${percentage / 100})` }}
              />
            </div>
          </div>
        ))}
      </div>

      <div className="mt-12 grid gap-6 sm:grid-cols-2">
        <div data-card className="rounded-xl bg-paper-alt p-5">
          <h2 className="text-lg font-bold text-green-mid">Habilidades demandadas</h2>
          <ul className="mt-3 space-y-1 text-sm text-ink-soft">
            {topRoadmap.skills.map((skill) => (
              <li key={skill}>· {skill}</li>
            ))}
          </ul>
        </div>
        <div data-card className="rounded-xl bg-paper-alt p-5">
          <h2 className="text-lg font-bold text-green-mid">Certificaciones clave</h2>
          <ul className="mt-3 space-y-1 text-sm text-ink-soft">
            {topRoadmap.certifications.map((cert) => (
              <li key={cert}>· {cert}</li>
            ))}
          </ul>
        </div>
      </div>

      <div data-cta className="mt-12 flex flex-wrap gap-4">
        <Link
          to="/comunidad"
          className="rounded-full bg-green-mid px-6 py-3 font-semibold text-paper hover:bg-green"
        >
          Unirme a la comunidad
        </Link>
        <button
          type="button"
          onClick={onRetake}
          className="rounded-full border border-gold/50 px-6 py-3 font-semibold text-ink-soft hover:border-gold hover:text-gold-dark"
        >
          Repetir diagnóstico
        </button>
      </div>
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

  const handleRetake = () => {
    reset()
    navigate('/quiz')
  }

  return <ResultsView results={computeResults()} onRetake={handleRetake} />
}

export default Results

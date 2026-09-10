import { useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import ConfirmButton from '../components/ui/ConfirmButton'
import { AREA_BY_ID } from '../data/areas'
import { QUESTIONS } from '../data/questions'
import { ROADMAP } from '../data/roadmap'
import { gsap, ScrollTrigger, useGSAP } from '../lib/gsap'
import { DUR, EASE, FULL_MOTION, STAGGER } from '../lib/motion'
import { useDocumentTitle } from '../lib/useDocumentTitle'
import { MIN_PERCENTAGE, NEUTRAL_PERCENTAGE, useQuizStore } from '../store/quizStore'

function EmptyState() {
  useDocumentTitle('Aún no tienes resultados — PotroPath')

  return (
    <section className="mx-auto flex max-w-2xl flex-1 flex-col items-center justify-center gap-4 px-6 py-24 text-center">
      <h1 className="h1">Aún no tienes resultados</h1>
      <p className="text-ink-soft">
        Responde el diagnóstico de 50 preguntas para descubrir tu ruta de crecimiento dentro de la
        Ingeniería en Computación.
      </p>
      <Link to="/quiz" className="btn-green">
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
  const mascot = useRef(null)
  const top = results[0]
  const topArea = AREA_BY_ID[top.areaId]
  const topRoadmap = ROADMAP[top.areaId]

  // Responder "Neutral" a las cincuenta produce el mismo porcentaje en las
  // cinco áreas. La pantalla no puede seguir diciendo "tu mayor afinidad es X"
  // como si hubiera ganado algo: si hay empate arriba, se nombra.
  const tied = results.filter((result) => result.percentage === top.percentage)

  useDocumentTitle(`Tu ruta: ${topArea.name} — PotroPath`)

  // El pago de 50 preguntas. Es la única secuencia larga del sitio: el titular
  // anuncia el área ganadora y las cinco barras se llenan con su porcentaje
  // contando en sincronía.
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

        // Los offsets relativos se miden contra el FIN de la línea de tiempo, no
        // contra el tween anterior. Al quitar el barrido dorado —que terminaba
        // en 0.95s— hubo que reescribir los dos offsets siguientes para que la
        // secuencia caiga exactamente donde caía: eyebrow 0s, titular y
        // descripción 0.2s, y la etiqueta `bars` en 0.55s.
        tl.from('[data-eyebrow]', { opacity: 0, y: 12, duration: DUR.view, ease: EASE.enter })
          .from('[data-heading]', { opacity: 0, y: 16, duration: DUR.view, ease: EASE.enter }, '-=0.25')
          .from(
            '[data-description]',
            { opacity: 0, y: 14, duration: DUR.view, ease: EASE.enter },
            '-=0.45',
          )
          .addLabel('bars', '-=0.1')

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
            mascot.current,
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

        // El mismo bucle que la insignia de Inicio: el potro se queda flotando
        // en vez de clavarse donde aterrizó.
        const idle = gsap.to(mascot.current, {
          y: -5,
          duration: 2.4,
          ease: 'sine.inOut',
          yoyo: true,
          repeat: -1,
          paused: true,
        })

        tl.add(() => idle.play())

        // Un bucle que nadie ve no debe seguir corriendo.
        const visibility = ScrollTrigger.create({
          trigger: mascot.current,
          start: 'top bottom',
          end: 'bottom top',
          onToggle: (self) => (self.isActive ? idle.play() : idle.pause()),
        })

        return () => {
          tl.kill()
          idle.kill()
          visibility.kill()
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
    <section ref={root} className="section-py mx-auto max-w-2xl px-6">
      {/*
        El potro comparte fila con el titular en vez de flotar en `absolute`
        sobre él: superpuesto, un área de nombre largo —"Desarrollo de
        Software"— se metía debajo de la insignia en escritorio, y en teléfono
        el elemento estaba escondido, que es justo donde esta pantalla es el
        pago de cincuenta preguntas. En columna se apoya arriba a la derecha y
        el titular conserva el ancho completo; desde `md` pasa a la derecha de
        una fila y el texto ocupa el resto, así que ningún nombre lo alcanza.
      */}
      <div className="flex flex-col items-end gap-4 md:flex-row-reverse md:items-start md:gap-10">
        <img
          ref={mascot}
          src="/images/potro-mascota.webp"
          alt=""
          aria-hidden="true"
          className="pointer-events-none h-24 w-auto shrink-0 rounded-xl bg-paper p-1.5 shadow-lg ring-1 ring-ink/10 sm:h-28 md:h-32"
        />

        <div className="w-full min-w-0 md:flex-1">
          <p data-eyebrow className="eyebrow">
            Tu resultado
          </p>
          <h1 data-heading className="mt-2 h1">
            Tu mayor afinidad es <span className="text-gold-dark">{topArea.name}</span>
          </h1>
          <p data-description className="mt-3 lead">
            {topArea.description}
          </p>
        </div>
      </div>

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
                className="h-full w-full origin-left rounded-full bg-green-mid"
                style={{ transform: `scaleX(${percentage / 100})` }}
              />
            </div>
          </div>
        ))}
      </div>

      {/*
        La escala tiene piso: cada área parte de diez preguntas, así que el
        mínimo posible es 20% y no 0%. Sin esta nota, un porcentaje de 60 se
        lee como "apenas aprobado" cuando en realidad es el centro exacto de
        la escala — y una valoración técnica que audite el método ataca justo
        por aquí.
      */}
      <div data-card className="mt-6 rounded-xl bg-green-soft p-6 text-sm text-ink-soft">
        <h2 className="h3 text-green">Cómo se lee este porcentaje</h2>
        <p className="mt-2">
          Cada área suma sus diez preguntas sobre un máximo de cincuenta puntos, así que la escala va
          de {MIN_PERCENTAGE}% a 100%: responder «Neutral» a las diez de un área da{' '}
          {NEUTRAL_PERCENTAGE}%, que es su punto medio. El porcentaje mide qué tanto te reconociste
          en esas afirmaciones, no qué tan bueno eres en el área.
        </p>
        {tied.length > 1 && (
          <p className="mt-3 font-medium text-ink">
            Empate: {tied.map((result) => AREA_BY_ID[result.areaId].name).join(', ')} quedaron en el
            mismo porcentaje. Abajo aparece la ruta de {topArea.name}; las otras te quedan igual de
            cerca.
          </p>
        )}
      </div>

      <div className="mt-6 grid gap-6 sm:grid-cols-2">
        <div data-card className="rounded-xl bg-paper-alt p-5">
          <h2 className="h3 text-green-mid">Habilidades demandadas</h2>
          {/*
            Los "·" eran caracteres tecleados dentro de cada `<li>`: un lector
            de pantalla decía "punto medio" ocho veces seguidas. El marcador
            real lo pone la lista, y el oro lo firma.
          */}
          <ul className="mt-3 list-disc space-y-1 ps-5 text-sm text-ink-soft marker:text-gold-dark">
            {topRoadmap.skills.map((skill) => (
              <li key={skill}>{skill}</li>
            ))}
          </ul>
        </div>
        <div data-card className="rounded-xl bg-paper-alt p-5">
          <h2 className="h3 text-green-mid">Certificaciones clave</h2>
          <ul className="mt-3 list-disc space-y-1 ps-5 text-sm text-ink-soft marker:text-gold-dark">
            {topRoadmap.certifications.map((cert) => (
              <li key={cert}>{cert}</li>
            ))}
          </ul>
        </div>
      </div>

      <div data-cta className="mt-12 flex flex-wrap gap-4">
        <Link to="/comunidad" className="btn-green">
          Unirme a la comunidad
        </Link>
        <ConfirmButton
          label="Repetir diagnóstico"
          confirmLabel="¿Seguro? Se borran tus 50 respuestas"
          onConfirm={onRetake}
        />
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

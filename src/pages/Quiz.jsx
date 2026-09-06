import { useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { AREA_BY_ID } from '../data/areas'
import { QUESTIONS, SCALE } from '../data/questions'
import { gsap, prefersReducedMotion, useGSAP } from '../lib/gsap'
import { DUR, EASE } from '../lib/motion'
import { useQuizStore } from '../store/quizStore'

/** Puntos donde el avance merece acuse: son 50 preguntas. */
const MILESTONES = [25, 50, 75]

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

  const root = useRef(null)
  const panel = useRef(null)
  const bar = useRef(null)
  const setProgress = useRef(null)
  const lastIndex = useRef(currentIndex)
  const lastProgress = useRef(progress)
  const lastFillIndex = useRef(currentIndex)

  const handleFinish = () => {
    navigate('/resultados')
  }

  // La barra crece con `scaleX` y no con `width`: la anchura dispara layout en
  // cada avance. `quickTo` además es interrumpible si se avanza rápido.
  useGSAP(
    () => {
      setProgress.current = gsap.quickTo(bar.current, 'scaleX', {
        duration: 0.4,
        ease: EASE.state,
      })
    },
    { scope: root },
  )

  useGSAP(
    () => {
      const value = progress / 100
      const reduced = prefersReducedMotion()

      if (reduced) gsap.set(bar.current, { scaleX: value })
      else setProgress.current?.(value)

      const crossed = MILESTONES.some((m) => lastProgress.current < m && progress >= m)
      lastProgress.current = progress

      if (crossed && !reduced) {
        gsap.fromTo(
          bar.current,
          { filter: 'brightness(1)' },
          {
            filter: 'brightness(1.75)',
            duration: 0.18,
            ease: EASE.sweep,
            yoyo: true,
            repeat: 1,
            clearProps: 'filter',
          },
        )
      }
    },
    { dependencies: [progress], scope: root },
  )

  // El cuestionario es una tarea, no una lectura: sólo se anima la entrada, de
  // modo que el clic responda al instante. La dirección del desplazamiento
  // dice si avanzaste o retrocediste.
  useGSAP(
    () => {
      const direction = currentIndex >= lastIndex.current ? 1 : -1
      lastIndex.current = currentIndex

      if (prefersReducedMotion()) return

      gsap
        .timeline()
        .fromTo(
          panel.current,
          { opacity: 0, y: 14 * direction },
          { opacity: 1, y: 0, duration: 0.22, ease: EASE.enter, overwrite: true },
        )
        .fromTo(
          '[data-option]',
          { opacity: 0, y: 8 * direction },
          {
            opacity: 1,
            y: 0,
            duration: 0.22,
            ease: EASE.enter,
            stagger: { amount: 0.12 },
            overwrite: true,
          },
          '-=0.12',
        )
    },
    { dependencies: [currentIndex], scope: root },
  )

  // El relleno dorado barre desde la izquierda al elegir. Al cambiar de
  // pregunta se coloca sin animación: no es una elección nueva, es memoria.
  useGSAP(
    () => {
      const questionChanged = lastFillIndex.current !== currentIndex
      lastFillIndex.current = currentIndex
      const instant = questionChanged || prefersReducedMotion()

      gsap.utils.toArray('[data-fill]', root.current).forEach((fill) => {
        const scaleX = Number(fill.dataset.fill) === selectedValue ? 1 : 0
        if (instant) gsap.set(fill, { scaleX })
        else gsap.to(fill, { scaleX, duration: DUR.feedback, ease: EASE.state, overwrite: true })
      })
    },
    { dependencies: [selectedValue, currentIndex], scope: root },
  )

  return (
    <section ref={root} className="mx-auto max-w-2xl px-6 py-16">
      <div className="mb-8">
        <div className="flex items-center justify-between text-xs text-ink-soft">
          <span>
            Pregunta {currentIndex + 1} de {QUESTIONS.length}
          </span>
          <span className="font-semibold text-gold-dark">{area.name}</span>
        </div>
        <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-paper-alt">
          <div
            ref={bar}
            className="h-full w-full origin-left rounded-full bg-green-mid"
            style={{ transform: `scaleX(${progress / 100})` }}
          />
        </div>
      </div>

      <div ref={panel}>
        <h1 className="text-2xl font-bold text-ink">{question.prompt}</h1>

        <div className="mt-8 flex flex-col gap-2">
          {SCALE.map(({ value, label }) => (
            <button
              key={value}
              data-option
              type="button"
              onClick={() => answerCurrent(value)}
              className={`relative overflow-hidden rounded-xl border px-4 py-3 text-left text-sm transition-colors ${
                selectedValue === value
                  ? 'border-gold text-ink'
                  : 'border-ink/10 text-ink-soft hover:border-gold/50'
              }`}
            >
              <span
                data-fill={value}
                aria-hidden="true"
                className="absolute inset-0 origin-left scale-x-0 bg-green-soft"
              />
              <span className="relative">{label}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="mt-10 flex justify-between">
        <button
          type="button"
          onClick={goPrevious}
          disabled={currentIndex === 0}
          className="rounded-full px-5 py-2 text-sm text-ink-soft transition-opacity duration-200 disabled:opacity-30"
        >
          Anterior
        </button>
        {isLast ? (
          <button
            type="button"
            onClick={handleFinish}
            disabled={!selectedValue}
            className="rounded-full bg-gold px-6 py-2 text-sm font-semibold text-ink transition-opacity duration-200 disabled:opacity-30"
          >
            Ver resultados
          </button>
        ) : (
          <button
            type="button"
            onClick={goNext}
            disabled={!selectedValue}
            className="rounded-full bg-green-mid px-6 py-2 text-sm font-semibold text-paper transition-opacity duration-200 disabled:opacity-30"
          >
            Siguiente
          </button>
        )}
      </div>
    </section>
  )
}

export default Quiz

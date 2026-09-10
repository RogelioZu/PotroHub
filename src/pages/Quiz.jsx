import { useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import ConfirmButton from '../components/ui/ConfirmButton'
import { AREA_BY_ID } from '../data/areas'
import { QUESTIONS, SCALE } from '../data/questions'
import { gsap, prefersReducedMotion, useGSAP } from '../lib/gsap'
import { DUR, EASE } from '../lib/motion'
import { useDocumentTitle } from '../lib/useDocumentTitle'
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
  const reset = useQuizStore((state) => state.reset)

  const question = QUESTIONS[currentIndex]
  const area = AREA_BY_ID[question.areaId]
  const selectedValue = answers[question.id]
  const isLast = currentIndex === QUESTIONS.length - 1
  const answeredCount = Object.keys(answers).length
  const progress = Math.round(((currentIndex + 1) / QUESTIONS.length) * 100)

  // El avance viaja en el título: la sesión persiste en `localStorage`, y una
  // pestaña olvidada a media prueba dice en cuál pregunta se quedó.
  useDocumentTitle(`Diagnóstico · Pregunta ${currentIndex + 1} de ${QUESTIONS.length} — PotroPath`)

  const root = useRef(null)
  const panel = useRef(null)
  const prompt = useRef(null)
  const bar = useRef(null)
  const setProgress = useRef(null)
  const lastIndex = useRef(currentIndex)
  const lastProgress = useRef(progress)
  const lastFillIndex = useRef(currentIndex)
  const isFirstQuestion = useRef(true)

  const handleFinish = () => {
    navigate('/resultados')
  }

  // La pregunta se reemplaza en sitio: sin esto, quien navega con teclado o
  // lector de pantalla pulsa "Siguiente" y nada se anuncia — el foco se queda
  // en un botón que ahora pertenece a otra pregunta. Mover el foco al
  // enunciado lo lee en voz alta y devuelve la tabulación al principio de la
  // pregunta nueva, que es el orden que el usuario espera.
  useEffect(() => {
    if (isFirstQuestion.current) {
      isFirstQuestion.current = false
      return
    }
    prompt.current?.focus()
  }, [currentIndex])

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

  // El relleno verde barre desde la izquierda al elegir. Al cambiar de
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
    <section ref={root} className="section-py mx-auto flex max-w-2xl flex-col px-6">
      <div className="mb-8">
        <div className="flex items-center justify-between text-xs text-ink-soft">
          <span>
            Pregunta {currentIndex + 1} de {QUESTIONS.length}
          </span>
          <span className="font-semibold text-gold-dark">{area.name}</span>
        </div>
        {/*
          La barra era un `div` mudo: quien no la ve nunca supo cuánto llevaba
          de cincuenta. `aria-valuetext` da la cuenta en preguntas y no en
          porcentaje, que es la unidad en la que el estudiante está pensando.
        */}
        <div
          role="progressbar"
          aria-valuemin={1}
          aria-valuemax={QUESTIONS.length}
          aria-valuenow={currentIndex + 1}
          aria-valuetext={`Pregunta ${currentIndex + 1} de ${QUESTIONS.length}`}
          aria-label="Avance del diagnóstico"
          className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-paper-alt"
        >
          <div
            ref={bar}
            className="h-full w-full origin-left rounded-full bg-green-mid"
            style={{ transform: `scaleX(${progress / 100})` }}
          />
        </div>
      </div>

      <div ref={panel}>
        {/*
          `tabIndex={-1}` no lo mete en el orden de tabulación: sólo lo hace
          enfocable por programa, que es lo que necesita el salto de pregunta.
        */}
        <h1 ref={prompt} tabIndex={-1} id="quiz-prompt" className="h2 focus-visible:outline-offset-4">
          {question.prompt}
        </h1>

        {/*
          Eran cinco `<button>` sueltos: un lector de pantalla oía cinco
          botones sin relación entre sí y nunca sabía cuál estaba elegido. Como
          grupo de radios, anuncia "opción 4 de 5, seleccionada" y el estado
          deja de depender de un relleno que sólo se ve.
        */}
        <div role="radiogroup" aria-labelledby="quiz-prompt" className="mt-8 flex flex-col gap-2">
          {SCALE.map(({ value, label }) => (
            <button
              key={value}
              data-option
              type="button"
              role="radio"
              aria-checked={selectedValue === value}
              onClick={() => answerCurrent(value)}
              className={`relative overflow-hidden rounded-xl border px-4 py-3 text-left text-sm transition-colors ${
                selectedValue === value
                  ? 'border-green-mid text-ink'
                  : 'border-green-mid/70 text-ink-soft hover:border-green-mid'
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

      {/*
        Los controles del cuestionario se quedan en `text-sm` a propósito —un
        CTA de decisión y un control que se pulsa cuarenta y nueve veces no son
        el mismo objeto— pero el relleno sube a `py-3` para que el objetivo
        táctil llegue a 44px. Antes medía 36px y había que acertarlo con el
        pulgar cuarenta y nueve veces seguidas.
      */}
      <div className="mt-10 flex justify-between gap-4">
        <button
          type="button"
          onClick={goPrevious}
          disabled={currentIndex === 0}
          className="rounded-full px-5 py-3 text-sm text-ink-soft transition-opacity duration-200 disabled:opacity-30"
        >
          Anterior
        </button>
        {isLast ? (
          <button
            type="button"
            onClick={handleFinish}
            disabled={!selectedValue}
            className="rounded-full bg-green px-6 py-3 text-sm font-semibold text-paper transition-opacity duration-200 disabled:opacity-30"
          >
            Ver resultados
          </button>
        ) : (
          <button
            type="button"
            onClick={goNext}
            disabled={!selectedValue}
            className="rounded-full bg-green-mid px-6 py-3 text-sm font-semibold text-paper transition-opacity duration-200 disabled:opacity-30"
          >
            Siguiente
          </button>
        )}
      </div>

      {/*
        Reiniciar sólo existía en la pantalla de resultados, que sólo aparece
        con las cincuenta respondidas: con veinte contestadas no había ninguna
        forma de empezar limpio. Vive al pie y en tamaño de nota porque es una
        salida, no la tarea.
      */}
      {answeredCount > 0 && (
        <p className="mx-auto mt-12 max-w-sm border-t border-ink/10 pt-6 text-center text-xs text-ink-soft">
          Tus respuestas se guardan en este navegador; puedes cerrar y continuar después.{' '}
          <ConfirmButton
            label="Empezar de nuevo"
            confirmLabel={`¿Seguro? Se borran tus ${answeredCount} respuestas`}
            onConfirm={reset}
            className="inline-block rounded-full py-1.5 font-semibold text-ink-soft underline underline-offset-2 transition-colors hover:text-green-mid"
            armedClassName="inline-block rounded-full py-1.5 font-semibold text-green-mid underline underline-offset-2"
          />
        </p>
      )}
    </section>
  )
}

export default Quiz

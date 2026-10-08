import { useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import ConfirmButton from '../components/ui/ConfirmButton'
import { AREA_BY_ID } from '../data/areas'
import { QUESTIONS, SCALE } from '../data/questions'
import { useDocumentTitle } from '../lib/useDocumentTitle'
import { useQuizStore } from '../store/quizStore'

/**
 * El diagnóstico: una afirmación por pantalla, cinco radios nativos y
 * progreso contado en respuestas guardadas.
 *
 * Cambios respecto de la primera versión, todos de forma y ninguno de
 * fondo — las 50 afirmaciones, la escala y la fórmula no cambian:
 *
 * - **El progreso cuenta respuestas, no posición.** Antes la barra seguía al
 *   número de pregunta; retroceder diez preguntas "borraba" avance que en
 *   realidad estaba guardado.
 * - **Radios nativos** en lugar de botones con `role="radio"`: flechas,
 *   espacio y lector de pantalla funcionan como el navegador promete.
 * - **Atajos de teclado** en laptop: 1–5 responde y Enter avanza. Cincuenta
 *   preguntas pedían al menos cien clics; con teclado son cien teclas
 *   seguidas sin mover la mano.
 * - **Sin animación de entrada:** la pregunta nueva está ahí al instante.
 */
function Quiz() {
  const navigate = useNavigate()
  const currentIndex = useQuizStore((state) => state.currentIndex)
  const answers = useQuizStore((state) => state.answers)
  const answerCurrent = useQuizStore((state) => state.answerCurrent)
  const goNext = useQuizStore((state) => state.goNext)
  const goPrevious = useQuizStore((state) => state.goPrevious)
  const goToFirstUnanswered = useQuizStore((state) => state.goToFirstUnanswered)
  const reset = useQuizStore((state) => state.reset)

  const question = QUESTIONS[currentIndex]
  const selected = answers[question.id]
  const answered = Object.keys(answers).length
  const pending = QUESTIONS.length - answered
  const isLast = currentIndex === QUESTIONS.length - 1
  const canFinish = isLast && pending === 0

  const heading = useRef(null)
  const previousIndex = useRef(currentIndex)

  useDocumentTitle(`Diagnóstico · Pregunta ${currentIndex + 1} de ${QUESTIONS.length} — PotroPath`)

  // La pregunta se reemplaza en sitio. Mover el foco al enunciado lo lee en
  // voz alta y devuelve la tabulación al principio de la pregunta nueva; sin
  // esto el foco se quedaba en un botón que ya pertenecía a otra.
  useEffect(() => {
    if (previousIndex.current !== currentIndex) heading.current?.focus()
    previousIndex.current = currentIndex
  }, [currentIndex])

  const advance = () => {
    if (canFinish) navigate('/resultados')
    else if (!isLast) goNext()
  }

  // Atajos. Se ignoran con modificadores (para no robar Ctrl+1 al navegador)
  // y Enter se ignora sobre botones y enlaces, que ya responden a Enter solos.
  useEffect(() => {
    const onKeyDown = (event) => {
      if (event.altKey || event.ctrlKey || event.metaKey || event.repeat) return

      const value = Number(event.key)
      if (SCALE.some((step) => step.value === value)) {
        event.preventDefault()
        answerCurrent(value)
        return
      }

      if (event.key === 'Enter' && selected && !event.target.closest?.('button, a, summary')) {
        event.preventDefault()
        if (canFinish) navigate('/resultados')
        else if (!isLast) goNext()
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [answerCurrent, canFinish, goNext, isLast, navigate, selected])

  return (
    <section className="quiz-shell" aria-labelledby="quiz-prompt">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="eyebrow">Tu diagnóstico</p>
        <span className="pill bg-green-soft">{AREA_BY_ID[question.areaId].name}</span>
      </div>

      <div className="mt-7 mb-3 flex justify-between text-xs muted">
        <span>
          Pregunta <strong className="number text-ink">{currentIndex + 1}</strong> de{' '}
          {QUESTIONS.length}
        </span>
        <span className="number">
          {answered} de {QUESTIONS.length} respondidas
        </span>
      </div>
      <div
        role="progressbar"
        aria-label="Respuestas guardadas"
        aria-valuemin={0}
        aria-valuemax={QUESTIONS.length}
        aria-valuenow={answered}
        aria-valuetext={`${answered} de ${QUESTIONS.length} respuestas`}
        className="progress-track"
      >
        <div
          className="progress-fill"
          style={{ transform: `scaleX(${answered / QUESTIONS.length})` }}
        />
      </div>

      <div className="surface panel-pad mt-8">
        <p className="eyebrow mb-4">Piensa en lo que disfrutas, no en lo que ya dominas.</p>
        <h1 ref={heading} tabIndex={-1} id="quiz-prompt" className="h2 focus:outline-none">
          {question.prompt}
        </h1>
        <p className="mt-4 text-sm muted">¿Qué tanto te identificas con esta afirmación?</p>

        <fieldset className="mt-7 grid gap-3">
          <legend className="sr-only">Tu grado de acuerdo</legend>
          {SCALE.map(({ value, label }) => (
            <label key={value} className="quiz-option">
              <input
                type="radio"
                name={question.id}
                value={value}
                checked={selected === value}
                onChange={() => answerCurrent(value)}
              />
              <span>{label}</span>
              <kbd className="quiz-key" aria-hidden="true">
                {value}
              </kbd>
            </label>
          ))}
        </fieldset>
      </div>

      <div className="mt-6 flex items-center justify-between gap-4">
        <button
          type="button"
          className="btn-outline"
          onClick={goPrevious}
          disabled={currentIndex === 0}
        >
          <span aria-hidden="true">←</span> Anterior
        </button>
        <button
          type="button"
          className="btn-green"
          onClick={advance}
          disabled={!selected || (isLast && !canFinish)}
        >
          {isLast ? 'Descubrir mi ruta' : 'Siguiente'} <span aria-hidden="true">→</span>
        </button>
      </div>

      {isLast && pending > 0 && (
        <div className="mt-5 rounded-2xl bg-green-soft p-5 text-sm" role="status">
          <p>
            Te {pending === 1 ? 'falta 1 afirmación' : `faltan ${pending} afirmaciones`} antes de
            ver tu ruta.
          </p>
          <button type="button" className="text-link" onClick={goToFirstUnanswered}>
            Ir a la primera pendiente
          </button>
        </div>
      )}

      <p className="keyboard-hint mt-8 text-center text-xs muted">
        Atajo: teclas <kbd>1</kbd>–<kbd>5</kbd> para responder y <kbd>Enter</kbd> para continuar.
      </p>
      <p className="mt-3 text-center text-xs muted">
        Tu avance se guarda en este navegador. Puedes cerrar y continuar después.
      </p>

      {answered > 0 && (
        <div className="mt-2 text-center">
          <ConfirmButton
            label="Empezar de nuevo"
            confirmLabel={`¿Seguro? Se borran tus ${answered} respuestas`}
            onConfirm={reset}
            className="text-link text-xs muted"
            armedClassName="text-link text-xs text-green-mid"
          />
        </div>
      )}
    </section>
  )
}

export default Quiz

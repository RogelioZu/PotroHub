import { useEffect, useRef } from 'react'
import { AREA_BY_ID } from '../../data/areas'
import { FOCUS_BY_ID } from '../../data/focuses'
import { useQuizStore } from '../../store/quizStore'
import Icon from '../ui/Icon'

/**
 * Lo que la interfaz dice sobre de dónde salieron las preguntas. Las de
 * respaldo no se hacen pasar por las de la IA: no leyeron las respuestas del
 * estudiante, y decir lo contrario sería exactamente el tipo de dato
 * disfrazado que PRODUCT.md prohíbe.
 */
const SOURCE_NOTE = {
  ia: 'Redactadas por IA (Qwen) a partir de tus 50 respuestas. El enfoque y lo que trae no: eso es un catálogo revisado por personas.',
  respaldo:
    'Preguntas de respaldo, escritas a mano: la IA no respondió a tiempo. No leyeron tus respuestas, pero si apuntas a dos enfoques distintos, desempatan tus 50.',
}

/** Por qué ganó este enfoque, en una frase que se puede comprobar a mano. */
function reasonFor(focus, picks) {
  if (picks[0] === picks[1]) return 'Tus dos respuestas apuntaron aquí.'
  const other = FOCUS_BY_ID[picks.find((pick) => pick !== focus.id)]
  return `Tus respuestas se repartieron entre ${focus.name} y ${other.name}. Desempató lo que respondiste en el diagnóstico a las afirmaciones de cada uno.`
}

/**
 * "Afina tu ruta": las dos preguntas detonadoras y el enfoque que eligen.
 *
 * Vive en resultados y no al final del cuestionario porque el pago de las
 * cincuenta llega primero: esto es una pregunta más que se ofrece, no una que
 * se cobra antes de dar el resultado. Va entre el resultado y "Tu primer
 * paso" porque es lo que lo cambia: el enfoque elegido reescribe ese bloque, y
 * el estudiante ve el efecto justo debajo de su respuesta. Nada sale del
 * navegador hasta el clic, porque el aviso de qué se envía y a quién sólo vale
 * si se lee antes.
 *
 * El panel cierra con el enfoque y por qué ganó, no con sus habilidades: esas
 * viven en "Tu primer paso", para que la página no tenga dos.
 */
function RefinePanel({ areas, focus }) {
  const refinement = useQuizStore((state) => state.refinement)
  const refining = useQuizStore((state) => state.refining)
  const requestRefinement = useQuizStore((state) => state.requestRefinement)
  const pickOption = useQuizStore((state) => state.pickOption)

  const firstPrompt = useRef(null)
  const justRequested = useRef(false)

  const questions = refinement?.questions
  const areaNames = new Intl.ListFormat('es-MX', { type: 'disjunction' }).format(
    areas.map((area) => area.name),
  )

  const handleRequest = () => {
    if (refining) return
    justRequested.current = true
    requestRefinement()
  }

  // Las preguntas reemplazan al botón que tenía el foco: sin moverlo, quien
  // navega con teclado se queda en un elemento que ya no existe. Es el mismo
  // salto al enunciado que hace el cuestionario. Sólo tras pedirlas: unas
  // preguntas restauradas de `localStorage` no le roban el foco a nadie.
  useEffect(() => {
    if (!questions || !justRequested.current) return
    justRequested.current = false
    firstPrompt.current?.focus()
  }, [questions])

  return (
    <section className="reveal" aria-labelledby="afina" aria-busy={refining}>
      <p className="eyebrow">Dos preguntas más</p>
      <h2 id="afina" className="h2 mt-2 mb-6">
        Afina tu ruta.
      </h2>

      {!questions ? (
        <div className="surface panel-pad flex flex-wrap items-end justify-between gap-6">
          <div className="max-w-2xl">
            <p className="muted">
              Cada área se divide en tres enfoques. Dos preguntas escritas a partir de tus respuestas
              eligen el tuyo dentro de {areaNames}.
            </p>
            <p className="source-note mt-3">
              Para redactarlas, tus 50 respuestas —sólo los números del 1 al 5, nada que te
              identifique— se envían a Qwen, un modelo de IA de Alibaba Cloud. Si no responde a
              tiempo, usamos dos preguntas escritas a mano.
            </p>
          </div>
          {/*
            `aria-disabled` y no `disabled`: un botón deshabilitado suelta el
            foco justo después del clic, y el anuncio de la espera viaja en su
            propia etiqueta.
          */}
          <button
            type="button"
            onClick={handleRequest}
            aria-disabled={refining}
            aria-live="polite"
            className={`btn-green ${refining ? 'cursor-wait' : ''}`}
          >
            {refining ? 'Redactando tus preguntas…' : 'Afinar mi ruta'}
          </button>
        </div>
      ) : (
        <div className="surface panel-pad swap-in">
          <p className="source-note max-w-3xl">{SOURCE_NOTE[refinement.source]}</p>

          <div className="mt-6 grid gap-8 md:grid-cols-2">
            {questions.map((question, questionIndex) => (
              <div key={questionIndex}>
                <h3
                  ref={questionIndex === 0 ? firstPrompt : undefined}
                  id={`detonadora-${questionIndex}`}
                  tabIndex={-1}
                  className="h3 focus:outline-none"
                >
                  {question.prompt}
                </h3>
                {/*
                  Radios nativos, como el cuestionario: flechas, espacio y
                  lector de pantalla funcionan como el navegador promete, y
                  el estado elegido no depende de un relleno que sólo se ve.
                */}
                <fieldset aria-labelledby={`detonadora-${questionIndex}`} className="mt-4 grid gap-3">
                  {question.options.map((option) => (
                    <label key={option.focusId} className="quiz-option">
                      <input
                        type="radio"
                        name={`detonadora-${questionIndex}`}
                        value={option.focusId}
                        checked={refinement.picks[questionIndex] === option.focusId}
                        onChange={() => pickOption(questionIndex, option.focusId)}
                      />
                      <span>{option.text}</span>
                    </label>
                  ))}
                </fieldset>
              </div>
            ))}
          </div>

          {/*
            La región viva existe desde antes de que haya enfoque, que es lo que
            hace que su aparición se anuncie; y dice una sola línea, no el
            bloque entero.
          */}
          <p aria-live="polite" className="sr-only">
            {focus ? `Tu enfoque: ${focus.name}. Tu primer paso cambió.` : ''}
          </p>
          {focus && (
            <div key={focus.id} className="swap-in mt-8 border-t border-ink/12 pt-6">
              <p className="eyebrow">Tu enfoque dentro de {AREA_BY_ID[focus.areaId].name}</p>
              <h3 className="h3 mt-2">{focus.name}</h3>
              <p className="mt-2 text-sm muted">{focus.description}</p>
              <p className="source-note mt-2">{reasonFor(focus, refinement.picks)}</p>
              <a href="#primer-paso" className="text-link mt-4">
                Ver tu primer paso <Icon name="arrow-down" />
              </a>
            </div>
          )}
        </div>
      )}
    </section>
  )
}

export default RefinePanel

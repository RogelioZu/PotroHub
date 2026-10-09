import { useRef } from 'react'
import { FOCUS_BY_ID } from '../../data/focuses'
import { gsap, useGSAP } from '../../lib/gsap'
import { DUR, EASE, FULL_MOTION, SHIFT, STAGGER } from '../../lib/motion'
import { useQuizStore } from '../../store/quizStore'

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

function FocusCard({ focus, area, picks }) {
  return (
    <div data-focus-card className="mt-10 rounded-xl bg-paper-alt p-6 text-sm text-ink-soft">
      <p className="eyebrow">Tu enfoque dentro de {area.name}</p>
      <h3 className="mt-2 h3 text-green">{focus.name}</h3>
      <p className="mt-2">{focus.description}</p>
      <p className="mt-3">{reasonFor(focus, picks)}</p>

      <div className="mt-6 grid gap-6 sm:grid-cols-2">
        <div>
          <p className="font-semibold text-ink">Habilidades del enfoque</p>
          <ul className="mt-2 list-disc space-y-1 ps-5 marker:text-gold-dark">
            {focus.skills.map((skill) => (
              <li key={skill}>{skill}</li>
            ))}
          </ul>
        </div>
        <div>
          <p className="font-semibold text-ink">Certificaciones de referencia</p>
          <ul className="mt-2 list-disc space-y-1 ps-5 marker:text-gold-dark">
            {focus.certifications.map((cert) => (
              <li key={cert}>{cert}</li>
            ))}
          </ul>
        </div>
      </div>

      {/*
        El primer paso es el aparte de la tarjeta, y por eso va en la capa de
        nota: un diagnóstico sin una acción para esta semana no vale nada
        (PRODUCT.md → Product Principles, 2).
      */}
      <div className="mt-6 rounded-xl bg-green-soft p-4">
        <p className="font-semibold text-ink">Tu primer paso esta semana</p>
        <p className="mt-1">{focus.firstStep}</p>
      </div>
    </div>
  )
}

/**
 * "Afina tu ruta": las dos preguntas detonadoras y el enfoque que eligen.
 *
 * Vive en resultados y no al final del cuestionario porque el pago de las
 * cincuenta llega primero: esto es una pregunta más que se ofrece, no una que
 * se cobra antes de dar el resultado. Y nada sale del navegador hasta el clic,
 * porque el aviso de qué se envía y a quién sólo vale si se lee antes.
 */
function RefinePanel({ areas, focus, routeArea }) {
  const refinement = useQuizStore((state) => state.refinement)
  const refining = useQuizStore((state) => state.refining)
  const requestRefinement = useQuizStore((state) => state.requestRefinement)
  const pickOption = useQuizStore((state) => state.pickOption)

  const root = useRef(null)
  const firstPrompt = useRef(null)
  const justRequested = useRef(false)
  const lastFocusId = useRef(focus?.id ?? null)

  const questions = refinement?.questions
  const areaNames = new Intl.ListFormat('es-MX', { type: 'disjunction' }).format(areas.map((area) => area.name))

  const handleRequest = () => {
    if (refining) return
    justRequested.current = true
    requestRefinement()
  }

  // Las preguntas reemplazan al botón que tenía el foco: sin moverlo, quien
  // navega con teclado se queda en un elemento que ya no existe. Es el mismo
  // salto al enunciado que hace el cuestionario. Sólo tras pedirlas: unas
  // preguntas restauradas de `localStorage` no le roban el foco a nadie, y
  // entran con el resto de la vista.
  useGSAP(
    () => {
      if (!questions || !justRequested.current) return
      justRequested.current = false
      firstPrompt.current?.focus()

      const mm = gsap.matchMedia()
      mm.add(FULL_MOTION, () => {
        gsap.from('[data-trigger]', {
          opacity: 0,
          y: SHIFT / 2,
          duration: DUR.view,
          ease: EASE.enter,
          stagger: STAGGER.tight,
        })
      })
      return () => mm.revert()
    },
    { dependencies: [questions], scope: root },
  )

  // El enfoque aparece, o cambia si el estudiante cambia una respuesta. La
  // tarjeta ya está en el HTML: esto sólo la trae desde abajo.
  useGSAP(
    () => {
      const id = focus?.id ?? null
      const changed = id !== lastFocusId.current
      lastFocusId.current = id
      if (!id || !changed) return

      const mm = gsap.matchMedia()
      mm.add(FULL_MOTION, () => {
        gsap.from('[data-focus-card]', { opacity: 0, y: SHIFT, duration: DUR.view, ease: EASE.enter })
      })
      return () => mm.revert()
    },
    { dependencies: [focus?.id], scope: root },
  )

  return (
    <section
      ref={root}
      data-card
      aria-labelledby="refine-title"
      aria-busy={refining}
      className="mt-12 border-t border-ink/10 pt-10"
    >
      <p className="eyebrow">Dos preguntas más</p>
      <h2 id="refine-title" className="mt-2 h2">
        Afina tu ruta
      </h2>

      {!questions ? (
        <>
          <p className="mt-3 text-ink-soft">
            Cada área se divide en tres enfoques. Dos preguntas escritas a partir de tus respuestas eligen el
            tuyo dentro de {areaNames}.
          </p>
          <p className="mt-4 text-xs text-ink-soft">
            Para redactarlas, tus 50 respuestas —sólo los números del 1 al 5, nada que te identifique— se envían
            a Qwen, un modelo de IA de Alibaba Cloud. Si no responde a tiempo, usamos dos preguntas escritas a
            mano.
          </p>
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
            className={`btn-green mt-6 ${refining ? 'cursor-wait' : ''}`}
          >
            {refining ? 'Redactando tus preguntas…' : 'Afinar mi ruta'}
          </button>
        </>
      ) : (
        <>
          <p className="mt-3 text-xs text-ink-soft">{SOURCE_NOTE[refinement.source]}</p>

          {questions.map((question, questionIndex) => (
            <div key={questionIndex} data-trigger className="mt-8">
              <h3
                ref={questionIndex === 0 ? firstPrompt : undefined}
                id={`trigger-${questionIndex}`}
                tabIndex={-1}
                className="h3 text-ink focus-visible:outline-offset-4"
              >
                {question.prompt}
              </h3>
              {/*
                El mismo patrón que las opciones del cuestionario: un grupo de
                radios anuncia "opción 2 de 3, seleccionada" y el estado no
                depende de un relleno que sólo se ve. El relleno aquí es un
                cambio de color y no el barrido del cuestionario: son seis
                toques y no doscientos cincuenta.
              */}
              <div role="radiogroup" aria-labelledby={`trigger-${questionIndex}`} className="mt-4 flex flex-col gap-2">
                {question.options.map((option) => {
                  const selected = refinement.picks[questionIndex] === option.focusId
                  return (
                    <button
                      key={option.focusId}
                      type="button"
                      role="radio"
                      aria-checked={selected}
                      onClick={() => pickOption(questionIndex, option.focusId)}
                      className={`rounded-xl border px-4 py-3 text-left text-sm transition-colors motion-reduce:transition-none ${
                        selected
                          ? 'border-green-mid bg-green-soft text-ink'
                          : 'border-green-mid/70 text-ink-soft hover:border-green-mid'
                      }`}
                    >
                      {option.text}
                    </button>
                  )
                })}
              </div>
            </div>
          ))}

          {/*
            La región viva existe desde antes de que haya enfoque, que es lo que
            hace que su aparición se anuncie; y dice una sola línea, no la
            tarjeta entera con sus diez renglones.
          */}
          <p aria-live="polite" className="sr-only">
            {focus ? `Tu enfoque: ${focus.name}` : ''}
          </p>
          {focus && <FocusCard focus={focus} area={routeArea} picks={refinement.picks} />}
        </>
      )}
    </section>
  )
}

export default RefinePanel

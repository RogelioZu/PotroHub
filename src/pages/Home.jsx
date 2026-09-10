import { useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import Reveal from '../components/motion/Reveal'
import SectionDivider from '../components/motion/SectionDivider'
import VitralShowcase from '../components/ui/VitralShowcase'
import { AREAS } from '../data/areas'
import { QUESTIONS } from '../data/questions'
import { gsap, SplitText, useGSAP } from '../lib/gsap'
import { DUR, EASE, FULL_MOTION, STAGGER } from '../lib/motion'
import { useDocumentTitle } from '../lib/useDocumentTitle'
import { useQuizStore } from '../store/quizStore'

/**
 * El botón principal decía siempre "Comenzar diagnóstico", pero el store
 * rehidrata `currentIndex` desde `localStorage`: quien volvía con treinta y
 * cuatro respondidas pulsaba "comenzar" y aterrizaba en la pregunta 34 sin
 * ningún aviso. El CTA ahora dice en qué estado está la sesión guardada, que
 * además es la única señal en toda la portada de que el avance se conserva.
 */
function resumeCta(answeredCount, currentIndex) {
  if (answeredCount === 0) return { to: '/quiz', label: 'Comenzar diagnóstico' }
  if (answeredCount < QUESTIONS.length) {
    return { to: '/quiz', label: `Continuar — pregunta ${currentIndex + 1} de ${QUESTIONS.length}` }
  }
  return { to: '/resultados', label: 'Ver mi ruta' }
}

function Home() {
  const hero = useRef(null)
  const heading = useRef(null)
  const [openArea, setOpenArea] = useState(null)
  const answers = useQuizStore((state) => state.answers)
  const currentIndex = useQuizStore((state) => state.currentIndex)
  const primary = resumeCta(Object.keys(answers).length, currentIndex)

  useDocumentTitle('PotroPath — Encuentra tu ruta en Ingeniería en Computación')

  // Momento focal del sitio. La columna de texto se arma por palabras dentro
  // de una máscara por líneas —"ruta" entra escalonada con las demás, sin
  // tratamiento propio— y en paralelo VitralShowcase descubre su tarjeta.
  useGSAP(
    () => {
      const mm = gsap.matchMedia()

      mm.add(FULL_MOTION, () => {
        let split
        let tl
        let cancelled = false

        // El titular se oculta ya, antes del primer pintado, para que no se
        // vea saltar cuando la fuente termine de cargar y se pueda partir.
        gsap.set(heading.current, { opacity: 0 })

        // Se construye tras la carga de la fuente, es decir fuera de la
        // ejecución síncrona de `useGSAP`, donde el `scope` ya no alcanza a los
        // selectores de texto: aquí se resuelven los elementos a mano.
        const build = () => {
          if (cancelled || !heading.current) return

          const pick = (selector) => hero.current.querySelector(selector)
          const eyebrow = pick('[data-hero-eyebrow]')
          const body = pick('[data-hero-body]')
          const ctas = gsap.utils.toArray('[data-hero-cta] > *', hero.current)

          split = SplitText.create(heading.current, { type: 'lines,words', mask: 'lines' })

          // Al terminar se deshace la partición: el DOM vuelve a su forma
          // normal y los cambios de línea al redimensionar son los del navegador.
          tl = gsap.timeline({ onComplete: () => split.revert() })

          tl.set(heading.current, { opacity: 1 })
            .from(eyebrow, { opacity: 0, y: 12, duration: DUR.state, ease: EASE.enter })
            .addLabel('words', '-=0.2')
            .from(
              split.words,
              { yPercent: 110, duration: DUR.focal, ease: EASE.enter, stagger: STAGGER.words },
              'words',
            )
            .from(
              [body, ...ctas],
              { opacity: 0, y: 16, duration: DUR.view, ease: EASE.enter, stagger: STAGGER.tight },
              'words+=0.35',
            )
        }

        // Partir antes de que cargue la fuente produce saltos de línea que no
        // son los definitivos, pero `document.fonts.ready` espera a que TODA la
        // página termine. Basta con la familia del titular, y con un tope de
        // 400 ms para que una red lenta nunca deje el hero escondido.
        Promise.race([
          document.fonts.load('700 3rem "DM Sans"').catch(() => {}),
          new Promise((resolve) => setTimeout(resolve, 400)),
        ]).then(build)

        return () => {
          cancelled = true
          // `revert()` y no `kill()`: matar el timeline deja pegado el estado
          // inicial de los `from`, y con el doble montaje de StrictMode el
          // segundo intento animaría de 0 a 0 y el texto no volvería nunca.
          // El timeline se crea fuera del contexto síncrono de `useGSAP`, así
          // que `mm.revert()` no lo alcanza y hay que revertirlo aquí.
          tl?.revert()
          split?.revert()
          gsap.set(heading.current, { clearProps: 'opacity' })
        }
      })

      return () => mm.revert()
    },
    { scope: hero },
  )

  return (
    <>
      <section
        ref={hero}
        className="section-py mx-auto grid max-w-6xl gap-10 px-6 md:grid-cols-2 md:items-center"
      >
        <div>
          <p data-hero-eyebrow className="eyebrow">
            Facultad de Ingeniería · UAEMéx
          </p>
          <h1 ref={heading} className="mt-3 h1">
            Encuentra tu <span className="text-gold-dark">ruta</span> dentro de la Ingeniería en
            Computación
          </h1>
          {/*
            Decía "50 preguntas basadas en escenarios reales de la industria".
            El banco (`src/data/questions.js`) son afirmaciones de interés
            —"Disfruto…", "Me atrae…"— en escala de acuerdo, no escenarios: la
            primera afirmación del producto se desmentía abriendo /quiz. Esta
            versión describe lo que el diagnóstico realmente hace.
          */}
          <p data-hero-body className="mt-5 lead">
            Cincuenta afirmaciones sobre lo que disfrutas y lo que te atrae miden tu afinidad con
            Inteligencia Artificial, Ciberseguridad, Cloud Computing, Ciencia de Datos y Desarrollo
            de Software, y la convierten en habilidades, certificaciones y una comunidad donde
            empezar.
          </p>
          <div data-hero-cta className="mt-8 flex flex-wrap gap-4">
            <Link to={primary.to} className="btn-green">
              {primary.label}
            </Link>
            <Link to="/comunidad" className="btn-outline">
              Conoce la comunidad
            </Link>
          </div>
        </div>
        <VitralShowcase />
      </section>

      <section className="section-py border-t border-ink/5 bg-paper-alt">
        <div className="mx-auto max-w-6xl px-6">
          <SectionDivider>
            <h2 className="area-heading-title min-w-0 h2 sm:shrink-0">¿Dónde está tu potencial?</h2>
          </SectionDivider>
          <p className="mt-4 max-w-2xl lead">
            Descubre las áreas de Computación que mejor conectan con tus habilidades, intereses y forma de resolver problemas.
          </p>
          {/*
            `selector` apunta a la tarjeta interior a propósito. `Reveal` anima
            `y` con GSAP, que reescribe el `transform` completo del elemento —y
            la posición de cada tarjeta en el círculo *es* un `transform` con
            porcentajes y `--angle`. Animando el `<article>` directamente, GSAP
            lo aplastaba: antes de que el disparador se cumpliera las cinco
            tarjetas quedaban apiladas en la misma fila, y después la órbita
            quedaba congelada en píxeles y ya no se recomponía al cambiar el
            ancho de la ventana. El botón de dentro no tiene transform propio,
            así que ahí el revelado no pisa nada.
          */}
          <Reveal
            className="area-orbit"
            selector=".area-orbit-card"
            aria-label="Áreas de especialización"
          >
            <div className="area-orbit-center">
              {/* Decorativa: la etiqueta de al lado ya dice lo que significa. */}
              <img src="/images/potro-mascota.webp" alt="" />
              <span>Tu ruta</span>
            </div>
            {AREAS.map((area) => (
              <article key={area.id} className="area-orbit-item">
                {/*
                  La tarjeta es un `button` de verdad y no un `article` con
                  `tabindex="0"`. Antes el giro dependía de `:hover` y de un
                  `:focus-within` que sólo podía venir de un botón "Ver más"
                  que no hacía nada: en teléfono —escena de llegada primaria—
                  la descripción del área era inalcanzable, y con teclado el
                  foco caía en un elemento sin acción. Ahora el control dice
                  qué hace (`aria-expanded`), responde a toque, clic, Enter y
                  Espacio, y el `:hover` se queda como lo que siempre fue: un
                  atajo para el puntero.
                */}
                <button
                  type="button"
                  className="area-orbit-card"
                  aria-expanded={openArea === area.id}
                  onClick={() => setOpenArea((current) => (current === area.id ? null : area.id))}
                >
                  <span className="area-orbit-flip">
                    <span className="area-orbit-face area-orbit-front">
                      <span className="area-orbit-image">
                        <img
                          src={area.image}
                          alt=""
                          width="720"
                          height="500"
                          loading="lazy"
                          decoding="async"
                        />
                        <span className="area-orbit-name">{area.name}</span>
                      </span>
                    </span>
                    <span className="area-orbit-face area-orbit-back">{area.description}</span>
                  </span>
                </button>
              </article>
            ))}
          </Reveal>
        </div>
      </section>
    </>
  )
}

export default Home

import { useRef } from 'react'
import { Link } from 'react-router-dom'
import Reveal from '../components/motion/Reveal'
import SectionDivider from '../components/motion/SectionDivider'
import HeroMosaic from '../components/ui/HeroMosaic'
import { AREAS } from '../data/areas'
import { gsap, SplitText, useGSAP } from '../lib/gsap'
import { DUR, EASE, FULL_MOTION, STAGGER } from '../lib/motion'
import { useDocumentTitle } from '../lib/useDocumentTitle'

function Home() {
  const hero = useRef(null)
  const heading = useRef(null)

  useDocumentTitle('PotroPath — Encuentra tu ruta en Ingeniería en Computación')

  // Momento focal del sitio. La columna de texto se arma por palabras dentro
  // de una máscara por líneas —"ruta" entra escalonada con las demás, sin
  // tratamiento propio— y al final se acomodan las celdas del mosaico.
  // VitralShowcase no aparece aquí: es dueño de su propia entrada y corre en
  // paralelo.
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
          const note = pick('[data-hero-note]')
          const ctas = gsap.utils.toArray('[data-hero-cta] > *', hero.current)
          const cells = gsap.utils.toArray('[data-mosaic-cell]', hero.current)

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
              [body, ...ctas, note],
              { opacity: 0, y: 16, duration: DUR.view, ease: EASE.enter, stagger: STAGGER.tight },
              'words+=0.35',
            )
            // Las celdas se acomodan como piezas que caen en su hueco: entran
            // desde una escala apenas menor, sin rebote — el rebote es del potro.
            .from(
              cells,
              {
                opacity: 0,
                scale: 0.92,
                duration: DUR.view,
                ease: EASE.enter,
                stagger: STAGGER.tight,
              },
              'words+=0.5',
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
          <p data-hero-body className="mt-5 lead">
            Un diagnóstico de 50 preguntas basadas en escenarios reales de la industria identifica tu afinidad
            hacia Inteligencia Artificial, Ciberseguridad, Cloud Computing, Ciencia de Datos o Desarrollo de
            Software, y te conecta con habilidades, certificaciones y comunidades para avanzar de inmediato.
          </p>
          <div data-hero-cta className="mt-8 flex flex-wrap gap-4">
            <Link to="/quiz" className="btn-green">
              Comenzar diagnóstico
            </Link>
            <Link to="/comunidad" className="btn-outline">
              Conoce la comunidad
            </Link>
          </div>
          {/*
            La objeción que mata a un enlace frío compartido por WhatsApp es
            "¿me va a pedir mis datos?". Se responde junto al botón, no en una
            sección de privacidad que nadie abre.
          */}
          <p data-hero-note className="mt-4 text-sm text-ink-soft">
            Sin registro, sin correo y sin datos personales.
          </p>
        </div>

        <HeroMosaic />
      </section>

      <section className="section-py border-t border-ink/5 bg-paper-alt">
        <div className="mx-auto max-w-6xl px-6">
          <SectionDivider>
            <h2 className="min-w-0 h2 sm:shrink-0">¿Dónde está tu potencial?</h2>
          </SectionDivider>
          <p className="mt-6 max-w-2xl text-ink-soft">
            Descubre las áreas de Computación que mejor conectan con tus habilidades, intereses y
            forma de resolver problemas.
          </p>

          {/*
            Las cinco áreas tienen el mismo peso visual: tres arriba y dos
            abajo es una composición, no una jerarquía. Destacar una sola antes
            de que el estudiante responda sugeriría una recomendación que el
            diagnóstico todavía no hizo.
          */}
          <Reveal className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-6">
            {AREAS.map((area, index) => (
              <article
                key={area.id}
                className={`overflow-hidden rounded-xl bg-paper shadow-sm shadow-ink/5 ${
                  index < 3 ? 'lg:col-span-2' : 'lg:col-span-3'
                }`}
              >
                {/*
                  Las dos celdas de abajo son más anchas, así que su fotografía
                  toma un recorte más panorámico: con el mismo 16/10 crecían de
                  alto y la fila inferior pesaba más que la superior.
                */}
                <img
                  src={area.image}
                  alt=""
                  className={`w-full object-cover ${
                    index < 3 ? 'aspect-16/10' : 'aspect-16/10 lg:aspect-21/9'
                  }`}
                  loading="lazy"
                />
                <div className="p-5">
                  <h3 className="h3 text-green-mid">{area.name}</h3>
                  <p className="mt-2 text-sm text-ink-soft">{area.description}</p>
                </div>
              </article>
            ))}
          </Reveal>
        </div>
      </section>
    </>
  )
}

export default Home

import { Link } from 'react-router-dom'
import Testimonials from '../components/home/Testimonials'
import { AREAS } from '../data/areas'
import { QUESTIONS } from '../data/questions'
import { useDocumentTitle } from '../lib/useDocumentTitle'
import { useQuizStore } from '../store/quizStore'

const STEPS = [
  {
    title: 'Descubre lo que te interesa',
    text: 'Responde afirmaciones sobre lo que disfrutas. No hay respuestas correctas ni incorrectas.',
  },
  {
    title: 'Dale forma a tu ruta',
    text: 'Explora habilidades por etapas, compara credenciales y entiende qué se hace en puestos de empresas tech.',
  },
  {
    title: 'Encuentra con quién avanzar',
    text: 'Conoce la Rama IEEE, los espacios por especialidad y las experiencias de estudiantes de tu facultad.',
  },
]

/**
 * El CTA dice en qué estado está la sesión guardada: quien vuelve con
 * respuestas a medias no "comienza", continúa, y quien terminó va directo a
 * su ruta. Es además la única señal de la portada de que el avance se guarda.
 */
function primaryAction(answered) {
  if (answered === QUESTIONS.length) return { to: '/resultados', label: 'Explorar mi ruta' }
  if (answered > 0) return { to: '/quiz', label: 'Continuar mi diagnóstico' }
  return { to: '/quiz', label: 'Descubrir mi ruta' }
}

function Home() {
  useDocumentTitle('PotroPath — Tu siguiente paso en Ingeniería en Computación')
  const answered = useQuizStore((state) => Object.keys(state.answers).length)
  const action = primaryAction(answered)
  const inProgress = answered > 0 && answered < QUESTIONS.length

  return (
    <>
      {/*
        El hero abre con una fotografía real de la Rama Estudiantil IEEE
        UAEMéx, no con una foto de banco: el lienzo del fondo dice "Rama
        Estudiantil · Universidad Autónoma del Estado de México · IEEE", así
        que la imagen se verifica sola. La especificidad local es toda la
        ventaja del producto (PRODUCT.md → Product Principles, 4).
      */}
      <section className="page-shell editorial-hero">
        <div>
          <p className="eyebrow">Facultad de Ingeniería · UAEMéx</p>
          <h1 className="h1">
            Ya elegiste Computación. <span className="text-green-mid">Ahora encuentra tu camino.</span>
          </h1>
          <p className="lead max-w-lg">
            Descubre qué te mueve, qué puedes aprender y dónde puedes llevarlo. Tu siguiente paso
            empieza con tus intereses, no con lo que ya dominas.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3">
            <Link className="btn-green" to={action.to}>
              {action.label} <span aria-hidden="true">↗</span>
            </Link>
            <a href="#como-funciona" className="text-link">
              Cómo funciona <span aria-hidden="true">↓</span>
            </a>
          </div>
          <p className="hero-facts">
            {inProgress ? (
              <span>
                <strong className="number">{answered}</strong> de {QUESTIONS.length} respuestas
                guardadas en este navegador. Continúa a tu ritmo.
              </span>
            ) : (
              <>
                <span>
                  <strong>{QUESTIONS.length}</strong> afirmaciones
                </span>
                <span>
                  <strong>{AREAS.length}</strong> especialidades
                </span>
                <span>
                  <strong>Sin</strong> registro
                </span>
              </>
            )}
          </p>
        </div>

        <figure className="hero-picture">
          <img
            src="/images/inicio-rama-ieee.webp"
            srcSet="/images/inicio-rama-ieee-720.webp 720w, /images/inicio-rama-ieee.webp 1200w"
            sizes="(min-width: 768px) 520px, calc(100vw - 48px)"
            alt="Integrantes de la Rama Estudiantil IEEE UAEMéx reunidos de noche alrededor de un vehículo todo terreno construido por el equipo, frente a su lona"
            width={1200}
            height={750}
            fetchPriority="high"
          />
          <figcaption className="photo-caption">
            Rama Estudiantil IEEE UAEMéx · Facultad de Ingeniería
          </figcaption>
        </figure>
      </section>

      <section id="como-funciona" className="bg-paper-alt section-py" aria-labelledby="pasos-titulo">
        <div className="page-shell">
          <div className="section-heading">
            <div>
              <p className="eyebrow">Un poco de claridad para tu siguiente paso</p>
              <h2 id="pasos-titulo" className="h2">
                No tienes que resolverlo todo hoy.
              </h2>
            </div>
            <p className="section-note">
              PotroPath no elige por ti ni mide lo que sabes: te ayuda a ordenar lo que te interesa
              y a convertirlo en un primer paso concreto.
            </p>
          </div>
          <ol className="step-grid">
            {STEPS.map((step, index) => (
              <li key={step.title} className="step-card">
                <span className="step-index number">0{index + 1} /</span>
                <h3 className="h3 mt-4 mb-2">{step.title}</h3>
                <p className="text-sm muted">{step.text}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/*
        Las cinco áreas con el mismo tratamiento y la descripción siempre
        visible: el diagnóstico las mide, no las rankea, y destacar una antes
        de responder sugeriría una recomendación que todavía no se hizo.
      */}
      <section className="page-shell section-py" aria-labelledby="areas-titulo">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Cinco formas de construir el futuro</p>
            <h2 id="areas-titulo" className="h2">
              ¿Qué despierta tu curiosidad?
            </h2>
          </div>
          <p className="section-note">
            No son caminos cerrados. Las especialidades se conectan y tus intereses pueden cambiar.
          </p>
        </div>

        <div className="area-grid">
          {AREAS.map((area, index) => (
            <article key={area.id} className="surface area-card">
              <img src={area.image} alt="" loading="lazy" />
              <div className="area-card-body">
                <p className="eyebrow">Especialidad · 0{index + 1}</p>
                <h3 className="h3 mt-2">{area.name}</h3>
                <p>{area.description}</p>
                <Link to={`/comunidad?area=${area.id}#especialidades`} className="text-link">
                  Ver su comunidad <span aria-hidden="true">↗</span>
                </Link>
              </div>
            </article>
          ))}

          <div className="dark-panel area-invite">
            <div>
              <p className="eyebrow">¿No sabes por cuál empezar?</p>
              <h3 className="h2 mt-3">Tus respuestas lo ordenan por ti.</h3>
              <p className="mt-4 text-sm text-paper/85">
                El diagnóstico compara tu afinidad con las cinco y te deja explorar cualquiera.
              </p>
            </div>
            <Link to={action.to} className="btn-light self-start">
              {action.label} <span aria-hidden="true">↗</span>
            </Link>
          </div>
        </div>
      </section>

      <Testimonials />

      <section className="page-shell pb-16" aria-labelledby="comunidad-titulo">
        <div className="dark-panel grid gap-8 md:grid-cols-2 md:items-center">
          <div>
            <p className="eyebrow">Tu ruta es tuya. El camino se comparte.</p>
            <h2 id="comunidad-titulo" className="h2 mt-4">
              Aprender también sucede fuera del salón.
            </h2>
            <p className="mt-5 text-sm text-paper/85">
              Hackatones, torneos de robótica y capítulos técnicos: conoce lo que ya han vivido
              estudiantes de la facultad y los espacios donde puedes seguir explorando.
            </p>
            <Link to="/comunidad" className="btn-light mt-6">
              Conocer la comunidad <span aria-hidden="true">↗</span>
            </Link>
          </div>
          <figure>
            <img
              className="aspect-4/3 w-full rounded-2xl object-cover"
              src="/images/comunidad/galeria-talent-land.webp"
              alt="Estudiantes de la Facultad de Ingeniería frente a la entrada de Talent Land México 2026"
              loading="lazy"
            />
            <figcaption className="mt-3 text-xs text-paper/80">
              Talent Land México 2026 · Estudiantes de la facultad
            </figcaption>
          </figure>
        </div>
      </section>
    </>
  )
}

export default Home

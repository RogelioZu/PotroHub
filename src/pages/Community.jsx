import { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { AREAS, AREA_BY_ID } from '../data/areas'
import { CHAPTERS, EVENTS, GALLERY, INTERESTS, TEAMS_CHANNELS } from '../data/community'
import { useDocumentTitle } from '../lib/useDocumentTitle'
import Gallery from '../components/community/Gallery'

/**
 * Comunidad: la página que existe para probar que la comunidad es real.
 *
 * Cuatro bloques, cada uno con una pregunta:
 *
 * 1. **Especialidades** — ¿con quién comparto intereses? Directorio visible
 *    de cinco intereses. El interés elegido vive en la URL (`?area=ia`), así
 *    que Inicio y Resultados pueden enlazar directo al del estudiante.
 * 2. **Rama IEEE** — ¿dónde hay una comunidad técnica? Cada sociedad reúne
 *    logo, propósito y estado en una tarjeta.
 * 3. **Experiencias** — ¿esto existe? Fotografías de estudiantes de la
 *    facultad con pie de evento y lugar.
 * 4. **Participar** — ¿qué hago hoy? Lo disponible y lo pendiente, dicho así.
 *
 * Las filas que volteaban se retiraron: pulsar un canal revelaba una
 * descripción y no abría ningún canal, que es lo que el gesto prometía.
 */
/** Las cuatro secciones del índice, en el orden de la página. */
const SECTIONS = [
  { id: 'especialidades', label: 'Por especialidad' },
  { id: 'ieee', label: 'Rama IEEE' },
  { id: 'experiencias', label: 'Experiencias' },
  { id: 'participar', label: 'Cómo participar' },
]
const SECTION_IDS = SECTIONS.map((section) => section.id)

/**
 * La sección que ocupa la franja central de la pantalla. El margen deja una
 * banda del 40% al 45% del alto: una sección se vuelve activa cuando su
 * contenido llega a la altura de la vista, no cuando asoma su borde.
 */
function useActiveSection(ids) {
  const [active, setActive] = useState(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.find((entry) => entry.isIntersecting)
        if (visible) setActive(visible.target.id)
      },
      { rootMargin: '-40% 0px -55% 0px' },
    )
    for (const id of ids) {
      const element = document.getElementById(id)
      if (element) observer.observe(element)
    }
    return () => observer.disconnect()
  }, [ids])

  return active
}

/** Enlaces del índice; la misma lista sirve al riel y a la barra. */
function SectionLinks({ active }) {
  return SECTIONS.map((section, index) => (
    <a
      key={section.id}
      href={`#${section.id}`}
      aria-current={active === section.id ? 'true' : undefined}
    >
      <span>0{index + 1}</span>
      {section.label}
    </a>
  ))
}

function Community() {
  useDocumentTitle('Comunidad — Aprende con otros · PotroPath')
  const [params, setParams] = useSearchParams()
  const selected = AREA_BY_ID[params.get('area')] ?? AREAS[0]

  const selectArea = (id) => setParams({ area: id }, { replace: true, preventScrollReset: true })
  const active = useActiveSection(SECTION_IDS)

  // En teléfono la barra se desplaza de lado; el enlace activo no debe
  // quedar fuera de ella. Se mueve la barra, no la página.
  useEffect(() => {
    const bar = document.querySelector('.anchor-bar .anchor-nav')
    const link = bar?.querySelector('a[aria-current]')
    if (!bar || !link) return
    const left = link.offsetLeft - bar.offsetLeft - 24
    bar.scrollTo({ left: Math.max(0, left), behavior: 'smooth' })
  }, [active])

  return (
    <div className="community-page">
      {/*
        El índice queda siempre a la vista. Con margen de sobra (desde 1440px)
        es un riel vertical en el canalón izquierdo, que el diseño deja vacío;
        más angosto no cabe ahí, y es una barra pegada arriba. Las dos son la
        misma lista y sólo una se muestra a la vez.
      */}
      <aside className="section-rail">
        <nav className="section-rail-nav" aria-label="Secciones de la comunidad">
          <SectionLinks active={active} />
        </nav>
      </aside>

      <section className="page-shell editorial-hero">
        <div>
          <p className="eyebrow enter">La comunidad de tu facultad</p>
          <h1 className="h1 enter" style={{ '--d': 1 }}>
            Tu camino es propio.{' '}
            <span className="text-green-mid">No tienes que recorrerlo solo.</span>
          </h1>
          <p className="lead enter" style={{ '--d': 2 }}>
            Hay conversaciones, proyectos y competencias que empiezan cuando termina la clase.
            Encuentra lo que te gustaría explorar con otros.
          </p>
          <div
            className="enter mt-8 flex flex-wrap items-center gap-x-6 gap-y-3"
            style={{ '--d': 3 }}
          >
            <a href="#especialidades" className="btn-green">
              Encontrar mi espacio <span aria-hidden="true">↓</span>
            </a>
            <a href="#experiencias" className="text-link">
              Ver experiencias <span aria-hidden="true">↓</span>
            </a>
          </div>
        </div>
        <figure className="hero-picture hero-zoom enter" style={{ '--d': 2 }}>
          <img
            src="/images/comunidad/quienes-somos.webp"
            srcSet="/images/comunidad/quienes-somos-720.webp 720w, /images/comunidad/quienes-somos.webp 1216w"
            sizes="(min-width: 768px) 520px, calc(100vw - 48px)"
            alt="Grupo de estudiantes de la Facultad de Ingeniería en Talent Land México 2026"
            width={1216}
            height={780}
            fetchPriority="high"
          />
          <figcaption className="photo-caption">
            Estudiantes de la facultad en Talent Land México 2026 · Expo Santa Fe
          </figcaption>
        </figure>
      </section>

      <div className="anchor-bar">
        <div className="page-shell">
          <nav className="anchor-nav" aria-label="Secciones de la comunidad">
            <SectionLinks active={active} />
          </nav>
        </div>
      </div>

      <section
        id="especialidades"
        className="page-shell section-py"
        aria-labelledby="especialidades-titulo"
      >
        <div className="section-heading">
          <div>
            <p className="eyebrow">01 / Encuentra tu espacio</p>
            <h2 id="especialidades-titulo" className="h2">
              Empieza por lo que te interesa.
            </h2>
          </div>
          <p className="section-note">
            Elige una especialidad para ver ideas de aprendizaje en equipo y entrar a su canal de Teams.
          </p>
        </div>

        <div className="community-directory">
          <div className="reveal-group grid gap-3" role="group" aria-label="Especialidades">
            {AREAS.map((area, index) => (
              <button
                key={area.id}
                type="button"
                className="surface interest-button"
                aria-pressed={selected.id === area.id}
                aria-controls="interes-comunidad"
                onClick={() => selectArea(area.id)}
              >
                <img src={area.image} alt="" loading="lazy" />
                <span className="min-w-0 flex-1">
                  <span className="source-note block">Especialidad · 0{index + 1}</span>
                  <span className="text-sm font-semibold">{area.name}</span>
                </span>
              </button>
            ))}
          </div>

          <div id="interes-comunidad" className="dark-panel" aria-live="polite">
            <p className="eyebrow">Un interés en común</p>
            <div key={selected.id} className="swap-in">
              <h3 className="h2 mt-4">{selected.name}</h3>
              <p className="mt-4 text-sm text-paper/85">{selected.description}</p>
            </div>

            <p className="eyebrow mt-8">Ideas para aprender en equipo</p>
            <ul className="mt-4 space-y-3 text-sm">
              {INTERESTS[selected.id].map((idea) => (
                <li key={idea} className="flex gap-3">
                  <span className="text-gold-light" aria-hidden="true">
                    ↗
                  </span>
                  {idea}
                </li>
              ))}
            </ul>

            <div className="mt-8 border-t border-paper/20 pt-6">
              <p className="text-sm font-semibold">Canal de Microsoft Teams</p>
              <a
                href={TEAMS_CHANNELS[selected.id]}
                target="_blank"
                rel="noreferrer"
                className="btn-light mt-4"
              >
                Abrir el canal en Teams <span aria-hidden="true">↗</span>
              </a>
              <p className="mt-3 text-xs text-paper/80">
                Entras con tu cuenta institucional. Las ideas de arriba son sugerencias, no
                actividades programadas.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section id="ieee" className="bg-paper-alt section-py" aria-labelledby="ieee-titulo">
        <div className="page-shell">
          <div className="dark-panel reveal">
            <p className="eyebrow">02 / Conecta con una comunidad técnica</p>
            <div className="mt-4 mb-8 grid gap-6 md:grid-cols-2">
              <h2 id="ieee-titulo" className="h2">
                Más preguntas. Más personas para resolverlas.
              </h2>
              <div>
                <h3 className="h3">Rama Estudiantil IEEE UAEMéx</h3>
                <p className="mt-3 text-sm text-paper/85">
                  Un espacio para explorar intereses técnicos, construir proyectos en equipo y
                  conocer la vida estudiantil más allá de tus materias.
                </p>
                <p className="mt-3 text-xs text-paper/80">
                  Las sociedades de abajo son referencias del IEEE. Las que tienen botón ya tienen
                  grupo para unirte; en las demás, la forma de incorporarse sigue por confirmar.
                </p>
              </div>
            </div>

            <div className="chapter-grid reveal-group">
              {CHAPTERS.map((chapter) => (
                <article key={chapter.name} className="chapter-card">
                  <div className="chapter-logo">
                    <img
                      src={chapter.logo.src}
                      alt={`Logotipo de IEEE ${chapter.name}`}
                      width={chapter.logo.width}
                      height={chapter.logo.height}
                      loading="lazy"
                    />
                  </div>
                  <h3 className="h3">{chapter.name}</h3>
                  <p className="mt-2 text-sm muted">{chapter.focus}</p>
                  {/* Sin enlace todavía, el botón ocupa su lugar deshabilitado y dice
                      "Próximamente": un "Unirme" activo que no abre nada sería la
                      promesa rota que este sitio no hace. */}
                  <div className="chapter-join">
                    {chapter.joinUrl ? (
                      <a
                        href={chapter.joinUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="btn-green"
                        aria-label={`Unirme al grupo de WhatsApp de ${chapter.name}`}
                      >
                        Unirme <span aria-hidden="true">↗</span>
                      </a>
                    ) : (
                      <button type="button" className="btn-green" disabled>
                        Próximamente
                      </button>
                    )}
                    <p className="source-note mt-2">Grupo de WhatsApp</p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section
        id="experiencias"
        className="page-shell section-py"
        aria-labelledby="experiencias-titulo"
      >
        <div className="section-heading">
          <div>
            <p className="eyebrow">03 / Fuera del salón</p>
            <h2 id="experiencias-titulo" className="h2">
              Las experiencias dejan huella.
            </h2>
          </div>
          <p className="section-note">
            Fotografías de estudiantes de la facultad: competencias, visitas y proyectos
            compartidos. Cada pie dice dónde y cuándo.
          </p>
        </div>

        <Gallery photos={GALLERY} />
      </section>

      <section id="participar" className="page-shell pb-16" aria-labelledby="participar-titulo">
        <div className="surface panel-pad reveal grid gap-8 md:grid-cols-2">
          <div>
            <p className="eyebrow">04 / Tu siguiente paso</p>
            <h2 id="participar-titulo" className="h2 mt-4">
              Mantén la curiosidad en movimiento.
            </h2>
            <p className="mt-4 text-sm muted">
              Empieza con el primer entregable de tu ruta y compártelo en el canal de Teams de tu
              especialidad.
            </p>
            <Link to="/resultados" className="btn-green mt-6">
              Volver a mi ruta <span aria-hidden="true">↗</span>
            </Link>
          </div>

          <div className="rounded-2xl bg-green-soft p-6">
            <h3 className="h3">Próximos eventos</h3>
            {EVENTS.length === 0 ? (
              <p className="mt-3 text-sm muted">
                Todavía no hay eventos publicados. Cuando la rama confirme su agenda, aquí
                encontrarás fecha, lugar e indicaciones para participar.
              </p>
            ) : (
              <ul className="mt-3 space-y-2 text-sm">
                {EVENTS.map((event) => (
                  <li key={`${event.date}-${event.name}`}>
                    <time dateTime={event.date} className="font-semibold">
                      {event.date}
                    </time>{' '}
                    · {event.name} · {event.place}
                  </li>
                ))}
              </ul>
            )}
            <p className="mt-5 border-t border-ink/15 pt-5 text-sm">
              Otros espacios —clubes, representación estudiantil y movilidad— se incorporarán cuando
              contemos con información verificada.
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Community

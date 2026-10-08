import { PILOT, TESTIMONIALS } from '../../data/testimonials'

/**
 * "Lo que dicen quienes ya lo probaron": citas reales y autorizadas de
 * participantes del piloto, o nada.
 *
 * Estados (ver docs/PILOTO.md → Estados de publicación):
 *
 * - Sin citas y sin convocatoria abierta → no se renderiza nada. No hay
 *   tarjetas vacías ni texto provisional.
 * - Sin citas, convocatoria abierta con enlace real → invitación a participar.
 * - Una o más citas → sólo esas; la rejilla se adapta y no se rellena a tres.
 *
 * Sin carrusel, sin estrellas, sin promedios: una cita se lee completa y
 * quieta, y una calificación agregada exigiría un instrumento que no existe.
 */
function Testimonials() {
  if (TESTIMONIALS.length === 0) {
    if (PILOT.status !== 'recruiting' || !PILOT.callUrl) return null

    return (
      <section className="page-shell pb-16" aria-labelledby="piloto-titulo">
        <div className="surface panel-pad flex flex-wrap items-center justify-between gap-6">
          <div className="max-w-xl">
            <p className="eyebrow">Prueba piloto</p>
            <h2 id="piloto-titulo" className="h2 mt-3">
              Ayúdanos a mejorar PotroPath.
            </h2>
            <p className="mt-4 text-sm muted">
              Buscamos estudiantes de Ingeniería en Computación para una sesión de prueba. Evaluamos
              la herramienta, no a quien participa.
            </p>
          </div>
          <a href={PILOT.callUrl} target="_blank" rel="noreferrer" className="btn-green">
            Quiero participar <span aria-hidden="true">↗</span>
          </a>
        </div>
      </section>
    )
  }

  return (
    <section className="bg-paper-alt section-py" aria-labelledby="voces-titulo">
      <div className="page-shell">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Voces del piloto</p>
            <h2 id="voces-titulo" className="h2">
              Lo que dicen quienes ya lo probaron.
            </h2>
          </div>
          <p className="section-note">
            Opiniones de participantes del piloto, publicadas con su autorización. Son experiencias
            individuales, no resultados generalizables.
            {PILOT.reportUrl && (
              <>
                {' '}
                <a href={PILOT.reportUrl} className="underline underline-offset-4">
                  Ver resultados del piloto
                </a>
              </>
            )}
          </p>
        </div>

        <div className="quote-grid">
          {TESTIMONIALS.map((item) => (
            <figure key={item.id} className="surface quote-card">
              <blockquote>
                <p>«{item.quote}»</p>
              </blockquote>
              <figcaption className="text-sm">
                <strong className="block">{item.displayName}</strong>
                <span className="muted">
                  {[item.context, item.cohortLabel].filter(Boolean).join(' · ')}
                </span>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Testimonials

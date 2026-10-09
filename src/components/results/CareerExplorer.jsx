import { useState } from 'react'
import { AREA_BY_ID } from '../../data/areas'
import { CAREERS } from '../../data/careers'
import { ROADMAP } from '../../data/roadmap'
import { DEFAULT_LOCATION, LINKEDIN_JOBS_URL, linkedInSearch } from '../../lib/careerSearch'
import { formatReviewDate } from '../../lib/format'

/**
 * Dos bloques que responden "¿dónde se usa esto?":
 *
 * 1. **Perfiles de referencia.** Un selector con los cinco ejemplos y una
 *    ficha con responsabilidades, requisitos mínimos separados de los
 *    deseables y las habilidades de la ruta que se relacionan. Arranca en el
 *    perfil del área explorada, pero los cinco quedan a un clic.
 * 2. **Búsqueda en LinkedIn.** Un formulario GET nativo con puesto y
 *    ubicación: funciona aunque falle el JavaScript, y sólo envía esos dos
 *    campos. No hay feed de vacantes ni extracción de resultados.
 */
function CareerExplorer({ areaId }) {
  const [selectedId, setSelectedId] = useState(
    () => CAREERS.find((role) => role.areaId === areaId)?.id ?? CAREERS[0].id,
  )
  const [keywords, setKeywords] = useState(ROADMAP[areaId].search)
  const [location, setLocation] = useState(DEFAULT_LOCATION)

  const selected = CAREERS.find((role) => role.id === selectedId)
  const related = ROADMAP[selected.areaId].learning.filter((skill) =>
    selected.skillIds.includes(skill.id),
  )
  // El título de una convocatoria trae su temporada ("· 2026"); para buscar
  // puestos parecidos sólo sirve el nombre del rol.
  const similarSearch = linkedInSearch(selected.title.split(' · ')[0], location || DEFAULT_LOCATION)
  const canSearch = keywords.trim() !== '' && location.trim() !== ''

  return (
    <>
      <section id="puestos" className="route-block" aria-labelledby="puestos-titulo">
        <div className="section-heading">
          <div>
            <p className="eyebrow">
              03 / Conoce el rol <span className="route-area-tag">{AREA_BY_ID[areaId].name}</span>
            </p>
            <h2 id="puestos-titulo" className="h2">
              Así se trabaja en tecnología.
            </h2>
          </div>
          <p className="section-note">
            Perfiles publicados por empresas tech. Son ejemplos para entender cada rol; cada ficha
            tiene su propia ubicación y requisitos.
          </p>
        </div>

        <div className="career-layout">
          <div className="career-list" role="group" aria-label="Perfiles de referencia">
            {CAREERS.map((role) => (
              <button
                key={role.id}
                type="button"
                className="career-button"
                aria-pressed={selectedId === role.id}
                aria-controls="detalle-puesto"
                onClick={() => setSelectedId(role.id)}
              >
                <span className="eyebrow block">{role.company}</span>
                <span className="mt-1 block text-sm font-semibold">{role.title}</span>
                <span className="source-note mt-1 block">{AREA_BY_ID[role.areaId].name}</span>
              </button>
            ))}
          </div>

          <div id="detalle-puesto" aria-live="polite">
            <article key={selected.id} className="surface panel-pad swap-in">
              <p className="eyebrow">{selected.company} · Perfil de referencia</p>
              <h3 className="h2 mt-3">{selected.title}</h3>
              <div className="mt-4 flex flex-wrap gap-2">
                <span className="pill">{selected.location}</span>
                <span className="pill">{selected.level}</span>
              </div>
              <p className="mt-5 text-sm muted">{selected.summary}</p>

              <h4 className="h3 mt-6 mb-2">En el día a día</h4>
              <ul className="detail-list">
                {selected.responsibilities.map((text) => (
                  <li key={text}>{text}</li>
                ))}
              </ul>

              <div className="requirements">
                <div>
                  <h4 className="h3 mb-2">Lo que solicitan</h4>
                  <ul className="detail-list">
                    {selected.required.map((text) => (
                      <li key={text}>{text}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className="h3 mb-2">Lo que suma</h4>
                  <ul className="detail-list">
                    {selected.preferred.map((text) => (
                      <li key={text}>{text}</li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="rounded-2xl bg-green-soft p-5">
                <p className="eyebrow">Conecta con tu ruta</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {related.map((skill) => (
                    <span key={skill.id} className="pill bg-paper">
                      {skill.name}
                    </span>
                  ))}
                </div>
                <p className="mt-4 text-sm">{selected.project}</p>
                <p className="source-note mt-2">
                  Proyecto sugerido por PotroPath, no solicitado por la empresa.
                </p>
              </div>

              <div className="mt-5 flex flex-wrap gap-x-6">
                <a href={selected.sourceUrl} target="_blank" rel="noreferrer" className="text-link">
                  Consultar ficha original <span aria-hidden="true">↗</span>
                </a>
                <a href={similarSearch} target="_blank" rel="noreferrer" className="text-link">
                  Puestos similares en LinkedIn <span aria-hidden="true">↗</span>
                </a>
              </div>
              <p className="source-note mt-2">
                Revisada el{' '}
                <time dateTime={selected.reviewedAt}>{formatReviewDate(selected.reviewedAt)}</time>.
                Resumen de la ficha; su disponibilidad puede cambiar. No representa una asociación
                con PotroPath.
              </p>
            </article>
          </div>
        </div>
      </section>

      <section
        id="oportunidades"
        className="dark-panel reveal my-10"
        aria-labelledby="oportunidades-titulo"
      >
        <p className="eyebrow">04 / Busca</p>
        <h2 id="oportunidades-titulo" className="h2 mt-3">
          Tu próxima búsqueda empieza aquí.
        </h2>
        <p className="mt-4 mb-7 max-w-2xl text-sm text-paper/85">
          Ajusta el puesto y la ubicación. Abriremos la búsqueda en LinkedIn para que consultes las
          oportunidades disponibles allí.
        </p>

        <form className="search-grid" action={LINKEDIN_JOBS_URL} method="get" target="_blank">
          <div>
            <label className="field-label" htmlFor="job-keywords">
              Puesto o palabras clave
            </label>
            <input
              id="job-keywords"
              className="field"
              name="keywords"
              required
              maxLength={120}
              value={keywords}
              onChange={(event) => setKeywords(event.target.value)}
              placeholder="Ej. Data Analyst Junior"
            />
          </div>
          <div>
            <label className="field-label" htmlFor="job-location">
              Ubicación
            </label>
            <input
              id="job-location"
              className="field"
              name="location"
              required
              maxLength={100}
              value={location}
              onChange={(event) => setLocation(event.target.value)}
              placeholder="Ej. Toluca, México"
            />
          </div>
          <button type="submit" className="btn-light" disabled={!canSearch}>
            Buscar en LinkedIn <span aria-hidden="true">↗</span>
          </button>
        </form>

        <p className="mt-4 text-xs text-paper/80">
          Se abre otra pestaña. LinkedIn puede pedir iniciar sesión; allí puedes filtrar por
          experiencia y modalidad. Tus respuestas del diagnóstico no se envían.
        </p>
      </section>
    </>
  )
}

export default CareerExplorer

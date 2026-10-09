import { useState } from 'react'
import { STAGES } from '../../data/roadmap'

/**
 * Las habilidades de una ruta como secuencia por etapas, con el detalle de
 * la seleccionada al lado. Sustituye a la lista plana de sustantivos de la
 * primera versión, que no decía por dónde empezar ni cómo practicar.
 *
 * Seleccionar una habilidad sólo cambia el detalle: no la marca como
 * aprendida. No hay progreso persistente porque explorar no es dominar.
 */
function SkillPath({ route, areaName }) {
  const [selectedId, setSelectedId] = useState(route.learning[0].id)
  const selected = route.learning.find((skill) => skill.id === selectedId) ?? route.learning[0]

  return (
    <section id="habilidades" className="route-block" aria-labelledby="habilidades-titulo">
      <div className="section-heading">
        <div>
          <p className="eyebrow">
            01 / Aprende <span className="route-area-tag">{areaName}</span>
          </p>
          <h2 id="habilidades-titulo" className="h2">
            Las habilidades, en orden.
          </h2>
        </div>
        <p className="section-note">
          Elige una habilidad para ver para qué sirve y con qué entregable empezar a practicarla.
        </p>
      </div>

      <div className="skill-layout">
        <div className="reveal">
          {STAGES.map((stage, index) => (
            <div key={stage} className="skill-stage">
              <p className="eyebrow">
                Etapa {index + 1} · {stage}
              </p>
              <div className="choice-group" role="group" aria-label={stage}>
                {route.learning
                  .filter((skill) => skill.stage === index)
                  .map((skill) => (
                    <button
                      key={skill.id}
                      type="button"
                      className="choice"
                      aria-pressed={skill.id === selected.id}
                      aria-controls="detalle-habilidad"
                      onClick={() => setSelectedId(skill.id)}
                    >
                      {skill.name}
                    </button>
                  ))}
              </div>
            </div>
          ))}
        </div>

        {/* `aria-live` vive en el contenedor estable; la `key` del hijo lo
            vuelve a montar para animar el cambio sin perder el anuncio. */}
        <div id="detalle-habilidad" aria-live="polite">
          <div key={selected.id} className="skill-detail swap-in">
            <span className="pill bg-paper">
              Etapa {selected.stage + 1} · {STAGES[selected.stage]}
            </span>
            <h3 className="h2 mt-5">{selected.name}</h3>
            <p className="mt-4 text-sm muted">{selected.purpose}</p>
            <div className="project-box">
              <p className="eyebrow">Tu primer entregable</p>
              <p className="mt-3 text-sm">{selected.project}</p>
              <p className="source-note mt-4">
                Actividad sugerida por PotroPath. No es un requisito de contratación.
              </p>
            </div>
          </div>
        </div>
      </div>

      <p className="source-note mt-6">
        Secuencia orientativa. Tu afinidad expresa intereses; no mide cuánto dominas estas
        habilidades.
      </p>
    </section>
  )
}

export default SkillPath

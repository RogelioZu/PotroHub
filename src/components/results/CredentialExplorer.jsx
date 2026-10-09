import { useState } from 'react'
import { CREDENTIALS } from '../../data/credentials'
import { formatReviewDate } from '../../lib/format'
import Icon from '../ui/Icon'

/** Las dimensiones con las que se comparan dos credenciales, en el mismo orden siempre. */
const DIMENSIONS = [
  ['Tipo', 'type'],
  ['Nivel', 'level'],
  ['Preparación', 'prerequisites'],
  ['Evaluación', 'assessment'],
  ['Enfoque', 'skills'],
]

const STATUS = [
  'Marca dos opciones para verlas lado a lado.',
  'Una opción seleccionada. Marca otra para comparar.',
  'Comparando las dos opciones seleccionadas.',
]

/**
 * Tarjetas de credenciales y comparación de dos por las mismas dimensiones.
 *
 * La selección es un checkbox nativo y no una tarjeta que se pulsa: así el
 * estado lo anuncia el navegador y el enlace al programa sigue siendo un
 * enlace. Marcar una tercera opción desplaza a la más antigua, para que la
 * comparación nunca quede con tres columnas que no caben en un teléfono.
 */
function CredentialExplorer({ ids, areaName }) {
  const [selected, setSelected] = useState([])
  const credentials = ids.map((id) => CREDENTIALS[id])
  const comparison = credentials.filter((credential) => selected.includes(credential.id))

  const toggle = (id) =>
    setSelected((current) =>
      current.includes(id) ? current.filter((item) => item !== id) : [...current, id].slice(-2),
    )

  return (
    <section id="credenciales" className="band band-gold" aria-labelledby="credenciales-titulo">
      <div className="page-shell">
        <div className="section-heading">
          <div>
            <p className="eyebrow">
              02 / Acredita <span className="route-area-tag">{areaName}</span>
            </p>
            <h2 id="credenciales-titulo" className="h2">
              Una credencial con sentido.
            </h2>
          </div>
          <p className="section-note">
            Compara enfoque y preparación antes de elegir. Un programa con certificado y una
            certificación por examen acreditan cosas distintas.
          </p>
        </div>

        <div className="credential-grid reveal-group">
          {credentials.map((credential) => {
            const isSelected = selected.includes(credential.id)
            return (
              <article
                key={credential.id}
                className="surface credential-card"
                data-selected={isSelected}
                aria-labelledby={`credencial-${credential.id}`}
              >
                <div className="flex items-center gap-3">
                  <span className="provider-mark" aria-hidden="true">
                    {credential.mark}
                  </span>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold">{credential.provider}</p>
                    <p className="source-note">{credential.type}</p>
                  </div>
                  <span className="pill ml-auto shrink-0">{credential.level}</span>
                </div>

                <h3 id={`credencial-${credential.id}`} className="h3">
                  {credential.name}
                </h3>
                <p className="text-sm muted">{credential.purpose}</p>

                <dl className="credential-meta">
                  <dt>Preparación</dt>
                  <dd>{credential.prerequisites}</dd>
                  <dt>Enfoque</dt>
                  <dd>{credential.skills}</dd>
                </dl>

                <div className="credential-actions">
                  <label className="check-label">
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => toggle(credential.id)}
                    />
                    Comparar
                    <span className="sr-only"> {credential.name}</span>
                  </label>
                  <a className="text-link" href={credential.sourceUrl} target="_blank" rel="noreferrer">
                    Ver programa oficial <Icon name="arrow-up-right" />
                    <span className="sr-only"> (abre otra pestaña)</span>
                  </a>
                </div>

                <p className="source-note">
                  Fuente: sitio del proveedor · revisada el{' '}
                  <time dateTime={credential.reviewedAt}>{formatReviewDate(credential.reviewedAt)}</time>
                </p>
              </article>
            )
          })}
        </div>

        <p className="mt-4 text-sm muted" role="status">
          {STATUS[comparison.length]}
        </p>

        {comparison.length === 2 && (
          <div className="comparison swap-in" role="region" aria-label="Comparación de credenciales">
            <div className="mb-4 flex flex-wrap items-center justify-between gap-4">
              <h3 className="h3">Elige por lo que necesitas aprender.</h3>
              <button type="button" className="text-link" onClick={() => setSelected([])}>
                Limpiar comparación
              </button>
            </div>
            <div className="comparison-row">
              <span className="font-semibold">Programa</span>
              {comparison.map((credential) => (
                <strong key={credential.id}>{credential.name}</strong>
              ))}
            </div>
            {DIMENSIONS.map(([label, key]) => (
              <div key={key} className="comparison-row">
                <span className="font-semibold">{label}</span>
                {comparison.map((credential) => (
                  <p key={credential.id}>{credential[key]}</p>
                ))}
              </div>
            ))}
          </div>
        )}

        <p className="source-note caveat-note mt-5">
          Consulta precio, idioma y condiciones en el sitio del proveedor. Obtener una credencial no
          garantiza una contratación.
        </p>
      </div>
    </section>
  )
}

export default CredentialExplorer

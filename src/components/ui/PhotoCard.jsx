import { useState } from 'react'

/**
 * Fotografía con degradación elegante: si `src` todavía no existe, cae al
 * mismo aviso de borde punteado que el resto del sitio usa para contenido
 * pendiente (ver DESIGN.md → Shapes), en vez de mostrar el recuadro roto
 * del navegador o dejar un vacío mudo.
 *
 * `caption`, si se da, se superpone dentro de la foto en el componente
 * `badge-overlay` ya documentado (`rgb(37 37 37 / 70%)`, `rounded-md`,
 * texto `Papel`) — el mismo patrón que usan la tarjeta del vitral y las
 * tarjetas de área.
 */
function PhotoCard({ src, alt = '', caption, aspect = 'aspect-4/3', rounded = 'rounded-xl', className = '' }) {
  const [failed, setFailed] = useState(false)

  if (failed) {
    // El nombre no puede desaparecer sólo porque la foto todavía no existe
    // — sigue siendo la información real de la tarjeta, la foto es la
    // que falta.
    return (
      <div
        className={`flex ${aspect} ${rounded} flex-col items-center justify-center gap-1 border border-dashed border-ink/15 bg-paper-alt px-4 text-center ${className}`}
      >
        {caption && <p className="text-sm font-bold text-ink">{caption}</p>}
        <p className="text-xs text-ink-soft/70">Foto pendiente de agregar en /public/images/comunidad</p>
      </div>
    )
  }

  return (
    <figure className={`relative overflow-hidden ${aspect} ${rounded} shadow-sm shadow-ink/5 ${className}`}>
      <img
        src={src}
        alt={alt}
        className="h-full w-full object-cover"
        loading="lazy"
        onError={() => setFailed(true)}
      />
      {caption && (
        <figcaption className="absolute inset-x-3 bottom-3 rounded-md bg-ink/70 px-3 py-2 text-sm font-bold text-paper">
          {caption}
        </figcaption>
      )}
    </figure>
  )
}

export default PhotoCard

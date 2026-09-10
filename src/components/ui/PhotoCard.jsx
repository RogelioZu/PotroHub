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
 *
 * `as` cambia la etiqueta que se dibuja, y existe por una sola razón: la fila
 * de canal de Comunidad es un `<button>` que voltea, y dentro de un botón
 * sólo cabe contenido de frase — un `<figure>` o un `<div>` ahí es marcado
 * inválido. Con `as="span"` la foto entra en ese contexto sin que la página
 * tenga que rehacer la degradación elegante por su cuenta — y va siempre con
 * `compact`, que es el único modo cuyo aviso de pendiente no lleva `<p>`.
 */
function PhotoCard({
  src,
  alt = '',
  caption,
  aspect = 'aspect-4/3',
  rounded = 'rounded-xl',
  compact = false,
  as,
  className = '',
}) {
  const [failed, setFailed] = useState(false)
  const Frame = as ?? (failed ? 'div' : 'figure')
  const Caption = as ?? 'figcaption'

  if (failed) {
    // El nombre no puede desaparecer sólo porque la foto todavía no existe
    // — sigue siendo la información real de la tarjeta, la foto es la
    // que falta. `compact` es para miniaturas donde ni el nombre ni la
    // frase de "pendiente" caben sin desbordar: ahí basta el hueco punteado,
    // el nombre real vive junto a la miniatura, no encima de ella.
    return (
      <Frame
        className={`flex ${aspect} ${rounded} flex-col items-center justify-center gap-1 border border-dashed border-ink/15 bg-paper-alt text-center ${
          compact ? '' : 'px-4'
        } ${className}`}
      >
        {!compact && (
          <>
            {caption && <p className="text-sm font-bold text-ink">{caption}</p>}
            <p className="text-xs text-ink-soft/70">Foto pendiente de agregar en /public/images/comunidad</p>
          </>
        )}
      </Frame>
    )
  }

  return (
    <Frame className={`relative block overflow-hidden ${aspect} ${rounded} shadow-sm shadow-ink/5 ${className}`}>
      <img
        src={src}
        alt={alt}
        className="h-full w-full object-cover"
        loading="lazy"
        onError={() => setFailed(true)}
      />
      {caption && (
        <Caption className="absolute inset-x-3 bottom-3 block rounded-md bg-ink/70 px-3 py-2 text-sm font-bold text-paper">
          {caption}
        </Caption>
      )}
    </Frame>
  )
}

export default PhotoCard

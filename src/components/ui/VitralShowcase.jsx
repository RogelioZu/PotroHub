import { useState } from 'react'

/**
 * Espacio dedicado a la fotografía del vitral de la biblioteca de la
 * Facultad de Ingeniería, con la etiqueta superpuesta sobre la imagen
 * (mismo patrón de tarjeta fotográfica que usa uaemex.mx). Si
 * `/images/vitral-biblioteca.jpg` todavía no existe, se muestra un
 * placeholder con el acento decorativo `vitral-accent` en lugar de romper
 * el layout.
 */
function VitralShowcase({ caption = 'El vitral de nuestra biblioteca', className = '' }) {
  const [imageFailed, setImageFailed] = useState(false)

  return (
    <figure
      className={`relative overflow-hidden rounded-xl shadow-lg shadow-ink/10 ring-1 ring-ink/5 ${className}`}
    >
      {imageFailed ? (
        <div className="vitral-accent flex aspect-video w-full items-center justify-center">
          <span className="rounded-full bg-ink/70 px-4 py-2 text-xs text-paper">
            Imagen pendiente de colocar en /public/images/vitral-biblioteca.jpg
          </span>
        </div>
      ) : (
        <img
          src="/images/vitral-biblioteca.jpg"
          alt={caption}
          className="aspect-video w-full object-cover"
          onError={() => setImageFailed(true)}
        />
      )}
      <figcaption className="absolute bottom-4 left-4 rounded-md bg-ink/70 px-4 py-2 text-sm font-medium text-paper">
        {caption}
      </figcaption>
    </figure>
  )
}

export default VitralShowcase

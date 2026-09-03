import { useState } from 'react'

/**
 * Espacio dedicado a la fotografía del vitral de la biblioteca de la
 * Facultad de Ingeniería. Si `/images/vitral-biblioteca.jpg` todavía no
 * existe, se muestra un placeholder con el acento decorativo `vitral-accent`
 * en lugar de romper el layout.
 */
function VitralShowcase({ caption = 'Vitral — Biblioteca, Facultad de Ingeniería (UAEMéx)', className = '' }) {
  const [imageFailed, setImageFailed] = useState(false)

  return (
    <figure className={`overflow-hidden rounded-2xl border border-potro-gold/30 ${className}`}>
      {imageFailed ? (
        <div className="vitral-accent flex aspect-video w-full items-center justify-center">
          <span className="rounded-full bg-potro-black/60 px-4 py-2 text-xs text-potro-white-soft">
            Imagen del vitral pendiente de colocar en /public/images/vitral-biblioteca.jpg
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
      <figcaption className="bg-potro-black-soft px-4 py-2 text-center text-xs text-potro-white-soft">
        {caption}
      </figcaption>
    </figure>
  )
}

export default VitralShowcase

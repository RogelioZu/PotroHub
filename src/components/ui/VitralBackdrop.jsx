import { useState } from 'react'

/**
 * Fondo fotográfico del vitral de la biblioteca de la Facultad de
 * Ingeniería, para usarse detrás del header y el footer. Si
 * `/images/vitral-biblioteca.png` todavía no existe, cae de vuelta al
 * acento decorativo `vitral-accent` en lugar de dejar un hueco vacío.
 * El contenido que va encima (nav, marca, columnas del footer) debe
 * colocarse en un contenedor hermano con `relative z-10`. Pasa
 * `scrimClassName=""` cuando el vitral deba lucir a todo color, sin filtro.
 */
function VitralBackdrop({ scrimClassName = 'bg-ink/75' }) {
  const [imageFailed, setImageFailed] = useState(false)

  return (
    <div className="absolute inset-0 overflow-hidden" aria-hidden="true">
      {imageFailed ? (
        <div className="vitral-accent h-full w-full" />
      ) : (
        <img
          src="/images/vitral-biblioteca.png"
          alt=""
          className="h-full w-full object-cover"
          onError={() => setImageFailed(true)}
        />
      )}
      <div className={`absolute inset-0 ${scrimClassName}`} />
    </div>
  )
}

export default VitralBackdrop

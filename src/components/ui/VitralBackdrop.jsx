import { useState } from 'react'
import { refreshScrollTriggers } from '../../lib/gsap'

/**
 * Fondo fotográfico del vitral de la biblioteca de la Facultad de
 * Ingeniería, para usarse detrás del header y el footer. Si
 * `/images/vitral-biblioteca.webp` todavía no existe, cae de vuelta al
 * acento decorativo `vitral-accent` en lugar de dejar un hueco vacío.
 * El contenido que va encima (nav, marca, columnas del footer) debe
 * colocarse en un contenedor hermano con `relative z-10`.
 *
 * `scrim` elige cómo se defiende ese contenido:
 *
 * - `band` (por defecto) — franja de lectura direccional: tinta a plena
 *   fuerza donde cae el contenido, desvanecida en el canalón de arriba y
 *   abajo, donde nunca hay letras. Es lo que hace legible el header y el
 *   footer sin apagar la fotografía entera. Ver `.vitral-scrim`.
 * - `none` — la fotografía sin nada encima. Para cuando el vitral es el
 *   contenido y no el fondo de un texto.
 */
function VitralBackdrop({ scrim = 'band' }) {
  const [imageFailed, setImageFailed] = useState(false)

  return (
    <div className="absolute inset-0 overflow-hidden" aria-hidden="true">
      {imageFailed ? (
        <div className="vitral-accent h-full w-full" />
      ) : (
        <img
          src="/images/vitral-biblioteca.webp"
          alt=""
          className="h-full w-full object-cover"
          onError={() => setImageFailed(true)}
          // El vitral llega después del primer render y cambia el alto del
          // header y del footer; sin esto los disparadores de scroll quedan
          // midiendo una página que ya no existe.
          onLoad={refreshScrollTriggers}
        />
      )}
      
    </div>
  )
}

export default VitralBackdrop

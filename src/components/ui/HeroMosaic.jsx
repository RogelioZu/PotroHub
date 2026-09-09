import { useState } from 'react'
import VitralShowcase from './VitralShowcase'

/** Una pieza del collage se oculta si falta, en vez de mostrar el recuadro roto del navegador. */
function hideOnError(event) {
  event.currentTarget.style.display = 'none'
}

/**
 * Doce recortes fotográficos, superpuestos y girados a mano — computadora
 * retro, CD, máquina de escribir, teléfono de disco... hasta laptop,
 * smartphone, cámara y lentes VR actuales. `top`/`left`/`width` son
 * porcentajes del contenedor cuadrado, así que toda la composición escala
 * como una sola unidad entre teléfono y escritorio sin recalcular nada.
 * `z` sólo importa dentro de este arreglo: los índices más altos se pintan
 * encima.
 *
 * Ver `public/images/hero/README.md` para la especificación exacta de cada
 * archivo y el porqué del orden "antes → ahora".
 */
const COLLAGE_ITEMS = [
  { src: 'disco-compacto.png', alt: '', top: 1, left: 3, width: 34, rotate: -6, z: 1 },
  { src: 'computadora-retro.png', top: 33, left: 0, width: 27, rotate: -3, z: 2 },
  { src: 'reproductor-cd.png', top: 0, left: 30, width: 19, rotate: 5, z: 3 },
  { src: 'maquina-escribir.png', top: 3, left: 52, width: 31, rotate: 3, z: 2 },
  { src: 'telefono-disco.png', top: 24, left: 64, width: 27, rotate: -5, z: 3 },
  { src: 'casete.png', top: 55, left: 21, width: 19, rotate: 9, z: 5 },
  { src: 'camara.png', top: 40, left: 33, width: 21, rotate: -4, z: 4 },
  { src: 'chip-ia.png', top: 26, left: 41, width: 15, rotate: 0, z: 6 },
  { src: 'celular-plegable.png', top: 47, left: 57, width: 31, rotate: 2, z: 1 },
  { src: 'celular-moderno.png', top: 65, left: 1, width: 26, rotate: 6, z: 5 },
  { src: 'lentes-vr.png', top: 61, left: 45, width: 24, rotate: -3, z: 4 },
  { src: 'laptop-moderna.png', top: 69, left: 68, width: 27, rotate: 4, z: 5 },
]

/**
 * El mosaico del hero.
 *
 * Un vitral es, literalmente, celdas de color separadas por plomo: la
 * geometría modular no es un préstamo de moda, es la geometría del activo
 * insignia del sitio. De ahí sale la composición — la franja panorámica del
 * vitral arriba y, debajo, el collage técnico y las dos celdas de dato.
 *
 * El collage no lleva tarjeta ni fondo detrás — los doce recortes flotan
 * directo sobre el papel, como en la referencia — y cada uno lleva un
 * `drop-shadow` sutil para el efecto de recorte-y-pegado. Es la segunda
 * excepción documentada a la regla de la Sombra Fotográfica de DESIGN.md
 * (la primera es VitralShowcase), acotada igual: sólo estas doce imágenes,
 * sólo en esta celda.
 *
 * Las dos celdas redondas son la versión honesta de las burbujas de cifra
 * que usan las landings educativas ("120k estudiantes"): aquí sólo pueden
 * decir cosas verdaderas y verificables del producto — cuántas preguntas
 * son y cuántas áreas mide. Ningún dato institucional inventado
 * (ver PRODUCT.md → Evidence on Hand). Son verdes y no doradas a propósito:
 * representan un dato, y el dato es territorio del verde.
 */
function HeroMosaic({ className = '' }) {
  // El fondo punteado sólo se ve mientras NINGUNA pieza ha cargado, así que
  // desaparece en cuanto la primera imagen real llega — no hace falta seguir
  // el estado de las doce, sólo si alguna ya está ahí.
  const [hasLoadedAny, setHasLoadedAny] = useState(false)

  return (
    <div className={`flex flex-col gap-3 ${className}`}>
      <VitralShowcase />

      <div
        data-mosaic-cell
        className={`relative aspect-square w-full ${
          hasLoadedAny ? '' : 'rounded-xl border border-dashed border-ink/15'
        }`}
      >
        {!hasLoadedAny && (
          <p className="absolute inset-0 flex items-center justify-center px-6 text-center text-sm text-ink-soft/70">
            Collage pendiente de agregar en /public/images/hero
          </p>
        )}
        {COLLAGE_ITEMS.map((item) => (
          <img
            key={item.src}
            src={`/images/hero/${item.src}`}
            alt={item.alt ?? ''}
            onError={hideOnError}
            onLoad={() => setHasLoadedAny(true)}
            loading="lazy"
            className="absolute drop-shadow-sm"
            style={{
              top: `${item.top}%`,
              left: `${item.left}%`,
              width: `${item.width}%`,
              transform: `rotate(${item.rotate}deg)`,
              zIndex: item.z,
            }}
          />
        ))}
      </div>

      <div className="flex gap-3">
        <p
          data-mosaic-cell
          className="flex aspect-square w-2/5 flex-col items-center justify-center rounded-full bg-green-mid text-center text-paper"
        >
          <span className="text-3xl leading-none font-bold sm:text-4xl">50</span>
          <span className="mt-1 text-xs">preguntas</span>
        </p>

        <p
          data-mosaic-cell
          className="flex w-3/5 items-center justify-center rounded-full bg-green-soft px-4 py-4 text-center text-sm leading-tight font-semibold text-green"
        >
          5 áreas de especialización
        </p>
      </div>
    </div>
  )
}

export default HeroMosaic

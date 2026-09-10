import { Children, isValidElement } from 'react'

/**
 * La composición del mosaico: qué huecos hay, qué forma tiene cada uno y
 * dónde cae en la rejilla de 4×4. Es geometría, no contenido — por eso vive
 * aquí y no en `src/data/`: cambiar una posición es cambiar el dibujo del
 * hero, no editar un texto.
 *
 * Un vitral es, literalmente, celdas de color separadas por plomo. La rejilla
 * modular es la geometría del propio activo insignia, no un préstamo de una
 * landing de moda.
 */
const CELLS = [
  { name: 'circle-main', shape: 'circle', tone: 'bg-green-mid', area: 'col-span-2 row-span-2' },
  { name: 'circle-portrait', shape: 'circle', tone: 'bg-gold-light', area: 'col-start-3 row-span-2' },
  { name: 'square-top', shape: 'square', tone: 'bg-green', area: 'col-start-4 row-span-2 rounded-tr-[3rem]' },
  { name: 'pill-wide', shape: 'pill', tone: 'bg-gold', area: 'col-start-2 row-start-3' },
  { name: 'circle-small', shape: 'circle', tone: 'bg-green-mid', area: 'col-start-1 row-start-3' },
  { name: 'square-bottom', shape: 'square', tone: 'bg-green-soft', area: 'col-span-2 row-start-4 rounded-bl-[3rem]' },
]

/** La forma decide el radio; la pastilla además ocupa dos columnas. */
const SHAPE_CLASS = {
  circle: 'rounded-full',
  pill: 'col-span-2 rounded-full',
  square: 'rounded-[2rem]',
}

/**
 * Nombres válidos de hueco. No se exporta a propósito: sacarlo de aquí
 * rompería Fast Refresh —un archivo de componente que además exporta
 * constantes deja de recargarse en caliente— y su único consumidor es el
 * aviso de desarrollo de abajo. Quien componga el mosaico los encuentra en
 * la documentación de `HeroMosaic` y, si se equivoca, en la consola.
 */
const MOSAIC_SLOTS = CELLS.map((cell) => cell.name)

/**
 * Marcador declarativo: nunca se renderiza por sí mismo. `HeroMosaic` lo lee
 * de sus hijos para saber qué contenido va en qué hueco, y lo monta dentro
 * de la celda que le corresponde.
 */
function Slot() {
  return null
}

/**
 * Andamio geométrico del hero: es dueño de la rejilla, de las seis celdas con
 * su forma y su posición, de los tres adornos sueltos y del tratamiento del
 * hueco vacío. No es dueño de lo que va dentro.
 *
 * El contenido se inyecta por nombre, de modo que cambiar qué ocupa un hueco
 * —una fotografía, una cifra, nada— no toca el dibujo:
 *
 *     <HeroMosaic>
 *       <HeroMosaic.Slot name="circle-main">
 *         <img src="…" alt="…" />
 *       </HeroMosaic.Slot>
 *     </HeroMosaic>
 *
 * Un hueco sin `Slot` se queda como bloque de color con su filete interior,
 * que es como el sistema señala "aquí va algo que todavía no existe" sin
 * enseñarle texto provisional al estudiante.
 */
function HeroMosaic({ children, className = '' }) {
  const filled = new Map()

  Children.forEach(children, (child) => {
    if (!isValidElement(child)) return

    if (child.type !== Slot) {
      if (import.meta.env.DEV) {
        console.warn('HeroMosaic sólo acepta <HeroMosaic.Slot> como hijo directo.')
      }
      return
    }

    // Un nombre mal escrito desaparecería en silencio: el hueco se quedaría
    // vacío y no habría nada que lo explicara.
    if (import.meta.env.DEV && !MOSAIC_SLOTS.includes(child.props.name)) {
      console.warn(
        `HeroMosaic: el hueco "${child.props.name}" no existe. Válidos: ${MOSAIC_SLOTS.join(', ')}.`,
      )
    }

    filled.set(child.props.name, child.props.children)
  })

  return (
    <div className={`relative mx-auto aspect-square w-full max-w-[32rem] ${className}`}>
      <div className="absolute inset-[8%] grid grid-cols-4 grid-rows-4 gap-2 sm:gap-3">
        {CELLS.map(({ name, shape, tone, area }) => {
          const content = filled.get(name)

          return (
            <div
              key={name}
              // `data-mosaic-cell` es lo que busca la secuencia de entrada del
              // hero en `Home.jsx`. El atributo se llamaba `data-image-slot` y
              // nadie lo consultaba: el escalonado de las celdas apuntaba a un
              // selector que no existía y no animaba nada.
              data-mosaic-cell={name}
              // Vacío es decoración: un bloque de color no tiene nada que
              // anunciar. Con contenido, la semántica la trae el contenido.
              aria-hidden={content ? undefined : 'true'}
              className={`relative overflow-hidden ${tone} ${SHAPE_CLASS[shape]} ${area} [&>img]:h-full [&>img]:w-full [&>img]:object-cover`}
            >
              {content}
              {/* El filete va encima del contenido, no debajo: es el plomo
                  entre celdas, y sobre una fotografía es donde se nota. */}
              <span className="pointer-events-none absolute inset-2 rounded-[inherit] border border-paper/35" />
            </div>
          )
        })}
      </div>

      {/* Los tres adornos viven fuera de la rejilla a propósito: rompen su
          cuadrícula por los bordes para que el mosaico no lea como una tabla. */}
      <span className="absolute -top-[8%] -right-[3%] h-[14%] w-[14%] rounded-tr-[3rem] bg-green" />
      <span className="absolute bottom-0 left-[28%] h-[12%] w-[24%] bg-gold-light [clip-path:polygon(0_0,100%_0,50%_100%)]" />
      <span className="absolute right-0 bottom-[18%] h-[18%] w-[18%] rounded-bl-[3rem] bg-gold-dark" />
    </div>
  )
}

HeroMosaic.Slot = Slot

export default HeroMosaic

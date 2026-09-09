import VitralShowcase from './VitralShowcase'

/** Un ícono se oculta si falta, en vez de mostrar el recuadro roto del navegador. */
function hideOnError(event) {
  event.currentTarget.style.display = 'none'
}

/**
 * El mosaico del hero.
 *
 * Un vitral es, literalmente, celdas de color separadas por plomo: la
 * geometría modular no es un préstamo de moda, es la geometría del activo
 * insignia del sitio. De ahí sale la composición — la franja panorámica del
 * vitral arriba, y debajo una celda de collage técnico junto a dos celdas de
 * dato.
 *
 * La celda de collage vive sobre `Papel Gris` y lleva tres ilustraciones en
 * PNG transparente (ver `public/images/hero/README.md` para la especificación
 * exacta). Son decorativas —la información real está en el titular y en las
 * tarjetas de área de abajo—, por eso `alt=""`.
 *
 * Las dos celdas redondas son la versión honesta de las burbujas de cifra que
 * usan las landings educativas ("120k estudiantes"): aquí sólo pueden decir
 * cosas verdaderas y verificables del producto — cuántas preguntas son y
 * cuántas áreas mide. Ningún dato institucional inventado
 * (ver PRODUCT.md → Evidence on Hand).
 *
 * Son verdes y no doradas a propósito: representan un dato, y el dato es
 * territorio del verde (ver DESIGN.md → La regla del Oro que Firma).
 *
 * La composición es de cajas flexibles y no de una rejilla de pistas fijas
 * para que el círculo siempre nazca de un ancho y nunca se deforme en elipse
 * ni se salga de su celda al cambiar el tamaño de la ventana.
 */
function HeroMosaic({ className = '' }) {
  return (
    <div className={`flex flex-col gap-3 ${className}`}>
      <VitralShowcase />

      {/*
        La celda de collage se lleva la parte ancha (3/5) y la columna de dato
        la estrecha (2/5): el círculo nace del ancho de su columna, así que
        acotarla es lo que evita que se coma la composición y deje a la
        pastilla como una rendija.
      */}
      <div className="flex gap-3">
        <div
          data-mosaic-cell
          className="relative w-3/5 overflow-hidden rounded-xl bg-paper-alt shadow-sm shadow-ink/5"
        >
          <img
            src="/images/hero/computadora.png"
            alt=""
            onError={hideOnError}
            loading="lazy"
            className="absolute inset-0 m-auto h-[62%] w-[62%] object-contain"
          />
          <img
            src="/images/hero/servidor.png"
            alt=""
            onError={hideOnError}
            loading="lazy"
            className="absolute top-4 left-4 h-[28%] w-[28%] object-contain"
          />
          <img
            src="/images/hero/ia.png"
            alt=""
            onError={hideOnError}
            loading="lazy"
            className="absolute right-4 bottom-4 h-[30%] w-[30%] object-contain"
          />
        </div>

        <div className="flex w-2/5 flex-col gap-3">
          <p
            data-mosaic-cell
            className="flex aspect-square w-full flex-col items-center justify-center rounded-full bg-green-mid text-center text-paper"
          >
            <span className="text-3xl leading-none font-bold sm:text-4xl">50</span>
            <span className="mt-1 text-xs">preguntas</span>
          </p>

          <p
            data-mosaic-cell
            className="flex flex-1 items-center justify-center rounded-full bg-green-soft px-4 py-4 text-center text-sm leading-tight font-semibold text-green"
          >
            5 áreas de especialización
          </p>
        </div>
      </div>
    </div>
  )
}

export default HeroMosaic

import { Children, useCallback, useEffect, useRef } from 'react'
import { prefersReducedMotion } from '../../lib/gsap'

/**
 * Tira horizontal de tarjetas con avance por scroll nativo.
 *
 * **No es el carrusel que DESIGN.md prohíbe.** Lo prohibido es el carrusel de
 * *testimonios* de una landing de bootcamp: un componente que existe para
 * rotar evidencia social y que aquí, además, exigiría una evidencia que no
 * hay. Éste es lo contrario: una galería de fotografías reales, sin rotación
 * automática y sin nada que se mueva solo. La página de Comunidad existe para
 * probar que la comunidad es real, y la prueba son las fotos — el carrusel es
 * la forma de recorrerlas sin que la página crezca sin fin.
 *
 * Tres decisiones que conviene no deshacer:
 *
 *  1. **Sin autoplay.** Nada avanza solo. Un carrusel que se mueve por su
 *     cuenta le quita al lector el control de la lectura, y es justo la
 *     energía de landing que la voz del producto rechaza.
 *  2. **El scroll es del navegador, no de JavaScript.** La tira es un
 *     contenedor `overflow-x` con `scroll-snap`: se arrastra con el dedo, con
 *     el trackpad y con el teclado aunque el JS no cargue nunca. Los botones
 *     sólo llaman a `scrollBy` — son un atajo, no el mecanismo. Es la misma
 *     tesis de *La regla del `from`*: el estado por defecto del marcado ya
 *     funciona.
 *  3. **Los botones no provocan re-render.** El estado de "¿llegué al
 *     extremo?" se escribe directo sobre el DOM desde el listener de scroll.
 *     Con `useState` cada píxel de arrastre re-renderizaría la tira completa
 *     con sus fotos.
 */
function Carousel({ label, children, itemClassName = '', className = '' }) {
  const strip = useRef(null)
  const prev = useRef(null)
  const next = useRef(null)
  const controls = useRef(null)

  const sync = useCallback(() => {
    const el = strip.current
    if (!el) return

    const max = el.scrollWidth - el.clientWidth
    // 1px de tolerancia: el scroll de un trackpad es fraccionario y nunca
    // aterriza exactamente en 0 ni en el máximo, así que una comparación
    // exacta deja el botón del extremo vivo pero sin efecto.
    const scrollable = max > 1

    // `style.display` y no una clase: la utilidad `.hidden` de Tailwind y el
    // `.flex` que este contenedor ya lleva tienen la misma especificidad, y
    // cuál gana dependería del orden de la hoja. En línea no hay empate.
    controls.current.style.display = scrollable ? '' : 'none'
    prev.current.disabled = el.scrollLeft <= 1
    next.current.disabled = el.scrollLeft >= max - 1
  }, [])

  useEffect(() => {
    const el = strip.current
    sync()

    el.addEventListener('scroll', sync, { passive: true })
    // Al cambiar el ancho cambia cuántas tarjetas caben, y con eso si la tira
    // sigue siendo desplazable: sin esto, los botones se quedan escondidos al
    // pasar de escritorio a una ventana angosta.
    const resize = new ResizeObserver(sync)
    resize.observe(el)

    return () => {
      el.removeEventListener('scroll', sync)
      resize.disconnect()
    }
  }, [sync])

  const step = (direction) => {
    const el = strip.current
    const card = el.firstElementChild
    if (!card) return

    // Avanza exactamente una tarjeta —ancho más el hueco real, leído del
    // layout y no de una constante— para que el `scroll-snap` no tenga que
    // corregir el aterrizaje.
    const gap = Number.parseFloat(getComputedStyle(el).columnGap) || 0
    const amount = card.getBoundingClientRect().width + gap

    el.scrollBy({
      left: direction * amount,
      // La preferencia se consulta en el momento del gesto y no al montar,
      // para que cambiarla a media sesión no exija recargar.
      behavior: prefersReducedMotion() ? 'auto' : 'smooth',
    })
  }

  return (
    // `min-w-0` acompaña al de `.carousel-strip`: el contenedor tampoco debe
    // poder crecer con su contenido, o vuelve a empujar a la celda que lo aloja.
    <div className={`min-w-0 ${className}`}>
      <ul ref={strip} tabIndex={0} aria-label={label} className="carousel-strip gap-4">
        {Children.map(children, (child) => (
          <li className={itemClassName}>{child}</li>
        ))}
      </ul>

      {/*
        Los controles van debajo y a la derecha, no superpuestos sobre las
        fotos: encima taparían justo la cara de alguien, y sobre una imagen
        clara un botón de borde verde deja de tener límite visible.
      */}
      <div ref={controls} className="mt-4 flex justify-end gap-2">
        <button
          ref={prev}
          type="button"
          onClick={() => step(-1)}
          aria-label="Ver fotos anteriores"
          className="carousel-arrow"
        >
          <Chevron direction="left" />
        </button>
        <button
          ref={next}
          type="button"
          onClick={() => step(1)}
          aria-label="Ver más fotos"
          className="carousel-arrow"
        >
          <Chevron direction="right" />
        </button>
      </div>
    </div>
  )
}

/**
 * Galón dibujado a mano y no traído de una librería de íconos: DESIGN.md
 * rechaza el cajón de íconos sueltos de UI genérica, y aquí hacen falta
 * exactamente dos trazos.
 */
function Chevron({ direction }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className="h-5 w-5"
    >
      <path d={direction === 'left' ? 'm15 18-6-6 6-6' : 'm9 18 6-6-6-6'} />
    </svg>
  )
}

export default Carousel

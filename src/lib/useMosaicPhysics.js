import { useEffect } from 'react'
import { gsap, prefersReducedMotion } from './gsap'
import { DUR, EASE, STAGGER } from './motion'

/**
 * Física opcional para las piezas del mosaico del hero: se pueden agarrar,
 * arrastrar y aventar, chocan entre sí y se apilan contra las paredes de su
 * propio cuadrado.
 *
 * Tres decisiones gobiernan el resto:
 *
 * 1. **Nada ocurre hasta el primer agarre.** Sin tocar el mosaico no hay
 *    motor, ni bucle de animación, ni siquiera la descarga del motor: el
 *    módulo entra por `import()` dinámico en el primer `pointerdown`, así que
 *    quien sólo lee la portada no paga sus 25 KB. La composición en reposo es
 *    exactamente el mosaico de siempre.
 *
 * 2. **El primer agarre despierta a todas las piezas, no sólo a la agarrada.**
 *    Con colisiones reales, un mundo donde unas piezas caen y otras siguen
 *    clavadas en el aire se lee como un error de dibujo, no como una decisión.
 *
 * 3. **Nunca se altera el layout.** Las celdas siguen en su rejilla; el motor
 *    sólo escribe `transform`. Volver a casa es devolver ese transform a cero,
 *    y por eso la composición no puede quedar rota: no hay estado que reparar.
 */

/** Cuánto debe quedar todo quieto antes de que el mosaico se rearme (ms). */
const SETTLE_DELAY = 900

/** Rigidez del tirón entre el puntero y la pieza agarrada. */
const GRAB_STIFFNESS = 0.18

/** Grosor de las paredes. Generoso: una pieza rápida no debe atravesarlas. */
const WALL = 200

/** El paso fijo evita que un cuadro perdido dispare las piezas. */
const STEP = 1000 / 60

/** El radio de `rounded-[2rem]`, que es lo que llevan las piezas cuadradas. */
const SQUARE_RADIUS = 32

/**
 * Da a cada pieza el cuerpo de su forma real, que no siempre es la que dice su
 * nombre: en una rejilla de `4×4`, `rounded-full` sobre una celda de una
 * columna por dos filas no dibuja un círculo sino una cápsula vertical. Lo que
 * decide es la medida, no la etiqueta — un cuerpo redondo dentro de una cápsula
 * dejaría la pieza flotando dentro de su propio contorno.
 */
const bodyFor = (Bodies, home) => {
  const { shape, w, h, x, y } = home
  const options = {
    restitution: 0.28,
    friction: 0.4,
    frictionAir: 0.012,
    // Estáticas al nacer: el mosaico se ve idéntico hasta que alguien decide
    // tocarlo.
    isStatic: true,
  }

  const half = Math.min(w, h) / 2

  if (shape === 'square') {
    return Bodies.rectangle(x, y, w, h, {
      ...options,
      chamfer: { radius: Math.min(SQUARE_RADIUS, half - 1) },
    })
  }

  // Redonda y de lados iguales: un círculo de verdad.
  if (Math.abs(w - h) < 2) return Bodies.circle(x, y, half, options)

  // Redonda y alargada: cápsula, en el eje que toque.
  return Bodies.rectangle(x, y, w, h, { ...options, chamfer: { radius: half - 1 } })
}

/**
 * @param {import('react').RefObject<HTMLElement>} containerRef contenedor del
 *   mosaico; las piezas son sus descendientes con `data-mosaic-cell`.
 * @param {boolean} enabled interruptor de la página. Con `false` el mosaico se
 *   comporta como el bloque estático que era.
 */
export function useMosaicPhysics(containerRef, enabled = true) {
  useEffect(() => {
    const container = containerRef.current
    if (!container || !enabled) return

    const cells = Array.from(container.querySelectorAll('[data-mosaic-cell]'))
    if (cells.length === 0) return

    // Estado vivo sólo mientras el mosaico está despierto. Fuera de una
    // sesión de juego todo esto es `null` y no hay nada corriendo.
    let M = null
    let engine = null
    let bodies = null
    let frame = 0
    let drag = null
    let dragPointer = null
    let settleSince = 0
    let loading = false
    let disposed = false
    let homeTween = null

    const pointer = { x: 0, y: 0 }

    /**
     * Mide cada celda en su hueco: centro y tamaño relativos al contenedor.
     * Se llama siempre con los transforms ya devueltos a cero, porque un
     * `getBoundingClientRect` sobre una pieza girada devuelve su caja
     * envolvente y no su tamaño real.
     */
    const measure = () => {
      const box = container.getBoundingClientRect()

      return cells.map((cell) => {
        const r = cell.getBoundingClientRect()
        return {
          cell,
          shape: cell.dataset.mosaicShape,
          w: r.width,
          h: r.height,
          x: r.left - box.left + r.width / 2,
          y: r.top - box.top + r.height / 2,
        }
      })
    }

    const build = () => {
      const box = container.getBoundingClientRect()
      const { Bodies, Composite, Engine } = M

      engine = Engine.create({ enableSleeping: true })
      engine.gravity.y = 1

      bodies = measure().map((home) => {
        const body = bodyFor(Bodies, home)
        body.plugin = { home }
        return body
      })

      const w = box.width
      const h = box.height
      const walls = [
        Bodies.rectangle(w / 2, -WALL / 2, w + WALL * 2, WALL, { isStatic: true }),
        Bodies.rectangle(w / 2, h + WALL / 2, w + WALL * 2, WALL, { isStatic: true }),
        Bodies.rectangle(-WALL / 2, h / 2, WALL, h + WALL * 2, { isStatic: true }),
        Bodies.rectangle(w + WALL / 2, h / 2, WALL, h + WALL * 2, { isStatic: true }),
      ]

      Composite.add(engine.world, [...bodies, ...walls])
    }

    /** Escribe en el DOM la diferencia entre donde está la pieza y su hueco. */
    const paint = () => {
      for (const body of bodies) {
        const { home } = body.plugin
        gsap.set(home.cell, {
          x: body.position.x - home.x,
          y: body.position.y - home.y,
          rotation: body.angle * (180 / Math.PI),
        })
      }
    }

    const atRest = () => !drag && bodies.every((body) => body.isSleeping)

    const loop = () => {
      if (disposed || !engine) return

      if (drag) drag.pointA = { x: pointer.x, y: pointer.y }

      M.Engine.update(engine, STEP)
      paint()

      const now = performance.now()
      if (atRest()) {
        if (settleSince === 0) settleSince = now
        if (now - settleSince > SETTLE_DELAY) {
          goHome()
          return
        }
      } else {
        settleSince = 0
      }

      frame = requestAnimationFrame(loop)
    }

    /** Desmonta el mundo y deja el mosaico como lo encontró. */
    const teardown = () => {
      cancelAnimationFrame(frame)
      frame = 0
      if (engine) {
        M.Composite.clear(engine.world, false)
        M.Engine.clear(engine)
      }
      engine = null
      bodies = null
      drag = null
      dragPointer = null
      settleSince = 0
      for (const cell of cells) cell.style.cursor = ''
    }

    /** Las piezas vuelven a su hueco y el mundo se apaga. */
    const goHome = (animated = true) => {
      const targets = cells
      teardown()

      homeTween?.kill()

      if (!animated) {
        gsap.set(targets, { x: 0, y: 0, rotation: 0 })
        return
      }

      homeTween = gsap.to(targets, {
        x: 0,
        y: 0,
        rotation: 0,
        duration: DUR.focal,
        ease: EASE.enter,
        stagger: STAGGER.tight,
      })
    }

    const wake = () => {
      for (const body of bodies) {
        M.Body.setStatic(body, false)
        M.Sleeping.set(body, false)
      }
      for (const cell of cells) cell.style.cursor = 'grab'
    }

    const startDrag = (body) => {
      const { Composite, Constraint, Sleeping } = M

      Sleeping.set(body, false)

      // Se agarra por el punto exacto donde cayó el dedo, no por el centro:
      // así la pieza gira al tirar de una esquina, como haría de verdad. El
      // desplazamiento va en coordenadas del cuerpo —sin su giro—, porque el
      // motor se lo vuelve a aplicar. Agarrar una pieza ya girada sin
      // deshacer ese ángulo la haría saltar al tocarla.
      const dx = pointer.x - body.position.x
      const dy = pointer.y - body.position.y
      const cos = Math.cos(-body.angle)
      const sin = Math.sin(-body.angle)

      drag = Constraint.create({
        pointA: { x: pointer.x, y: pointer.y },
        bodyB: body,
        pointB: { x: dx * cos - dy * sin, y: dx * sin + dy * cos },
        stiffness: GRAB_STIFFNESS,
        damping: 0.08,
        length: 0,
      })
      Composite.add(engine.world, drag)
      settleSince = 0
    }

    const bodyUnder = (cell) => bodies.find((body) => body.plugin.home.cell === cell)

    const toLocal = (event) => {
      const box = container.getBoundingClientRect()
      pointer.x = event.clientX - box.left
      pointer.y = event.clientY - box.top
    }

    const onPointerDown = async (event) => {
      if (event.button != null && event.button !== 0) return

      const cell = event.target.closest('[data-mosaic-cell]')
      if (!cell || !container.contains(cell)) return

      // El movimiento es opcional y se comprueba en el momento del gesto, no
      // al montar: quien cambia la preferencia del sistema a media sesión no
      // tiene por qué recargar para que se le respete.
      if (prefersReducedMotion()) return

      toLocal(event)
      dragPointer = event.pointerId

      if (!engine) {
        if (loading) return
        loading = true
        try {
          const mod = await import('matter-js')
          M = mod.default ?? mod
        } catch {
          // Sin motor, el mosaico se queda como estaba. No hay nada que
          // decirle al estudiante: no pidió una función, tocó un adorno.
          loading = false
          return
        }
        loading = false
        if (disposed || dragPointer !== event.pointerId) return

        homeTween?.kill()
        gsap.set(cells, { x: 0, y: 0, rotation: 0 })
        build()
        wake()
        frame = requestAnimationFrame(loop)
      }

      const body = bodyUnder(cell)
      if (!body) return

      cell.setPointerCapture?.(event.pointerId)
      cell.style.cursor = 'grabbing'
      startDrag(body)
    }

    const onPointerMove = (event) => {
      if (!engine || event.pointerId !== dragPointer) return
      toLocal(event)
    }

    const onPointerUp = (event) => {
      if (event.pointerId !== dragPointer) return
      dragPointer = null
      if (!engine || !drag) return

      const cell = drag.bodyB.plugin.home.cell
      cell.style.cursor = 'grab'
      M.Composite.remove(engine.world, drag)
      drag = null
      settleSince = 0
    }

    // Fuera de la pantalla no hay nada que mirar: se rearma sin animación para
    // que quien vuelva al hero lo encuentre entero.
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting && engine) goHome(false)
      },
      { threshold: 0 },
    )
    observer.observe(container)

    // Al cambiar el ancho, los huecos se recolocan y las medidas guardadas
    // dejan de valer. Rearmar es más honesto que arrastrar un mundo viejo.
    const resize = new ResizeObserver(() => {
      if (engine) goHome(false)
    })
    resize.observe(container)

    container.addEventListener('pointerdown', onPointerDown)
    window.addEventListener('pointermove', onPointerMove)
    window.addEventListener('pointerup', onPointerUp)
    window.addEventListener('pointercancel', onPointerUp)

    return () => {
      disposed = true
      observer.disconnect()
      resize.disconnect()
      container.removeEventListener('pointerdown', onPointerDown)
      window.removeEventListener('pointermove', onPointerMove)
      window.removeEventListener('pointerup', onPointerUp)
      window.removeEventListener('pointercancel', onPointerUp)
      homeTween?.kill()
      teardown()
      gsap.set(cells, { x: 0, y: 0, rotation: 0 })
    }
  }, [containerRef, enabled])
}

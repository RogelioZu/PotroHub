import { useEffect } from 'react'
import { gsap, prefersReducedMotion } from './gsap'
import { DUR, EASE, STAGGER } from './motion'

/**
 * Física opcional para las piezas del mosaico del hero: se pueden agarrar,
 * arrastrar y aventar, chocan entre sí y se apilan contra unas paredes que las
 * encierran.
 *
 * Cuatro decisiones gobiernan el resto:
 *
 * 1. **Nada se mueve hasta el primer agarre.** Lo que mantiene quieto al
 *    mosaico no es el estado de las piezas sino que el motor no avanza: sin
 *    bucle nadie llama a `Engine.update`. La composición en reposo es
 *    exactamente el mosaico de siempre, hasta el píxel.
 *
 * 2. **El motor se pide cuando el puntero se acerca, no cuando ya aprieta.**
 *    Entra por `import()` dinámico —26 KB comprimidos que no paga quien nunca
 *    pasa por encima del mosaico— y en cuanto llega se arma el mundo en frío,
 *    sin encender el bucle. Así el agarre no espera a una descarga.
 *
 *    Esperar al `pointerdown` para pedirlo parecía suficiente y no lo era: en
 *    frío pasan cientos de milisegundos hasta que el módulo llega, para
 *    entonces un toque corto ya terminó, y abortar ahí dejaba el mundo sin
 *    armar una y otra vez. Las piezas no se movían nunca.
 *
 * 3. **El primer agarre despierta a todas, no sólo a la agarrada.** Con
 *    colisiones reales, un mundo donde unas caen y otras siguen clavadas en el
 *    aire se lee como un error de dibujo, no como una decisión.
 *
 * 4. **Nunca se altera el layout.** Las celdas siguen en su rejilla; el motor
 *    sólo escribe `transform`. Volver a casa es devolver ese transform a cero,
 *    y por eso la composición no puede quedar rota: no hay estado que reparar.
 */

/** Cuánto debe quedar todo quieto antes de que el mosaico se rearme (ms). */
const SETTLE_DELAY = 900

/** Rigidez del tirón entre el puntero y la pieza agarrada. */
const GRAB_STIFFNESS = 0.18

/** Grosor de las paredes. Generoso: una pieza rápida no debe atravesarlas. */
const WALL = 200

/** Umbrales de quietud: por debajo de esto la pieza se considera parada. */
const REST_SPEED = 0.4
const REST_SPIN = 0.03

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
  // Los cuerpos nacen dinámicos, nunca `isStatic: true`. Lo que mantiene
  // quieto al mosaico no es el estado de las piezas sino que el motor no
  // avanza: sin bucle, nadie llama a `Engine.update` y nada se mueve.
  //
  // Nacer estáticas y despertarlas con `Body.setStatic(body, false)` parecía
  // lo natural y es una trampa conocida de Matter: al crear el cuerpo ya
  // estático nunca se guarda su masa original, así que devolverlo a dinámico
  // la restaura desde la nada. La masa queda en `NaN`, el motor lo propaga a
  // la posición, y las piezas se quedan clavadas sin que nada falle en voz
  // alta — no hay excepción, sólo aritmética con `NaN`.
  const options = {
    restitution: 0.28,
    friction: 0.4,
    frictionAir: 0.012,
  }

  const half = Math.min(w, h) / 2

  if (shape === 'triangle') {
    // El mismo polígono que dibuja el `clip-path`: base arriba, vértice abajo.
    // Matter coloca el centroide en `(x, y)` —el centro de la caja del
    // elemento—, que es también el punto sobre el que gira CSS, así que el
    // dibujo y el cuerpo giran sobre el mismo eje sin más ajustes.
    return Bodies.fromVertices(
      x,
      y,
      [
        [
          { x: -w / 2, y: -h / 2 },
          { x: w / 2, y: -h / 2 },
          { x: 0, y: h / 2 },
        ],
      ],
      options,
    )
  }

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
    let awake = false
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

      const pieces = measure()

      bodies = pieces.map((home) => {
        const body = bodyFor(Bodies, home)
        // El desplazamiento se mide desde donde nació el cuerpo y no desde el
        // centro de la celda: en un polígono el motor coloca el centroide, que
        // no tiene por qué caer en el centro de su caja.
        body.plugin = { cell: home.cell, ox: body.position.x, oy: body.position.y }
        return body
      })

      // Las paredes encierran la unión del cuadrado y de las piezas, no sólo
      // el cuadrado: tres adornos asoman por el borde a propósito —uno nace
      // por encima del canto superior— y una pared trazada al ras los
      // atraparía dentro de sí misma y los escupiría al arrancar el motor.
      const edge = pieces.reduce(
        (acc, p) => ({
          minX: Math.min(acc.minX, p.x - p.w / 2),
          minY: Math.min(acc.minY, p.y - p.h / 2),
          maxX: Math.max(acc.maxX, p.x + p.w / 2),
          maxY: Math.max(acc.maxY, p.y + p.h / 2),
        }),
        { minX: 0, minY: 0, maxX: box.width, maxY: box.height },
      )

      const w = edge.maxX - edge.minX
      const h = edge.maxY - edge.minY
      const cx = edge.minX + w / 2
      const cy = edge.minY + h / 2
      const walls = [
        Bodies.rectangle(cx, edge.minY - WALL / 2, w + WALL * 2, WALL, { isStatic: true }),
        Bodies.rectangle(cx, edge.maxY + WALL / 2, w + WALL * 2, WALL, { isStatic: true }),
        Bodies.rectangle(edge.minX - WALL / 2, cy, WALL, h + WALL * 2, { isStatic: true }),
        Bodies.rectangle(edge.maxX + WALL / 2, cy, WALL, h + WALL * 2, { isStatic: true }),
      ]

      Composite.add(engine.world, [...bodies, ...walls])
    }

    /** Escribe en el DOM la diferencia entre donde está la pieza y su hueco. */
    const paint = () => {
      for (const body of bodies) {
        const { cell, ox, oy } = body.plugin
        gsap.set(cell, {
          x: body.position.x - ox,
          y: body.position.y - oy,
          rotation: body.angle * (180 / Math.PI),
        })
      }
    }

    /**
     * El reposo se mide por velocidad y no por el `isSleeping` del motor. Tres
     * de las seis piezas son redondas, y una pieza redonda sobre un suelo con
     * fricción rueda: nunca baja del umbral de sueño de Matter, así que el
     * mosaico se quedaba desarmado para siempre esperando un sueño que no
     * llegaba.
     */
    const atRest = () =>
      !drag && bodies.every((body) => body.speed < REST_SPEED && body.angularSpeed < REST_SPIN)

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
      awake = false
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

    /** Trae el motor, una sola vez. `true` si quedó disponible. */
    const load = async () => {
      if (M) return true
      if (loading) return false
      loading = true
      try {
        const mod = await import('matter-js')
        M = mod.default ?? mod
      } catch {
        // Sin motor el mosaico se queda como estaba. No hay nada que decirle
        // al estudiante: no pidió una función, tocó un adorno.
        return false
      } finally {
        loading = false
      }
      return !disposed
    }

    /**
     * Arma el mundo en frío. Los cuerpos nacen estáticos y no se enciende el
     * bucle, así que esto no mueve un solo píxel: sólo deja todo listo para
     * que el agarre no tenga que esperar a nada.
     */
    const ensureWorld = () => {
      if (engine || !M) return
      homeTween?.kill()
      gsap.set(cells, { x: 0, y: 0, rotation: 0 })
      build()
      for (const cell of cells) cell.style.cursor = 'grab'
    }

    /**
     * Enciende el bucle, que es lo único que separa al mosaico quieto del
     * mosaico con gravedad. Sólo la primera vez.
     */
    const wake = () => {
      if (awake) return
      awake = true
      for (const body of bodies) M.Sleeping.set(body, false)
      frame = requestAnimationFrame(loop)
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

    const bodyUnder = (cell) => bodies.find((body) => body.plugin.cell === cell)

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

      // Con el motor ya en memoria esto es síncrono, que es lo que hace que
      // el agarre responda al instante a partir del segundo.
      if (!engine) ensureWorld()

      if (!engine) {
        // Primer contacto en frío: hay que esperar a que llegue el motor.
        // Si para entonces el dedo ya se levantó, el mundo se queda armado de
        // todos modos y el siguiente agarre es inmediato. Abortar aquí sin
        // armarlo era el error: un toque corto —que es como se prueba algo
        // por primera vez— dejaba el mosaico sin construir una y otra vez, y
        // las piezas no se movían nunca.
        if (!(await load()) || disposed) return
        ensureWorld()
        if (!engine || dragPointer !== event.pointerId) return
      }

      const body = bodyUnder(cell)
      if (!body) return

      wake()
      cell.setPointerCapture?.(event.pointerId)
      cell.style.cursor = 'grabbing'
      startDrag(body)
    }

    /**
     * El motor se pide en cuanto el puntero se acerca, no cuando ya está
     * apretando: así el primer agarre con ratón tampoco espera. No descarga
     * nada de quien nunca pasa por encima del mosaico.
     */
    const onPointerOver = () => {
      if (engine || prefersReducedMotion()) return
      prepare()
    }

    const prepare = async () => {
      if (!engine && (await load())) ensureWorld()
    }

    const onPointerMove = (event) => {
      if (!engine || event.pointerId !== dragPointer) return
      toLocal(event)
    }

    const onPointerUp = (event) => {
      if (event.pointerId !== dragPointer) return
      dragPointer = null
      if (!engine || !drag) return

      const cell = drag.bodyB.plugin.cell
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

    // Las piezas llevan fotografías, y arrastrar una imagen dispara el
    // arrastre nativo del navegador: en cuanto el puntero se movía, Chrome
    // daba el gesto por suyo y mandaba `pointercancel`, que aquí significa
    // soltar. El agarre moría en el primer movimiento y las piezas sólo
    // caían. Cancelar `dragstart` devuelve el gesto a la pieza.
    const onDragStart = (event) => event.preventDefault()

    container.addEventListener('dragstart', onDragStart)
    container.addEventListener('pointerover', onPointerOver)
    container.addEventListener('pointerdown', onPointerDown)
    window.addEventListener('pointermove', onPointerMove)
    window.addEventListener('pointerup', onPointerUp)
    window.addEventListener('pointercancel', onPointerUp)

    return () => {
      disposed = true
      observer.disconnect()
      resize.disconnect()
      container.removeEventListener('dragstart', onDragStart)
      container.removeEventListener('pointerover', onPointerOver)
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

import { useRef } from 'react'
import { useLocation } from 'react-router-dom'
import { gsap, ScrollSmoother, useGSAP } from '../../lib/gsap'
import { SMOOTH_SCROLL } from '../../lib/motion'

/**
 * Scroll con inercia, acotado para que no haga daño: solo en escritorio con
 * puntero fino y sin preferencia de movimiento reducido. Cuando la consulta no
 * aplica no se crea nada y el navegador scrollea de forma nativa, así que los
 * `id` de abajo quedan como simples contenedores sin estilo.
 *
 * En `/quiz` el suavizado se lleva a cero en vez de pausarse: `paused(true)`
 * de ScrollSmoother bloquea el scroll por completo, y el cuestionario es una
 * tarea, no una lectura.
 */
function SmoothScroller({ children }) {
  const wrapper = useRef(null)
  const content = useRef(null)
  const { pathname } = useLocation()

  useGSAP(
    () => {
      const mm = gsap.matchMedia()

      mm.add(SMOOTH_SCROLL, () => {
        const smoother = ScrollSmoother.create({
          wrapper: wrapper.current,
          content: content.current,
          smooth: 1,
          effects: true,
          // Normalizar el scroll secuestra rueda y teclado; no vale la pena aquí.
          normalizeScroll: false,
        })

        return () => smoother.kill()
      })

      return () => mm.revert()
    },
    { scope: wrapper },
  )

  useGSAP(
    () => {
      ScrollSmoother.get()?.smooth(pathname === '/quiz' ? 0 : 1)
    },
    { dependencies: [pathname] },
  )

  return (
    <div id="smooth-wrapper" ref={wrapper}>
      <div id="smooth-content" ref={content}>
        {children}
      </div>
    </div>
  )
}

export default SmoothScroller

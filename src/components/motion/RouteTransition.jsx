import { useRef, useState } from 'react'
import { useLocation, useOutlet } from 'react-router-dom'
import { gsap, prefersReducedMotion, ScrollSmoother, ScrollTrigger, useGSAP } from '../../lib/gsap'
import { DUR, EASE } from '../../lib/motion'

function scrollToTop() {
  const smoother = ScrollSmoother.get()
  if (smoother) smoother.scrollTo(0, false)
  else window.scrollTo(0, 0)
}

/**
 * Transición entre rutas. `useOutlet()` devuelve el elemento de la ruta actual;
 * al guardarlo en estado se mantiene montada la vista saliente el tiempo justo
 * para despedirla, y sólo después se intercambia por la entrante.
 *
 * Reemplaza a `<Outlet />` dentro del Layout.
 */
function RouteTransition() {
  const { pathname } = useLocation()
  const outlet = useOutlet()
  const container = useRef(null)
  const isFirstRender = useRef(true)
  const [view, setView] = useState({ pathname, outlet })

  // Salida, y sólo entonces el intercambio.
  useGSAP(
    () => {
      if (view.pathname === pathname) return

      const swap = () => setView({ pathname, outlet })

      if (prefersReducedMotion()) {
        swap()
        return
      }

      gsap.to(container.current, {
        opacity: 0,
        y: -8,
        duration: DUR.state * 0.6,
        ease: EASE.exit,
        overwrite: true,
        onComplete: swap,
      })
    },
    { dependencies: [pathname], scope: container },
  )

  // Entrada de la vista nueva. En la primera carga el contenedor no se anima:
  // de eso se encarga la secuencia propia de cada página.
  useGSAP(
    () => {
      if (isFirstRender.current) {
        isFirstRender.current = false
        return
      }

      scrollToTop()

      if (prefersReducedMotion()) {
        gsap.set(container.current, { clearProps: 'all' })
        ScrollTrigger.refresh()
        return
      }

      gsap.fromTo(
        container.current,
        { opacity: 0, y: 12 },
        {
          opacity: 1,
          y: 0,
          duration: DUR.view,
          ease: EASE.enter,
          overwrite: true,
          // Se limpia el transform: un ancestro transformado altera las
          // mediciones de ScrollTrigger y rompe los elementos fijos.
          clearProps: 'all',
          onComplete: () => ScrollTrigger.refresh(),
        },
      )
    },
    { dependencies: [view.pathname], scope: container },
  )

  // La columna flexible se propaga desde `main` para que la vista de dentro
  // pueda ocupar el alto disponible (ver Layout).
  return (
    <div ref={container} className="flex flex-1 flex-col">
      {view.outlet}
    </div>
  )
}

export default RouteTransition

import { useLayoutEffect, useRef } from 'react'
import { useLocation, useOutlet } from 'react-router-dom'

/**
 * Cambio de ruta sin animación de salida: la vista nueva se monta de
 * inmediato y entra con un fundido corto de CSS (`.page-enter`). La versión
 * anterior despedía la vista saliente con GSAP antes de montar la entrante,
 * y eso retrasaba exactamente lo que el estudiante acababa de pedir.
 *
 * Lo que sí hace es lo que una SPA le quita al navegador:
 *
 * - **Posición.** Si la URL trae ancla (`/comunidad?area=ia#especialidades`)
 *   aterriza en ella; si no, vuelve arriba.
 * - **Foco.** Al cambiar de página, el foco pasa al primer encabezado de la
 *   vista (o del ancla), para que teclado y lector de pantalla empiecen donde
 *   empieza el contenido y no en un enlace del menú que ya no importa.
 *
 * Se llama "transición" por historia; hoy es el reemplazo de `<Outlet />`.
 */
function RouteTransition() {
  const { pathname, hash } = useLocation()
  const outlet = useOutlet()
  const container = useRef(null)
  const previousPath = useRef(pathname)

  useLayoutEffect(() => {
    const anchor = hash ? document.getElementById(decodeURIComponent(hash.slice(1))) : null
    if (anchor) anchor.scrollIntoView({ block: 'start' })
    else window.scrollTo(0, 0)

    if (previousPath.current !== pathname) {
      const heading = (anchor ?? container.current)?.querySelector('h1, h2')
      if (heading) {
        heading.setAttribute('tabindex', '-1')
        heading.focus({ preventScroll: true })
      }
    }
    previousPath.current = pathname
  }, [pathname, hash])

  return (
    <div key={pathname} ref={container} className="page-enter flex flex-1 flex-col">
      {outlet}
    </div>
  )
}

export default RouteTransition

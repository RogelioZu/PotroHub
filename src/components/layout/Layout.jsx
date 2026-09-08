import RouteTransition from '../motion/RouteTransition'
import SmoothScroller from '../motion/SmoothScroller'
import Footer from './Footer'
import Navbar from './Navbar'

/**
 * `RouteTransition` sustituye a `<Outlet />` para poder despedir la vista
 * saliente antes de montar la entrante. La columna flexible vive dentro de
 * `SmoothScroller` porque ScrollSmoother convierte su envoltorio en un
 * elemento fijo, y el footer debe seguir pegado abajo en páginas cortas.
 */
function Layout() {
  return (
    <SmoothScroller>
      <div className="flex min-h-svh flex-col">
        <Navbar />
        {/*
          `main` es columna flexible, no sólo `flex-1`: así una vista corta
          —el 404, el estado vacío de resultados— puede pedir `flex-1` y
          centrarse en el alto disponible en vez de flotar en el tercio
          superior. Las vistas largas no crecen y quedan exactamente igual.
        */}
        <main className="flex flex-1 flex-col">
          <RouteTransition />
        </main>
        <Footer />
      </div>
    </SmoothScroller>
  )
}

export default Layout

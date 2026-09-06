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
        <main className="flex-1">
          <RouteTransition />
        </main>
        <Footer />
      </div>
    </SmoothScroller>
  )
}

export default Layout

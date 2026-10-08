import RouteTransition from '../motion/RouteTransition'
import Footer from './Footer'
import Navbar from './Navbar'

/**
 * Scroll nativo. `ScrollSmoother` convertía el documento en un elemento fijo
 * con inercia: las anclas internas, el teclado y los paneles que cambian de
 * alto (comparar credenciales, cambiar de puesto) dejaban de comportarse como
 * el navegador promete. Una guía que se lee y se recorre no necesita inercia.
 *
 * `main` es columna flexible para que una vista corta —el 404, el estado sin
 * resultados— pueda centrarse en el alto disponible. `tabIndex={-1}` lo hace
 * destino válido del enlace "Saltar al contenido".
 */
function Layout() {
  return (
    <div className="flex min-h-svh flex-col">
      <Navbar />
      <main id="contenido" tabIndex={-1} className="flex flex-1 flex-col focus:outline-none">
        <RouteTransition />
      </main>
      <Footer />
    </div>
  )
}

export default Layout

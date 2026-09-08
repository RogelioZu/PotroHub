import { Link } from 'react-router-dom'
import Reveal from '../components/motion/Reveal'
import { useDocumentTitle } from '../lib/useDocumentTitle'

function NotFound() {
  useDocumentTitle('Página no encontrada — PotroPath')

  return (
    <Reveal
      as="section"
      // `flex-1` + `justify-center`: la columna del layout mide `min-h-svh` y
      // esta pantalla tiene tres líneas de contenido, así que sin centrar
      // quedaba pegada arriba con un vacío de casi media pantalla debajo. El
      // `py-24` se queda como aire mínimo cuando la ventana es baja.
      className="mx-auto flex max-w-6xl flex-1 flex-col items-center justify-center gap-4 px-6 py-24 text-center"
      stagger={{ amount: 0.12 }}
    >
      <h1 className="text-3xl font-bold text-ink">Página no encontrada</h1>
      <p className="text-ink-soft">La ruta que buscas no existe.</p>
      <Link to="/" className="btn-green">
        Volver al inicio
      </Link>
    </Reveal>
  )
}

export default NotFound

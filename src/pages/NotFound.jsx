import { Link } from 'react-router-dom'
import { useDocumentTitle } from '../lib/useDocumentTitle'

/**
 * El 404 es también donde cae un enlace mal copiado desde WhatsApp, así que
 * además de volver al inicio ofrece la tarea que el visitante venía a hacer.
 * `flex-1` lo centra en el alto disponible: con tres líneas de contenido,
 * sin centrar se leía como una pantalla sin terminar.
 */
function NotFound() {
  useDocumentTitle('Página no encontrada — PotroPath')

  return (
    <section className="page-shell flex flex-1 flex-col items-center justify-center gap-5 py-24 text-center">
      <img
        src="/images/potro-mascota.webp"
        alt=""
        className="h-28 w-auto rounded-md bg-paper p-2 ring-1 ring-ink/10"
      />
      <p className="eyebrow">Error 404</p>
      <h1 className="h1 max-w-2xl">Esta página no está en el mapa.</h1>
      <p className="lead max-w-xl">
        La dirección que abriste no corresponde a ninguna página de PotroPath. Desde aquí puedes
        retomar tu recorrido.
      </p>
      <div className="mt-2 flex flex-wrap justify-center gap-4">
        <Link to="/quiz" className="btn-green">
          Ir al diagnóstico
        </Link>
        <Link to="/" className="btn-outline">
          Volver al inicio
        </Link>
      </div>
    </section>
  )
}

export default NotFound

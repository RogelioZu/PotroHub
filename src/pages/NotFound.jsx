import { Link } from 'react-router-dom'

function NotFound() {
  return (
    <section className="mx-auto flex max-w-6xl flex-col items-center gap-4 px-6 py-24 text-center">
      <h1 className="text-3xl font-bold text-ink">Página no encontrada</h1>
      <p className="text-ink-soft">La ruta que buscas no existe.</p>
      <Link to="/" className="font-medium text-green-mid underline">
        Volver al inicio
      </Link>
    </section>
  )
}

export default NotFound

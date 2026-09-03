import { Link } from 'react-router-dom'

function NotFound() {
  return (
    <section className="mx-auto flex max-w-6xl flex-col items-center gap-4 px-6 py-24 text-center">
      <h1 className="font-display text-3xl text-potro-white">Página no encontrada</h1>
      <p className="text-potro-white-soft">La ruta que buscas no existe.</p>
      <Link to="/" className="text-potro-gold-light underline">
        Volver al inicio
      </Link>
    </section>
  )
}

export default NotFound

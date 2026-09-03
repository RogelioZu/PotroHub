import { Link } from 'react-router-dom'

const links = [
  { to: '/quiz', label: 'Diagnóstico' },
  { to: '/resultados', label: 'Mi ruta' },
  { to: '/ieee', label: 'IEEE UAEMéx' },
  { to: '/comunidad', label: 'Comunidad' },
]

function Footer() {
  return (
    <footer className="border-t border-gold/40 bg-paper">
      <div className="mx-auto grid max-w-6xl gap-10 px-6 py-10 sm:grid-cols-3">
        <div>
          <p className="text-lg font-bold text-ink">
            Potro<span className="text-gold-dark">Path</span>
          </p>
          <p className="mt-2 text-sm text-ink-soft">
            Facultad de Ingeniería — Universidad Autónoma del Estado de México (UAEMéx).
          </p>
        </div>
        <div>
          <p className="text-sm font-semibold text-green-mid uppercase">Navegación</p>
          <ul className="mt-3 space-y-2 text-sm text-ink-soft">
            {links.map((link) => (
              <li key={link.to}>
                <Link to={link.to} className="hover:text-green-mid">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <p className="text-sm font-semibold text-green-mid uppercase">Proyecto</p>
          <p className="mt-3 text-sm text-ink-soft">
            Proyecto estudiantil sin fines de lucro, presentado como Producto Mínimo Viable para la
            Facultad de Ingeniería.
          </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer

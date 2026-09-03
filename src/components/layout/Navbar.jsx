import { Link, NavLink } from 'react-router-dom'

const links = [
  { to: '/', label: 'Inicio', end: true },
  { to: '/quiz', label: 'Diagnóstico' },
  { to: '/resultados', label: 'Mi ruta' },
  { to: '/ieee', label: 'IEEE UAEMéx' },
  { to: '/comunidad', label: 'Comunidad' },
]

function Navbar() {
  return (
    <header className="bg-paper">
      <div className="border-b border-ink/10 py-4">
        <Link to="/" className="flex flex-col items-center gap-1">
          <span className="font-sans text-2xl font-bold text-ink">
            Potro<span className="text-gold-dark">Path</span>
          </span>
          <span className="text-xs tracking-widest text-ink-soft uppercase">
            Facultad de Ingeniería · UAEMéx
          </span>
        </Link>
      </div>
      <nav className="border-b border-ink/10">
        <ul className="mx-auto flex max-w-6xl flex-wrap items-center justify-center gap-8 px-6 py-3 text-sm">
          {links.map(({ to, label, end }) => (
            <li key={to}>
              <NavLink
                to={to}
                end={end}
                className={({ isActive }) =>
                  `border-b-2 pb-1 font-medium transition-colors ${
                    isActive
                      ? 'border-gold text-green-mid'
                      : 'border-transparent text-ink-soft hover:border-gold/50 hover:text-green-mid'
                  }`
                }
              >
                {label}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  )
}

export default Navbar

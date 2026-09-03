import { NavLink } from 'react-router-dom'

const links = [
  { to: '/', label: 'Inicio', end: true },
  { to: '/quiz', label: 'Diagnóstico' },
  { to: '/resultados', label: 'Mi ruta' },
  { to: '/ieee', label: 'IEEE UAEMéx' },
  { to: '/comunidad', label: 'Comunidad' },
]

function Navbar() {
  return (
    <header className="border-b border-potro-gold/20 bg-potro-black/95 backdrop-blur">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <NavLink to="/" className="font-display text-xl font-semibold text-potro-white">
          Potro<span className="text-gradient-gold">Path</span>
        </NavLink>
        <ul className="flex flex-wrap items-center gap-1 text-sm">
          {links.map(({ to, label, end }) => (
            <li key={to}>
              <NavLink
                to={to}
                end={end}
                className={({ isActive }) =>
                  `rounded-full px-3 py-1.5 transition-colors ${
                    isActive
                      ? 'bg-potro-green text-potro-white'
                      : 'text-potro-white-soft hover:text-potro-gold-light'
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

import { Link, NavLink } from 'react-router-dom'
import VitralBackdrop from '../ui/VitralBackdrop'

const links = [
  { to: '/', label: 'Inicio', end: true },
  { to: '/quiz', label: 'Diagnóstico' },
  // { to: '/resultados', label: 'Mi ruta' }, // oculto del nav por ahora, reactivar si se vuelve a necesitar
  { to: '/comunidad', label: 'Comunidad Facultad de Ingeniería' },
]

function Navbar() {
  return (
    <header className="relative overflow-hidden text-paper">
      <VitralBackdrop />

      <div className="relative z-10">
        <nav className="border-b border-paper/20">
          <ul className="mx-auto flex max-w-6xl flex-wrap items-center justify-center gap-8 px-6 py-3 text-sm">
            {links.map(({ to, label, end }) => (
              <li key={to}>
                <NavLink
                  to={to}
                  end={end}
                  className={({ isActive }) =>
                    `border-b-2 pb-1 font-medium transition-colors ${
                      isActive
                        ? 'border-gold text-gold-light'
                        : 'border-transparent text-paper/80 hover:border-gold/60 hover:text-gold-light'
                    }`
                  }
                >
                  {label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        <div className="py-6 text-center">
          <Link to="/" className="inline-flex flex-col items-center gap-1">
            <span className="text-2xl font-bold text-paper">
              Potro<span className="text-gold-light">Path</span>
            </span>
            <span className="text-xs tracking-widest text-paper/70 uppercase">
              Facultad de Ingeniería · UAEMéx
            </span>
          </Link>
        </div>
      </div>
    </header>
  )
}

export default Navbar

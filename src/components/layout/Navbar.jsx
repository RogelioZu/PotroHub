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
      <VitralBackdrop scrimClassName="" />

      <div className="relative z-10 mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-6 py-10 md:py-10">
        <Link
          to="/"
          className="text-3xl font-bold text-paper [text-shadow:0_2px_10px_rgb(0_0_0/70%)] md:text-5xl"
        >
          Potro<span className="text-gold-light">Path</span>
        </Link>

        <nav>
          <ul className="flex flex-wrap items-center gap-8 text-lg md:text-xl font-semibold">
            {links.map(({ to, label, end }) => (
              <li key={to}>
                <NavLink
                  to={to}
                  end={end}
                  className={({ isActive }) =>
                    `border-b-2 pb-1 font-medium [text-shadow:0_1px_6px_rgb(0_0_0/75%)] transition-colors ${
                      isActive
                        ? 'border-gold text-gold-light'
                        : 'border-transparent text-paper hover:border-gold/60 hover:text-gold-light'
                    }`
                  }
                >
                  {label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  )
}

export default Navbar

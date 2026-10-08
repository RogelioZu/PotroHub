import { useEffect, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { QUESTIONS } from '../../data/questions'
import { useQuizStore } from '../../store/quizStore'

/*
 * Cuatro destinos, en el orden del recorrido. "Mi ruta" no existía en la
 * navegación: quien terminaba el diagnóstico no tenía forma de volver a su
 * resultado salvo recordar la URL. "Comunidad Facultad de Ingeniería" se
 * acortó a "Comunidad": la etiqueta larga forzaba el menú móvil desde 1024px.
 */
const links = [
  { to: '/', label: 'Inicio', end: true },
  { to: '/quiz', label: 'Diagnóstico' },
  { to: '/resultados', label: 'Mi ruta' },
  { to: '/comunidad', label: 'Comunidad' },
]

/** El CTA dice en qué estado está la sesión guardada en este navegador. */
function contextualCta(answered) {
  if (answered === QUESTIONS.length) return { to: '/resultados', label: 'Explorar mi ruta' }
  if (answered > 0) return { to: '/quiz', label: 'Continuar diagnóstico' }
  return { to: '/quiz', label: 'Descubrir mi ruta' }
}

// NavLink ya marca el destino activo con `aria-current="page"`, y el CSS
// lo pinta desde ahí: el estado visible y el anunciado son el mismo atributo.
const navClass = 'nav-link'

function Navbar() {
  const { pathname } = useLocation()
  // El menú guarda la ruta en la que se abrió: al llegar a otra página se
  // cierra solo, sin un efecto que dispare un render extra.
  const [openOn, setOpenOn] = useState(null)
  const open = openOn === pathname
  const answered = useQuizStore((state) => Object.keys(state.answers).length)
  const cta = contextualCta(answered)

  useEffect(() => {
    if (!open) return
    const onKeyDown = (event) => {
      if (event.key === 'Escape') setOpenOn(null)
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [open])

  return (
    <header className="site-header">
      <a href="#contenido" className="skip-link">
        Saltar al contenido
      </a>
      <div className="brand-ribbon" aria-hidden="true" />

      <div className="page-shell nav-row">
        <Link to="/" className="brand" aria-label="PotroPath, ir al inicio">
          <span className="brand-symbol" aria-hidden="true">
            p<small>↗</small>
          </span>
          <span>
            <span className="brand-name">
              Potro<span className="text-green-mid">Path</span>
            </span>
            <span className="brand-context">INGENIERÍA · UAEMÉX</span>
          </span>
        </Link>

        <nav aria-label="Principal" className="desktop-nav">
          {links.map((link) => (
            <NavLink key={link.to} to={link.to} end={link.end} className={navClass}>
              {link.label}
            </NavLink>
          ))}
        </nav>

        <Link to={cta.to} className="btn-green nav-cta">
          {cta.label} <span aria-hidden="true">↗</span>
        </Link>

        <button
          type="button"
          className="menu-button"
          aria-expanded={open}
          aria-controls="menu-movil"
          onClick={() => setOpenOn(open ? null : pathname)}
        >
          {open ? 'Cerrar' : 'Menú'} <span aria-hidden="true">{open ? '×' : '☰'}</span>
        </button>
      </div>

      {open && (
        <nav id="menu-movil" aria-label="Principal" className="page-shell mobile-nav">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.end}
              className={navClass}
              onClick={() => setOpenOn(null)}
            >
              {link.label}
            </NavLink>
          ))}
          <Link to={cta.to} className="btn-green mt-2" onClick={() => setOpenOn(null)}>
            {cta.label} <span aria-hidden="true">↗</span>
          </Link>
        </nav>
      )}
    </header>
  )
}

export default Navbar

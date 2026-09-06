import { useRef } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { gsap, prefersReducedMotion, useGSAP } from '../../lib/gsap'
import { DUR, EASE } from '../../lib/motion'
import VitralBackdrop from '../ui/VitralBackdrop'

const links = [
  { to: '/', label: 'Inicio', end: true },
  { to: '/quiz', label: 'Diagnóstico' },
  // { to: '/resultados', label: 'Mi ruta' }, // oculto del nav por ahora, reactivar si se vuelve a necesitar
  { to: '/comunidad', label: 'Comunidad Facultad de Ingeniería' },
]

/** Ancho base del indicador; el ancho real se consigue escalando en X. */
const INDICATOR_BASE_WIDTH = 100

function Navbar() {
  const { pathname } = useLocation()
  const list = useRef(null)
  const indicator = useRef(null)
  const hasPositioned = useRef(false)

  // Un solo subrayado que viaja hasta el enlace activo, en lugar de dos bordes
  // que se encienden y se apagan: el ojo sigue un objeto y entiende de dónde a
  // dónde se movió. Se posiciona con transform para no tocar el layout.
  useGSAP(
    () => {
      const place = (animate) => {
        const active = list.current?.querySelector('[aria-current="page"]')

        if (!active) {
          gsap.to(indicator.current, { opacity: 0, duration: DUR.feedback, overwrite: true })
          return
        }

        gsap.to(indicator.current, {
          opacity: 1,
          x: active.offsetLeft,
          y: active.offsetTop + active.offsetHeight,
          scaleX: active.offsetWidth / INDICATOR_BASE_WIDTH,
          duration: animate ? DUR.state : 0,
          ease: EASE.state,
          overwrite: true,
        })
      }

      // La primera colocación es instantánea: el subrayado no "llega" a la
      // página, ya estaba ahí.
      place(hasPositioned.current && !prefersReducedMotion())
      hasPositioned.current = true

      const onResize = () => place(false)
      window.addEventListener('resize', onResize)
      return () => window.removeEventListener('resize', onResize)
    },
    { dependencies: [pathname], scope: list },
  )

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

        <nav ref={list} className="relative">
          <span
            ref={indicator}
            aria-hidden="true"
            className="pointer-events-none absolute top-0 left-0 h-0.5 w-[100px] origin-left rounded-full bg-gold opacity-0 shadow-[0_1px_6px_rgb(0_0_0/60%)]"
          />
          <ul className="flex flex-wrap items-center gap-8 text-lg font-semibold md:text-xl">
            {links.map(({ to, label, end }) => (
              <li key={to}>
                <NavLink
                  to={to}
                  end={end}
                  className={({ isActive }) =>
                    `pb-1 font-medium [text-shadow:0_1px_6px_rgb(0_0_0/75%)] transition-colors duration-200 ${
                      isActive ? 'text-gold-light' : 'text-paper hover:text-gold-light'
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

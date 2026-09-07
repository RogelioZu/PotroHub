import { useEffect, useRef, useState } from 'react'
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
  const [menuOpen, setMenuOpen] = useState(false)
  const [menuPathname, setMenuPathname] = useState(pathname)
  const list = useRef(null)
  const indicator = useRef(null)
  const hasPositioned = useRef(false)

  // Un solo subrayado que viaja hasta el enlace activo, en lugar de dos bordes
  // que se encienden y se apagan: el ojo sigue un objeto y entiende de dónde a
  // dónde se movió. Se posiciona con transform para no tocar el layout.
  // Solo existe en el nav de escritorio: en móvil el menú es una lista
  // vertical y no tiene sentido un subrayado que "viaja".
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

  // El menú móvil se cierra solo al llegar a la página nueva, para no dejarlo
  // abierto tapando el contenido que acaba de aparecer. Se ajusta durante el
  // render (el patrón que React recomienda para "resetear estado cuando cambia
  // una prop") en vez de en un efecto, que dispararía un re-render extra.
  if (pathname !== menuPathname) {
    setMenuPathname(pathname)
    setMenuOpen(false)
  }

  // Escape también lo cierra, sin depender de encontrar el botón con el mouse.
  useEffect(() => {
    if (!menuOpen) return
    const onKeyDown = (event) => {
      if (event.key === 'Escape') setMenuOpen(false)
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [menuOpen])

  return (
    <header className="relative overflow-hidden text-paper">
      <VitralBackdrop scrimClassName="" />

      <div className="relative z-10 mx-auto flex max-w-6xl items-center justify-between gap-4 px-6 py-6 sm:py-8 md:py-10">
        <Link
          to="/"
          className="text-3xl font-bold text-paper [text-shadow:0_2px_10px_rgb(0_0_0/70%)] md:text-5xl"
        >
          Potro<span className="text-gold-light">Path</span>
        </Link>

        <nav ref={list} className="relative hidden lg:block">
          <span
            ref={indicator}
            aria-hidden="true"
            className="pointer-events-none absolute top-0 left-0 h-0.5 w-[100px] origin-left rounded-full bg-gold opacity-0 shadow-[0_1px_6px_rgb(0_0_0/60%)]"
          />
          <ul className="flex items-center gap-8 text-lg font-semibold md:text-xl">
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

        {/* Botón hamburguesa: tres barras que se cierran en X, solo bajo md. */}
        <button
          type="button"
          onClick={() => setMenuOpen((open) => !open)}
          aria-expanded={menuOpen}
          aria-controls="mobile-nav"
          aria-label={menuOpen ? 'Cerrar menú' : 'Abrir menú'}
          className="flex h-10 w-10 shrink-0 flex-col items-center justify-center gap-1.5 lg:hidden"
        >
          <span
            aria-hidden="true"
            className={`h-0.5 w-6 rounded-full bg-paper shadow-[0_1px_6px_rgb(0_0_0/60%)] transition-transform duration-200 ${
              menuOpen ? 'translate-y-2 rotate-45' : ''
            }`}
          />
          <span
            aria-hidden="true"
            className={`h-0.5 w-6 rounded-full bg-paper shadow-[0_1px_6px_rgb(0_0_0/60%)] transition-opacity duration-200 ${
              menuOpen ? 'opacity-0' : ''
            }`}
          />
          <span
            aria-hidden="true"
            className={`h-0.5 w-6 rounded-full bg-paper shadow-[0_1px_6px_rgb(0_0_0/60%)] transition-transform duration-200 ${
              menuOpen ? '-translate-y-2 -rotate-45' : ''
            }`}
          />
        </button>
      </div>

      {/*
        Panel móvil. `grid-template-rows` anima de `0fr` a `1fr`: a
        diferencia de `max-height`, no hay que adivinar una altura a la que
        apuntar, y el contenido puede cambiar de tamaño sin romper la
        animación. `overflow-hidden` va en el hijo, que es la única pista de
        la rejilla.
      */}
      <div
        id="mobile-nav"
        className={`relative z-10 grid transition-[grid-template-rows] duration-300 ease-out lg:hidden ${
          menuOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
        }`}
      >
        <ul className="overflow-hidden border-t border-paper/15 px-6">
          {links.map(({ to, label, end }) => (
            <li key={to}>
              <NavLink
                to={to}
                end={end}
                className={({ isActive }) =>
                  `block py-3 text-lg font-semibold [text-shadow:0_1px_6px_rgb(0_0_0/75%)] ${
                    isActive ? 'text-gold-light' : 'text-paper'
                  }`
                }
              >
                {label}
              </NavLink>
            </li>
          ))}
        </ul>
      </div>
    </header>
  )
}

export default Navbar

import { useEffect, useRef, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { gsap, prefersReducedMotion, useGSAP } from '../../lib/gsap'
import { DUR, EASE } from '../../lib/motion'
import VitralBackdrop from '../ui/VitralBackdrop'

const links = [
  { to: '/', label: 'Inicio', end: true },
  { to: '/quiz', label: 'Diagnóstico' },
  { to: '/comunidad', label: 'Comunidad Facultad de Ingeniería' },
]

/** Ancho base del indicador; el ancho real se consigue escalando en X. */
const INDICATOR_BASE_WIDTH = 100

/**
 * Sobre el vitral, el oro que se lee es `Oro Claro` y sólo en tamaño grande:
 * medido sobre la franja de tinta da 3.63:1, que pasa el umbral de texto
 * grande (3:1) y no el de texto normal (4.5:1). Por eso el enlace activo va
 * en negrita a 20px —con eso califica como texto grande— y el inactivo se
 * queda en `Papel`, que da 6.09:1 a cualquier tamaño.
 */
const linkTone = (isActive) =>
  `[text-shadow:0_1px_6px_rgb(0_0_0/75%)] transition-colors duration-200 ${
    isActive ? 'font-bold text-gold-light' : 'font-medium text-paper hover:text-gold-light'
  }`

/** Escritorio: `pb-1` es el aire por el que pasa el subrayado que viaja. */
const deskLink = ({ isActive }) => `pb-1 ${linkTone(isActive)}`
/** Móvil: `py-3` sobre 28px de interlínea deja el objetivo táctil en 52px. */
const mobileLink = ({ isActive }) => `block py-3 ${linkTone(isActive)}`

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
      <VitralBackdrop />

      <div className="relative z-10 mx-auto flex max-w-6xl items-center justify-between gap-4 px-6 py-6 sm:py-8 md:py-10">
        <Link
          to="/"
          className="text-3xl font-bold text-paper [text-shadow:0_2px_10px_rgb(0_0_0/70%)] md:text-5xl"
        >
          Potro<span className="text-gold-light">Path</span>
        </Link>

        <nav ref={list} aria-label="Principal" className="relative hidden lg:block">
          {/*
            El indicador pasó de `Oro Viejo` a `Oro Claro`: sobre la franja del
            vitral el primero medía 2.47:1 y el segundo da 3.63:1, que es lo
            que pide un elemento no textual. Es además el oro que el sistema
            reserva para el vidrio.
          */}
          <span
            ref={indicator}
            aria-hidden="true"
            className="pointer-events-none absolute top-0 left-0 h-0.5 w-[100px] origin-left rounded-full bg-gold-light opacity-0 shadow-[0_1px_6px_rgb(0_0_0/60%)]"
          />
          <ul className="flex items-center gap-8 text-xl">
            {links.map(({ to, label, end }) => (
              <li key={to}>
                <NavLink to={to} end={end} className={deskLink}>
                  {label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        {/* Botón hamburguesa: tres barras que se cierran en X, solo bajo lg. */}
        <button
          type="button"
          onClick={() => setMenuOpen((open) => !open)}
          aria-expanded={menuOpen}
          aria-controls="mobile-nav"
          aria-label={menuOpen ? 'Cerrar menú' : 'Abrir menú'}
          className="flex h-11 w-11 shrink-0 flex-col items-center justify-center gap-1.5 rounded-full lg:hidden"
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

        `inert` mientras está cerrado: si no, los tres enlaces siguen en el
        orden de tabulación aunque midan cero de alto, y el teclado se pierde
        en un panel invisible antes de llegar al contenido.
      */}
      <div
        id="mobile-nav"
        className={`relative z-10 grid transition-[grid-template-rows] duration-300 ease-out lg:hidden ${
          menuOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
        }`}
      >
        <nav aria-label="Principal" inert={!menuOpen} className="overflow-hidden">
          {/* `pb-6` no es aire decorativo: la franja de lectura se desvanece
              en los últimos 24px, así que el último enlace necesita ese
              canalón para no caer dentro del degradado. */}
          <ul className="border-t border-paper/15 px-6 pb-6 text-xl">
            {links.map(({ to, label, end }) => (
              <li key={to}>
                <NavLink to={to} end={end} className={mobileLink}>
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

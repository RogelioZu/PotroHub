import { useRef } from 'react'
import { gsap, useGSAP } from '../../lib/gsap'
import { DUR, EASE, FULL_MOTION, REVEAL_START, SHIFT, STAGGER } from '../../lib/motion'

/**
 * Revelado al entrar en viewport, para listas que aparecen *como* listas
 * (rejillas de tarjetas). No es para envolver cada sección del sitio: repetir
 * la misma entrada en todos lados convierte el movimiento en ruido.
 *
 * Los hijos se animan con `gsap.from`, así que su estado por defecto en el
 * HTML es visible: si el JS falla, la página se ve completa.
 */
function Reveal({
  as: Tag = 'div',
  children,
  className = '',
  selector,
  stagger = STAGGER.list,
  y = SHIFT,
  start = REVEAL_START,
  ...rest
}) {
  const root = useRef(null)

  useGSAP(
    () => {
      const targets = selector
        ? gsap.utils.toArray(selector, root.current)
        : Array.from(root.current.children)
      if (!targets.length) return

      const mm = gsap.matchMedia()
      mm.add(FULL_MOTION, () => {
        gsap.from(targets, {
          opacity: 0,
          y,
          duration: DUR.view,
          ease: EASE.enter,
          stagger,
          scrollTrigger: { trigger: root.current, start, once: true },
        })
      })

      return () => mm.revert()
    },
    { scope: root },
  )

  return (
    <Tag ref={root} className={className} {...rest}>
      {children}
    </Tag>
  )
}

export default Reveal

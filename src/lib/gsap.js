/**
 * Punto único de registro de GSAP. Ningún componente importa `gsap`
 * directamente: todos pasan por aquí para que los plugins se registren una
 * sola vez y los valores por defecto sean los mismos en todo el sitio.
 *
 * Desde GSAP 3.13 todos los plugins vienen en el paquete público de npm, así
 * que ScrollTrigger, SplitText y ScrollSmoother no requieren licencia.
 */
import { useGSAP } from '@gsap/react'
import { gsap } from 'gsap'
import { ScrollSmoother } from 'gsap/ScrollSmoother'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { SplitText } from 'gsap/SplitText'
import { DUR, EASE, REDUCED_MOTION } from './motion'

gsap.registerPlugin(useGSAP, ScrollTrigger, SplitText, ScrollSmoother)

gsap.defaults({ duration: DUR.state, ease: EASE.state })

// La barra de direcciones móvil cambia de alto al hacer scroll; sin esto,
// ScrollTrigger recalcularía posiciones a media lectura.
ScrollTrigger.config({ ignoreMobileResize: true })

/**
 * Para las ramas imperativas (transición de ruta) donde `gsap.matchMedia()`
 * no aplica porque no hay un contexto que revertir.
 */
export function prefersReducedMotion() {
  return window.matchMedia(REDUCED_MOTION).matches
}

/**
 * Las imágenes del vitral cargan después del primer render y descuadran las
 * mediciones de ScrollTrigger. Se llama desde el `onLoad` de cada una.
 */
export function refreshScrollTriggers() {
  ScrollTrigger.refresh()
}

export { gsap, ScrollSmoother, ScrollTrigger, SplitText, useGSAP }

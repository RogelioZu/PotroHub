/**
 * Tokens de movimiento de PotroPath.
 *
 * La tesis es "el vitral se arma": fragmentos de luz que se acomodan. De ahí
 * salen los revelados por máscara y los barridos dorados; el desplazamiento
 * con desvanecido queda reservado a las listas que aparecen como listas.
 *
 * Tener las duraciones y curvas en un solo lugar es lo que hace que el sitio
 * se sienta un sistema y no una colección de efectos sueltos.
 */

/** Duraciones en segundos, elegidas por consecuencia y no por gusto. */
export const DUR = {
  /** Acuse inmediato: selección de opción, presión de un control. */
  feedback: 0.15,
  /** Cambio de estado rutinario: subrayado del nav, barra de progreso. */
  state: 0.28,
  /** Cambio de vista: transición de ruta, revelado al hacer scroll. */
  view: 0.45,
  /** Entrada con autoría. Solo el hero y la revelación de resultados. */
  focal: 0.7,
  /** Barrido de luz dorada sobre una palabra clave. */
  sweep: 0.6,
}

export const EASE = {
  /** Desaceleración exponencial: llegadas seguras. */
  enter: 'expo.out',
  /** Las salidas son más rápidas que las entradas. */
  exit: 'power2.in',
  state: 'power2.out',
  sweep: 'power2.inOut',
  /** Único rebote del sitio, reservado al potro: ahí la personalidad es el objetivo. */
  land: 'back.out(1.6)',
}

/**
 * Siempre `amount` y nunca `each`: así el retardo total queda acotado sin
 * importar cuántos elementos tenga la lista.
 */
export const STAGGER = {
  tight: { amount: 0.15 },
  /** Palabras de un titular: el retardo total debe caber en un parpadeo. */
  words: { amount: 0.22 },
  list: { amount: 0.3 },
  bars: { amount: 0.4 },
}

/** Desplazamiento vertical estándar de un revelado. */
export const SHIFT = 24

export const REDUCED_MOTION = '(prefers-reduced-motion: reduce)'
export const FULL_MOTION = '(prefers-reduced-motion: no-preference)'

/**
 * ScrollSmoother solo donde no estorba: nunca en táctil, nunca con puntero
 * grueso y nunca con movimiento reducido.
 */
export const SMOOTH_SCROLL = '(min-width: 768px) and (hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)'

/** Punto de disparo compartido por los revelados al hacer scroll. */
export const REVEAL_START = 'top 85%'

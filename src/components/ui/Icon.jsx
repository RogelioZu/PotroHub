/**
 * Los íconos del sitio: seis trazos dibujados aquí, sin librería.
 *
 * Antes eran glifos (↗ ↓ → ← ☰ ×) y DM Sans no los trae, así que el
 * navegador los tomaba de una fuente del sistema: otro peso, otra altura y un
 * dibujo distinto en cada sistema operativo. Un trazo propio de 1.6px en una
 * retícula de 16 acompaña el peso 600 de las etiquetas en cualquier pantalla.
 *
 * La semántica de las flechas es la que el sitio ya tenía:
 * - `arrow-up-right`: lleva a otra vista o a otro sitio.
 * - `arrow-down`: baja a una sección de la misma página.
 * - `arrow-right` / `arrow-left`: avanzar o retroceder en una secuencia.
 *
 * Siempre decorativo: la etiqueta de texto que acompaña ya dice qué hace el
 * control, así que el ícono va oculto para el lector de pantalla.
 */
const PATHS = {
  'arrow-right': 'M3 8h10M9 4l4 4-4 4',
  'arrow-left': 'M13 8H3M7 4 3 8l4 4',
  'arrow-down': 'M8 3v10M4 9l4 4 4-4',
  'arrow-up-right': 'M4.5 11.5 11.5 4.5M5.5 4.5h6v6',
  menu: 'M2.5 4.5h11M2.5 8h11M2.5 11.5h11',
  close: 'M4 4l8 8M12 4l-8 8',
}

function Icon({ name }) {
  return (
    <svg className={`icon icon-${name}`} viewBox="0 0 16 16" aria-hidden="true" focusable="false">
      <path d={PATHS[name]} />
    </svg>
  )
}

export default Icon

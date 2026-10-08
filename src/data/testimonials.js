/**
 * Voces del piloto. **Vacío a propósito**: ningún estudiante ha usado todavía
 * PotroPath en un piloto, y un testimonio inventado destruiría exactamente la
 * credibilidad que el proyecto existe para ganarse (PRODUCT.md → Evidence on
 * Hand). Con la colección vacía, Inicio no muestra la sección ni una tarjeta
 * de relleno.
 *
 * Un registro sólo entra aquí si existe, fuera del repositorio, una
 * autorización de publicación de esa persona (ver docs/PILOTO.md →
 * Testimonios). Este archivo es público: nunca lleva correos, matrículas,
 * firmas ni documentos de consentimiento.
 *
 * Forma de cada registro aprobado:
 *
 *   {
 *     id: 'p1-03',                 // código del registro privado, no un dato personal
 *     quote: '…',                  // palabras reales, 25–50 palabras, sin cambiar el sentido
 *     displayName: 'A. M.',        // nombre, iniciales o 'Participante del piloto', según elija
 *     context: '4.º semestre',     // opcional, sólo si no la identifica contra su intención
 *     cohortLabel: 'Piloto 1 · nov 2026',
 *     publishedAt: '2026-11-20',
 *   }
 *
 * Si alguien retira su autorización, su registro se borra de aquí en la
 * siguiente publicación.
 */
export const TESTIMONIALS = []

/**
 * Estado de la convocatoria del piloto. Mientras sea `planned`, Inicio no
 * dice nada del piloto. Con `recruiting` **y** un `callUrl` real muestra la
 * invitación "Ayúdanos a mejorar PotroPath"; sin enlace no hay invitación,
 * porque un botón que no lleva a ningún lado es una promesa vacía.
 *
 * status: 'planned' | 'recruiting' | 'running' | 'done'
 */
export const PILOT = {
  status: 'planned',
  callUrl: null,
  /** Enlace al informe de resultados agregados cuando exista. */
  reportUrl: null,
}

/**
 * Fecha de revisión legible ("7 oct 2026") a partir de `AAAA-MM-DD`.
 *
 * Se construye en UTC a propósito: `new Date('2026-10-07')` es medianoche
 * UTC, y formateada en la zona de México caería en el 6 de octubre. Las
 * fechas de revisión son días de calendario, no instantes.
 */
const reviewFormat = new Intl.DateTimeFormat('es-MX', {
  day: 'numeric',
  month: 'short',
  year: 'numeric',
  timeZone: 'UTC',
})

export function formatReviewDate(isoDate) {
  return reviewFormat.format(new Date(`${isoDate}T00:00:00Z`)).replace('.', '')
}

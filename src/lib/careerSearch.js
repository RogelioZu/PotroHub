/**
 * Búsqueda pública de empleos en LinkedIn por puesto y ubicación.
 *
 * Sólo viajan los dos términos que el estudiante escribió en el formulario,
 * codificados con `URLSearchParams` para que acentos, espacios, `&` o `#` no
 * rompan la URL ni inyecten parámetros. Nunca se envían respuestas del
 * diagnóstico ni porcentajes. PotroPath no lee resultados de LinkedIn: abre
 * su búsqueda y LinkedIn controla el resto.
 */
export const LINKEDIN_JOBS_URL = 'https://www.linkedin.com/jobs/search/'

/** Ubicación inicial: una preferencia editable del producto, no una inferencia del usuario. */
export const DEFAULT_LOCATION = 'México'

export function linkedInSearch(keywords, location = DEFAULT_LOCATION) {
  const params = new URLSearchParams({
    keywords: String(keywords).trim(),
    location: String(location).trim(),
  })
  return `${LINKEDIN_JOBS_URL}?${params.toString()}`
}

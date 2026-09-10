/**
 * Las cinco áreas son fijas y de igual peso: el diagnóstico no rankea áreas,
 * las mide. Ninguna vista debe destacar una sobre las otras antes de que el
 * estudiante responda.
 *
 * Las fotos son WebP a 1200px de ancho en `public/images/areas/`. Llegaron
 * como JPEG de 2432px con extensión `.png` —9.7 MB entre las cinco— y el
 * teléfono con mala red del campus es un caso primario del producto, no un
 * respaldo (ver PRODUCT.md → Accessibility). A 1200px pesan 308 KB en total
 * y siguen alcanzando para la tarjeta más ancha de la rejilla de Inicio, que
 * mide unos 560px y a 2x pide 1120px.
 */
export const AREAS = [
  {
    id: 'ia',
    name: 'Inteligencia Artificial',
    description: 'Aprendizaje automático, modelos de lenguaje y visión por computadora aplicados a problemas reales.',
    image: '/images/areas/ia.webp',
  },
  {
    id: 'ciberseguridad',
    name: 'Ciberseguridad',
    description: 'Protección de sistemas, análisis de vulnerabilidades y respuesta a incidentes.',
    image: '/images/areas/seguridad.webp',
  },
  {
    id: 'nube',
    name: 'Cloud Computing',
    description: 'Arquitectura, despliegue y administración de infraestructura en la nube.',
    image: '/images/areas/cloud.webp',
  },
  {
    id: 'ciencia-datos',
    name: 'Ciencia de Datos',
    description: 'Análisis estadístico, modelado predictivo y visualización de datos para la toma de decisiones.',
    image: '/images/areas/dc.webp',
  },
  {
    id: 'software',
    name: 'Desarrollo de Software',
    description: 'Diseño, construcción y mantenimiento de aplicaciones y sistemas.',
    image: '/images/areas/desarrollo.webp',
  },
]

export const AREA_BY_ID = Object.fromEntries(AREAS.map((area) => [area.id, area]))

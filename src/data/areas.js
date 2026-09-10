/**
 * Las cinco áreas son fijas y de igual peso: el diagnóstico no rankea áreas,
 * las mide. Ninguna vista debe destacar una sobre las otras antes de que el
 * estudiante responda.
 *
 * Las fotos son WebP a 1200px de ancho. En PNG a tamaño completo pesaban
 * 9.7 MB entre las cinco, y el teléfono con mala red del campus es un caso
 * primario del producto, no un respaldo (ver PRODUCT.md → Accessibility).
 */
export const AREAS = [
  {
    id: 'ia',
    name: 'Inteligencia Artificial',
    description: 'Aprendizaje automático, modelos de lenguaje y visión por computadora aplicados a problemas reales.',
    image: '/images/IA.webp',
  },
  {
    id: 'ciberseguridad',
    name: 'Ciberseguridad',
    description: 'Protección de sistemas, análisis de vulnerabilidades y respuesta a incidentes.',
    image: '/images/Seguridad.webp',
  },
  {
    id: 'nube',
    name: 'Cloud Computing',
    description: 'Arquitectura, despliegue y administración de infraestructura en la nube.',
    image: '/images/Cloud.webp',
  },
  {
    id: 'ciencia-datos',
    name: 'Ciencia de Datos',
    description: 'Análisis estadístico, modelado predictivo y visualización de datos para la toma de decisiones.',
    image: '/images/DC.webp',
  },
  {
    id: 'software',
    name: 'Desarrollo de Software',
    description: 'Diseño, construcción y mantenimiento de aplicaciones y sistemas.',
    image: '/images/Desarrollo.webp',
  },
]

export const AREA_BY_ID = Object.fromEntries(AREAS.map((area) => [area.id, area]))

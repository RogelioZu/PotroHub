/**
 * Las cinco áreas fijas del diagnóstico.
 *
 * `image` apunta a `public/images/areas/*.webp`: los originales eran JPEG de
 * 2432px de ancho con extensión `.png` —unos 2 MB cada uno, 10 MB entre los
 * cinco— para pintarse en una tarjeta de 240px. El teléfono con red de campus
 * mala es un caso de uso primario, no un respaldo: reencodados a 720px de
 * ancho pesan 187 KB en total y se ven idénticos en la tarjeta.
 */
export const AREAS = [
  {
    id: 'ia',
    name: 'Inteligencia Artificial',
    description: 'Aprendizaje automático, modelos de lenguaje y visión por computadora aplicados a problemas reales.',
    image: '/images/areas/ia.webp'
  },
  {
    id: 'ciberseguridad',
    name: 'Ciberseguridad',
    description: 'Protección de sistemas, análisis de vulnerabilidades y respuesta a incidentes.',
    image: '/images/areas/seguridad.webp'
  },
  {
    id: 'nube',
    name: 'Cloud Computing',
    description: 'Arquitectura, despliegue y administración de infraestructura en la nube.',
    image: '/images/areas/cloud.webp'
  },
  {
    id: 'ciencia-datos',
    name: 'Ciencia de Datos',
    description: 'Análisis estadístico, modelado predictivo y visualización de datos para la toma de decisiones.',
    image: '/images/areas/dc.webp'
  },
  {
    id: 'software',
    name: 'Desarrollo de Software',
    description: 'Diseño, construcción y mantenimiento de aplicaciones y sistemas.',
    image: '/images/areas/desarrollo.webp'
  },
]

export const AREA_BY_ID = Object.fromEntries(AREAS.map((area) => [area.id, area]))

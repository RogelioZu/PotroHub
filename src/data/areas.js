export const AREAS = [
  {
    id: 'ia',
    name: 'Inteligencia Artificial',
    description: 'Aprendizaje automático, modelos de lenguaje y visión por computadora aplicados a problemas reales.',
    image: '/images/IA.png'
  },
  {
    id: 'ciberseguridad',
    name: 'Ciberseguridad',
    description: 'Protección de sistemas, análisis de vulnerabilidades y respuesta a incidentes.',
    image: '/images/Seguridad.png'
  },
  {
    id: 'nube',
    name: 'Cloud Computing',
    description: 'Arquitectura, despliegue y administración de infraestructura en la nube.',
    image: '/images/Cloud.png'
  },
  {
    id: 'ciencia-datos',
    name: 'Ciencia de Datos',
    description: 'Análisis estadístico, modelado predictivo y visualización de datos para la toma de decisiones.',
    image: '/images/DC.png'
  },
  {
    id: 'software',
    name: 'Desarrollo de Software',
    description: 'Diseño, construcción y mantenimiento de aplicaciones y sistemas.',
    image: '/images/Desarrollo.png'
  },
]

export const AREA_BY_ID = Object.fromEntries(AREAS.map((area) => [area.id, area]))

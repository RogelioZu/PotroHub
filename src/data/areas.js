export const AREAS = [
  {
    id: 'ia',
    name: 'Inteligencia Artificial',
    description: 'Aprendizaje automático, modelos de lenguaje y visión por computadora aplicados a problemas reales.',
    tone: 'from-green to-green-mid',
  },
  {
    id: 'ciberseguridad',
    name: 'Ciberseguridad',
    description: 'Protección de sistemas, análisis de vulnerabilidades y respuesta a incidentes.',
    tone: 'from-gold-dark to-gold',
  },
  {
    id: 'nube',
    name: 'Cloud Computing',
    description: 'Arquitectura, despliegue y administración de infraestructura en la nube.',
    tone: 'from-green-mid to-green',
  },
  {
    id: 'ciencia-datos',
    name: 'Ciencia de Datos',
    description: 'Análisis estadístico, modelado predictivo y visualización de datos para la toma de decisiones.',
    tone: 'from-gold to-gold-dark',
  },
  {
    id: 'software',
    name: 'Desarrollo de Software',
    description: 'Diseño, construcción y mantenimiento de aplicaciones y sistemas.',
    tone: 'from-green to-gold-dark',
  },
]

export const AREA_BY_ID = Object.fromEntries(AREAS.map((area) => [area.id, area]))

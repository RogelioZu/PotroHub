export const AREAS = [
  {
    id: 'software',
    name: 'Software',
    description: 'Desarrollo de aplicaciones, ingeniería de software y arquitectura de sistemas.',
  },
  {
    id: 'hardware',
    name: 'Hardware',
    description: 'Diseño de sistemas embebidos, electrónica digital y prototipado.',
  },
  {
    id: 'redes',
    name: 'Redes',
    description: 'Infraestructura, telecomunicaciones y administración de redes.',
  },
  {
    id: 'bases-datos',
    name: 'Bases de datos',
    description: 'Modelado, administración y explotación de datos.',
  },
  {
    id: 'administracion',
    name: 'Administración TI',
    description: 'Gestión de proyectos, procesos e infraestructura tecnológica.',
  },
]

export const AREA_BY_ID = Object.fromEntries(AREAS.map((area) => [area.id, area]))

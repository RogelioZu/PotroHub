/**
 * Banco de 50 preguntas (10 por área) para el Motor de Diagnóstico
 * Situacional. Cada pregunta se responde en una escala de acuerdo de 1 a 5
 * y suma puntos únicamente al área a la que pertenece.
 */

const RAW_QUESTIONS = {
  software: [
    'Disfruto traducir un problema del mundo real en un algoritmo paso a paso.',
    'Me entusiasma depurar un error difícil de encontrar en el código hasta resolverlo.',
    'Prefiero diseñar la arquitectura de un sistema antes de escribir la primera línea de código.',
    'Me interesa aprender nuevos lenguajes y frameworks de programación por iniciativa propia.',
    'Disfruto refactorizar código para hacerlo más legible y mantenible.',
    'Me gusta participar en revisiones de código (code reviews) de mis compañeros.',
    'Prefiero automatizar tareas repetitivas escribiendo un script antes que hacerlas manualmente.',
    'Me atrae el desarrollo de aplicaciones móviles o web de principio a fin.',
    'Disfruto resolver retos de programación competitiva o algorítmica.',
    'Me interesa aprender sobre pruebas de software (testing) y control de calidad.',
  ],
  hardware: [
    'Disfruto armar y ensamblar componentes electrónicos físicamente.',
    'Me interesa entender cómo funciona un microcontrolador a nivel de circuito.',
    'Prefiero resolver un problema soldando o cableando en lugar de programando.',
    'Disfruto diseñar y probar prototipos con placas como Arduino o Raspberry Pi.',
    'Me atrae leer diagramas eléctricos y datasheets de componentes.',
    'Disfruto diagnosticar fallas físicas en un equipo de cómputo.',
    'Me interesa el diseño de sistemas embebidos para IoT (Internet de las Cosas).',
    'Prefiero optimizar el consumo energético de un dispositivo electrónico.',
    'Disfruto experimentar con sensores y actuadores en proyectos físicos.',
    'Me atrae la idea de diseñar circuitos impresos (PCB).',
  ],
  redes: [
    'Me interesa entender cómo viajan los datos de un dispositivo a otro.',
    'Disfruto configurar routers, switches o puntos de acceso.',
    'Prefiero resolver problemas de conectividad antes que problemas de código.',
    'Me atrae el diseño de la topología de red para una empresa.',
    'Disfruto aprender sobre protocolos de comunicación (TCP/IP, HTTP, etc.).',
    'Me interesa la seguridad perimetral y la protección de una red contra ataques.',
    'Disfruto administrar servidores y servicios de red.',
    'Me atrae certificarme en tecnologías de networking (CCNA y similares).',
    'Prefiero diagnosticar la causa de una caída de red antes que optimizar una app.',
    'Me interesa el monitoreo de tráfico y desempeño de una red.',
  ],
  'bases-datos': [
    'Disfruto diseñar el modelo entidad-relación de un sistema.',
    'Me interesa optimizar consultas SQL para que se ejecuten más rápido.',
    'Prefiero organizar y limpiar datos antes que construir una interfaz.',
    'Disfruto analizar grandes volúmenes de datos para encontrar patrones.',
    'Me atrae aprender sobre bases de datos NoSQL y su uso en distintos escenarios.',
    'Disfruto diseñar procesos de respaldo y recuperación de información.',
    'Me interesa garantizar la integridad y seguridad de los datos de un sistema.',
    'Prefiero construir reportes y dashboards a partir de datos existentes.',
    'Disfruto normalizar una base de datos para evitar redundancia.',
    'Me atrae trabajar con grandes volúmenes de datos (Big Data).',
  ],
  administracion: [
    'Disfruto planear los tiempos y entregables de un proyecto de software.',
    'Me interesa coordinar a un equipo de trabajo para cumplir un objetivo común.',
    'Prefiero definir procesos y metodologías antes que ejecutar tareas técnicas.',
    'Disfruto negociar el alcance de un proyecto con un cliente o usuario.',
    'Me atrae gestionar la infraestructura tecnológica de una organización.',
    'Disfruto evaluar riesgos y proponer planes de contingencia en un proyecto.',
    'Me interesa aprender sobre metodologías ágiles (Scrum, Kanban).',
    'Prefiero documentar procesos y políticas antes que programar una solución.',
    'Disfruto dar seguimiento al presupuesto y los recursos de un proyecto TI.',
    'Me atrae liderar la toma de decisiones tecnológicas de un equipo o empresa.',
  ],
}

export const QUESTIONS = Object.entries(RAW_QUESTIONS).flatMap(([areaId, prompts]) =>
  prompts.map((prompt, index) => ({
    id: `${areaId}-${index + 1}`,
    areaId,
    prompt,
  })),
)

export const SCALE = [
  { value: 1, label: 'Totalmente en desacuerdo' },
  { value: 2, label: 'En desacuerdo' },
  { value: 3, label: 'Neutral' },
  { value: 4, label: 'De acuerdo' },
  { value: 5, label: 'Totalmente de acuerdo' },
]

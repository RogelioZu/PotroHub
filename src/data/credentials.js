/**
 * Credenciales de referencia, dos por área, comparables por las mismas
 * dimensiones: tipo, nivel, preparación, evaluación y enfoque.
 *
 * Tres reglas de contenido:
 *
 * 1. **Un curso no es una certificación.** `type` distingue "certificado de
 *    programa" (se obtiene al completar actividades) de "certificación por
 *    examen" (se obtiene aprobando una evaluación del proveedor).
 * 2. **Sin precios ni duraciones.** Cambian por región y fecha; la tarjeta
 *    remite al proveedor en vez de publicar una cifra que envejece mal.
 * 3. **Fuente y fecha de revisión en cada registro.** `reviewedAt` es la
 *    fecha en la que alguien leyó la página oficial, no la de la última
 *    edición de este archivo: no se adelanta sin volver a leerla.
 *
 * Se retiró "TensorFlow Developer Certificate", que figuraba en la primera
 * versión: su página oficial indica que el examen está cerrado.
 */

export const CREDENTIALS = {
  ml: {
    id: 'ml',
    provider: 'DeepLearning.AI · Stanford Online',
    mark: 'ML',
    name: 'Machine Learning Specialization',
    type: 'Especialización con certificado',
    level: 'Inicial',
    purpose: 'Una introducción práctica a modelos supervisados, no supervisados y su evaluación.',
    prerequisites: 'Programación básica y matemáticas de bachillerato como preparación recomendada.',
    assessment: 'Actividades y ejercicios de programación del programa.',
    skills: 'Python · Modelos · Evaluación',
    sourceUrl: 'https://www.coursera.org/specializations/machine-learning-introduction',
    reviewedAt: '2026-10-07',
  },
  'deep-learning': {
    id: 'deep-learning',
    provider: 'DeepLearning.AI',
    mark: 'DL',
    name: 'Deep Learning Specialization',
    type: 'Especialización con certificado',
    level: 'Intermedio',
    purpose: 'Profundiza en redes neuronales y su aplicación a imágenes y secuencias.',
    prerequisites: 'Python intermedio; bases de álgebra lineal y machine learning recomendadas.',
    assessment: 'Ejercicios y proyectos de los cursos de la especialización.',
    skills: 'Redes neuronales · Python · Modelos',
    sourceUrl: 'https://www.coursera.org/specializations/deep-learning',
    reviewedAt: '2026-10-07',
  },
  'google-security': {
    id: 'google-security',
    provider: 'Google',
    mark: 'G',
    name: 'Google Cybersecurity Certificate',
    type: 'Certificado de programa',
    level: 'Inicial',
    purpose: 'Introducción a la detección de amenazas y al trabajo de un analista de seguridad.',
    prerequisites: 'No exige experiencia previa ni título para comenzar.',
    assessment: 'Evaluaciones y actividades prácticas del programa.',
    skills: 'Linux · Python · SQL · Seguridad',
    sourceUrl: 'https://grow.google/certificates/cybersecurity/',
    reviewedAt: '2026-10-07',
  },
  sc900: {
    id: 'sc900',
    provider: 'Microsoft',
    mark: 'MS',
    name: 'Security, Compliance, and Identity Fundamentals',
    type: 'Certificación por examen',
    level: 'Fundamentos',
    purpose: 'Comprende identidad, seguridad y cumplimiento en el ecosistema de Microsoft.',
    prerequisites: 'Familiaridad con Azure y Microsoft 365 recomendada por el proveedor.',
    assessment: 'Examen SC-900.',
    skills: 'Identidad · Seguridad cloud · Cumplimiento',
    sourceUrl:
      'https://learn.microsoft.com/en-us/credentials/certifications/security-compliance-and-identity-fundamentals/',
    reviewedAt: '2026-10-07',
  },
  'aws-foundation': {
    id: 'aws-foundation',
    provider: 'Amazon Web Services',
    mark: 'aws',
    name: 'AWS Certified Cloud Practitioner',
    type: 'Certificación por examen',
    level: 'Fundamentos',
    purpose: 'Una base para entender servicios, seguridad y conceptos de la nube de AWS.',
    prerequisites:
      'Dirigida también a quien comienza en cloud. El examen se ofrece en español de Latinoamérica.',
    assessment: 'Examen AWS Certified Cloud Practitioner.',
    skills: 'Cloud · Seguridad · Servicios AWS',
    sourceUrl: 'https://aws.amazon.com/certification/certified-cloud-practitioner/',
    reviewedAt: '2026-10-08',
  },
  az900: {
    id: 'az900',
    provider: 'Microsoft',
    mark: 'MS',
    name: 'Microsoft Certified: Azure Fundamentals',
    type: 'Certificación por examen',
    level: 'Fundamentos',
    purpose: 'Establece una base de servicios, arquitectura y gobierno en Microsoft Azure.',
    prerequisites:
      'El proveedor recomienda experiencia en un área de TI, como infraestructura, datos o desarrollo.',
    assessment: 'Examen AZ-900.',
    skills: 'Cloud · Redes · Almacenamiento',
    sourceUrl: 'https://learn.microsoft.com/en-us/credentials/certifications/azure-fundamentals/',
    reviewedAt: '2026-10-07',
  },
  'google-data': {
    id: 'google-data',
    provider: 'Google',
    mark: 'G',
    name: 'Google Data Analytics Certificate',
    type: 'Certificado de programa',
    level: 'Inicial',
    purpose: 'Recorre la preparación, el análisis y la comunicación de datos.',
    prerequisites: 'No exige título ni experiencia previa para comenzar.',
    assessment: 'Actividades y caso práctico del programa.',
    skills: 'Análisis · SQL · Visualización',
    sourceUrl: 'https://grow.google/certificates/data-analytics/',
    reviewedAt: '2026-10-07',
  },
  'google-advanced': {
    id: 'google-advanced',
    provider: 'Google',
    mark: 'G',
    name: 'Google Advanced Data Analytics Certificate',
    type: 'Certificado de programa',
    level: 'Avanzado',
    purpose: 'Da el siguiente paso hacia estadística y modelos de machine learning.',
    prerequisites: 'Google Data Analytics Certificate o experiencia equivalente recomendada.',
    assessment: 'Actividades y proyectos del programa avanzado.',
    skills: 'Python · Estadística · Machine learning',
    sourceUrl: 'https://www.coursera.org/professional-certificates/google-advanced-data-analytics',
    reviewedAt: '2026-10-08',
  },
  'meta-frontend': {
    id: 'meta-frontend',
    provider: 'Meta · Coursera',
    mark: 'M',
    name: 'Meta Front-End Developer',
    type: 'Certificado de programa',
    level: 'Inicial',
    purpose: 'Construye interfaces web con HTML, CSS, JavaScript y React.',
    prerequisites: 'No exige título ni experiencia previa para comenzar.',
    assessment: 'Actividades y proyecto de interfaz del programa.',
    skills: 'JavaScript · React · Git',
    sourceUrl: 'https://www.coursera.org/professional-certificates/meta-front-end-developer',
    reviewedAt: '2026-10-07',
  },
  'aws-developer': {
    id: 'aws-developer',
    provider: 'Amazon Web Services',
    mark: 'aws',
    name: 'AWS Certified Developer – Associate',
    type: 'Certificación por examen',
    level: 'Associate',
    purpose: 'Valida conocimientos de desarrollo y mantenimiento de aplicaciones en AWS.',
    prerequisites:
      'Orientada a quien ya desarrolla en AWS; revisa la experiencia recomendada antes de elegirla.',
    assessment: 'Examen AWS Certified Developer – Associate.',
    skills: 'Aplicaciones cloud · Despliegue · AWS',
    sourceUrl: 'https://aws.amazon.com/certification/certified-developer-associate/',
    reviewedAt: '2026-10-07',
  },
}

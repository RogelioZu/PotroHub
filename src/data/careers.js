/**
 * Ejemplos de perfiles profesionales publicados por empresas tecnológicas,
 * uno por área. Sirven para entender cómo se trabaja en cada especialidad y
 * qué se pide; no son un feed de vacantes, ni convenios, ni una lista de
 * empleadores asociados a PotroPath.
 *
 * Reglas para mantenerlos:
 *
 * - Requisitos mínimos (`required`) y deseables (`preferred`) se copian
 *   separados y resumidos de la ficha original. Nunca se atribuyen a toda la
 *   empresa: son de ese anuncio.
 * - El nivel se toma de la ficha. No se infiere "junior" porque falte un
 *   número de años.
 * - `project` es una sugerencia propia de PotroPath para practicar esas
 *   habilidades, y la interfaz lo rotula así.
 * - Cuando una ficha desaparece se sustituye, no se deja el enlace roto. La
 *   de AWS Solutions Architect (Lagos) devolvía 404 el 8 de octubre de 2026 y
 *   se cambió por la práctica de Cloud Support, que además es un ejemplo de
 *   entrada para estudiantes.
 */

export const CAREERS = [
  {
    id: 'nvidia-ml',
    areaId: 'ia',
    company: 'NVIDIA',
    title: 'Machine Learning Engineer',
    location: 'California, EE. UU.',
    level: 'Con experiencia · 3+ años en Python',
    summary:
      'Conecta modelos de IA con software de producción: evaluación, despliegue y operación sobre infraestructura distribuida.',
    responsibilities: [
      'Desarrollar y evaluar sistemas de IA.',
      'Automatizar pruebas y despliegues; escalar modelos sobre infraestructura con GPU.',
    ],
    required: [
      'Maestría o doctorado afín, o experiencia equivalente.',
      '3+ años de Python en producción; experiencia con frameworks de ML.',
      'Despliegue y orquestación de modelos; análisis de datos y conocimiento de GPU.',
    ],
    preferred: [
      'La ficha consultada no separa requisitos deseables. Consulta el detalle original.',
    ],
    skillIds: ['python', 'ml', 'mlops'],
    project:
      'Publica una API local de predicción con pruebas y un informe de calidad del modelo.',
    sourceUrl:
      'https://nvidia.wd5.myworkdayjobs.com/en-US/NVIDIAExternalCareerSite/job/Machine-Learning-Engineer_JR2025036',
    reviewedAt: '2026-10-07',
  },
  {
    id: 'amazon-security',
    areaId: 'ciberseguridad',
    company: 'Amazon',
    title: 'Security Engineer',
    location: 'Milán, Italia',
    level: 'Con experiencia · 3+ años en pruebas de seguridad',
    summary:
      'Evalúa servicios y código para encontrar fallos de seguridad y ayuda a los equipos a corregir su diseño.',
    responsibilities: [
      'Realizar pruebas ofensivas autorizadas y revisión de código.',
      'Documentar evidencia y proponer controles de seguridad.',
    ],
    required: [
      'Grado afín o experiencia profesional equivalente.',
      '3+ años en pentesting, auditoría, bug hunting o CTF; 2+ años programando en Python o equivalente.',
      'Experiencia con AWS y profundidad en al menos dos dominios de seguridad.',
    ],
    preferred: [
      'Experiencia apoyando ejercicios de Red Team.',
      'Arquitecturas Linux, serverless o de microservicios.',
    ],
    skillIds: ['networks', 'python', 'appsec', 'identity'],
    project:
      'Audita una aplicación de laboratorio y acompaña cada hallazgo de una prueba y una corrección.',
    sourceUrl:
      'https://www.amazon.jobs/en/jobs/10541971/security-engineer-security-verification-validation-team',
    reviewedAt: '2026-10-07',
  },
  {
    id: 'aws-cloud-support-intern',
    areaId: 'nube',
    company: 'Amazon Web Services',
    title: 'Cloud Support Associate · Práctica 2027',
    location: 'Dublín, Irlanda',
    level: 'Práctica de 6 meses · estudiantes que egresan en 2028',
    summary:
      'Atiende casos técnicos de clientes de AWS: diagnostica la causa raíz de un problema y construye herramientas para el equipo de soporte.',
    responsibilities: [
      'Resolver casos de clientes aplicando técnicas de diagnóstico sobre servicios en la nube.',
      'Construir herramientas y scripts para el equipo, y completar certificaciones de AWS durante la práctica.',
    ],
    required: [
      'Licenciatura o maestría en tecnología en curso, con egreso en 2028.',
      'Conocimiento básico de un lenguaje de scripting (por ejemplo Python o shell).',
      'Bases de redes, bases de datos y sistemas operativos Windows o Linux.',
    ],
    preferred: [
      'Fundamentos de internet y de cómputo en la nube.',
      'Redes: DNS, HTTP, TCP/UDP, subredes, NAT y modelo OSI.',
      'Comodidad trabajando en Linux y experiencia de atención a clientes.',
    ],
    skillIds: ['networks', 'cloud', 'cicd'],
    project:
      'Provoca y resuelve un fallo de red en un laboratorio local (DNS, puertos, subredes) y escribe la solución como si respondieras un caso de soporte.',
    sourceUrl:
      'https://www.amazon.jobs/en/jobs/10567711/cloud-support-associate-internship-april-2027-start-support-engineering',
    reviewedAt: '2026-10-08',
  },
  {
    id: 'audible-data',
    areaId: 'ciencia-datos',
    company: 'Audible · Amazon',
    title: 'Data Scientist',
    location: 'Newark, EE. UU.',
    level: 'Con experiencia · 2+ años',
    summary:
      'Trabaja con economistas y equipos de producto para transformar preguntas de negocio en modelos y análisis cuantitativos.',
    responsibilities: [
      'Construir modelos y herramientas de análisis de principio a fin.',
      'Comunicar hallazgos y colaborar con producto, contenido y marketing.',
    ],
    required: [
      'Maestría o grado superior en un campo cuantitativo.',
      '2+ años de trabajo aplicado con Python, SQL, modelado y visualización.',
      'Experiencia con problemas de medición u optimización; familiaridad con razonamiento económico.',
    ],
    preferred: [
      'Bases sólidas de estadística, machine learning y economía.',
      'Métodos econométricos a escala y mantenimiento de modelos en producción.',
    ],
    skillIds: ['sql', 'python', 'statistics', 'visualization', 'modeling'],
    project:
      'Analiza datos públicos, formula una pregunta y entrega una conclusión con sus limitaciones.',
    sourceUrl: 'https://www.amazon.jobs/en/jobs/10561694/data-scientist',
    reviewedAt: '2026-10-07',
  },
  {
    id: 'amazon-sde',
    areaId: 'software',
    company: 'Amazon',
    title: 'Software Development Engineer · 2026',
    location: 'Estados Unidos',
    level: 'Estudiantes y recién egresados · convocatoria 2026',
    summary:
      'Construye y mantiene servicios de software en equipos que participan en diseño, desarrollo y operación.',
    responsibilities: [
      'Desarrollar funcionalidades y servicios escalables.',
      'Trabajar con CI/CD, monitoreo y resolución de problemas de producción.',
    ],
    required: [
      'Experiencia con un lenguaje de propósito general.',
      'Estructuras de datos, algoritmos básicos o diseño orientado a objetos.',
      'Grado STEM obtenido o en curso; al menos 18 años.',
    ],
    preferred: [
      'Prácticas técnicas o proyectos demostrables.',
      'Experiencia con cloud, bases de datos, control de versiones o código abierto.',
    ],
    skillIds: ['programming', 'git', 'api', 'testing'],
    project:
      'Construye una aplicación con una API, pruebas y un README que permita a otra persona ejecutarla.',
    sourceUrl:
      'https://www.amazon.jobs/en-gb/jobs/3177934/software-development-engineer-2026-us',
    reviewedAt: '2026-10-07',
  },
]

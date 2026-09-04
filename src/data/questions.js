/**
 * Banco de 50 preguntas (10 por área) para el Motor de Diagnóstico
 * Situacional. Cada pregunta se responde en una escala de acuerdo de 1 a 5
 * y suma puntos únicamente al área a la que pertenece.
 */

const RAW_QUESTIONS = {
  ia: [
    'Disfruto explorar cómo un modelo de lenguaje genera una respuesta a partir de una instrucción.',
    'Me interesa entender la diferencia entre distintos algoritmos de aprendizaje automático.',
    'Prefiero experimentar entrenando un modelo antes que leer solo teoría matemática.',
    'Me atrae diseñar un sistema que reconozca patrones en imágenes o audio.',
    'Disfruto ajustar los parámetros de un modelo para mejorar su desempeño.',
    'Me interesa aprender sobre ética y sesgos en sistemas de inteligencia artificial.',
    'Prefiero resolver un problema con datos y estadística antes que con reglas fijas de programación.',
    'Disfruto experimentar con frameworks de IA como TensorFlow o PyTorch.',
    'Me atrae la idea de construir un chatbot o asistente inteligente.',
    'Me interesa mantenerme actualizado sobre los avances recientes en inteligencia artificial.',
  ],
  ciberseguridad: [
    'Disfruto analizar un sistema para encontrar posibles vulnerabilidades.',
    'Me interesa entender cómo funciona un ataque informático para poder prevenirlo.',
    'Prefiero pensar como atacante para anticipar fallas de seguridad en un sistema.',
    'Disfruto configurar firewalls, VPNs u otras herramientas de protección.',
    'Me atrae participar en retos de hacking ético o CTF (Capture the Flag).',
    'Disfruto investigar el origen de un incidente de seguridad después de que ocurre.',
    'Me interesa aprender sobre criptografía y cómo proteger la información.',
    'Prefiero auditar el código de una aplicación en busca de fallas de seguridad.',
    'Me atrae certificarme en seguridad ofensiva o defensiva.',
    'Disfruto mantenerme al día sobre nuevas amenazas y vulnerabilidades reportadas.',
  ],
  nube: [
    'Me interesa entender cómo escalar una aplicación para miles de usuarios.',
    'Disfruto configurar servicios en plataformas como AWS, Azure o Google Cloud.',
    'Prefiero automatizar el despliegue de una aplicación antes que hacerlo manualmente.',
    'Me atrae diseñar arquitecturas de microservicios y contenedores.',
    'Disfruto trabajar con herramientas de infraestructura como código (Terraform, CloudFormation).',
    'Me interesa optimizar el costo y el desempeño de la infraestructura en la nube.',
    'Prefiero resolver problemas de disponibilidad y tolerancia a fallos de un sistema.',
    'Disfruto configurar pipelines de integración y despliegue continuo (CI/CD).',
    'Me atrae aprender sobre contenedores y orquestadores como Docker y Kubernetes.',
    'Me interesa certificarme en alguna plataforma de nube (AWS, Azure, GCP).',
  ],
  'ciencia-datos': [
    'Disfruto explorar un conjunto de datos para encontrar patrones antes de sacar conclusiones.',
    'Me interesa aprender a limpiar y preparar datos antes de analizarlos.',
    'Prefiero comunicar hallazgos con gráficas y visualizaciones claras.',
    'Disfruto construir modelos estadísticos para predecir un comportamiento.',
    'Me atrae usar Python o R para el análisis de datos.',
    'Disfruto diseñar experimentos o pruebas A/B para validar una hipótesis.',
    'Me interesa traducir un problema de negocio en una pregunta que se pueda responder con datos.',
    'Prefiero interpretar resultados estadísticos antes que solo reportar números.',
    'Me atrae construir dashboards que ayuden a tomar decisiones.',
    'Me interesa aprender sobre big data y el manejo de grandes volúmenes de información.',
  ],
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

/**
 * Ruta de aprendizaje por área: qué aprender, en qué orden y con qué
 * entregable practicarlo.
 *
 * Las secuencias y los proyectos son propuestas de PotroPath, no requisitos
 * de ninguna empresa ni un plan de estudios oficial. Las etapas son
 * orientativas: el diagnóstico mide intereses, no dominio, así que la ruta no
 * dice "ya sabes esto" ni lleva porcentajes de avance.
 *
 * Los `id` de habilidad se comparten entre áreas cuando la habilidad es la
 * misma (`python`, `networks`, `statistics`): `careers.js` los usa para
 * conectar cada puesto con la ruta, y tests/professional-route.test.js
 * comprueba que ningún puesto apunte a una habilidad inexistente.
 */

export const STAGES = ['Construye la base', 'Llévalo a la práctica', 'Profundiza']

/** `stage` es el índice en `STAGES`. */
const skill = (id, name, stage, purpose, project) => ({ id, name, stage, purpose, project })

export const ROADMAP = {
  ia: {
    headline: 'De una pregunta a un modelo que aprende.',
    intro:
      'Aprende a experimentar con datos, evaluar lo que un modelo hace bien y reconocer sus límites.',
    search: 'Machine Learning Engineer',
    credentialIds: ['ml', 'deep-learning'],
    learning: [
      skill(
        'python',
        'Python',
        0,
        'Preparar datos y convertir una idea en un experimento reproducible.',
        'Carga un CSV público, limpia valores ausentes y documenta cada decisión en un notebook.',
      ),
      skill(
        'statistics',
        'Estadística y evaluación',
        0,
        'Elegir métricas y separar entrenamiento de evaluación para no engañarte con los resultados.',
        'Compara precisión y recall en un clasificador; explica cuándo cada métrica puede confundir.',
      ),
      skill(
        'ml',
        'Machine learning',
        1,
        'Entrenar un modelo base y comparar sus resultados con una alternativa sencilla.',
        'Construye un clasificador con scikit-learn y compara su resultado con una predicción constante.',
      ),
      skill(
        'deep-learning',
        'Redes neuronales',
        1,
        'Trabajar con representaciones que aprenden patrones en imágenes o texto.',
        'Entrena una red pequeña, muestra sus errores frecuentes y registra los parámetros del experimento.',
      ),
      skill(
        'mlops',
        'Despliegue y MLOps',
        2,
        'Llevar un experimento a un servicio que pueda observarse y mantenerse.',
        'Expón una predicción mediante una API local, añade pruebas y registra la versión del modelo.',
      ),
    ],
  },

  ciberseguridad: {
    headline: 'Entiende el sistema. Encuentra cómo protegerlo.',
    intro:
      'Construye bases de redes e identidad antes de pasar a laboratorios de análisis y respuesta.',
    search: 'Cybersecurity Analyst',
    credentialIds: ['google-security', 'sc900'],
    learning: [
      skill(
        'networks',
        'Redes y Linux',
        0,
        'Entender cómo se comunican los servicios y dónde quedan sus registros.',
        'Dibuja la red de un laboratorio local y documenta sus servicios, puertos y permisos.',
      ),
      skill(
        'identity',
        'Identidad y permisos',
        0,
        'Aplicar el mínimo privilegio y distinguir autenticación de autorización.',
        'Crea una matriz de permisos para tres roles de una aplicación de prueba.',
      ),
      skill(
        'python',
        'Python para automatizar',
        1,
        'Procesar registros y detectar patrones que merecen una revisión.',
        'Analiza logs sintéticos y genera un resumen de intentos de inicio de sesión fallidos.',
      ),
      skill(
        'appsec',
        'Seguridad de aplicaciones',
        1,
        'Revisar código y validar controles en entornos propios o autorizados.',
        'Audita una aplicación local deliberadamente vulnerable y documenta una corrección con su prueba.',
      ),
      skill(
        'incident',
        'Respuesta a incidentes',
        2,
        'Reconstruir qué pasó, limitar el impacto y comunicar evidencia.',
        'Escribe el informe de un incidente simulado: línea temporal, evidencia y medidas preventivas.',
      ),
    ],
  },

  nube: {
    headline: 'Diseña sistemas que sigan funcionando.',
    intro:
      'Conecta infraestructura, automatización y decisiones de arquitectura con necesidades reales.',
    search: 'Cloud Engineer',
    credentialIds: ['aws-foundation', 'az900'],
    learning: [
      skill(
        'networks',
        'Redes y sistemas',
        0,
        'Comprender DNS, HTTP, subredes y procesos antes de desplegarlos en la nube.',
        'Documenta el recorrido de una petición desde el navegador hasta una API local.',
      ),
      skill(
        'cloud',
        'Fundamentos cloud',
        0,
        'Distinguir cómputo, almacenamiento, identidad y responsabilidad compartida.',
        'Diseña en papel una aplicación con sus servicios y supuestos de costo, sin contratar recursos.',
      ),
      skill(
        'containers',
        'Contenedores',
        1,
        'Reproducir un entorno de ejecución y separar sus dependencias.',
        'Empaqueta una API local con Docker y escribe las instrucciones para ejecutarla.',
      ),
      skill(
        'cicd',
        'Scripting y CI/CD',
        1,
        'Automatizar tareas y validar cambios antes de desplegar, con forma de volver atrás.',
        'Añade un pipeline de pruebas a un repositorio de práctica y documenta cómo revertir un cambio.',
      ),
      skill(
        'architecture',
        'Arquitectura y fiabilidad',
        2,
        'Equilibrar disponibilidad, seguridad y costo según lo que necesita el producto.',
        'Dibuja dos arquitecturas para el mismo servicio y explica sus fallos posibles y compromisos.',
      ),
    ],
  },

  'ciencia-datos': {
    headline: 'Convierte datos en decisiones que se entiendan.',
    intro:
      'Empieza por formular una pregunta y termina con una conclusión que puedas defender con evidencia.',
    search: 'Data Analyst',
    credentialIds: ['google-data', 'google-advanced'],
    learning: [
      skill(
        'sql',
        'SQL',
        0,
        'Obtener y combinar los datos necesarios para responder una pregunta.',
        'Consulta una base de datos de ejemplo y explica cómo evitaste duplicar registros en un JOIN.',
      ),
      skill(
        'python',
        'Python y limpieza',
        0,
        'Revisar calidad, ausencias y transformaciones antes de analizar.',
        'Prepara un conjunto de datos público y entrega un reporte de calidad con pandas.',
      ),
      skill(
        'statistics',
        'Estadística aplicada',
        1,
        'Separar variación, asociación y causalidad al interpretar resultados.',
        'Formula una hipótesis, compara dos grupos y explica qué conclusiones no permite el análisis.',
      ),
      skill(
        'visualization',
        'Visualización',
        1,
        'Elegir una gráfica que responda una pregunta sin distorsionar los datos.',
        'Crea tres gráficas de un mismo conjunto de datos y escribe una conclusión verificable para cada una.',
      ),
      skill(
        'modeling',
        'Modelado y experimentación',
        2,
        'Evaluar predicciones y diseñar experimentos con criterios claros.',
        'Compara un modelo predictivo con una referencia simple y documenta límites y posibles sesgos.',
      ),
    ],
  },

  software: {
    headline: 'De una idea a software que otros pueden usar.',
    intro: 'Practica el ciclo completo: diseñar, construir, probar y mejorar una aplicación.',
    search: 'Software Engineer Junior',
    credentialIds: ['meta-frontend', 'aws-developer'],
    learning: [
      skill(
        'programming',
        'Programación y algoritmos',
        0,
        'Traducir un problema en pasos claros y elegir estructuras de datos adecuadas.',
        'Resuelve la búsqueda de elementos duplicados de dos maneras y compara su complejidad.',
      ),
      skill(
        'git',
        'Git y colaboración',
        0,
        'Mantener cambios pequeños, revisables y reversibles en un equipo.',
        'Crea una rama, abre una revisión de práctica y escribe un README para ejecutar el proyecto.',
      ),
      skill(
        'web',
        'JavaScript y accesibilidad',
        1,
        'Construir interfaces que respondan bien al teclado y a cualquier tamaño de pantalla.',
        'Desarrolla un formulario con validación, etiquetas y mensajes de error comprensibles.',
      ),
      skill(
        'api',
        'APIs y bases de datos',
        1,
        'Conectar una interfaz con información persistente y contratos claros.',
        'Construye una API de tareas con validación y documenta sus respuestas y errores.',
      ),
      skill(
        'testing',
        'Pruebas y calidad',
        2,
        'Detectar regresiones y hacer que cambiar el código sea más seguro.',
        'Añade pruebas a los recorridos críticos de tu aplicación y reproduce un error antes de corregirlo.',
      ),
    ],
  },
}

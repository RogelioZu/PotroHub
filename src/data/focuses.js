/**
 * Tres enfoques por área: el nivel debajo del área que eligen las dos
 * preguntas detonadoras de `/resultados`.
 *
 * Es un catálogo cerrado a propósito. La IA redacta las preguntas, pero nunca
 * escribe una habilidad ni un primer paso: todo lo que el estudiante lee como
 * ruta sale de aquí, revisado por una persona. Un modelo que inventa una
 * certificación que no existe le cuesta al proyecto exactamente la
 * credibilidad que existe para ganarse (ver PRODUCT.md → Evidence on Hand).
 *
 * Los enfoques no traen credenciales propias. La primera versión listaba unas
 * cuarenta como texto suelto, sin fuente ni fecha de revisión y mezclando
 * cursos con certificaciones por examen; `credentials.js` exige las tres cosas
 * a cada una. Las credenciales siguen siendo las del área, en "Acredita".
 * Agregar una al enfoque es agregarla allá primero, con su `sourceUrl`.
 *
 * `skills` y `firstStep` alimentan "Tu primer paso" en `/resultados` cuando el
 * estudiante explora el área del enfoque.
 *
 * `signals` son las preguntas del banco que alimentan a cada enfoque. Su
 * promedio es la base que desempata cuando las dos detonadoras apuntan a
 * enfoques distintos, y es lo que el servidor le muestra a Qwen para que
 * pregunte justo donde las cincuenta respuestas dejaron duda. Hay preguntas
 * sin asignar —ia-6, ciberseguridad-9, nube-2, software-7…— porque miden el
 * área completa y no un enfoque: la ética en IA o certificarse en la nube no
 * inclinan hacia ninguno de los tres.
 *
 * El orden importa: dentro de un área, es el último criterio de desempate.
 */
const RAW_FOCUSES = {
  ia: [
    {
      id: 'ia-lenguaje',
      name: 'Lenguaje y agentes',
      description: 'Modelos de lenguaje, búsqueda semántica y asistentes que consultan documentos o usan herramientas.',
      signals: ['ia-1', 'ia-9'],
      skills: ['Python', 'Transformers y embeddings', 'Generación aumentada por recuperación (RAG)', 'Evaluación de modelos de lenguaje', 'APIs de modelos y uso de herramientas'],
      firstStep: 'Construye un buscador de dudas sobre los apuntes de una materia con embeddings y un modelo abierto, y anota cuántas respuestas acierta de veinte.',
    },
    {
      id: 'ia-vision',
      name: 'Visión por computadora',
      description: 'Sistemas que reconocen, detectan y miden cosas en imágenes y video.',
      signals: ['ia-3', 'ia-4'],
      skills: ['Python y OpenCV', 'Redes convolucionales', 'Detección y segmentación de objetos', 'Etiquetado y aumento de datos', 'Despliegue en dispositivos de borde'],
      firstStep: 'Entrena un clasificador con doscientas fotos que tomes tú, por ejemplo de residuos reciclables, y documenta en qué casos se equivoca.',
    },
    {
      id: 'ia-modelado',
      name: 'Modelado y MLOps',
      description: 'Entrenar, comparar y poner en producción modelos que se mantienen sanos con el tiempo.',
      signals: ['ia-2', 'ia-5', 'ia-8'],
      skills: ['scikit-learn y PyTorch', 'Validación y métricas de modelos', 'Seguimiento de experimentos (MLflow)', 'Modelos servidos como API', 'Monitoreo de deriva de datos'],
      firstStep: 'Toma un dataset público, entrena dos modelos distintos y registra cada corrida en MLflow antes de decidir cuál se queda.',
    },
  ],
  ciberseguridad: [
    {
      id: 'ciber-ofensiva',
      name: 'Seguridad ofensiva',
      description: 'Pensar como atacante para encontrar fallas antes que alguien más: pruebas de penetración y red team.',
      signals: ['ciberseguridad-1', 'ciberseguridad-3', 'ciberseguridad-5'],
      skills: ['Linux y redes TCP/IP', 'Reconocimiento y enumeración', 'Explotación web (OWASP Top 10)', 'Escalada de privilegios', 'Redacción de reportes de pentest'],
      firstStep: 'Resuelve tres máquinas de nivel fácil en TryHackMe o Hack The Box y escribe el reporte de una como si fuera para un cliente.',
    },
    {
      id: 'ciber-defensa',
      name: 'Defensa y respuesta',
      description: 'Vigilar, detectar y contener ataques en curso, y reconstruir qué pasó después.',
      signals: ['ciberseguridad-4', 'ciberseguridad-6', 'ciberseguridad-10'],
      skills: ['Monitoreo con SIEM', 'Análisis de logs y tráfico de red', 'Respuesta a incidentes', 'Forense digital básica', 'Endurecimiento de sistemas'],
      firstStep: 'Instala Wazuh en una máquina virtual, provoca inicios de sesión fallidos y escribe la regla que los detecte.',
    },
    {
      id: 'ciber-appsec',
      name: 'AppSec y criptografía',
      description: 'Que el software nazca seguro: revisión de código, cifrado bien aplicado y manejo de secretos.',
      signals: ['ciberseguridad-2', 'ciberseguridad-7', 'ciberseguridad-8'],
      skills: ['Revisión segura de código', 'OWASP Top 10 y ASVS', 'Criptografía aplicada (TLS, hashing, firmas)', 'Gestión de secretos y llaves', 'Análisis estático y dinámico (SAST y DAST)'],
      firstStep: 'Pasa un proyecto tuyo por OWASP ZAP y Semgrep, corrige el hallazgo más grave y explica por escrito por qué era explotable.',
    },
  ],
  nube: [
    {
      id: 'nube-arquitectura',
      name: 'Arquitectura cloud',
      description: 'Diseñar sistemas en la nube que escalen, aguanten fallas y no cuesten de más.',
      signals: ['nube-1', 'nube-4', 'nube-6'],
      skills: ['Diseño de arquitecturas en AWS, Azure o GCP', 'Redes en la nube (VPC, balanceadores)', 'Alta disponibilidad y escalado', 'Optimización de costos', 'Microservicios y colas de mensajes'],
      firstStep: 'Dibuja la arquitectura de una app que ya usas y calcula con la calculadora de precios de AWS cuánto costaría servir a cinco mil usuarios.',
    },
    {
      id: 'nube-devops',
      name: 'DevOps y automatización',
      description: 'Que el código llegue a producción solo: pipelines, infraestructura como código y contenedores.',
      signals: ['nube-3', 'nube-5', 'nube-8'],
      skills: ['Git y CI/CD (GitHub Actions)', 'Terraform', 'Docker', 'Fundamentos de Kubernetes', 'Scripting en Bash y Python'],
      firstStep: 'Agrega a un proyecto tuyo un pipeline de GitHub Actions que corra las pruebas y despliegue en cada push a main.',
    },
    {
      id: 'nube-sre',
      name: 'Confiabilidad (SRE)',
      description: 'Mantener servicios en pie: observabilidad, orquestación y respuesta cuando algo se cae.',
      signals: ['nube-7', 'nube-9'],
      skills: ['Observabilidad: métricas, logs y trazas', 'Kubernetes y orquestación', 'SLOs y presupuestos de error', 'Gestión de incidentes y postmortems', 'Linux y redes'],
      firstStep: 'Levanta Prometheus y Grafana con Docker Compose, monitorea un servicio tuyo y define un SLO de disponibilidad con su alerta.',
    },
  ],
  'ciencia-datos': [
    {
      id: 'datos-analitica',
      name: 'Análisis y visualización',
      description: 'Convertir datos en una respuesta clara para quien tiene que decidir.',
      signals: ['ciencia-datos-1', 'ciencia-datos-3', 'ciencia-datos-9'],
      skills: ['SQL', 'Power BI o Tableau', 'Estadística descriptiva', 'Hojas de cálculo avanzadas', 'Narrativa con datos'],
      firstStep: 'Descarga datos abiertos de datos.gob.mx sobre tu municipio y arma un tablero de una sola página que responda una sola pregunta.',
    },
    {
      id: 'datos-modelado',
      name: 'Modelado estadístico',
      description: 'Predecir, probar hipótesis y distinguir un efecto real de la casualidad.',
      signals: ['ciencia-datos-4', 'ciencia-datos-6', 'ciencia-datos-8'],
      skills: ['Python (pandas, scikit-learn)', 'Inferencia estadística', 'Regresión y clasificación', 'Diseño de experimentos y pruebas A/B', 'Validación cruzada'],
      firstStep: 'Plantea una hipótesis sobre tus propios hábitos, como horas de sueño contra rendimiento, junta dos semanas de datos y pruébala.',
    },
    {
      id: 'datos-ingenieria',
      name: 'Ingeniería de datos',
      description: 'Construir los ductos que llevan datos limpios y a tiempo a quien los analiza.',
      signals: ['ciencia-datos-2', 'ciencia-datos-5', 'ciencia-datos-10'],
      skills: ['SQL y modelado de datos', 'Pipelines ETL y ELT', 'Apache Spark', 'Orquestación con Airflow', 'Almacenes de datos en la nube'],
      firstStep: 'Escribe un script que descargue a diario un dataset público, lo limpie y lo cargue en PostgreSQL, y prográmalo con cron.',
    },
  ],
  software: [
    {
      id: 'sw-producto',
      name: 'Web y móvil completo',
      description: 'Construir de principio a fin la aplicación que la gente usa y entiende sin instrucciones.',
      signals: ['software-4', 'software-8'],
      skills: ['HTML, CSS y TypeScript', 'React o un framework equivalente', 'Desarrollo móvil (React Native o Flutter)', 'Consumo de APIs REST', 'Accesibilidad y experiencia de usuario'],
      firstStep: 'Publica una app web pequeña que resuelva algo de tu grupo, como horarios o apuntes, y consigue que tres compañeros la usen una semana.',
    },
    {
      id: 'sw-arquitectura',
      name: 'Arquitectura y backend',
      description: 'Diseñar el sistema detrás de la pantalla: datos, APIs y decisiones que aguantan el crecimiento.',
      signals: ['software-1', 'software-3', 'software-5'],
      skills: ['Diseño de APIs REST', 'Bases de datos relacionales', 'Patrones de diseño y arquitectura', 'Java, Python o Go del lado del servidor', 'Autenticación y autorización'],
      firstStep: 'Diseña y documenta con OpenAPI una API para un problema real antes de escribir código, y luego impleméntala contra ese contrato.',
    },
    {
      id: 'sw-calidad',
      name: 'Calidad y pruebas',
      description: 'Encontrar el error antes que el usuario y hacer que no vuelva: pruebas, depuración y revisión.',
      signals: ['software-2', 'software-6', 'software-10'],
      skills: ['Pruebas unitarias y de integración', 'Automatización con Playwright o Selenium', 'Depuración y análisis de causa raíz', 'Revisión de código', 'Integración continua'],
      firstStep: 'Escribe pruebas para un proyecto tuyo hasta cubrir el 70% del código y arregla el primer error que encuentren.',
    },
  ],
}

export const FOCUSES = Object.entries(RAW_FOCUSES).flatMap(([areaId, focuses]) =>
  focuses.map((focus) => ({ ...focus, areaId })),
)

export const FOCUS_BY_ID = Object.fromEntries(FOCUSES.map((focus) => [focus.id, focus]))

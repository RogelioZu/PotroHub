/**
 * Contenido de la ruta de crecimiento por área: habilidades demandadas en la
 * industria, certificaciones de referencia y materias del plan de estudios
 * de Ingeniería en Computación (UAEMéx) relacionadas.
 *
 * TODO: validar/ajustar materias exactas contra el plan de estudios vigente.
 */
export const ROADMAP = {
  software: {
    skills: ['JavaScript / TypeScript', 'Control de versiones (Git)', 'Patrones de diseño', 'APIs REST', 'Pruebas automatizadas'],
    certifications: ['AWS Certified Developer – Associate', 'Meta Front-End Developer', 'Oracle Certified Professional: Java'],
    subjects: ['Programación Orientada a Objetos', 'Estructuras de Datos', 'Ingeniería de Software', 'Desarrollo Web'],
  },
  hardware: {
    skills: ['Electrónica digital', 'Microcontroladores (Arduino/ESP32)', 'Lectura de datasheets', 'Diseño de PCB', 'Sistemas embebidos'],
    certifications: ['Certified Embedded Systems Engineer', 'Autodesk Certified Professional: Eagle/Fusion', 'IPC Certification (soldadura)'],
    subjects: ['Sistemas Digitales', 'Microprocesadores', 'Electrónica', 'Sistemas Embebidos'],
  },
  redes: {
    skills: ['Configuración de routers/switches', 'Protocolos TCP/IP', 'Seguridad perimetral', 'Administración de servidores', 'Monitoreo de red'],
    certifications: ['Cisco CCNA', 'CompTIA Network+', 'CompTIA Security+'],
    subjects: ['Redes de Computadoras', 'Telecomunicaciones', 'Seguridad Informática', 'Sistemas Operativos'],
  },
  'bases-datos': {
    skills: ['Modelado entidad-relación', 'SQL avanzado', 'Bases NoSQL', 'ETL y limpieza de datos', 'Visualización de datos'],
    certifications: ['Oracle Database SQL Certified Associate', 'Microsoft Certified: Azure Data Fundamentals', 'MongoDB Certified Developer'],
    subjects: ['Bases de Datos', 'Minería de Datos', 'Sistemas de Información', 'Big Data'],
  },
  administracion: {
    skills: ['Gestión de proyectos', 'Metodologías ágiles (Scrum/Kanban)', 'Gestión de riesgos', 'Comunicación con stakeholders', 'Gobierno de TI'],
    certifications: ['PMI CAPM/PMP', 'Scrum.org PSM I', 'ITIL Foundation'],
    subjects: ['Administración de Proyectos', 'Ingeniería de Software', 'Formulación y Evaluación de Proyectos', 'Auditoría Informática'],
  },
}

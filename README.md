# PotroPath

Plataforma interactiva diseñada para acelerar el desarrollo profesional de los estudiantes de Ingeniería en Computación. Mediante un cuestionario de perfilamiento vocacional, el sistema identifica la afinidad del alumno con las áreas tecnológicas de mayor demanda actual. A partir de este diagnóstico, se genera una ruta de crecimiento personalizada que conecta la academia con la industria: muestra las exigencias del mercado laboral para ese perfil, certificaciones clave y recursos recomendados por la comunidad. Finalmente, la plataforma fomenta una cultura de ingeniería activa integrando a los estudiantes en comunidades moderadas por mentores, impulsando la colaboración en proyectos, la participación en hackathones y la transformación de un interés genuino en perfiles de egreso altamente competitivos.

## Datos generales

| Campo              | Valor                                             |
| ------------------ | -------------------------------------------------- |
| Categoría           | Educación y aprendizaje                            |
| Tema                | Recursos Didácticos                                |
| Espacio académico   | Facultad de Ingeniería                             |
| Tipo de solución    | Software / Plataforma Web                          |
| Despliegue          | Local o en la nube, totalmente navegable           |

### Entregable fase 1

Valoración técnica y presentación de propuesta. Esta etapa inicial se gestiona de forma remota a través del portal de inscripción y representa el 50% de la ponderación global. Es imperativo que los integrantes suban documentación nítida, íntegra y sustentable.

## Memoria descriptiva

### 1. Planteamiento

El contexto actual en la Facultad de Ingeniería de la UAEMéx refleja un área de oportunidad: los estudiantes de Ingeniería en Computación cursan el plan de estudios con una participación mínima en actividades extracurriculares (hackathones, proyectos independientes, cursos, networking). Esto genera una brecha de habilidades frente a la industria tecnológica, resultando en perfiles de egreso poco atractivos para un mercado laboral altamente competitivo.

- **Usuarios directos:** Estudiantes de Ingeniería en Computación de la UAEMéx (particularmente de semestres iniciales e intermedios).
- **Beneficiarios indirectos:** La Facultad de Ingeniería (mejora en indicadores de calidad de egreso y titulación) y empresas tecnológicas de la región que buscan talento especializado.

> **Nota:** insertar aquí la estadística exacta de titulación de la UAEMéx para dar mayor peso institucional al planteamiento.

### 2. Alcance

PotroPath se presentará como un Producto Mínimo Viable (MVP) sin fricción de entrada (sin sistema de registro de usuarios), enfocado en la entrega de valor inmediato. Incluye:

- **Motor de Diagnóstico Situacional:** cuestionario de 50 preguntas (10 por área de especialización) basadas en escenarios prácticos de la industria, evaluando afinidad hacia Inteligencia Artificial, Ciberseguridad, Cloud Computing, Ciencia de Datos y Desarrollo de Software.
- **Dashboard de Resultados y Ruta:** interfaz dinámica que, tras finalizar el test, muestra la rama de mayor compatibilidad, habilidades demandadas en el mercado laboral y certificaciones clave para ese perfil.
- **Sección de Inmersión Universitaria (IEEE):** apartado dedicado a conectar al estudiante con la Rama Estudiantil IEEE UAEMéx, visibilizando los capítulos técnicos y eventos presenciales de la facultad.
- **Módulo de Comunidad Segura:** integración con un servidor de Discord estructurado por canales de especialidad para fomentar el networking técnico y la formación de equipos, garantizando la privacidad de los datos personales.

### 3. Propuesta de valor

A diferencia de los test vocacionales tradicionales que se enfocan en elegir una carrera universitaria, PotroPath es una herramienta de micro-orientación especializada dentro de la Ingeniería en Computación. Su valor radica en la hiper-personalización local: no solo dice "qué estudiar", sino que vincula el resultado directamente con las habilidades y certificaciones que pide la industria hoy, y fomenta la acción inmediata mediante la integración a comunidades activas de desarrollo.

### 4. Arquitectura y stack tecnológico

Para la construcción del MVP se optó por un enfoque orientado a la velocidad de despliegue y validación temprana, utilizando tecnologías de dominio actual del equipo, con una arquitectura modular que facilita su futura integración institucional.

- **Frontend (agilidad y experiencia de usuario):** interfaz desarrollada con **React** y **Vite**, estilizada con **Tailwind CSS**. Esta combinación garantiza una navegación rápida, fluida y sin fricciones, operando completamente del lado del cliente.
- **Gestión de datos locales:** las preguntas, categorías y rutas del cuestionario se procesan estáticamente en formato JSON, con el estado global manejado por **Zustand**, eliminando la necesidad de consultas constantes al servidor durante el test.
- **Backend y base de datos (analíticas anónimas):** ⏳ *pendiente de definir* — se contempla **Supabase** (PostgreSQL) con el único fin de recolectar estadísticas anónimas de los resultados finales, sin sistemas de autenticación ni perfiles de usuario, para maximizar la participación.
- **Proyección institucional y escalabilidad:** aunque el MVP se ejecuta sobre un entorno serverless moderno, el proyecto contempla en fases posteriores la viabilidad de migrar su backend a PHP y bases de datos locales, alineándose a los estándares e infraestructura tecnológica actual de la UAEMéx para asegurar su adopción oficial y mantenimiento a largo plazo.

## Stack técnico

| Capa                     | Tecnología                                | Estado          |
| ------------------------ | ------------------------------------------ | ---------------- |
| UI / Frontend             | [React](https://react.dev/)                | ✅ Configurado    |
| Build tool                | [Vite](https://vite.dev/)                  | ✅ Configurado    |
| Estilos                   | [Tailwind CSS](https://tailwindcss.com/)   | ✅ Configurado    |
| Enrutamiento               | [React Router](https://reactrouter.com/)   | ✅ Configurado    |
| Estado global              | [Zustand](https://zustand.docs.pmnd.rs/)   | ✅ Configurado    |
| Backend / DB analítica    | [Supabase](https://supabase.com/)          | ⏳ Pendiente      |

## Puesta en marcha

```bash
npm install       # instalar dependencias
npm run dev       # servidor de desarrollo
npm run build     # build de producción
npm run preview   # previsualizar el build
```

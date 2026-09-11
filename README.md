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
- **Módulo de Comunidad Segura:** integración con canales de Microsoft Teams estructurados por especialidad, a los que se entra con la cuenta institucional — así cada estudiante sabe que comparte el espacio con compañeros de su propia facultad y no con desconocidos —, para fomentar el networking técnico y la formación de equipos, garantizando la privacidad de los datos personales.

### 3. Propuesta de valor

A diferencia de los test vocacionales tradicionales que se enfocan en elegir una carrera universitaria, PotroPath es una herramienta de micro-orientación especializada dentro de la Ingeniería en Computación. Su valor radica en la hiper-personalización local: no solo dice "qué estudiar", sino que vincula el resultado directamente con las habilidades y certificaciones que pide la industria hoy, y fomenta la acción inmediata mediante la integración a comunidades activas de desarrollo.

### 4. Arquitectura y stack tecnológico

Para la construcción del MVP se optó por un enfoque orientado a la velocidad de despliegue y validación temprana, utilizando tecnologías de dominio actual del equipo, con una arquitectura modular que facilita su futura integración institucional.

- **Frontend (agilidad y experiencia de usuario):** interfaz desarrollada con **React 19** y **Vite**, estilizada con **Tailwind CSS v4** y animada con **GSAP**. Opera completamente del lado del cliente: no hay ida y vuelta al servidor durante el diagnóstico, no hay sesión y no se recogen datos personales.
- **Gestión de datos locales:** las 50 preguntas, las cinco áreas y el contenido de ruta son módulos JavaScript estáticos en `src/data/` — no un CMS: cambiarlos es un cambio de código. El estado del cuestionario lo administra **Zustand** y persiste en `localStorage` (clave `potropath-quiz`), de modo que una sesión sobrevive al cierre de la pestaña sin pedir registro.
- **Modelo de puntaje:** cada pregunta suma únicamente a su propia área; los totales se normalizan a un porcentaje de afinidad de 0 a 100 y se ordenan. Se muestran los cinco puntajes, no sólo el ganador.
- **Movimiento y accesibilidad:** todo el movimiento está condicionado a `prefers-reduced-motion` y todo revelado se construye de manera que el estado por defecto del HTML sea el visible — si el JavaScript falla o tarda, la página se ve completa. **Matter.js** (física del mosaico de la portada) se carga sólo bajo demanda, en el primer arrastre, para no cobrarle 26 KB comprimidos a quien únicamente lee la portada desde un teléfono con red de campus mala.
- **Backend y base de datos (analíticas anónimas):** ⏳ *pendiente de definir* — se contempla **Supabase** (PostgreSQL) con el único fin de recolectar estadísticas anónimas de los resultados finales, sin sistemas de autenticación ni perfiles de usuario, para maximizar la participación.
- **Proyección institucional y escalabilidad:** aunque el MVP se ejecuta sobre un entorno serverless moderno, el proyecto contempla en fases posteriores la viabilidad de migrar su backend a PHP y bases de datos locales, alineándose a los estándares e infraestructura tecnológica actual de la UAEMéx para asegurar su adopción oficial y mantenimiento a largo plazo.

## Stack técnico

Las versiones exactas las fija `package-lock.json`; `npm ci` las reproduce tal cual.

| Capa                      | Tecnología                                          | Versión | Estado         |
| ------------------------- | --------------------------------------------------- | ------- | -------------- |
| UI / Frontend             | [React](https://react.dev/)                          | 19      | ✅ Configurado |
| Build tool                | [Vite](https://vite.dev/)                            | 8       | ✅ Configurado |
| Estilos                   | [Tailwind CSS](https://tailwindcss.com/)             | 4       | ✅ Configurado |
| Enrutamiento              | [React Router](https://reactrouter.com/)             | 7       | ✅ Configurado |
| Estado global             | [Zustand](https://zustand.docs.pmnd.rs/)             | 5       | ✅ Configurado |
| Animación                 | [GSAP](https://gsap.com/) + `@gsap/react`            | 3       | ✅ Configurado |
| Física del mosaico        | [Matter.js](https://brm.io/matter-js/) (bajo demanda) | 0.20    | ✅ Configurado |
| Linter                    | [oxlint](https://oxc.rs/docs/guide/usage/linter)     | 1       | ✅ Configurado |
| Backend / DB analítica    | [Supabase](https://supabase.com/)                    | —       | ⏳ Pendiente   |

Tailwind v4 se configura **en CSS** (bloque `@theme` en `src/index.css`): no existe `tailwind.config.js` y no debe crearse.

## Puesta en marcha

### Requisitos

| Requisito | Versión | Por qué |
| --- | --- | --- |
| [Node.js](https://nodejs.org/) | `^20.19.0` o `>=22.12.0` | Lo exigen Vite 8, `@vitejs/plugin-react` y oxlint |
| npm | 10 o superior (viene con Node) | El repositorio usa `package-lock.json` v3 |
| Git | cualquiera reciente | Sólo para clonar |

No hace falta nada más: **no hay variables de entorno, ni archivo `.env`, ni base de datos, ni servicio externo que levantar.** El proyecto corre completo del lado del cliente.

```bash
node -v   # debe imprimir v20.19+ o v22.12+
npm -v
```

### Instalación y arranque

```bash
git clone <url-del-repositorio>
cd potropath

npm ci            # instalación reproducible desde package-lock.json (recomendada)
# npm install     # alternativa: resuelve el rango de versiones de package.json

npm run dev       # http://localhost:5173
```

`npm run dev` deja el servidor en marcha con recarga en caliente y se detiene con `Ctrl+C`. Si el puerto 5173 está ocupado, Vite toma el siguiente libre e imprime la dirección real en la terminal: hay que abrir esa, no la de este documento.

### Ver el build de producción

```bash
npm run build     # genera dist/ (no se versiona, está en .gitignore)
npm run preview   # sirve dist/ en http://localhost:4173
```

### Comandos disponibles

| Comando | Qué hace |
| --- | --- |
| `npm run dev` | Servidor de desarrollo de Vite con recarga en caliente (`localhost:5173`) |
| `npm run build` | Build de producción en `dist/` |
| `npm run preview` | Sirve el build ya generado (`localhost:4173`), para revisarlo tal como se publicaría |
| `npm run lint` | oxlint sobre todo el repositorio, con las reglas de `.oxlintrc.json` |

### Casos frecuentes

```bash
npm run dev -- --port 3000   # el puerto 5173 está ocupado
npm run dev -- --host        # abrir el sitio desde otro dispositivo de la misma red (teléfono)
rm -rf node_modules && npm ci  # instalación en un estado raro
```

Probar en un teléfono real vale la pena: el teléfono con red de campus mala es un caso de uso primario del producto, no un respaldo.

### Verificación de un cambio

No hay suite de pruebas automatizadas. La verificación real de un cambio es:

```bash
npm run lint      # sin errores nuevos
npm run build     # el build pasa
```

…y **mirar la página** en los dos anchos que importan, 390px (teléfono) y 1440px (laptop), recorriendo el flujo completo: Inicio → Diagnóstico → Mi ruta → Comunidad. `CLAUDE.md` documenta el resto de la rutina, incluido el detector de anti-patrones de interfaz.

### Rutas de la aplicación

| Ruta | Vista | Qué hace |
| --- | --- | --- |
| `/` | Inicio | Presentación y entrada al diagnóstico |
| `/quiz` | Diagnóstico | Las 50 preguntas, una por pantalla, con progreso reanudable |
| `/resultados` | Mi ruta | Los cinco puntajes de afinidad, habilidades y certificaciones del área ganadora |
| `/comunidad` | Comunidad | Canales de Teams por especialidad y Rama Estudiantil IEEE UAEMéx |
| cualquier otra | 404 | Página de no encontrado |

## Estructura del repositorio

```
src/
  main.jsx                  Punto de entrada
  App.jsx                   Rutas: / · /quiz · /resultados · /comunidad · *
  index.css                 @theme de Tailwind v4 (tokens), utilidades y clases de componente
  data/                     Contenido estático — no es un CMS; cambiarlo es cambiar código
    questions.js            50 preguntas (10 por área), escala 1–5
    areas.js                Las cinco áreas fijas
    roadmap.js              Habilidades y certificaciones por área
  store/quizStore.js        Zustand persistido en localStorage (clave `potropath-quiz`)
  lib/                      Registro único de GSAP, tokens de movimiento y hooks compartidos
  components/               layout/ · ui/ · motion/
  pages/                    Home, Quiz, Results, Community, NotFound
public/images/              Activos que se publican tal cual (vitral, mascota, fotos de área
                            y de comunidad). Sus README documentan cada imagen y la
                            especificación de las que todavía faltan
assets-src/                 Masters sin comprimir; fuera de public/, no entran al build
dist/                       Salida de `npm run build` (ignorada por Git)
```

## Documentación del proyecto

El repositorio se documenta a sí mismo en cuatro archivos, cada uno con una autoridad distinta:

| Archivo | Qué manda |
| --- | --- |
| `README.md` | Este archivo: memoria descriptiva académica y puesta en marcha |
| `PRODUCT.md` | Verdad de producto: usuarios, propósito, alcance, principios y **qué no existe y no puede inventarse** |
| `DESIGN.md` | El mundo visual comprometido: paleta, tipografía, layout, componentes, movimiento y sus Reglas Nombradas |
| `CLAUDE.md` | Convenciones de código y guía de trabajo para quien (o lo que) edite el repositorio |

En decisiones visuales manda `DESIGN.md`; en verdad de producto y voz manda `PRODUCT.md`. `.impeccable/design.json` es el sidecar de `DESIGN.md` con los valores exactos de tokens y componentes.

## Estado del proyecto

**Real y utilizable hoy:** el banco de 50 preguntas y su escala, el contenido de ruta (habilidades y certificaciones) de las cinco áreas, la fotografía del vitral de la biblioteca de la facultad y la mascota universitaria, y el sitio completo navegable de punta a punta.

**Pendiente, declarado como pendiente en la propia interfaz** — ninguno de estos se simula como si ya existiera:

- El código de invitación a los canales de Microsoft Teams (`TEAMS_JOIN_CODE_URL` es `null`).
- La agenda real de eventos de la Rama IEEE y la confirmación de sus capítulos activos.
- La estadística de titulación de la UAEMéx que sustentará el planteamiento.
- El backend de analíticas anónimas en Supabase.

**Ningún estudiante ha usado todavía el producto.** No hay testimonios, conteos de usuarios, cifras de adopción, convenios ni aprobación institucional, y nada de eso debe aparecer como contenido del sitio.

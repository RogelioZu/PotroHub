# PotroPath

Diagnóstico de afinidad vocacional **dentro** de Ingeniería en Computación, para estudiantes de la
Facultad de Ingeniería de la UAEMéx. 50 preguntas → área de mayor afinidad → habilidades,
certificaciones y comunidad. Sin registro, sin datos personales, todo del lado del cliente.

React 19 + Vite + Tailwind CSS v4 + React Router + Zustand (persistido) + GSAP. Español (es-MX).

---

## Antes de tocar nada: lee la fuente de verdad

Este archivo **no** repite el contenido de los otros dos. Los apunta, porque una copia se
desactualiza y una mentira en el contexto es peor que un contexto ausente.

| Archivo | Qué manda | Léelo antes de |
|---|---|---|
| `PRODUCT.md` | Verdad de producto: usuarios, propósito, posicionamiento, alcance, principios, y **qué no existe y no puede inventarse** | Tocar copy, contenido, alcance, datos o cualquier afirmación |
| `DESIGN.md` | El mundo visual comprometido: paleta, tipografía, layout, formas, componentes, movimiento y sus **Reglas Nombradas** | Tocar UI, CSS, clases, color, espaciado o animación |
| `.impeccable/design.json` | Sidecar de `DESIGN.md`: rampas tonales, sombras, tokens de movimiento y componentes con HTML/CSS listos | Necesitar valores exactos que el frontmatter no cabe |
| `.impeccable/critique/` | Críticas archivadas con puntaje heurístico y problemas priorizados | Buscar qué está roto y con qué prioridad |
| `README.md` | La memoria descriptiva académica (planteamiento, alcance, entregables de fase) | Contexto institucional del proyecto |

**Regla de precedencia:** en decisiones visuales manda `DESIGN.md`. En verdad de producto y voz
manda `PRODUCT.md`. Si algo del código contradice a cualquiera de los dos, el documento gana y el
código es deuda — corrígelo o anótalo, no lo copies.

---

## Los cuatro errores más caros

Todo lo demás está en los documentos. Estos cuatro se equivocan rápido y cuestan mucho:

1. **Nunca fabriques un dato institucional.** No hay testimonios, ni conteos de usuarios, ni cifras
   de adopción, ni convenios, ni aprobación de la UAEMéx. Ningún estudiante ha usado esto todavía.
   Lo pendiente se declara pendiente — los canales de Teams, los eventos IEEE, la estadística de
   titulación.
   Un placeholder disfrazado de dato real destruye exactamente la credibilidad que el proyecto
   existe para ganarse. Ver `PRODUCT.md` → *Evidence on Hand*.
2. **La paleta es cerrada.** Cinco colores del manual de identidad de la UAEMéx más sus tintes
   derivados. Si falta un matiz, se **deriva**; no se inventa. Nunca un color suelto.
3. **Todo movimiento es opcional.** Cada animación va dentro de
   `gsap.matchMedia('(prefers-reduced-motion: no-preference)')`, o comprueba
   `prefersReducedMotion()` en las ramas imperativas. Y todo revelado usa `gsap.from`, nunca
   `gsap.to` desde un estado oculto: el HTML por defecto es el estado **visible**, así que si el JS
   falla la página se ve completa.
4. **Español en todo.** Copy, comentarios de código, mensajes de error. La voz es directa y sin
   condescendencia: habla a estudiantes como futuros profesionales.

---

## Comandos

```bash
npm run dev       # servidor de desarrollo (Vite)
npm run build     # build de producción
npm run preview   # previsualizar el build
npm run lint      # oxlint
```

No hay suite de pruebas. La verificación real de un cambio de UI es: `npm run lint`, `npm run build`,
el detector de Impeccable, y **mirar la página** en los anchos que importan (390px y 1440px).

```bash
node ~/.claude/skills/impeccable/scripts/detect.mjs --json src index.html
```

Un solo hallazgo es esperado y **no** es un defecto: `single-font` en `index.html`. `DESIGN.md`
compromete deliberadamente una sola familia tipográfica cargando la jerarquía por tamaño y peso.

---

## Estructura

```
src/
  main.jsx                  Punto de entrada
  App.jsx                   Rutas: / · /quiz · /resultados · /comunidad · *
  index.css                 @theme de Tailwind v4 (tokens), utilidades y clases de componente
  data/                     Contenido estático — NO es un CMS; cambiarlo es cambiar código
    questions.js            50 preguntas (10 por área), escala 1–5. ids: `<areaId>-<n>`
    areas.js                Las cinco áreas fijas
    roadmap.js              Habilidades y certificaciones por área
  store/quizStore.js        Zustand persistido en localStorage, clave `potropath-quiz`
  lib/
    gsap.js                 Punto ÚNICO de registro de GSAP y sus plugins
    motion.js               Tokens de movimiento: DUR, EASE, STAGGER, media queries
    useDocumentTitle.js     Título por vista
  components/
    layout/                 Navbar, Footer, Layout
    ui/                     VitralBackdrop, HeroMosaic, PhotoCard, ConfirmButton
    motion/                 Reveal, SectionDivider, RouteTransition, SmoothScroller
  pages/                    Home, Quiz, Results, Community, NotFound
assets-src/                 Masters sin comprimir. Fuera de public/, no entran al
                            build (ver su README.md)
public/images/              vitral-biblioteca.webp y potro-mascota.webp son activos
                            institucionales reales, areas/*.webp las cinco fotos de
                            área (ver su README.md); og-potropath.png es la tarjeta
                            de vista previa generada
```

Cuando regeneres `og-potropath.png`, la fuente de la composición vive en `DESIGN.md` →
*Tarjeta de vista previa (Open Graph)*. Y si el proyecto llega a tener dominio, hay que
absolutizar `og:image` en `index.html` y añadir `og:url` — está marcado ahí con un comentario.

---

## Convenciones del código

- **Los comentarios explican el porqué, no el qué.** Este repositorio documenta sus decisiones en el
  código: por qué `scaleX` y no `width`, por qué `svh` y no `vh`, por qué `revert()` y no `kill()`.
  Cuando cambies algo que un comentario explica, **actualiza el comentario** — un comentario que
  miente es peor que ninguno.
- **Ningún componente importa `gsap` directamente.** Todo pasa por `src/lib/gsap.js`, para que los
  plugins se registren una sola vez y los valores por defecto sean los mismos en todo el sitio.
- **Ninguna duración ni curva se escribe a mano.** Salen de `src/lib/motion.js`.
- **Ninguna página fija un tamaño de encabezado suelto.** Se usan `.h1`, `.h2`, `.h3`, `.lead` y
  `.eyebrow` de `index.css`.
- **Los escalonados de GSAP usan `amount`, nunca `each`**, para que el retardo total quede acotado
  sin importar el largo de la lista.
- Tailwind v4 configurado **en CSS** (`@theme` en `index.css`). No hay `tailwind.config.js`.

---

## Mantener este contexto vivo

Cuando un cambio toque algo documentado, actualiza el documento **en el mismo cambio**, no después.
Un documento desactualizado envenena todas las sesiones siguientes.

| Si cambias… | Actualiza |
|---|---|
| Color, tipografía, espaciado, forma, componente o movimiento | `DESIGN.md` **y** `.impeccable/design.json` (deben coincidir) |
| Usuarios, alcance, capacidades, restricciones o principios | `PRODUCT.md` |
| Algo pendiente que se vuelve real (los canales de Teams, eventos IEEE, la estadística, Supabase) | `PRODUCT.md` → *Evidence on Hand*, **y** quita el estado vacío honesto que lo suplía |
| Rutas, dependencias, scripts o estructura de carpetas | Este archivo |
| Una Regla Nombrada que el código deja de cumplir | `DESIGN.md`: o corriges el código, o escribes la deuda explícitamente. Nunca la dejes callada |

Reglas para editar los documentos:

- **No traduzcas los encabezados de sección.** En `PRODUCT.md` y `DESIGN.md` están en inglés a
  propósito: son anclas que leen las herramientas (`extractPlatform` en `context.mjs` busca
  literalmente `## Platform`). El contenido va en español.
- **Preserva el comentario `impeccable:product-schema`** de `PRODUCT.md`.
- `.impeccable/design.json` debe seguir siendo JSON válido con `schemaVersion: 2`.
- Cuando registres una decisión, escribe **por qué**, no solo qué. Los documentos de este proyecto
  valen por sus razones, no por sus listas.

---

## Design Context

*(Sección convencional que las herramientas de diseño leen para generar personas de prueba.)*

**Audiencia primaria:** estudiantes de Ingeniería en Computación de la UAEMéx, semestres iniciales e
intermedios, con participación extracurricular mínima.

**Tres escenas de llegada reales, ninguna dominante:** teléfono en tiempos muertos entre clases;
laptop en sesión deliberada; y un enlace compartido en frío por WhatsApp o Discord, donde se decide
en segundos si vale la pena entrar. **Nunca hay nadie presente para explicarlo** — ni presentador,
ni proyector.

**Segunda audiencia activa hoy:** el jurado de evaluación de la fase 1, que juzga el sitio antes de
que ningún estudiante lo adopte.

**Marca:** paleta oficial de la UAEMéx (vinculante en color, libre en tipografía, layout y
movimiento). Activos reales: la fotografía del vitral de la biblioteca de la facultad y la mascota
de la universidad. Voz directa, sin condescendencia.

**Anti-referencias confirmadas:** test de BuzzFeed, dashboard SaaS genérico, landing de bootcamp.
La lectura institucional **no** es un riesgo aquí, es un activo.

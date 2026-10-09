# Arquitectura y procesamiento de PotroPath

Estado: describe el código de `main` al 8 de octubre de 2026, tras fusionar el rediseño editorial
con las preguntas detonadoras. La sección *Arquitectura futura* es una propuesta, no algo
implementado.

## 1. Vista general

PotroPath es una aplicación web de una sola página (SPA) que corre en el navegador del estudiante.
No hay cuentas ni base de datos. El sitio compilado son archivos estáticos (HTML, CSS, JS e
imágenes) que cualquier servidor web puede publicar, y así funciona completo.

La única pieza de servidor es **opcional**: `POST /api/detonadoras`, una función de Vercel que
redacta con Qwen las dos preguntas de "Afina tu ruta". Existe porque la llave del modelo no puede
viajar en el bundle. Sólo se llama cuando el estudiante pulsa "Afinar mi ruta", y si no existe —un
hosting estático, `npm run dev`—, falla o tarda más de 8 s, el afinado usa dos preguntas de respaldo
escritas a mano y lo dice.

```mermaid
flowchart LR
  subgraph Navegador del estudiante
    UI[Vistas React<br/>Inicio · Diagnóstico · Mi ruta · Comunidad]
    R[React Router]
    S[Store Zustand<br/>respuestas + índice + afinado]
    L[(localStorage<br/>potropath-quiz)]
    F[affinity.js<br/>función pura]
    RF[refine.js<br/>candidatos · validación · decisión]
    D[src/data<br/>preguntas · áreas · ruta · credenciales · perfiles · comunidad · enfoques]
  end
  E[Estudiante] --> UI
  UI --> R
  UI <--> S
  S <--> L
  D --> UI
  S --> F
  D --> F
  F --> UI
  UI -- enlace --> X[Sitios oficiales<br/>proveedores y empresas]
  UI -- GET puesto + ubicación --> LI[LinkedIn Jobs]
  H[Servidor estático] -- HTML, CSS, JS, imágenes --> UI
  S -. "POST 50 cifras, sólo con «Afinar mi ruta»" .-> API[Función opcional<br/>/api/detonadoras]
  API -. prompt .-> QW[Qwen<br/>Alibaba Cloud Model Studio]
  API -. preguntas validadas .-> S
  S --> RF
  D --> RF
```

| Capa | Tecnología | Responsabilidad |
|---|---|---|
| Presentación | React 19, Tailwind CSS v4 | Vistas, sistema editorial, accesibilidad |
| Navegación | React Router 7 | Rutas `/`, `/quiz`, `/resultados`, `/comunidad`, 404; foco y anclas al cambiar de vista |
| Estado | Zustand 5 + `persist` | Respuestas e índice de pregunta; saneamiento al rehidratar |
| Persistencia | `localStorage` | Sobrevive al cierre de pestaña; nunca sale del navegador |
| Lógica | `src/lib/affinity.js`, `src/lib/refine.js` | Afinidad, empates y caso neutral; candidatos, validación y decisión de las detonadoras. Puros: los comparten el navegador y la función |
| Función opcional | Vercel Functions (`api/`) | Guarda la llave de Model Studio, arma el prompt y revalida la respuesta de Qwen |
| Contenido | `src/data/*.js` | Datos estáticos versionados con el código, con fuente y fecha de revisión |
| Build | Vite 8 | Empaquetado y optimización; salida en `dist/` |
| Calidad | oxlint, `node --test` | Lint y pruebas automatizadas |

### Qué datos salen del navegador

| Dato | ¿Sale? | Hacia dónde |
|---|---|---|
| Respuestas del diagnóstico | **Sólo si pulsa "Afinar mi ruta"**, y sólo las 50 cifras del 1 al 5 | `/api/detonadoras`, que las pasa a Qwen (Alibaba Cloud Model Studio, Singapur). El servidor no las escribe en ningún log |
| Porcentajes de afinidad | **No** | Se calculan en memoria |
| Puesto y ubicación escritos en el buscador | Sí, al pulsar "Buscar en LinkedIn" | `linkedin.com/jobs/search` como parámetros GET |
| Navegación a fuentes oficiales | Sí, al pulsar el enlace | El sitio del proveedor o la empresa |

El sitio carga además la tipografía DM Sans desde Google Fonts. No hay analítica ni cookies propias.

## 2. Flujo de procesamiento

```mermaid
sequenceDiagram
  participant E as Estudiante
  participant Q as Diagnóstico
  participant S as Store
  participant L as localStorage
  participant A as affinity.js
  participant R as Mi ruta
  E->>Q: abre /quiz
  L-->>S: rehidrata y sanea (ids y valores válidos, índice acotado)
  loop 50 afirmaciones
    E->>Q: elige 1–5 (clic, flechas o tecla)
    Q->>S: answerCurrent(valor) — rechaza valores fuera de la escala
    S->>L: persiste
  end
  E->>R: abre /resultados
  R->>S: ¿50 respuestas?
  alt incompleto
    R-->>E: "Llevas n de 50" y botón para continuar
  else completo
    S->>A: computeAffinity(respuestas)
    A-->>R: 5 porcentajes ordenados
    R->>A: summarizeAffinity → ganador, empate o todo neutral
    R-->>E: resultado + ruta del área elegida
  end
```

1. **Rehidratación.** Al cargar, el store lee `potropath-quiz` y descarta ids de pregunta
   desconocidos y valores fuera de 1–5; acota el índice a 0–49. Una sesión vieja o editada a mano no
   puede romper la vista.
2. **Respuesta.** Cada selección válida se guarda de inmediato. Retroceder permite cambiar
   respuestas. El progreso visible cuenta **respuestas guardadas**, no la posición.
3. **Completitud.** Resultados exige las 50 respuestas. Con una sesión parcial los porcentajes
   pueden caer debajo de 20% y se leerían como un perfil, así que no se muestran.
4. **Cálculo.** Ver la sección 3.
5. **Interpretación honesta.** `summarizeAffinity` devuelve todas las áreas empatadas en el primer
   lugar y si todas las respuestas fueron "Neutral". La vista usa eso para el titular y el título
   del navegador.
6. **Recomendación.** Es una **asociación estática**: el área elegida apunta a sus habilidades
   (`roadmap.js`), sus dos credenciales (`credentials.js`) y su perfil profesional (`careers.js`).
   No hay ranking aprendido ni predicción de empleabilidad, y la IA no recomienda nada: sólo
   redacta las preguntas del paso 9.
7. **Exploración.** El estudiante puede abrir cualquiera de las cinco rutas. Cambiar de ruta no
   recalcula ni modifica respuestas.
8. **Salidas externas.** Comunidad recibe el área por URL (`/comunidad?area=nube#especialidades`).
   LinkedIn recibe sólo puesto y ubicación.
9. **Afinado (opcional).** Si el estudiante pulsa "Afinar mi ruta", el store envía las 50 cifras a
   `/api/detonadoras`. La función calcula qué áreas empataron arriba con el mismo `affinity.js`,
   elige hasta seis enfoques candidatos con `refine.js` y le pide a Qwen dos preguntas de tres
   opciones, cada una atada a un enfoque del catálogo cerrado (`focuses.js`). La respuesta se
   revalida en el servidor y otra vez en el navegador; si no pasa, si tarda más de 8 s o si la
   función no existe, entran las preguntas de respaldo (`fallbackTriggers.js`), marcadas como tales.
   Con las dos respondidas, `pickFocus` elige el enfoque de forma determinista —votos, luego el
   promedio de las preguntas del banco que lo alimentan, luego el orden del catálogo— y "Tu primer
   paso" toma sus habilidades y su primer paso. No cambia ningún porcentaje. Con todo en "Neutral"
   no se ofrece: no hay un área arriba que afinar.

## 3. Fórmula de afinidad

Para cada área *a* con diez afirmaciones y respuestas *r* ∈ {1, 2, 3, 4, 5}:

```
puntaje(a)    = Σ r  de las diez afirmaciones de a        (10 a 50)
porcentaje(a) = redondear(puntaje(a) / 50 × 100)          (20 a 100 con el diagnóstico completo)
```

| Respuestas en un área | Puntaje | Porcentaje |
|---|---|---|
| Diez "Totalmente en desacuerdo" (1) | 10 | 20% (piso) |
| Diez "Neutral" (3) | 30 | 60% (punto medio) |
| Diez "Totalmente de acuerdo" (5) | 50 | 100% |

**Ejemplo.** Una estudiante responde en Ciberseguridad 5, 4, 5, 3, 4, 5, 4, 4, 3, 5 (suma 42) y en
Cloud Computing 3, 3, 4, 2, 3, 4, 3, 3, 4, 3 (suma 32). Ciberseguridad = 42 / 50 = **84%**; Cloud =
32 / 50 = **64%**. Cada área se mide por separado: los cinco porcentajes no suman 100 y no son
probabilidades.

**Propiedades verificadas por `tests/affinity.test.js`:** 50 ids únicos y diez por área; escala
20–100; todo neutral produce cinco áreas en 60% y se reconoce como empate total; un ganador único no
altera a las demás áreas; un empate parcial devuelve todas las áreas empatadas; los valores
inválidos no suman.

**Límites.** El instrumento mide interés declarado mediante afirmaciones tipo Likert. No ha sido
validado psicométricamente (confiabilidad, validez de constructo) y no mide aptitud ni dominio. Si
el banco de preguntas deja de tener la misma cantidad por área, el denominador debe calcularse por
área.

## 4. Modelo de contenido

```mermaid
erDiagram
  AREA ||--|{ QUESTION : "10 por área"
  AREA ||--|| ROUTE : "una ruta"
  ROUTE ||--|{ SKILL : "5 en 3 etapas"
  ROUTE }|--|{ CREDENTIAL : "2 por área"
  AREA ||--|{ CAREER : "1+ perfiles"
  CAREER }|--|{ SKILL : "skillIds"
  AREA ||--|{ INTEREST : "ideas de comunidad"
  AREA ||--|{ FOCUS : "3 enfoques"
  FOCUS }|--|{ QUESTION : "signals"
```

- Cada credencial y perfil lleva `sourceUrl` y `reviewedAt`. `tests/professional-route.test.js`
  falla si un perfil apunta a una habilidad inexistente, si falta una fuente o si una foto de la
  galería no tiene pie o texto alternativo.
- Lo pendiente es dato explícito: `TEAMS_JOIN_URL = null`, `EVENTS = []`, `TESTIMONIALS = []`. La
  interfaz muestra un estado honesto en vez de un control que no hace nada.

## 5. Decisiones de arquitectura

| Decisión | Alternativa descartada | Por qué |
|---|---|---|
| Todo en el cliente, sin registro | Backend con cuentas | Pedir datos antes de dar valor reduce la participación (PRODUCT.md, principio 1) y obliga a gestionar datos personales |
| `localStorage` para el avance | Sesión en servidor | 50 preguntas en un teléfono entre clases: la sesión debe sobrevivir al cierre sin cuenta |
| Contenido como módulos JS | CMS | Volumen pequeño, cambios raros y revisables en Git; las pruebas validan referencias |
| Función de afinidad pura | Cálculo dentro del componente | Se prueba sin navegador y su comportamiento queda documentado por pruebas |
| Sin librerías de animación | GSAP + ScrollSmoother + Matter.js | El contenido dependía de animaciones para aparecer; quitar 3 dependencias redujo el JS de entrada de 141.9 a 96.0 kB gzip |
| Búsqueda en LinkedIn por GET | API de empleos o scraping | No requiere credenciales, no copia datos de terceros y funciona sin JavaScript |
| Función opcional para el afinado | Llamar a Qwen desde el navegador | La llave no puede viajar en el bundle. Opcional para que el sitio siga siendo estático: sin ella, el afinado usa el respaldo |
| La IA redacta preguntas; el catálogo decide | Que el modelo genere habilidades o credenciales | Un modelo que inventa una certificación cuesta la credibilidad del proyecto. Lo que se lee como ruta lo revisa una persona |
| Un solo cálculo para navegador y servidor | Recalcular en la función | Dos copias del puntaje terminarían por discrepar en un empate, justo cuando se eligen los candidatos |

## 6. Arquitectura futura (propuesta, no implementada)

Sólo se añade un servicio si el piloto demuestra una necesidad y existe un responsable de datos.

```mermaid
flowchart LR
  A[Sitio estático actual] --> B[Piloto y evidencia]
  B --> C{Decisión institucional}
  C --> D[Hosting y dominio de la UAEMéx]
  C -. si se justifica .-> E[Servicio de eventos agregados<br/>Supabase o infraestructura universitaria]
  E -. sin respuestas individuales .-> F[Tablero de uso agregado]
  C -. si se justifica .-> G[Gestión editorial de comunidad y eventos]
```

Eventos mínimos que podrían registrarse, con consentimiento y retención definidos antes de
instrumentar: diagnóstico iniciado, diagnóstico completado, ruta explorada, salida a recurso
externo. **Nunca** respuestas individuales, texto libre ni nombres. Si se instrumenta, debe
actualizarse la afirmación de cuándo salen las respuestas del navegador, en el pie del sitio y en
este documento.

Una futura API necesitaría pruebas propias de concurrencia, errores y recuperación; el rendimiento
del sitio estático (ver `RENDIMIENTO.md`) no dice nada sobre ella.

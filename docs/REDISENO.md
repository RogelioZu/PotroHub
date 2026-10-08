# Rediseño editorial 2026-10 — bitácora de traslado y verificación

Rama: `rediseno/guia-editorial`, creada desde `main` (`78072f5`) el 8 de octubre de 2026.
Estado: implementado y verificado en esta rama. No desplegado.

## 1. Origen

El rediseño se construyó primero, por error, sobre una copia anterior del proyecto
(`codex/rediseno-potropath`, `9a9780b..33c042c`). Este repositorio tenía un commit más
(`78072f5`, "images that were missing") con tres fotografías verificadas nuevas —Rama Estudiantil
IEEE UAEMéx, Axolotl Tournament y PoliHacks— y cambios en Comunidad y su documentación. El resto de
`src/` era idéntico.

No se hizo cherry-pick: las historias tienen hashes distintos y el código de aquella rama estaba
escrito en líneas muy largas, sin los comentarios de decisión que caracterizan a este repositorio.
Se reimplementó por componentes, conservando las decisiones y el contenido verificado de ambos.

## 2. Qué cambió frente a la versión anterior

| Superficie | Antes | Ahora |
|---|---|---|
| Carga | Titular y tarjetas ocultos hasta que GSAP los revelaba | Contenido inmediato; sin GSAP, Matter.js ni ScrollSmoother |
| Navegación | Sin "Mi ruta"; texto sobre el vitral | Cuatro destinos, CTA según avance, cabecera de papel, menú móvil con Escape, salto al contenido |
| Inicio | Mosaico con física y fotos de banco; áreas detrás de giros 3D | Foto real de la Rama IEEE con pie, tres pasos, áreas con descripción visible, testimonios sólo si son reales |
| Diagnóstico | Botones con `role="radio"`; progreso por posición | Radios nativos, progreso por respuestas guardadas, atajos 1–5 y Enter, "ir a la primera pendiente" |
| Resultados | Ganador arbitrario en empate; 5 habilidades y 3 certificaciones como listas | Empates y caso neutral reconocidos, marca del 60%, cinco rutas explorables, habilidades por etapas, comparación de credenciales, perfiles con requisitos, LinkedIn |
| Comunidad | Filas que volteaban sin abrir nada; logos IEEE en rejilla aparte | Directorio por interés ligado a la URL, tarjeta IEEE unificada, galería de seis fotos verificadas, estados pendientes explícitos |
| Datos | En el JSX | En `src/data/`, con fuente y fecha de revisión |
| Pruebas | Ninguna | 13 con `node --test` |

## 3. Diferencias respecto del rediseño anterior

Mejoras incorporadas al trasladarlo:

- **Fuentes revalidadas el 8 de octubre.** La ficha de AWS Solutions Architect (Lagos) devolvía
  404; se sustituyó por la práctica *Cloud Support Associate 2027* de AWS, que además es un ejemplo
  de entrada para estudiantes que egresan en 2028. La página de AWS Cloud Practitioner confirma que
  el examen existe en español de Latinoamérica, y se añadió a la tarjeta.
- **Galería de seis fotos en vez de tres**, incluidas las nuevas de este repositorio, con la Rama
  IEEE en primer lugar porque su lienzo la verifica.
- **Hero de Inicio con foto real** de la Rama IEEE (recorte nuevo del original de 4096 px) en lugar
  de la foto de banco del mosaico.
- **Atajos de teclado** en el diagnóstico y botón "ir a la primera pendiente".
- **Marca del punto neutral** sobre cada barra de afinidad.
- **`summarizeAffinity`** separa la lógica de empates de la vista y la deja probada.
- **Fechas de revisión formateadas en UTC** para que "7 oct" no se muestre como "6 oct" en México.
- **Dependencias retiradas** de `package.json` en lugar de dejarlas sin uso.
- **Optimización medida**: franja de vitral de 12 KB y fotos de hero de 720 px para teléfonos (ver
  `RENDIMIENTO.md`).
- **Defectos corregidos durante la verificación**: nombres de las sociedades IEEE invisibles (texto
  blanco sobre tarjeta blanca dentro del panel verde) y etiquetas de especialidad grises.

Se conservaron sin cambios: las 50 afirmaciones, la escala 1–5, la fórmula, la clave de
`localStorage`, las rutas de `App.jsx`, `areas.js` y `questions.js`.

## 4. Verificación

Automatizada:

- `npm run lint`: sin errores ni advertencias (la versión anterior tenía una).
- `npm test`: 13 pruebas aprobadas.
- `npm run build`: correcto. JavaScript de entrada 96.0 kB gzip, frente a 141.9 kB (−32%).

En Chrome real, con un script de recorrido (puppeteer-core) a 390 y 1440 px:

| Comprobación | Resultado |
|---|---|
| Desborde horizontal en las cinco rutas y en Resultados explorando | Ninguno |
| Errores o advertencias de consola | Ninguno |
| 50 respuestas sólo con teclado (1–5 + Enter), con recarga en la 25 | Conserva 25 de 50; termina en Resultados con foco en el titular |
| Ganador único (Software 5, resto 2) | "Desarrollo de Software", 100% frente a 40% |
| Todo "Neutral" | "Tu camino aún está abierto."; título "Tu perfil de afinidad" |
| Empate parcial (IA y Cloud) | "Hay más de un camino para ti." y nombra ambas |
| Comparar dos credenciales | Seis filas de comparación; estado anunciado |
| Cambiar de ruta y de perfil | Explorador y ficha se actualizan sin tocar porcentajes |
| LinkedIn con "Analista de Seguridad Jr" en "Toluca, México" | `keywords=Analista+de+Seguridad+Jr&location=Toluca%2C+M%C3%A9xico` |
| Repetir diagnóstico | Primer toque arma "¿Seguro? Se borran tus 50 respuestas"; segundo reinicia a 0 de 50 |
| Menú móvil | Abre con cinco enlaces; Escape lo cierra |
| `/comunidad?area=nube#especialidades` | Selecciona Cloud Computing y baja al directorio |

Límites: no es una auditoría formal de accesibilidad (WCAG), no se probó con lectores de pantalla
reales ni con estudiantes. Esas pruebas son parte del piloto (`PILOTO.md`). El detector de
Impeccable no estaba disponible en este equipo y no se presenta como ejecutado.

## 5. Commits

Cada commit agrupa tres archivos y no lleva coautor, por instrucción del equipo. El último lote de
un tema puede tener menos archivos: no se añadieron archivos artificiales para completarlo.

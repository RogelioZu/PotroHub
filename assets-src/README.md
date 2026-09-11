# Originales

Masters de los activos del sitio. **No se sirven**: viven fuera de `public/`, así
que Vite no los copia al build. Lo que la aplicación consume está en
`public/images/`.

Cada carpeta agrupa por lo que alimenta:

| Carpeta | Alimenta |
| --- | --- |
| `comunidad/` | Las fotografías de `/comunidad` — hero, galería y la tira de *Explora* |
| `logotipos-ieee/` | Los cuatro recuadros de marca de la tarjeta de la Rama IEEE |
| `inicio/` | Las celdas con foto del mosaico del hero de Inicio |
| `institucional/` | Vitral, mascota y tarjeta de vista previa |

**Los nombres describen lo que muestra cada archivo, y eso no es cosmética.**
Hubo un `ieee_img.jpg` y un `ieee_img2.jpeg` y, con esos nombres, este README
llegó a describir mal la procedencia de uno de ellos — decía que la gente de la
foto era de otra universidad cuando son de ésta, de visita. Un nombre opaco
obliga a confiar en una nota que puede estar equivocada; uno descriptivo se
corrige solo al abrir el archivo.

---

## `comunidad/`

Fotografías reales de estudiantes de la Facultad de Ingeniería de la UAEMéx —
salvo donde se indique lo contrario, que es la excepción y va marcada. Son la
prueba visual de que la comunidad existe, así que **la procedencia de cada una
importa tanto como la imagen** (ver `PRODUCT.md` → *Evidence on Hand*).

| Archivo | Medidas | Qué muestra | Derivado |
| --- | --- | --- | --- |
| `talent-land-2026.jpeg` | 1600x1200 | Estudiantes de la facultad en Talent Land México 2026 (Expo Santa Fe, CDMX, 7–9 abril 2026) | Hero (2 recortes) + `galeria-talent-land.webp` |
| `rama-ieee-uaemex.jpeg` | 4096x3072 | La Rama Estudiantil IEEE UAEMéx junto a un vehículo todo terreno del equipo | `galeria-rama-ieee.webp` |
| `women-in-engineering.jpeg` | 1600x785 | El capítulo Women in Engineering de la facultad con un reconocimiento | `galeria-wie.webp` |
| `axolotl-tournament-uam-lerma.jpeg` | 1600x1059 | Estudiantes de la facultad con sus robots en el Axolotl Tournament, UAM Unidad Lerma | `galeria-axolotl.webp` |
| `visita-uam-lerma.jpg` | 760x570 | Estudiantes de la facultad **de visita** en la Rama Estudiantil IEEE de la UAM Lerma | `galeria-visita-uam-lerma.webp` |
| `poli-hacks.jpg` | 620x827 | Dos estudiantes de la facultad con su trofeo del hackatón PoliHacks, en sede de UPIITA | `explora-poli-hacks.webp` |
| `hackathon-u-hacks.jpeg` | 1200x1600 | **No es de la UAEMéx** — estudiantes de UPIITA-IPN con reconocimientos del hackathon U-HACKS | `explora-hackathon.webp` |

### Dos trampas de atribución que ya costaron caro

**`visita-uam-lerma.jpg` — el telón del fondo es del anfitrión.** Estuvo descrito
aquí como "estudiantes de la Rama Estudiantil IEEE de la UAM Lerma" y marcado
"sin usar". Era un error de hecho: son estudiantes de **esta** facultad, de
visita. Con la descripción vieja la foto quedaba inutilizable —no se puede
presentar como propia a gente ajena— y por eso se quedó fuera del sitio. Su pie
en la galería dice "Visita a la Rama IEEE UAM Lerma", en ese orden, porque **el
orden de las palabras separa "fuimos" de atribuirnos una rama que no es
nuestra**.

**`poli-hacks.jpg` y `hackathon-u-hacks.jpeg` son las dos de sede UPIITA y sólo
una es nuestra.** La primera son estudiantes de esta facultad compitiendo en
PoliHacks; la segunda son estudiantes de UPIITA-IPN. Las dos viven en la tira de
*Explora*, que va **sin pies** — y eso es justamente lo que permite que convivan
sin afirmar nada sobre ninguna. Si algún día esa tira lleva pies, la segunda
tiene que salir o llevar el suyo diciendo de quién es.

### Techos de resolución

`talent-land-2026.jpeg` es el original más chico de lo que le pedimos. Su zona
limpia da 1216px de ancho, así que el hero se acota a 1344px (1216 × 1.10) para
no estirarlo más de lo que aguanta; sin ese tope, una pantalla de 1920 lo
estiraría 1.47x. Si aparece una versión de mayor resolución conviene sustituirla
**y subir el tope con ella** — está en `DESIGN.md` → *Comunidad*.

`poli-hacks.jpg` mide 620px de lado, así que su derivado cuadrado sale a 620 y no
a los 900 que piden las otras de la tira. Es el techo del archivo: ampliarlo no
añadiría detalle, y la tarjeta se dibuja a 224px.

Los comandos exactos de cada derivado están en
`public/images/comunidad/README.md`.

---

## `logotipos-ieee/`

Los logotipos oficiales de los cuatro capítulos, descargados de la marca de cada
sociedad y **sin modificar** (sólo renombrados; traían espacios y sufijos
`copy`).

- `computer-society.png` — 780x240. Variante de texto negro. La de texto blanco
  existe y **no sirve aquí**: el panel de marcas de Comunidad es papel, y sobre
  blanco desaparecen la diagonal y las tres líneas del wordmark y queda el bug
  naranja suelto.
- `robotics-automation.png` — 638x235. Versión apilada a cuatro tintas.
- `power-energy.png` — 268x187. Es el original más chico de los cuatro; alcanza
  para el recuadro a `2x` y no conviene escalarlo hacia arriba.
- `women-in-engineering.png` — 1523x1536. Morado `#742780` sobre transparente.

Los cuatro vienen recortados al contenido: su caja alfa es la imagen completa,
sin márgenes que quitar, así que el alto en CSS mapea directo al tamaño óptico.

---

## `inicio/`

Las tres fotografías que ocupan celdas del mosaico del hero de Inicio
(`src/components/ui/HeroMosaic.jsx`).

| Archivo aquí | Servido como | Celda |
| --- | --- | --- |
| `estudiante-ico.avif` | `public/images/estudiante-ico.png` | `circle-main` |
| `trabajo-equipo.avif` | `public/images/trabajo-equipo.png` | `square-top` |
| `estudiante-redes.webp` | `public/images/estudiante-redes.png` | `pill-wide` |

**Aquí llevan su extensión real y en `public/` no.** Los tres servidos la tienen
equivocada: dos son AVIF y uno es WebP, los tres con `.png`. Hoy funciona porque
el navegador detecta el formato por los bytes e ignora el `Content-Type` en un
`<img>`, pero cualquier herramienta que confíe en la extensión —un optimizador,
un CDN, un script de build— se equivocará. Renombrar las servidas es un cambio
aparte, porque toca las rutas de `Home.jsx`.

---

## `institucional/`

- `vitral-biblioteca.png` — 2736x308, 1.8 MB. Fotografía real del vitral de la
  biblioteca de la Facultad de Ingeniería (UAEMéx). Deriva
  `public/images/vitral-biblioteca.webp`, el fondo del header y del footer.
- `potro-mascota.png` — 413x688. Mascota de la universidad, recortada de su fondo
  gris original. Está en RGB: el alfa se recuperó al derivar
  `public/images/potro-mascota.webp`.
- `og-potropath.png` — 1200x630. Copia de archivo de la tarjeta de vista previa
  generada, para poder diferenciar contra ella cuando se regenere. La receta de
  composición vive en `DESIGN.md` → *Tarjeta de vista previa*.

`areas/*.webp` no tienen maestro aquí: llegaron como JPEG de 2432px con extensión
`.png` (unos 2 MB cada una, 9.7 MB entre las cinco) y esos originales no se
conservaron al derivarlas.

---

**Eliminado:** `vitral2` (1200x600, WebP con extensión `.png`), un segundo vitral
que no referenciaba ningún componente. Se borraron las dos copias — la de aquí y
la de `public/images/`, que además pesaba 136 KB en cada build sin que nadie la
pidiera. Está en el historial de git si vuelve a hacer falta.

Al regenerar un derivado, actualiza `public/images/README.md` y
`public/images/comunidad/README.md` con las medidas nuevas.

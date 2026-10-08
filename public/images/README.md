# Imágenes institucionales

Lo que vive aquí es lo que se sirve. Los originales sin comprimir están en
`assets-src/` (fuera de `public/`, así que no entran al build); ver el README
de esa carpeta.

El teléfono con mala red del campus es un caso primario del producto, no un
respaldo (ver PRODUCT.md → *Accessibility*): cualquier imagen que se agregue
aquí pasa por la misma conversión, y el original sin optimizar no entra al
repositorio.

`vitral-franja.webp` (1600x24, 12 KB) es lo que hoy se ve del vitral: la franja
de 8px arriba de la cabecera y abajo del pie (`.brand-ribbon` en `index.css`).
Es una banda horizontal recortada alrededor del 52% de alto del master
`assets-src/institucional/vitral-biblioteca.png` y estirada a 1600x24. Antes la
franja cargaba el panorámico completo de 207 KB para pintar 8px, y eso costaba
medio segundo de primer pintado en un teléfono (ver `docs/RENDIMIENTO.md`).

`vitral-biblioteca.webp` es la fotografía real del vitral de la biblioteca de
la Facultad de Ingeniería (UAEMéx): un panorámico muy ancho (~8.9:1) de los
cuatro paneles de vidrio, a 2736x308. Desde el rediseño editorial ya no se
sirve en ninguna página (el header y el footer usan `vitral-franja.webp`); se
conserva como activo institucional y para regenerar la tarjeta Open Graph.

`potro-mascota.webp` es la mascota de la universidad, con canal alfa. El
original venía en RGB con el fondo gris incrustado: sobre el papel blanco de
la insignia no se notaba, pero sobre cualquier superficie de color aparecía un
rectángulo claro detrás del potro. El fondo se rellenó desde los bordes —no
por color— para no tocar los blancos interiores (ojos, dientes, camisa). La
usan el estado sin resultados de `Results` y la página 404, sobre recuadro de
papel.

`areas/*.webp` son las cinco fotografías de las áreas de especialización, a
1200px de ancho y 308 KB entre las cinco, referenciadas desde
`src/data/areas.js`. Las consumen **dos** superficies: la rejilla de áreas de
Inicio y las miniaturas del directorio de Comunidad (y la ilustración de la
ruta explorada en Resultados), que las toman del mismo campo `image` de
`AREAS` en vez de tener copias propias — ver `comunidad/README.md` →
*Miniaturas del directorio de especialidades*. Llegaron como JPEG de 2432px con extensión `.png` y unos
2 MB cada una — 9.7 MB en la portada. A 1200px siguen alcanzando para la
tarjeta más ancha de la rejilla de Inicio, que mide unos 560px y a 2x pide
1120px.

`inicio-rama-ieee.webp` (1200x750, 175 KB) es la fotografía del hero de
Inicio: integrantes de la Rama Estudiantil IEEE UAEMéx con el vehículo todo
terreno del equipo. Sale de `assets-src/comunidad/rama-ieee-uaemex.jpeg`
(4096x3072) con un recorte 16:10 centrado en el grupo —`extract` en
`left 180, top 720, 3200x2000`, reducido a 1200px, WebP calidad 76; la
variante `inicio-rama-ieee-720.webp` (66 KB, calidad 74) es la que reciben los
teléfonos por `srcset`— que deja
fuera casi todo el estacionamiento vacío de abajo. Es la misma foto que
`comunidad/galeria-rama-ieee.webp` con otro encuadre: el lienzo del fondo dice
"Rama Estudiantil · UAEMéx · IEEE", así que la imagen se verifica sola, y por
eso abre el sitio.

`estudiante-ico.png`, `trabajo-equipo.png` y `estudiante-redes.png` ocupaban
las celdas del mosaico del hero anterior. **Son fotografías de banco** (sin
procedencia de la facultad en `assets-src/README.md`) y ya no se muestran:
abrir un producto cuyo principio es "la verdad local le gana al consejo
genérico" con una foto de stock lo contradecía. Se conservan aquí y en
`assets-src/inicio/` por si se necesitan para otra cosa; no deben volver al
sitio presentadas como estudiantes de la facultad. **Sus extensiones mienten:**
dos son AVIF y una WebP, las tres con `.png`.

Los cuatro logotipos de `comunidad/ieee-*.webp` son las marcas de los capítulos
de la Rama IEEE, una por recuadro en la tarjeta de Comunidad:

| Archivo | Medidas | Peso |
|---|---|---|
| `ieee-computer-society.webp` | 480x148 | 16.5 KB |
| `ieee-robotics-automation.webp` | 320x118 | 18.6 KB |
| `ieee-power-energy.webp` | 268x187 | 7.9 KB |
| `ieee-women-in-engineering.webp` | 280x282 | 25.2 KB |

Van en **WebP sin pérdida**, contra la costumbre del resto de la carpeta: son
arte plana de bordes duros, y a estos tamaños la compresión con pérdida sale
*más pesada* que la sin pérdida (para el emblema de WIE, 39-48 KB con pérdida
contra 25 KB sin ella) además de ensuciar los trazos finos del monograma.
Conservan canal alfa, así que el fondo blanco del recuadro es del CSS y no de
la imagen. El ancho de cada uno sale de su alto en pantalla a `2x`, que no es
el mismo para los cuatro porque las proporciones no se parecen.

`comunidad/explora-hackathon.webp` (900x900, 72 KB) es la fotografía del bloque
*Explora más allá del salón*. Viene de un original `3:4` con casi un tercio de
pared vacía arriba; el recorte cuadrado anclado abajo está hecho aquí y no en
CSS, para no servir bytes de una pared que el encuadre tira. Ver el README de
`assets-src/` para su procedencia, que **no es de la UAEMéx**.

`og-potropath.png` es la tarjeta de vista previa para enlaces compartidos
(1200x630). Se queda en PNG a propósito: varios scrapers no leen WebP.

Hubo un `vitral2.png` (1200x600, WebP pese a la extensión) que no referenciaba
ningún componente. **Se eliminó**, junto con su copia de archivo: pesaba 136 KB
en cada build sin que nadie lo pidiera. Está en el historial de git.

Los archivos sueltos de esta carpeta tienen una **copia de archivo** en
`assets-src/`, con su extensión real y fuera del build. Son copias, no mudanzas:
`assets-src/` no se sirve, así que mover cualquiera de éstos lo borraría del
sitio.

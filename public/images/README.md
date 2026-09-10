# Imágenes institucionales

Lo que vive aquí es lo que se sirve. Los originales sin comprimir están en
`assets-src/` (fuera de `public/`, así que no entran al build); ver el README
de esa carpeta.

El teléfono con mala red del campus es un caso primario del producto, no un
respaldo (ver PRODUCT.md → *Accessibility*): cualquier imagen que se agregue
aquí pasa por la misma conversión, y el original sin optimizar no entra al
repositorio.

`vitral-biblioteca.webp` es la fotografía real del vitral de la biblioteca de
la Facultad de Ingeniería (UAEMéx): un panorámico muy ancho (~8.9:1) de los
cuatro paneles de vidrio, a 2736x308. La consume `VitralBackdrop`, el fondo
del header y del footer. Si el archivo llegara a faltar, cae a un placeholder
con el acento decorativo `vitral-accent` en vez de romper el layout.

`potro-mascota.webp` es la mascota de la universidad, con canal alfa. El
original venía en RGB con el fondo gris incrustado: sobre el papel blanco de
la insignia no se notaba, pero sobre cualquier superficie de color aparecía un
rectángulo claro detrás del potro. El fondo se rellenó desde los bordes —no
por color— para no tocar los blancos interiores (ojos, dientes, camisa). La
usa `Results`.

`areas/*.webp` son las cinco fotografías de las áreas de especialización, a
1200px de ancho y 308 KB entre las cinco, referenciadas desde
`src/data/areas.js`. Llegaron como JPEG de 2432px con extensión `.png` y unos
2 MB cada una — 9.7 MB en la portada. A 1200px siguen alcanzando para la
tarjeta más ancha de la rejilla de Inicio, que mide unos 560px y a 2x pide
1120px.

`estudiante-ico.png`, `trabajo-equipo.png` y `estudiante-redes.png` son las
tres fotografías que hoy ocupan celdas del mosaico del hero
(`src/components/ui/HeroMosaic.jsx`); el resto de las celdas son bloques de
color en espera. Los recortes pendientes del collage están descritos en
`hero/README.md`, y las fotos de canal de Comunidad en `comunidad/README.md`.

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

Sin usar todavía: `vitral2.png`, que no referencia ningún componente.

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

`og-potropath.png` es la tarjeta de vista previa para enlaces compartidos
(1200x630). Se queda en PNG a propósito: varios scrapers no leen WebP.

Sin usar todavía: `vitral2.png`, que no referencia ningún componente.

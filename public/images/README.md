# Imágenes institucionales

Lo que vive aquí es lo que se sirve. Los originales sin comprimir están en
`assets-src/` (fuera de `public/`, así que no entran al build); ver el README
de esa carpeta.

`vitral-biblioteca.webp` es la fotografía real del vitral de la biblioteca de
la Facultad de Ingeniería (UAEMéx): un panorámico muy ancho (~8.9:1) de los
cuatro paneles de vidrio, a 2736x308.

La consumen `VitralBackdrop` (fondo de header/footer) y `VitralShowcase`
(tarjeta del vitral en Inicio) desde `/images/vitral-biblioteca.webp`. Si el
archivo llegara a faltar, ambos componentes caen a un placeholder con el
acento decorativo `vitral-accent` en vez de romper el layout.

`potro-mascota.webp` es la mascota de la universidad, con canal alfa. El
original venía en RGB con el fondo gris incrustado: sobre el papel blanco de
la insignia no se notaba, pero dentro del círculo verde de la órbita de Inicio
aparecía un rectángulo claro detrás del potro. El fondo se rellenó desde los
bordes —no por color— para no tocar los blancos interiores (ojos, dientes,
camisa). La usan `VitralShowcase`, la órbita de Inicio y `Results`.

`areas/*.webp` son las cinco fotografías de la órbita de áreas de Inicio, a
720px de ancho. Llegaron como JPEG de 2432px con extensión `.png` y unos 2 MB
cada una —10 MB en la portada— para pintarse en una tarjeta de 240px.

`og-potropath.png` es la tarjeta de vista previa para enlaces compartidos
(1200x630). Se queda en PNG a propósito: varios scrapers no leen WebP.

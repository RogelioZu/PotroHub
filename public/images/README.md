# Imágenes institucionales

`vitral-biblioteca.png` es la fotografía real del vitral de la biblioteca de
la Facultad de Ingeniería (UAEMéx): un panorámico muy ancho (~8.9:1) de los
cuatro paneles de vidrio.

La consumen `VitralBackdrop` (fondo de header/footer) y `VitralShowcase`
(tarjeta del vitral en Inicio) desde `/images/vitral-biblioteca.png`. Si el
archivo llegara a faltar, ambos componentes caen a un placeholder con el
acento decorativo `vitral-accent` en vez de romper el layout.

`potro-mascota.png` es la mascota de la universidad (recortada de su fondo
gris original con `sharp`), usada por `VitralShowcase` como insignia sobre
la esquina de la tarjeta del vitral en Inicio.

`IA.webp`, `Seguridad.webp`, `Cloud.webp`, `DC.webp` y `Desarrollo.webp` son
las fotografías de las cinco áreas de especialización, referenciadas desde
`src/data/areas.js`. Están en WebP a 1200px de ancho: en PNG a tamaño
completo pesaban 9.7 MB entre las cinco y ahora pesan 0.29 MB. El teléfono
con mala red del campus es un caso primario del producto, así que cualquier
imagen que se agregue aquí debe pasar por la misma conversión — el original
sin optimizar no entra al repositorio.

`Desarrollo.webp` aparece además en el mosaico del hero de Inicio, con un
`alt` propio: ahí no es la ilustración de un área, es la fotografía de
estudiantes de la facultad trabajando juntos.

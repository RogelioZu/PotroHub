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

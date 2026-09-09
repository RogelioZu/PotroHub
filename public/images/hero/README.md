# Iconografía del hero

Tres ilustraciones para la celda de collage del mosaico de Inicio
(`src/components/ui/HeroMosaic.jsx`), a un lado de la tarjeta del vitral y de
las celdas de "50 preguntas" / "5 áreas".

| Archivo | Qué es | Rol en la celda |
| --- | --- | --- |
| `computadora.png` | Una laptop o computadora de escritorio | Ícono principal, centrado, el más grande |
| `servidor.png` | Un rack de servidores / infraestructura | Acento, esquina superior izquierda |
| `ia.png` | Algo que lea "inteligencia artificial" — un chip, una red neuronal, un circuito | Acento, esquina inferior derecha |

## Especificación

- **PNG con fondo transparente**, no blanco — la celda tiene su propio fondo
  (`Papel Gris`) y una esquina blanca se vería como un recuadro roto.
- **Recorte cuadrado o casi cuadrado** (1:1 a 4:3), con aire alrededor del
  dibujo: `object-contain` los encoge para caber en su hueco, así que si el
  dibujo ya toca los bordes del lienzo se ve apretado.
- **Un solo estilo entre los tres** — mismo grosor de línea, mismo
  tratamiento (línea, relleno plano o duotono). Tres estilos distintos juntos
  leen como clip art suelto, que es justo lo que `DESIGN.md` marca como
  anti-referencia (ver *Don't* → "iconografía de stock").
- **Sin sombra ni fondo de color horneados en el PNG.** La sombra y el fondo
  los pone la celda; una sombra ya dibujada se duplica o desentona con la
  del contenedor.
- **Colores dentro de la paleta si es posible**: `Verde Universitario`
  (`#526855`), `Verde Profundo` (`#384033`), `Ámbar Quemado` (`#a15c17`) o
  `Tinta` (`#252525`). No es obligatorio —son ilustraciones, no UI—, pero
  entre más se acerquen, menos se sienten pegadas encima del sistema.

Si un archivo todavía no existe, `HeroMosaic` lo oculta en vez de mostrar el
ícono de imagen rota del navegador (`onError`), así que la celda no se ve
incompleta mientras los agregas.

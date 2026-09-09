# Collage del hero

Doce recortes fotográficos para la celda de collage del mosaico de Inicio
(`src/components/ui/HeroMosaic.jsx`), debajo de la tarjeta del vitral. La
referencia es un collage denso de tecnología "de antes y de ahora" —CD,
walkman, máquina de escribir, teléfono de disco, computadoras retro, hasta
laptop, smartphone, cámara y lentes VR actuales— con los recortes
superpuestos, girados y sin ningún fondo o tarjeta detrás; cada objeto flota
directo sobre el papel.

| Archivo | Qué es | Lado de la narrativa |
| --- | --- | --- |
| `disco-compacto.png` | Un CD, sin arte de portada ni nombre de artista visible | Antes |
| `reproductor-cd.png` | Reproductor portátil de CD o casete (tipo walkman) | Antes |
| `computadora-retro.png` | Laptop o computadora de escritorio noventera, pantalla CRT o monitor grueso | Antes |
| `maquina-escribir.png` | Una máquina de escribir | Antes |
| `telefono-disco.png` | Un teléfono de disco | Antes |
| `casete.png` | Una cinta de casete | Antes |
| `celular-plegable.png` | Un celular plegable o de botones, de generación 2000s | Antes |
| `laptop-moderna.png` | Una laptop actual, idealmente con código o una terminal en pantalla | Ahora |
| `celular-moderno.png` | Uno o más smartphones actuales | Ahora |
| `camara.png` | Una cámara digital o mirrorless actual | Ahora |
| `lentes-vr.png` | Unos lentes de realidad virtual | Ahora |
| `chip-ia.png` | Algo que lea "inteligencia artificial" — un chip, un circuito, una red neuronal | Ahora |

## Especificación

- **PNG con fondo transparente, no blanco.** Los objetos flotan directo sobre
  el papel del sitio; un recuadro blanco alrededor se vería como una tarjeta
  rota.
- **Sin logotipos ni marcas de terceros visibles** (Apple, Spotify, Sony,
  nombres de artista o de álbum, etc.). La referencia los trae porque es un
  mood board de Pinterest; en el sitio publicado un logo ajeno es un problema
  de marca que no vale la pena. Un celular, una cámara o una laptop
  "genéricos" —sin el logotipo legible— comunican lo mismo.
- **Recorte ajustado al objeto**, sin mucho aire alrededor: la composición
  final los superpone y gira, así que un margen grande dentro del PNG deja
  espacio muerto entre piezas que deberían tocarse.
- **Buena resolución** (al menos 800px en el lado largo) porque algunos
  ítems ocupan hasta un tercio del ancho de la celda.
- **Un tratamiento fotográfico consistente entre los doce** — todos foto
  real recortada (como la referencia), no una mezcla de foto y dibujo/ícono.

Si un archivo todavía no existe, `HeroMosaic` lo oculta en vez de mostrar el
recuadro roto del navegador, así que la celda no se ve incompleta mientras
los agregas uno por uno.

## Composición

`HeroMosaic.jsx` posiciona cada imagen con porcentajes fijos (`top`, `left`,
`width`) más una rotación, a mano — no es una rejilla ni un cálculo
automático, igual que en la referencia. Si agregas o quitas un ítem, ajusta
el arreglo `COLLAGE_ITEMS` de ese archivo; el resto de las imágenes no
necesita moverse.

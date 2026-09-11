# Fotos de Comunidad

Fotografías reales de la vida estudiantil de la Facultad de Ingeniería, para la
pestaña `/comunidad` (`src/pages/Community.jsx`). A diferencia de las fotos de
`public/images/` que ilustran las áreas de especialización de forma genérica,
éstas deben ser gente real de *esta* facultad — hackatones, sesiones de estudio,
eventos de la Rama IEEE, lo que haya — porque son la prueba visual de que la
comunidad existe, no una ilustración de apoyo.

**Nunca se rellena un hueco con una foto de banco.** Mientras un archivo no
exista, `PhotoCard` (`src/components/ui/PhotoCard.jsx`) dibuja un recuadro de
borde punteado con la leyenda "Fotografía pendiente", que es como el sistema
entero dice "esto todavía no existe". Un hueco honesto cuesta mucho menos que
una foto de stock en la página que existe para probar que la comunidad es real
(ver `PRODUCT.md` → *Evidence on Hand*).

## Hero

El hero usa **dos recortes del mismo original**, servidos por `<picture>`. No es
una optimización: el hueco va de `2.65:1` en escritorio a `0.64:1` en un
teléfono, y con el `4:3` completo el grupo cae en la mitad inferior, justo
debajo del titular.

| Archivo | Medidas | Peso | Cuándo se sirve |
| --- | --- | --- | --- |
| `quienes-somos.webp` | 1216×780 (1.56:1) | 124 KB | Desde `768px` |
| `quienes-somos-movil.webp` | 512×750 (0.68:1) | 48 KB | Bajo `768px` |

Los dos salen de `assets-src/comunidad/talent-land-2026.jpeg` (1600×1200) y **los dos están
centrados en el grupo**, cuyo centro está en `x = 768`:

```
magick comunidad/talent-land-2026.jpeg -crop 1216x780+160+400 +repage -quality 84 quienes-somos.webp
magick comunidad/talent-land-2026.jpeg -crop  512x750+512+450 +repage -quality 82 quienes-somos-movil.webp
```

El recorte se lleva lo que descuadraba la foto, que no era el grupo sino los
bordes: el zaguán oscuro de la entrada (`x 0..190`) y dos personas de paso a la
derecha (`x 1350..1600`). Como los archivos ya están centrados, el hero **no
lleva `object-position`**: el `50% 50%` por defecto reparte simétrico cualquier
recorte que imponga el contenedor.

**La calidad 84/82 no es capricho.** Estuvo en 68/72, elegida cuando el velo era
diagonal y apagaba buena parte del grupo: ahí el detalle fino no se percibía. Con
el velo vertical las caras quedan al 12–25% de tinta, casi limpias, y a esa luz
los artefactos de WebP sí se ven.

**El ancho de 1216px es el techo real de esta fotografía**, no una elección: es
la zona limpia del original. Ampliar el archivo por encima de eso no añade
detalle, lo inventa. Por eso el hero se acota a `84rem` (1344px = 1216 × 1.10) —
ver `DESIGN.md` → *Comunidad*.

Si se sustituye el original, hay que regenerar los dos y volver a mirar el hero
a **390px y a 1440px**: el velo (`.community-hero-scrim` en `index.css`) está
calibrado contra estos encuadres, y sus cortes de opacidad suponen que las caras
caen entre el 62% y el 76% de la altura, contado desde abajo.

## Galería

Tira horizontal en la sección *La comunidad, en fotos*. Cada foto lleva pie
visible; el pie describe el **tipo** de actividad y no un evento concreto, para
que siga siendo cierto cuando se suba el archivo.

| # | Archivo | Pie | Medidas |
| --- | --- | --- | --- |
| 1 | `galeria-talent-land.webp` | Talent Land México 2026 | 800×600, 60 KB |
| 2 | `galeria-rama-ieee.webp` | Rama Estudiantil IEEE UAEMéx | 800×600, 92 KB |
| 3 | `galeria-wie.webp` | Capítulo Women in Engineering | 800×600, 28 KB |
| 4 | `galeria-axolotl.webp` | Axolotl Tournament, UAM Lerma | 800×600, 68 KB |
| 5 | `galeria-visita-uam-lerma.webp` | Visita a la Rama IEEE UAM Lerma | 760×570, 48 KB |

**Las cinco existen y son de esta facultad: ya no queda ningún hueco pendiente.**
Todas llevan pie con evento y lugar. Procedencia de cada original en
`assets-src/README.md` → *comunidad*.

El pie de la 2 es literalmente lo que dice el lienzo del fondo de esa
fotografía, así que se verifica sin salir de la imagen. Las 4 y 5 van juntas
porque son de la misma sede: separarlas haría parecer dos viajes donde hubo uno.

**Para agregar una foto** basta con dejar el archivo y añadir su entrada al
arreglo `gallery` de `Community.jsx`. Si se añade una entrada sin su archivo,
`PhotoCard` dibuja el recuadro punteado de "Fotografía pendiente" — y entonces
hay que devolver a la leyenda de la sección la frase que explica esos recuadros,
que se quitó al no quedar ninguno.

**El pie de `galeria-visita-uam-lerma.webp` dice "Visita a", y el orden importa.**
Son estudiantes de esta facultad en casa ajena: el telón de fondo con la marca
de UAM Lerma es del anfitrión. Escrito "Rama IEEE UAM Lerma" a secas nos
atribuiría una rama que no es nuestra.

Formato **WebP**, lado largo **800px**, `4:3` u horizontal (se recortan con
`object-cover`). Para agregar una foto nueva basta con dejar el archivo y añadir
su entrada al arreglo `gallery` de `Community.jsx` — la tira crece a lo ancho, no
a lo largo, así que no hay que rediseñar nada.

## Explora más allá del salón

Tira cuadrada dentro del bloque de la derecha. Van **sin pie**, a propósito (ver
`DESIGN.md` → *Comunidad*).

| # | Archivo | Estado |
| --- | --- | --- |
| 1 | `explora-poli-hacks.webp` | ✅ 620×620, 40 KB. Estudiantes de **esta** facultad con su trofeo de PoliHacks, en sede de UPIITA |
| 2 | `explora-hackathon.webp` | ✅ 900×900, 74 KB. **No es de la UAEMéx** — estudiantes de UPIITA-IPN en el hackathon U-HACKS. Mientras siga aquí, el copy alrededor no puede presentarla como gente de esta facultad |
| 3 | `explora-taller.webp` | pendiente |

Formato **WebP**, cuadradas, **900×900** — salvo `explora-poli-hacks.webp`, que
sale a 620 porque ése es el lado de su original y ampliarlo no añadiría detalle
(la tarjeta se dibuja a 224px). El recorte cuadrado se hace en el archivo y no
en CSS.

**Las dos primeras son de sede UPIITA y sólo la primera es nuestra.** Que la
tira vaya sin pies es lo que permite que convivan sin afirmar nada sobre
ninguna. La 1 encabeza por ser la propia.

**Condición de retiro ya cumplida, pendiente de ejecutar:** el comentario del
bloque fijaba que la foto ajena se sustituyera "cuando exista una foto de la
rama de la facultad". Ya existe — es la 1. Quitar la 2 es borrar una línea.

## Miniaturas de canal

**No viven aquí: son las fotos de `../areas/*.webp`,** las mismas que usa la
rejilla de Inicio, tomadas de `src/data/areas.js` a través del campo `image` de
`AREAS`. No hay que subir nada.

Hubo cinco archivos `canal-<id>.jpg` planeados y ninguno llegó a existir, así que
las cinco filas de la lista se veían con el recuadro punteado de "pendiente" —
cinco avisos de que falta algo, para algo que ya estaba en el repositorio.

Se reutilizan **por la misma razón por la que las dos páginas ya comparten
`AREAS`: una sola fuente.** Un segundo juego de archivos con la misma fotografía
se desincroniza en el primer reemplazo, y el canal de Ciberseguridad acabaría
ilustrado con una foto distinta a la del área de Ciberseguridad sin que nadie se
entere.

**Que sean ilustraciones genéricas está bien aquí y no en la galería.** El
trabajo de la miniatura es reconocer un canal dentro de una lista; el de la
galería es probar que la comunidad existe. Una foto de banco sirve para lo
primero y destruye lo segundo.

## Logotipos de los capítulos IEEE

`ieee-computer-society.webp`, `ieee-robotics-automation.webp`,
`ieee-power-energy.webp`, `ieee-women-in-engineering.webp`. Derivados sin
modificar de `assets-src/logotipos-ieee/`. Van sobre recuadro `Papel` puro porque
el manual de cada sociedad pide fondo neutro y ninguno se puede repintar.

## Personas reconocibles: con su consentimiento

Son fotos de estudiantes reales, no recortes de banco. Antes de publicar una foto
donde se reconozca a alguien, confirma que está de acuerdo en aparecer en el
sitio.

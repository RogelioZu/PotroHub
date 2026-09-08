---
name: PotroPath
description: El vitral de la Facultad de Ingeniería en los bordes, papel silencioso en el centro.
colors:
  verde-universitario: "#526855"
  oro-viejo: "#ca9e52"
  verde-profundo: "#384033"
  ambar-quemado: "#a15c17"
  papel: "#ffffff"
  papel-gris: "#f2f2f2"
  verde-bruma: "#e8ece7"
  oro-claro: "#e3c48a"
  tinta: "#252525"
  tinta-suave: "#5c5c5c"
typography:
  brand:
    fontFamily: "DM Sans, Inter, system-ui, sans-serif"
    fontSize: "1.875rem"
    fontWeight: 700
    lineHeight: "2.25rem"
    letterSpacing: "normal"
  display:
    fontFamily: "DM Sans, Inter, system-ui, sans-serif"
    fontSize: "2.25rem"
    fontWeight: 700
    lineHeight: "1.25"
    letterSpacing: "normal"
  headline:
    fontFamily: "DM Sans, Inter, system-ui, sans-serif"
    fontSize: "1.5rem"
    fontWeight: 700
    lineHeight: "2rem"
    letterSpacing: "normal"
  title:
    fontFamily: "DM Sans, Inter, system-ui, sans-serif"
    fontSize: "1.125rem"
    fontWeight: 700
    lineHeight: "1.75rem"
    letterSpacing: "normal"
  lead:
    fontFamily: "DM Sans, Inter, system-ui, sans-serif"
    fontSize: "1.125rem"
    fontWeight: 400
    lineHeight: "1.75rem"
    letterSpacing: "normal"
  body:
    fontFamily: "DM Sans, Inter, system-ui, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: "1.5rem"
    letterSpacing: "normal"
  label:
    fontFamily: "DM Sans, Inter, system-ui, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 600
    lineHeight: "1.25rem"
    letterSpacing: "0.1em"
rounded:
  sm: "6px"
  md: "12px"
  full: "9999px"
spacing:
  gutter: "24px"
  card: "20px"
  gap: "24px"
  section-y: "64px"
  section-y-md: "96px"
components:
  button-green:
    backgroundColor: "{colors.verde-universitario}"
    textColor: "{colors.papel}"
    rounded: "{rounded.full}"
    padding: "12px 24px"
  button-green-hover:
    backgroundColor: "{colors.verde-profundo}"
    textColor: "{colors.papel}"
    rounded: "{rounded.full}"
    padding: "12px 24px"
  button-outline:
    backgroundColor: "transparent"
    textColor: "{colors.tinta-suave}"
    rounded: "{rounded.full}"
    padding: "12px 24px"
  button-outline-hover:
    backgroundColor: "transparent"
    textColor: "{colors.verde-universitario}"
    rounded: "{rounded.full}"
    padding: "12px 24px"
  button-green-deep:
    backgroundColor: "{colors.verde-profundo}"
    textColor: "{colors.papel}"
    rounded: "{rounded.full}"
    padding: "8px 24px"
  button-disabled:
    backgroundColor: "{colors.papel-gris}"
    textColor: "{colors.tinta-suave}"
    rounded: "{rounded.full}"
    padding: "12px 24px"
  quiz-option:
    backgroundColor: "transparent"
    textColor: "{colors.tinta-suave}"
    rounded: "{rounded.md}"
    padding: "12px 16px"
  quiz-option-selected:
    backgroundColor: "{colors.verde-bruma}"
    textColor: "{colors.tinta}"
    rounded: "{rounded.md}"
    padding: "12px 16px"
  card:
    backgroundColor: "{colors.papel-gris}"
    textColor: "{colors.tinta-suave}"
    rounded: "{rounded.md}"
    padding: "20px"
  card-note:
    backgroundColor: "{colors.verde-bruma}"
    textColor: "{colors.tinta-suave}"
    rounded: "{rounded.md}"
    padding: "24px"
  badge-overlay:
    backgroundColor: "rgb(37 37 37 / 70%)"
    textColor: "{colors.papel}"
    rounded: "{rounded.sm}"
    padding: "6px 12px"
---

# Design System: PotroPath

<!-- Los encabezados de sección se mantienen en inglés porque son las anclas
     canónicas del formato DESIGN.md y de las herramientas que lo leen. El
     contenido es español. -->

## Overview

**Creative North Star: "El vitral y el papel"**

El sistema está hecho de dos materiales en oposición deliberada. En los bordes de cada página —el
header y el footer— está la fotografía real del vitral de la biblioteca de la Facultad de
Ingeniería, a todo color y sin filtro que la apague; la marca y la navegación flotan encima, y lo
que las hace legibles no es un velo sobre la imagen sino una sombra de texto sobre las letras
(`0 1px 6px rgb(0 0 0 / 75%)`). Entre esas dos bandas, la página es papel: blanco, silencioso,
generoso, casi enteramente tipográfico.

Esa oposición no es decorativa, es estructural, y explica todo lo demás. El vitral puede permitirse
ser intenso justamente porque aparece solo dos veces y siempre en el mismo lugar. El centro puede
permitirse ser sobrio porque no tiene que competir por atención: ya la ganó el borde. Cuando una
página necesita color en el cuerpo —las cinco áreas en Inicio, las barras de afinidad en
resultados— lo toma en dosis pequeñas y siempre sobre papel, nunca cubriendo la superficie.

El único lugar donde el vitral entra al cuerpo de la página es su propio espacio dedicado: la
tarjeta panorámica de Inicio (`VitralShowcase`), con la mascota de la universidad asomada en la
esquina. Es la excepción que confirma la regla, y por eso es el objeto con más peso visual de todo
el sitio.

**Key Characteristics:**

- Vitral fotográfico solo en header y footer; papel en todo lo demás.
- Paleta cerrada de cinco colores oficiales más sus tintes derivados.
- Profundidad por tono, no por sombra: `papel` → `papel-gris` → `verde-bruma`.
- Tipografía única (DM Sans) haciendo toda la jerarquía por tamaño y peso.
- Movimiento como sistema, no como efecto: cuatro duraciones, cinco curvas, un solo rebote.
- Todo revelado se construye con `gsap.from`, así que sin JavaScript la página se ve completa.

## Colors

Una paleta terrosa e institucional: verdes desaturados de piedra y oros apagados de vidrio viejo,
sin un solo color puro ni saturado en todo el sistema.

### Primary

- **Verde Universitario** (`#526855`): el verde de trabajo. Todas las acciones (`btn-green`,
  `btn-outline`), el progreso del cuestionario, las cinco barras de afinidad, el estado seleccionado
  de una opción, los títulos de tarjeta y los enlaces de recuperación. Es el color que hace cosas, y
  es el único que las hace.
- **Oro Viejo** (`#ca9e52`): la firma. Las líneas del separador de sección, el subrayado que viaja
  en el nav, el borde superior del footer. Es el color con el que la marca firma, no con el que
  opera. Nunca se usa como color de texto sobre papel: sobre blanco da **2.46:1**, por debajo del
  mínimo de 3:1 incluso para texto grande. Ahí manda `Ámbar Quemado`.

### Secondary

- **Verde Profundo** (`#384033`): el fondo del acento `vitral-accent`, el estado hover de las
  acciones verdes y los títulos que necesitan más peso que el verde principal.
- **Ámbar Quemado** (`#a15c17`): el oro cuando necesita contraste sobre papel. Es *todo* el oro que
  aparece como texto: los *eyebrows*, el texto del separador de sección, las etiquetas de estado
  ("Próximamente", el área de la pregunta actual) y la palabra que el titular pone en oro —"ruta" en
  Inicio, el nombre del área ganadora en resultados—. Da **5.17:1** sobre papel, así que pasa incluso
  el umbral estricto de texto normal; `Oro Viejo` da 2.46:1 y no pasa ninguno.

### Neutral

- **Papel** (`#ffffff`): la superficie base de todo el cuerpo de la página.
- **Papel Gris** (`#f2f2f2`): la segunda capa. Secciones alternas, tarjetas de contenido, la pista
  vacía de las barras. Es el principal recurso de separación del sistema.
- **Verde Bruma** (`#e8ece7`): la tercera capa, teñida. Bloques que deben leerse como nota o aparte
  (privacidad y moderación en Comunidad), y el relleno de una opción seleccionada en el
  cuestionario.
- **Oro Claro** (`#e3c48a`): oro sobre fondo oscuro. Existe únicamente para el vitral: la mitad
  "Path" de la marca, los enlaces activos del nav, las etiquetas del footer.
- **Tinta** (`#252525`): texto principal y los velos translúcidos sobre fotografía
  (`rgb(37 37 37 / 70%)`).
- **Tinta Suave** (`#5c5c5c`): texto secundario, descripciones, cuerpo de tarjeta.

### Named Rules

**La regla de la Paleta Cerrada.** Los cinco colores del manual de identidad de la UAEMéx son la
paleta completa. Los cinco neutrales derivados (`Papel`, `Papel Gris`, `Verde Bruma`, `Oro Claro`,
`Tinta`, `Tinta Suave`) existen solo como tintes y textos derivados de esos cinco. Nunca se
introduce un color suelto: si hace falta un matiz nuevo, se deriva, no se inventa.

**La regla del Oro que Firma.** El oro firma; el verde trabaja. El oro marca dónde habla la marca
—titular, separadores, nav, footer— y el verde se queda con el trabajo funcional: acciones,
progreso y estado. Prueba de auditoría: si un elemento dorado responde a un clic o representa un
dato, está mal pintado.

El código cumple esta regla. Al aplicarla se eliminó `.btn-gold` —no le quedaba un uso permitido—
y `.btn-outline` pasó de borde dorado a borde verde. Las barras de afinidad pasaron de `bg-gold` a
`bg-green-mid`, lo que además corrigió un fallo de contraste real: oro sobre la pista `Papel Gris`
daba **2.20:1**, por debajo del mínimo no textual de 3:1; en verde da **5.41:1**.

El oro que permanece está todo del lado de la firma: la palabra en oro del titular, las líneas y el
texto del separador, los *eyebrows*, el borde superior del footer, y la marca, el subrayado y los
enlaces activos de la navegación. Sobre el vitral el oro además no es sustituible: el verde es
ilegible contra la fotografía a todo color.

**El nombre del área en Resultados se queda en oro, y eso es coherente con esta regla.** El oro
firma el titular, y el `.h1` es territorio de firma: ahí el oro dice "esto es lo que la marca te
está diciendo", no "esto es un dato". Lo que nunca puede ser dorado es la *representación* del
dato —las barras de afinidad y los porcentajes— que ya son verdes. No es una excepción silenciosa a
la regla: es exactamente el reparto que la regla describe.

## Typography

**Display Font:** DM Sans (con Inter, system-ui, sans-serif como respaldo)
**Body Font:** DM Sans — la misma familia
**Label/Mono Font:** ninguna; el sistema no usa monoespaciada

**Character:** una sola geométrica humanista cargando toda la jerarquía. No hay contraste de
familias, así que el peso lo hacen exclusivamente el tamaño y el grosor — lo que obliga a que la
escala sea decidida y a que los saltos entre niveles sean grandes y evidentes. Se cargan cuatro
grosores (400, 500, 600, 700) más una itálica de 400.

### Hierarchy

- **Brand** (700, 1.875rem / 3rem en `md`): la palabra PotroPath en el header, partida en dos
  colores. Es el único texto del sitio que crece más que el titular de página.
- **Display** (700, 2.25rem / 3rem en `md`, interlínea 1.25): la clase `.h1`. El titular de página
  —hero, resultado, portada de sección—; el momento de mayor peso visual.
- **Headline** (700, 1.5rem): la clase `.h2`. Encabezado de sección dentro de una página, casi
  siempre acompañado por el separador dorado.
- **Title** (700, 1.125rem): la clase `.h3`. Título de tarjeta o bloque. El color lo decide quien la
  usa, no la clase.
- **Lead** (400, 1.125rem, en `Tinta Suave`): la clase `.lead`. El párrafo de entrada bajo un `.h1`,
  un escalón arriba del cuerpo. Ancho de lectura acotado a `max-w-2xl` (42rem).
- **Body** (400, 1rem): texto corrido y contenido de tarjeta, casi siempre en `Tinta Suave`.
- **Label** (600, 0.875rem, `tracking: 0.1em`, mayúsculas, en `Ámbar Quemado`): la clase `.eyebrow`.
  Etiqueta de contexto sobre un titular.

### Named Rules

**La regla del Tamaño Decidido.** `.h1`, `.h2`, `.h3`, `.lead` y `.eyebrow` son el único lugar donde
se decide qué tan grande es un encabezado. Una página nunca fija un tamaño suelto encima de esas
clases. Antes de que existieran, cada página elegía su propio tamaño a mano y el sitio se sentía
plano; volver a hacerlo lo aplana otra vez.

**La regla de la Sombra sobre Vidrio.** Todo texto que cae sobre la fotografía del vitral lleva
`text-shadow`, nunca un velo sobre la imagen. El vitral se ve completo y a todo color; el que se
defiende es el texto. La marca usa `0 2px 10px rgb(0 0 0 / 70%)`; el resto, `0 1px 6px
rgb(0 0 0 / 75%)`.

## Layout

Dos anchos y nada más. **`max-w-6xl` (72rem)** es el ancho de composición: hero, rejillas de áreas,
columnas del footer, la barra del nav. **`max-w-2xl` (42rem)** es el ancho de lectura y de tarea:
el cuestionario completo, la vista de resultados, los estados vacíos y todo párrafo de entrada. El
canalón lateral es siempre `24px` (`px-6`), en todos los anchos de pantalla.

El ritmo vertical de una sección de página completa es `64px`, que crece a `96px` desde `md`
(la clase `.section-py`). Los estados vacíos y el 404 se salen de esa regla a propósito y usan
`96px` fijos: son pantallas con poco contenido y necesitan más aire, no menos. Además se centran
verticalmente en el alto disponible (`flex-1` con `justify-center`), así que esos `96px` funcionan
como aire mínimo cuando la ventana es baja y no como todo el aire. Sin centrar, tres líneas de
contenido quedaban pegadas al tercio superior con media pantalla vacía debajo, y esas dos vistas se
leían como pantallas sin terminar.

Las rejillas colapsan en un patrón consistente: `sm:grid-cols-2` y luego `lg:grid-cols-4` o
`lg:grid-cols-5` según cuántos elementos haya. El hero es de dos columnas desde `md`, con la
tarjeta del vitral a la derecha. La navegación cambia de barra horizontal a menú desplegable en
`lg` —no en `md`— porque la etiqueta "Comunidad Facultad de Ingeniería" es larga y rompe antes que
el resto.

El layout es una columna flexible de alto `min-h-svh` con el footer empujado al fondo, envuelta en
`ScrollSmoother`. La unidad es `svh` y no `vh` a propósito: la barra de direcciones móvil cambia de
alto al hacer scroll. `main` y el contenedor de transición de ruta son a su vez columnas flexibles:
es lo que permite que una vista corta pida el alto disponible y se centre en él. Una vista larga no
crece y queda exactamente igual.

### Named Rules

**La regla de los Dos Anchos.** Si el visitante está componiendo una mirada, `max-w-6xl`. Si está
leyendo o completando una tarea, `max-w-2xl`. No hay un tercer ancho, y una página no mezcla los dos
para el mismo tipo de contenido.

## Elevation & Depth

El sistema es esencialmente plano y separa por tono, no por sombra. Las tres capas del papel
—`Papel` → `Papel Gris` → `Verde Bruma`— hacen prácticamente todo el trabajo de profundidad, apoyadas
por bordes hairline muy tenues (`border-ink/5`, `ring-ink/5`) cuando dos superficies del mismo tono
se tocan.

Las sombras existen, pero están reservadas. Los dos objetos fotográficos —la tarjeta del vitral y la
insignia del potro— son lo único que de verdad se levanta del papel, y lo hacen con `shadow-lg` de
tinta muy diluida. Las tarjetas de área en Inicio llevan un `shadow-sm shadow-ink/5` que apenas se
percibe y funciona más como un borde suave que como una elevación.

### Shadow Vocabulary

- **Levantado fotográfico** (`box-shadow: 0 10px 15px -3px rgb(37 37 37 / 10%), 0 4px 6px -4px rgb(37 37 37 / 10%)`):
  exclusivo de la tarjeta del vitral y de la insignia del potro.
- **Asiento de tarjeta** (`box-shadow: 0 1px 3px 0 rgb(37 37 37 / 5%), 0 1px 2px -1px rgb(37 37 37 / 5%)`):
  tarjetas sobre papel blanco, para despegarlas apenas del fondo.
- **Sombra de texto sobre vidrio** (`text-shadow: 0 1px 6px rgb(0 0 0 / 75%)`): no es elevación, es
  legibilidad. Ver *La regla de la Sombra sobre Vidrio*.

### Named Rules

**La regla de la Sombra Fotográfica.** La sombra es privilegio de la fotografía. Solo el vitral y la
mascota se levantan del papel; todo lo demás se separa por tono. Un componente nuevo que pida sombra
para distinguirse está pidiendo, en realidad, la capa tonal que le falta.

## Shapes

Dos radios y una regla clara sobre cuál va dónde. **`9999px` (`rounded-full`)** para todo lo que se
presiona o representa avance: botones, la barra de progreso, las barras de afinidad, el subrayado
del nav, las líneas del menú hamburguesa. **`12px` (`rounded-xl`)** para todo lo que contiene:
tarjetas, la tarjeta del vitral, la insignia del potro, las opciones del cuestionario. **`6px`
(`rounded-md`)** aparece solo en las etiquetas superpuestas sobre fotografía, donde una píldora
competiría con la forma de la imagen.

Los bordes son hairline y casi siempre translúcidos (`border-ink/10`, `border-gold/50`,
`border-paper/15`), de modo que el borde toma el tono de lo que tiene detrás en vez de imponer una
línea gris. La única excepción es el borde superior del footer: `border-t-2 border-gold`, sólido y
al doble de grosor, porque marca el punto donde el papel termina y vuelve el vitral.

Los espacios reservados de futuro contenido usan borde punteado (`border-dashed border-ink/15`), que
es la forma que el sistema tiene de decir "esto todavía no existe" sin fingir que existe.

### Named Rules

**La regla de la Píldora y la Tarjeta.** Redondo completo es para lo que se presiona o avanza;
`12px` es para lo que contiene. Una tarjeta nunca es una píldora y un botón nunca es una tarjeta.

## Components

### Buttons

- **Shape:** píldora completa (`9999px`), relleno `12px 24px`, peso semibold, sin borde salvo en la
  variante fantasma.
- **Verde** (`btn-green`): fondo `Verde Universitario`, texto `Papel`; en hover, `Verde Profundo`.
  Es *el* botón de acción del sistema: no hay una variante dorada, y no debe crearse
  (ver *La regla del Oro que Firma*).
- **Fantasma** (`btn-outline`): sin fondo, borde `border-green-mid/40`, texto `Tinta Suave`. En hover
  el borde se satura y el texto pasa a `Verde Universitario`. Reservado a la acción secundaria de
  una pareja: "Conoce la comunidad" en Inicio, "Repetir diagnóstico" en resultados.
- **Final de tarea** (`bg-green`): el botón "Ver resultados" del cuestionario usa el verde profundo
  en vez del principal, para seguir distinguiéndose de "Siguiente" —que aparece cuarenta y nueve
  veces antes— sin recurrir al oro.
- **Deshabilitado** (`btn-disabled`): fondo `Papel Gris`, texto `Tinta Suave` al 60%, cursor
  `not-allowed`. Se usa cuando una acción existirá pero todavía no ("Enlace de invitación
  próximamente") — mantiene la promesa visible sin fingir que ya funciona.
- **Transiciones:** solo de color (`transition-colors`). Ningún botón se mueve, escala ni se levanta
  al pasar el cursor.

Los controles del cuestionario quedan deliberadamente fuera de este sistema: aparecen cincuenta
veces por sesión y usan un tamaño compacto (`text-sm`, relleno menor) porque un CTA de decisión y un
control de repetición no son el mismo objeto.

**Confirmación en el propio control.** La única acción destructiva del sitio —"Repetir
diagnóstico", que borra las cincuenta respuestas— confirma sobre sí misma y no en un modal: el
primer toque cambia la etiqueta a "¿Seguro? Se borran tus 50 respuestas" y el segundo ejecuta. El
control armado toma el estado hover del fantasma —borde y texto `Verde Universitario` sólidos,
**6.05:1** sobre papel— así que el cambio se ve además de leerse, sin añadir un color al sistema.
Se desarma solo a los seis segundos, al perder el foco o al tocar fuera, y lleva `aria-live="polite"`
para que el cambio de etiqueta se anuncie. En teléfono ese botón queda a `16px` de "Unirme a la
comunidad": un pulgar mal puesto costaba ocho minutos de trabajo sin ninguna advertencia.

### Cards / Containers

- **Corner Style:** `12px` (`rounded-xl`).
- **Background:** `Papel Gris` para tarjeta de contenido; `Verde Bruma` para bloques de nota o
  aparte; `Papel` con `shadow-sm` cuando la tarjeta vive sobre una sección ya gris.
- **Shadow Strategy:** ninguna por defecto. Ver *La regla de la Sombra Fotográfica*.
- **Border:** ninguno, salvo los espacios reservados, que usan `border-dashed border-ink/15`.
- **Internal Padding:** `20px` (`p-5`) en tarjeta; `24px` (`p-6`) en bloque de nota.
- **Título:** `.h3` en `Verde Universitario`; cuerpo en `text-sm` `Tinta Suave`.

### Quiz Option

El control más repetido del sitio y el único con estado propio. Rectángulo de `12px` con borde
hairline y sin relleno en reposo; al seleccionarse, el borde pasa a `Verde Universitario`, el texto a
`Tinta`, y un relleno `Verde Bruma` barre de izquierda a derecha desde `scaleX(0)` bajo el texto. El
borde y el relleno son ahora del mismo color base, cosa que antes no ocurría. El relleno
es un `span` absoluto con `aria-hidden`, y el texto vive en un hermano `relative` para quedar
siempre por encima.

### Navigation

- **Escritorio (`lg` en adelante):** lista horizontal sobre el vitral, `gap-8`, semibold, con
  `text-shadow`. El enlace activo es `Oro Claro`; los demás, `Papel`, y pasan a `Oro Claro` en hover.
- **Indicador:** una sola barra dorada de `2px` que *viaja* hasta el enlace activo con `transform`,
  en lugar de dos bordes que se encienden y se apagan. La primera colocación es instantánea: el
  subrayado no "llega" a la página, ya estaba ahí. En móvil no existe — una lista vertical no tiene
  a dónde viajar.
- **Móvil (bajo `lg`):** hamburguesa de tres barras que se cierran en X, y un panel que se abre
  animando `grid-template-rows` de `0fr` a `1fr` — no `max-height`, para no tener que adivinar una
  altura de destino.
- **Marca:** "Potro" en `Papel` y "Path" en `Oro Claro`, siempre partida así, en header y footer.

### Progress & Affinity Bars

Pista de `Papel Gris` completamente redondeada; relleno `Verde Universitario` que crece con `scaleX`
desde `origin-left`, nunca con `width` — la anchura dispara *layout* en cada avance. El progreso del
cuestionario y las barras de afinidad comparten color: las dos son dato, no firma. La barra del cuestionario mide `6px`
de alto (`h-1.5`) y las de resultados `8px` (`h-2`). En resultados, cada barra cuenta su porcentaje
en sincronía con el llenado.

### VitralShowcase (componente insignia)

La tarjeta panorámica de Inicio y el objeto de mayor peso visual del sitio. Relación de aspecto
`21/9` —no `16/9`— porque la fotografía real del vitral es un panorámico de unos `8.9:1`. Lleva la
etiqueta superpuesta sobre la imagen en un velo `Tinta` al 70% (el mismo patrón de tarjeta
fotográfica de uaemex.mx) y la mascota asomada sobre la esquina inferior derecha, en una insignia de
papel con relleno de `6px`.

Se descubre con una máscara `clip-path` que barre de izquierda a derecha mientras la imagen se
asienta desde `scale: 1.06`; el potro aterriza al final con el único rebote del sistema y luego
queda flotando en un bucle suave de ±5px que se pausa cuando sale del viewport. Si la imagen falta,
cae al acento decorativo `vitral-accent` en vez de romper el layout.

### La insignia del potro en Resultados

El segundo y último lugar donde aparece la mascota, con el mismo tratamiento de insignia de papel
(`rounded-xl`, relleno de `6px`, `shadow-lg`, anillo `ring-ink/10`) y la misma escala
`h-24 / sm:h-28 / md:h-32`. Aterriza al final de la secuencia de resultados con el único rebote y
se queda en el mismo bucle de ±5px, pausado fuera del viewport.

Comparte fila con el titular en vez de flotar en `absolute` sobre él: en columna se apoya arriba a
la derecha y el titular conserva el ancho completo; desde `md` pasa a la derecha de una fila y el
texto ocupa el resto. Superpuesto, el nombre de área más largo —"Desarrollo de Software"— se metía
debajo de la insignia en escritorio, y en teléfono el elemento estaba oculto, que es justo donde
esta pantalla es el pago de las cincuenta preguntas. Reservar la columna resuelve las dos cosas sin
depender de un padding adivinado.

### Tarjeta de vista previa (Open Graph)

`public/images/og-potropath.png`, 1200×630, compuesta con el mismo mundo y no con una plantilla:
franja del vitral a todo color en el borde superior —el sitio que ocupa en el header—, cerrada con
el filete `border-t-2 border-gold` que en el sitio marca el paso del papel al vitral, y papel
silencioso en el resto con la marca, el titular de Inicio y una sola línea de contexto.

Es el único lugar donde la marca cae sobre papel, y por eso cambia de reparto: sobre el vitral es
`Papel` + `Oro Claro`, y aquí es `Tinta` + `Ámbar Quemado`, que es el oro que el sistema permite
como texto sobre blanco (**5.17:1**; `Oro Claro` sobre papel sería ilegible). La palabra en oro del
titular es la misma "ruta" de Inicio. Sin texto sobre la fotografía: la franja se queda muda, que
es lo que evita repetir en una miniatura de WhatsApp el problema de legibilidad que el oro tiene
sobre el vidrio.

### Motion

Cuatro duraciones y cinco curvas, en `src/lib/motion.js`, elegidas por consecuencia y no por gusto:
`feedback` 0.15s (acuse inmediato), `state` 0.28s (cambio rutinario), `view` 0.45s (cambio de vista
o revelado) y `focal` 0.7s (entrada con autoría, solo hero y resultados). Las entradas usan
`expo.out`; las salidas, `power2.in`, y son más rápidas que las entradas. La quinta curva,
`power2.inOut`, es simétrica y existe para el único movimiento que va y vuelve: el pulso de brillo
de la barra de progreso al cruzar un hito del cuestionario.

Los escalonados se declaran siempre con `amount` y nunca con `each`, de modo que el retardo total
queda acotado sin importar cuántos elementos tenga la lista.

El scroll suave (`ScrollSmoother`) solo existe en escritorio con puntero fino y sin preferencia de
movimiento reducido, y en `/quiz` se lleva a cero en vez de pausarse: pausarlo bloquea el scroll por
completo, y el cuestionario es una tarea, no una lectura.

### Named Rules

**La regla del `from`.** Todo revelado se construye con `gsap.from`, nunca con `gsap.to` desde un
estado oculto en el HTML. El estado por defecto del marcado es visible: si el JavaScript falla o
tarda, la página se ve completa en lugar de quedarse en blanco.

**La regla del Único Rebote.** `back.out(1.6)` está reservado al potro. Es el único rebote del
sistema, y lo es porque ahí la personalidad es justamente el objetivo. Cualquier otro elemento que
rebote le roba ese momento.

**La regla del Movimiento Opcional.** Toda animación se declara dentro de `gsap.matchMedia()` con
`(prefers-reduced-motion: no-preference)`, o comprueba `prefersReducedMotion()` en las ramas
imperativas. No hay una sola animación sin esa condición.

## Do's and Don'ts

### Do:

- **Do** dejar que el vitral aparezca a todo color y sin velo en header y footer, y defender el
  texto con `text-shadow` en vez de apagar la imagen.
- **Do** separar superficies con las tres capas tonales (`Papel` → `Papel Gris` → `Verde Bruma`)
  antes de considerar una sombra.
- **Do** usar `.h1`, `.h2`, `.h3`, `.lead` y `.eyebrow` para toda jerarquía tipográfica, y dejar que
  esas clases sean el único lugar donde se decide un tamaño.
- **Do** elegir entre los dos anchos: `max-w-6xl` para componer, `max-w-2xl` para leer o completar
  una tarea.
- **Do** animar avance con `scaleX` desde `origin-left`, nunca con `width`.
- **Do** construir los revelados con `gsap.from`, para que el HTML por defecto sea el estado visible.
- **Do** declarar toda animación dentro de `matchMedia('(prefers-reduced-motion: no-preference)')`.
- **Do** marcar el contenido que todavía no existe con borde punteado o un control deshabilitado que
  nombre lo que vendrá.
- **Do** confirmar una acción destructiva en el propio control, en dos pasos, y dejar que se desarme
  sola por tiempo, por foco o por un toque fuera.

### Don't:

- **Don't** introducir un color fuera de los cinco oficiales y sus tintes derivados. Si falta un
  matiz, se deriva de la paleta; no se inventa.
- **Don't** pintar de oro algo que responde a un clic o representa un dato. El oro firma; el verde
  trabaja.
- **Don't** pintar texto con un degradado. El énfasis lo hacen el peso, el tamaño y un color plano
  de la paleta. La palabra dorada del titular es `Ámbar Quemado` sólido, y entra con el mismo
  escalonado que el resto de su titular, sin tratamiento propio.
- **Don't** poner sombra a un componente para distinguirlo. Lo que le falta es capa tonal.
- **Don't** hacer que un botón se levante, escale o se mueva en hover. Las transiciones de los
  botones son solo de color.
- **Don't** abrir un modal para una tarea que no necesita foco protegido ni interrumpir nada. El
  sitio no tiene ninguno, y una confirmación de un solo control no es motivo para el primero.
- **Don't** darle rebote a nada que no sea el potro.
- **Don't** repetir el revelado de entrada en cada sección: `Reveal` es para listas que aparecen
  *como* listas. Usarlo en todas partes convierte el movimiento en ruido.
- **Don't** convertir el diagnóstico en un test de personalidad juguetón: nada de confeti, emoji,
  insignias gamificadas ni colores brillantes. El resultado es una decisión profesional.
- **Don't** derivar hacia el dashboard SaaS genérico: nada de degradados azul/morado, glassmorphism
  ni iconografía de stock. Disuelve la especificidad institucional que es toda la ventaja.
- **Don't** adoptar el lenguaje de una landing de bootcamp: sin urgencia, sin contadores, sin
  carruseles de testimonios. Además exigiría evidencia social que no existe.

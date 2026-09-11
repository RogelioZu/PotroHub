# Originales

Masters sin comprimir de los activos institucionales. **No se sirven**: viven
fuera de `public/`, así que Vite no los copia al build. Lo que la aplicación
consume está en `public/images/`.

- `vitral-biblioteca.png` — 2736x308, 1.8 MB. Fotografía real del vitral de la
  biblioteca de la Facultad de Ingeniería (UAEMéx).
- `potro-mascota.png` — 413x688, 329 KB. Mascota de la universidad, recortada
  de su fondo gris original. Está en RGB: el alfa se recuperó al derivar
  `public/images/potro-mascota.webp`.

`ieee_assets/` son los logotipos oficiales de los cuatro capítulos de la Rama
IEEE, descargados de la marca de cada sociedad y **sin modificar**:

- `IEEE-CS_LogoTM-orange copy.png` — 780x240. Computer Society, variante de
  texto negro. La de texto blanco existe y **no sirve aquí**: el panel de
  marcas de Comunidad es papel, y sobre blanco desaparecen la diagonal y las
  tres líneas del wordmark y queda el bug naranja suelto.
- `IEEE_RAS_logo_4C_stacked copy.png` — 638x235. Robotics and Automation
  Society, versión apilada a cuatro tintas.
- `IEEE PES Logo RGB copy.png` — 268x187. Power & Energy Society. Es el
  original más chico de los cuatro; alcanza para el recuadro a `2x` y no
  conviene escalarlo hacia arriba.
- `logo WIE Purple with line_600_RGB_Color copy.png` — 1523x1536. Women in
  Engineering, morado `#742780` sobre transparente.

Los cuatro logotipos vienen recortados al contenido: su caja alfa es la imagen
completa, sin márgenes que quitar, así que el alto en CSS mapea directo al
tamaño óptico.

`ieee_talent.jpeg` — 1600x1200. **Estudiantes de la Facultad de Ingeniería de la
UAEMéx** en Talent Land México 2026 (Expo Santa Fe, Ciudad de México, 7–9 de
abril de 2026). Es la fotografía del hero de Comunidad y la primera de su
galería, y es de las pocas piezas de evidencia real que tiene el proyecto: la
página lleva su pie con quién, dónde y cuándo justamente por eso. De ella salen
tres derivados:

- `public/images/comunidad/quienes-somos.webp` — 1216x780,
  `-crop 1216x780+160+400`, calidad 84. El encuadre apaisado del hero.
- `public/images/comunidad/quienes-somos-movil.webp` — 512x750,
  `-crop 512x750+512+450`, calidad 82. El encuadre vertical del hero.

  **Los dos están centrados en `x = 768`**, que es el centro real del grupo
  (ocupa `x 195..1340`). El recorte existe para quitar lo que descuadraba la
  foto —el zaguán de la entrada a la izquierda, `x 0..190`, y dos personas de
  paso a la derecha, `x 1350..1600`— no para reencuadrar al grupo, que ya estaba
  a 32px del centro. Ver `public/images/comunidad/README.md`.
- `public/images/comunidad/galeria-talent-land.webp` — 800x600, la tarjeta de la
  galería.

**Es el original más chico de lo que le pedimos, y eso fija un techo aguas
abajo.** La zona limpia da 1216px de ancho, así que el hero se acota a 1344px
(1216 × 1.10) para no estirarlo más de lo que aguanta; sin ese tope, una pantalla
de 1920 lo estiraría 1.47x. Si aparece una versión de mayor resolución conviene
sustituirla **y subir el tope con ella** — está en `DESIGN.md` → *Comunidad*.

`ieee_img2.jpeg` — 1200x1600. Estudiantes de UPIITA-IPN con reconocimientos
del hackathon U-HACKS. Es la que consume el bloque *Explora más allá del salón*
de Comunidad, recortada a cuadrado desde abajo al derivarla. **No es de la
UAEMéx**: mientras siga en el sitio, el copy a su alrededor no puede
presentarla como gente de esta facultad.

## `community_assets/` — fotografías de la comunidad

Fotografías reales de estudiantes de **esta** facultad, que es lo que las hace
utilizables en `/comunidad`. Sus derivados viven en
`public/images/comunidad/galeria-*.webp`.

`community_assets/ieee_img.jpg` — 760x570, ya en `4:3` exacto. Estudiantes de la
facultad **durante una visita a la Rama Estudiantil IEEE de la UAM Lerma**; el
telón de fondo con la marca de UAM Lerma es del anfitrión. Derivado:
`galeria-visita-uam-lerma.webp`, sin reescalar (760 alcanza de sobra para una
tarjeta de 288px a 2x).

> **Corrección.** Este archivo estuvo descrito aquí como "estudiantes de la Rama
> Estudiantil IEEE de la UAM Lerma" y marcado "sin usar". Era un error de hecho,
> no de redacción: decía que la gente de la foto era de otra universidad cuando
> son de ésta, de visita. Con la descripción vieja la foto quedaba inutilizable
> —`PRODUCT.md` → *Evidence on Hand* prohíbe presentar como propia a gente
> ajena— y por eso se quedó fuera del sitio. Su pie en la galería dice
> "Visita a la Rama IEEE UAM Lerma", en ese orden: separa "fuimos" de
> atribuirnos una rama que no es nuestra.

`community_assets/wie1.jpeg` — 1600x785. Integrantes del **capítulo Women in
Engineering de esta facultad** con un reconocimiento. Derivado:
`galeria-wie.webp`, recortado a `4:3` centrado (`-crop 1047x785+276+0`) porque
el original es un panorámico de 2.04:1 y la galería es 4:3; el recorte conserva
a quien sostiene el reconocimiento y a unas trece personas.

## Copias de archivo de `public/images/`

Estos cinco **no se movieron, se copiaron**: sus originales siguen sirviéndose
desde `public/images/` porque el sitio los usa. `assets-src/` está fuera de
`public/`, así que mover cualquiera de ellos aquí lo borraría del build —
`vitral-biblioteca.webp` se llevaría el header y el footer, `potro-mascota.webp`
la insignia de Resultados, `og-potropath.png` la vista previa de los enlaces
compartidos, y los tres del mosaico dejarían tres huecos vacíos en la portada.

Están aquí por la misma convención que `vitral-biblioteca.png` y
`potro-mascota.png`: que exista un archivo maestro fuera del build para cada
imagen servida.

| Archivo aquí | Servido como | Qué es |
| --- | --- | --- |
| `estudiante-ico.avif` | `public/images/estudiante-ico.png` | 740x493. Celda `circle-main` del mosaico del hero |
| `trabajo-equipo.avif` | `public/images/trabajo-equipo.png` | 493x740. Celda `square-top` del mosaico |
| `estudiante-redes.webp` | `public/images/estudiante-redes.png` | 626x417. Celda `pill-wide` del mosaico |
| `vitral2.webp` | `public/images/vitral2.png` | 1200x600. Segundo vitral, **sin usar**: no lo referencia ningún componente |
| `og-potropath.png` | `public/images/og-potropath.png` | 1200x630. La tarjeta de vista previa generada; se archiva para poder diferenciar contra ella cuando se regenere (la receta de composición vive en `DESIGN.md` → *Tarjeta de vista previa*) |

**Aquí llevan su extensión real, y en `public/` no.** Cuatro de los cinco
servidos tienen la extensión equivocada: `estudiante-ico.png` y
`trabajo-equipo.png` son **AVIF**, y `estudiante-redes.png` y `vitral2.png` son
**WebP**. Hoy funciona porque el navegador detecta el formato por los bytes e
ignora el `Content-Type` en un `<img>`, pero cualquier herramienta que confíe en
la extensión —un optimizador, un CDN, un script de build— se equivocará. Las
copias de archivo se nombran por lo que son; renombrar las servidas es un cambio
aparte, porque toca las rutas de `Home.jsx`.

`areas/*.webp` no tienen maestro aquí: llegaron como JPEG de 2432px con
extensión `.png` (unos 2 MB cada una, 9.7 MB entre las cinco) y esos originales
no se conservaron al derivarlas.

---

Al regenerar un derivado, actualiza `public/images/README.md` con las medidas
nuevas.

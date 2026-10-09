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

Desde el rediseño editorial (octubre 2026) el hero es **dividido**: texto a la
izquierda y la fotografía en un marco 16:10 a la derecha, con su pie debajo y
no un titular encima. Ya no hace falta velo sobre las caras.

| Archivo | Medidas | Uso |
| --- | --- | --- |
| `quienes-somos.webp` | 1216×780 | Hero de `/comunidad` en laptop |
| `quienes-somos-720.webp` | 720×462, 47 KB | La misma, reducida para teléfonos vía `srcset` |
| `quienes-somos-movil.webp` | 512×750 | **Sin uso.** Era el recorte vertical del hero a pantalla completa; se conserva por si vuelve ese formato |

Los dos salen de `assets-src/comunidad/talent-land-2026.jpeg` (1600×1200),
centrados en el grupo (`x = 768`):

```
magick comunidad/talent-land-2026.jpeg -crop 1216x780+160+400 +repage -quality 84 quienes-somos.webp
magick comunidad/talent-land-2026.jpeg -crop  512x750+512+450 +repage -quality 82 quienes-somos-movil.webp
```

## Galería — *Las experiencias dejan huella*

Rejilla editorial: la primera foto ocupa dos columnas y dos filas, el resto
una celda. El orden y los textos viven en `GALLERY` de `src/data/community.js`.

| # | Archivo | Pie | Medidas | Vista ampliada |
| --- | --- | --- | --- | --- |
| 1 | `galeria-rama-ieee.webp` | Rama Estudiantil IEEE UAEMéx | 800×600 | `galeria-rama-ieee-grande.webp`, 1600×1200, 264 KB |
| 2 | `galeria-talent-land.webp` | Talent Land México 2026 | 800×600 | `galeria-talent-land-grande.webp`, 1600×1200, 171 KB |
| 3 | `galeria-wie.webp` | Women in Engineering | 800×600 | `galeria-wie-grande.webp`, 1600×785, 64 KB |
| 4 | `galeria-axolotl.webp` | Axolotl Tournament, UAM Lerma | 800×600 | `galeria-axolotl-grande.webp`, 1600×1059, 149 KB |
| 5 | `galeria-visita-uam-lerma.webp` | Visita a la Rama IEEE UAM Lerma | 760×570 | La misma miniatura: el original no es más grande |
| 6 | `explora-poli-hacks.webp` | PoliHacks, sede UPIITA-IPN | 620×620 | `explora-poli-hacks-grande.webp`, 620×827, 44 KB |

**Vista ampliada.** Al pasar el cursor, cada foto se abre grande con su pie
(`src/components/community/Gallery.jsx`). Los archivos `-grande` salen de
`assets-src/comunidad/` **sin recortar** —la foto completa, no el 4:3 de la
rejilla— y reducidos a 1600px de lado largo cuando el original lo da, en WebP
calidad 78 (la de la Rama, 68: su original de 4096px pesaba 326 KB a 78). Sólo
se descargan al detener el cursor sobre la miniatura, nunca con la página. La
visita a UAM Lerma y PoliHacks no tienen original más grande, y la vista no
las estira: se ven a su tamaño real en vez de borrosas.

**Las seis son de estudiantes de esta facultad** y todas llevan pie con evento
y lugar. La Rama IEEE va primera y en grande porque su pie es literalmente lo
que dice el lienzo del fondo: se verifica sin salir de la imagen. La 4 y la 5
van juntas porque son la misma sede. La 6 dice "sede UPIITA-IPN" porque la
competencia fue en casa ajena; el pie no puede sugerir que fue aquí.

**`explora-hackathon.webp` ya no se muestra.** Son estudiantes de UPIITA-IPN en
U-HACKS, no de la UAEMéx, y la tira sin pies donde convivía con la de
PoliHacks se retiró con el rediseño. Se cumple así la condición de retiro que
este README tenía anotada. El archivo se conserva; no debe volver al sitio
como experiencia local. `explora-taller.webp` nunca existió y dejó de
referenciarse.

**Para agregar una foto** basta con dejar el archivo aquí y añadir su entrada
a `GALLERY` con `caption`, `description`, `alt` y `large` (la versión
ampliada, con sus medidas). Nunca se rellena un hueco con
una foto de banco: la galería existe para probar que la comunidad es real.
`tests/professional-route.test.js` comprueba que cada foto tenga pie y texto
alternativo, y que la de U-HACKS no aparezca.

Formato **WebP**, lado largo **800px**, horizontal.

## Miniaturas del directorio de especialidades

**No viven aquí: son las fotos de `../areas/*.webp`,** las mismas de la
rejilla de Inicio, tomadas del campo `image` de `AREAS`. Una sola fuente: un
segundo juego de archivos con la misma fotografía se desincroniza en el primer
reemplazo. Que sean ilustraciones genéricas está bien aquí —sirven para
reconocer una especialidad en una lista— y por eso mismo nunca entran a la
galería.

## Logotipos de los capítulos IEEE

`ieee-computer-society.webp`, `ieee-robotics-automation.webp`,
`ieee-power-energy.webp`, `ieee-women-in-engineering.webp`. Derivados sin
modificar de `assets-src/logotipos-ieee/`. Van sobre recuadro `Papel` puro porque
el manual de cada sociedad pide fondo neutro y ninguno se puede repintar.

## Personas reconocibles: con su consentimiento

Son fotos de estudiantes reales, no recortes de banco. Antes de publicar una foto
donde se reconozca a alguien, confirma que está de acuerdo en aparecer en el
sitio.

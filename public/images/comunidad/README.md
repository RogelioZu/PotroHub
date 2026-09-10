# Fotos de Comunidad

Seis fotografías reales de la vida estudiantil de la Facultad de Ingeniería,
para la pestaña `/comunidad` (`src/pages/Community.jsx`). A diferencia de
las fotos de `public/images/` que ilustran las áreas de especialización de
forma genérica, éstas deben ser gente real de *esta* facultad — hackathones,
sesiones de estudio, eventos de la Rama IEEE, lo que haya — porque son la
prueba visual de que la comunidad existe, no una ilustración de apoyo.

| Archivo | Dónde aparece | Qué buscar |
| --- | --- | --- |
| `quienes-somos.jpg` | Fondo del hero de la página, a pantalla completa detrás del titular | Una foto grupal panorámica — varios estudiantes juntos, no un retrato individual. Va detrás de un velo oscuro con texto encima, así que el centro y la parte inferior de la foto son donde cae el titular: evita que ahí haya algo que un texto grande tape mal |
| `canal-ia.jpg` | Miniatura cuadrada junto al nombre del canal "Inteligencia Artificial" | Estudiantes trabajando en algo relacionado — no necesita ilustrar el tema literalmente, una sesión de estudio o un proyecto en equipo alcanza |
| `canal-ciberseguridad.jpg` | Miniatura del canal "Ciberseguridad" | Igual que arriba |
| `canal-nube.jpg` | Miniatura del canal "Cloud Computing" | Igual que arriba |
| `canal-ciencia-datos.jpg` | Miniatura del canal "Ciencia de Datos" | Igual que arriba |
| `canal-software.jpg` | Miniatura del canal "Desarrollo de Software" | Igual que arriba |

## Especificación

- **Formato JPG**, fondo incluido — a diferencia de los recortes del hero de
  Inicio, éstas son fotos normales, no recortes transparentes.
- **`quienes-somos.jpg` es panorámica, no 4:3** — el hero es una franja
  ancha a todo lo ancho de la pantalla (piensa en algo cercano a 21:9 o más
  ancho). Las seis de canal sí son 4:3 u horizontales: se recortan a un
  cuadrado con `object-cover` a un tamaño pequeño, así que casi cualquier
  encuadre horizontal funciona.
- **Buena resolución** — al menos 1920px de ancho para `quienes-somos.jpg`
  (cubre toda la pantalla en escritorio) y al menos 800px en el lado largo
  para las de canal (se muestran muy pequeñas, pero deben verse nítidas).
- **Personas reconocibles: con su consentimiento.** Son fotos de estudiantes
  reales, no recortes de stock — antes de publicar una foto donde se
  reconozca a alguien, confirma que está de acuerdo en aparecer en el sitio.

Mientras un archivo no exista, `PhotoCard` (`src/components/ui/PhotoCard.jsx`)
cae a un aviso de borde punteado en vez de mostrar el recuadro roto del
navegador, así que la página no se ve incompleta mientras las agregan.

# Fotos de Comunidad

Seis fotografías reales de la vida estudiantil de la Facultad de Ingeniería,
para la pestaña `/comunidad` (`src/pages/Community.jsx`). A diferencia de
las fotos de `public/images/` que ilustran las áreas de especialización de
forma genérica, éstas deben ser gente real de *esta* facultad — hackathones,
sesiones de estudio, eventos de la Rama IEEE, lo que haya — porque son la
prueba visual de que la comunidad existe, no una ilustración de apoyo.

| Archivo | Dónde aparece | Qué buscar |
| --- | --- | --- |
| `quienes-somos.jpg` | Encabezado de la página, junto al titular | Una foto grupal — varios estudiantes juntos, no un retrato individual |
| `canal-ia.jpg` | Tarjeta del canal "Inteligencia Artificial" | Estudiantes trabajando en algo relacionado — no necesita ilustrar el tema literalmente, una sesión de estudio o un proyecto en equipo alcanza |
| `canal-ciberseguridad.jpg` | Tarjeta del canal "Ciberseguridad" | Igual que arriba |
| `canal-nube.jpg` | Tarjeta del canal "Cloud Computing" | Igual que arriba |
| `canal-ciencia-datos.jpg` | Tarjeta del canal "Ciencia de Datos" | Igual que arriba |
| `canal-software.jpg` | Tarjeta del canal "Desarrollo de Software" | Igual que arriba |

## Especificación

- **Formato JPG**, fondo incluido — a diferencia de los recortes del hero,
  éstas son fotos normales, no recortes transparentes.
- **Horizontal, proporción cercana a 4:3.** Las tarjetas recortan con
  `object-cover`, así que un retrato vertical se recorta mucho en los lados.
- **Buena resolución** (al menos 1200px en el lado largo); las tarjetas de
  canal pueden mostrarse a un tercio del ancho de la página en escritorio.
- **Personas reconocibles: con su consentimiento.** Son fotos de estudiantes
  reales, no recortes de stock — antes de publicar una foto donde se
  reconozca a alguien, confirma que está de acuerdo en aparecer en el sitio.

Mientras un archivo no exista, `PhotoCard` (`src/components/ui/PhotoCard.jsx`)
cae a un aviso de borde punteado en vez de mostrar el recuadro roto del
navegador, así que la página no se ve incompleta mientras las agregan.

/**
 * Contenido de /comunidad, fuera del JSX para que actualizar un acceso o
 * agregar una foto no obligue a tocar el diseño de la página.
 *
 * Lo pendiente se declara pendiente (ver PRODUCT.md → Evidence on Hand):
 *
 * - `TEAMS_CHANNELS` tiene el canal real de Microsoft Teams de cada
 *   especialidad, todos del mismo equipo. Un canal por área, y no un acceso
 *   general, porque el canal es lo que junta a quien comparte el interés.
 *   Si un canal desaparece, su enlace se sustituye; no se vuelve a un
 *   "Acceso en preparación" disfrazado.
 * - `EVENTS` está vacío hasta que la rama publique una agenda confirmada.
 * - Los capítulos IEEE son las sociedades de referencia. Un capítulo con
 *   `joinUrl` tiene grupo real para unirse y su tarjeta muestra "Unirme";
 *   uno con `joinUrl: null` muestra en su lugar un botón deshabilitado que
 *   dice "Próximamente".
 */

/** Enlace al canal de Microsoft Teams de cada especialidad, por id de área. */
export const TEAMS_CHANNELS = {
  ia: 'https://teams.microsoft.com/l/channel/19%3Ac7730262a8bc4404bfac34bebdefd5d0%40thread.tacv2/Inteligencia%20Artificial?groupId=d1f11d6f-cfea-4f6c-96da-b66d61c5c3d6&tenantId=a9e17f9e-90be-41d0-84eb-6a48ebe9fec0',
  ciberseguridad:
    'https://teams.microsoft.com/l/channel/19%3A6c5c2a40dea14cd29cadce8ac604c64a%40thread.tacv2/Ciberseguridad?groupId=d1f11d6f-cfea-4f6c-96da-b66d61c5c3d6&tenantId=a9e17f9e-90be-41d0-84eb-6a48ebe9fec0',
  nube: 'https://teams.microsoft.com/l/channel/19%3A139ad4f1927c45fe94a930d063e9298a%40thread.tacv2/Computo%20en%20la%20Nube?groupId=d1f11d6f-cfea-4f6c-96da-b66d61c5c3d6&tenantId=a9e17f9e-90be-41d0-84eb-6a48ebe9fec0',
  'ciencia-datos':
    'https://teams.microsoft.com/l/channel/19%3A0491eddd81f9412a902b52baca9bb66d%40thread.tacv2/Ciencia%20de%20Datos?groupId=d1f11d6f-cfea-4f6c-96da-b66d61c5c3d6&tenantId=a9e17f9e-90be-41d0-84eb-6a48ebe9fec0',
  software:
    'https://teams.microsoft.com/l/channel/19%3A9134d3dd0f804bda8d57dfb010f2a4d0%40thread.tacv2/Desarrollo%20de%20Software?groupId=d1f11d6f-cfea-4f6c-96da-b66d61c5c3d6&tenantId=a9e17f9e-90be-41d0-84eb-6a48ebe9fec0',
}

/** Cada evento confirmado: { name, date (AAAA-MM-DD), place, url? }. */
export const EVENTS = []

/*
 * `width` y `height` son las medidas intrínsecas del archivo: los logotipos
 * se dimensionan por alto con el ancho libre, y sin ellas el navegador les
 * reserva cero de ancho y la tarjeta salta al cargar.
 *
 * `joinUrl` es el grupo de WhatsApp del capítulo, o `null` mientras no exista.
 */
export const CHAPTERS = [
  {
    name: 'Computer Society',
    focus: 'Computación, desarrollo de software y sistemas inteligentes.',
    logo: { src: '/images/comunidad/ieee-computer-society.webp', width: 480, height: 148 },
    joinUrl: 'https://chat.whatsapp.com/GtOscJdK5G4Hl7vgU1kd2I?s=cl&p=a&mlu=4&ilr=4',
  },
  {
    name: 'Robotics and Automation',
    focus: 'Robótica, control y sistemas autónomos.',
    logo: { src: '/images/comunidad/ieee-robotics-automation.webp', width: 320, height: 118 },
    joinUrl: 'https://chat.whatsapp.com/Jyfc9GH6aA3Crtu8FcQmgL?mode=gi_t',
  },
  {
    name: 'Power & Energy Society',
    focus: 'Sistemas eléctricos y energía.',
    logo: { src: '/images/comunidad/ieee-power-energy.webp', width: 268, height: 187 },
    joinUrl: null,
  },
  {
    name: 'Women in Engineering',
    focus: 'Inclusión y liderazgo de mujeres en ingeniería.',
    logo: { src: '/images/comunidad/ieee-women-in-engineering.webp', width: 280, height: 282 },
    joinUrl: 'https://chat.whatsapp.com/ESMSOmfoOKY9qmGmZV89hB?s=cl&p=i&mlu=0&ilr=4',
  },
]

/**
 * Galería: sólo fotografías de estudiantes de esta facultad, cada una con un
 * pie que nombra evento y lugar. El pie es lo que la vuelve evidencia.
 *
 * - La Rama IEEE va primera y en grande: "Rama Estudiantil IEEE UAEMéx" es
 *   literalmente lo que dice el lienzo del fondo, así que se verifica sin
 *   salir de la imagen. Es la pieza de evidencia más fuerte del repositorio.
 * - Axolotl y la visita a UAM Lerma van juntas: son la misma sede, y
 *   separarlas haría parecer dos viajes donde hubo uno. El pie dice "Visita
 *   a" porque el orden de las palabras separa "fuimos" de atribuirnos una
 *   rama que no es nuestra.
 * - PoliHacks es de estudiantes de esta facultad en sede ajena (UPIITA-IPN),
 *   y el pie lo dice. La foto de U-HACKS (`explora-hackathon.webp`) no entra:
 *   son estudiantes de UPIITA-IPN, no de la UAEMéx.
 *
 * `large` es la versión de la vista ampliada: la foto completa, sin el
 * recorte 4:3 de la rejilla, a 1600px de lado largo cuando el original lo
 * da. La visita a UAM Lerma y PoliHacks no tienen original más grande, así
 * que se amplían a su tamaño real y no más: estirarlas sólo las emborronaría.
 */
export const GALLERY = [
  {
    src: '/images/comunidad/galeria-rama-ieee.webp',
    large: { src: '/images/comunidad/galeria-rama-ieee-grande.webp', width: 1600, height: 1200 },
    caption: 'Rama Estudiantil IEEE UAEMéx',
    description: 'Integrantes de la rama con un vehículo construido por el equipo.',
    alt: 'Integrantes de la Rama Estudiantil IEEE de la UAEMéx junto a un vehículo todo terreno construido por el equipo',
  },
  {
    src: '/images/comunidad/galeria-talent-land.webp',
    large: { src: '/images/comunidad/galeria-talent-land-grande.webp', width: 1600, height: 1200 },
    caption: 'Talent Land México 2026',
    description: 'Estudiantes de la facultad en Expo Santa Fe.',
    alt: 'Estudiantes de la Facultad de Ingeniería frente a la entrada de Talent Land México 2026',
  },
  {
    src: '/images/comunidad/galeria-wie.webp',
    large: { src: '/images/comunidad/galeria-wie-grande.webp', width: 1600, height: 785 },
    caption: 'Women in Engineering',
    description: 'El capítulo de la facultad con un reconocimiento.',
    alt: 'Integrantes del capítulo Women in Engineering de la facultad con un reconocimiento',
  },
  {
    src: '/images/comunidad/galeria-axolotl.webp',
    large: { src: '/images/comunidad/galeria-axolotl-grande.webp', width: 1600, height: 1059 },
    caption: 'Axolotl Tournament, UAM Lerma',
    description: 'Robots construidos por estudiantes de la facultad.',
    alt: 'Estudiantes de la facultad con sus robots en el Axolotl Tournament de la UAM Unidad Lerma',
  },
  {
    src: '/images/comunidad/galeria-visita-uam-lerma.webp',
    large: { src: '/images/comunidad/galeria-visita-uam-lerma.webp', width: 760, height: 570 },
    caption: 'Visita a la Rama IEEE UAM Lerma',
    description: 'Conexión con otra comunidad universitaria.',
    alt: 'Estudiantes de la facultad durante su visita a la Rama Estudiantil IEEE de la UAM Lerma',
  },
  {
    src: '/images/comunidad/explora-poli-hacks.webp',
    large: { src: '/images/comunidad/explora-poli-hacks-grande.webp', width: 620, height: 827 },
    caption: 'PoliHacks, sede UPIITA-IPN',
    description: 'Dos estudiantes de la facultad con su trofeo.',
    alt: 'Dos estudiantes de la facultad con su trofeo del hackatón PoliHacks',
  },
]

/** Ideas para aprender en equipo por especialidad. No son actividades programadas. */
export const INTERESTS = {
  ia: ['Experimentar con modelos', 'Compartir proyectos de IA', 'Discutir evaluación y sesgos'],
  ciberseguridad: [
    'Practicar en laboratorios autorizados',
    'Analizar casos de seguridad',
    'Compartir aprendizajes de CTF',
  ],
  nube: [
    'Entender arquitecturas',
    'Explorar automatización',
    'Compartir proyectos de infraestructura',
  ],
  'ciencia-datos': ['Analizar datos abiertos', 'Comparar visualizaciones', 'Discutir experimentos'],
  software: ['Construir aplicaciones', 'Revisar código en equipo', 'Compartir proyectos y herramientas'],
}

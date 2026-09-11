import { useState } from 'react'
import Reveal from '../components/motion/Reveal'
import SectionDivider from '../components/motion/SectionDivider'
import Carousel from '../components/ui/Carousel'
import PhotoCard from '../components/ui/PhotoCard'
import { AREAS } from '../data/areas'
import { useDocumentTitle } from '../lib/useDocumentTitle'

// TODO: colocar el código de invitación real al equipo de Teams cuando exista.
const TEAMS_JOIN_CODE_URL = null

// La marca vive dentro del capítulo y no en una lista aparte para que las dos
// rejillas no puedan desordenarse una respecto de la otra: cada recuadro de
// logotipo cae en la misma columna que su capítulo porque las dos recorren
// este mismo arreglo.
//
// `logoSize` va por marca y no compartido porque las proporciones no se
// parecen —3.25:1 el lockup de Computer Society, 0.99:1 el emblema de WIE—:
// igualarles el alto achicaría los cuadrados hasta perder su tagline, e
// igualarles el ancho reventaría los apaisados. Los logotipos se alinean por
// peso óptico, no por caja, así que los apaisados van bajos y los cuadrados
// altos.
const chapters = [
  {
    name: 'Computer Society',
    focus: 'Software, IA y ciencias de la computación.',
    logo: {
      src: '/images/comunidad/ieee-computer-society.webp',
      alt: 'IEEE Computer Society',
      width: 480,
      height: 148,
      logoSize: 'h-12',
    },
  },
  {
    name: 'Robotics and Automation',
    focus: 'Robótica, control y sistemas autónomos.',
    logo: {
      src: '/images/comunidad/ieee-robotics-automation.webp',
      alt: 'IEEE Robotics and Automation Society',
      width: 320,
      height: 118,
      logoSize: 'h-12',
    },
  },
  {
    name: 'Power & Energy Society',
    focus: 'Sistemas eléctricos y energías renovables.',
    logo: {
      src: '/images/comunidad/ieee-power-energy.webp',
      alt: 'IEEE Power & Energy Society',
      width: 268,
      height: 187,
      logoSize: 'h-20',
    },
  },
  {
    name: 'Women in Engineering',
    focus: 'Inclusión y liderazgo de mujeres en ingeniería.',
    logo: {
      src: '/images/comunidad/ieee-women-in-engineering.webp',
      alt: 'IEEE Women in Engineering',
      width: 280,
      height: 282,
      // Un escalón más alto que las otras tres: el trazo del monograma es fino
      // y a la misma altura lee más ligero que los lockups de palo seco.
      logoSize: 'h-22',
    },
  },
]

const events = []

/**
 * Galería de la comunidad.
 *
 * Las tres primeras son fotografías reales de estudiantes de esta facultad y
 * llevan pie con evento y lugar: **el pie es lo que las vuelve evidencia**. Sin
 * él, un grupo de estudiantes sonriendo se lee como imagen de banco, que es
 * justo la sospecha que esta página existe para desactivar.
 *
 * Las dos últimas son lugares reservados y se ven como tales — `PhotoCard` las
 * dibuja con el borde punteado con el que todo el sitio dice "esto todavía no
 * existe". Rellenarlas con imágenes de banco destruiría exactamente la
 * credibilidad que la página viene a ganarse (ver PRODUCT.md →
 * *Evidence on Hand*). Sus pies describen el tipo de actividad y no un evento
 * concreto, para que sigan siendo ciertos cuando alguien deje caer el archivo.
 *
 * **Aquí no entran las fotos de `AREAS`.** Ilustran especialidades y son
 * genéricas; sirven de miniatura para reconocer un canal —ése es su trabajo
 * abajo— pero no prueban que nadie se haya reunido nunca. La galería es la
 * única superficie de la página cuyo contenido *es* la evidencia.
 */
const gallery = [
  {
    src: '/images/comunidad/galeria-talent-land.webp',
    caption: 'Talent Land México 2026',
    alt: 'Estudiantes de la Facultad de Ingeniería frente a la entrada de Talent Land México 2026',
  },
  {
    src: '/images/comunidad/galeria-wie.webp',
    caption: 'Capítulo Women in Engineering',
    alt: 'Integrantes del capítulo Women in Engineering de la facultad con un reconocimiento',
  },
  {
    // El pie dice "Visita a", no "Rama IEEE UAM Lerma" a secas: son estudiantes
    // de esta facultad en casa ajena, y el orden de las palabras es lo único
    // que separa "fuimos" de atribuirnos una rama que no es nuestra.
    src: '/images/comunidad/galeria-visita-uam-lerma.webp',
    caption: 'Visita a la Rama IEEE UAM Lerma',
    alt: 'Estudiantes de la facultad durante su visita a la Rama Estudiantil IEEE de la UAM Lerma',
  },
  { src: '/images/comunidad/galeria-taller.webp', caption: 'Talleres y proyectos' },
  { src: '/images/comunidad/galeria-concurso.webp', caption: 'Concursos y hackatones' },
]

/**
 * Fotos del bloque *Explora más allá del salón*. Van sin pie, a diferencia de
 * las de la galería: la primera —la única que existe— no puede llevarlo (ver
 * la nota de deuda en el bloque), y un pie en las otras dos abriría dos
 * tratamientos distintos dentro de la misma tira.
 */
const exploraPhotos = [
  {
    src: '/images/comunidad/explora-hackathon.webp',
    alt: 'Cuatro estudiantes con sus reconocimientos de segundo lugar del hackathon U-HACKS',
  },
  { src: '/images/comunidad/explora-concurso.webp' },
  { src: '/images/comunidad/explora-taller.webp' },
]

// Otros espacios de la comunidad universitaria a integrar más adelante
// (sociedad de alumnos, clubes, voluntariado, movilidad, etc.). Deliberadamente
// más pequeños que la Rama IEEE: es contenido sin confirmar todavía, no la
// pieza central de la sección.
const moreCommunity = [
  { name: 'Sociedad de Alumnos', description: 'Representación estudiantil de la facultad.' },
  { name: 'Clubes y talleres', description: 'Grupos estudiantiles por interés técnico o cultural.' },
  { name: 'Voluntariado', description: 'Brigadas y actividades de servicio social.' },
  { name: 'Movilidad e intercambios', description: 'Convocatorias de movilidad nacional e internacional.' },
]

/**
 * Fondo fotográfico del hero de Comunidad. Mismo mecanismo de degradación que
 * `VitralBackdrop` (imagen a pantalla completa, `onError` cae a un color
 * sólido) pero con dos diferencias deliberadas: la imagen no es el vitral, es
 * una foto real de gente, así que sí lleva un velo — una foto de personas
 * tiene zonas claras donde el texto blanco se pierde sin él, algo que el
 * vidrio de color no hace — y el color de respaldo es `Verde Profundo`
 * sólido, no el acento decorativo `vitral-accent`, que es territorio
 * exclusivo del vitral.
 *
 * **Dos recortes, no uno escalado, y los dos centrados en el grupo.** El hueco
 * del hero va de 2.65:1 en escritorio a 0.64:1 en un teléfono; ninguna
 * `object-position` salva esa distancia, así que hay un archivo por orientación
 * y el encuadre se decide en el archivo, como en el recorte cuadrado de
 * `explora-hackathon`.
 *
 * El grupo ocupa `x 195..1340` del original de 1600, o sea que **su centro está
 * en 768, a 32px del centro de la imagen**: lo que descuadraba la foto no era el
 * grupo sino los bordes — el zaguán oscuro de la entrada a la izquierda
 * (`x 0..190`) y dos personas de paso a la derecha (`x 1350..1600`). Los dos
 * recortes se trazan simétricos alrededor de `x = 768` y se llevan esa basura,
 * que es lo que deja la composición centrada de verdad.
 *
 * Por eso ya no hay `object-position`: con los archivos centrados, el `50% 50%`
 * por defecto de `object-cover` es exactamente el encuadre que se quiere, y
 * cualquier recorte que el contenedor imponga se reparte simétrico a los dos
 * lados. Compensar en CSS un archivo descentrado era arreglar el síntoma.
 *
 * **La calidad de codificación subió a 84 y 82.** Estaba en 68, elegida cuando
 * el velo era diagonal y apagaba buena parte del grupo: ahí el detalle fino no
 * se percibía. Con el velo vertical las caras quedan al 12–25% de tinta, casi
 * limpias, y a esa luz los artefactos de WebP sí se ven. Pesan 124 KB y 48 KB,
 * todavía por debajo de los 144 KB que costaba el cuadro completo sin recortar.
 */
function CommunityHeroBackdrop() {
  const [failed, setFailed] = useState(false)

  return (
    <div className="absolute inset-0 overflow-hidden bg-green" aria-hidden="true">
      {!failed && (
        <picture>
          {/* El corte coincide con el de `.community-hero-scrim`: por debajo de
              `md` el velo es vertical y el recorte es vertical. Si uno se
              mueve, el otro también. */}
          <source media="(max-width: 767.98px)" srcSet="/images/comunidad/quienes-somos-movil.webp" />
          <img
            src="/images/comunidad/quienes-somos.webp"
            alt=""
            className="h-full w-full object-cover"
            // La única imagen de la página que no va `lazy`: es el primer
            // pintado con contenido de la vista, y diferirla es retrasar
            // justamente lo que se viene a ver.
            fetchPriority="high"
            onError={() => setFailed(true)}
          />
        </picture>
      )}
      <div className="community-hero-scrim absolute inset-0" />
    </div>
  )
}

function Community() {
  useDocumentTitle('Comunidad Facultad de Ingeniería — PotroPath')

  // Varios canales pueden quedar volteados a la vez, igual que en Inicio: si
  // el estudiante quiere comparar dos especialidades, cerrarle una para
  // abrirle la otra no le ahorra nada.
  const [flipped, setFlipped] = useState({})

  return (
    <>
      {/*
        Hero a pantalla completa: la comunidad se anuncia con una foto real
        de gente, no con un titular junto a una tarjeta — ese patrón ya es
        el de Inicio, y esta página necesita su propia entrada.

        El titular se apoya abajo y a la izquierda, no centrado. Son dos
        razones que apuntan al mismo lado: centrado, el texto cae encima de
        las caras del grupo, que es justo lo que la fotografía viene a
        mostrar; y el ancho quedaba en `max-w-3xl`, un tercer ancho que *La
        regla de los Dos Anchos* no contempla. El velo vertical le reserva la
        banda de abajo, que es donde se apoya.
      */}
      {/*
        El canalón crece con la pantalla en vez de ser un número fijo: `16px`
        en teléfono y `48px` desde `md`. Proporcionalmente el de teléfono es
        el más grueso de los dos (4.1% del ancho contra 3.3%), y un `32px`
        plano ahí se comía el renglón — con el relleno interno dejaba el texto
        en 278px, partía el *eyebrow* en dos líneas y el bloque volvía a subir
        sobre las caras del grupo. En una pantalla de 390px el aire se mide
        contra lo que le quita al texto.
      */}
      <section className="hero-full flex px-4 pt-4 sm:px-6 sm:pt-6 md:px-16 md:pt-12">
        {/*
          La foto es una lámina acotada, no un sangrado completo: canalón de
          papel arriba y a los lados, y a ras por abajo.

          **El tope no es un ancho de composición, es el techo del sangrado, y
          sale del archivo.** `84rem` son 1344px = los 1216px de la fotografía
          por 1.10, que es hasta donde se la puede estirar sin que se note. No
          es un tercer ancho de los que *La regla de los Dos Anchos* prohíbe:
          el texto de adentro sigue en `max-w-2xl` y esto sólo le pone un
          límite a un sangrado, que antes no tenía ninguno.

          Estuvo en `max-w-6xl` (1152px), donde la foto no se escalaba hacia
          arriba nunca. A 1440 eso dejaba la lámina en el 80% del ancho; a 135%
          de zoom el tope deja de aplicar y sube al 91%, que es la proporción
          que se buscaba. Con canalón de 64px, 1440 da 1312px de lámina —el
          mismo 91%— a cambio de un 1.08x de estiramiento. En 1920 el techo
          entra y lo deja en 1.10x; sin techo serían 1.47x, que sí se ve.

          `box-sizing: border-box` hace que el relleno entre dentro del alto que
          pide `.hero-full`, así que la sección mide lo mismo que antes y lo que
          encoge es la lámina: el pliegue no se mueve.
        */}
        <div className="relative mx-auto flex w-full max-w-[84rem] items-end overflow-hidden rounded-t-xl text-paper">
          <CommunityHeroBackdrop />
          {/* `pb-16` (64px) es el ritmo vertical de sección que ya usa `.section-py`.
              Era `pb-14`, 56px, el único escalón de la página fuera de la escala. */}
          <div className="relative z-10 w-full px-5 pt-24 pb-16 md:px-10 md:pb-20">
            <p className="eyebrow text-gold-light [text-shadow:0_1px_6px_rgb(0_0_0/75%)]">
              Comunidad Facultad de Ingeniería
            </p>
            <h1 className="mt-3 h1 max-w-2xl text-paper [text-shadow:0_2px_10px_rgb(0_0_0/70%)]">
              La facultad no termina en el salón
            </h1>
            {/*
              Deliberadamente corto. En un teléfono el hero mide unos 610px y el
              bloque de texto se come el que sobra: cada línea de más empuja al
              titular hacia arriba, sobre las caras que el recorte vertical
              acaba de despejar. Una frase más larga aquí cuesta la fotografía.
            */}
            <p className="mt-5 lead max-w-2xl text-paper/90 [text-shadow:0_1px_6px_rgb(0_0_0/75%)]">
              Canales por especialidad, una rama estudiantil con cuatro capítulos técnicos y
              compañeros tuyos del otro lado.
            </p>
            {/*
              El pie de la fotografía no es un crédito de cortesía: es la línea
              que convierte una foto grupal en evidencia. Sin fecha ni lugar,
              cualquier grupo de estudiantes sonriendo se lee como imagen de
              banco — que es exactamente la sospecha que esta página existe para
              desactivar.

              Comparte `max-w-2xl` con el titular y la entradilla, y no un
              `max-w-md` propio: 28rem era un tercer ancho que *La regla de los
              Dos Anchos* no contempla, y de paso desalineaba el borde derecho
              del bloque. El tamaño es `text-sm` plano —el escalón más chico que
              la escala documenta— y no un salto `text-xs`→`sm:text-sm`, que era
              el único cambio de tamaño por breakpoint de toda la página.
            */}
            <p className="mt-4 max-w-2xl text-sm text-paper/75 [text-shadow:0_1px_6px_rgb(0_0_0/75%)]">
              Estudiantes de la facultad en Talent Land México 2026, Expo Santa Fe.
            </p>
          </div>
        </div>
      </section>

      {/*
        Cuerpo en dos mitades: a la izquierda, los canales de Teams — la
        acción concreta de hoy. A la derecha, la invitación a ir más allá
        del salón, que desemboca en la Rama IEEE de abajo. No son la misma
        idea repetida dos veces: una es "únete a algo que ya existe", la
        otra es "esto es más grande que el plan de estudios".
      */}
      <section className="section-py border-t border-ink/5">
        {/*
          `min-w-0` en las dos celdas, no por costumbre: una celda de rejilla
          se estira hasta el ancho mínimo de su contenido, y en móvil las dos
          columnas comparten pista — así que lo que ensanche a una ensancha
          también a la otra.
        */}
        <div className="mx-auto grid max-w-6xl gap-12 px-6 lg:grid-cols-2">
          <div className="min-w-0">
            <h2 className="h2">Canales de Microsoft Teams</h2>
            <p className="mt-4 text-ink-soft">
              Un canal por especialidad, moderado, al que entras con tu cuenta institucional — así
              sabes que del otro lado hay un compañero de tu propia facultad, no un desconocido.
            </p>

            {/*
              Cada fila es un botón que voltea, con el mismo mecanismo que las
              tarjetas de área de Inicio (ver `.canal-flip` en index.css): al
              frente la miniatura y el nombre —lo que hace falta para
              reconocer el canal dentro de la lista—, y al reverso la
              descripción de la especialidad. En escritorio con puntero fino
              basta pasar el mouse; en teléfono, donde no hay hover, el toque
              la deja volteada, así que el reverso nunca queda inalcanzable.

              Sigue siendo una lista y no la rejilla de Inicio: filas a lo
              ancho de la columna, apiladas, con la foto en miniatura. Lo que
              cambia es que la descripción ahora se pide, no se lee de
              corrido.

              Y sigue siendo una lista y no un carrusel, aunque la página ya
              tenga dos: un directorio se recorre buscando un nombre, y en una
              tira horizontal la mitad de los nombres queda fuera de cuadro.
              Los carruseles son para las fotos, que se hojean.
            */}
            <Reveal className="mt-6 flex flex-col gap-3">
              {AREAS.map((area) => (
                <button
                  key={area.id}
                  type="button"
                  aria-pressed={Boolean(flipped[area.id])}
                  onClick={() =>
                    setFlipped((current) => ({ ...current, [area.id]: !current[area.id] }))
                  }
                  className={`canal-flip text-left ${flipped[area.id] ? 'is-flipped' : ''}`}
                >
                  <span className="canal-flip-inner">
                    <span className="canal-flip-face flex items-center gap-4 bg-paper-alt p-3">
                      {/*
                        La miniatura es la foto del área, la misma que usa la
                        rejilla de Inicio, y no un `canal-<id>.jpg` aparte. Ese
                        archivo no existía para ninguna de las cinco, así que la
                        lista entera se veía punteada — cinco huecos de "esto
                        todavía no existe" para algo que sí existe.

                        Es la misma razón por la que las dos páginas ya
                        comparten `AREAS`: **una sola fuente**. Un segundo juego
                        de archivos con la misma foto se desincroniza en el
                        primer reemplazo, y el canal de Ciberseguridad
                        terminaría ilustrado con una foto distinta a la del área
                        de Ciberseguridad sin que nadie lo note.

                        El `alt` se queda vacío a propósito: el nombre del área
                        va en el `span` de al lado, así que describir la foto
                        haría que un lector de pantalla dijera dos veces lo
                        mismo. Y `compact` se conserva aunque la foto ya cargue:
                        es la red por si algún día falta el archivo.
                      */}
                      <PhotoCard
                        as="span"
                        src={area.image}
                        alt=""
                        aspect="aspect-square"
                        compact
                        className="w-20 shrink-0 sm:w-24"
                      />
                      <span className="h3 min-w-0 text-green-mid">{area.name}</span>
                    </span>
                    <span className="canal-flip-face canal-flip-back flex flex-col justify-center bg-paper-alt p-5">
                      <span className="h3 text-green-mid">{area.name}</span>
                      <span className="mt-1 text-sm text-ink-soft">{area.description}</span>
                    </span>
                  </span>
                </button>
              ))}
            </Reveal>

            <p className="mt-4 text-sm text-ink-soft">
              Moderado por mentores, con reglas claras de convivencia. No se recopila ni comparte
              información personal de los participantes.
            </p>

            <div className="mt-6">
              {TEAMS_JOIN_CODE_URL ? (
                <a href={TEAMS_JOIN_CODE_URL} target="_blank" rel="noreferrer" className="btn-green">
                  Unirme a los canales
                </a>
              ) : (
                <button type="button" disabled className="btn-disabled">
                  Código de acceso próximamente
                </button>
              )}
            </div>
          </div>

          <div className="flex min-w-0 flex-col justify-center rounded-xl bg-paper-alt p-8">
            {/*
              La tira ancla la idea del bloque: el perfil se construye afuera
              del plan de estudios. Va arriba del titular y no al lado porque
              esta columna es la corta de las dos —la lista de canales de la
              izquierda mide el doble— y la imagen es lo que las empareja.

              Es un carrusel y no una foto suelta porque lo que sostiene la
              idea es la acumulación: una foto es una anécdota, varias son un
              hábito. Hoy sólo existe la primera, y las otras dos se ven como
              lo que son.

              Nota para quien venga después: la primera son estudiantes de
              UPIITA-IPN con reconocimientos del hackathon U-HACKS, no de la
              UAEMéx. Va sin pie por decisión explícita del autor. Mientras
              siga así, no se puede escribir copy alrededor que la presente
              como gente de esta facultad ni como un logro propio — ver
              `PRODUCT.md` → *Evidence on Hand*. Cuando exista una foto de la
              rama de la facultad, ésta se sustituye.

              El recorte es cuadrado y anclado abajo, hecho en el archivo y no
              en CSS: el original es 3:4 con casi un tercio de pared vacía
              arriba, y encuadrar desde abajo deja a las cuatro personas de
              cuerpo entero sin cargar bytes de pared.
            */}
            {/*
              `w-56` fijo, sin escalón por breakpoint. Era `w-64 sm:w-72` y en
              un teléfono de 390px la cuenta salía mal: el contenedor mide 278
              —342 de columna menos los 32+32 del `p-8`— así que una tarjeta de
              256 más 16 de hueco dejaba **6px** de la siguiente asomando. A esa
              medida no se ve nada: en la pantalla más angosta, y la más común,
              la tira no parecía desplazable.

              La regla, que es la misma que usa la galería: el ancho es el mayor
              escalón que deja asomar al menos un canalón (24px) de la tarjeta
              siguiente en el contenedor más angosto donde el carrusel vive.
              Aquí ese contenedor son 278px, así que 224 deja 38 de asomo.
            */}
            <Carousel
              label="Fotos de actividades fuera del plan de estudios"
              itemClassName="w-56"
              className="mb-6"
            >
              {exploraPhotos.map((photo) => (
                <PhotoCard key={photo.src} src={photo.src} alt={photo.alt} aspect="aspect-square" />
              ))}
            </Carousel>
            <h2 className="h2">Explora más allá del salón</h2>
            <p className="mt-4 text-ink-soft">
              Las materias te dan la base, pero el perfil que piden las empresas se construye
              afuera del plan de estudios: en un hackatón, en un proyecto propio, en una
              comunidad técnica activa. La Rama IEEE UAEMéx es la puerta más cercana para empezar.
            </p>
            <a href="#ieee" className="btn-outline mt-6 self-start">
              Conoce la Rama IEEE
            </a>
          </div>
        </div>
      </section>

      {/*
        Galería. Es la única sección de la página cuyo contenido son las
        fotografías mismas y no un texto que ellas apoyan, y es donde caben
        las que se vayan agregando sin rediseñar nada: la tira crece a lo
        ancho, no a lo largo, así que veinte fotos cuestan lo mismo de página
        que cuatro.

        No es el carrusel que DESIGN.md prohíbe — ver la cabecera de
        `Carousel.jsx`—: aquello es la rueda de testimonios de una landing, un
        componente que rota evidencia social que aquí no existe. Esto es lo
        contrario, fotografías reales y ninguna afirmación encima.
      */}
      <section className="section-py border-t border-ink/5">
        <div className="mx-auto max-w-6xl px-6">
          <SectionDivider>
            <h2 className="min-w-0 h2 sm:shrink-0">La comunidad, en fotos</h2>
          </SectionDivider>

          <p className="mt-6 max-w-2xl text-ink-soft">
            Actividades de la facultad, documentadas conforme ocurren. Los recuadros punteados son
            los lugares que todavía esperan su fotografía.
          </p>

          {/*
            Misma regla que la tira de Explora: el mayor escalón que deja
            asomar 24px de la tarjeta siguiente en el contenedor más angosto.
            Aquí ése son los 342px del teléfono, y 288 deja 38 de asomo. Era
            `w-72 sm:w-80`; el escalón a 320 en escritorio no compraba nada
            —sobran tres tarjetas y media de ancho— y hacía que `w-72`
            significara dos cosas distintas entre las dos tiras de la página.
          */}
          <Carousel
            label="Galería de fotos de la comunidad"
            itemClassName="w-72"
            className="mt-8"
          >
            {gallery.map((photo) => (
              <PhotoCard
                key={photo.src}
                src={photo.src}
                alt={photo.alt}
                caption={photo.caption}
                aspect="aspect-4/3"
              />
            ))}
          </Carousel>
        </div>
      </section>

      {/*
        IEEE es el punto más alto de la sección, no una tarjeta entre otras
        cuatro iguales: fondo Verde Profundo, ancho completo dentro de la
        columna, y todo lo demás vive alrededor, más chico. La separación
        tonal (Papel → Verde Profundo) hace el trabajo de jerarquía sin
        necesitar una sombra nueva.
      */}
      <section id="ieee" className="section-py border-t border-ink/5 bg-paper-alt">
        <div className="mx-auto max-w-6xl px-6">
          <SectionDivider>
            <h2 className="min-w-0 h2 sm:shrink-0">Comunidad estudiantil</h2>
          </SectionDivider>

          <div className="mt-8 rounded-xl bg-green p-8 text-paper md:p-12">
            {/* `.eyebrow` reescrito a mano —mismo tamaño, mismo peso, mismo
                tracking— con el color cambiado por el fondo verde. La clase ya
                existe y ya hace eso; sólo hacía falta pisarle el color, como
                en el hero de arriba. */}
            <p className="eyebrow text-gold-light">Rama estudiantil</p>
            {/*
              `.h2` y no un `text-3xl` suelto. Estaba a 30px, más grande que
              los cuatro `h2` de la página, que miden 24: un `h3` que gritaba
              por encima de los encabezados de sección que lo contienen. La
              prominencia de esta tarjeta ya la da el salto tonal a `Verde
              Profundo` —así lo dice esta misma sección de DESIGN.md—, así que
              agrandar además el titular hacía el mismo trabajo dos veces, y la
              segunda vez rompiendo la escala.
            */}
            <h3 className="mt-2 h2 text-paper">IEEE UAEMéx</h3>
            <p className="mt-4 max-w-2xl text-paper/85">
              Capítulos técnicos, eventos y una red profesional internacional, con actividades
              presenciales dentro de la propia facultad.
            </p>

            <Reveal className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {chapters.map((chapter) => (
                <div key={chapter.name} className="rounded-xl bg-paper/10 p-4">
                  <h4 className="font-bold">{chapter.name}</h4>
                  <p className="mt-1 text-sm text-paper/75">{chapter.focus}</p>
                </div>
              ))}
            </Reveal>

            {/*
              Un recuadro por capítulo, en la misma rejilla que las tarjetas de
              arriba, así que cada marca cae en la columna de su capítulo.

              Los recuadros son `Papel` puro y no el verde de la tarjeta. No es
              una preferencia: son logotipos con color propio ajeno a la paleta
              y el manual de cada sociedad pide fondo neutro. Sobre `Verde
              Profundo` el morado de WIE cae a 1.20:1, prácticamente invisible.
              Es el mismo recurso que la insignia del potro en Resultados:
              papel para lo que no se puede repintar.

              Van antes de la nota de pendiente, no después, para que "de
              referencia" las cubra a ellas también y no sólo a la lista.

              El alto del recuadro es fijo (`h-32`) y el del logotipo no: es lo
              que deja que cuatro marcas de proporciones distintas se vean del
              mismo tamaño sin que la rejilla se escalone.
            */}
            <Reveal className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {chapters.map((chapter) => (
                <div
                  key={chapter.name}
                  className="flex h-32 items-center justify-center rounded-xl bg-paper p-4"
                >
                  <img
                    src={chapter.logo.src}
                    alt={chapter.logo.alt}
                    // `width` y `height` sólo aquí, contra la costumbre del resto
                    // del sitio: estas imágenes se dimensionan por alto con el
                    // ancho libre, así que sin las medidas intrínsecas el navegador
                    // les reserva cero de ancho y la rejilla salta al cargar. Las
                    // demás imágenes viven en cajas con proporción fija y no lo
                    // necesitan.
                    width={chapter.logo.width}
                    height={chapter.logo.height}
                    className={`w-auto max-w-full ${chapter.logo.logoSize}`}
                    loading="lazy"
                  />
                </div>
              ))}
            </Reveal>

            <div className="mt-8 border-t border-paper/15 pt-6">
              <h4 className="font-bold">Próximos eventos</h4>
              {events.length === 0 ? (
                <p className="mt-1 text-sm text-paper/75">
                  Aún no hay eventos publicados. Esta sección se conectará a la agenda de la rama
                  estudiantil.
                </p>
              ) : (
                <ul className="mt-1 space-y-1 text-sm text-paper/85">
                  {events.map((event) => (
                    <li key={event.name}>{event.name}</li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          {/* `text-lg font-bold` era `.h3` reescrito a mano: mismos 18px, mismo
              700. Misma medida, mecanismo correcto. */}
          <h3 className="mt-12 h3 text-ink">Otros espacios estudiantiles</h3>
          <Reveal className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {moreCommunity.map((item) => (
              <div key={item.name} className="rounded-xl border border-dashed border-ink/15 bg-paper p-5">
                <h4 className="font-bold text-ink">{item.name}</h4>
                <p className="mt-2 text-sm text-ink-soft">{item.description}</p>
                <p className="mt-3 text-xs font-medium text-gold-dark uppercase">Próximamente</p>
              </div>
            ))}
          </Reveal>
        </div>
      </section>
    </>
  )
}

export default Community

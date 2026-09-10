import { useState } from 'react'
import Reveal from '../components/motion/Reveal'
import SectionDivider from '../components/motion/SectionDivider'
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
 * una foto real de gente, así que sí lleva un velo — un rostro puede tener
 * zonas claras donde el texto blanco se pierde sin él, algo que el vidrio de
 * color no hace — y el color de respaldo es `Verde Profundo` sólido, no el
 * acento decorativo `vitral-accent`, que es territorio exclusivo del vitral.
 */
function CommunityHeroBackdrop() {
  const [failed, setFailed] = useState(false)

  return (
    <div className="absolute inset-0 overflow-hidden bg-green" aria-hidden="true">
      {!failed && (
        <img
          src="/images/comunidad/quienes-somos.jpg"
          alt=""
          className="h-full w-full object-cover"
          onError={() => setFailed(true)}
        />
      )}
      <div className="absolute inset-0 bg-linear-to-t from-ink/85 via-ink/40 to-ink/10" />
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
      */}
      <section className="relative overflow-hidden py-24 text-paper md:py-32">
        <CommunityHeroBackdrop />
        <div className="relative z-10 mx-auto max-w-3xl px-6 text-center">
          <p className="text-sm font-semibold tracking-widest text-gold-light uppercase [text-shadow:0_1px_6px_rgb(0_0_0/75%)]">
            Comunidad universitaria
          </p>
          <h1 className="mt-3 h1 text-paper [text-shadow:0_2px_10px_rgb(0_0_0/70%)]">
            Una facultad que comparte lo que sabe
          </h1>
          <p className="mt-5 lead text-paper/90 [text-shadow:0_1px_6px_rgb(0_0_0/75%)]">
            Estudiantes resolviendo proyectos juntos, compartiendo lo que aprenden y formando
            equipo mucho antes de salir al mercado laboral. Esta es la comunidad de la que puedes
            ser parte.
          </p>
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
        <div className="mx-auto grid max-w-6xl gap-12 px-6 lg:grid-cols-2">
          <div>
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
                      <PhotoCard
                        as="span"
                        src={`/images/comunidad/canal-${area.id}.jpg`}
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

          <div className="flex flex-col justify-center rounded-xl bg-paper-alt p-8">
            {/*
              La foto ancla la idea del bloque: el perfil se construye afuera
              del plan de estudios. Va arriba del titular y no al lado porque
              esta columna es la corta de las dos —la lista de canales de la
              izquierda mide el doble— y la imagen es lo que las empareja.

              Nota para quien venga después: son estudiantes de UPIITA-IPN con
              reconocimientos del hackathon U-HACKS, no de la UAEMéx. Va sin
              pie por decisión explícita del autor. Mientras siga así, no se
              puede escribir copy alrededor que la presente como gente de esta
              facultad ni como un logro propio — ver `PRODUCT.md` →
              *Evidence on Hand*. Cuando exista una foto de la rama de la
              facultad, ésta se sustituye.

              El recorte es cuadrado y anclado abajo, hecho en el archivo y no
              en CSS: el original es 3:4 con casi un tercio de pared vacía
              arriba, y encuadrar desde abajo deja a las cuatro personas de
              cuerpo entero sin cargar bytes de pared.
            */}
            <PhotoCard
              src="/images/comunidad/explora-hackathon.webp"
              alt="Cuatro estudiantes con sus reconocimientos de segundo lugar del hackathon U-HACKS"
              aspect="aspect-square"
              className="mb-6"
            />
            <h2 className="h2">Explora más allá del salón</h2>
            <p className="mt-4 text-ink-soft">
              Las materias te dan la base, pero el perfil que piden las empresas se construye
              afuera del plan de estudios: en un hackathon, en un proyecto propio, en una
              comunidad técnica activa. La Rama IEEE UAEMéx es la puerta más cercana para empezar.
            </p>
            <a href="#ieee" className="btn-outline mt-6 self-start">
              Conoce la Rama IEEE
            </a>
          </div>
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
            <p className="text-sm font-semibold tracking-widest text-gold-light uppercase">
              Rama estudiantil
            </p>
            <h3 className="mt-2 text-3xl font-bold">IEEE UAEMéx</h3>
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

          <h3 className="mt-12 text-lg font-bold text-ink">Otros espacios estudiantiles</h3>
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

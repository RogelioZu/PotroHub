import { useState } from 'react'
import Reveal from '../components/motion/Reveal'
import SectionDivider from '../components/motion/SectionDivider'
import PhotoCard from '../components/ui/PhotoCard'
import { AREAS } from '../data/areas'
import { useDocumentTitle } from '../lib/useDocumentTitle'

// TODO: colocar el código de invitación real al equipo de Teams cuando exista.
const TEAMS_JOIN_CODE_URL = null

const chapters = [
  { name: 'Computer Society', focus: 'Software, IA y ciencias de la computación.' },
  { name: 'Robotics and Automation', focus: 'Robótica, control y sistemas autónomos.' },
  { name: 'Power & Energy Society', focus: 'Sistemas eléctricos y energías renovables.' },
  { name: 'Women in Engineering', focus: 'Inclusión y liderazgo de mujeres en ingeniería.' },
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

            <Reveal className="mt-6 flex flex-col gap-3">
              {AREAS.map((area) => (
                <div key={area.id} className="flex items-start gap-4 rounded-xl bg-paper-alt p-3">
                  <PhotoCard
                    src={`/images/comunidad/canal-${area.id}.jpg`}
                    alt=""
                    aspect="aspect-square"
                    compact
                    className="w-20 shrink-0 sm:w-24"
                  />
                  <div className="min-w-0 py-1">
                    <h3 className="h3 text-green-mid">{area.name}</h3>
                    <p className="mt-1 text-sm text-ink-soft">{area.description}</p>
                  </div>
                </div>
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
            <p className="mt-3 text-xs text-paper/60">
              Lista de referencia — pendiente de confirmar contra los capítulos activos actuales de
              la rama.
            </p>

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

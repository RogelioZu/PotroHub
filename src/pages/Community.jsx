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
// (sociedad de alumnos, clubes, voluntariado, movilidad, etc.).
const moreCommunity = [
  { name: 'Sociedad de Alumnos', description: 'Representación estudiantil de la facultad.' },
  { name: 'Clubes y talleres', description: 'Grupos estudiantiles por interés técnico o cultural.' },
  { name: 'Voluntariado', description: 'Brigadas y actividades de servicio social.' },
  { name: 'Movilidad e intercambios', description: 'Convocatorias de movilidad nacional e internacional.' },
]

function Community() {
  useDocumentTitle('Comunidad Facultad de Ingeniería — PotroPath')

  return (
    <>
      {/* Encabezado */}
      <section className="section-py mx-auto grid max-w-6xl gap-10 px-6 md:grid-cols-2 md:items-center">
        <div>
          <p className="eyebrow">Comunidad universitaria</p>
          <h1 className="mt-2 h1">Comunidad Facultad de Ingeniería</h1>
          <p className="mt-4 lead">
            El punto de encuentro entre los canales de Microsoft Teams de PotroPath, la Rama
            Estudiantil IEEE UAEMéx y, poco a poco, el resto de espacios estudiantiles de la
            facultad: un solo lugar para conectar, participar y formar equipo con quien va en tu
            misma carrera.
          </p>
        </div>
        <PhotoCard
          src="/images/comunidad/quienes-somos.jpg"
          alt="Estudiantes de la Facultad de Ingeniería reunidos."
          caption="Nuestra comunidad"
          aspect="aspect-4/3"
        />
      </section>

      {/* Teams */}
      <section className="section-py border-t border-ink/5 bg-paper-alt">
        <div className="mx-auto max-w-6xl px-6">
          <SectionDivider>
            <h2 className="min-w-0 h2 sm:shrink-0">Canales de Microsoft Teams</h2>
          </SectionDivider>
          <p className="mt-6 max-w-2xl text-ink-soft">
            Canales moderados por especialidad, a los que entras con tu cuenta institucional — así
            sabes que quien está ahí es un compañero de tu propia facultad, y no un desconocido.
            Forma equipo para hackathones y proyectos, resuelve dudas técnicas y conecta con gente
            que va en tu misma carrera.
          </p>

          <Reveal className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {AREAS.map((area) => (
              <article
                key={area.id}
                className="overflow-hidden rounded-xl bg-paper shadow-sm shadow-ink/5 ring-1 ring-ink/5"
              >
                <PhotoCard
                  src={`/images/comunidad/canal-${area.id}.jpg`}
                  alt=""
                  caption={area.name}
                  aspect="aspect-4/3"
                  rounded="rounded-none"
                />
                <p className="p-5 text-sm text-ink-soft">{area.description}</p>
              </article>
            ))}
          </Reveal>

          <div className="mt-8 rounded-xl bg-green-soft p-6">
            <h3 className="text-lg font-bold text-green">Moderación y privacidad</h3>
            <p className="mt-2 text-sm text-ink-soft">
              Los canales cuentan con mentores como moderadores y reglas claras de convivencia. El
              acceso es con tu cuenta institucional de la UAEMéx, no con un enlace abierto a
              cualquiera, y no se recopila ni comparte información personal de los participantes.
            </p>
          </div>

          <div className="mt-8">
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
      </section>

      {/* IEEE */}
      <section className="section-py">
        <div className="mx-auto max-w-6xl px-6">
          <SectionDivider>
            <h2 className="min-w-0 h2 sm:shrink-0">Rama Estudiantil IEEE UAEMéx</h2>
          </SectionDivider>
          <p className="mt-6 max-w-2xl text-ink-soft">
            Conecta con capítulos técnicos, eventos y una red profesional internacional a través de
            sus actividades presenciales dentro de la facultad.
          </p>
          <Reveal className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {chapters.map((chapter) => (
              <div key={chapter.name} className="rounded-xl bg-paper-alt p-5">
                <h3 className="h3 text-green-mid">{chapter.name}</h3>
                <p className="mt-2 text-sm text-ink-soft">{chapter.focus}</p>
              </div>
            ))}
          </Reveal>
          <p className="mt-3 text-xs text-ink-soft/70">
            Lista de referencia — pendiente de confirmar contra los capítulos activos actuales de la
            rama.
          </p>

          <h3 className="mt-10 text-lg font-bold text-ink">Próximos eventos</h3>
          {events.length === 0 ? (
            <p className="mt-2 text-ink-soft">
              Aún no hay eventos publicados. Esta sección se conectará a la agenda de la rama
              estudiantil.
            </p>
          ) : (
            <ul className="mt-2 space-y-2">
              {events.map((event) => (
                <li key={event.name}>{event.name}</li>
              ))}
            </ul>
          )}
        </div>
      </section>

      {/* Más comunidad */}
      <section className="section-py border-t border-ink/5 bg-paper-alt">
        <div className="mx-auto max-w-6xl px-6">
          <SectionDivider>
            <h2 className="min-w-0 h2 sm:shrink-0">Más comunidad universitaria</h2>
          </SectionDivider>
          <p className="mt-6 max-w-2xl text-ink-soft">
            Espacio reservado para seguir integrando la vida estudiantil de la facultad: sociedad de
            alumnos, clubes, voluntariado, movilidad y más.
          </p>
          <Reveal className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {moreCommunity.map((item) => (
              <div key={item.name} className="rounded-xl border border-dashed border-ink/15 bg-paper p-5">
                <h3 className="h3 text-ink">{item.name}</h3>
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

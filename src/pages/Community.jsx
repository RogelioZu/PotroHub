import { AREAS } from '../data/areas'

const DISCORD_INVITE_URL = null // TODO: colocar el enlace de invitación real del servidor

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
  return (
    <section className="mx-auto max-w-6xl px-6 py-16">
      <p className="text-sm font-semibold tracking-widest text-gold-dark uppercase">
        Comunidad universitaria
      </p>
      <h1 className="mt-2 text-4xl font-bold text-ink">Comunidad Facultad de Ingeniería</h1>
      <p className="mt-4 max-w-2xl text-ink-soft">
        El punto de encuentro entre el servidor de Discord de PotroPath, la Rama Estudiantil IEEE
        UAEMéx y, poco a poco, el resto de espacios estudiantiles de la facultad: un solo lugar para
        conectar, participar y formar equipo.
      </p>

      {/* Discord */}
      <div className="section-divider mt-14">
        <h2 className="shrink-0 text-2xl font-bold text-ink">Servidor de Discord</h2>
      </div>
      <p className="mt-4 max-w-2xl text-ink-soft">
        Un espacio moderado, organizado por canales de especialidad, para conectar con otros
        estudiantes, formar equipos para hackathones y proyectos, y resolver dudas técnicas. No se
        solicitan datos personales para participar.
      </p>
      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {AREAS.map((area) => (
          <div key={area.id} className="rounded-xl bg-paper-alt p-5">
            <h3 className="font-bold text-green-mid">#{area.id}</h3>
            <p className="mt-2 text-sm text-ink-soft">{area.description}</p>
          </div>
        ))}
      </div>
      <div className="mt-6 rounded-xl bg-green-soft p-6">
        <h3 className="text-lg font-bold text-green">Moderación y privacidad</h3>
        <p className="mt-2 text-sm text-ink-soft">
          El servidor cuenta con mentores como moderadores y reglas claras de convivencia. No se
          recopila ni comparte información personal de los participantes.
        </p>
      </div>
      <div className="mt-6">
        {DISCORD_INVITE_URL ? (
          <a
            href={DISCORD_INVITE_URL}
            target="_blank"
            rel="noreferrer"
            className="inline-block rounded-full bg-green-mid px-6 py-3 font-semibold text-paper hover:bg-green"
          >
            Unirme al servidor
          </a>
        ) : (
          <button
            type="button"
            disabled
            className="inline-block rounded-full bg-paper-alt px-6 py-3 font-semibold text-ink-soft/60"
          >
            Enlace de invitación próximamente
          </button>
        )}
      </div>

      {/* IEEE */}
      <div className="section-divider mt-16">
        <h2 className="shrink-0 text-2xl font-bold text-ink">Rama Estudiantil IEEE UAEMéx</h2>
      </div>
      <p className="mt-4 max-w-2xl text-ink-soft">
        Conecta con capítulos técnicos, eventos y una red profesional internacional a través de sus
        actividades presenciales dentro de la facultad.
      </p>
      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {chapters.map((chapter) => (
          <div key={chapter.name} className="rounded-xl bg-paper-alt p-5">
            <h3 className="text-lg font-bold text-green-mid">{chapter.name}</h3>
            <p className="mt-2 text-sm text-ink-soft">{chapter.focus}</p>
          </div>
        ))}
      </div>
      <p className="mt-3 text-xs text-ink-soft/70">
        Lista de referencia — pendiente de confirmar contra los capítulos activos actuales de la rama.
      </p>

      <h3 className="mt-8 text-lg font-bold text-ink">Próximos eventos</h3>
      {events.length === 0 ? (
        <p className="mt-2 text-ink-soft">
          Aún no hay eventos publicados. Esta sección se conectará a la agenda de la rama estudiantil.
        </p>
      ) : (
        <ul className="mt-2 space-y-2">
          {events.map((event) => (
            <li key={event.name}>{event.name}</li>
          ))}
        </ul>
      )}

      {/* Más comunidad */}
      <div className="section-divider mt-16">
        <h2 className="shrink-0 text-2xl font-bold text-ink">Más comunidad universitaria</h2>
      </div>
      <p className="mt-4 max-w-2xl text-ink-soft">
        Espacio reservado para seguir integrando la vida estudiantil de la facultad: sociedad de
        alumnos, clubes, voluntariado, movilidad y más.
      </p>
      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {moreCommunity.map((item) => (
          <div key={item.name} className="rounded-xl border border-dashed border-ink/15 p-5">
            <h3 className="font-bold text-ink">{item.name}</h3>
            <p className="mt-2 text-sm text-ink-soft">{item.description}</p>
            <p className="mt-3 text-xs font-medium text-gold-dark uppercase">Próximamente</p>
          </div>
        ))}
      </div>
    </section>
  )
}

export default Community

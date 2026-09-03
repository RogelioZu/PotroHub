import { Link } from 'react-router-dom'

const chapters = [
  { name: 'Computer Society', focus: 'Software, IA y ciencias de la computación.' },
  { name: 'Robotics and Automation', focus: 'Robótica, control y sistemas autónomos.' },
  { name: 'Power & Energy Society', focus: 'Sistemas eléctricos y energías renovables.' },
  { name: 'Women in Engineering', focus: 'Inclusión y liderazgo de mujeres en ingeniería.' },
]

const events = []

function Ieee() {
  return (
    <section className="mx-auto max-w-6xl px-6 py-16">
      <p className="text-sm font-semibold tracking-widest text-gold-dark uppercase">Inmersión universitaria</p>
      <h1 className="mt-2 text-4xl font-bold text-ink">Rama Estudiantil IEEE UAEMéx</h1>
      <p className="mt-4 max-w-2xl text-ink-soft">
        La Rama Estudiantil IEEE de la Facultad de Ingeniería conecta a estudiantes con capítulos
        técnicos, eventos y una red profesional internacional. Aquí encontrarás cómo acercarte a sus
        actividades presenciales dentro de la facultad.
      </p>

      <div className="section-divider mt-12">
        <h2 className="shrink-0 text-2xl font-bold text-ink">Capítulos técnicos</h2>
      </div>
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

      <div className="section-divider mt-12">
        <h2 className="shrink-0 text-2xl font-bold text-ink">Próximos eventos</h2>
      </div>
      {events.length === 0 ? (
        <p className="mt-4 text-ink-soft">
          Aún no hay eventos publicados. Esta sección se conectará a la agenda de la rama estudiantil.
        </p>
      ) : (
        <ul className="mt-4 space-y-2">
          {events.map((event) => (
            <li key={event.name}>{event.name}</li>
          ))}
        </ul>
      )}

      <div className="mt-12">
        <Link
          to="/comunidad"
          className="inline-block rounded-full bg-green-mid px-6 py-3 font-semibold text-paper hover:bg-green"
        >
          Conectar con la comunidad
        </Link>
      </div>
    </section>
  )
}

export default Ieee

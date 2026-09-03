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
      <p className="text-sm tracking-widest text-potro-gold-light uppercase">Inmersión universitaria</p>
      <h1 className="mt-2 font-display text-4xl text-potro-white">Rama Estudiantil IEEE UAEMéx</h1>
      <p className="mt-4 max-w-2xl text-potro-white-soft">
        La Rama Estudiantil IEEE de la Facultad de Ingeniería conecta a estudiantes con capítulos
        técnicos, eventos y una red profesional internacional. Aquí encontrarás cómo acercarte a sus
        actividades presenciales dentro de la facultad.
      </p>

      <h2 className="mt-12 font-display text-2xl text-potro-white">Capítulos técnicos</h2>
      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {chapters.map((chapter) => (
          <div key={chapter.name} className="rounded-xl border border-potro-gold/15 p-5">
            <h3 className="font-display text-lg text-potro-gold-light">{chapter.name}</h3>
            <p className="mt-2 text-sm text-potro-white-soft">{chapter.focus}</p>
          </div>
        ))}
      </div>
      <p className="mt-3 text-xs text-potro-white-soft/60">
        Lista de referencia — pendiente de confirmar contra los capítulos activos actuales de la rama.
      </p>

      <h2 className="mt-12 font-display text-2xl text-potro-white">Próximos eventos</h2>
      {events.length === 0 ? (
        <p className="mt-4 text-potro-white-soft">
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
          className="inline-block rounded-full bg-potro-green px-6 py-3 font-medium text-potro-white hover:bg-potro-green-light"
        >
          Conectar con la comunidad
        </Link>
      </div>
    </section>
  )
}

export default Ieee

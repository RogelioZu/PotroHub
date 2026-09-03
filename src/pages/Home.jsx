import { Link } from 'react-router-dom'
import VitralShowcase from '../components/ui/VitralShowcase'

const areas = [
  { name: 'Software', description: 'Desarrollo de aplicaciones, ingeniería de software y arquitectura de sistemas.' },
  { name: 'Hardware', description: 'Diseño de sistemas embebidos, electrónica digital y prototipado.' },
  { name: 'Redes', description: 'Infraestructura, telecomunicaciones y administración de redes.' },
  { name: 'Bases de datos', description: 'Modelado, administración y explotación de datos.' },
  { name: 'Administración TI', description: 'Gestión de proyectos, procesos e infraestructura tecnológica.' },
]

function Home() {
  return (
    <>
      <section className="mx-auto grid max-w-6xl gap-10 px-6 py-16 md:grid-cols-2 md:items-center md:py-24">
        <div>
          <p className="font-body text-sm tracking-widest text-potro-gold-light uppercase">
            Facultad de Ingeniería · UAEMéx
          </p>
          <h1 className="mt-3 font-display text-4xl leading-tight text-potro-white md:text-5xl">
            Encuentra tu <span className="text-gradient-gold">ruta</span> dentro de la Ingeniería en Computación
          </h1>
          <p className="mt-5 text-potro-white-soft">
            Un diagnóstico de 50 preguntas basadas en escenarios reales de la industria identifica tu afinidad
            hacia Software, Hardware, Redes, Bases de Datos o Administración, y te conecta con materias,
            certificaciones y comunidades para avanzar de inmediato.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Link
              to="/quiz"
              className="rounded-full bg-potro-green px-6 py-3 font-medium text-potro-white transition-colors hover:bg-potro-green-light"
            >
              Comenzar diagnóstico
            </Link>
            <Link
              to="/ieee"
              className="rounded-full border border-potro-gold/40 px-6 py-3 font-medium text-potro-white-soft transition-colors hover:border-potro-gold-light hover:text-potro-gold-light"
            >
              Conoce IEEE UAEMéx
            </Link>
          </div>
        </div>
        <VitralShowcase />
      </section>

      <section className="border-t border-potro-gold/10 bg-potro-black-soft/50 py-16">
        <div className="mx-auto max-w-6xl px-6">
          <h2 className="font-display text-2xl text-potro-white">Áreas de especialización</h2>
          <p className="mt-2 text-potro-white-soft">
            El diagnóstico evalúa tu afinidad con cada una de estas cinco áreas.
          </p>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {areas.map((area) => (
              <div
                key={area.name}
                className="rounded-xl border border-potro-gold/15 bg-potro-black p-5 transition-colors hover:border-potro-gold/40"
              >
                <h3 className="font-display text-lg text-potro-gold-light">{area.name}</h3>
                <p className="mt-2 text-sm text-potro-white-soft">{area.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}

export default Home

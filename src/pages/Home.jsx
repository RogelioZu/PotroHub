import { Link } from 'react-router-dom'
import VitralShowcase from '../components/ui/VitralShowcase'

const areas = [
  { name: 'Software', description: 'Desarrollo de aplicaciones, ingeniería de software y arquitectura de sistemas.', tone: 'from-green to-green-mid' },
  { name: 'Hardware', description: 'Diseño de sistemas embebidos, electrónica digital y prototipado.', tone: 'from-gold-dark to-gold' },
  { name: 'Redes', description: 'Infraestructura, telecomunicaciones y administración de redes.', tone: 'from-green-mid to-green' },
  { name: 'Bases de datos', description: 'Modelado, administración y explotación de datos.', tone: 'from-gold to-gold-dark' },
  { name: 'Administración TI', description: 'Gestión de proyectos, procesos e infraestructura tecnológica.', tone: 'from-green to-gold-dark' },
]

function Home() {
  return (
    <>
      <section className="mx-auto grid max-w-6xl gap-10 px-6 py-16 md:grid-cols-2 md:items-center md:py-24">
        <div>
          <p className="text-sm font-semibold tracking-widest text-gold-dark uppercase">
            Facultad de Ingeniería · UAEMéx
          </p>
          <h1 className="mt-3 text-4xl leading-tight font-bold text-ink md:text-5xl">
            Encuentra tu <span className="text-gradient-gold">ruta</span> dentro de la Ingeniería en
            Computación
          </h1>
          <p className="mt-5 text-ink-soft">
            Un diagnóstico de 50 preguntas basadas en escenarios reales de la industria identifica tu afinidad
            hacia Software, Hardware, Redes, Bases de Datos o Administración, y te conecta con materias,
            certificaciones y comunidades para avanzar de inmediato.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Link
              to="/quiz"
              className="rounded-full bg-gold px-6 py-3 font-semibold text-ink shadow-sm transition-colors hover:bg-gold-dark hover:text-paper"
            >
              Comenzar diagnóstico
            </Link>
            <Link
              to="/ieee"
              className="rounded-full bg-green-mid px-6 py-3 font-semibold text-paper shadow-sm transition-colors hover:bg-green"
            >
              Conoce IEEE UAEMéx
            </Link>
          </div>
        </div>
        <VitralShowcase />
      </section>

      <section className="border-t border-ink/5 bg-paper-alt py-16">
        <div className="mx-auto max-w-6xl px-6">
          <div className="section-divider">
            <h2 className="shrink-0 text-2xl font-bold text-ink">Áreas de especialización</h2>
          </div>
          <p className="mt-4 text-ink-soft">
            El diagnóstico evalúa tu afinidad con cada una de estas cinco áreas.
          </p>
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-5">
            {areas.map((area) => (
              <div key={area.name} className="overflow-hidden rounded-xl bg-paper shadow-sm shadow-ink/5">
                <div className={`relative aspect-video bg-linear-to-br ${area.tone}`}>
                  <span className="absolute bottom-3 left-3 rounded-md bg-ink/70 px-3 py-1.5 text-sm font-medium text-paper">
                    {area.name}
                  </span>
                </div>
                <p className="p-4 text-sm text-ink-soft">{area.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}

export default Home

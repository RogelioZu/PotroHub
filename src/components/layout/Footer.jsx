import { Link } from 'react-router-dom'
import Reveal from '../motion/Reveal'
import VitralBackdrop from '../ui/VitralBackdrop'

const links = [
  { to: '/quiz', label: 'Diagnóstico' },
  // { to: '/resultados', label: 'Mi ruta' }, // oculto del nav por ahora, reactivar si se vuelve a necesitar
  { to: '/comunidad', label: 'Comunidad Facultad de Ingeniería' },
]

function Footer() {
  return (
    <footer className="relative overflow-hidden border-t-2 border-gold text-paper [text-shadow:0_1px_6px_rgb(0_0_0/75%)]">
      <VitralBackdrop scrimClassName="" />

      <Reveal className="relative z-10 mx-auto grid max-w-6xl gap-6 px-6 py-6 sm:grid-cols-3 sm:py-8">
        <div>
          <p className="text-lg font-bold text-paper">
            Potro<span className="text-gold-light">Path</span>
          </p>
          <p className="mt-2 text-sm text-paper">
            Facultad de Ingeniería — Universidad Autónoma del Estado de México (UAEMéx).
          </p>
        </div>
        <div>
          <p className="inline-block rounded-md bg-ink/75 px-3 py-1 text-sm font-semibold text-gold-light uppercase shadow-sm">
            Navegación
          </p>
          <ul className="mt-3 space-y-2 text-sm text-paper">
            {links.map((link) => (
              <li key={link.to}>
                <Link to={link.to} className="hover:text-gold-light">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <p className="inline-block rounded-md bg-ink/75 px-3 py-1 text-sm font-semibold text-gold-light uppercase shadow-sm">
            Proyecto
          </p>
          <p className="mt-3 text-sm text-paper">
            Proyecto estudiantil sin fines de lucro, presentado como Producto Mínimo Viable para la
            Facultad de Ingeniería.
          </p>
        </div>
      </Reveal>
    </footer>
  )
}

export default Footer

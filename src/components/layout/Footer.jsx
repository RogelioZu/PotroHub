import { Link } from 'react-router-dom'
import VitralBackdrop from '../ui/VitralBackdrop'

const links = [
  { to: '/quiz', label: 'Diagnóstico' },
  // { to: '/resultados', label: 'Mi ruta' }, // oculto del nav por ahora, reactivar si se vuelve a necesitar
  { to: '/comunidad', label: 'Comunidad Facultad de Ingeniería' },
]

function Footer() {
  return (
    <footer className="relative overflow-hidden border-t-2 border-gold text-paper">
      <VitralBackdrop scrimClassName="bg-ink/85" />

      <div className="relative z-10 mx-auto grid max-w-6xl gap-10 px-6 py-10 sm:grid-cols-3">
        <div>
          <p className="text-lg font-bold text-paper">
            Potro<span className="text-gold-light">Path</span>
          </p>
          <p className="mt-2 text-sm text-paper/70">
            Facultad de Ingeniería — Universidad Autónoma del Estado de México (UAEMéx).
          </p>
        </div>
        <div>
          <p className="text-sm font-semibold text-gold-light uppercase">Navegación</p>
          <ul className="mt-3 space-y-2 text-sm text-paper/70">
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
          <p className="text-sm font-semibold text-gold-light uppercase">Proyecto</p>
          <p className="mt-3 text-sm text-paper/70">
            Proyecto estudiantil sin fines de lucro, presentado como Producto Mínimo Viable para la
            Facultad de Ingeniería.
          </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer

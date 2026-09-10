import { Link } from 'react-router-dom'
import Reveal from '../motion/Reveal'
import VitralBackdrop from '../ui/VitralBackdrop'

const links = [
  { to: '/quiz', label: 'Diagnóstico' },
  { to: '/comunidad', label: 'Comunidad Facultad de Ingeniería' },
]

/**
 * Las dos frases que cargan la credibilidad institucional —"Facultad de
 * Ingeniería — UAEMéx" y "Proyecto estudiantil…"— vivían aquí y eran el texto
 * menos legible del sitio: medianas de 5.98:1 y 2.96:1, con sólo 63% y 36% de
 * sus píxeles por encima del umbral. Un evaluador lee el footer.
 *
 * Sobre la franja de tinta, `Papel` da 6.09:1 a cualquier tamaño; `Oro Claro`
 * da 3.63:1, que alcanza para texto grande y no para 14px. Por eso las
 * etiquetas de columna pasaron a `Papel` —el versalitas y el tracking ya las
 * distinguen— y el oro se queda donde sí califica: la marca, subida a 20px en
 * negrita para entrar en el umbral de texto grande.
 */
function Footer() {
  return (
    <footer className="relative overflow-hidden border-t-2 border-gold text-paper [text-shadow:0_1px_6px_rgb(0_0_0/75%)]">
      <VitralBackdrop />

      <Reveal className="relative z-10 mx-auto grid max-w-6xl gap-10 px-6 py-10 sm:grid-cols-3">
        <div>
          <p className="text-xl font-bold text-paper">
            Potro<span className="text-gold-light">Path</span>
          </p>
          <p className="mt-2 text-sm text-paper">
            Facultad de Ingeniería — Universidad Autónoma del Estado de México (UAEMéx).
          </p>
        </div>
        <div>
          <p className="text-sm font-semibold tracking-widest text-paper uppercase">Navegación</p>
          {/* El relleno del enlace hace de separación: 32px de objetivo
              táctil por elemento, en vez de 20px con un hueco entre ellos. */}
          <ul className="mt-1.5 text-sm text-paper">
            {links.map((link) => (
              <li key={link.to}>
                <Link to={link.to} className="inline-block py-1.5 hover:text-gold-light">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <p className="text-sm font-semibold tracking-widest text-paper uppercase">Proyecto</p>
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

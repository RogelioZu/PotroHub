import { Link } from 'react-router-dom'

/*
 * El pie lleva las dos frases que cargan la credibilidad del proyecto
 * —quién lo hace y qué no es— y por eso es papel sobre verde profundo, no
 * texto sobre el vitral: sobre el vidrio esas frases medían 3.01:1 de
 * mediana y eran lo menos legible del sitio. El vitral queda como firma en
 * la franja inferior.
 */
function Footer() {
  return (
    <footer className="site-footer">
      <div className="page-shell footer-grid">
        <div>
          <p className="text-2xl font-semibold tracking-tight">
            Potro<span className="text-gold-light">Path</span>
          </p>
          <p className="mt-3 max-w-sm text-sm text-paper/85">
            Tu siguiente paso en Computación empieza con una buena pregunta.
          </p>
          <p className="mt-5 text-xs text-paper/80">
            Facultad de Ingeniería · Universidad Autónoma del Estado de México
          </p>
        </div>

        <nav aria-label="Recorrido">
          <p className="eyebrow mb-2 text-gold-light">Tu recorrido</p>
          <Link to="/quiz">Diagnóstico</Link>
          <Link to="/resultados">Mi ruta</Link>
          <Link to="/comunidad">Comunidad</Link>
        </nav>

        <div>
          <p className="eyebrow mb-3 text-gold-light">Hecho para estudiantes</p>
          <p className="text-sm text-paper/85">
            Sin registro. Tus respuestas se guardan únicamente en este navegador y no se envían a
            ningún servidor.
          </p>
        </div>
      </div>

      <div className="page-shell footer-bottom">
        Proyecto estudiantil sin fines de lucro, presentado como Producto Mínimo Viable. Las empresas
        y credenciales citadas son referencias públicas, no entidades asociadas a PotroPath.
      </div>
      <div className="brand-ribbon" aria-hidden="true" />
    </footer>
  )
}

export default Footer

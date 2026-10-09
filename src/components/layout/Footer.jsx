import { useState } from 'react'
import { Link } from 'react-router-dom'

/*
 * El pie es el vitral real de la biblioteca de la Facultad de Ingeniería a
 * todo el ancho, con el contenido encima.
 *
 * Legibilidad: el texto se apoya en la franja de lectura (`.footer-scrim`,
 * tinta al 72%), el mínimo que lleva `Papel` a 4.5:1 incluso sobre el panel
 * más claro del vidrio. Por eso todo el texto pequeño va en `Papel` a
 * opacidad plena, y el oro claro sólo aparece en "Path", que a 24px en
 * negrita califica como texto grande (3:1). Sin la franja, estas frases
 * medían 3.01:1 de mediana y eran lo menos legible del sitio.
 *
 * Rendimiento: la fotografía pesa 207 KB y está siempre bajo el pliegue, así
 * que es un `<img loading="lazy">` y no un `background-image`, que el
 * navegador descargaría al cargar cualquier página. Si no llega, el pie se
 * queda en verde profundo y sigue siendo legible.
 */
function Footer() {
  const [vitralFailed, setVitralFailed] = useState(false)

  return (
    <footer className="site-footer">
      <div className="footer-backdrop" aria-hidden="true">
        {!vitralFailed && (
          <img
            src="/images/vitral-biblioteca.webp"
            alt=""
            loading="lazy"
            decoding="async"
            onError={() => setVitralFailed(true)}
          />
        )}
        <div className="footer-scrim" />
      </div>

      <div className="relative">
        <div className="page-shell footer-grid">
          <div>
            <p className="footer-brand">
              Potro<span className="text-gold-light">Path</span>
            </p>
            <p className="mt-3 max-w-sm text-sm">
              Tu siguiente paso en Computación empieza con una buena pregunta.
            </p>
            <p className="mt-5 text-sm">
              Facultad de Ingeniería · Universidad Autónoma del Estado de México
            </p>
          </div>

          <nav aria-label="Recorrido">
            <p className="eyebrow mb-2">Tu recorrido</p>
            <Link to="/quiz">Diagnóstico</Link>
            <Link to="/resultados">Mi ruta</Link>
            <Link to="/comunidad">Comunidad</Link>
          </nav>

          <div>
            <p className="eyebrow mb-3">Hecho para estudiantes</p>
            <p className="text-sm">
              Sin registro. Tus respuestas se guardan en este navegador. Sólo se envían si pides
              afinar tu ruta, y antes de hacerlo te decimos qué sale y a quién.
            </p>
          </div>
        </div>

        <div className="page-shell footer-bottom">
          Proyecto estudiantil sin fines de lucro, presentado como Producto Mínimo Viable. Las
          empresas y credenciales citadas son referencias públicas, no entidades asociadas a
          PotroPath.
        </div>
      </div>
    </footer>
  )
}

export default Footer

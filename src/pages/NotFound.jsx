import { Link } from 'react-router-dom'
import Reveal from '../components/motion/Reveal'
import { useDocumentTitle } from '../lib/useDocumentTitle'

function NotFound() {
  useDocumentTitle('Página no encontrada — PotroPath')

  return (
    <Reveal
      as="section"
      // `flex-1` + `justify-center`: la columna del layout mide `min-h-svh` y
      // esta pantalla tiene tres líneas de contenido, así que sin centrar
      // quedaba pegada arriba con un vacío de casi media pantalla debajo. El
      // `py-24` se queda como aire mínimo cuando la ventana es baja.
      // `max-w-2xl` y no `max-w-6xl`: por la regla de los Dos Anchos esto es
      // una pantalla de lectura, y a 72rem la línea del párrafo se iba muy por
      // encima de la medida cómoda.
      className="mx-auto flex max-w-2xl flex-1 flex-col items-center justify-center gap-4 px-6 py-24 text-center"
      stagger={{ amount: 0.12 }}
    >
      <h1 className="h1">Página no encontrada</h1>
      <p className="lead">
        La dirección que abriste no corresponde a ninguna página de PotroPath. Desde aquí puedes
        volver a empezar.
      </p>
      {/*
        El 404 llevaba un solo enlace de vuelta al inicio. Es también donde cae
        un enlace mal copiado desde WhatsApp, así que ofrece además la tarea
        que el visitante venía a hacer.
      */}
      <div className="mt-2 flex flex-wrap justify-center gap-4">
        <Link to="/quiz" className="btn-green">
          Comenzar diagnóstico
        </Link>
        <Link to="/" className="btn-outline">
          Volver al inicio
        </Link>
      </div>
    </Reveal>
  )
}

export default NotFound

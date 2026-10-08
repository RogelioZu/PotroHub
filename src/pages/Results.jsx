import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import CareerExplorer from '../components/results/CareerExplorer'
import CredentialExplorer from '../components/results/CredentialExplorer'
import SkillPath from '../components/results/SkillPath'
import ConfirmButton from '../components/ui/ConfirmButton'
import { AREAS, AREA_BY_ID } from '../data/areas'
import { QUESTIONS } from '../data/questions'
import { ROADMAP } from '../data/roadmap'
import { summarizeAffinity } from '../lib/affinity'
import { useDocumentTitle } from '../lib/useDocumentTitle'
import { MIN_PERCENTAGE, NEUTRAL_PERCENTAGE, useQuizStore } from '../store/quizStore'

/**
 * Sin las 50 respuestas no hay resultados parciales: con una sesión a medias
 * los porcentajes pueden caer debajo del piso de 20% y se leerían como un
 * perfil. La pantalla dice cuánto falta y lleva de vuelta al diagnóstico.
 */
function EmptyState({ answered }) {
  useDocumentTitle('Tu ruta empieza aquí — PotroPath')

  return (
    <section className="page-shell section-py flex flex-1 items-center">
      <div className="dark-panel mx-auto grid max-w-3xl items-center gap-8 md:grid-cols-[1fr_auto]">
        <div>
          <p className="eyebrow">Primero, conócete un poco más</p>
          <h1 className="h1 mt-5">Tu ruta está por descubrirse.</h1>
          <p className="mt-6 text-paper/85">
            {answered > 0
              ? `Llevas ${answered} de ${QUESTIONS.length} respuestas. Continúa donde te quedaste para ver tu perfil completo.`
              : `Responde ${QUESTIONS.length} afirmaciones sobre lo que disfrutas. Después podrás explorar habilidades, credenciales y trabajos relacionados.`}
          </p>
          <Link to="/quiz" className="btn-light mt-8">
            {answered > 0 ? 'Continuar diagnóstico' : 'Descubrir mi ruta'}{' '}
            <span aria-hidden="true">↗</span>
          </Link>
        </div>
        {/* La mascota de la universidad: el único guiño de esta pantalla, sin
            rebote ni animación. Va en recuadro de papel porque es un activo
            ajeno a la paleta. */}
        <img
          src="/images/potro-mascota.webp"
          alt=""
          className="hidden h-36 w-auto rounded-2xl bg-paper p-2 md:block"
        />
      </div>
    </section>
  )
}

/** Barras de afinidad con el punto neutral marcado sobre cada pista. */
function AffinityBars({ results, topPercentage }) {
  return (
    <ol className="mt-5">
      {results.map(({ areaId, percentage }, index) => (
        <li key={areaId} className="affinity-row" data-top={percentage === topPercentage}>
          <div className="flex items-center justify-between gap-4 text-sm">
            <span>
              <span className="source-note number mr-3">0{index + 1}</span>
              {AREA_BY_ID[areaId].name}
            </span>
            <strong className="number">{percentage}%</strong>
          </div>
          <div className="affinity-track" aria-hidden="true">
            <div className="affinity-fill" style={{ transform: `scaleX(${percentage / 100})` }} />
            <span className="affinity-neutral" style={{ left: `${NEUTRAL_PERCENTAGE}%` }} />
          </div>
        </li>
      ))}
    </ol>
  )
}

function ResultsView({ results, answers, onRetake }) {
  const { top, tied, isTie, allNeutral } = summarizeAffinity(results, answers)
  const topArea = AREA_BY_ID[top.areaId]

  // El área explorada empieza en el primer resultado, pero es una elección
  // del estudiante: cambiarla no toca respuestas ni porcentajes. Con empate,
  // ese estado inicial no es una recomendación — el titular lo dice.
  const [exploringId, setExploringId] = useState(top.areaId)
  const exploring = AREA_BY_ID[exploringId]
  const route = ROADMAP[exploringId]

  let headline = topArea.name
  let explanation = topArea.description
  if (allNeutral) {
    headline = 'Tu camino aún está abierto.'
    explanation =
      'Respondiste «Neutral» en todas las afirmaciones, así que no aparece una preferencia definida. Explora las cinco rutas antes de elegir un primer proyecto.'
  } else if (isTie) {
    headline = 'Hay más de un camino para ti.'
    explanation = `Comparten el primer lugar: ${tied.map((result) => AREA_BY_ID[result.areaId].name).join(', ')}. Cualquiera de estas rutas es un buen punto de partida.`
  }

  useDocumentTitle(isTie ? 'Tu perfil de afinidad — PotroPath' : `Tu ruta: ${topArea.name} — PotroPath`)

  return (
    <div className="page-shell pb-16">
      <div className="flex flex-wrap items-center justify-between gap-4 pt-10 pb-6">
        <p className="eyebrow">Tu diagnóstico · Completado</p>
        <span className="pill bg-green-soft">
          {QUESTIONS.length} de {QUESTIONS.length} respuestas · guardadas en este navegador
        </span>
      </div>

      <div className="result-grid">
        <section className="dark-panel flex flex-col justify-between" aria-labelledby="resultado">
          <div>
            <p className="eyebrow">{isTie ? 'Tu punto de partida' : 'Tu mayor afinidad'}</p>
            <h1 id="resultado" className="h1 mt-5">
              {headline}
            </h1>
            <p className="mt-5 text-paper/85">{explanation}</p>
          </div>
          <div className="mt-8 flex flex-wrap items-end justify-between gap-6 border-t border-paper/20 pt-6">
            <div>
              <p className="result-number number">
                {top.percentage}
                <span className="ml-1 text-2xl">%</span>
              </p>
              <p className="mt-3 text-xs text-paper/80">
                {isTie ? 'Afinidad compartida más alta' : 'Afinidad con tus intereses'}
              </p>
            </div>
            <a href="#ruta" className="btn-light">
              Explorar rutas <span aria-hidden="true">↓</span>
            </a>
          </div>
        </section>

        <section className="surface panel-pad" aria-labelledby="panorama">
          <p className="eyebrow">El panorama completo</p>
          <h2 id="panorama" className="h3 mt-2">
            Cinco áreas. Tu propia combinación.
          </h2>
          <AffinityBars results={results} topPercentage={top.percentage} />
          <p className="mt-6 text-xs muted">
            La línea blanca marca {NEUTRAL_PERCENTAGE}%, el punto neutral. Mide afinidad con lo que
            te interesa, no una calificación de tus capacidades.
          </p>
          <details className="mt-1 text-xs muted">
            <summary className="py-3 font-semibold underline underline-offset-4">
              Cómo se calcula
            </summary>
            <p className="pb-2">
              Cada área suma diez respuestas de 1 a 5 sobre un máximo de 50 puntos. Con el
              diagnóstico completo la escala va de {MIN_PERCENTAGE}% a 100%, y {NEUTRAL_PERCENTAGE}%
              es el punto neutral. Las áreas se miden por separado: los porcentajes no suman 100 ni
              representan probabilidad de empleo.
            </p>
          </details>
        </section>
      </div>

      <nav aria-label="Secciones de tu ruta" className="anchor-nav">
        <a href="#habilidades">
          <span>01</span>Habilidades
        </a>
        <a href="#credenciales">
          <span>02</span>Credenciales
        </a>
        <a href="#puestos">
          <span>03</span>Puestos tech
        </a>
        <a href="#oportunidades">
          <span>04</span>Oportunidades
        </a>
      </nav>

      <section id="ruta" className="pt-12" aria-labelledby="ruta-titulo">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Tú decides qué explorar</p>
            <h2 id="ruta-titulo" className="h2">
              Un resultado. Muchas posibilidades.
            </h2>
          </div>
          <p className="section-note">Cambiar de ruta no modifica tus respuestas ni tus porcentajes.</p>
        </div>

        <div className="choice-group" role="group" aria-label="Especialidad a explorar">
          {AREAS.map((area) => (
            <button
              key={area.id}
              type="button"
              className="choice"
              aria-pressed={exploringId === area.id}
              onClick={() => setExploringId(area.id)}
            >
              {area.name}
              <span className="number opacity-75">
                {results.find((result) => result.areaId === area.id).percentage}%
              </span>
            </button>
          ))}
        </div>

        <div className="route-intro" aria-live="polite">
          <div>
            <p className="eyebrow mb-3">Explorando · {exploring.name}</p>
            <h3 className="h2">{route.headline}</h3>
            <p className="mt-4 max-w-2xl text-sm muted">{route.intro}</p>
          </div>
          <img src={exploring.image} alt="" loading="lazy" />
        </div>
      </section>

      {/* La `key` reinicia cada explorador al cambiar de área: la habilidad,
          la comparación y el puesto elegidos pertenecían a la ruta anterior. */}
      <SkillPath key={`habilidades-${exploringId}`} route={route} />
      <CredentialExplorer key={`credenciales-${exploringId}`} ids={route.credentialIds} />
      <CareerExplorer key={`puestos-${exploringId}`} areaId={exploringId} />

      <div className="surface panel-pad flex flex-wrap items-center justify-between gap-6">
        <div>
          <p className="eyebrow">El siguiente paso también se da en equipo</p>
          <h2 className="h3 mt-2">Encuentra personas con tus mismos intereses.</h2>
        </div>
        <Link to={`/comunidad?area=${exploringId}#especialidades`} className="btn-green">
          Explorar comunidad de {exploring.name} <span aria-hidden="true">↗</span>
        </Link>
      </div>

      <div className="mt-8 flex flex-wrap items-center justify-between gap-4">
        <p className="source-note">Tus intereses pueden cambiar. Esta ruta es un punto de partida.</p>
        <ConfirmButton
          label="Repetir diagnóstico"
          confirmLabel={`¿Seguro? Se borran tus ${QUESTIONS.length} respuestas`}
          onConfirm={onRetake}
        />
      </div>
    </div>
  )
}

function Results() {
  const navigate = useNavigate()
  const answers = useQuizStore((state) => state.answers)
  const computeResults = useQuizStore((state) => state.computeResults)
  const reset = useQuizStore((state) => state.reset)

  const answered = Object.keys(answers).length
  if (answered < QUESTIONS.length) return <EmptyState answered={answered} />

  const handleRetake = () => {
    reset()
    navigate('/quiz')
  }

  return <ResultsView results={computeResults()} answers={answers} onRetake={handleRetake} />
}

export default Results

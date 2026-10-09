import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import CareerExplorer from '../components/results/CareerExplorer'
import CredentialExplorer from '../components/results/CredentialExplorer'
import SkillPath from '../components/results/SkillPath'
import ConfirmButton from '../components/ui/ConfirmButton'
import RefinePanel from '../components/ui/RefinePanel'
import { AREAS, AREA_BY_ID } from '../data/areas'
import { CREDENTIALS } from '../data/credentials'
import { QUESTIONS } from '../data/questions'
import { ROADMAP } from '../data/roadmap'
import { summarizeAffinity } from '../lib/affinity'
import { pickFocus } from '../lib/refine'
import { useDocumentTitle } from '../lib/useDocumentTitle'
import { MIN_PERCENTAGE, NEUTRAL_PERCENTAGE, useQuizStore } from '../store/quizStore'

/** Las cuatro partes de una ruta, en el orden en que se recorren. */
const SECTIONS = [
  { id: 'habilidades', label: 'Aprende' },
  { id: 'credenciales', label: 'Acredita' },
  { id: 'puestos', label: 'Conoce el rol' },
  { id: 'oportunidades', label: 'Busca' },
]

/**
 * Nombres cortos para la barra fija: con los cinco nombres completos y sus
 * porcentajes la barra no cabía junto a las secciones ni a 1440px. El nombre
 * completo sigue en `aria-label` y en todo el resto de la página.
 */
const SHORT_NAMES = {
  ia: 'IA',
  ciberseguridad: 'Ciberseguridad',
  nube: 'Cloud',
  'ciencia-datos': 'Datos',
  software: 'Software',
}

/**
 * Sin las 50 respuestas no hay resultados parciales: con una sesión a medias
 * los porcentajes pueden caer debajo del piso de 20% y se leerían como un
 * perfil. La pantalla dice cuánto falta y lleva de vuelta al diagnóstico.
 */
function EmptyState({ answered }) {
  useDocumentTitle('Tu ruta empieza aquí — PotroPath')

  return (
    <section className="page-shell section-py flex flex-1 items-center">
      <div className="dark-panel enter mx-auto grid max-w-3xl items-center gap-8 md:grid-cols-[1fr_auto]">
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
        {/* La mascota de la universidad: el único guiño de esta pantalla. Va
            en recuadro de papel porque es un activo ajeno a la paleta. */}
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
            <div
              className="affinity-fill"
              style={{ transform: `scaleX(${percentage / 100})`, '--i': index }}
            />
            <span className="affinity-neutral" style={{ left: `${NEUTRAL_PERCENTAGE}%` }} />
          </div>
        </li>
      ))}
    </ol>
  )
}

/**
 * La síntesis de la ruta en tres acciones concretas, antes del detalle:
 * la primera habilidad, su entregable y la comunidad del área. Todo sale de
 * los mismos datos que las secciones de abajo; no hay contenido nuevo.
 */
function FirstStep({ area, route }) {
  const skill = route.learning[0]
  const credential = CREDENTIALS[route.credentialIds[0]]

  return (
    <section className="reveal mt-12" aria-labelledby="primer-paso">
      <p className="eyebrow">Para esta semana</p>
      <h2 id="primer-paso" className="h2 mt-2 mb-6">
        Tu primer paso en {area.name}.
      </h2>
      <ol key={area.id} className="first-step swap-in">
        <li>
          <span className="first-step-index">1</span>
          <p className="source-note mt-2">Aprende</p>
          <h3 className="h3">{skill.name}</h3>
          <p className="text-sm muted">{skill.purpose}</p>
          <a href="#habilidades" className="text-link">
            Ver la ruta de habilidades <span aria-hidden="true">↓</span>
          </a>
        </li>
        <li>
          <span className="first-step-index">2</span>
          <p className="source-note mt-2">Practica</p>
          <h3 className="h3">Tu primer entregable</h3>
          <p className="text-sm muted">{skill.project}</p>
          <a href="#credenciales" className="text-link">
            Cuando quieras acreditarlo: {credential.name} <span aria-hidden="true">↓</span>
          </a>
        </li>
        <li>
          <span className="first-step-index">3</span>
          <p className="source-note mt-2">Comparte</p>
          <h3 className="h3">Con quien tiene tu mismo interés</h3>
          <p className="text-sm muted">
            Conoce las ideas para aprender en equipo y los espacios de la facultad para {area.name}.
          </p>
          <Link to={`/comunidad?area=${area.id}#especialidades`} className="text-link">
            Ir a la comunidad <span aria-hidden="true">↗</span>
          </Link>
        </li>
      </ol>
    </section>
  )
}

/**
 * Barra fija de exploración: qué área estoy viendo, cambiarla sin subir, y
 * en qué parte de su ruta voy. Antes el selector quedaba muy arriba y, ya en
 * credenciales o puestos, era fácil olvidar de qué área era el contenido.
 */
function RouteBar({ exploringId, onExplore }) {
  return (
    <div className="route-bar">
      <div className="page-shell route-bar-inner">
        <div className="route-bar-areas">
          <p className="eyebrow shrink-0">Explorando</p>
          <div className="choice-group" role="group" aria-label="Área a explorar">
            {AREAS.map((area) => (
              <button
                key={area.id}
                type="button"
                className="choice"
                aria-pressed={exploringId === area.id}
                aria-label={area.name}
                onClick={() => onExplore(area.id)}
              >
                {SHORT_NAMES[area.id]}
              </button>
            ))}
          </div>
        </div>
        <nav className="route-sections" aria-label="Partes de la ruta">
          {SECTIONS.map((section, index) => (
            <a key={section.id} href={`#${section.id}`}>
              <span>0{index + 1}</span>
              {section.label}
            </a>
          ))}
        </nav>
      </div>
    </div>
  )
}

function ResultsView({ results, answers, focus, onRetake }) {
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

  useDocumentTitle(
    isTie ? 'Tu perfil de afinidad — PotroPath' : `Tu ruta: ${topArea.name} — PotroPath`,
  )

  return (
    <>
      <div className="page-shell">
        <div className="enter flex flex-wrap items-center justify-between gap-4 pt-10 pb-6">
          <p className="eyebrow">Tu diagnóstico · Completado</p>
          <span className="pill bg-green-soft">
            {QUESTIONS.length} de {QUESTIONS.length} respuestas · guardadas en este navegador
          </span>
        </div>

        <div className="result-grid">
          <section
            className="dark-panel enter flex flex-col justify-between"
            style={{ '--d': 1 }}
            aria-labelledby="resultado"
          >
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
              <a href="#primer-paso" className="btn-light">
                Ver mi primer paso <span aria-hidden="true">↓</span>
              </a>
            </div>
          </section>

          <section
            className="surface panel-pad enter"
            style={{ '--d': 2 }}
            aria-labelledby="panorama"
          >
            <p className="eyebrow">El panorama completo</p>
            <h2 id="panorama" className="h3 mt-2">
              Cinco áreas. Tu propia combinación.
            </h2>
            <AffinityBars results={results} topPercentage={top.percentage} />
            <p className="mt-6 text-xs muted">
              La línea blanca marca {NEUTRAL_PERCENTAGE}%, el punto neutral. Mide afinidad con lo
              que te interesa, no una calificación de tus capacidades.
            </p>
            <details className="mt-1 text-xs muted">
              <summary className="py-3 font-semibold underline underline-offset-4">
                Cómo se calcula
              </summary>
              <p className="pb-2">
                Cada área suma diez respuestas de 1 a 5 sobre un máximo de 50 puntos. Con el
                diagnóstico completo la escala va de {MIN_PERCENTAGE}% a 100%, y{' '}
                {NEUTRAL_PERCENTAGE}% es el punto neutral. Las áreas se miden por separado: los
                porcentajes no suman 100 ni representan probabilidad de empleo.
              </p>
            </details>
          </section>
        </div>

        <RefinePanel
          areas={tied.map((result) => AREA_BY_ID[result.areaId])}
          focus={focus}
          routeArea={focus ? AREA_BY_ID[focus.areaId] : topArea}
        />

        <FirstStep area={exploring} route={route} />
      </div>

      {/* La zona de la ruta contiene a la barra fija: `position: sticky` se
          pega mientras su contenedor sigue en pantalla, y se suelta al
          llegar a la invitación final. */}
      <div id="ruta" className="route-zone mt-16">
        <RouteBar exploringId={exploringId} onExplore={setExploringId} />

        <div className="page-shell pb-16">
          <section className="route-intro" aria-live="polite">
            <div key={exploringId} className="swap-in">
              <p className="eyebrow mb-3">Tu ruta en {exploring.name}</p>
              <h2 className="h2">{route.headline}</h2>
              <p className="mt-4 max-w-2xl muted">{route.intro}</p>
              <p className="source-note mt-3">
                Cambiar de área no modifica tus respuestas ni tus porcentajes.
              </p>
            </div>
            <img src={exploring.image} alt="" loading="lazy" />
          </section>

          {/* La `key` reinicia cada explorador al cambiar de área: la
              habilidad, la comparación y el puesto elegidos pertenecían a la
              ruta anterior. */}
          <SkillPath key={`habilidades-${exploringId}`} route={route} areaName={exploring.name} />
          <CredentialExplorer
            key={`credenciales-${exploringId}`}
            ids={route.credentialIds}
            areaName={exploring.name}
          />
          <CareerExplorer key={`puestos-${exploringId}`} areaId={exploringId} />

          <div className="reveal surface panel-pad flex flex-wrap items-center justify-between gap-6">
            <div>
              <p className="eyebrow">El siguiente paso también se da en equipo</p>
              <h2 className="h3 mt-2">Encuentra personas con tus mismos intereses.</h2>
            </div>
            <Link to={`/comunidad?area=${exploringId}#especialidades`} className="btn-green">
              Explorar comunidad de {exploring.name} <span aria-hidden="true">↗</span>
            </Link>
          </div>

          <div className="mt-8 flex flex-wrap items-center justify-between gap-4">
            <p className="source-note">
              Tus intereses pueden cambiar. Esta ruta es un punto de partida.
            </p>
            <ConfirmButton
              label="Repetir diagnóstico"
              confirmLabel={`¿Seguro? Se borran tus ${QUESTIONS.length} respuestas`}
              onConfirm={onRetake}
            />
          </div>
        </div>
      </div>
    </>
  )
}

function Results() {
  const navigate = useNavigate()
  const answers = useQuizStore((state) => state.answers)
  const refinement = useQuizStore((state) => state.refinement)
  const computeResults = useQuizStore((state) => state.computeResults)
  const reset = useQuizStore((state) => state.reset)

  const answered = Object.keys(answers).length
  if (answered < QUESTIONS.length) return <EmptyState answered={answered} />

  const handleRetake = () => {
    reset()
    navigate('/quiz')
  }

  return (
    <ResultsView
      results={computeResults()}
      answers={answers}
      focus={pickFocus(refinement?.picks, answers)}
      onRetake={handleRetake}
    />
  )
}

export default Results

/**
 * POST /api/detonadoras — la única ida y vuelta al servidor de todo el sitio.
 *
 * Existe porque la llave de Cerebras no puede viajar en el bundle: lo que
 * llega al navegador lo puede leer cualquiera. Todo lo demás sigue del lado
 * del cliente, y esta llamada sólo ocurre cuando el estudiante pulsa "Afinar
 * mi ruta" después de leer qué se envía.
 *
 * Contrato (el mismo que tendrá que cumplir un reemplazo en PHP):
 *   cuerpo    { answers: { "<id de pregunta>": 1–5, … } }, las 50 y nada más
 *   200       { source: "ia", questions: [{ prompt, options: [{ text, focusId }] × 3 }] × 2 }
 *   400/403/413/503/502  { error: "<código>" } — el navegador usa el respaldo
 *
 * Es un endpoint público y sin sesión, así que lo único que acepta son
 * cincuenta números. No hay un campo de texto libre que pueda convertirse en
 * instrucciones para el modelo: el prompt lo arma este servidor, entero.
 */
import { QUESTIONS } from '../src/data/questions.js'
import { isValidAnswer } from '../src/lib/affinity.js'
import { generateTriggers } from './_qwen.js'

/** Cincuenta pares id–valor caben en ~1.5 KB; el resto es otra cosa. */
const MAX_BODY_LENGTH = 4096

function reply(body, status = 200) {
  return Response.json(body, { status, headers: { 'Cache-Control': 'no-store' } })
}

/**
 * `ALLOWED_ORIGIN` es una lista separada por comas. Sin ella se acepta
 * cualquier origen, que es lo cómodo en `vercel dev` y lo incorrecto en
 * producción. No es una defensa fuerte —un `curl` escribe el `Origin` que
 * quiera—, pero aparta a cualquier otro sitio que quisiera usar esta llave
 * desde el navegador de sus visitantes.
 */
function originAllowed(request) {
  const allowed = (process.env.ALLOWED_ORIGIN ?? '')
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean)
  return allowed.length === 0 || allowed.includes(request.headers.get('origin'))
}

/** Exactamente las cincuenta respuestas válidas, sin otro campo. */
function parseAnswers(body) {
  if (!body || typeof body !== 'object' || Array.isArray(body)) return null
  if (Object.keys(body).length !== 1 || !('answers' in body)) return null

  const { answers } = body
  if (!answers || typeof answers !== 'object' || Array.isArray(answers)) return null

  const entries = Object.entries(answers)
  if (entries.length !== QUESTIONS.length) return null
  return entries.every(([id, value]) => isValidAnswer(id, value)) ? answers : null
}

export async function POST(request) {
  if (!originAllowed(request)) return reply({ error: 'origen-no-permitido' }, 403)

  const text = await request.text()
  if (text.length > MAX_BODY_LENGTH) return reply({ error: 'cuerpo-demasiado-grande' }, 413)

  let body
  try {
    body = JSON.parse(text)
  } catch {
    return reply({ error: 'json-invalido' }, 400)
  }

  const answers = parseAnswers(body)
  if (!answers) return reply({ error: 'respuestas-invalidas' }, 400)

  const { CEREBRAS_API_KEY, QWEN_MODEL } = process.env
  if (!CEREBRAS_API_KEY || !QWEN_MODEL) return reply({ error: 'sin-configurar' }, 503)

  try {
    const { questions } = await generateTriggers(answers)
    return reply({ source: 'ia', questions })
  } catch (error) {
    // Sólo el tipo y el motivo. Las respuestas del estudiante no se escriben
    // en ningún log: no son datos personales, pero tampoco hay razón para
    // guardarlas en ningún lado.
    console.error(`detonadoras: ${error.name}: ${error.message}`)
    return reply({ error: 'ia-no-disponible' }, 502)
  }
}

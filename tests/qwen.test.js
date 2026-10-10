import assert from 'node:assert/strict'
import test from 'node:test'
import { generateTriggers, responseSchema } from '../api/_qwen.js'
import { QUESTIONS } from '../src/data/questions.js'
import { MAX_OPTION_LENGTH, MAX_PROMPT_LENGTH, OPTIONS_PER_TRIGGER, TRIGGER_COUNT } from '../src/lib/refine.js'

const IDS = ['ia-lenguaje', 'ia-vision', 'ia-modelado']

/** Todos los subesquemas, en profundidad, con la ruta para el mensaje de error. */
function walk(schema, path = 'raíz', found = []) {
  if (!schema || typeof schema !== 'object') return found
  found.push([path, schema])
  for (const [name, child] of Object.entries(schema.properties ?? {})) walk(child, `${path}.${name}`, found)
  for (const [index, child] of (schema.prefixItems ?? []).entries()) walk(child, `${path}[${index}]`, found)
  if (typeof schema.items === 'object') walk(schema.items, `${path}[]`, found)
  return found
}

// Cerebras responde 400 si el esquema estricto trae algo fuera de su
// subconjunto. Esta prueba existe para que eso se descubra aquí y no en
// producción, donde el estudiante sólo vería las preguntas de respaldo.
test('el esquema de las detonadoras usa sólo lo que el modo estricto de Cerebras acepta', () => {
  for (const [path, schema] of walk(responseSchema(IDS))) {
    for (const keyword of ['minItems', 'maxItems', 'minLength', 'maxLength', 'pattern', 'format', 'oneOf', 'allOf']) {
      assert.ok(!(keyword in schema), `${path} usa ${keyword}`)
    }
    if (schema.type === 'object') assert.equal(schema.additionalProperties, false, `${path} admite propiedades extra`)
    if (schema.type === 'array') assert.equal(schema.items, false, `${path} no fija su largo con prefixItems`)
  }
})

test('el esquema fija dos preguntas de tres opciones, cada una atada a los candidatos', () => {
  const questions = responseSchema(IDS).properties.questions.prefixItems
  assert.equal(questions.length, TRIGGER_COUNT)
  for (const question of questions) {
    const options = question.properties.options.prefixItems
    assert.equal(options.length, OPTIONS_PER_TRIGGER)
    for (const option of options) assert.deepEqual(option.properties.focusId.enum, IDS)
  }
})

/** IA arriba, todo lo demás abajo: los candidatos son los tres enfoques de IA. */
const ANSWERS = Object.fromEntries(QUESTIONS.map((question) => [question.id, question.areaId === 'ia' ? 4 : 2]))

const VALID = {
  questions: Array.from({ length: TRIGGER_COUNT }, (_, index) => ({
    prompt: `Situación ${index + 1}`,
    options: IDS.map((focusId) => ({ text: `Opción de ${focusId}`, focusId })),
  })),
}

/** Lo que diría Cerebras con un 200 y este contenido. */
const completion = (content) => Response.json({ choices: [{ message: { content } }], usage: {} })

/**
 * Sustituye `fetch` por las respuestas dadas, en orden, y anota el cuerpo de
 * cada llamada. Nada sale a la red ni gasta saldo.
 */
function mockFetch(t, ...responses) {
  const bodies = []
  t.mock.method(globalThis, 'fetch', async (_url, init) => {
    bodies.push(JSON.parse(init.body))
    return responses.shift()
  })
  return bodies
}

const OPTIONS = { apiKey: 'llave-de-prueba', model: 'qwen-de-prueba' }

test('si la primera respuesta no pasa la validación, reintenta una vez sin razonamiento', async (t) => {
  const tooLong = structuredClone(VALID)
  tooLong.questions[0].options[0].text = 'x'.repeat(200)
  const bodies = mockFetch(t, completion(JSON.stringify(tooLong)), completion(JSON.stringify(VALID)))

  const { questions, attempts } = await generateTriggers(ANSWERS, OPTIONS)

  assert.equal(attempts, 2)
  assert.equal(questions.length, TRIGGER_COUNT)
  assert.deepEqual(
    bodies.map((body) => body.reasoning_effort),
    ['low', 'none'],
  )
})

test('una respuesta sin JSON —el razonamiento llenó el tope— también se reintenta', async (t) => {
  mockFetch(t, completion(undefined), completion(JSON.stringify(VALID)))
  const { attempts } = await generateTriggers(ANSWERS, OPTIONS)
  assert.equal(attempts, 2)
})

test('un error de Cerebras no se reintenta: un 429 no se arregla insistiendo', async (t) => {
  const bodies = mockFetch(t, new Response('{}', { status: 429 }), completion(JSON.stringify(VALID)))
  await assert.rejects(generateTriggers(ANSWERS, OPTIONS), { name: 'QwenError', message: 'Cerebras respondió 429' })
  assert.equal(bodies.length, 1)
})

test('si el reintento también falla, el error llega al handler y entra el respaldo', async (t) => {
  mockFetch(t, completion('no es json'), completion('tampoco'))
  await assert.rejects(generateTriggers(ANSWERS, OPTIONS), { name: 'QwenError', message: 'la respuesta no es JSON' })
})

// Pedido en caracteres, Qwen los contaba letra por letra al razonar hasta
// agotar el tope. En palabras, a ocho caracteres cada una, queda margen.
test('el prompt pide los límites en palabras y por debajo de lo que exige la validación', async (t) => {
  const bodies = mockFetch(t, completion(JSON.stringify(VALID)))
  await generateTriggers(ANSWERS, OPTIONS)
  const system = bodies[0].messages[0].content
  const [, promptWords, optionWords] = system.match(/Enunciado de máximo (\d+) palabras; cada opción, una sola frase de máximo (\d+) palabras/)
  assert.ok(Number(promptWords) * 8 <= MAX_PROMPT_LENGTH)
  assert.ok(Number(optionWords) * 8 <= MAX_OPTION_LENGTH)
  assert.doesNotMatch(system, /máximo \d+ caracteres/)
})

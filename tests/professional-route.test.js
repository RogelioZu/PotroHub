import assert from 'node:assert/strict'
import test from 'node:test'
import { AREAS } from '../src/data/areas.js'
import { CAREERS } from '../src/data/careers.js'
import { CHAPTERS, GALLERY, INTERESTS, TEAMS_CHANNELS } from '../src/data/community.js'
import { CREDENTIALS } from '../src/data/credentials.js'
import { ROADMAP, STAGES } from '../src/data/roadmap.js'
import { formatReviewDate } from '../src/lib/format.js'
import { linkedInSearch } from '../src/lib/careerSearch.js'

const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/

test('cada área tiene una ruta completa en tres etapas, con propósito y entregable', () => {
  for (const area of AREAS) {
    const route = ROADMAP[area.id]
    assert.ok(route?.headline && route.intro && route.search, `Falta encabezado de ${area.id}`)

    const stages = [...new Set(route.learning.map((skill) => skill.stage))].sort()
    assert.deepEqual(stages, STAGES.map((_, index) => index), area.id)
    assert.equal(new Set(route.learning.map((skill) => skill.id)).size, route.learning.length)
    assert.ok(route.learning.every((skill) => skill.purpose && skill.project), area.id)
  }
})

test('cada área ofrece dos credenciales con fuente oficial y fecha de revisión', () => {
  for (const area of AREAS) {
    const ids = ROADMAP[area.id].credentialIds
    assert.equal(ids.length, 2, area.id)
    for (const id of ids) {
      const credential = CREDENTIALS[id]
      assert.ok(credential, `${area.id}: falta ${id}`)
      for (const field of ['provider', 'type', 'level', 'prerequisites', 'assessment', 'skills']) {
        assert.ok(credential[field], `${id}: falta ${field}`)
      }
      assert.equal(new URL(credential.sourceUrl).protocol, 'https:')
      assert.match(credential.reviewedAt, ISO_DATE)
    }
  }
})

test('cada perfil enlaza habilidades existentes de su área y una fuente de la empresa', () => {
  const sources = new Set(['www.amazon.jobs', 'nvidia.wd5.myworkdayjobs.com'])
  assert.equal(new Set(CAREERS.map((role) => role.id)).size, CAREERS.length)

  for (const area of AREAS) {
    assert.ok(CAREERS.some((role) => role.areaId === area.id), `Falta perfil para ${area.id}`)
  }

  for (const role of CAREERS) {
    assert.ok(role.location && role.level && role.summary, role.id)
    assert.ok(role.required.length && role.preferred.length && role.responsibilities.length, role.id)
    assert.ok(sources.has(new URL(role.sourceUrl).hostname), role.id)
    assert.match(role.reviewedAt, ISO_DATE)
    for (const id of role.skillIds) {
      assert.ok(
        ROADMAP[role.areaId].learning.some((skill) => skill.id === id),
        `${role.id}: la habilidad ${id} no existe en la ruta de ${role.areaId}`,
      )
    }
  }
})

test('la comunidad sólo publica fotos con pie y texto alternativo, e ideas para cada área', () => {
  assert.ok(GALLERY.length > 0)
  for (const photo of GALLERY) {
    assert.ok(photo.caption && photo.alt && photo.src.startsWith('/images/comunidad/'), photo.src)
    assert.ok(photo.large?.src.startsWith('/images/comunidad/'), `${photo.src}: falta la versión ampliada`)
    assert.ok(photo.large.width > 0 && photo.large.height > 0, photo.large.src)
  }
  // La foto de U-HACKS es de UPIITA-IPN: no puede aparecer como experiencia local.
  assert.ok(!GALLERY.some((photo) => photo.src.includes('explora-hackathon')))
  assert.equal(CHAPTERS.length, 4)
  for (const chapter of CHAPTERS) {
    if (chapter.joinUrl === null) continue
    const parsed = new URL(chapter.joinUrl)
    assert.equal(parsed.origin, 'https://chat.whatsapp.com', chapter.name)
    assert.ok(parsed.pathname.length > 1, `${chapter.name}: falta el código de invitación`)
  }
  for (const area of AREAS) assert.ok(INTERESTS[area.id]?.length, area.id)
})

test('cada especialidad tiene su propio canal de Teams', () => {
  assert.deepEqual(Object.keys(TEAMS_CHANNELS).sort(), AREAS.map((area) => area.id).sort())
  for (const [id, url] of Object.entries(TEAMS_CHANNELS)) {
    assert.ok(url, `${id}: falta el canal`)
    const parsed = new URL(url)
    assert.equal(parsed.protocol, 'https:', id)
    assert.match(parsed.hostname, /(^|\.)(teams\.microsoft\.com|teams\.cloud\.microsoft|teams\.live\.com)$/, id)
  }
  // Dos áreas con el mismo enlace serían un canal general disfrazado.
  const urls = Object.values(TEAMS_CHANNELS)
  assert.equal(new Set(urls).size, urls.length)
})

test('LinkedIn conserva acentos y caracteres especiales sin inyectar parámetros', () => {
  const result = new URL(linkedInSearch('  C++ & IA #junior  ', ' Ciudad de México '))
  assert.equal(result.origin, 'https://www.linkedin.com')
  assert.equal(result.pathname, '/jobs/search/')
  assert.equal(result.searchParams.get('keywords'), 'C++ & IA #junior')
  assert.equal(result.searchParams.get('location'), 'Ciudad de México')
  assert.deepEqual([...result.searchParams.keys()], ['keywords', 'location'])
})

test('la fecha de revisión no se recorre un día por zona horaria', () => {
  assert.equal(formatReviewDate('2026-10-07'), '7 oct 2026')
  assert.equal(formatReviewDate('2026-01-01'), '1 ene 2026')
})

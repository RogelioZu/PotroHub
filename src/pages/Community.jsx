import { AREAS } from '../data/areas'

const DISCORD_INVITE_URL = null // TODO: colocar el enlace de invitación real del servidor

function Community() {
  return (
    <section className="mx-auto max-w-6xl px-6 py-16">
      <p className="text-sm font-semibold tracking-widest text-gold-dark uppercase">Comunidad segura</p>
      <h1 className="mt-2 text-4xl font-bold text-ink">Servidor de Discord PotroPath</h1>
      <p className="mt-4 max-w-2xl text-ink-soft">
        Un espacio moderado, organizado por canales de especialidad, para conectar con otros
        estudiantes, formar equipos para hackathones y proyectos, y resolver dudas técnicas. No se
        solicitan datos personales para participar.
      </p>

      <div className="section-divider mt-12">
        <h2 className="shrink-0 text-2xl font-bold text-ink">Canales por área</h2>
      </div>
      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {AREAS.map((area) => (
          <div key={area.id} className="rounded-xl bg-paper-alt p-5">
            <h3 className="font-bold text-green-mid">#{area.id}</h3>
            <p className="mt-2 text-sm text-ink-soft">{area.description}</p>
          </div>
        ))}
      </div>

      <div className="mt-12 rounded-xl bg-green-soft p-6">
        <h2 className="text-xl font-bold text-green">Moderación y privacidad</h2>
        <p className="mt-2 text-sm text-ink-soft">
          El servidor cuenta con mentores como moderadores y reglas claras de convivencia. No se
          recopila ni comparte información personal de los participantes.
        </p>
      </div>

      <div className="mt-12">
        {DISCORD_INVITE_URL ? (
          <a
            href={DISCORD_INVITE_URL}
            target="_blank"
            rel="noreferrer"
            className="inline-block rounded-full bg-green-mid px-6 py-3 font-semibold text-paper hover:bg-green"
          >
            Unirme al servidor
          </a>
        ) : (
          <button
            type="button"
            disabled
            className="inline-block rounded-full bg-paper-alt px-6 py-3 font-semibold text-ink-soft/60"
          >
            Enlace de invitación próximamente
          </button>
        )}
      </div>
    </section>
  )
}

export default Community

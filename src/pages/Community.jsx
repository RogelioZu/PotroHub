import { AREAS } from '../data/areas'

const DISCORD_INVITE_URL = null // TODO: colocar el enlace de invitación real del servidor

function Community() {
  return (
    <section className="mx-auto max-w-6xl px-6 py-16">
      <p className="text-sm tracking-widest text-potro-gold-light uppercase">Comunidad segura</p>
      <h1 className="mt-2 font-display text-4xl text-potro-white">Servidor de Discord PotroPath</h1>
      <p className="mt-4 max-w-2xl text-potro-white-soft">
        Un espacio moderado, organizado por canales de especialidad, para conectar con otros
        estudiantes, formar equipos para hackathones y proyectos, y resolver dudas técnicas. No se
        solicitan datos personales para participar.
      </p>

      <h2 className="mt-12 font-display text-2xl text-potro-white">Canales por área</h2>
      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {AREAS.map((area) => (
          <div key={area.id} className="rounded-xl border border-potro-gold/15 p-5">
            <h3 className="font-display text-lg text-potro-gold-light">#{area.id}</h3>
            <p className="mt-2 text-sm text-potro-white-soft">{area.description}</p>
          </div>
        ))}
      </div>

      <div className="mt-12 rounded-xl border border-potro-gold/15 bg-potro-black-soft p-6">
        <h2 className="font-display text-xl text-potro-white">Moderación y privacidad</h2>
        <p className="mt-2 text-sm text-potro-white-soft">
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
            className="inline-block rounded-full bg-potro-green px-6 py-3 font-medium text-potro-white hover:bg-potro-green-light"
          >
            Unirme al servidor
          </a>
        ) : (
          <button
            type="button"
            disabled
            className="inline-block rounded-full bg-potro-green/40 px-6 py-3 font-medium text-potro-white/60"
          >
            Enlace de invitación próximamente
          </button>
        )}
      </div>
    </section>
  )
}

export default Community

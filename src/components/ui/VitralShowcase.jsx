import { useRef, useState } from 'react'
import { gsap, refreshScrollTriggers, ScrollTrigger, useGSAP } from '../../lib/gsap'
import { DUR, EASE, FULL_MOTION } from '../../lib/motion'

/**
 * Espacio dedicado a la fotografía del vitral de la biblioteca de la
 * Facultad de Ingeniería, con la etiqueta superpuesta sobre la imagen
 * (mismo patrón de tarjeta fotográfica que usa uaemex.mx) y la mascota de
 * la universidad como insignia sobre la esquina, para dar sentido de
 * pertenencia. La fotografía se presenta como un círculo para convertirla en
 * el foco visual del hero. Si `/images/vitral-biblioteca.webp` todavía no existe, se muestra un
 * placeholder con el acento decorativo `vitral-accent` en lugar de romper
 * el layout.
 *
 * El componente es dueño de su propia entrada: la tarjeta se descubre con una
 * máscara que barre de izquierda a derecha mientras la imagen se asienta, y el
 * potro aterriza al final. Corre en paralelo a la secuencia del hero.
 */
function VitralShowcase({ caption = 'El vitral de nuestra biblioteca', className = '' }) {
  const [imageFailed, setImageFailed] = useState(false)
  const root = useRef(null)
  const frame = useRef(null)
  const mascot = useRef(null)

  useGSAP(
    () => {
      const mm = gsap.matchMedia()

      mm.add(FULL_MOTION, () => {
        // El radio del `round` acompaña al marco circular mientras la máscara barre.
        const tl = gsap.timeline()

        tl.fromTo(
          frame.current,
          { clipPath: 'inset(0% 100% 0% 0% round 50%)' },
          {
            clipPath: 'inset(0% 0% 0% 0% round 50%)',
            duration: DUR.focal,
            ease: EASE.enter,
            clearProps: 'clipPath',
          },
        ).from(
          frame.current,
          { scale: 1.06, duration: DUR.focal * 1.3, ease: EASE.enter },
          0,
        )

        // Único rebote del sitio: aquí la personalidad es justamente el punto.
        tl.from(
          mascot.current,
          {
            opacity: 0,
            scale: 0.6,
            y: 16,
            transformOrigin: 'bottom center',
            duration: DUR.view,
            ease: EASE.land,
          },
          '-=0.3',
        )

        const idle = gsap.to(mascot.current, {
          y: -5,
          duration: 2.4,
          ease: 'sine.inOut',
          yoyo: true,
          repeat: -1,
          paused: true,
        })

        tl.add(() => idle.play())

        // Un bucle que nadie ve no debe seguir corriendo.
        const visibility = ScrollTrigger.create({
          trigger: root.current,
          start: 'top bottom',
          end: 'bottom top',
          onToggle: (self) => (self.isActive ? idle.play() : idle.pause()),
        })

        return () => {
          idle.kill()
          visibility.kill()
        }
      })

      return () => mm.revert()
    },
    { scope: root },
  )

  return (
    <figure ref={root} className={`relative ${className}`}>
      <div
        ref={frame}
        className="relative z-10 mx-auto aspect-square w-full max-w-[32rem] overflow-hidden rounded-full border-2 border-green bg-green p-2 shadow-xl shadow-ink/15 ring-1 ring-gold/60 sm:p-3"
      >
        {imageFailed ? (
          <div className="vitral-accent flex h-full w-full items-center justify-center rounded-full">
            <span className="rounded-full bg-ink/70 px-4 py-2 text-xs text-paper">
              Imagen pendiente de colocar en /public/images/vitral-biblioteca.webp
            </span>
          </div>
        ) : (
          <img
            src="/images/vitral-biblioteca.webp"
            alt={caption}
            className="h-full w-full rounded-full object-cover"
            onError={() => setImageFailed(true)}
            onLoad={refreshScrollTriggers}
          />
        )}
        <figcaption className="absolute inset-x-8 bottom-8 rounded-md border-l-2 border-gold bg-ink/80 px-4 py-2 text-center text-sm font-semibold text-paper shadow-sm sm:inset-x-12 sm:bottom-12">
          {caption}
        </figcaption>
      </div>

      <img
        ref={mascot}
        src="/images/potro-mascota.webp"
        alt="Potro, la mascota de la UAEMéx"
        className="absolute z-20 -right-4 -bottom-8 h-24 w-auto rounded-xl bg-paper p-1.5 shadow-lg ring-1 ring-ink/10 sm:h-28 md:-right-8 md:h-36"
      />
    </figure>
  )
}

export default VitralShowcase

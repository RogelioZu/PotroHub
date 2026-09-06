import { useRef, useState } from 'react'
import { gsap, refreshScrollTriggers, ScrollTrigger, useGSAP } from '../../lib/gsap'
import { DUR, EASE, FULL_MOTION } from '../../lib/motion'

/**
 * Espacio dedicado a la fotografía del vitral de la biblioteca de la
 * Facultad de Ingeniería, con la etiqueta superpuesta sobre la imagen
 * (mismo patrón de tarjeta fotográfica que usa uaemex.mx) y la mascota de
 * la universidad como insignia sobre la esquina, para dar sentido de
 * pertenencia. La foto real es un panorámico muy ancho, por eso la tarjeta
 * usa una relación de aspecto amplia en lugar de 16:9. Si
 * `/images/vitral-biblioteca.png` todavía no existe, se muestra un
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
        // El radio del `round` acompaña a `rounded-xl` para que las esquinas
        // no se cuadren mientras la máscara barre.
        const tl = gsap.timeline()

        tl.fromTo(
          frame.current,
          { clipPath: 'inset(0% 100% 0% 0% round 0.75rem)' },
          {
            clipPath: 'inset(0% 0% 0% 0% round 0.75rem)',
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
        className="overflow-hidden rounded-xl shadow-lg shadow-ink/10 ring-1 ring-ink/5"
      >
        {imageFailed ? (
          <div className="vitral-accent flex aspect-21/9 w-full items-center justify-center">
            <span className="rounded-full bg-ink/70 px-4 py-2 text-xs text-paper">
              Imagen pendiente de colocar en /public/images/vitral-biblioteca.png
            </span>
          </div>
        ) : (
          <img
            src="/images/vitral-biblioteca.png"
            alt={caption}
            className="aspect-21/9 w-full object-cover"
            onError={() => setImageFailed(true)}
            onLoad={refreshScrollTriggers}
          />
        )}
        <figcaption className="absolute bottom-4 left-4 rounded-md bg-ink/70 px-4 py-2 text-sm font-medium text-paper">
          {caption}
        </figcaption>
      </div>

      <img
        ref={mascot}
        src="/images/potro-mascota.png"
        alt="Potro, la mascota de la UAEMéx"
        className="absolute -right-4 -bottom-6 h-24 w-auto rounded-xl bg-paper p-1.5 shadow-lg ring-1 ring-ink/10 sm:h-28 md:-right-6 md:h-32"
      />
    </figure>
  )
}

export default VitralShowcase

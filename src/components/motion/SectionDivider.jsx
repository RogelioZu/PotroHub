import { useRef } from 'react'
import { gsap, useGSAP } from '../../lib/gsap'
import { DUR, EASE, FULL_MOTION, REVEAL_START } from '../../lib/motion'

/**
 * El separador dorado de `.section-divider`, con las dos líneas dibujándose
 * hacia afuera desde el encabezado. Las líneas son pseudoelementos, así que
 * no se pueden animar directamente: se anima la variable CSS `--divider-scale`
 * del contenedor y el CSS la aplica a `::before` y `::after`.
 */
function SectionDivider({ children, className = '' }) {
  const root = useRef(null)

  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      mm.add(FULL_MOTION, () => {
        gsap.from(root.current, {
          '--divider-scale': 0,
          duration: DUR.focal,
          ease: EASE.enter,
          scrollTrigger: { trigger: root.current, start: REVEAL_START, once: true },
        })
      })

      return () => mm.revert()
    },
    { scope: root },
  )

  return (
    <div ref={root} className={`section-divider ${className}`}>
      {children}
    </div>
  )
}

export default SectionDivider

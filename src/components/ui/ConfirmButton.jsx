import { useEffect, useRef, useState } from 'react'

/** Cuánto espera armado el control destructivo antes de desarmarse solo (ms). */
const CONFIRM_WINDOW = 6000

/**
 * Control destructivo que confirma sobre sí mismo, en dos toques.
 *
 * La única acción destructiva del sitio borra las cincuenta respuestas, y en
 * teléfono queda a 16px de la acción de al lado: un pulgar mal puesto cuesta
 * ocho minutos de trabajo. La confirmación ocurre en el propio botón y no en
 * un modal —la tarea no necesita foco protegido ni interrumpe nada— y se
 * desarma sola por tiempo, al perder el foco o al tocar fuera, para que nunca
 * quede un control cargado esperando un segundo toque que el usuario ya
 * olvidó.
 *
 * Vive aquí y no en una página porque son dos: reiniciar desde el resultado y
 * reiniciar a media prueba. Un segundo control con la misma promesa y otra
 * mecánica sería otra forma de decir lo mismo.
 */
function ConfirmButton({ label, confirmLabel, onConfirm, className = 'btn-outline', armedClassName = 'btn-outline border-green-mid text-green-mid' }) {
  const [armed, setArmed] = useState(false)
  const button = useRef(null)

  useEffect(() => {
    if (!armed) return

    const disarm = () => setArmed(false)
    const onPointerDown = (event) => {
      if (!button.current?.contains(event.target)) disarm()
    }

    const timer = setTimeout(disarm, CONFIRM_WINDOW)
    document.addEventListener('pointerdown', onPointerDown)

    return () => {
      clearTimeout(timer)
      document.removeEventListener('pointerdown', onPointerDown)
    }
  }, [armed])

  return (
    <button
      ref={button}
      type="button"
      onClick={() => (armed ? onConfirm() : setArmed(true))}
      onBlur={() => setArmed(false)}
      // El propio control es la región viva: el cambio de etiqueta es todo el
      // anuncio que hay que dar, y darlo aparte lo diría dos veces.
      aria-live="polite"
      className={armed ? armedClassName : className}
    >
      {armed ? confirmLabel : label}
    </button>
  )
}

export default ConfirmButton

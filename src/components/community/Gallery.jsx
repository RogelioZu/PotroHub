import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'

/** Cuánto espera el cursor sobre una foto antes de ampliarla (ms). */
const HOVER_DELAY = 180
/** Cuánto se espera a que cargue la versión grande antes de abrir igual (ms). */
const LOAD_LIMIT = 700
/** Duración de la salida; debe coincidir con `.gallery-preview.is-closing`. */
const CLOSE_MS = 280
/** Margen para cruzar de una miniatura a la vecina sin que la vista se cierre (ms). */
const LEAVE_GRACE = 90

/**
 * Galería de experiencias con vista ampliada.
 *
 * Con mouse, la foto se amplía al detenerse encima y se cierra al salir: la
 * vista no captura el puntero (`pointer-events: none`), así que el cursor
 * sigue sobre la miniatura. La espera de 180ms evita que cruzar la rejilla en
 * diagonal dispare seis ampliaciones seguidas; con la vista ya abierta, pasar
 * a la miniatura vecina cambia la foto sin volver a esperar ni cerrar.
 *
 * La vista no se abre hasta que la versión grande está decodificada (o pasan
 * 700ms): abrirla antes mostraba un marco vacío que se llenaba de golpe, y eso
 * era lo que la hacía sentir brusca. Al cerrar se queda montada 280ms para
 * desvanecerse en lugar de desaparecer.
 *
 * En pantalla táctil no hay hover: un toque la abre y el siguiente toque, en
 * cualquier lugar, la cierra. Con teclado, Enter la abre y Escape la cierra.
 *
 * La vista se monta en `body` con un portal porque `.reveal-group` anima
 * `transform` en sus hijos, y un ancestro transformado convierte a
 * `position: fixed` en relativo a él: la vista quedaría dentro de la celda.
 *
 * La miniatura sigue siendo el contenido: pie, descripción y texto
 * alternativo viven en la rejilla. La vista ampliada es un acercamiento y
 * por eso va `aria-hidden`; no dice nada que la miniatura no diga ya.
 */
function Gallery({ photos }) {
  const [open, setOpen] = useState(null)
  const [closing, setClosing] = useState(false)
  const [pinned, setPinned] = useState(false)
  const hoverTimer = useRef(null)
  const leaveTimer = useRef(null)
  const closeTimer = useRef(null)
  const hovered = useRef(null)
  const isOpen = useRef(false)
  const lastPointer = useRef('mouse')

  useEffect(
    () => () => {
      clearTimeout(hoverTimer.current)
      clearTimeout(leaveTimer.current)
      clearTimeout(closeTimer.current)
    },
    [],
  )

  const show = (index, pin) => {
    clearTimeout(closeTimer.current)
    clearTimeout(leaveTimer.current)
    isOpen.current = true
    setClosing(false)
    setOpen(index)
    setPinned(pin)
  }

  const hide = () => {
    if (!isOpen.current) return
    isOpen.current = false
    setClosing(true)
    clearTimeout(closeTimer.current)
    closeTimer.current = setTimeout(() => {
      setOpen(null)
      setClosing(false)
      setPinned(false)
    }, CLOSE_MS)
  }

  // Abre cuando la versión grande ya puede pintarse, o al agotar el límite.
  const showWhenReady = (index, pin, stillWanted) => {
    const image = new Image()
    image.src = photos[index].large.src
    const ready = image.decode().catch(() => {})
    const limit = new Promise((resolve) => setTimeout(resolve, LOAD_LIMIT))
    Promise.race([ready, limit]).then(() => {
      if (stillWanted()) show(index, pin)
    })
  }

  useEffect(() => {
    if (open === null || closing) return
    const onKeyDown = (event) => {
      if (event.key === 'Escape') hide()
    }
    window.addEventListener('keydown', onKeyDown)
    // Abierta por toque o teclado, cualquier toque o el scroll la cierran.
    if (pinned) {
      window.addEventListener('pointerdown', hide)
      window.addEventListener('scroll', hide, { passive: true })
    }
    return () => {
      window.removeEventListener('keydown', onKeyDown)
      window.removeEventListener('pointerdown', hide)
      window.removeEventListener('scroll', hide)
    }
  })

  const onPointerEnter = (event, index) => {
    lastPointer.current = event.pointerType
    if (event.pointerType !== 'mouse') return
    hovered.current = index
    clearTimeout(leaveTimer.current)
    clearTimeout(hoverTimer.current)
    // Con la vista abierta se cambia de foto sin la espera de entrada.
    const delay = isOpen.current ? 0 : HOVER_DELAY
    hoverTimer.current = setTimeout(() => {
      showWhenReady(index, false, () => hovered.current === index)
    }, delay)
  }

  const onPointerLeave = (event) => {
    if (event.pointerType !== 'mouse') return
    hovered.current = null
    clearTimeout(hoverTimer.current)
    if (pinned) return
    clearTimeout(leaveTimer.current)
    leaveTimer.current = setTimeout(hide, LEAVE_GRACE)
  }

  const onClick = (event, index) => {
    // Con mouse la vista ya está abierta por hover; el clic no cambia nada.
    if (lastPointer.current === 'mouse' && event.detail > 0) return
    // El pointerdown de este mismo toque ya pasó; el que cierre será el próximo.
    event.stopPropagation()
    showWhenReady(index, true, () => true)
  }

  const photo = open === null ? null : photos[open]

  return (
    <>
      <div className="gallery-grid reveal-group">
        {photos.map((item, index) => (
          <figure key={item.src}>
            <button
              type="button"
              className="gallery-zoom"
              aria-label={`Ampliar foto: ${item.caption}`}
              onPointerEnter={(event) => onPointerEnter(event, index)}
              onPointerLeave={onPointerLeave}
              onPointerDown={(event) => {
                lastPointer.current = event.pointerType
                if (event.pointerType !== 'mouse') event.stopPropagation()
              }}
              onClick={(event) => onClick(event, index)}
            >
              <img src={item.src} alt={item.alt} loading="lazy" />
            </button>
            <figcaption>
              <strong className="block">{item.caption}</strong>
              <span className="muted">{item.description}</span>
            </figcaption>
          </figure>
        ))}
      </div>

      {photo &&
        createPortal(
          <div className={closing ? 'gallery-preview is-closing' : 'gallery-preview'} aria-hidden="true">
            <figure key={photo.src}>
              <img
                src={photo.large.src}
                width={photo.large.width}
                height={photo.large.height}
                alt=""
              />
              <figcaption>
                <strong className="block">{photo.caption}</strong>
                <span className="muted">{photo.description}</span>
              </figcaption>
            </figure>
          </div>,
          document.body,
        )}
    </>
  )
}

export default Gallery

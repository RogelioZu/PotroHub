const imageSlots = [
  {
    shape: 'circle',
    className: 'bg-green-mid',
    slot: 'circle-main',
    image: '/images/estudiante-ico.png',
    alt: 'Estudiante de Ingeniería en Computación',
  },
  { shape: 'circle', className: 'bg-gold-light', slot: 'circle-portrait' },
  { shape: 'square', className: 'bg-green', slot: 'square-top' },
  {
    shape: 'pill',
    className: 'bg-gold',
    slot: 'pill-wide',
    image: '/images/estudante-ico-hombre.png',
    alt: 'Estudiante de Ingeniería en Computación',
  },
  { shape: 'circle', className: 'bg-green-mid', slot: 'circle-small' },
  { shape: 'square', className: 'bg-green-soft', slot: 'square-bottom' },
]

/** Mosaico geométrico del hero con espacios listos para futuras imágenes. */
function HeroMosaic({ className = '' }) {
  return (
    <div className={`relative mx-auto aspect-square w-full max-w-[32rem] ${className}`}>
      <div className="absolute inset-[8%] grid grid-cols-4 grid-rows-4 gap-2 sm:gap-3">
        {imageSlots.map(({ shape, className: color, slot, image, alt }) => (
          <div
            key={slot}
            data-image-slot={slot}
            aria-label={`Espacio para imagen: ${slot}`}
            className={`relative overflow-hidden ${color} ${
              shape === 'circle'
                ? 'rounded-full'
                : shape === 'pill'
                  ? 'col-span-2 rounded-full'
                  : 'rounded-[2rem]'
            } ${
              slot === 'circle-main'
                ? 'col-span-2 row-span-2'
                : slot === 'circle-portrait'
                  ? 'col-start-3 row-span-2'
                  : slot === 'square-top'
                    ? 'col-start-4 row-span-2 rounded-tr-[3rem]'
                    : slot === 'pill-wide'
                      ? 'col-start-2 row-start-3'
                      : slot === 'circle-small'
                        ? 'col-start-1 row-start-3'
                        : 'col-span-2 row-start-4 rounded-bl-[3rem]'
            }`}
          >
            {image && <img src={image} alt={alt} className="h-full w-full object-cover" />}
            <span className="absolute inset-2 rounded-[inherit] border border-paper/35" />
          </div>
        ))}
      </div>

      <span className="absolute -top-[8%] -right-[3%] h-[14%] w-[14%] rounded-tr-[3rem] bg-green" />
      <span className="absolute bottom-0 left-[28%] h-[12%] w-[24%] bg-gold-light [clip-path:polygon(0_0,100%_0,50%_100%)]" />
      <span className="absolute right-0 bottom-[18%] h-[18%] w-[18%] rounded-bl-[3rem] bg-gold-dark" />
    </div>
  )
}

export default HeroMosaic

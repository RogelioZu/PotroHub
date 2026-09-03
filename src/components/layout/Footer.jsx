function Footer() {
  return (
    <footer className="border-t border-potro-gold/20 bg-potro-black-soft">
      <div className="mx-auto flex max-w-6xl flex-col gap-2 px-6 py-8 text-sm text-potro-white-soft">
        <p className="font-display text-lg text-potro-white">
          Potro<span className="text-gradient-gold">Path</span>
        </p>
        <p>
          Facultad de Ingeniería — Universidad Autónoma del Estado de México (UAEMéx).
        </p>
        <p className="text-xs text-potro-white-soft/70">
          Proyecto estudiantil sin fines de lucro. Inspirado en el vitral de la biblioteca de la facultad.
        </p>
      </div>
    </footer>
  )
}

export default Footer

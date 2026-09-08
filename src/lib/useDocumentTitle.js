import { useEffect } from 'react'

/**
 * Título de documento por vista.
 *
 * Las cinco rutas compartían el `<title>` de `index.html`, así que un
 * estudiante interrumpido a media sesión —el caso de uso primario: teléfono,
 * en tiempos muertos— volvía a un historial de pestañas idénticas. El título
 * es el único estado de la aplicación que sobrevive fuera de la pestaña.
 *
 * Recibe el título completo y no un fragmento a componer: la portada invierte
 * el orden ("PotroPath — …") y el resto de las vistas lo llevan como sufijo,
 * de modo que un formato único mentiría en una de las dos formas.
 */
export function useDocumentTitle(title) {
  useEffect(() => {
    document.title = title
  }, [title])
}

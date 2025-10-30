import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

/**
 * Composant qui force le scroll en haut de la page lors d'un changement de route
 */
export function ScrollToTop() {
  const { pathname } = useLocation()

  useEffect(() => {
    // Force le scroll en haut de la page à chaque changement de route
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'instant' // Scroll instantané sans animation
    })
  }, [pathname])

  return null
}

export default ScrollToTop


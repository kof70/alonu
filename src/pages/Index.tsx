import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import Footer from '@/components/layout/Footer'
import { useFeaturedArtisans } from '@/hooks/use-artisans'

interface Slide {
  id: number
  image: string
  title: string
  subtitle: string
  cta1: string
  cta2: string
  link1: string
  link2: string
}

const Index: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [homeSearch, setHomeSearch] = useState('')
  const navigate = useNavigate()
  
  // Hooks pour récupérer les données de l'API
  const { artisans: featuredArtisans, loading: artisansLoading } = useFeaturedArtisans(8)
  
  const slides: Slide[] = [
    {
      id: 1,
      image: '/assets/images/slide1.jpg',
      title: 'Artisans, Développez Votre Activité',
      subtitle: 'Rejoignez notre plateforme et gagnez en visibilité. Faites-vous connaître auprès de milliers de clients potentiels et développez votre réseau professionnel.',
      cta1: 'Inscription Artisan',
      cta2: 'En Savoir Plus',
      link1: '/register-artisan',
      link2: '/categories-artisans'
    },
    {
      id: 2,
      image: '/assets/images/slide2.jpg',
      title: 'Programme 1 Étudiant, 1 Artisan',
      subtitle: 'Apprenez un métier traditionnel auprès de nos maîtres artisans. Développez vos compétences pratiques tout en poursuivant vos études.',
      cta1: 'Inscription Étudiant',
      cta2: 'Voir les Artisans',
      link1: '/register/etudiant',
      link2: '/categories-artisans'
    },
    {
      id: 3,
      image: '/assets/images/slide3.jpg',
      title: 'Trouvez l\'Artisan Idéal Près de Chez Vous',
      subtitle: 'Découvrez des artisans qualifiés et vérifiés par notre communauté. Des professionnels passionnés pour tous vos projets.',
      cta1: 'Parcourir les Catégories',
      cta2: 'Voir Tous les Artisans',
      link1: '/categories-artisans',
      link2: '/categories-artisans'
    }
  ]

  // Rotation automatique du carousel avec réinitialisation sur interaction manuelle
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length)
    }, 5000) // Change toutes les 5 secondes

    return () => clearInterval(interval)
  }, [slides.length, currentSlide]) // Ajouter currentSlide pour réinitialiser le timer

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length)
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length)
  }

  const goToSlide = (index: number) => {
    setCurrentSlide(index)
  }

  // (Supprimé: variable 'categories' non utilisée)

  // Utiliser les artisans de l'API ou les artisans par défaut
  const experts = featuredArtisans.length > 0 ? featuredArtisans.map((artisan, index) => {
    // Utiliser l'ID original (idArtisan) si disponible, sinon parser l'ID string
    const artisanId = artisan.originalIdArtisan || parseInt(artisan.id) || 0
    console.log('🔗 Lien artisan créé:', { artisanId, originalId: artisan.originalIdArtisan, mappedId: artisan.id, artisanName: artisan.name })
    return {
      id: artisanId,
      name: artisan.name,
      profession: artisan.profession,
      ...(index === 0 && { badge: 'Populaire', badgeColor: 'bg-green-500' }),
      ...(index === 1 && { badge: 'Nouveau', badgeColor: 'bg-blue-500' })
    }
  }) : [
    {
      id: 1,
      name: 'Iete AGBOGAN',
      profession: 'Transformation et conservat...',
      badge: 'Populaire',
      badgeColor: 'bg-green-500'
    },
    {
      id: 2,
      name: 'Test Test',
      profession: 'Transformation et conservat...',
      badge: 'Nouveau',
      badgeColor: 'bg-blue-500'
    },
    {
      id: 3,
      name: 'Kossi AGBO',
      profession: 'Services de nettoyage'
    },
    {
      id: 4,
      name: 'Marc AGBO',
      profession: 'Calligraphes'
    },
    {
      id: 5,
      name: 'tete1 AGBOGAN',
      profession: 'Transformation et conservat...'
    },
    {
      id: 6,
      name: 'User Test',
      profession: 'créateurs d\'espaces verts'
    },
    {
      id: 7,
      name: 'Jules AGBO',
      profession: 'Blanchisseurs et spécialiste...'
    },
    {
      id: 8,
      name: 'Master Eli',
      profession: 'Teinturiers'
    }
  ]

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-white shadow-sm border-b sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center space-x-2">
              <img 
                src="/favicon.png" 
                alt="Logo ALONU" 
                className="h-10 w-auto"
              />
              <span className="text-2xl font-bold text-[#006E4F]">
                ALONU
              </span>
            </Link>
            
            <nav className="hidden md:flex items-center space-x-8">
              <Link to="/" className="relative text-gray-700 hover:text-primary transition-all duration-300 font-medium group">
                Accueil
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full"></span>
              </Link>
              <Link to="/categories" className="relative text-gray-700 hover:text-primary transition-all duration-300 font-medium group">
                Artisans par Catégorie
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full"></span>
              </Link>
            </nav>

            <div className="flex items-center space-x-3">
              <Link to="/login" className="inline-flex">
              <Button variant="outline" className="border-2 border-primary text-primary hover:bg-primary/10 hover:text-primary flex items-center">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                </svg>
                Connexion
              </Button>
              </Link>
              <Link to="/register/artisan" className="inline-flex">
              <Button className="bg-primary hover:bg-primary/90 flex items-center">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                </svg>
                S'inscrire
              </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Carousel Section */}
      <section className="relative h-[600px] lg:h-[610px] overflow-hidden">
        {/* Images avec transitions */}
        {slides.map((slide, index) => (
          <div
            key={slide.id}
            className={`absolute inset-0 transition-all duration-1000 ease-in-out ${
              index === currentSlide
                ? 'opacity-100 translate-x-0'
                : index < currentSlide
                ? 'opacity-0 -translate-x-full'
                : 'opacity-0 translate-x-full'
            }`}
          >
            <img
              src={slide.image}
              alt={slide.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-transparent" />
          </div>
        ))}
        
        {/* Contenu avec animations */}
        <div className="relative z-10 h-full flex items-center">
          <div className="container mx-auto px-4">
            <div className="max-w-2xl text-white">
              <h1 
                key={`title-${currentSlide}`}
                className="text-5xl font-bold mb-6 leading-tight animate-fade-in-up"
              >
                {slides[currentSlide].title}
              </h1>
              <p 
                key={`subtitle-${currentSlide}`}
                className="text-lg mb-8 opacity-90 animate-fade-in-up animation-delay-200"
              >
                {slides[currentSlide].subtitle}
              </p>
              <div 
                key={`buttons-${currentSlide}`}
                className="flex flex-wrap gap-4 animate-fade-in-up animation-delay-400"
              >
                <Link to={slides[currentSlide].link1} className="inline-flex">
                  <Button size="lg" className="bg-primary hover:bg-primary/90 text-white px-8 font-semibold shadow-lg">
                    {slides[currentSlide].cta1}
                  </Button>
                </Link>
                <Link to={slides[currentSlide].link2} className="inline-flex">
                  <Button 
                    size="lg" 
                    variant="outline" 
                    className="border-2 border-white text-white bg-transparent hover:bg-white hover:text-gray-900 px-8 font-semibold shadow-lg backdrop-blur-sm transition-all duration-300"
                  >
                    {slides[currentSlide].cta2}
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Boutons de navigation */}
        <button
          onClick={prevSlide}
          className="absolute left-4 top-1/2 -translate-y-1/2 z-20 bg-white/20 hover:bg-white/40 text-white rounded-full p-3 transition-all backdrop-blur-sm"
          aria-label="Slide précédent"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <button
          onClick={nextSlide}
          className="absolute right-4 top-1/2 -translate-y-1/2 z-20 bg-white/20 hover:bg-white/40 text-white rounded-full p-3 transition-all backdrop-blur-sm"
          aria-label="Slide suivant"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>

        {/* Carousel Indicators */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex space-x-2">
          {slides.map((slide, index) => (
            <button
              key={slide.id}
              onClick={() => goToSlide(index)}
              className={`w-10 h-1 rounded-full transition-all cursor-pointer ${
                index === currentSlide ? 'bg-white' : 'bg-white/40 hover:bg-white/60'
              }`}
              aria-label={`Aller au slide ${index + 1}`}
            />
          ))}
        </div>
      </section>

      {/* Search & Nos métiers Section - Two Columns */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            
            {/* Colonne Gauche - Recherche */}
            <div>
              <h2 className="text-4xl font-bold text-gray-900 mb-4">Trouvez l'artisan parfait</h2>
              <p className="text-gray-600 mb-6">Filtrez par métier, ville ou nom. Votre artisan idéal n'est qu'à un clic.</p>
              
              <div className="mb-4 relative">
                <input 
                  type="text" 
                  placeholder="Rechercher"
                  value={homeSearch}
                  onChange={(e) => setHomeSearch(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && homeSearch.trim()) {
                      navigate(`/categories?q=${encodeURIComponent(homeSearch.trim())}`)
                    }
                  }}
                  className="border border-gray-300 w-full pr-32 px-4 py-3 pl-10 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
                <svg className="w-5 h-5 text-gray-400 absolute left-3 top-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <Button
                  onClick={() => homeSearch.trim() && navigate(`/categories?q=${encodeURIComponent(homeSearch.trim())}`)}
                  className="absolute top-1/2 -translate-y-1/2 right-2 bg-orange-600 hover:bg-orange-700 text-white px-5"
                >
                  Rechercher
                </Button>
              </div>
              
              <a href="#" className="text-orange-500 font-medium flex items-center hover:text-orange-600">
                Filtres
                <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </a>

              {/* Image - alignée avec la grille des métiers */}
              <div className="mt-7">
                <img 
                  src="/assets/images/image trouver l artisan parfait.jpg"
                  alt="Artisan au travail" 
                  className="w-full h-auto max-h-[1000px] object-cover rounded-lg shadow-sm"
                />
              </div>
            </div>

            {/* Colonne Droite - Nos métiers */}
            <div className="mt-28">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">Nos métiers</h2>
              <p className="text-base text-gray-600 mb-6">Explorez une diversité de talents artisanaux</p>

              {/* Grille Pinterest/Masonry avec 2 colonnes */}
              <div className="grid grid-cols-2 gap-4">
                
                {/* Colonne 1 */}
                <div className="space-y-4">
                  {/* Métiers d'art - Simple card */}
                  <div className="bg-white rounded-lg shadow-sm p-5">
                    <div className="mb-3">
                      <svg className="w-7 h-7 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                      </svg>
                    </div>
                    <h3 className="text-base font-bold text-gray-900 mb-2">Métiers d'art</h3>
                    <p className="text-sm text-gray-600 mb-4">Découvrez l'excellence des artisans créatifs et traditionnels</p>
                    <div className="flex justify-end">
                      <Button className="bg-orange-600 hover:bg-orange-700 text-white font-semibold px-3 py-1 rounded-lg text-sm">
                        Parcourir
                      </Button>
                    </div>
                  </div>

                  {/* Textile et habillement - Image card */}
                  <div className="bg-white rounded-lg shadow-sm">
                    <img alt="Textile et habillement" src="/assets/images/textile1.jpg" className="w-full h-36 object-cover rounded-t-lg" />
                    <div className="p-5">
                      <h3 className="text-base font-bold text-gray-900 mb-2">Textile et habillement</h3>
                      <p className="text-sm text-gray-600 mb-4">Découvrez les créateurs de mode et de vêtements uniques</p>
                      <div className="flex justify-end">
                        <Button className="bg-orange-600 hover:bg-orange-700 text-white font-semibold px-3 py-1 rounded-lg text-sm">
                          Parcourir
                        </Button>
                      </div>
                    </div>
                  </div>

                  {/* Métiers du bâtiment - Simple card with link */}
                  <div className="bg-white rounded-lg shadow-sm p-5">
                    <div className="mb-3">
                      <svg className="w-7 h-7 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                      </svg>
                    </div>
                    <h3 className="text-base font-bold text-gray-900 mb-2">Métiers du bâtiment</h3>
                    <p className="text-sm text-gray-600 mb-3">Maçonnerie, plomberie et travaux</p>
                    <div className="flex justify-end">
                      <button className="flex items-center text-orange-600 font-semibold hover:text-orange-700 text-sm">
                        Explorer
                        <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Colonne 2 */}
                <div className="space-y-4">
                  {/* Métiers de bouche - Image card with badge */}
                  <div className="bg-white rounded-lg shadow-sm relative">
                    <span className="bg-green-500 text-white px-3 py-1 rounded-full text-xs font-semibold absolute -top-2 -left-2 z-10">
                      Populaire
                    </span>
                    <img alt="Métiers de bouche" src="/assets/images/metier-bouche.jpg" className="w-full h-36 object-cover rounded-t-lg" />
                    <div className="p-4">
                      <h3 className="text-base font-bold text-gray-900 mb-2">Métiers de bouche</h3>
                      <p className="text-sm text-gray-600 mb-3">Découvrez les talents culinaires locaux</p>
                      <div className="flex justify-end">
                        <Button className="bg-orange-600 hover:bg-orange-700 text-white font-semibold px-3 py-1 rounded-lg text-sm">
                          Consulter
                        </Button>
                      </div>
                    </div>
                  </div>

                  {/* Métiers du bois - Simple card with link */}
                  <div className="bg-white rounded-lg shadow-sm p-5">
                    <div className="mb-3">
                      <svg className="w-7 h-7 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                      </svg>
                    </div>
                    <h3 className="text-base font-bold text-gray-900 mb-2">Métiers du bois</h3>
                    <p className="text-sm text-gray-600 mb-3">Menuiserie et ébénisterie traditionnelle</p>
                    <div className="flex justify-end">
                      <button className="flex items-center text-orange-600 font-semibold hover:text-orange-700 text-sm">
                        Découvrir
                        <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </button>
                    </div>
                  </div>

                  {/* Artisanat du cuir - Simple card with link */}
                  <div className="bg-white rounded-lg shadow-sm p-5">
                    <div className="mb-3">
                      <svg className="w-7 h-7 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                      </svg>
                    </div>
                    <h3 className="text-base font-bold text-gray-900 mb-2">Artisanat du cuir</h3>
                    <p className="text-sm text-gray-600 mb-3">Maroquinerie et accessoires de qualité</p>
                    <div className="flex justify-end">
                      <button className="flex items-center text-orange-600 font-semibold hover:text-orange-700 text-sm">
                        Explorer
                        <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>

              </div>

              {/* Programme Étudiant - Déplacé dans la colonne droite */}
              <div className="mt-12">
                <h2 className="text-2xl font-bold text-gray-900 mb-3">Programme 1 Étudiant, 1 Artisan</h2>
                <p className="text-sm text-gray-600 mb-6">Développez vos compétences avec nos experts</p>
                
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-3">Rejoindre le Programme</h3>
                  <p className="text-sm text-gray-600 mb-4">
                    Apprenez un métier traditionnel tout en poursuivant vos études selon vos disponibilités
                  </p>
                  <div className="flex justify-end">
                    <Link to="/register/etudiant" className="inline-flex">
                      <Button className="bg-orange-500 text-white px-6 py-2 rounded-lg font-semibold hover:bg-orange-600 transition-colors text-sm">
                        S'inscrire
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>


          {/* Nos experts Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="mb-12 text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Nos artisans</h2>
            <p className="text-gray-600">Découvrez les talents près de chez vous</p>
          </div>

          {artisansLoading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
              <span className="ml-3 text-gray-600">Chargement des artisans...</span>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {experts.map((expert) => (
                <div key={expert.id} className="rounded-lg border border-gray-200 p-5 relative hover:shadow-lg transition-shadow">
                  {expert.badge && (
                    <span className={`${expert.badgeColor} text-white text-xs px-3 py-1 rounded-full absolute -top-1 -left-1 z-10`}>
                      {expert.badge}
                    </span>
                  )}
                  <div className="flex items-center mb-4 mt-5">
                    <div className="w-11 h-11 bg-gray-300 rounded-full mr-3"></div>
                    <div>
                      <p className="font-bold text-gray-900">{expert.name}</p>
                      <p className="text-sm text-gray-600">{expert.profession}</p>
                    </div>
                  </div>
                  <div className="flex justify-end">
                    <Link to={`/artisan/${expert.id}`} className="text-orange-500 font-medium flex items-center hover:text-orange-600">
                      Voir le profil
                      <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  )
}

export default Index
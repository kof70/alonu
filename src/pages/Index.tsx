import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import Footer from '@/components/layout/Footer'

const Index: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0)
  
  const slides = [
    {
      id: 1,
      image: '/hero-image.jpg',
      title: 'Rejoignez notre communauté d\'artisans',
      subtitle: 'Découvrez des artisans passionnés et vérifiés près de chez vous. Étudiants, développez vos compétences avec nos experts !',
      cta1: 'Trouver un Artisan',
      cta2: 'Développer mes Talents'
    }
  ]

  const categories = [
    {
      id: 1,
      name: 'Métiers d\'art',
      description: 'Découvrez l\'excellence des artisans créatifs et traditionnels',
      type: 'card',
      buttonText: 'Parcourir'
    },
    {
      id: 2,
      name: 'Métiers de bouche',
      description: 'Découvrez les talents culinaires locaux',
      badge: 'Populaire',
      badgeColor: 'bg-green-500',
      image: '/metier-bouche.jpg',
      type: 'image-card',
      buttonText: 'Consulter'
    },
    {
      id: 3,
      name: 'Textile et habillement',
      description: 'Découvrez les créateurs de mode et de vêtements uniques.',
      badge: 'Nouveau',
      badgeColor: 'bg-blue-600',
      image: '/textile1.jpg',
      type: 'image-card',
      buttonText: 'Voir'
    },
    {
      id: 4,
      name: 'Métiers du bâtiment',
      description: 'Maçonnerie, plomberie et travaux',
      type: 'card',
      buttonText: 'Explorer'
    },
    {
      id: 5,
      name: 'Métiers du bois',
      description: 'Menuiserie et ébénisterie traditionnelle',
      type: 'card',
      buttonText: 'Découvrir'
    },
    {
      id: 6,
      name: 'Artisanat du cuir',
      description: 'Maroquinerie et accessoires de qualité',
      type: 'card',
      buttonText: 'Explorer'
    }
  ]

  const experts = [
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
                src="/logo-crm.png" 
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
              <Button variant="outline" className="border-2 border-primary text-primary hover:bg-primary/10 hover:text-primary flex items-center">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                </svg>
                Connexion
              </Button>
              <Button className="bg-primary hover:bg-primary/90 flex items-center">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                </svg>
                S'inscrire
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Carousel Section */}
      <section className="relative h-[500px] overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={slides[currentSlide].image}
            alt={slides[currentSlide].title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-transparent" />
        </div>
        
        <div className="relative z-10 h-full flex items-center">
          <div className="container mx-auto px-4">
            <div className="max-w-2xl text-white">
              <h1 className="text-5xl font-bold mb-6 leading-tight">
                {slides[currentSlide].title}
              </h1>
              <p className="text-lg mb-8 opacity-90">
                {slides[currentSlide].subtitle}
              </p>
              <div className="flex flex-wrap gap-4">
                <Button size="lg" className="bg-primary hover:bg-primary/90 text-white px-8">
                  {slides[currentSlide].cta1}
                </Button>
                <Button size="lg" variant="outline" className="border-2 border-white text-white hover:bg-white hover:text-gray-900 px-8">
                  {slides[currentSlide].cta2}
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Carousel Indicators */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex space-x-2">
          <div className="w-10 h-1 bg-white rounded-full" />
          <div className="w-10 h-1 bg-white/40 rounded-full" />
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
                  className="border border-gray-300 w-full px-4 py-3 pl-10 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
                <svg className="w-5 h-5 text-gray-400 absolute left-3 top-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
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
                  src="/hero-image.jpg" 
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

                  {/* Textile et habillement - Image card with badge */}
                  <div className="bg-white rounded-lg shadow-sm relative">
                    <span className="bg-blue-600 hover:bg-orange-500 text-white px-3 py-1 rounded-full text-xs font-semibold absolute -top-2 -left-2 z-10 transition-colors cursor-pointer">
                      Nouveau
                    </span>
                    <img alt="Textile et habillement" src="/textile1.jpg" className="w-full h-36 object-cover rounded-t-lg" />
                    <div className="p-4">
                      <h3 className="text-base font-bold text-gray-900 mb-2">Textile et habillement</h3>
                      <p className="text-sm text-gray-600 mb-3">Découvrez les créateurs de mode et de vêtements uniques.</p>
                      <div className="flex justify-end">
                        <Button className="bg-orange-600 hover:bg-orange-700 text-white font-semibold px-3 py-1 rounded-lg text-sm">
                          Voir
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
                    <span className="bg-green-500 hover:bg-orange-500 text-white px-3 py-1 rounded-full text-xs font-semibold absolute -top-2 -left-2 z-10 transition-colors cursor-pointer">
                      Populaire
                    </span>
                    <img alt="Métiers de bouche" src="/metier-bouche.jpg" className="w-full h-36 object-cover rounded-t-lg" />
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
                    <button className="bg-orange-500 text-white px-6 py-2 rounded-lg font-semibold hover:bg-orange-600 transition-colors text-sm">
                      S'inscrire
                    </button>
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

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {experts.map((expert) => (
              <div key={expert.id} className="rounded-lg border border-gray-200 p-5 relative hover:shadow-lg transition-shadow">
                {expert.badge && (
                  <span className={`${expert.badgeColor} hover:bg-orange-500 text-white text-xs px-3 py-1 rounded-full absolute -top-1 -left-1 z-10 transition-colors cursor-pointer`}>
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
                  <a href="#" className="text-orange-500 font-medium flex items-center hover:text-orange-600">
                    Voir le profil
                    <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}

export default Index
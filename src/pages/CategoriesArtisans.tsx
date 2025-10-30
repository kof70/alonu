import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Search, MapPin, Palette, Sparkles, Video, Shirt, TreePine, Building2, Mountain, ChevronLeft, ChevronRight, Grid3x3, List } from 'lucide-react'
import Footer from '@/components/layout/Footer'
import ArtisanCard from '@/components/ArtisanCard'
import { useCategoriesContext } from '@/contexts/CategoryContext'
import { useArtisanSearch } from '@/hooks/use-artisans'
import { categoryService } from '@/core/services/category.service'

const CategoriesArtisans: React.FC = () => {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [selectedCategory, setSelectedCategory] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>('')
  const [selectedSpecialty, setSelectedSpecialty] = useState<string>('')
  const [selectedSubcategoryId, setSelectedSubcategoryId] = useState<string>('')
  const [artisans, setArtisans] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [totalArtisans, setTotalArtisans] = useState(0)
  const itemsPerPage = 12

  // Hooks pour récupérer les données de l'API
  const { categories: apiCategories, loading: categoriesLoading } = useCategoriesContext()
  const { artisans: searchResults, loading: searchLoading, search, clearSearch } = useArtisanSearch()

  // Mapping des icônes
  const iconMap: Record<string, any> = {
    'Shirt': Shirt,
    'Armchair': TreePine,
    'Hammer': Building2,
    'Building2': Building2,
    'Palette': Palette,
    'UtensilsCrossed': Sparkles,
    'Sparkles': Sparkles,
    'Video': Video,
    'Mountain': Mountain,
  }

  // Utiliser les catégories de l'API avec fallback vers données statiques pendant le chargement
  const categories = React.useMemo(() => {
    // Si on a des catégories de l'API, les utiliser
    if (apiCategories && apiCategories.length > 0) {
      return apiCategories.map((cat, index) => ({
        id: parseInt(cat.id),
        name: cat.name,
        icon: iconMap[cat.icon] || Palette,
        count: cat.subcategories?.length || 0,
        color: index === 0 ? 'bg-primary' : 'bg-white'
      }));
    }
    
    // Sinon, utiliser les données statiques comme placeholder
    return [
      {
        id: 1,
        name: 'Artisanat d\'art et décoration',
        icon: Palette,
        count: 21,
        color: 'bg-primary'
      },
      {
        id: 2,
        name: 'Hygiène et soins corporels',
        icon: Sparkles,
        count: 15,
        color: 'bg-white'
      },
      {
        id: 3,
        name: 'Audiovisuel et communication',
        icon: Video,
        count: 12,
        color: 'bg-white'
      },
      {
        id: 4,
        name: 'Textile, habillement,...',
        icon: Shirt,
        count: 18,
        color: 'bg-white'
      },
      {
        id: 5,
        name: 'Bois et Assimilés, Mobilier et...',
        icon: TreePine,
        count: 14,
        color: 'bg-white'
      },
      {
        id: 6,
        name: 'Métaux, et constructions...',
        icon: Building2,
        count: 16,
        color: 'bg-white'
      },
      {
        id: 7,
        name: 'Mines et Carrières,...',
        icon: Mountain,
        count: 10,
        color: 'bg-white'
      }
    ];
  }, [apiCategories]);

  // Spécialités dynamiques selon la catégorie sélectionnée (avec IDs)
  const specialties = React.useMemo((): { id: string; name: string }[] => {
    if (!selectedCategoryId) {
      return [{ id: '', name: 'Toutes' }]
    }

    // 1) Depuis le cache du service avec IDs
    const subsWithIds = categoryService.getSubcategoriesWithIdsByCategory(selectedCategoryId)
    if (subsWithIds && subsWithIds.length > 0) {
      return [{ id: '', name: 'Toutes' }, ...subsWithIds.map(s => ({ id: String(s.id), name: s.name }))]
    }

    // 2) Fallback: depuis apiCategories (sans IDs)
    const cat = apiCategories.find(c => parseInt(c.id) === parseInt(selectedCategoryId))
    const names = cat?.subcategories || []
    if (names.length > 0) {
      return [{ id: '', name: 'Toutes' }, ...names.map((n, idx) => ({ id: String(idx + 1), name: String(n) }))]
    }

    return [{ id: '', name: 'Toutes' }]
  }, [apiCategories, selectedCategoryId])

  // Fonction pour charger les artisans
  const loadArtisans = async (page: number = 1, categoryId?: string, specialtyName?: string, subcategoryId?: string) => {
    if (!categoryId) {
      setArtisans([])
      setTotalPages(1)
      setTotalArtisans(0)
      return
    }

    try {
      setLoading(true)
      const normalize = (s: string) => s
        ?.toLowerCase()
        ?.normalize('NFD')
        ?.replace(/\p{Diacritic}/gu, '')
        ?.trim() || ''

      let data: any[] = []

      // Si un ID de sous-catégorie est fourni, l'utiliser directement
      if (subcategoryId) {
        const resp = await fetch(`${import.meta.env.VITE_API_BASE_URL}/artisans/sous_categorie/${subcategoryId}`)
        if (!resp.ok) throw new Error('Erreur lors du chargement des artisans par sous-catégorie')
        data = await resp.json()
      } else if (specialtyName && specialtyName !== 'Toutes') {
        // Sinon essayer de résoudre l'ID par le nom
        const subId = await categoryService.findSubcategoryIdByName(categoryId, specialtyName)
        if (subId) {
          const resp = await fetch(`${import.meta.env.VITE_API_BASE_URL}/artisans/sous_catégorie/${subId}`)
          if (!resp.ok) throw new Error('Erreur lors du chargement des artisans par sous-catégorie')
          data = await resp.json()
        }
      }

      // Fallback: si pas de data par sous-catégorie, récupérer par catégorie
      if (!Array.isArray(data) || data.length === 0) {
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/artisans/categorie/${categoryId}`)
        if (!response.ok) {
          throw new Error('Erreur lors du chargement des artisans')
        }
        data = await response.json()
      }

      // Filtrer par spécialité côté client si nécessaire (sécurise les différences d'accents/casse)
      let filteredArtisans = data
      if (specialtyName && specialtyName !== 'Toutes') {
        const needle = normalize(specialtyName)
        filteredArtisans = data.filter((artisan: any) => {
          const lib = normalize(artisan?.sousCategories?.libelle || '')
          return lib.includes(needle)
        })
      }
      
      // Pagination côté client
      const startIndex = (page - 1) * itemsPerPage
      const endIndex = startIndex + itemsPerPage
      const paginatedArtisans = filteredArtisans.slice(startIndex, endIndex)
      
      setArtisans(paginatedArtisans)
      setTotalPages(Math.ceil(filteredArtisans.length / itemsPerPage))
      setTotalArtisans(filteredArtisans.length)
      setCurrentPage(page)
      
    } catch (error) {
      console.error('Erreur lors du chargement des artisans:', error)
      setArtisans([])
      setTotalPages(1)
      setTotalArtisans(0)
    } finally {
      setLoading(false)
    }
  }

  // Utiliser les artisans de l'API ou les artisans par défaut
  const displayedArtisans = searchQuery ? searchResults : artisans

  // Gestion de la recherche avec debounce
  const [searchTimeout, setSearchTimeout] = useState<number | null>(null)

  const handleSearchInput = (query: string) => {
    setSearchQuery(query)
    
    // Annuler le timeout précédent
    if (searchTimeout) {
      clearTimeout(searchTimeout)
    }
    
    // Si la requête est vide, effacer immédiatement
    if (!query.trim()) {
      clearSearch()
      setArtisans([])
      setSelectedCategoryId('')
      setSelectedCategory('')
      return
    }
    
    // Attendre 500ms avant de lancer la recherche
    const timeout = window.setTimeout(() => {
      console.log('🔍 Recherche lancée pour:', query)
      search(query)
    }, 500)
    
    setSearchTimeout(timeout)
  }

  const handleSearchButton = () => {
    if (searchQuery.trim()) {
      console.log('🔍 Recherche bouton cliqué pour:', searchQuery)
      // Annuler le debounce et lancer immédiatement
      if (searchTimeout) {
        clearTimeout(searchTimeout)
      }
      search(searchQuery)
    }
  }

  const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      handleSearchButton()
    }
  }

  // Gestion du changement de catégorie
  const handleCategoryChange = (categoryName: string, categoryId: string) => {
    setSelectedCategory(categoryName)
    setSelectedCategoryId(categoryId)
    setSelectedSpecialty('Toutes')
    setSearchQuery('')
    clearSearch()
    setCurrentPage(1)
    loadArtisans(1, categoryId, 'Toutes')
  }

  // Gestion du changement de spécialité
  const handleSpecialtyChange = (specialty: { id: string; name: string }) => {
    setSelectedSpecialty(specialty.name)
    setSelectedSubcategoryId(specialty.id || '')
    // Si une recherche est active, la réinitialiser pour afficher le filtrage par spécialité
    if (searchQuery) {
      setSearchQuery('')
      clearSearch()
    }
    setCurrentPage(1)
    loadArtisans(1, selectedCategoryId, specialty.name, specialty.id)
  }

  // Gestion de la pagination
  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    loadArtisans(page, selectedCategoryId, selectedSpecialty)
  }

  // Effet pour recharger les artisans quand la catégorie change
  useEffect(() => {
    if (selectedCategoryId && !searchQuery) {
      loadArtisans(1, selectedCategoryId, selectedSpecialty)
    }
  }, [selectedCategoryId, selectedSpecialty])

  // Nettoyage du timeout à la destruction du composant
  useEffect(() => {
    return () => {
      if (searchTimeout) {
        clearTimeout(searchTimeout)
      }
    }
  }, [searchTimeout])

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

      {/* Breadcrumb */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <Link to="/" className="hover:text-primary">Accueil</Link>
            <ChevronRight className="h-4 w-4" />
            <Link to="/categories" className="hover:text-primary">Catégories</Link>
            <ChevronRight className="h-4 w-4" />
            <span className="text-gray-900 font-medium">
              {selectedCategory || 'Sélectionnez une catégorie'}
            </span>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-50 via-orange-50 to-white py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-8">
            <h1 className="text-4xl font-bold mb-4">
              Trouvez l'Artisan qu'il vous faut
            </h1>
            <p className="text-gray-600">
              Sélectionnez une catégorie pour découvrir nos artisans qualifiés et vérifiés
            </p>
          </div>

          {/* Search Bar */}
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center gap-3 bg-white rounded-full shadow-lg p-2">
              <div className="flex-1 flex items-center px-4">
                <Search className="h-5 w-5 text-gray-400 mr-3" />
                <input
                  type="text"
                  placeholder="Rechercher un artisan, un métier..."
                  className="w-full py-3 outline-none text-gray-700"
                  value={searchQuery}
                  onChange={(e) => handleSearchInput(e.target.value)}
                  onKeyDown={handleSearchKeyDown}
                />
              </div>
              <button className="p-3 rounded-full border border-gray-200 hover:bg-gray-50">
                <MapPin className="h-5 w-5 text-gray-600" />
              </button>
              <Button 
                className="bg-primary hover:bg-primary/90 rounded-full px-8"
                onClick={handleSearchButton}
                disabled={searchLoading}
              >
                {searchLoading ? 'Recherche...' : 'Rechercher'}
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold mb-6">Catégories</h2>
          
          {categoriesLoading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
              <span className="ml-3 text-gray-600">Chargement des catégories...</span>
            </div>
          ) : categories.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-gray-400 mb-4">
                <Palette className="h-16 w-16 mx-auto" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Aucune catégorie disponible
              </h3>
              <p className="text-gray-600">
                Les catégories ne sont pas disponibles pour le moment. Veuillez réessayer plus tard.
              </p>
            </div>
          ) : (
            <div className="relative">
              <button className="absolute left-0 top-1/2 -translate-y-1/2 z-10 p-2 bg-white rounded-full shadow-md hover:shadow-lg">
                <ChevronLeft className="h-5 w-5" />
              </button>
              
              <div className="overflow-x-auto hide-scrollbar">
                <div className="flex gap-4 px-8">
                  {categories.map((category) => (
                    <Card 
                      key={category.id}
                      className={`flex-shrink-0 w-72 cursor-pointer transition-all duration-300 ease-in-out hover:shadow-xl hover:-translate-y-1 ${
                        category.name === selectedCategory ? 'bg-primary text-white shadow-lg' : 'bg-white hover:bg-orange-50'
                      }`}
                      onClick={() => handleCategoryChange(category.name, category.id.toString())}
                    >
                      <div className="p-4">
                        <div className="flex flex-col items-center text-center gap-2">
                          <div className={`p-2 rounded-lg transition-all duration-300 ${
                            category.name === selectedCategory ? 'bg-white/20' : 'bg-orange-100'
                          }`}>
                            <category.icon className={`w-8 h-8 transition-colors duration-300 ${
                              category.name === selectedCategory ? 'text-white' : 'text-primary'
                            }`} />
                          </div>
                          <h3 className={`font-semibold text-base transition-colors duration-300 truncate w-full ${
                            category.name === selectedCategory ? 'text-white' : 'text-gray-900'
                          }`} title={category.name}>
                            {category.name}
                          </h3>
                          {category.count !== undefined && (
                            <span className={`text-xs px-2 py-0.5 rounded-full font-medium transition-all duration-300 ${
                              category.name === selectedCategory ? 'bg-white text-primary' : 'bg-gray-100 text-gray-700'
                            }`}>
                              {category.count} spécialité{category.count > 1 ? 's' : ''}
                            </span>
                          )}
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>

              <button className="absolute right-0 top-1/2 -translate-y-1/2 z-10 p-2 bg-white rounded-full shadow-md hover:shadow-lg">
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Specialties and Results Section */}
      {(selectedCategory || searchQuery) && (
        <section className="py-12 bg-gray-50">
          <div className="container mx-auto px-4">
            {selectedCategory && !searchQuery && (
              <h2 className="text-2xl font-bold mb-6">Spécialités</h2>
            )}
            {searchQuery && (
              <h2 className="text-2xl font-bold mb-6">Résultats de recherche</h2>
            )}
            
            {/* Specialties Tabs - Only show when not searching */}
            {selectedCategory && !searchQuery && (
              <div className="overflow-x-auto hide-scrollbar mb-8">
                <div className="flex gap-3 pb-4">
                {specialties.map((specialty, index) => (
                    <button
                      key={index}
                      className={`flex-shrink-0 px-6 py-2 rounded-full text-sm font-medium transition-all duration-200 whitespace-nowrap ${
                      specialty.name === selectedSpecialty
                          ? 'bg-primary text-white shadow-md'
                          : 'bg-white text-gray-800 hover:bg-gray-100 border border-gray-200'
                      }`}
                      onClick={() => handleSpecialtyChange(specialty)}
                    >
                      {specialty.name}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Results Header */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-semibold">
                  {searchQuery ? 'Résultats de la recherche' : 'Artisans disponibles'}
                </h3>
                <p className="text-sm text-gray-600">
                  ({searchQuery ? displayedArtisans.length : totalArtisans} résultat{(searchQuery ? displayedArtisans.length : totalArtisans) > 1 ? 's' : ''})
                  {searchQuery && ` pour "${searchQuery}"`}
                </p>
              </div>
            
            {/* View Toggle */}
            <div className="flex items-center gap-2 bg-white rounded-lg p-1 shadow-sm">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded ${
                  viewMode === 'grid'
                    ? 'bg-primary text-white'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <Grid3x3 className="h-5 w-5" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded ${
                  viewMode === 'list'
                    ? 'bg-primary text-white'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <List className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Geolocation Notice */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6 flex items-start gap-3">
            <MapPin className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm text-blue-900">
                <span className="font-semibold">Géolocalisation désactivée</span>
              </p>
              <p className="text-sm text-blue-700">
                Activez la géolocalisation dans votre navigateur pour voir les artisans proches
              </p>
            </div>
          </div>

            {/* Artisans Grid */}
            {loading || searchLoading ? (
              <div className="flex justify-center items-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                <span className="ml-3 text-gray-600">
                  {searchLoading ? 'Recherche en cours...' : 'Chargement des artisans...'}
                </span>
              </div>
            ) : displayedArtisans.length > 0 ? (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {displayedArtisans.map((artisan) => (
                    <ArtisanCard key={artisan.id} artisan={artisan} />
                  ))}
                </div>

                {/* Pagination */}
                {!searchQuery && totalPages > 1 && (
                  <div className="flex justify-center items-center mt-8 space-x-2">
                    <Button
                      variant="outline"
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                    >
                      <ChevronLeft className="h-4 w-4 mr-1" />
                      Précédent
                    </Button>
                    
                    <div className="flex space-x-1">
                      {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                        const page = i + 1
                        return (
                          <Button
                            key={page}
                            variant={currentPage === page ? "default" : "outline"}
                            onClick={() => handlePageChange(page)}
                            className="w-10 h-10"
                          >
                            {page}
                          </Button>
                        )
                      })}
                    </div>
                    
                    <Button
                      variant="outline"
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages}
                    >
                      Suivant
                      <ChevronRight className="h-4 w-4 ml-1" />
                    </Button>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-12">
                <div className="text-gray-400 mb-4">
                  <Search className="h-16 w-16 mx-auto" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {searchQuery ? 'Aucun artisan trouvé' : 'Aucun artisan disponible'}
                </h3>
                <p className="text-gray-600">
                  {searchQuery 
                    ? `Aucun résultat pour "${searchQuery}". Essayez avec d'autres mots-clés.`
                    : 'Aucun artisan n\'est disponible dans cette catégorie pour le moment.'
                  }
                </p>
                {searchQuery && (
                  <Button 
                    onClick={() => {
                      setSearchQuery('')
                      clearSearch()
                    }}
                    className="mt-4"
                    variant="outline"
                  >
                    Effacer la recherche
                  </Button>
                )}
              </div>
            )}
          </div>
        </section>
      )}

      {/* Message si aucune catégorie sélectionnée */}
      {!selectedCategory && (
        <section className="py-12 bg-gray-50">
          <div className="container mx-auto px-4 text-center">
            <div className="text-gray-400 mb-4">
              <Palette className="h-16 w-16 mx-auto" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Sélectionnez une catégorie
            </h3>
            <p className="text-gray-600">
              Choisissez une catégorie ci-dessus pour voir les artisans disponibles
            </p>
          </div>
        </section>
      )}

      <Footer />

      <style>{`
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  )
}

export default CategoriesArtisans
import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Search, MapPin, Palette, Sparkles, Video, Shirt, TreePine, Building2, Mountain, ChevronLeft, ChevronRight, Grid3x3, List, Phone, Mail, Facebook, Twitter, Instagram, Linkedin, Youtube } from 'lucide-react'
import Footer from '@/components/layout/Footer'

const CategoriesArtisans: React.FC = () => {
  const navigate = useNavigate()
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [selectedCategory, setSelectedCategory] = useState('Artisanat d\'art et décoration')

  const categories = [
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
      color: 'bg-white'
    },
    {
      id: 3,
      name: 'Audiovisuel et communication',
      icon: Video,
      color: 'bg-white'
    },
    {
      id: 4,
      name: 'Textile, habillement,...',
      icon: Shirt,
      color: 'bg-white'
    },
    {
      id: 5,
      name: 'Bois et Assimilés, Mobilier et...',
      icon: TreePine,
      color: 'bg-white'
    },
    {
      id: 6,
      name: 'Métaux, et constructions...',
      icon: Building2,
      color: 'bg-white'
    },
    {
      id: 7,
      name: 'Mines et Carrières,...',
      icon: Mountain,
      color: 'bg-white'
    }
  ]

  const specialties = [
    'Toutes',
    'Teinturiers',
    'Horticulteurs',
    'Dessinateurs',
    'Calligraphes',
    'Aménagistes',
    'Paysagistes',
    'créateurs d\'espaces verts',
    'Jardiniers',
    'Fabricants d\'objets de décoration d\'intérieu'
  ]

  const artisans = [
    {
      id: 1,
      name: 'Master Eli',
      profession: 'Teinturiers',
      verified: true,
      crmVerified: true
    },
    {
      id: 2,
      name: 'KAYI AFI TOHONOU',
      profession: 'Teinturiers',
      verified: true,
      crmVerified: true
    },
    {
      id: 3,
      name: 'Hounmevi AKAKPO',
      profession: 'Teinturiers',
      verified: true,
      crmVerified: true
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
              <Link to="/" className="text-gray-700 hover:text-primary transition-colors font-medium">
                Accueil
              </Link>
              <Link to="/categories" className="text-gray-700 hover:text-primary transition-colors font-medium">
                Artisans par Catégorie
              </Link>
            </nav>

            <div className="flex items-center space-x-3">
              <Button variant="outline" className="border-2 border-primary text-primary hover:bg-primary/10">
                Connexion
              </Button>
              <Button className="bg-primary hover:bg-primary/90">
                S'inscrire
              </Button>
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
            <span className="text-gray-900 font-medium">Spécialité</span>
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
                />
              </div>
              <button className="p-3 rounded-full border border-gray-200 hover:bg-gray-50">
                <MapPin className="h-5 w-5 text-gray-600" />
              </button>
              <Button className="bg-primary hover:bg-primary/90 rounded-full px-8">
                Rechercher
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold mb-6">Catégories</h2>
          
          {/* Categories Carousel */}
          <div className="relative">
            <button className="absolute left-0 top-1/2 -translate-y-1/2 z-10 p-2 bg-white rounded-full shadow-md hover:shadow-lg">
              <ChevronLeft className="h-5 w-5" />
            </button>
            
            <div className="overflow-x-auto hide-scrollbar">
              <div className="flex gap-4 px-8">
                {categories.map((category) => (
                  <Card 
                    key={category.id}
                    className={`flex-shrink-0 w-64 cursor-pointer transition-all hover:shadow-lg ${
                      category.name === selectedCategory ? category.color + ' text-white' : 'bg-white'
                    }`}
                    onClick={() => setSelectedCategory(category.name)}
                  >
                    <div className="p-6">
                      <div className="flex items-start justify-between mb-3">
                        <div className="p-2 rounded-lg bg-white/20">
                          <category.icon className="w-8 h-8" />
                        </div>
                        {category.count && (
                          <span className={`text-xs px-2 py-1 rounded-full ${
                            category.name === selectedCategory ? 'bg-white text-primary' : 'bg-gray-100'
                          }`}>
                            {category.count} spécialités
                          </span>
                        )}
                      </div>
                      <h3 className={`font-semibold ${
                        category.name === selectedCategory ? 'text-white' : 'text-gray-900'
                      }`}>
                        {category.name}
                      </h3>
                    </div>
                  </Card>
                ))}
              </div>
            </div>

            <button className="absolute right-0 top-1/2 -translate-y-1/2 z-10 p-2 bg-white rounded-full shadow-md hover:shadow-lg">
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </div>
      </section>

      {/* Specialties Section */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold mb-6">Spécialités</h2>
          
          {/* Specialties Tabs */}
          <div className="overflow-x-auto hide-scrollbar mb-8">
            <div className="flex gap-3 pb-4">
              {specialties.map((specialty, index) => (
                <button
                  key={index}
                  className={`flex-shrink-0 px-6 py-2 rounded-full text-sm font-medium transition-colors ${
                    index === 1
                      ? 'bg-primary text-white'
                      : 'bg-white text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  {specialty}
                </button>
              ))}
            </div>
          </div>

          {/* Results Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold">Artisans disponibles</h3>
              <p className="text-sm text-gray-600">(3 résultats)</p>
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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {artisans.map((artisan) => (
              <Card 
                key={artisan.id} 
                className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
                onClick={() => navigate(`/artisan/${artisan.id}`)}
              >
                <div className="p-6">
                  <div className="flex flex-col items-center text-center">
                    <div className="relative mb-4">
                      <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center">
                        <svg className="w-10 h-10 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                        </svg>
                      </div>
                      {artisan.verified && (
                        <div className="absolute -bottom-1 -right-1 w-7 h-7 bg-accent rounded-full flex items-center justify-center border-2 border-white">
                          <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        </div>
                      )}
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-1">{artisan.name}</h3>
                    <p className="text-sm text-gray-600 mb-4">{artisan.profession}</p>
                    {artisan.crmVerified && (
                      <div className="mb-4">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-accent/10 text-accent border border-accent/20">
                          Vérifié CRM
                        </span>
                      </div>
                    )}
                    <Button className="w-full bg-primary hover:bg-primary/90">
                      Voir le profil
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

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
import React, { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { ArrowLeft, Phone, MapPin, Mail, MessageSquare, ChevronLeft, ChevronRight } from 'lucide-react'
import Footer from '@/components/layout/Footer'

const ArtisanProfile: React.FC = () => {
  const navigate = useNavigate()
  const { id } = useParams()
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  const artisan = {
    name: 'Marc AGBO',
    profession: 'Calligraphes',
    verified: true,
    crmVerified: true,
    phone: '90000840',
    registrationNumber: '12345678',
    email: 'm@m.com',
    location: 'Lomé, Togo',
    about: 'Marc AGBO est un artisan calligraphes avec un CRM vérifié.\n\nBasé à, notre artisan met son expertise au service de vos projets avec professionnalisme et savoir-faire.',
    gallery: [
      { id: 1, url: '/slide1.jpg', thumbnail: '/slide1.jpg' },
      { id: 2, url: '/slide2.jpg', thumbnail: '/slide2.jpg' },
      { id: 3, url: '/slide3.jpg', thumbnail: '/slide3.jpg' }
    ],
    projects: [
      {
        id: 1,
        title: 'test3',
        description: 'description de test3',
        images: ['/slide1.jpg']
      },
      {
        id: 2,
        title: 'test2',
        description: 'description for test2',
        images: ['/slide2.jpg']
      },
      {
        id: 3,
        title: 'test',
        description: 'test description',
        images: ['/slide3.jpg', '/textile1.jpg', '/metier-bouche.jpg']
      }
    ]
  }

  const nextImage = () => {
    setCurrentImageIndex((prev) => 
      prev === artisan.gallery.length - 1 ? 0 : prev + 1
    )
  }

  const prevImage = () => {
    setCurrentImageIndex((prev) => 
      prev === 0 ? artisan.gallery.length - 1 : prev - 1
    )
  }

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

      {/* Hero Section with Gradient Background */}
      <section className="relative h-48 bg-gradient-to-r from-orange-400 via-blue-500 to-teal-500">
        <div className="absolute inset-0 bg-gradient-to-r from-orange-400/90 via-blue-500/90 to-teal-500/90" />
        <div className="relative container mx-auto px-4 py-8">
          <Button 
            variant="ghost" 
            onClick={() => navigate(-1)}
            className="text-white hover:bg-white/20"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Retour
          </Button>
        </div>
      </section>

      {/* Profile Content */}
      <div className="container mx-auto px-4 -mt-16 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Profile Card */}
          <div className="lg:col-span-1">
            <Card className="overflow-hidden shadow-lg">
              <div className="p-8 bg-white">
                <div className="flex flex-col items-center text-center mb-6">
                  <div className="relative mb-4">
                    <div className="w-32 h-32 bg-gray-200 rounded-full flex items-center justify-center border-4 border-white shadow-lg">
                      <svg className="w-16 h-16 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                      </svg>
                    </div>
                    {artisan.verified && (
                      <div className="absolute bottom-0 right-0 w-10 h-10 bg-accent rounded-full flex items-center justify-center border-4 border-white">
                        <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                    )}
                  </div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">{artisan.name}</h1>
                  <p className="text-gray-600 mb-4 flex items-center gap-2">
                    <span className="text-lg">🖊️</span>
                    {artisan.profession}
                  </p>
                  {artisan.crmVerified && (
                    <div className="mb-4">
                      <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-accent/10 text-accent border-2 border-accent/30">
                        CRM vérifié
                      </span>
                    </div>
                  )}
                </div>

                {/* Contact Buttons */}
                <div className="space-y-3 mb-6">
                  <Button className="w-full bg-[#25D366] hover:bg-[#20BA5A] text-white">
                    <MessageSquare className="h-4 w-4 mr-2" />
                    WhatsApp
                  </Button>
                  <Button variant="outline" className="w-full border-2 border-primary text-primary hover:bg-primary hover:text-white">
                    <Phone className="h-4 w-4 mr-2" />
                    Appeler
                  </Button>
                  <Button variant="outline" className="w-full border-2 border-primary text-primary hover:bg-primary hover:text-white">
                    <MapPin className="h-4 w-4 mr-2" />
                    Localiser
                  </Button>
                </div>
              </div>
            </Card>

            {/* Contact Information Card */}
            <Card className="mt-6 overflow-hidden shadow-lg">
              <div className="p-6 bg-white">
                <h2 className="text-xl font-bold mb-4">Informations de contact</h2>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Téléphone</p>
                    <p className="font-medium text-gray-900">{artisan.phone}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Numéro d'enregistrement</p>
                    <p className="font-medium text-gray-900">{artisan.registrationNumber}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Email</p>
                    <p className="font-medium text-gray-900">{artisan.email}</p>
                  </div>
                </div>
              </div>
            </Card>

            {/* Location Card */}
            <Card className="mt-6 overflow-hidden shadow-lg">
              <div className="p-6 bg-white">
                <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-primary" />
                  Localisation
                </h2>
                <div className="aspect-video bg-gray-200 rounded-lg overflow-hidden">
                  <img 
                    src="/placeholder.svg" 
                    alt="Map" 
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </Card>
          </div>

          {/* Right Column - About & Gallery */}
          <div className="lg:col-span-2">
            {/* About Section */}
            <Card className="overflow-hidden shadow-lg mb-8">
              <div className="p-8 bg-white">
                <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                  <span>👤</span>
                  À propos
                </h2>
                <div className="text-gray-700 whitespace-pre-line leading-relaxed">
                  {artisan.about}
                </div>
              </div>
            </Card>

            {/* Gallery Section */}
            <Card className="overflow-hidden shadow-lg mb-8">
              <div className="p-8 bg-white">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold">Galerie de réalisations</h2>
                  <span className="text-gray-600">{artisan.gallery.length} photos</span>
                </div>
                
                {/* Main Image */}
                <div className="relative aspect-video bg-gray-100 rounded-lg overflow-hidden mb-4">
                  <img 
                    src={artisan.gallery[currentImageIndex].url}
                    alt={`Gallery ${currentImageIndex + 1}`}
                    className="w-full h-full object-cover"
                  />
                  <button
                    onClick={prevImage}
                    className="absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-white/90 hover:bg-white rounded-full shadow-lg"
                  >
                    <ChevronLeft className="h-6 w-6" />
                  </button>
                  <button
                    onClick={nextImage}
                    className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-white/90 hover:bg-white rounded-full shadow-lg"
                  >
                    <ChevronRight className="h-6 w-6" />
                  </button>
                </div>

                {/* Thumbnails */}
                <div className="grid grid-cols-3 gap-4">
                  {artisan.gallery.map((image, index) => (
                    <button
                      key={image.id}
                      onClick={() => setCurrentImageIndex(index)}
                      className={`aspect-video rounded-lg overflow-hidden ${
                        index === currentImageIndex 
                          ? 'ring-4 ring-primary' 
                          : 'hover:ring-2 hover:ring-gray-300'
                      }`}
                    >
                      <img 
                        src={image.thumbnail}
                        alt={`Thumbnail ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              </div>
            </Card>

            {/* Projects Section */}
            <Card className="overflow-hidden shadow-lg">
              <div className="p-8 bg-white">
                <h2 className="text-2xl font-bold mb-6">Projets réalisés</h2>
                
                <div className="space-y-8">
                  {artisan.projects.map((project) => (
                    <div key={project.id} className="border-b border-gray-200 last:border-0 pb-8 last:pb-0">
                      <h3 className="text-xl font-semibold mb-2">{project.title}</h3>
                      <p className="text-gray-600 mb-4">{project.description}</p>
                      <div className="grid grid-cols-3 gap-4">
                        {project.images.map((image, index) => (
                          <div key={index} className="aspect-square rounded-lg overflow-hidden">
                            <img 
                              src={image}
                              alt={`${project.title} ${index + 1}`}
                              className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>

      {/* Floating Action Button */}
      <button className="fixed bottom-8 right-8 bg-blue-600 text-white p-4 rounded-full shadow-lg hover:bg-blue-700 transition-colors z-50">
        <span className="text-sm font-semibold">Artisans par Catégorie</span>
      </button>

      <Footer />
    </div>
  )
}

export default ArtisanProfile
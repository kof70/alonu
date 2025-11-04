import { useEffect, useState, useRef } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, Phone, MapPin, ChevronRight, ChevronLeft } from 'lucide-react'
import Footer from '@/components/layout/Footer'
import { artisanApiService } from '@/infrastructure/api/artisan.api'
import { RealisationsApi } from '@/infrastructure/api/realisations.api'

export default function ArtisanProfile() {
  const navigate = useNavigate()
  const { id } = useParams()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [artisan, setArtisan] = useState<any>(null)
  const [realisations, setRealisations] = useState<any[]>([])
  
  const galleryRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!id) {
      setError('ID artisan manquant')
      return
    }
    ;(async () => {
      setLoading(true)
      setError(null)
      console.log('🔍 Chargement artisan ID:', id)
      try {
        const artisanId = Number(id)
        if (isNaN(artisanId)) {
          throw new Error(`ID invalide: ${id}`)
        }
        console.log('📡 Appel API pour artisan ID:', artisanId)
        
        let a = await artisanApiService.getArtisanById(artisanId)
        console.log('✅ Artisan chargé depuis API:', a)
        
        // S'assurer que l'artisan a bien un idArtisan si nécessaire
        if (a && !a.idArtisan && artisanId) {
          a.idArtisan = artisanId
        }
        setArtisan(a)
        
        const r = await RealisationsApi.getByArtisan(artisanId)
        const realData = (r as any).data || []
        console.log('✅ Réalisations chargées depuis API:', realData.length)
        setRealisations(realData)
      } catch (e: any) {
        console.error('❌ Erreur chargement artisan:', e)
        setError(e?.message || 'Impossible de charger le profil artisan')
      } finally {
        setLoading(false)
      }
    })()
  }, [id])

  return (
    <div className="min-h-screen bg-white pb-20">
      {/* Header */}
      <header className="bg-white shadow-sm border-b sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center space-x-2">
              <img src="/favicon.png" alt="Logo ALONU" className="h-10 w-auto" />
              <span className="text-2xl font-bold text-[#006E4F]">ALONU</span>
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
              <Link to="/login" className="inline-flex px-3 py-2 border-2 border-primary text-primary rounded-lg hover:bg-primary/10">Connexion</Link>
              <Link to="/register/artisan" className="inline-flex px-3 py-2 rounded-lg bg-primary text-white hover:bg-primary/90">S'inscrire</Link>
            </div>
          </div>
        </div>
      </header>

      {/* Gradient Background Section */}
      <div className="relative bg-gradient-to-r from-orange-400 via-purple-400 to-blue-500 px-6 pt-6 pb-32">
        <div className="max-w-7xl mx-auto">
          <button onClick={() => navigate(-1)} className="flex items-center gap-2 bg-white px-4 py-2 rounded-full text-gray-700 hover:bg-gray-50">
            <ArrowLeft className="w-4 h-4" />
            Retour
          </button>
        </div>
      </div>

      {/* Profile Card */}
      <div className="max-w-7xl mx-auto px-6 -mt-20 relative">
        {loading && (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
            <p className="mt-4 text-gray-600">Chargement du profil...</p>
                    </div>
        )}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
            <p className="font-medium">Erreur</p>
            <p className="text-sm">{error}</p>
            {id && <p className="text-xs mt-2">ID tenté: {id}</p>}
                      </div>
                    )}
        
        {!loading && !error && !artisan && (
          <div className="bg-yellow-50 border border-yellow-200 text-yellow-700 px-4 py-3 rounded mb-4">
            <p>Aucune donnée trouvée pour cet artisan.</p>
                  </div>
        )}
        {!loading && !error && artisan && (
        <>
        <div className="flex items-start gap-6 mb-6">
          <div className="relative flex-shrink-0">
            <div className="w-28 h-28 bg-gray-200 rounded-full flex items-center justify-center overflow-hidden">
              {artisan?.users?.avatar ? (
                <img
                  src={artisan.users.avatar}
                  alt={`${artisan?.users?.prenom || ''} ${artisan?.users?.nom || ''}`.trim() || 'Avatar utilisateur'}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-teal-100 to-teal-300 text-teal-800">
                  <span className="text-2xl font-bold">
                    {`${(artisan?.users?.prenom || 'A')[0] || 'A'}${(artisan?.users?.nom || 'U')[0] || 'U'}`.toUpperCase()}
                      </span>
                    </div>
                  )}
            </div>
            <div className="absolute bottom-0 right-0 w-7 h-7 bg-teal-500 rounded-full flex items-center justify-center border-2 border-white">
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
          </div>
          <div className="flex-1 bg-white rounded-2xl shadow-lg p-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{artisan?.users?.prenom} {artisan?.users?.nom}</h1>
            <div className="flex items-center gap-2 text-gray-600 mb-3">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              <span>{artisan?.sousCategories?.libelle || '—'}</span>
            </div>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-teal-50 border border-teal-500 text-teal-700 rounded-full text-sm font-medium">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              CRM vérifié
            </div>
          </div>
                </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <button
            onClick={() => {
              const phone = artisan?.whatsapp || artisan?.telephone || artisan?.crms?.telephone
              if (phone) {
                // Nettoyer le numéro (enlever espaces, +, etc.)
                const cleanPhone = phone.replace(/[^\d]/g, '')
                // Ouvrir WhatsApp Web/App
                window.open(`https://wa.me/${cleanPhone}`, '_blank')
              }
            }}
            className="flex items-center justify-center gap-2 bg-green-500 text-white py-3 rounded-lg font-medium hover:bg-green-600 transition-colors"
            type="button"
            disabled={!artisan?.whatsapp && !artisan?.telephone && !artisan?.crms?.telephone}
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
            </svg>
                    WhatsApp
          </button>
          <button
            onClick={() => {
              const phone = artisan?.telephone || artisan?.crms?.telephone
              if (phone) {
                // Ouvrir l'application d'appel
                window.location.href = `tel:${phone}`
              }
            }}
            className="flex items-center justify-center gap-2 bg-white border border-gray-300 text-orange-500 py-3 rounded-lg font-medium hover:bg-gray-50 transition-colors"
            type="button"
            disabled={!artisan?.telephone && !artisan?.crms?.telephone}
          >
            <Phone className="w-5 h-5" />
                    Appeler
          </button>
          <button
            onClick={() => {
              const lat = artisan?.latitude
              const lng = artisan?.longitude
              const address = artisan?.adresse || artisan?.crms?.adresse
              
              if (lat && lng) {
                // Ouvrir Google Maps avec les coordonnées
                window.open(`https://www.google.com/maps?q=${lat},${lng}`, '_blank')
              } else if (address) {
                // Ouvrir Google Maps avec l'adresse
                window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`, '_blank')
              }
            }}
            className="flex items-center justify-center gap-2 bg-white border border-gray-300 text-teal-500 py-3 rounded-lg font-medium hover:bg-gray-50 transition-colors"
            type="button"
            disabled={!artisan?.latitude && !artisan?.longitude && !artisan?.adresse && !artisan?.crms?.adresse}
          >
            <MapPin className="w-5 h-5" />
                    Localiser
          </button>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-3 gap-8">
          {/* Left Column */}
          <div className="col-span-2 space-y-8">
            {/* À propos */}
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <svg className="w-5 h-5 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                À propos
              </h2>
              <p className="text-gray-600 mb-3">{artisan?.users?.prenom} {artisan?.users?.nom} est un artisan {artisan?.sousCategories?.libelle || ''}.</p>
              <p className="text-gray-600">Basé à {artisan?.adresse || '—'}, met son expertise au service de vos projets.</p>
                </div>

            {/* Galerie de réalisations */}
            {realisations.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-900">Galerie de réalisations</h2>
              </div>
              <div className="relative">
                  {realisations.length > 1 && (
                    <>
                      <button
                        onClick={() => {
                          if (galleryRef.current) {
                            galleryRef.current.scrollBy({ left: -300, behavior: 'smooth' })
                          }
                        }}
                        className="absolute left-0 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-gray-700 hover:text-gray-900 border border-gray-200 shadow-sm rounded-full p-2 transition-colors disabled:opacity-50"
                        aria-label="Précédent"
                        type="button"
                      >
                        <ChevronLeft className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => {
                          if (galleryRef.current) {
                            galleryRef.current.scrollBy({ left: 300, behavior: 'smooth' })
                          }
                        }}
                        className="absolute right-0 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-gray-700 hover:text-gray-900 border border-gray-200 shadow-sm rounded-full p-2 transition-colors disabled:opacity-50"
                        aria-label="Suivant"
                        type="button"
                      >
                        <ChevronRight className="w-5 h-5" />
                      </button>
                    </>
                  )}
                  <div
                    ref={galleryRef}
                    className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide"
                    style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                  >
                  {realisations.map((r, idx) => (
                      <div key={idx} className="flex-shrink-0 w-64 h-80 bg-gray-100 rounded-lg overflow-hidden shadow-md">
                      <div className="w-full h-full flex items-center justify-center text-gray-700 text-xs p-4">
                        <div className="text-center">
                          <div className="font-medium mb-2">{r.titre || 'Réalisation'}</div>
                          <div className="opacity-70">{r.description || ''}</div>
                        </div>
                  </div>
                  </div>
                  ))}
                  </div>
                </div>
              </div>
            )}

            {/* Projets réalisés */}
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-4">Projets réalisés</h2>
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-1">test3</h3>
                <p className="text-gray-600 text-sm mb-3">description de test3</p>
                <div className="w-16 h-20 bg-gradient-to-b from-green-100 to-green-200 rounded-lg"></div>
              </div>
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-1">test2</h3>
                <p className="text-gray-600 text-sm mb-3">description for test2</p>
                <div className="w-16 h-20 bg-gradient-to-br from-red-700 to-black rounded-lg"></div>
              </div>
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-1">test</h3>
                <p className="text-gray-600 text-sm mb-3">test description</p>
                <div className="flex gap-2">
                  <div className="w-16 h-16 bg-gray-800 rounded-lg"></div>
                  <div className="w-16 h-16 bg-gray-700 rounded-lg"></div>
                  <div className="w-16 h-16 bg-gray-600 rounded-lg"></div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-8">
            {/* Informations de contact */}
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-4">Informations de contact</h2>
              <div className="space-y-4">
                <div>
                  <div className="text-sm text-gray-600 mb-1">Téléphone</div>
                  <div className="text-gray-900">{artisan?.telephone || artisan?.crms?.telephone || '—'}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-600 mb-1">Numéro d'enregistrement</div>
                  <div className="text-gray-900">{artisan?.numeroEnr || '—'}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-600 mb-1">Email</div>
                  <div className="text-gray-900">{artisan?.users?.email || artisan?.crms?.email || '—'}</div>
                </div>
              </div>
                </div>
                
            {/* Localisation */}
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <MapPin className="w-5 h-5 text-teal-500" />
                Localisation
              </h2>
              <div className="w-full h-64 bg-gray-200 rounded-lg overflow-hidden relative">
                {artisan?.latitude && artisan?.longitude ? (
                  <iframe
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    loading="lazy"
                    allowFullScreen
                    referrerPolicy="no-referrer-when-downgrade"
                    src={`https://www.openstreetmap.org/export/embed.html?bbox=${artisan.longitude - 0.01},${artisan.latitude - 0.01},${artisan.longitude + 0.01},${artisan.latitude + 0.01}&layer=mapnik&marker=${artisan.latitude},${artisan.longitude}`}
                    title="Localisation de l'artisan"
                  />
                ) : artisan?.adresse || artisan?.crms?.adresse ? (
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-100 via-gray-100 to-blue-50 flex flex-col items-center justify-center cursor-pointer hover:from-blue-200 hover:via-gray-200 transition-colors"
                    onClick={() => {
                      const address = encodeURIComponent(artisan.adresse || artisan.crms.adresse)
                      window.open(`https://www.google.com/maps/search/?api=1&query=${address}`, '_blank')
                    }}
                  >
                    <MapPin className="w-12 h-12 mx-auto mb-2 text-teal-600" />
                    <p className="text-sm text-gray-700 font-medium mb-1">Cliquez pour voir sur la carte</p>
                </div>
                ) : (
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-100 via-gray-100 to-blue-50 flex items-center justify-center">
                    <div className="text-center text-gray-500">
                      <MapPin className="w-12 h-12 mx-auto mb-2 opacity-50" />
                      <p className="text-sm">Localisation non disponible</p>
                    </div>
                </div>
                )}
              </div>
              {(artisan?.adresse || artisan?.crms?.adresse) && !artisan?.latitude && (
                <p className="text-sm text-gray-600 mt-2">
                  {artisan.adresse || artisan.crms.adresse}
                </p>
              )}
            </div>
          </div>
        </div>
        </>
        )}
      </div>

      {/* Bouton flottant: Artisans par Catégorie (fonctionnel) */}
      <button
        onClick={() => {
          const catId = artisan?.sousCategories?.categories?.idCategorie
          if (catId) {
            navigate(`/categories?cat=${encodeURIComponent(catId)}`)
          } else {
            navigate('/categories')
          }
        }}
        className="fixed bottom-8 right-8 bg-blue-600 text-white px-6 py-3 rounded-full shadow-lg hover:bg-blue-700 flex items-center gap-2 z-50"
        aria-label="Voir les artisans par catégorie"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        Artisans par Catégorie
      </button>

      <Footer />
    </div>
  )
}
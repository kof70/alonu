import { useEffect, useState } from 'react'
import { artisanApiService, ArtisanApiResponse } from '@/infrastructure/api/artisan.api'
import { RealisationsApi, RealisationDto } from '@/infrastructure/api/realisations.api'

export default function MonArtisan() {
  const [artisan, setArtisan] = useState<ArtisanApiResponse | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [realisations, setRealisations] = useState<RealisationDto[]>([])

  useEffect(() => {
    const storedId = localStorage.getItem('alonu_student_artisan_id')
    const id = storedId ? Number(storedId) : null
    if (!id) return
    setLoading(true)
    artisanApiService
      .getArtisanById(id)
      .then(async (data) => {
        setArtisan(data)
        try {
          const res = await RealisationsApi.getByArtisan(id)
          setRealisations(res.data || [])
        } catch (e) {
          // silencieux si indispo
        }
      })
      .catch((e) => setError(e?.message || 'Impossible de charger les informations'))
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
        <h1 className="text-2xl font-bold mb-4">Mon artisan assigné</h1>

        {loading && <div>Chargement…</div>}
        {error && <div className="text-red-600">{error}</div>}

        {!loading && !artisan && !error && (
          <div className="text-gray-700 space-y-2">
            <p>Aucun artisan assigné pour le moment.</p>
            <p className="text-sm text-gray-500">
              Conseil: Une fois qu’un administrateur vous assigne à un artisan, cette page affichera ses informations.
              En démo ou pour tests, vous pouvez stocker un identifiant avec:
            </p>
            <pre className="bg-gray-100 p-3 rounded text-xs overflow-auto">{`localStorage.setItem('alonu_student_artisan_id', '1')`}</pre>
          </div>
        )}

        {artisan && (
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <img src={artisan.users.avatar || '/assets/images/placeholder-avatar.png'} alt="Avatar" className="h-16 w-16 rounded-full object-cover border" />
              <div>
                <div className="text-xl font-semibold">{artisan.users.prenom} {artisan.users.nom}</div>
                <div className="text-gray-600">{artisan.sousCategories?.libelle}</div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 border rounded-lg">
                <div className="text-sm text-gray-600">Téléphone</div>
                <div className="font-medium">{artisan.telephone || artisan.crms?.telephone || '—'}</div>
              </div>
              <div className="p-4 border rounded-lg">
                <div className="text-sm text-gray-600">Email</div>
                <div className="font-medium">{artisan.crms?.email || artisan.users?.email || '—'}</div>
              </div>
              <div className="p-4 border rounded-lg">
                <div className="text-sm text-gray-600">Adresse</div>
                <div className="font-medium">{artisan.adresse || artisan.crms?.adresse || '—'}</div>
              </div>
              <div className="p-4 border rounded-lg">
                <div className="text-sm text-gray-600">Localisation</div>
                <div className="font-medium">{artisan.latitude && artisan.longitude ? `${artisan.latitude}, ${artisan.longitude}` : '—'}</div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <a href={`/artisan/${artisan.idArtisan}`} className="text-blue-600 hover:underline">Voir le profil public</a>
              <a href="/etudiant/inscriptions" className="text-blue-600 hover:underline">Retour à Mes Inscriptions</a>
            </div>

            {/* Réalisations de l'artisan */}
            <div className="pt-4 border-t">
              <h2 className="text-lg font-semibold mb-3">Réalisations récentes</h2>
              {realisations.length === 0 ? (
                <div className="text-sm text-gray-600">Aucune réalisation trouvée pour cet artisan.</div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {realisations.map((r) => (
                    <div key={r.id} className="border rounded-lg overflow-hidden bg-white">
                      <div className="h-40 bg-gray-200" />
                      <div className="p-3">
                        <div className="font-medium">{r.titre}</div>
                        {r.description && <div className="text-sm text-gray-600 line-clamp-2">{r.description}</div>}
                        {r.createdAt && <div className="text-xs text-gray-500 mt-1">{new Date(r.createdAt).toLocaleDateString()}</div>}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}



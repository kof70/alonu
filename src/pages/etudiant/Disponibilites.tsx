import { useEffect, useState } from 'react'
import DisponibiliteSelector from '@/components/DisponibiliteSelector'
import { useAuth } from '@/contexts/AuthContext'
import { DisponibilitesApi, DisponibilitesPayload } from '@/infrastructure/api/disponibilites.api'

type Plage = { debut: string; fin: string }

export default function Disponibilites() {
  const { user, isAuthenticated } = useAuth()
  const [joursSemaine, setJoursSemaine] = useState<string[]>([])
  const [plages, setPlages] = useState<Plage[]>([])
  const [mois, setMois] = useState<number[]>([])
  const [commentaire, setCommentaire] = useState('')
  const [savedAt, setSavedAt] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!isAuthenticated || !user?.id) return
    ;(async () => {
      setLoading(true)
      setError(null)
      try {
        const res = await DisponibilitesApi.getForUser(user.id as any)
        const d = (res.data as any) || null
        if (d) {
          setJoursSemaine(d.joursSemaine || [])
          setPlages(d.plagesHoraires || [])
          setMois(d.mois || [])
          setCommentaire(d.commentaire || '')
          setSavedAt(new Date().toISOString())
        }
      } catch (e: any) {
        setError(e?.message || 'Impossible de charger vos disponibilités')
      } finally {
        setLoading(false)
      }
    })()
  }, [])

  function onSave() {
    if (!isAuthenticated || !user?.id) return
    const payload: DisponibilitesPayload = {
      joursSemaine,
      plagesHoraires: plages,
      mois: mois.length ? mois : undefined,
      commentaire: commentaire || undefined,
    }
    ;(async () => {
      setLoading(true)
      setError(null)
      try {
        await DisponibilitesApi.updateForUser(user.id as any, payload)
        setSavedAt(new Date().toISOString())
      } catch (e: any) {
        setError(e?.message || 'Échec de l’enregistrement')
      } finally {
        setLoading(false)
      }
    })()
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">Mes disponibilités</h1>
          {savedAt && (
            <div className="text-xs text-gray-500">Dernière sauvegarde: {new Date(savedAt).toLocaleString()}</div>
          )}
        </div>

        {loading && <div role="status">Chargement…</div>}
        {error && <div role="alert" className="text-red-600 mb-4">{error}</div>}

        <div className="space-y-6">
          <DisponibiliteSelector
            joursSemaine={joursSemaine}
            onJoursChange={setJoursSemaine}
            plagesHoraires={plages}
            onPlagesChange={setPlages}
            mois={mois}
            onMoisChange={setMois}
            commentaire={commentaire}
            onCommentaireChange={setCommentaire}
          />

          <div className="flex items-center gap-3">
            <button
              onClick={onSave}
              className="px-4 py-2 rounded-lg text-white font-medium"
              style={{ backgroundColor: '#006E4F' }}
            >
              Enregistrer mes disponibilités
            </button>
            <a href="/mes-inscriptions" className="text-sm text-blue-600 hover:underline">Aller à Mes Inscriptions</a>
          </div>
        </div>
      </div>
    </div>
  )
}



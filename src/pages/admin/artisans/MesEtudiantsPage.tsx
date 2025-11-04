import { useEffect, useState } from 'react'
import { InscriptionsApi } from '@/infrastructure/api/inscriptions.api'
import { useAuth } from '@/contexts/AuthContext'

export default function MesEtudiantsPage() {
  const { user } = useAuth()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [items, setItems] = useState<any[]>([])
  const [page, setPage] = useState(0)
  const [query, setQuery] = useState('')

  useEffect(() => {
    if (!user?.id) return
    load()
  }, [user?.id, page, query])

  async function load() {
    if (!user?.id) return
    setIsLoading(true)
    setError(null)
    try {
      // Endpoint: GET /inscription_projets/by_artisan/{id}
      // Fallback temporaire: filtrer depuis toutes les inscriptions
      const resp = await InscriptionsApi.getNotDeleted()
      const all: any = resp.data ?? []
      const filtered = Array.isArray(all) 
        ? all.filter((i: any) => i.artisanId === user.id || i.artisan?.id === user.id)
        : []
      let result = filtered
      if (query) {
        const q = query.toLowerCase()
        result = result.filter((i: any) => 
          (i.nom || '').toLowerCase().includes(q) ||
          (i.prenom || '').toLowerCase().includes(q) ||
          (i.telephone || '').includes(q)
        )
      }
      setItems(result.slice(page * 10, (page + 1) * 10))
    } catch (e: any) {
      setError(e?.message || 'Erreur de chargement')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Mes étudiants assignés</h1>

      <div className="mb-3 flex items-center gap-2">
        <input
          aria-label="Rechercher des étudiants"
          className="border rounded px-3 py-2 w-full max-w-md"
          placeholder="Rechercher par nom, prénom, téléphone…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>

      {isLoading && <div role="status">Chargement…</div>}
      {error && <div role="alert" className="text-red-600">{error}</div>}
      {!isLoading && !error && items.length === 0 && <div>Aucun étudiant assigné</div>}
      {!isLoading && !error && items.length > 0 && (
        <div className="overflow-auto">
          <table className="min-w-full border text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="p-2 text-left">ID</th>
                <th className="p-2 text-left">Nom</th>
                <th className="p-2 text-left">Prénom</th>
                <th className="p-2 text-left">Téléphone</th>
                <th className="p-2 text-left">Niveau d'étude</th>
                <th className="p-2 text-left">Domaines</th>
                <th className="p-2 text-left">Disponibilités</th>
                <th className="p-2 text-left">Paiement</th>
              </tr>
            </thead>
            <tbody>
              {items.map((i: any) => (
                <tr key={i.id} className="border-t">
                  <td className="p-2">{i.id}</td>
                  <td className="p-2">{i.nom}</td>
                  <td className="p-2">{i.prenom}</td>
                  <td className="p-2">{i.telephone}</td>
                  <td className="p-2">{i.niveauEtude}</td>
                  <td className="p-2">{
                    (() => {
                      const arr = Array.isArray(i.domaines) ? (i.domaines as any[]) : []
                      const txt = arr.length ? arr.map((d: any) => d?.libelle || d).join(', ') : (i.domainesLib || '—')
                      return txt
                    })()
                  }</td>
                  <td className="p-2">{
                    i.disponibilites
                      ? (() => {
                          const d: any = i.disponibilites
                          const parts: string[] = []
                          if (Array.isArray(d?.joursSemaine)) parts.push(d.joursSemaine.join(', '))
                          if (d && typeof d === 'object' && Array.isArray(d.plagesHoraires)) {
                            const ph = (d.plagesHoraires as any[]).filter((p) => p && p.debut && p.fin).map((p: any) => `${p.debut}-${p.fin}`).join('; ')
                            if (ph) parts.push(ph)
                          }
                          if (Array.isArray(d?.mois)) parts.push(`Mois: ${d.mois.join(', ')}`)
                          return parts.length ? parts.join(' | ') : '—'
                        })()
                      : '—'
                  }</td>
                  <td className="p-2">{i.fraisPayes ? '✓ Payé' : '✗ Non payé'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <div className="mt-4 flex items-center gap-2">
        <button aria-label="Page précédente" className="px-3 py-1 rounded bg-gray-100 disabled:opacity-50" disabled={page <= 0} onClick={() => setPage((p) => Math.max(0, p - 1))}>Précédent</button>
        <span>Page {page + 1}</span>
        <button aria-label="Page suivante" className="px-3 py-1 rounded bg-gray-100" onClick={() => setPage((p) => p + 1)}>Suivant</button>
      </div>
    </div>
  )
}




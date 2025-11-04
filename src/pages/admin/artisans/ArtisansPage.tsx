import { useEffect, useMemo, useRef, useState } from 'react'
import { ArtisansAdminApi } from '@/infrastructure/api/artisans.admin.api'

type View = 'pages' | 'not_deleted' | 'deleted' | 'premium'

export default function ArtisansPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [items, setItems] = useState<any[]>([])
  const [page, setPage] = useState(0)
  const [query, setQuery] = useState('')
  const [selected, setSelected] = useState<Record<string, boolean>>({})
  const [bulkLoading, setBulkLoading] = useState(false)
  const [view, setView] = useState<View>('pages')
  const debounceRef = useRef<number | undefined>(undefined)

  const load = useMemo(() => {
    return async () => {
      setIsLoading(true)
      setError(null)
      try {
        let list: any[] = []
        if (view === 'premium') {
          const resp = await ArtisansAdminApi.getLastPremium()
          const data: any = resp.data ?? []
          list = Array.isArray(data) ? data : data?.data ?? data?.content ?? []
        } else if (view === 'not_deleted') {
          const resp = await ArtisansAdminApi.getNotDeleted()
          const data: any = resp.data ?? []
          list = Array.isArray(data) ? data : data?.data ?? data?.content ?? []
        } else if (view === 'deleted') {
          const resp = await ArtisansAdminApi.getDeleted()
          const data: any = resp.data ?? []
          list = Array.isArray(data) ? data : data?.data ?? data?.content ?? []
        } else {
          const resp = query
            ? await ArtisansAdminApi.searchPage(page, query)
            : await ArtisansAdminApi.getPage(page)
          const data: any = resp.data ?? []
          list = Array.isArray(data) ? data : data?.data ?? data?.content ?? []
        }
        setItems(list)
      } catch (e: any) {
        setError(e?.message || 'Erreur inconnue')
      } finally {
        setIsLoading(false)
      }
    }
  }, [page, query, view])

  useEffect(() => {
    window.clearTimeout(debounceRef.current)
    const delay = view === 'pages' ? 300 : 0
    debounceRef.current = window.setTimeout(() => {
      load()
    }, delay)
    return () => window.clearTimeout(debounceRef.current)
  }, [load, view])

  function toggleSelect(id: string | number) {
    setSelected((prev) => ({ ...prev, [String(id)]: !prev[String(id)] }))
  }

  function clearSelection() {
    setSelected({})
  }

  async function onBulk(active: boolean) {
    const ids = Object.keys(selected).filter((k) => selected[k])
    if (ids.length === 0) return
    setBulkLoading(true)
    try {
      const resp = active
        ? await ArtisansAdminApi.activateBatch(ids)
        : await ArtisansAdminApi.deactivateBatch(ids)
      if (resp.status === 201 || resp.status === 200) {
        await load()
        clearSelection()
      } else {
        setError(`Action lot: HTTP ${resp.status}`)
      }
    } catch (e: any) {
      setError(e?.message || 'Erreur action en lot')
    } finally {
      setBulkLoading(false)
    }
  }

  return (
    <div className="p-4">
      <div className="mb-3 flex items-center gap-2">
        <input
          aria-label="Rechercher des artisans"
          className="border rounded px-3 py-2 w-full max-w-md"
          placeholder="Rechercher…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          disabled={view !== 'pages'}
        />
        <button
          className="px-3 py-2 rounded bg-gray-100"
          onClick={() => setPage(0)}
          aria-label="Réinitialiser la pagination"
          disabled={view !== 'pages'}
        >
          Réinitialiser
        </button>
      </div>

      <div className="mb-3 flex items-center gap-2">
        <button className={`px-3 py-1 rounded ${view === 'pages' ? 'bg-black text-white' : 'bg-gray-100'}`} onClick={() => setView('pages')} aria-label="Voir pagination">Pagination</button>
        <button className={`px-3 py-1 rounded ${view === 'not_deleted' ? 'bg-black text-white' : 'bg-gray-100'}`} onClick={() => setView('not_deleted')} aria-label="Voir non supprimés">Non supprimés</button>
        <button className={`px-3 py-1 rounded ${view === 'deleted' ? 'bg-black text-white' : 'bg-gray-100'}`} onClick={() => setView('deleted')} aria-label="Voir supprimés">Supprimés</button>
        <button className={`px-3 py-1 rounded ${view === 'premium' ? 'bg-black text-white' : 'bg-gray-100'}`} onClick={() => setView('premium')} aria-label="Voir premium">Premium</button>
      </div>

      <div className="mb-3 flex items-center gap-2">
        <button
          className="px-3 py-1 rounded bg-green-600 text-white disabled:opacity-50"
          disabled={bulkLoading || Object.keys(selected).filter((k) => selected[k]).length === 0}
          onClick={() => onBulk(true)}
          aria-busy={bulkLoading}
        >
          Activer (lot)
        </button>
        <button
          className="px-3 py-1 rounded bg-red-600 text-white disabled:opacity-50"
          disabled={bulkLoading || Object.keys(selected).filter((k) => selected[k]).length === 0}
          onClick={() => onBulk(false)}
          aria-busy={bulkLoading}
        >
          Désactiver (lot)
        </button>
      </div>

      {isLoading && <div role="status">Chargement…</div>}
      {error && <div role="alert" className="text-red-600">{error}</div>}
      {!isLoading && !error && items.length === 0 && <div>Aucun résultat</div>}
      {!isLoading && !error && items.length > 0 && (
        <div className="overflow-auto">
          <table className="min-w-full border text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="p-2 text-left"><span className="sr-only">Sélection</span></th>
                <th className="p-2 text-left">ID</th>
                <th className="p-2 text-left">Utilisateur</th>
                <th className="p-2 text-left">Catégories</th>
                <th className="p-2 text-left">Téléphone</th>
                <th className="p-2 text-left">Actif</th>
              </tr>
            </thead>
            <tbody>
              {items.map((a: any) => (
                <tr key={a.id} className="border-t">
                  <td className="p-2">
                    <input
                      type="checkbox"
                      aria-label={`Sélection artisan ${a.id}`}
                      checked={!!selected[String(a.id)]}
                      onChange={() => toggleSelect(a.id)}
                    />
                  </td>
                  <td className="p-2">{a.id}</td>
                  <td className="p-2">{a.user?.username || a.username} / {a.user?.email || a.email}</td>
                  <td className="p-2">{a?.sousCategories?.map((sc: any) => sc?.categories?.libelle || sc?.libelle)?.filter(Boolean)?.join(', ')}</td>
                  <td className="p-2">{a.telephone}</td>
                  <td className="p-2">{a.active ? 'Oui' : 'Non'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <div className="mt-4 flex items-center gap-2">
        <button aria-label="Page précédente" className="px-3 py-1 rounded bg-gray-100 disabled:opacity-50" disabled={view !== 'pages' || page <= 0} onClick={() => setPage((p) => Math.max(0, p - 1))}>Précédent</button>
        <span>Page {page + 1}</span>
        <button aria-label="Page suivante" className="px-3 py-1 rounded bg-gray-100" disabled={view !== 'pages'} onClick={() => setPage((p) => p + 1)}>Suivant</button>
      </div>
    </div>
  )
}



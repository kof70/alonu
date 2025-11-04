import { useEffect, useState } from 'react'

type ApiError = {
  message?: string
  apierror?: { subErrors?: Array<{ field?: string; message?: string }> }
}

export default function UsersPage() {
  const [tab, setTab] = useState<'admins' | 'agents' | 'all' | 'deleted'>('admins')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [items, setItems] = useState<any[]>([])

  useEffect(() => {
    let ignore = false
    async function load() {
      setIsLoading(true)
      setError(null)
      try {
        let url = '/users_admin'
        if (tab === 'agents') url = '/users_agent'
        if (tab === 'all') url = '/users_not_deleted'
        if (tab === 'deleted') url = '/users_deleted'

        const res = await fetch(url, { credentials: 'include' })
        if (!res.ok) {
          const data: ApiError | undefined = await res.json().catch(() => undefined)
          const details = data?.apierror?.subErrors?.map((e) => e.message).join(', ')
          throw new Error(data?.message || details || `HTTP ${res.status}`)
        }
        const data = await res.json()
        if (!ignore) setItems(Array.isArray(data) ? data : data?.content || [])
      } catch (e: any) {
        if (!ignore) setError(e?.message || 'Erreur inconnue')
      } finally {
        if (!ignore) setIsLoading(false)
      }
    }
    load()
    return () => {
      ignore = true
    }
  }, [tab])

  return (
    <div className="p-4">
      <div className="mb-4 flex gap-2">
        <button aria-label="Voir administrateurs" className={`px-3 py-1 rounded ${tab === 'admins' ? 'bg-black text-white' : 'bg-gray-100'}`} onClick={() => setTab('admins')}>Admins</button>
        <button aria-label="Voir agents" className={`px-3 py-1 rounded ${tab === 'agents' ? 'bg-black text-white' : 'bg-gray-100'}`} onClick={() => setTab('agents')}>Agents</button>
        <button aria-label="Voir utilisateurs" className={`px-3 py-1 rounded ${tab === 'all' ? 'bg-black text-white' : 'bg-gray-100'}`} onClick={() => setTab('all')}>Tous</button>
        <button aria-label="Voir supprimés" className={`px-3 py-1 rounded ${tab === 'deleted' ? 'bg-black text-white' : 'bg-gray-100'}`} onClick={() => setTab('deleted')}>Supprimés</button>
      </div>

      {isLoading && <div role="status">Chargement…</div>}
      {error && <div role="alert" className="text-red-600">{error}</div>}
      {!isLoading && !error && items.length === 0 && <div>Aucun résultat</div>}

      {!isLoading && !error && items.length > 0 && (
        <div className="overflow-auto">
          <table className="min-w-full border text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="p-2 text-left">ID</th>
                <th className="p-2 text-left">Username</th>
                <th className="p-2 text-left">Email</th>
                <th className="p-2 text-left">Rôle</th>
              </tr>
            </thead>
            <tbody>
              {items.map((u: any) => (
                <tr key={u.id} className="border-t">
                  <td className="p-2">{u.id}</td>
                  <td className="p-2">{u.username || u.user?.username}</td>
                  <td className="p-2">{u.email || u.user?.email}</td>
                  <td className="p-2">{u.role || u.roles?.join(', ')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}



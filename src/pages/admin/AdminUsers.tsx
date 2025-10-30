import { useEffect, useState } from 'react'
import { apiClient } from '@/infrastructure/api/api.client'

type User = {
  id?: number
  username?: string
  email?: string
  nom?: string
  prenom?: string
  role?: number | string
  actif?: boolean
}

export default function AdminUsers() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let isMounted = true
    setLoading(true)
    setError(null)
    apiClient
      .get<User[]>('/users_admin')
      .then((res) => {
        if (!isMounted) return
        const data = (res.data as any) ?? []
        setUsers(Array.isArray(data) ? data : data?.data ?? [])
      })
      .catch((e: any) => {
        if (!isMounted) return
        setError(e?.message || 'Erreur de chargement')
      })
      .finally(() => {
        if (!isMounted) return
        setLoading(false)
      })
    return () => {
      isMounted = false
    }
  }, [])

  return (
    <section>
      <div className="mb-4">
        <h2 className="text-xl font-semibold">Utilisateurs (admins)</h2>
        <p className="text-sm text-gray-500">Liste fournie par l’API /users_admin</p>
      </div>

      {loading && <div className="text-sm">Chargement…</div>}
      {error && (
        <div className="mb-4 rounded border border-red-200 bg-red-50 p-3 text-red-700 text-sm">
          {error}
        </div>
      )}

      {!loading && !error && (
        <div className="overflow-x-auto rounded border border-gray-200 bg-white">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-2 text-left font-medium text-gray-700">ID</th>
                <th className="px-4 py-2 text-left font-medium text-gray-700">Username</th>
                <th className="px-4 py-2 text-left font-medium text-gray-700">Email</th>
                <th className="px-4 py-2 text-left font-medium text-gray-700">Nom</th>
                <th className="px-4 py-2 text-left font-medium text-gray-700">Prénom</th>
                <th className="px-4 py-2 text-left font-medium text-gray-700">Rôle</th>
                <th className="px-4 py-2 text-left font-medium text-gray-700">Actif</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u, i) => (
                <tr key={String(u.id ?? i)} className={i % 2 ? 'bg-white' : 'bg-gray-50'}>
                  <td className="px-4 py-2">{u.id ?? '-'}</td>
                  <td className="px-4 py-2">{u.username ?? '-'}</td>
                  <td className="px-4 py-2">{u.email ?? '-'}</td>
                  <td className="px-4 py-2">{u.nom ?? '-'}</td>
                  <td className="px-4 py-2">{u.prenom ?? '-'}</td>
                  <td className="px-4 py-2">{String(u.role ?? '-')}</td>
                  <td className="px-4 py-2">{u.actif === undefined ? '-' : u.actif ? 'Oui' : 'Non'}</td>
                </tr>
              ))}
              {users.length === 0 && (
                <tr>
                  <td className="px-4 py-6 text-center text-gray-500" colSpan={7}>
                    Aucun utilisateur trouvé
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </section>
  )
}



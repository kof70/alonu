import { useEffect, useMemo, useRef, useState } from 'react'
import { UsersApi } from '@/infrastructure/api/users.api'

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
  const [tab, setTab] = useState<'admins' | 'agents' | 'all' | 'deleted'>('admins')
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Profil courant form state
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [nom, setNom] = useState('')
  const [prenom, setPrenom] = useState('')
  const [saving, setSaving] = useState(false)
  const [saveMsg, setSaveMsg] = useState<string | null>(null)
  const [emailOk, setEmailOk] = useState<boolean | null>(null)
  const [usernameOk, setUsernameOk] = useState<boolean | null>(null)
  const debounceRef = useRef<number | undefined>(undefined)

  const loadUsers = useMemo(() => {
    return async () => {
    setLoading(true)
    setError(null)
      try {
        let resp
        if (tab === 'admins') resp = await UsersApi.getAdmins()
        else if (tab === 'agents') resp = await UsersApi.getAgents()
        else if (tab === 'all') resp = await UsersApi.getNotDeleted()
        else resp = await UsersApi.getDeleted()
        const data: any = resp.data ?? []
        setUsers(Array.isArray(data) ? data : data?.data ?? data?.content ?? [])
      } catch (e: any) {
        setError(e?.message || 'Erreur de chargement')
      } finally {
        setLoading(false)
      }
    }
  }, [tab])

  useEffect(() => {
    ;(async () => {
      await loadUsers()
    })()
  }, [loadUsers])

  // Debounce checks for email/username availability
  useEffect(() => {
    window.clearTimeout(debounceRef.current)
    debounceRef.current = window.setTimeout(async () => {
      try {
        if (email) {
          const r = await UsersApi.checkEmail(email)
          setEmailOk(Boolean(r.data))
        } else {
          setEmailOk(null)
        }
        if (username) {
          const r2 = await UsersApi.checkUsername(username)
          setUsernameOk(Boolean(r2.data))
        } else {
          setUsernameOk(null)
        }
      } catch {
        // en cas d'erreur réseau, ne pas bloquer la saisie
      }
    }, 400)
    return () => window.clearTimeout(debounceRef.current)
  }, [email, username])

  async function onSaveProfile(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    setSaveMsg(null)
    try {
      const res = await UsersApi.updateCurrent({ username, email, nom, prenom })
      if (res.status === 201 || res.status === 200) {
        setSaveMsg('Profil mis à jour')
      } else {
        setSaveMsg(`Mise à jour: HTTP ${res.status}`)
      }
    } catch (err: any) {
      setSaveMsg(err?.message || 'Erreur lors de la mise à jour')
    } finally {
      setSaving(false)
    }
  }

  return (
    <section className="p-2">
      <div className="mb-4">
        <h2 className="text-xl font-semibold">Utilisateurs</h2>
        <p className="text-sm text-gray-500">Listes des utilisateurs</p>
      </div>

      <div className="mb-4 flex gap-2">
        <button aria-label="Onglet administrateurs" className={`px-3 py-1 rounded ${tab === 'admins' ? 'bg-black text-white' : 'bg-gray-100'}`} onClick={() => setTab('admins')}>Admins</button>
        <button aria-label="Onglet agents" className={`px-3 py-1 rounded ${tab === 'agents' ? 'bg-black text-white' : 'bg-gray-100'}`} onClick={() => setTab('agents')}>Agents</button>
        <button aria-label="Onglet tous" className={`px-3 py-1 rounded ${tab === 'all' ? 'bg-black text-white' : 'bg-gray-100'}`} onClick={() => setTab('all')}>Tous</button>
        <button aria-label="Onglet supprimés" className={`px-3 py-1 rounded ${tab === 'deleted' ? 'bg-black text-white' : 'bg-gray-100'}`} onClick={() => setTab('deleted')}>Supprimés</button>
      </div>

      {loading && <div className="text-sm" role="status">Chargement…</div>}
      {error && (
        <div className="mb-4 rounded border border-red-200 bg-red-50 p-3 text-red-700 text-sm" role="alert">
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

      {/* Section Profil courant retirée sur demande */}
    </section>
  )
}



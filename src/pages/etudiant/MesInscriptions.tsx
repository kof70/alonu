import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { InscriptionsApi } from '@/infrastructure/api/inscriptions.api'
import { useAuth } from '@/contexts/AuthContext'
import { categoryApiService } from '@/infrastructure/api/category.api'

const DAYS = [
  { key: 'LUN', label: 'Lundi' },
  { key: 'MAR', label: 'Mardi' },
  { key: 'MER', label: 'Mercredi' },
  { key: 'JEU', label: 'Jeudi' },
  { key: 'VEN', label: 'Vendredi' },
  { key: 'SAM', label: 'Samedi' },
  { key: 'DIM', label: 'Dimanche' },
]

export default function MesInscriptions() {
  const navigate = useNavigate()
  const { user, isAuthenticated } = useAuth()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [items, setItems] = useState<any[]>([])
  const [creating, setCreating] = useState(false)
  const [createMsg, setCreateMsg] = useState<string | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ telephone: '', nom: '', prenom: '', apport: '', niveauEtude: '' })
  const [domainesIds, setDomainesIds] = useState<number[]>([])
  const [joursSemaine, setJoursSemaine] = useState<string[]>([])
  const [plages, setPlages] = useState<Array<{ debut: string; fin: string }>>([{ debut: '', fin: '' }])
  const [mois, setMois] = useState<number[]>([])
  const [commentaire, setCommentaire] = useState<string>('')
  const [subcats, setSubcats] = useState<Array<{ id: number; label: string }>>([])

  useEffect(() => {
    if (!isAuthenticated || !user) {
      navigate('/login', { replace: true })
      return
    }
    load()
  }, [isAuthenticated, user])

  useEffect(() => {
    ;(async () => {
      try {
        const sc = await categoryApiService.getAllSubcategories()
        const normalized = (Array.isArray(sc) ? sc : (sc as any)?.data || []).map((s: any) => ({ id: s.idSousCategorie || s.id || s.id_sous_categorie, label: s.libelle }))
        setSubcats(normalized.filter((x: any) => x.id && x.label))
      } catch {
        setSubcats([])
      }
    })()
  }, [])

  async function load() {
    if (!user?.id) return
    setIsLoading(true)
    setError(null)
    try {
      // Option 1: Endpoint dédié (si existe)
      // const resp = await apiClient.get(`/inscription_projets/by_user/${user.id}`)
      // Option 2: Filtrer côté client depuis toutes les inscriptions (temporaire)
      const resp = await InscriptionsApi.getNotDeleted()
      const all: any = resp.data ?? []
      const filtered = Array.isArray(all) ? all.filter((i: any) => i.userId === user.id || i.user?.id === user.id) : []
      setItems(filtered)
    } catch (e: any) {
      setError(e?.message || 'Erreur de chargement')
    } finally {
      setIsLoading(false)
    }
  }

  function toggleJour(key: string) {
    setJoursSemaine((prev) => prev.includes(key) ? prev.filter(k => k !== key) : [...prev, key])
  }

  function updatePlage(idx: number, field: 'debut'|'fin', value: string) {
    setPlages((prev) => prev.map((p, i) => i === idx ? { ...p, [field]: value } : p))
  }

  function addPlage() {
    setPlages((prev) => [...prev, { debut: '', fin: '' }])
  }

  function removePlage(idx: number) {
    setPlages((prev) => prev.filter((_, i) => i !== idx))
  }

  function toggleMois(m: number) {
    setMois((prev) => prev.includes(m) ? prev.filter(x => x !== m) : [...prev, m])
  }

  async function onCreate(e: React.FormEvent) {
    e.preventDefault()
    if (!user?.id) return
    setCreating(true)
    setCreateMsg(null)
    try {
      const payload = {
        userId: user.id,
        telephone: form.telephone,
        nom: form.nom,
        prenom: form.prenom,
        apport: form.apport,
        niveauEtude: form.niveauEtude,
        domainesIds,
        disponibilites: {
          joursSemaine,
          plagesHoraires: plages.filter(p => p.debut && p.fin),
          mois: mois.length ? mois : undefined,
          commentaire: commentaire || undefined,
        },
      }
      const res = await InscriptionsApi.create(payload)
      if (res.status === 201 || res.status === 200) {
        setCreateMsg('Inscription créée avec succès')
        setForm({ telephone: '', nom: '', prenom: '', apport: '', niveauEtude: '' })
        setDomainesIds([])
        setJoursSemaine([])
        setPlages([{ debut: '', fin: '' }])
        setMois([])
        setCommentaire('')
        setShowForm(false)
        await load()
      } else {
        setCreateMsg(`Erreur: HTTP ${res.status}`)
      }
    } catch (err: any) {
      setCreateMsg(err?.message || 'Erreur à la création')
    } finally {
      setCreating(false)
    }
  }

  if (!isAuthenticated || !user) {
    return null
  }

  return (
    <div className="p-4 max-w-7xl mx-auto">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Mes inscriptions</h1>
        <button
          className="px-4 py-2 rounded bg-black text-white"
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? 'Annuler' : '+ Nouvelle inscription'}
        </button>
      </div>

      {showForm && (
        <div className="mb-8 p-6 border rounded-lg bg-white">
          <h2 className="text-lg font-semibold mb-4">Créer une inscription</h2>
          <form onSubmit={onCreate} className="grid gap-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="grid gap-1">
                <label htmlFor="nom" className="text-sm">Nom</label>
                <input id="nom" className="border rounded px-3 py-2" value={form.nom} onChange={(e) => setForm({ ...form, nom: e.target.value })} required />
              </div>
              <div className="grid gap-1">
                <label htmlFor="prenom" className="text-sm">Prénom</label>
                <input id="prenom" className="border rounded px-3 py-2" value={form.prenom} onChange={(e) => setForm({ ...form, prenom: e.target.value })} required />
              </div>
              <div className="grid gap-1">
                <label htmlFor="tel" className="text-sm">Téléphone</label>
                <input id="tel" className="border rounded px-3 py-2" value={form.telephone} onChange={(e) => setForm({ ...form, telephone: e.target.value })} required />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="grid gap-1">
                <label htmlFor="niveau" className="text-sm">Niveau d'étude</label>
                <input id="niveau" className="border rounded px-3 py-2" value={form.niveauEtude} onChange={(e) => setForm({ ...form, niveauEtude: e.target.value })} required />
              </div>
              <div className="grid gap-1">
                <label htmlFor="apport" className="text-sm">Apport</label>
                <input id="apport" className="border rounded px-3 py-2" value={form.apport} onChange={(e) => setForm({ ...form, apport: e.target.value })} />
              </div>
            </div>

            <div className="grid gap-1">
              <label className="text-sm font-medium">Domaines de formation</label>
              <div className="flex flex-wrap gap-2">
                {subcats.map((s) => (
                  <label key={s.id} className="inline-flex items-center gap-2 border rounded px-2 py-1">
                    <input type="checkbox" checked={domainesIds.includes(s.id)} onChange={() => setDomainesIds((prev) => prev.includes(s.id) ? prev.filter(x => x !== s.id) : [...prev, s.id])} />
                    <span>{s.label}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="grid gap-2">
              <label className="text-sm font-medium">Disponibilités</label>
              <div className="flex flex-wrap gap-2">
                {DAYS.map((d) => (
                  <label key={d.key} className="inline-flex items-center gap-2 border rounded px-2 py-1">
                    <input type="checkbox" checked={joursSemaine.includes(d.key)} onChange={() => toggleJour(d.key)} />
                    <span>{d.label}</span>
                  </label>
                ))}
              </div>
              <div className="grid gap-2">
                <span className="text-sm">Plages horaires</span>
                {plages.map((p, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <input type="time" className="border rounded px-2 py-1" value={p.debut} onChange={(e) => updatePlage(idx, 'debut', e.target.value)} />
                    <span>—</span>
                    <input type="time" className="border rounded px-2 py-1" value={p.fin} onChange={(e) => updatePlage(idx, 'fin', e.target.value)} />
                    <button type="button" className="px-2 py-1 border rounded" onClick={() => removePlage(idx)}>Supprimer</button>
                  </div>
                ))}
                <button type="button" className="px-3 py-1 border rounded w-fit" onClick={addPlage}>Ajouter une plage</button>
              </div>
              <div className="grid gap-1">
                <span className="text-sm">Mois (optionnels)</span>
                <div className="flex flex-wrap gap-2">
                  {Array.from({ length: 12 }).map((_, i) => (
                    <label key={i+1} className="inline-flex items-center gap-2 border rounded px-2 py-1">
                      <input type="checkbox" checked={mois.includes(i+1)} onChange={() => toggleMois(i+1)} />
                      <span>{i+1}</span>
                    </label>
                  ))}
                </div>
              </div>
              <div className="grid gap-1">
                <label className="text-sm" htmlFor="commentaire">Précisions</label>
                <textarea id="commentaire" className="border rounded px-3 py-2" value={commentaire} onChange={(e) => setCommentaire(e.target.value)} />
              </div>
            </div>

            <div className="flex items-center gap-2 mt-2">
              <button type="submit" className="px-4 py-2 rounded bg-black text-white disabled:opacity-50" disabled={creating} aria-busy={creating}>
                {creating ? 'Création…' : 'Créer'}
              </button>
              {createMsg && <span role="status" className="text-sm">{createMsg}</span>}
            </div>
          </form>
        </div>
      )}

      {isLoading && <div role="status">Chargement…</div>}
      {error && <div role="alert" className="text-red-600">{error}</div>}
      {!isLoading && !error && items.length === 0 && <div>Aucune inscription</div>}
      {!isLoading && !error && items.length > 0 && (
        <div className="overflow-auto">
          <table className="min-w-full border text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="p-2 text-left">ID</th>
                <th className="p-2 text-left">Nom</th>
                <th className="p-2 text-left">Prénom</th>
                <th className="p-2 text-left">Téléphone</th>
                <th className="p-2 text-left">Domaines</th>
                <th className="p-2 text-left">Disponibilités</th>
                <th className="p-2 text-left">Statut</th>
              </tr>
            </thead>
            <tbody>
              {items.map((i: any) => (
                <tr key={i.id} className="border-t">
                  <td className="p-2">{i.id}</td>
                  <td className="p-2">{i.nom}</td>
                  <td className="p-2">{i.prenom}</td>
                  <td className="p-2">{i.telephone}</td>
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
                  <td className="p-2">{i.fraisPayes ? 'Payé' : 'Non payé'} {i.artisanId ? `| Assigné` : ''}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}


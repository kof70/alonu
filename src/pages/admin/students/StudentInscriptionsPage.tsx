import { useEffect, useMemo, useRef, useState } from 'react'
import { InscriptionsApi } from '@/infrastructure/api/inscriptions.api'
import { ArtisansAdminApi } from '@/infrastructure/api/artisans.admin.api'
import { useCategoriesContext } from '@/contexts/CategoryContext'
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

export default function StudentInscriptionsPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [items, setItems] = useState<any[]>([])
  const [page, setPage] = useState(0)
  const [query, setQuery] = useState('')
  const [count, setCount] = useState<number | null>(null)
  const [catId, setCatId] = useState<string>('')
  const [creating, setCreating] = useState(false)
  const [createMsg, setCreateMsg] = useState<string | null>(null)
  const [form, setForm] = useState({ sousCategories: '', telephone: '', nom: '', prenom: '', apport: '', niveauEtude: '' })
  const [domainesIds, setDomainesIds] = useState<number[]>([])
  const [joursSemaine, setJoursSemaine] = useState<string[]>([])
  const [plages, setPlages] = useState<Array<{ debut: string; fin: string }>>([{ debut: '', fin: '' }])
  const [mois, setMois] = useState<number[]>([])
  const [commentaire, setCommentaire] = useState<string>('')
  const [fraisPayes, setFraisPayes] = useState<boolean>(false)
  const [fraisReference, setFraisReference] = useState<string>('')
  const [subcats, setSubcats] = useState<Array<{ id: number; label: string }>>([])
  const [artisans, setArtisans] = useState<Array<{ id: number; label: string }>>([])
  const [assigningId, setAssigningId] = useState<number | null>(null)
  const [selectedArtisanId, setSelectedArtisanId] = useState<string>('')
  const [assigning, setAssigning] = useState(false)
  const debounceRef = useRef<number | undefined>(undefined)
  const { categories } = useCategoriesContext()

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

  useEffect(() => {
    ;(async () => {
      try {
        const resp = await ArtisansAdminApi.getNotDeleted()
        const data: any = resp.data ?? []
        const arr = Array.isArray(data) ? data : data?.data ?? data?.content ?? []
        const normalized = arr.map((a: any) => ({
          id: a.id || a.idArtisan,
          label: `${a.user?.username || a.username || ''} - ${a.user?.email || a.email || ''}`.trim() || `Artisan ${a.id || a.idArtisan}`
        })).filter((x: any) => x.id)
        setArtisans(normalized)
      } catch {
        setArtisans([])
      }
    })()
  }, [])

  const load = useMemo(() => {
    return async () => {
      setIsLoading(true)
      setError(null)
      try {
        if (catId) {
          const byCat = await InscriptionsApi.getByCategory(catId)
          const data: any = byCat.data ?? []
          setItems(Array.isArray(data) ? data : data?.data ?? data?.content ?? [])
        } else if (query) {
          const resp = await InscriptionsApi.searchPage(page, query)
          const data: any = resp.data ?? []
          setItems(Array.isArray(data) ? data : data?.data ?? data?.content ?? [])
        } else {
          const resp = await InscriptionsApi.getPage(page)
          const data: any = resp.data ?? []
          setItems(Array.isArray(data) ? data : data?.data ?? data?.content ?? [])
        }
      } catch (e: any) {
        setError(e?.message || 'Erreur inconnue')
      } finally {
        setIsLoading(false)
      }
    }
  }, [page, query, catId])

  useEffect(() => {
    InscriptionsApi.getCount()
      .then((r) => setCount(Number(r.data)))
      .catch(() => setCount(null))
  }, [])

  useEffect(() => {
    window.clearTimeout(debounceRef.current)
    debounceRef.current = window.setTimeout(() => {
      load()
    }, 300)
    return () => window.clearTimeout(debounceRef.current)
  }, [load])

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

  async function onAssign(inscriptionId: number, artisanId: string) {
    if (!artisanId) return
    setAssigning(true)
    setError(null)
    try {
      const res = await InscriptionsApi.assigner(inscriptionId, artisanId)
      if (res.status === 200 || res.status === 201) {
        await load()
        setAssigningId(null)
        setSelectedArtisanId('')
      } else {
        setError(`Assignation: HTTP ${res.status}`)
      }
    } catch (err: any) {
      setError(err?.message || 'Erreur à l\'assignation')
    } finally {
      setAssigning(false)
    }
  }

  async function onCreate(e: React.FormEvent) {
    e.preventDefault()
    setCreating(true)
    setCreateMsg(null)
    try {
      const payload = {
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
        fraisPayes,
        referencePaiement: fraisPayes && fraisReference ? fraisReference : undefined,
      }
      const res = await InscriptionsApi.create(payload)
      if (res.status === 201 || res.status === 200) {
        setCreateMsg('Création réussie')
        setForm({ sousCategories: '', telephone: '', nom: '', prenom: '', apport: '', niveauEtude: '' })
        setDomainesIds([])
        setJoursSemaine([])
        setPlages([{ debut: '', fin: '' }])
        setMois([])
        setCommentaire('')
        setFraisPayes(false)
        setFraisReference('')
        await load()
        const c = await InscriptionsApi.getCount()
        setCount(Number(c.data))
      } else {
        setCreateMsg(`Création: HTTP ${res.status}`)
      }
    } catch (err: any) {
      setCreateMsg(err?.message || 'Erreur à la création')
    } finally {
      setCreating(false)
    }
  }

  return (
    <div className="p-4">
      <div className="mb-3 flex items-center gap-2">
        <input
          aria-label="Rechercher des inscriptions"
          className="border rounded px-3 py-2 w-full max-w-md"
          placeholder="Rechercher…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <select
          aria-label="Filtrer par catégorie"
          className="border rounded px-3 py-2"
          value={catId}
          onChange={(e) => { setCatId(e.target.value); setPage(0) }}
        >
          <option value="">Toutes catégories</option>
          {categories?.map((c: any) => (
            <option key={c.id} value={c.id}>{c.libelle || c.name || c.title}</option>
          ))}
        </select>
      </div>

      <div className="mb-3 text-sm text-gray-600">Total: {count ?? '—'}</div>

      {isLoading && <div role="status">Chargement…</div>}
      {error && <div role="alert" className="text-red-600">{error}</div>}
      {!isLoading && !error && items.length === 0 && <div>Aucun résultat</div>}
      {!isLoading && !error && items.length > 0 && (
        <div className="overflow-auto">
          <table className="min-w-full border text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="p-2 text-left">ID</th>
                <th className="p-2 text-left">Nom</th>
                <th className="p-2 text-left">Prénom</th>
                <th className="p-2 text-left">Téléphone</th>
                <th className="p-2 text-left">Niveau d’étude</th>
                <th className="p-2 text-left">Apport</th>
                <th className="p-2 text-left">Domaines</th>
                <th className="p-2 text-left">Disponibilités</th>
                <th className="p-2 text-left">Paiement</th>
                <th className="p-2 text-left">Actions</th>
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
                  <td className="p-2">{i.apport}</td>
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
                  <td className="p-2">{i.fraisPayes ? 'Payé' : 'Non payé'}</td>
                  <td className="p-2">
                    {i.fraisPayes && !i.artisanId ? (
                      <button
                        className="px-2 py-1 rounded bg-blue-600 text-white text-sm"
                        onClick={() => { setAssigningId(i.id); setSelectedArtisanId('') }}
                      >
                        Assigner
                      </button>
                    ) : i.artisanId ? (
                      <span className="text-sm text-green-600">Assigné</span>
                    ) : (
                      <span className="text-sm text-gray-400">Paiement requis</span>
                    )}
                  </td>
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

      <div className="mt-8">
        <h3 className="text-lg font-semibold mb-2">Créer une inscription</h3>
        <form onSubmit={onCreate} className="grid gap-4 max-w-4xl">
          {/* Infos de base */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="grid gap-1">
              <label htmlFor="nom" className="text-sm">Nom</label>
              <input id="nom" className="border rounded px-3 py-2" value={form.nom} onChange={(e) => setForm({ ...form, nom: e.target.value })} />
            </div>
            <div className="grid gap-1">
              <label htmlFor="prenom" className="text-sm">Prénom</label>
              <input id="prenom" className="border rounded px-3 py-2" value={form.prenom} onChange={(e) => setForm({ ...form, prenom: e.target.value })} />
            </div>
            <div className="grid gap-1">
              <label htmlFor="tel" className="text-sm">Téléphone</label>
              <input id="tel" className="border rounded px-3 py-2" value={form.telephone} onChange={(e) => setForm({ ...form, telephone: e.target.value })} />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="grid gap-1">
              <label htmlFor="niveau" className="text-sm">Niveau d’étude</label>
              <input id="niveau" className="border rounded px-3 py-2" value={form.niveauEtude} onChange={(e) => setForm({ ...form, niveauEtude: e.target.value })} />
            </div>
            <div className="grid gap-1">
              <label htmlFor="apport" className="text-sm">Apport</label>
              <input id="apport" className="border rounded px-3 py-2" value={form.apport} onChange={(e) => setForm({ ...form, apport: e.target.value })} />
            </div>
          </div>

          {/* Domaines (multiselect) */}
          <div className="grid gap-1">
            <label className="text-sm">Domaines de formation</label>
            <div className="flex flex-wrap gap-2">
              {subcats.map((s) => (
                <label key={s.id} className="inline-flex items-center gap-2 border rounded px-2 py-1">
                  <input type="checkbox" checked={domainesIds.includes(s.id)} onChange={() => setDomainesIds((prev) => prev.includes(s.id) ? prev.filter(x => x !== s.id) : [...prev, s.id])} />
                  <span>{s.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Disponibilités */}
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

          {/* Paiement */}
          <div className="grid gap-2">
            <label className="text-sm font-medium">Paiement d’inscription</label>
            <label className="inline-flex items-center gap-2">
              <input type="checkbox" checked={fraisPayes} onChange={(e) => setFraisPayes(e.target.checked)} />
              <span>Frais payés</span>
            </label>
            {fraisPayes && (
              <div className="grid gap-1">
                <label className="text-sm" htmlFor="ref">Référence (optionnel)</label>
                <input id="ref" className="border rounded px-3 py-2" value={fraisReference} onChange={(e) => setFraisReference(e.target.value)} />
              </div>
            )}
          </div>

          <div className="flex items-center gap-2 mt-2">
            <button type="submit" className="px-4 py-2 rounded bg-black text-white disabled:opacity-50" disabled={creating} aria-busy={creating}>
              {creating ? 'Création…' : 'Créer'}
            </button>
            {createMsg && <span role="status" className="text-sm">{createMsg}</span>}
          </div>
        </form>
      </div>

      {/* Modal d'assignation */}
      {assigningId !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black bg-opacity-50" onClick={() => { setAssigningId(null); setSelectedArtisanId('') }} />
          <div className="relative bg-white rounded-lg shadow-lg w-full max-w-md mx-4 p-4">
            <h4 className="text-lg font-semibold mb-3">Assigner un artisan</h4>
            <div className="grid gap-2 mb-4">
              <label className="text-sm">Sélectionner un artisan</label>
              <select
                className="border rounded px-3 py-2"
                value={selectedArtisanId}
                onChange={(e) => setSelectedArtisanId(e.target.value)}
              >
                <option value="">— Choisir —</option>
                {artisans.map((a) => (
                  <option key={a.id} value={a.id}>{a.label}</option>
                ))}
              </select>
            </div>
            <div className="flex items-center justify-end gap-2">
              <button className="px-3 py-2 border rounded" onClick={() => { setAssigningId(null); setSelectedArtisanId('') }}>Annuler</button>
              <button
                className="px-3 py-2 rounded text-white disabled:opacity-50"
                style={{ backgroundColor: '#006E4F' }}
                disabled={assigning || !selectedArtisanId}
                onClick={() => onAssign(assigningId as number, selectedArtisanId)}
              >
                {assigning ? 'Assignation…' : 'Confirmer'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}



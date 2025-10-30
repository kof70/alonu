import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useAuth } from '@/contexts/AuthContext'
import { useToast } from '@/hooks/use-toast'
import { Eye, EyeOff, Loader2, UserPlus, ArrowLeft, MapPin } from 'lucide-react'
import { apiClient } from '@/infrastructure/api/api.client'
import { ENV_CONFIG } from '@/infrastructure/config/env.config'
import { useCategories } from '@/hooks/use-categories'

const schema = z.object({
  username: z.string()
    .min(3, "Nom d'utilisateur requis (>=3)")
    .regex(/^[a-zA-Z0-9._-]{3,20}$/, "Nom d'utilisateur invalide (lettres, chiffres, . _ -)"),
  password: z.string().min(6, 'Mot de passe requis (>=6)'),
  email: z.string().email('Email invalide'),
  nom: z.string().min(2, 'Nom requis'),
  prenom: z.string().min(2, 'Prénom requis'),
  telephone: z.string().regex(/^\d{8}$/, 'Téléphone: exactement 8 chiffres'),
  adresse: z.string().min(3, 'Adresse requise'),
  numeroEnr: z.string().min(1, "Numéro d'enregistrement requis"),
  sousCategories: z.number().min(1, 'Sélectionner une sous-catégorie'),
  longitude: z.number().optional(),
  latitude: z.number().optional(),
  facebook: z.string().optional(),
  whatsapp: z.string().optional(),
  tweeter: z.string().optional(),
})

type FormData = z.infer<typeof schema>

export default function RegisterArtisan() {
  const navigate = useNavigate()
  const { toast } = useToast()
  const { register: doRegister, isLoading, checkUsername, checkEmail, checkTelephone, checkNumeroEnr } = useAuth()
  const [showPwd, setShowPwd] = useState(false)
  const [profilePreview, setProfilePreview] = useState<string | null>(null)
  const [subcategories, setSubcategories] = useState<Array<{ id: number; name: string }>>([])
  const [loadingSubcats, setLoadingSubcats] = useState(false)
  const { categories: apiCategories } = useCategories()

  const { register, handleSubmit, setValue, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      username: '',
      password: '',
      email: '',
      nom: '',
      prenom: '',
      telephone: '',
      adresse: 'Lome, Togo',
      numeroEnr: '',
      sousCategories: 1,
      longitude: 1.2226,
      latitude: 6.1304,
      facebook: '',
      whatsapp: '',
      tweeter: ''
    }
  })

  useEffect(() => {
    const loadSubcats = async () => {
      setLoadingSubcats(true)
      try {
        // 1) Priorité: endpoint auth avec Bearer token (utilise accessToken ou token public si dispo)
        const tokenFromStorage = localStorage.getItem('accessToken') || undefined
        const fallbackToken = ENV_CONFIG.PUBLIC_BEARER_TOKEN || undefined
        const authToken = tokenFromStorage || fallbackToken
        let res = await apiClient.get<any>('/auth/sous_categorie_auth', authToken)
        let list = Array.isArray(res.data) ? res.data : res.data?.data || []
        if (!list?.length) {
          // 2) Fallback: liste publique non supprimée
          res = await apiClient.get<any>('/sous_categorie_not_deleted')
          list = Array.isArray(res.data) ? res.data : res.data?.data || []
        }
        if (!list?.length) {
          // 3) Fallback: liste publique complète
          res = await apiClient.get<any>('/sous_categorie')
          list = Array.isArray(res.data) ? res.data : res.data?.data || []
        }
        let mapped = list.map((s: any) => ({ id: Number(s.idSousCategorie ?? s.id ?? s.ID ?? s.subcategoryId ?? 0), name: String(s.libelle ?? s.name ?? s.nom ?? 'Sous-catégorie') }))
        // ne pas filtrer par id strict pour ne pas perdre des éléments valides avec id 0
        // 4) Dernier fallback: construire depuis useCategories() si dispo
        if (!mapped.length && apiCategories.length > 0) {
          const flat = apiCategories.flatMap((cat: any) => (cat.subcategories || []).map((sub: any, idx: number) => ({
            id: Number(sub.id ?? sub.ID ?? sub.subcategoryId ?? idx + 1),
            name: String(sub.name ?? sub.libelle ?? sub.nom ?? String(sub))
          })))
          mapped = flat
        }
        // Dédupliquer par id pour éviter les clés en double
        const uniq = new Map<string, { id: number; name: string }>()
        for (const sc of mapped) {
          const key = `${sc.id}-${sc.name}`
          if (!uniq.has(key)) uniq.set(key, sc)
        }
        setSubcategories(Array.from(uniq.values()))
      } catch (e) {
        toast({ title: 'Sous-catégories', description: "Impossible de charger la liste", variant: 'destructive' })
      } finally {
        setLoadingSubcats(false)
      }
    }
    loadSubcats()
  }, [apiCategories])

  const onSubmit = async (data: FormData) => {
    try {
      // Vérifications préalables côté API (unicité)
      const [okUser, okMail, okTel, okNum] = await Promise.all([
        checkUsername?.(data.username) ?? Promise.resolve(true),
        checkEmail?.(data.email) ?? Promise.resolve(true),
        checkTelephone?.(data.telephone) ?? Promise.resolve(true),
        checkNumeroEnr?.(data.numeroEnr) ?? Promise.resolve(true)
      ])
      if (!okUser) throw new Error("Nom d'utilisateur déjà utilisé")
      if (!okMail) throw new Error('Email déjà utilisé')
      if (!okTel) throw new Error('Téléphone déjà utilisé (8 chiffres requis)')
      if (!okNum) throw new Error("Numéro d'enregistrement déjà utilisé")

      await doRegister({ ...data })
      toast({ title: 'Inscription réussie', description: 'Bienvenue sur ALONU !' })
      navigate('/dashboard', { replace: true })
    } catch (e) {
      toast({ title: "Erreur d'inscription", description: e instanceof Error ? e.message : 'Une erreur est survenue', variant: 'destructive' })
    }
  }

  const handleGeolocate = () => {
    if (!navigator.geolocation) {
      toast({ title: 'Localisation indisponible', description: 'Votre navigateur ne supporte pas la géolocalisation', variant: 'destructive' })
      return
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords
        setValue('latitude', Number(latitude))
        setValue('longitude', Number(longitude))
        toast({ title: 'Localisation détectée', description: `${latitude.toFixed(6)}, ${longitude.toFixed(6)}` })
      },
      (err) => {
        toast({ title: 'Localisation refusée', description: err.message, variant: 'destructive' })
      },
      { enableHighAccuracy: true, timeout: 10000 }
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl space-y-6">
        <div className="flex items-center justify-between">
          <Button variant="ghost" className="gap-2" onClick={() => navigate('/')}> 
            <ArrowLeft className="h-4 w-4" /> Retour
          </Button>
        </div>

        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold">Inscription Artisan</h1>
          <p className="text-muted-foreground">Créez votre compte artisan</p>
        </div>

        <Card className="p-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="nom">Nom</Label>
                <Input id="nom" {...register('nom')} aria-invalid={!!errors.nom} />
                {errors.nom && <p className="text-sm text-destructive">{errors.nom.message}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="prenom">Prénom</Label>
                <Input id="prenom" {...register('prenom')} aria-invalid={!!errors.prenom} />
                {errors.prenom && <p className="text-sm text-destructive">{errors.prenom.message}</p>}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="username">Nom d'utilisateur</Label>
              <Input
                id="username"
                autoComplete="off"
                name="username"
                inputMode="text"
                spellCheck="false"
                autoCorrect="off"
                autoCapitalize="off"
                {...register('username')}
                aria-invalid={!!errors.username}
              />
              {errors.username && <p className="text-sm text-destructive">{errors.username.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" {...register('email')} aria-invalid={!!errors.email} />
              {errors.email && <p className="text-sm text-destructive">{errors.email.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="telephone">Téléphone (8 chiffres)</Label>
              <Input id="telephone" {...register('telephone')} placeholder="93160712" aria-invalid={!!errors.telephone} />
              {errors.telephone && <p className="text-sm text-destructive">{errors.telephone.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Mot de passe</Label>
              <div className="relative">
                <Input id="password" type={showPwd ? 'text' : 'password'} {...register('password')} aria-invalid={!!errors.password} />
                <Button type="button" variant="ghost" size="sm" className="absolute right-0 top-0 h-full px-3" onClick={() => setShowPwd(!showPwd)}>
                  {showPwd ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
              {errors.password && <p className="text-sm text-destructive">{errors.password.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="adresse">Adresse</Label>
              <Input id="adresse" {...register('adresse')} aria-invalid={!!errors.adresse} />
              {errors.adresse && <p className="text-sm text-destructive">{errors.adresse.message}</p>}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="sousCategories">Sous-catégorie</Label>
                <Select onValueChange={(v) => setValue('sousCategories', parseInt(v))}>
                  <SelectTrigger>
                    <SelectValue placeholder={loadingSubcats ? 'Chargement...' : 'Choisir'} />
                  </SelectTrigger>
                  <SelectContent>
                    {subcategories.map((sc, i) => (
                      <SelectItem key={`${sc.id}-${i}`} value={String(sc.id)}>{sc.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {!loadingSubcats && subcategories.length > 0 && (
                  <p className="text-xs text-gray-500">{subcategories.length} spécialité(s) disponibles</p>
                )}
                {errors.sousCategories && <p className="text-sm text-destructive">{errors.sousCategories.message}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="latitude">Latitude</Label>
                <Input id="latitude" type="number" step="any" {...register('latitude', { valueAsNumber: true })} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="longitude">Longitude</Label>
                <div className="flex gap-2">
                  <Input id="longitude" type="number" step="any" {...register('longitude', { valueAsNumber: true })} />
                  <Button type="button" variant="outline" onClick={handleGeolocate} title="Utiliser ma position">
                    <MapPin className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="numeroEnr">Numéro d'enregistrement</Label>
                <Input id="numeroEnr" {...register('numeroEnr')} aria-invalid={!!errors.numeroEnr} />
                {errors.numeroEnr && <p className="text-sm text-destructive">{errors.numeroEnr.message}</p>}
              </div>
              <div />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="facebook">Facebook (optionnel)</Label>
                <Input id="facebook" {...register('facebook')} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="whatsapp">WhatsApp (optionnel)</Label>
                <Input id="whatsapp" {...register('whatsapp')} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="tweeter">Twitter (optionnel)</Label>
                <Input id="tweeter" {...register('tweeter')} />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="photo">Photo de profil (optionnel)</Label>
              <Input id="photo" type="file" accept="image/*" onChange={(e) => {
                const f = e.target.files?.[0]
                if (f) {
                  const url = URL.createObjectURL(f)
                  setProfilePreview(url)
                } else {
                  setProfilePreview(null)
                }
              }} />
              {profilePreview && (
                <img src={profilePreview} alt="Aperçu" className="h-24 w-24 rounded-md object-cover border" />
              )}
            </div>

            <Button type="submit" className="w-full" disabled={isSubmitting || isLoading}>
              {(isSubmitting || isLoading) ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Création du compte...
                </>
              ) : (
                <>
                  <UserPlus className="h-4 w-4 mr-2" />
                  Créer mon compte
                </>
              )}
            </Button>
          </form>
        </Card>
      </div>
    </div>
  )
}



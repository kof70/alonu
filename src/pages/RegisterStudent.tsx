import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card } from '@/components/ui/card'
import { useAuth } from '@/contexts/AuthContext'
import { useToast } from '@/hooks/use-toast'
import { Eye, EyeOff, Loader2, UserPlus, ArrowLeft, MapPin } from 'lucide-react'

// Étudiant: on garde un set de champs compatibles avec l'API commune /auth/signin-up-all
const schema = z.object({
  username: z.string().min(3, "Nom d'utilisateur requis (>=3)"),
  password: z.string().min(6, 'Mot de passe requis (>=6)'),
  email: z.string().email('Email invalide'),
  nom: z.string().min(2, 'Nom requis'),
  prenom: z.string().min(2, 'Prénom requis'),
  telephone: z.string().regex(/^\d{8}$/, 'Téléphone: exactement 8 chiffres'),
  adresse: z.string().min(3, 'Adresse requise'),
  numeroEnr: z.string().min(1, "Numéro d'enregistrement requis"),
  longitude: z.number().optional(),
  latitude: z.number().optional(),
  facebook: z.string().optional(),
  whatsapp: z.string().optional(),
  tweeter: z.string().optional(),
})

type FormData = z.infer<typeof schema>

export default function RegisterStudent() {
  const navigate = useNavigate()
  const { toast } = useToast()
  const { register: doRegister, isLoading } = useAuth()
  const [showPwd, setShowPwd] = useState(false)
  const [profilePreview, setProfilePreview] = useState<string | null>(null)

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>({
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
      longitude: 1.2226,
      latitude: 6.1304,
      facebook: '',
      whatsapp: '',
      tweeter: ''
    }
  })

  const onSubmit = async (data: FormData) => {
    try {
      // Rester compatible API: injecter une sous-catégorie par défaut côté payload
      await doRegister({ ...data, sousCategories: 1 })
      toast({ title: 'Inscription réussie', description: 'Bienvenue sur ALONU !' })
      navigate('/dashboard', { replace: true })
    } catch (e) {
      toast({ title: "Erreur d'inscription", description: e instanceof Error ? e.message : 'Une erreur est survenue', variant: 'destructive' })
    }
  }

  const handleGeolocate = () => {
    if (!navigator.geolocation) return
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords
        // pas de setValue ici: RegisterStudent n'a pas setValue dans le hook
        // On utilise un hack: créer des events manuels si nécessaire, mais plus simple: champs non requis
        // Recommandation: laisser vide si l'étudiant ne souhaite pas la géoloc
        const latInput = document.getElementById('latitude') as HTMLInputElement | null
        const lonInput = document.getElementById('longitude') as HTMLInputElement | null
        if (latInput) latInput.value = String(latitude)
        if (lonInput) lonInput.value = String(longitude)
      },
      () => {}
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5 flex items-center justify-center p-4">
      <div className="w-full max-w-xl space-y-6">
        <div className="flex items-center justify-between">
          <Button variant="ghost" className="gap-2" onClick={() => navigate('/')}> 
            <ArrowLeft className="h-4 w-4" /> Retour
          </Button>
        </div>

        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold">Inscription Étudiant</h1>
          <p className="text-muted-foreground">Créez votre compte étudiant</p>
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
              <Input id="username" {...register('username')} aria-invalid={!!errors.username} />
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
                <Label htmlFor="latitude">Latitude (optionnel)</Label>
                <Input id="latitude" type="number" step="any" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="longitude">Longitude (optionnel)</Label>
                <div className="flex gap-2">
                  <Input id="longitude" type="number" step="any" />
                  <Button type="button" variant="outline" onClick={handleGeolocate} title="Utiliser ma position">
                    <MapPin className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <div />
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="numeroEnr">Numéro d'enregistrement</Label>
                <Input id="numeroEnr" {...register('numeroEnr')} aria-invalid={!!errors.numeroEnr} />
                {errors.numeroEnr && <p className="text-sm text-destructive">{errors.numeroEnr.message}</p>}
              </div>
              <div />
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



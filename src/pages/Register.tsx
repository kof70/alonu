import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { categories } from "@/data/mockData";
import { MapPin, CheckCircle2, ArrowLeft, UserPlus, Eye, EyeOff, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";

// Schéma de validation pour l'inscription
const registerSchema = z.object({
  username: z.string().min(3, 'Nom d\'utilisateur requis (min 3 caractères)'),
  password: z.string().min(6, 'Mot de passe requis (min 6 caractères)'),
  confirmPassword: z.string().optional(),
  email: z.string().email('Email invalide'),
  nom: z.string().min(2, 'Nom requis'),
  prenom: z.string().min(2, 'Prénom requis'),
  telephone: z.string().min(8, 'Numéro de téléphone requis'),
  adresse: z.string().min(5, 'Adresse requise'),
  numeroEnr: z.string().min(3, 'Numéro d\'enregistrement requis'),
  facebook: z.string().optional(),
  whatsapp: z.string().optional(),
  tweeter: z.string().optional(),
  longitude: z.number().optional(),
  latidute: z.number().optional(), // IMPORTANT: l'API backend attend "latidute" (avec faute)
  sousCategories: z.number().min(1, 'Sélectionnez une sous-catégorie'),
  acceptTerms: z.boolean().refine(val => val === true, 'Vous devez accepter les conditions')
}).refine((data) => data.password === data.confirmPassword, {
  message: "Les mots de passe ne correspondent pas",
  path: ["confirmPassword"],
});

type RegisterFormData = z.infer<typeof registerSchema>;

type Step = 1 | 2 | 3 | 4;

const Register = () => {
  const [step, setStep] = useState<Step>(1);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { register: authRegister, isLoading, checkUsername, checkEmail, checkTelephone, checkNumeroEnr } = useAuth();

  const {
    register,
    handleSubmit: formHandleSubmit,
    formState: { errors, isSubmitting },
    watch,
    setValue
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      username: '',
      password: '',
      confirmPassword: '',
      email: '',
      nom: '',
      prenom: '',
      telephone: '',
      adresse: 'Lomé, Togo',
      numeroEnr: '',
      facebook: '',
      whatsapp: '',
      tweeter: '',
      longitude: 1.2226,
      latidute: 6.1304, // IMPORTANT: l'API backend attend "latidute" (avec faute)
      sousCategories: 0,
      acceptTerms: false
    }
  });


  const onSubmit = async (data: RegisterFormData) => {
    try {
      // Supprimer confirmPassword des données envoyées
      const { confirmPassword, ...registerData } = data;
      await authRegister(registerData);
    setStep(4);
    toast({
      title: "Inscription réussie",
        description: "Votre compte a été créé avec succès !",
      });
    } catch (error) {
      toast({
        title: "Erreur d'inscription",
        description: error instanceof Error ? error.message : "Une erreur est survenue",
        variant: "destructive"
      });
    }
  };

  const validateField = async (field: keyof RegisterFormData, value: string) => {
    if (!value) return;
    
    try {
      let isAvailable = false;
      switch (field) {
        case 'username':
          isAvailable = await checkUsername(value);
          break;
        case 'email':
          isAvailable = await checkEmail(value);
          break;
        case 'telephone':
          isAvailable = await checkTelephone(value);
          break;
        case 'numeroEnr':
          isAvailable = await checkNumeroEnr(value);
          break;
      }
      
      if (!isAvailable) {
        toast({
          title: "Champ non disponible",
          description: `Ce ${field} est déjà utilisé`,
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error(`Erreur lors de la vérification du ${field}:`, error);
    }
  };

  if (step === 4) {
    // Redirection automatique vers le dashboard après inscription réussie
    navigate("/dashboard", { replace: true });
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl space-y-6">
        {/* Header avec retour */}
        <div className="flex items-center justify-between">
          <Button
            variant="ghost"
            onClick={() => navigate('/')}
            className="gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Retour
          </Button>
        </div>

        {/* Logo et titre */}
        <div className="text-center space-y-3">
          <div className="flex justify-center items-center space-x-3">
            <span className="text-3xl font-bold" style={{ color: '#006E4F' }}>
              ALONU
            </span>
          </div>
          <h1 className="text-3xl font-bold">Inscription Artisan/Étudiant</h1>
          <p className="text-muted-foreground">
            Étape {step} sur 3
          </p>
        </div>

          {/* Progress Bar */}
        <div className="flex gap-2">
            {[1, 2, 3].map((s) => (
              <div
                key={s}
                className={`h-2 flex-1 rounded-full transition-colors ${
                  s <= step ? "bg-primary" : "bg-muted"
                }`}
              />
            ))}
          </div>

          <Card className="p-6">
          <form onSubmit={formHandleSubmit(onSubmit)}>
            {step === 1 && (
              <div className="space-y-4">
                <h2 className="text-xl font-semibold mb-4">Informations personnelles</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="nom">Nom <span className="text-destructive">*</span></Label>
                    <Input 
                      id="nom" 
                      {...register('nom')}
                      placeholder="Ex: AGBO"
                      aria-invalid={!!errors.nom}
                    />
                    {errors.nom && (
                      <p className="text-sm text-destructive">{errors.nom.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="prenom">Prénom <span className="text-destructive">*</span></Label>
                    <Input 
                      id="prenom" 
                      {...register('prenom')}
                      placeholder="Ex: Marc"
                      aria-invalid={!!errors.prenom}
                    />
                    {errors.prenom && (
                      <p className="text-sm text-destructive">{errors.prenom.message}</p>
                    )}
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="username">Nom d'utilisateur <span className="text-destructive">*</span></Label>
                  <Input 
                    id="username" 
                    {...register('username')}
                    placeholder="votre_nom_utilisateur"
                    onBlur={(e) => validateField('username', e.target.value)}
                    aria-invalid={!!errors.username}
                  />
                  {errors.username && (
                    <p className="text-sm text-destructive">{errors.username.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email <span className="text-destructive">*</span></Label>
                  <Input 
                    id="email" 
                    type="email"
                    {...register('email')}
                    placeholder="votre@email.com"
                    onBlur={(e) => validateField('email', e.target.value)}
                    aria-invalid={!!errors.email}
                  />
                  {errors.email && (
                    <p className="text-sm text-destructive">{errors.email.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="telephone">Téléphone <span className="text-destructive">*</span></Label>
                  <Input 
                    id="telephone" 
                    type="tel"
                    {...register('telephone')}
                    placeholder="+228 XX XX XX XX"
                    onBlur={(e) => validateField('telephone', e.target.value)}
                    aria-invalid={!!errors.telephone}
                  />
                  {errors.telephone && (
                    <p className="text-sm text-destructive">{errors.telephone.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Mot de passe <span className="text-destructive">*</span></Label>
                  <div className="relative">
                    <Input 
                      id="password" 
                      type={showPassword ? 'text' : 'password'}
                      {...register('password')}
                      placeholder="••••••••"
                      aria-invalid={!!errors.password}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3"
                      onClick={() => setShowPassword(!showPassword)}
                      tabIndex={-1}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                  {errors.password && (
                    <p className="text-sm text-destructive">{errors.password.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirmer le mot de passe <span className="text-destructive">*</span></Label>
                  <div className="relative">
                    <Input 
                      id="confirmPassword" 
                      type={showConfirmPassword ? 'text' : 'password'}
                      placeholder="••••••••"
                      {...register('confirmPassword')}
                      aria-invalid={!!errors.confirmPassword}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      tabIndex={-1}
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                  {errors.confirmPassword && (
                    <p className="text-sm text-destructive">{errors.confirmPassword.message}</p>
                  )}
                </div>

                <Button 
                  type="button"
                  onClick={() => setStep(2)} 
                  className="w-full mt-6"
                >
                  Suivant
                </Button>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-4">
                <h2 className="text-xl font-semibold mb-4">Profil professionnel</h2>
                
                <div className="space-y-2">
                  <Label htmlFor="category">Catégorie <span className="text-destructive">*</span></Label>
                  <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner une catégorie" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((cat) => (
                        <SelectItem key={cat.id} value={cat.id}>
                          {cat.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {selectedCategory && (
                  <div className="space-y-2">
                    <Label htmlFor="subcategory">Sous-catégorie / Métier <span className="text-destructive">*</span></Label>
                    <Select onValueChange={(value: string) => setValue('sousCategories', parseInt(value))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner votre métier" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories
                          .find((c) => c.id === selectedCategory)
                          ?.subcategories.map((sub, idx) => (
                            <SelectItem key={idx} value={idx.toString()}>
                              {sub}
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
                    {errors.sousCategories && (
                      <p className="text-sm text-destructive">{errors.sousCategories.message}</p>
                    )}
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="adresse">Adresse <span className="text-destructive">*</span></Label>
                  <Input 
                    id="adresse" 
                    {...register('adresse')}
                    placeholder="Quartier, ville"
                    aria-invalid={!!errors.adresse}
                  />
                  {errors.adresse && (
                    <p className="text-sm text-destructive">{errors.adresse.message}</p>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="latidute">Latitude</Label>
                    <div className="relative">
                      <Input 
                        id="latidute" 
                        type="number"
                        step="any"
                        {...register('latidute', { valueAsNumber: true })}
                        placeholder="6.1304"
                      />
                      <MapPin className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground cursor-pointer" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="longitude">Longitude</Label>
                    <Input 
                      id="longitude" 
                      type="number"
                      step="any"
                      {...register('longitude', { valueAsNumber: true })}
                      placeholder="1.2226"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="numeroEnr">Numéro d'enregistrement <span className="text-destructive">*</span></Label>
                  <Input 
                    id="numeroEnr" 
                    {...register('numeroEnr')}
                    placeholder="Ex: CRM-2024-XXXX"
                    onBlur={(e) => validateField('numeroEnr', e.target.value)}
                    aria-invalid={!!errors.numeroEnr}
                  />
                  {errors.numeroEnr && (
                    <p className="text-sm text-destructive">{errors.numeroEnr.message}</p>
                  )}
                </div>

                <div className="flex gap-3 mt-6">
                  <Button 
                    type="button"
                    onClick={() => setStep(1)} 
                    variant="outline" 
                    className="flex-1"
                  >
                    Retour
                  </Button>
                  <Button 
                    type="button"
                    onClick={() => setStep(3)} 
                    className="flex-1"
                  >
                    Suivant
                  </Button>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-4">
                <h2 className="text-xl font-semibold mb-4">Réseaux sociaux et finalisation</h2>
                
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="facebook">Facebook (optionnel)</Label>
                    <Input 
                      id="facebook" 
                      {...register('facebook')}
                      placeholder="https://facebook.com/votre-profil"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="whatsapp">WhatsApp (optionnel)</Label>
                    <Input 
                      id="whatsapp" 
                      {...register('whatsapp')}
                      placeholder="+228 XX XX XX XX"
                    />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="tweeter">Twitter (optionnel)</Label>
                    <Input 
                      id="tweeter" 
                      {...register('tweeter')}
                      placeholder="https://twitter.com/votre-profil"
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-start space-x-2">
                    <Checkbox 
                      id="acceptTerms" 
                      {...register('acceptTerms')}
                      className="mt-1"
                    />
                    <div className="space-y-1">
                      <Label 
                        htmlFor="acceptTerms" 
                        className="text-sm font-normal cursor-pointer"
                      >
                        J'accepte les{' '}
                        <a href="/terms" className="text-primary hover:underline">
                          conditions d'utilisation
                        </a>{' '}
                        et la{' '}
                        <a href="/privacy" className="text-primary hover:underline">
                          politique de confidentialité
                        </a>
                      </Label>
                      {errors.acceptTerms && (
                        <p className="text-sm text-destructive">{errors.acceptTerms.message}</p>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex gap-3 mt-6">
                  <Button 
                    type="button"
                    onClick={() => setStep(2)} 
                    variant="outline" 
                    className="flex-1"
                  >
                    Retour
                  </Button>
                  <Button 
                    type="submit"
                    disabled={isSubmitting || isLoading}
                    className="flex-1"
                  >
                    {(isSubmitting || isLoading) ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Inscription en cours...
                      </>
                    ) : (
                      <>
                        <UserPlus className="h-4 w-4 mr-2" />
                        Créer mon compte
                      </>
                    )}
                  </Button>
                </div>
              </div>
            )}
          </form>
          </Card>
      </div>
    </div>
  );
};

export default Register;

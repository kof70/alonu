import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';
import { useAuth as useAuthContext } from '@/contexts/AuthContext';
import { useLogin } from '@/hooks';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Eye, EyeOff, LogIn, ArrowLeft, ShieldCheck } from 'lucide-react';

// Schéma de validation
const loginSchema = z.object({
  username: z.string().min(3, 'Nom d\'utilisateur requis'),
  password: z.string().min(1, 'Mot de passe requis'),
  rememberMe: z.boolean().optional(),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const { login: authLogin } = useAuthContext();
  const { mutateAsync: signin } = useLogin();
  const [showPassword, setShowPassword] = useState(false);

  const from = (location.state as { from?: string })?.from || '/';

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: '',
      password: '',
      rememberMe: false,
    }
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      const response = await signin({
        username: data.username,
        password: data.password
      });

      // Sauvegarder le token dans le contexte
      authLogin(response.accessToken, response.refreshToken);

      // Vérifier le rôle de l'utilisateur pour rediriger vers la bonne page
      const userRole = response.user?.role;
      
      if (userRole === 1) {
        // Admin - Rediriger vers le dashboard admin
        toast({
          title: 'Connexion réussie',
          description: 'Bienvenue dans l\'espace administrateur',
        });
        navigate('/admin/dashboard', { replace: true });
      } else {
        // Artisan ou Étudiant - Rediriger vers la page d'origine ou l'accueil
        toast({
          title: 'Connexion réussie',
          description: 'Bienvenue sur ALONU !',
        });
        navigate(from, { replace: true });
      }
    } catch (error) {
      toast({
        title: 'Erreur de connexion',
        description: error instanceof Error ? error.message : 'Identifiants invalides',
        variant: 'destructive'
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5 flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
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
            <img 
              src="/logo-crm.png" 
              alt="Logo CRM" 
              className="h-12 w-auto"
            />
            <span className="text-3xl font-bold" style={{ color: '#006E4F' }}>
              ALONU
            </span>
          </div>
          <h1 className="text-3xl font-bold">Connexion</h1>
          <p className="text-muted-foreground">
            Accédez à votre espace ALONU
          </p>
        </div>

        {/* Formulaire de connexion */}
        <Card className="p-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Username */}
            <div className="space-y-2">
              <Label htmlFor="username">
                Nom d'utilisateur <span className="text-destructive">*</span>
              </Label>
              <Input
                id="username"
                {...register('username')}
                placeholder="votre_nom_utilisateur"
                autoComplete="username"
                aria-invalid={!!errors.username}
              />
              {errors.username && (
                <p className="text-sm text-destructive">{errors.username.message}</p>
              )}
            </div>

            {/* Password */}
            <div className="space-y-2">
              <Label htmlFor="password">
                Mot de passe <span className="text-destructive">*</span>
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  {...register('password')}
                  placeholder="Votre mot de passe"
                  autoComplete="current-password"
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

            {/* Remember me et Mot de passe oublié */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Checkbox id="rememberMe" {...register('rememberMe')} />
                <Label 
                  htmlFor="rememberMe" 
                  className="text-sm font-normal cursor-pointer"
                >
                  Se souvenir de moi
                </Label>
              </div>
              <a
                href="/forgot-password"
                className="text-sm text-primary hover:underline"
              >
                Mot de passe oublié ?
              </a>
            </div>

            {/* Bouton de connexion */}
            <Button
              type="submit"
              className="w-full"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Connexion en cours...
                </>
              ) : (
                <>
                  <LogIn className="h-4 w-4 mr-2" />
                  Se connecter
                </>
              )}
            </Button>
          </form>
        </Card>

        {/* Séparateur */}
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <Separator />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">
              Nouveau sur ALONU ?
            </span>
          </div>
        </div>

        {/* Lien inscription */}
        <Card className="p-6 text-center">
          <p className="text-muted-foreground mb-4">
            Vous n'avez pas encore de compte artisan ?
          </p>
          <Button
            variant="outline"
            onClick={() => navigate('/register')}
            className="w-full"
          >
            Créer un compte artisan
          </Button>
        </Card>

        {/* Footer */}
        <div className="text-center text-xs text-muted-foreground">
          <p>
            En vous connectant, vous acceptez nos{' '}
            <a href="/terms" className="text-primary hover:underline">
              Conditions d'utilisation
            </a>{' '}
            et notre{' '}
            <a href="/privacy" className="text-primary hover:underline">
              Politique de confidentialité
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}

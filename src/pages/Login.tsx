import { useState } from "react";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container px-4 py-12">
        <Card className="max-w-md mx-auto p-6">
          <h1 className="text-2xl font-bold mb-6 text-center">
            {isLogin ? "Connexion" : "Créer un compte"}
          </h1>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" placeholder="votre@email.com" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Mot de passe</Label>
              <Input id="password" type="password" placeholder="••••••••" />
            </div>

            {isLogin && (
              <button className="text-sm text-primary hover:underline">
                Mot de passe oublié ?
              </button>
            )}

            <Button className="w-full" onClick={() => navigate("/")}>
              {isLogin ? "Se connecter" : "S'inscrire"}
            </Button>

            <div className="text-center">
              <button
                onClick={() => setIsLogin(!isLogin)}
                className="text-sm text-muted-foreground hover:text-foreground"
              >
                {isLogin ? (
                  <>
                    Pas encore de compte ?{" "}
                    <span className="text-primary font-medium">S'inscrire</span>
                  </>
                ) : (
                  <>
                    Déjà un compte ?{" "}
                    <span className="text-primary font-medium">Se connecter</span>
                  </>
                )}
              </button>
            </div>

            {!isLogin && (
              <div className="pt-4 border-t">
                <p className="text-sm text-center text-muted-foreground mb-3">
                  Vous êtes artisan ?
                </p>
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => navigate("/register")}
                >
                  Inscription Artisan
                </Button>
              </div>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Login;

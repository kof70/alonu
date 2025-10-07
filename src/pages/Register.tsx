import { useState } from "react";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { categories } from "@/data/mockData";
import { MapPin, Upload, CheckCircle2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

type Step = 1 | 2 | 3 | 4;

const Register = () => {
  const [step, setStep] = useState<Step>(1);
  const [selectedCategory, setSelectedCategory] = useState("");
  const { toast } = useToast();

  const handleSubmit = () => {
    setStep(4);
    toast({
      title: "Inscription réussie",
      description: "Compte en attente de validation par la Chambre des métiers",
    });
  };

  if (step === 4) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container px-4 py-12">
          <Card className="max-w-md mx-auto p-8 text-center">
            <CheckCircle2 className="w-16 h-16 text-accent mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2">Inscription réussie !</h2>
            <p className="text-muted-foreground mb-6">
              Compte en attente de validation par la Chambre des métiers
            </p>
            <Button onClick={() => window.location.href = "/"} className="w-full">
              Retour à l'accueil
            </Button>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-3xl font-bold mb-2">Inscription Artisan</h1>
          <p className="text-muted-foreground mb-6">Étape {step} sur 3</p>

          {/* Progress Bar */}
          <div className="flex gap-2 mb-8">
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
            {step === 1 && (
              <div className="space-y-4">
                <h2 className="text-xl font-semibold mb-4">Informations personnelles</h2>
                
                <div className="space-y-2">
                  <Label htmlFor="name">Nom complet</Label>
                  <Input id="name" placeholder="Ex: AGBO Marc" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" placeholder="votre@email.com" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Téléphone</Label>
                  <Input id="phone" type="tel" placeholder="+229 XX XX XX XX" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Mot de passe</Label>
                  <Input id="password" type="password" placeholder="••••••••" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirm-password">Confirmer le mot de passe</Label>
                  <Input id="confirm-password" type="password" placeholder="••••••••" />
                </div>

                <Button onClick={() => setStep(2)} className="w-full mt-6">
                  Suivant
                </Button>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-4">
                <h2 className="text-xl font-semibold mb-4">Profil professionnel</h2>
                
                <div className="space-y-2">
                  <Label htmlFor="category">Catégorie</Label>
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
                    <Label htmlFor="subcategory">Sous-catégorie / Métier</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner votre métier" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories
                          .find((c) => c.id === selectedCategory)
                          ?.subcategories.map((sub, idx) => (
                            <SelectItem key={idx} value={sub}>
                              {sub}
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="workshop">Nom de l'atelier</Label>
                  <Input id="workshop" placeholder="Ex: Atelier Marc Calligraphie" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address">Adresse</Label>
                  <Input id="address" placeholder="Quartier, ville" />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="latitude">Latitude</Label>
                    <div className="relative">
                      <Input id="latitude" placeholder="6.3654" />
                      <MapPin className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground cursor-pointer" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="longitude">Longitude</Label>
                    <Input id="longitude" placeholder="2.4183" />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="profile-photo">Photo de profil</Label>
                  <div className="border-2 border-dashed rounded-lg p-6 text-center cursor-pointer hover:border-primary transition-colors">
                    <Upload className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">Cliquer pour télécharger</p>
                  </div>
                </div>

                <div className="flex gap-3 mt-6">
                  <Button onClick={() => setStep(1)} variant="outline" className="flex-1">
                    Retour
                  </Button>
                  <Button onClick={() => setStep(3)} className="flex-1">
                    Suivant
                  </Button>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-4">
                <h2 className="text-xl font-semibold mb-4">Vérification Chambre des métiers</h2>
                
                <div className="bg-muted/50 p-4 rounded-lg mb-4">
                  <p className="text-sm text-muted-foreground">
                    Pour être vérifié sur ALONU, veuillez télécharger votre attestation d'inscription
                    à la Chambre des métiers.
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="registration-number">Numéro de dossier</Label>
                  <Input id="registration-number" placeholder="Ex: CRM-2024-XXXX" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="certificate">Attestation d'inscription (PDF/Scan)</Label>
                  <div className="border-2 border-dashed rounded-lg p-8 text-center cursor-pointer hover:border-primary transition-colors">
                    <Upload className="w-12 h-12 mx-auto mb-3 text-muted-foreground" />
                    <p className="font-medium mb-1">Télécharger votre attestation</p>
                    <p className="text-sm text-muted-foreground">PDF, JPG ou PNG (max 5MB)</p>
                  </div>
                </div>

                <div className="flex gap-3 mt-6">
                  <Button onClick={() => setStep(2)} variant="outline" className="flex-1">
                    Retour
                  </Button>
                  <Button onClick={handleSubmit} className="flex-1">
                    Soumettre
                  </Button>
                </div>
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Register;

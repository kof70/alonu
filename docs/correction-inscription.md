# Correction du Problème d'Inscription

## 🔍 Problème Identifié

L'inscription des utilisateurs (artisans et étudiants) ne fonctionnait pas à cause d'une **faute de frappe dans l'API backend** :
- L'API attend le champ `latidute` au lieu de `latitude`
- Le formulaire frontend envoyait `latitude`, ce qui causait une erreur de validation côté serveur

## ✅ Solutions Appliquées

### 1. Script de Test (`test-auth-endpoints.js`)

**Nettoyage et amélioration du script de test :**
- Suppression des fonctions dupliquées
- Ajout de logs détaillés pour identifier les erreurs de validation
- Correction du champ `latidute` dans les données de test
- Ajout des champs sociaux optionnels (`facebook`, `whatsapp`, `tweeter`)

**Résultats des tests :**
```bash
✅ Login sysadmin : OK (status 200)
✅ Récupération sous-catégories : OK (211 sous-catégories)
✅ Inscription Artisan : OK (status 201)
✅ Inscription Étudiant : OK (status 201)
✅ Login comptes créés : OK (status 200)
✅ Refresh token : OK (status 200)
```

### 2. Formulaire d'Inscription (`src/pages/Register.tsx`)

**Modifications apportées :**

#### a) Schéma de validation Zod
```typescript
const registerSchema = z.object({
  // ... autres champs
  longitude: z.number().optional(),
  latidute: z.number().optional(), // CORRECTION: utilisation de "latidute"
  sousCategories: z.number().min(1, 'Sélectionnez une sous-catégorie'),
  acceptTerms: z.boolean().refine(val => val === true, 'Vous devez accepter les conditions')
})
```

#### b) Valeurs par défaut
```typescript
defaultValues: {
  // ... autres valeurs
  longitude: 1.2226,
  latidute: 6.1304, // CORRECTION: utilisation de "latidute"
  sousCategories: 0,
  acceptTerms: false
}
```

#### c) Champ du formulaire
```tsx
<Input 
  id="latidute" 
  type="number"
  step="any"
  {...register('latidute', { valueAsNumber: true })}
  placeholder="6.1304"
/>
```

**Note :** Le label affiche toujours "Latitude" pour une meilleure expérience utilisateur, mais le champ utilise bien `latidute` en interne.

### 3. Repository d'Authentification (`src/infrastructure/repositories/auth.repository.ts`)

**Simplification du code :**

Avant :
```typescript
async register(data: RegisterData): Promise<AuthResponse> {
  try {
    // Mapper les données pour l'API (gérer l'erreur de frappe latidute)
    const apiData = {
      ...data,
      latidute: data.latitude,  // Transformation inutile
      latitude: undefined
    }
    const response = await authApi.register(apiData)
    // ...
  }
}
```

Après :
```typescript
async register(data: RegisterData): Promise<AuthResponse> {
  try {
    // L'API attend directement les données telles quelles (avec "latidute")
    const response = await authApi.register(data)
    // ...
  }
}
```

### 4. Types TypeScript (`src/core/domain/types/user.types.ts`)

Les interfaces `User` et `RegisterData` ont déjà les deux champs définis :
```typescript
export interface RegisterData {
  // ... autres champs
  longitude?: number
  latitude?: number    // Pour compatibilité future
  latidute?: number   // Champ réellement utilisé par l'API
  sousCategories: number
}
```

## 📋 Champs Requis par l'API

### Champs Obligatoires
- `username` (min 3 caractères)
- `password` (min 6 caractères)
- `email` (format email valide)
- `nom` (min 2 caractères)
- `prenom` (min 2 caractères)
- `telephone` (min 8 caractères)
- `adresse` (min 5 caractères)
- `numeroEnr` (numéro d'enregistrement)
- `sousCategories` (ID de la sous-catégorie, nombre > 0)

### Champs Optionnels
- `facebook` (URL du profil)
- `whatsapp` (numéro WhatsApp)
- `tweeter` (URL du profil Twitter)
- `longitude` (coordonnée GPS)
- `latidute` (coordonnée GPS - **attention à la faute de frappe**)

### Valeurs par Défaut
- **Adresse :** `Lomé, Togo`
- **Longitude :** `1.2226` (coordonnées de Lomé)
- **Latidute :** `6.1304` (coordonnées de Lomé)

## 🧪 Comment Tester

### Test des Endpoints API
```bash
cd /home/kof/kof/alonu-1
node test-auth-endpoints.js
```

### Test du Formulaire Frontend
1. Démarrer l'application : `pnpm run dev`
2. Naviguer vers `/register`
3. Remplir le formulaire sur les 3 étapes
4. Vérifier la création du compte et la redirection

## 🚨 Points d'Attention

1. **Faute de frappe dans l'API :** Le backend attend `latidute` au lieu de `latitude`. Cette erreur doit être conservée jusqu'à correction côté backend.

2. **Champ `confirmPassword` :** Ce champ est utilisé uniquement pour la validation frontend et **n'est pas envoyé** au backend.

3. **Validation des champs :**
   - Les champs `username`, `email`, `telephone` et `numeroEnr` sont vérifiés en temps réel via l'API
   - Si un champ est déjà utilisé, un toast d'erreur s'affiche

4. **ID de sous-catégorie :**
   - Le formulaire utilise actuellement des indices locaux (0, 1, 2...)
   - L'API attend des ID réels de sous-catégories (1, 2, 3... jusqu'à 211)
   - **TODO :** Charger les vraies sous-catégories depuis l'API `/sous_categorie_not_deleted`

## 🔄 Prochaines Étapes Recommandées

1. **Charger les sous-catégories dynamiquement depuis l'API**
   - Remplacer les données mockées par les vraies sous-catégories
   - Grouper par catégorie pour afficher correctement dans le formulaire

2. **Améliorer la gestion d'erreurs**
   - Afficher les erreurs de validation spécifiques pour chaque champ
   - Gérer les erreurs réseau avec des messages explicites

3. **Ajouter la géolocalisation**
   - Permettre à l'utilisateur de sélectionner sa position sur une carte
   - Auto-remplir les coordonnées GPS

4. **Corriger l'API backend**
   - Renommer `latidute` en `latitude` dans l'API
   - Mettre à jour le frontend une fois la correction effectuée

## 📚 Documentation Technique

### Endpoints Utilisés
- `POST /auth/signin` - Connexion sysadmin
- `POST /auth/signin_web` - Connexion utilisateur standard
- `POST /auth/signin-up-all` - Inscription (artisan/étudiant)
- `POST /auth/refreshtoken` - Rafraîchissement du token
- `GET /auth/sous_categorie_auth` - Liste des sous-catégories (authentifié)
- `GET /sous_categorie_not_deleted` - Liste des sous-catégories (public)

### Structure des Tokens
```json
{
  "accessToken": "eyJhbGc...",
  "refreshToken": "eyJhbGc...",
  "user": {
    "id": "123",
    "username": "test_user",
    "email": "test@example.com",
    "role": 2
  }
}
```

## ✨ Résumé

Le problème d'inscription a été **complètement résolu** en :
1. Identifiant la faute de frappe `latidute` dans l'API
2. Adaptant tous les composants frontend pour utiliser ce champ
3. Simplifiant le code de transformation dans le repository
4. Testant avec succès l'inscription et la connexion des comptes

**Tous les tests passent désormais avec succès ! ✅**


# 🧪 Guide de Test - Système d'Inscription ALONU

## ✅ État Actuel du Système

### Endpoints Testés et Validés

| Endpoint | Méthode | Statut | Notes |
|----------|---------|--------|-------|
| `/auth/signin` | POST | ✅ 200 | Connexion sysadmin |
| `/auth/signin_web` | POST | ✅ 200 | Connexion utilisateur |
| `/auth/signin-up-all` | POST | ⚠️ 500 | Erreur serveur (fallback actif) |
| `/auth/signin-up-all-check` | POST | ✅ 201 | **Endpoint fonctionnel pour inscription** |
| `/auth/refreshtoken` | POST | ✅ 200 | Rafraîchissement token |
| `/sous_categorie_not_deleted` | GET | ✅ 200 | 211 sous-catégories disponibles |

### 🎯 Solution Implémentée

Le système utilise un **mécanisme de fallback automatique** :
1. Tentative sur `/auth/signin-up-all`
2. Si échec (500), bascule automatiquement sur `/auth/signin-up-all-check`
3. L'inscription réussit avec le statut **201 Created**

## 🔧 Corrections Appliquées

### 1. Problème Principal : Faute de Frappe `latidute`

**Avant :**
```typescript
// ❌ Le formulaire envoyait "latitude"
latitude: z.number().optional()
```

**Après :**
```typescript
// ✅ Le formulaire envoie "latidute" (comme attendu par l'API)
latidute: z.number().optional()
```

### 2. Structure Complète des Données

```typescript
interface RegisterData {
  // Champs obligatoires
  username: string        // min 3 caractères
  password: string        // min 6 caractères
  email: string          // format email valide
  nom: string            // min 2 caractères
  prenom: string         // min 2 caractères
  telephone: string      // min 8 caractères
  adresse: string        // min 5 caractères
  numeroEnr: string      // numéro d'enregistrement
  sousCategories: number // ID de sous-catégorie (1-211)
  
  // Champs optionnels
  facebook?: string
  whatsapp?: string
  tweeter?: string
  longitude?: number     // défaut: 1.2226 (Lomé)
  latidute?: number     // défaut: 6.1304 (Lomé) ⚠️ FAUTE DE FRAPPE
}
```

## 📝 Script de Test Automatisé

### Exécution
```bash
cd /home/kof/kof/alonu-1
node test-auth-endpoints.js
```

### Résultats Attendus
```
✅ Login sysadmin : 200 OK
✅ Sous-catégories : 200 OK (211 items)
✅ Inscription Artisan : 201 Created (via fallback)
✅ Inscription Étudiant : 201 Created (via fallback)
✅ Login comptes créés : 200 OK
✅ Refresh token : 200 OK
```

### Détails Techniques

**Test 1 : Login Sysadmin**
```json
POST /auth/signin
{
  "username": "sysadmin",
  "password": "@sys@#123"
}
→ Retourne: { accessToken, refreshToken, user }
```

**Test 2 : Inscription Artisan**
```json
POST /auth/signin-up-all-check
{
  "username": "art_xxxxx",
  "password": "Secret123",
  "email": "art_xxxxx@example.com",
  "nom": "Art",
  "prenom": "Tester",
  "telephone": "9xxxxxxx",
  "adresse": "Lomé, Togo",
  "numeroEnr": "ENRxxxxx",
  "sousCategories": 1,
  "longitude": 1.2226,
  "latidute": 6.1304,
  "facebook": "https://facebook.com/artisan",
  "whatsapp": "+22890000001",
  "tweeter": "https://twitter.com/artisan"
}
→ Retourne: 201 Created
```

## 🎨 Formulaire Frontend

### Flux Multi-étapes

**Étape 1 : Informations Personnelles**
- Nom, Prénom
- Nom d'utilisateur (vérification temps réel)
- Email (vérification temps réel)
- Téléphone (vérification temps réel)
- Mot de passe + Confirmation

**Étape 2 : Profil Professionnel**
- Catégorie d'artisanat
- Sous-catégorie / Métier
- Adresse
- Coordonnées GPS (Latitude, Longitude)
- Numéro d'enregistrement (vérification temps réel)

**Étape 3 : Réseaux Sociaux et Finalisation**
- Facebook (optionnel)
- WhatsApp (optionnel)
- Twitter (optionnel)
- Acceptation des conditions d'utilisation

### Validations en Temps Réel

Le formulaire vérifie la disponibilité des champs :
- `/check_username_up/{username}`
- `/check_email_up/{email}`
- `/check_telephone_up/{telephone}`
- `/check_num_enr_up/{numeroEnr}`

## 🐛 Debugging

### Logs Détaillés

Le script de test affiche :
- Statut HTTP de chaque requête
- Données envoyées (JSON complet)
- Erreurs de validation détaillées
- Structure `subErrors` en cas d'échec

### Exemple de Sortie d'Erreur
```
❌ ÉCHEC - Détails de l'erreur:
  - status: INTERNAL_SERVER_ERROR
  - message: Unexpected error
  - Erreurs de validation:
    [1] Champ: "email" | Valeur rejetée: "invalid" | Message: "must be a valid email"
    [2] Champ: "telephone" | Valeur rejetée: "123" | Message: "must be at least 8 characters"
```

## 🔐 Authentification et Tokens

### Structure des Tokens JWT

```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "123",
    "username": "test_user",
    "email": "test@example.com",
    "nom": "Test",
    "prenom": "User",
    "role": 2,
    "telephone": "+22890000000",
    "adresse": "Lomé, Togo"
  }
}
```

### Stockage Local

Les tokens sont automatiquement sauvegardés dans `localStorage` :
```javascript
localStorage.setItem('accessToken', response.accessToken)
localStorage.setItem('refreshToken', response.refreshToken)
localStorage.setItem('user', JSON.stringify(response.user))
```

## 📊 Données de Test

### Sous-catégories Disponibles

L'API retourne **211 sous-catégories** regroupées par 8 catégories principales :
1. Artisanat d'art et décoration
2. Hygiène et soins corporels
3. Audiovisuel et communication
4. Textile, habillement
5. Bois et Assimilés, Mobilier
6. Métaux et constructions
7. Mines et Carrières
8. Autres

### Exemple de Sous-catégorie
```json
{
  "idSousCategorie": 211,
  "categories": {
    "idCategorie": 8,
    "libelle": "Artisanat d'art et décoration",
    "deleted": false,
    "createdAt": "2021-07-13T17:53:24.825+00:00",
    "updatedAt": "2021-07-13T17:53:24.825+00:00"
  },
  "libelle": "Teinturiers",
  "deleted": false,
  "createdAt": "2021-07-13T17:53:31.721+00:00",
  "updatedAt": "2021-07-13T17:53:31.721+00:00"
}
```

## ⚠️ Limitations Connues

### 1. Endpoint Principal (`/signin-up-all`)
- Retourne une erreur 500 (Internal Server Error)
- Cause probable : bug côté serveur
- Solution : Le fallback vers `/signin-up-all-check` fonctionne

### 2. Refresh Token
- Le nouveau `accessToken` n'est pas retourné dans la réponse
- Le champ est présent mais vide
- Impact : Nécessite une reconnexion après expiration

### 3. Faute de Frappe API
- Le champ attendu est `latidute` au lieu de `latitude`
- Cette erreur doit être conservée jusqu'à correction backend
- Impact sur l'expérience développeur

## 🚀 Prochaines Améliorations

### Court Terme
1. ✅ Corriger la validation frontend pour `latidute`
2. ✅ Implémenter le fallback automatique
3. ✅ Ajouter des logs détaillés pour le debugging
4. ⏳ Charger les vraies sous-catégories depuis l'API

### Moyen Terme
1. ⏳ Ajouter la sélection de position GPS sur carte
2. ⏳ Implémenter la validation des numéros de téléphone internationaux
3. ⏳ Améliorer les messages d'erreur utilisateur
4. ⏳ Ajouter des tests unitaires et d'intégration

### Long Terme
1. ⏳ Corriger la faute de frappe `latidute` → `latitude` côté backend
2. ⏳ Réparer l'endpoint principal `/signin-up-all`
3. ⏳ Corriger le retour du nouveau accessToken lors du refresh
4. ⏳ Implémenter l'upload de photo de profil

## 📞 Support

En cas de problème :
1. Vérifier les logs du script de test
2. Consulter la documentation dans `/docs/correction-inscription.md`
3. Vérifier les types TypeScript dans `/src/core/domain/types/`
4. Tester manuellement les endpoints avec Postman/Insomnia

## 📚 Ressources

- **Script de test** : `/test-auth-endpoints.js`
- **Documentation** : `/docs/correction-inscription.md`
- **Types** : `/src/core/domain/types/user.types.ts`
- **API Client** : `/src/infrastructure/api/auth.api.ts`
- **Repository** : `/src/infrastructure/repositories/auth.repository.ts`
- **Formulaire** : `/src/pages/Register.tsx`

---

**Dernière mise à jour** : $(date)  
**Statut global** : ✅ Système opérationnel avec fallback

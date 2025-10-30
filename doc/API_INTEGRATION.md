# Intégration API - ALONU

## 📋 Vue d'ensemble

Ce document décrit l'intégration de l'API Artisanat v8 dans l'application ALONU et les résultats de tests réels des endpoints clés (Admin, Artisan, Étudiant via "inscription_projets").

## 🔗 Endpoints Utilisés (v8 validés)

### Catégories
- `GET /categorie` - Récupération de toutes les catégories
- `GET /categorie/{id}` - Récupération d'une catégorie par ID
- `GET /categorie/search/{query}` - Recherche de catégories
- `GET /sous_categorie` - Récupération des sous-catégories
- `GET /sous_categorie/categorie/{id}` - Sous-catégories par catégorie

### Artisans
- `GET /artisans` - Récupération de tous les artisans
- `GET /artisans/{id}` - Récupération d'un artisan par ID
- `GET /artisans/search/{query}` - Recherche d'artisans
- `GET /artisans/categorie/{id}` - Artisans par catégorie
- `GET /artisans/sous_categorie/{id}` - Artisans par sous-catégorie
- `GET /artisans_pages/{page}` - Pagination des artisans
- `GET /artisans/search/page/{page}/{query}` - Recherche paginée

### Admin (utilisateurs)
- `POST /auth/signin` - Authentification (retourne accessToken)
- `GET /users_admin` - Utilisateurs administrateurs
- `GET /users_agent` - Utilisateurs agents
- `GET /users_not_deleted` - Utilisateurs non supprimés
- `GET /users_deleted` - Utilisateurs supprimés
- `GET /check_email_up/{email}` - Vérifie disponibilité email (bool)
- `GET /check_username_up/{username}` - Vérifie disponibilité username (bool)
- `PUT /users_current` - Mise à jour de l’utilisateur courant

### Étudiants (via inscriptions projets)
- `GET /inscription_projets_not_deleted` - Inscriptions non supprimées
- `GET /inscription_projets_pages/{page}` - Pagination des inscriptions
- `GET /search_inscription_projets/{page}/{term}` - Recherche paginée
- `GET /inscription_projets_count` - Compteur global d’inscriptions
- `GET /inscription_projets_by_cat/{categorieId}` - Filtrage par catégorie
- `POST /inscription_projets` - Création d’une inscription projet

## 🏗️ Architecture

### Structure des Dossiers
```
src/
├── infrastructure/
│   ├── api/
│   │   ├── api.client.ts          # Client HTTP générique
│   │   ├── category.api.ts        # Service API catégories
│   │   └── artisan.api.ts         # Service API artisans
│   ├── config/
│   │   ├── api.config.ts          # Configuration des endpoints
│   │   └── env.config.ts          # Configuration environnement
│   └── mappers/
│       ├── category.mapper.ts     # Mapping catégories API → Interface
│       └── artisan.mapper.ts      # Mapping artisans API → Interface
├── core/
│   └── services/
│       ├── category.service.ts    # Service métier catégories
│       └── artisan.service.ts     # Service métier artisans
└── hooks/
    ├── use-categories.ts          # Hook React catégories
    └── use-artisans.ts            # Hook React artisans
```

### Flux de Données
1. **Hook React** → Appel du service métier
2. **Service métier** → Appel du service API
3. **Service API** → Requête HTTP via client
4. **Mapper** → Transformation des données API vers interface
5. **Interface** → Affichage dans l'UI

## ✅ Résultats de tests (scripts)

Des scripts automatisés permettent de valider le fonctionnement effectif des endpoints et d’inspecter un échantillon de réponses.

### Exécution
```bash
# API distante (par défaut si non défini)
API_BASE_URL="http://51.75.162.85:8080/artisanat_v8/api" node scripts/test-admin-endpoints.js
API_BASE_URL="http://51.75.162.85:8080/artisanat_v8/api" node scripts/test-artisan-endpoints.js
API_BASE_URL="http://51.75.162.85:8080/artisanat_v8/api" node scripts/test-etudiant-endpoints.js
```

### Couverture confirmée
- Admin: login, listes (admins, agents, non-supprimés, supprimés), vérifications unicité (email/username), mise à jour profil courant.
- Artisan: listes globale, non-supprimés/supprimés, premium, pagination, recherche paginée, activation/désactivation en lot.
- Étudiant (inscription_projets): listes, pagination, recherche, compteur, filtrage par catégorie, création d’une inscription.

## 🔄 Mapping des Données

### Catégories
```typescript
// API Response
{
  "id": number,
  "nom": string,
  "description": string,
  "icone": string,
  "actif": boolean
}

// Interface Category
{
  id: string,           // API.id.toString()
  name: string,         // API.nom
  icon: string,         // API.icone (mappé vers nom d'icône)
  subcategories: string[] // Récupérées via sous_categorie
}
```

### Artisans
```typescript
// API Response
{
  "id": number,
  "nom": string,
  "prenom": string,
  "profession": string,
  "telephone": string,
  "whatsapp": string,
  "adresse": string,
  "latitude": number,
  "longitude": number,
  "description": string,
  "actif": boolean,
  "verifie": boolean,
  "note_moyenne": number,
  "nombre_avis": number
}

// Interface Artisan
{
  id: string,                    // API.id.toString()
  name: string,                  // API.nom + " " + API.prenom
  profession: string,            // API.profession
  category: string,              // Récupérée via relation
  distance: number,              // Calculée côté client
  rating: number,                // API.note_moyenne
  reviewCount: number,           // API.nombre_avis
  verified: boolean,             // API.verifie
  phone: string,                 // API.telephone (formaté)
  whatsapp: string,              // API.whatsapp (formaté)
  address: string,               // API.adresse
  latitude: number,              // API.latitude
  longitude: number,             // API.longitude
  description: string,           // API.description
  services: string[],            // Extraits de la description
  schedule: object,              // Valeurs par défaut
  reviews: object[]              // Vide (à implémenter)
}
```

## 🎯 Fonctionnalités Intégrées (UI)

### Page d'Accueil (Index.tsx)
- ✅ Affichage des catégories depuis l'API
- ✅ Affichage des artisans vedettes depuis l'API
- ✅ Gestion des états de chargement
- ✅ Fallback vers données mockées en cas d'erreur

### Page Catégories (CategoriesArtisans.tsx)
### Espace d’Administration
- `src/pages/admin/AdminLayout.tsx` – Layout et navigation admin
- `src/pages/admin/AdminUsers.tsx` – Tableau des utilisateurs admins (`GET /users_admin`)

- ✅ Affichage des catégories depuis l'API
- ✅ Filtrage des artisans par catégorie
- ✅ Recherche d'artisans
- ✅ Gestion des états de chargement
- ✅ Gestion des états vides
- ✅ Fallback vers données mockées en cas d'erreur

## ⚙️ Configuration

### Variables d'Environnement
```bash
# .env
VITE_API_BASE_URL=https://api.artisanat.tg
VITE_APP_NAME=ALONU
VITE_APP_VERSION=1.0.0
```

### Configuration par Défaut
Si `VITE_API_BASE_URL` n'est pas défini, l'application utilise `https://api.artisanat.tg` par défaut.

## 🔧 Gestion des Erreurs

### Stratégies de Fallback
1. **Erreur API** → Affichage des données mockées
2. **Timeout** → Retry automatique (à implémenter)
3. **Erreur réseau** → Message d'erreur utilisateur
4. **Données vides** → Message informatif

### Logging
- Toutes les erreurs sont loggées dans la console
- Messages d'erreur utilisateur appropriés
- Indicateurs de chargement pendant les requêtes

## 🚀 Utilisation

### Hooks React
```typescript
// Utilisation des catégories
const { categories, loading, error } = useCategories()

// Utilisation des artisans
const { artisans, loading, error } = useArtisans({
  categoryId: 1,
  active: true
})

// Recherche d'artisans
const { artisans, search, loading } = useArtisanSearch()
```

### Services Métier
```typescript
// Service catégories
const categories = await categoryService.getAllCategories()
const category = await categoryService.getCategoryById('1')

// Service artisans
const artisans = await artisanService.getAllArtisans()
const featuredArtisans = await artisanService.getFeaturedArtisans(8)
```

## 📝 Notes de Développement

### Cache
- Les catégories sont mises en cache après le premier chargement
- Les artisans sont mis en cache par paramètres de recherche
- Possibilité de vider le cache via `clearCache()`

### Performance
- Requêtes parallèles quand possible
- Lazy loading des données
- Pagination pour les grandes listes

### Sécurité
- Validation des données API
- Sanitisation des entrées utilisateur
- Gestion sécurisée des tokens (à implémenter)

## 🔮 Améliorations Futures

1. **Authentification** - Intégration des endpoints auth
2. **Cache avancé** - Redis ou localStorage
3. **Offline support** - Service Worker
4. **Tests** - Tests unitaires et d'intégration
5. **Monitoring** - Analytics et métriques
6. **PWA** - Progressive Web App features

## 🐛 Dépannage

### Problèmes Courants
1. **API non accessible** → Vérifier l'URL et la connectivité
2. **Données non affichées** → Vérifier les logs de la console
3. **Erreurs de mapping** → Vérifier la structure des données API
4. **Performance lente** → Vérifier le cache et les requêtes

### Debug
```typescript
// Activer les logs détaillés
localStorage.setItem('debug', 'api:*')

// Vérifier la configuration
console.log(ENV_CONFIG)
console.log(API_CONFIG)
```



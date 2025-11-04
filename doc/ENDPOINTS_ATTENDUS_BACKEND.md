# Endpoints Attendus par le Backend - Documentation Frontend

Ce document liste tous les endpoints que le frontend attend côté backend, organisés par fonctionnalité, avec leur contexte et format attendu.

---

## 📋 Table des matières

1. [Étudiant – Mes disponibilités](#étudiant--mes-disponibilités)
2. [Étudiant – Mes inscriptions](#étudiant--mes-inscriptions)
3. [Admin – Inscriptions des étudiants](#admin--inscriptions-des-étudiants)
4. [Artisan – Mes étudiants assignés](#artisan--mes-étudiants-assignés)
5. [Étudiant – Mon artisan](#étudiant--mon-artisan)
6. [Admin – Artisans](#admin--artisans)
7. [Vérifications (unicité)](#vérifications-unicité)
8. [Problème 401 et attentes d'authentification](#problème-401-et-attentes-dauthentification)

---

## Étudiant – Mes disponibilités

**Ce que l'app fait** : L'étudiant choisit ses jours, horaires, mois 

**Ce qu'il faut côté backend** : 2 routes simples

### 1. Récupérer mes disponibilités

- **Méthode** : `GET`
- **URL** : `/etudiants/{userId}/disponibilites`
- **Auth** : Bearer token requis (propriétaire ou admin)
- **Response attendue** :
```json
{
  "joursSemaine": ["LUN", "MER", "VEN"],
  "plagesHoraires": [
    { "debut": "08:00", "fin": "12:00" },
    { "debut": "14:00", "fin": "18:00" }
  ],
  "mois": [7, 8],
  "commentaire": "Disponible surtout le matin"
}
```
- **Si aucune donnée** : retourner `null` ou objet vide `{}`

### 2. Enregistrer/mettre à jour mes disponibilités

- **Méthode** : `PUT`
- **URL** : `/etudiants/{userId}/disponibilites`
- **Auth** : Bearer token requis (propriétaire ou admin)
- **Body attendu** :
```json
{
  "joursSemaine": ["LUN", "MER", "VEN"],
  "plagesHoraires": [
    { "debut": "08:00", "fin": "12:00" },
    { "debut": "14:00", "fin": "18:00" }
  ],
  "mois": [7, 8],
  "commentaire": "Disponible surtout le matin"
}
```
- **Response attendue** : même structure que GET (confirmation)

---

## Étudiant – Mes inscriptions

**Ce que l'app fait** : L'étudiant crée une inscription avec ses infos, ses domaines (spécialités) et ses disponibilités. Il ne choisit pas d'artisan.

**Ce qu'il faut côté backend** :

### 1. Créer une inscription (sans artisan)

- **Méthode** : `POST`
- **URL** : `/inscription_projets`
- **Auth** : Bearer token requis (étudiant connecté)
- **Body attendu** :
```json
{
  "nom": "Koffi",
  "prenom": "Jean",
  "telephone": "90 11 22 33",
  "niveauEtude": "Bac+2",
  
  "domainesIds": [1, 2, 5],
  "disponibilites": {
    "joursSemaine": ["LUN", "MER", "VEN"],
    "plagesHoraires": [
      { "debut": "08:00", "fin": "12:00" }
    ],
    "mois": [7, 8],
    
  },
  "fraisPayes": false
}
```
- **Response attendue** : L'inscription créée avec son `id`

### 2. Lister mes inscriptions (par utilisateur connecté)

- **Méthode** : `GET`
- **URL** : `/inscription_projets/by_user/{userId}`
- **Auth** : Bearer token requis (propriétaire ou admin)
- **Response attendue** : Tableau d'inscriptions
```json
[
  {
    "id": 1,
    "nom": "Koffi",
    "prenom": "Jean",
    "telephone": "90 11 22 33",
    "domaines": [{ "id": 1, "libelle": "Menuiserie" }],
    "disponibilites": { ... },
    "fraisPayes": true,
    "artisanId": 5
  }
]
```

---

## Admin – Inscriptions des étudiants

**Ce que l'app fait** : L'admin voit la liste (avec recherche/pagination), crée des inscriptions, assigne un artisan à un étudiant, et valide le paiement.

**Ce qu'il faut côté backend** :

### 1. Lister les inscriptions (toutes, par page, par recherche)

#### a. Liste paginée
- **Méthode** : `GET`
- **URL** : `/inscription_projets_pages/{page}`
- **Auth** : Bearer token requis (admin/agent)
- **Response attendue** : Tableau d'inscriptions

#### b. Recherche paginée
- **Méthode** : `GET`
- **URL** : `/search_inscription_projets/{page}/{term}`
- **Auth** : Bearer token requis (admin/agent)
- **Response attendue** : Tableau d'inscriptions filtrées

#### c. Total des inscriptions
- **Méthode** : `GET`
- **URL** : `/inscription_projets_count`
- **Auth** : Bearer token requis (admin/agent)
- **Response attendue** : `number` (total)

#### d. Par catégorie
- **Méthode** : `GET`
- **URL** : `/inscription_projets_by_cat/{categorieId}`
- **Auth** : Bearer token requis (admin/agent)
- **Response attendue** : Tableau d'inscriptions



### 3. Assigner un artisan à une inscription

- **Méthode** : `PUT`
- **URL** : `/inscription_projets/{inscriptionId}/assigner`
- **Auth** : Bearer token requis (admin/agent)
- **Body attendu** :
```json
{
  "artisanId": 123
}
```
- **Response attendue** : L'inscription mise à jour avec `artisanId`

### 4. Marquer "paiement approuvé" (avec une référence de paiement)

- **Méthode** : `PUT`
- **URL** : `/inscription_projets/{inscriptionId}/approuver_paiement`
- **Auth** : Bearer token requis (admin/agent)
- **Body attendu** :
```json
{
  "fraisReference": "REF-PAY-12345"
}
```
- **Effet attendu** : `fraisPayes = true`, `fraisReference` enregistré, champ `approvedAt` (date ISO)

---

## Artisan – Mes étudiants assignés

**Ce que l'app fait** : L'artisan voit les étudiants que l'admin lui a assignés.

**Ce qu'il faut côté backend** :

### Lister les inscriptions liées à l'artisan connecté

- **Méthode** : `GET`
- **URL** : `/inscription_projets/by_artisan/{artisanId}`
- **Auth** : Bearer token requis (artisan connecté ou admin)
- **Response attendue** : Tableau d'inscriptions avec `artisanId` correspondant
```json
[
  {
    "id": 1,
    "nom": "Koffi",
    "prenom": "Jean",
    "telephone": "90 11 22 33",
    "domaines": [...],
    "disponibilites": { ... },
    "fraisPayes": true,
    "artisanId": 123
  }
]
```

---

## Étudiant – Mon artisan

**Ce que l'app fait** : L'étudiant voit la fiche de son artisan et ses réalisations (photos/travaux).

**Ce qu'il faut côté backend** :

### 1. Détails d'un artisan (par id)

- **Méthode** : `GET`
- **URL** : `/artisans/{id}`
- **Auth** : Bearer token requis
- **Response attendue** : Objet artisan complet
```json
{
  "idArtisan": 123,
  "users": {
    "idUser": 456,
    "username": "artisan1",
    "email": "artisan@example.com",
    "nom": "Kouassi",
    "prenom": "Amah"
  },
  "telephone": "90 11 22 33",
  "adresse": "Quartier Tokoin, Lomé",
  "sousCategories": {
    "libelle": "Menuiserie"
  }
}
```

### 2. Lister les réalisations d'un artisan (titre, description, images, date)

- **Méthode** : `GET`
- **URL** : `/realisations_art/{artisanId}`
- **Auth** : Bearer token requis
- **Response attendue** : Tableau de réalisations
```json
[
  {
    "id": 1,
    "titre": "Table en bois massif",
    "description": "Table artisanale avec finition huile",
    "images": [
      "/uploads/realisation1-img1.jpg",
      "/uploads/realisation1-img2.jpg"
    ],
    "createdAt": "2024-01-15T10:00:00Z"
  }
]
```


---

## Admin – Artisans

**Ce que l'app fait** : Voir la liste des artisans (tous/actifs/supprimés), rechercher, paginer, et activer/désactiver en masse.

**Ce qu'il faut côté backend** :

### 1. Lister artisans (tous, actifs, supprimés)

#### a. Artisans actifs (non supprimés)
- **Méthode** : `GET`
- **URL** : `/artisans_not_deleted`
- **Auth** : Bearer token requis (admin/agent)
- **Response attendue** : Tableau d'artisans

#### b. Artisans supprimés
- **Méthode** : `GET`
- **URL** : `/artisans_deleted`
- **Auth** : Bearer token requis (admin/agent)
- **Response attendue** : Tableau d'artisans supprimés

#### c. Liste complète
- **Méthode** : `GET`
- **URL** : `/artisans`
- **Auth** : Bearer token requis (admin/agent)
- **Response attendue** : Tableau d'artisans

### 2. Liste par page + recherche

#### a. Pagination
- **Méthode** : `GET`
- **URL** : `/artisans_pages/{page}`
- **Auth** : Bearer token requis (admin/agent)
- **Response attendue** : Tableau d'artisans (10-20 par page)

#### b. Recherche paginée
- **Méthode** : `GET`
- **URL** : `/artisans_search_page/{page}/{term}`
- **Auth** : Bearer token requis (admin/agent)
- **Response attendue** : Tableau d'artisans filtrés

### 3. Activer / désactiver plusieurs artisans à la fois

#### a. Activer en lot
- **Méthode** : `PUT`
- **URL** : `/artisans_active`
- **Auth** : Bearer token requis (admin/agent)
- **Body attendu** : Tableau d'IDs
```json
[1, 2, 3, 5]
```
- **Response attendue** : Confirmation (200/201)

#### b. Désactiver en lot
- **Méthode** : `PUT`
- **URL** : `/artisans_desactive`
- **Auth** : Bearer token requis (admin/agent)
- **Body attendu** : Tableau d'IDs
```json
[1, 2, 3, 5]
```
- **Response attendue** : Confirmation (200/201)

### 4. Option : "derniers artisans premium"

- **Méthode** : `GET`
- **URL** : `/auth/artisans_last_premium`
- **Auth** : Bearer token requis (admin/agent)
- **Response attendue** : Tableau d'artisans premium (derniers créés)

---

## Vérifications (unicité)

**Ce que l'app fait** : Vérifier si email/username/téléphone/numéro d'enregistrement ne sont pas déjà utilisés (avant de soumettre).

**Ce qu'il faut côté backend** : De petites routes "vrai/faux" pour chaque vérification

### 1. Vérifier disponibilité username

- **Méthode** : `GET`
- **URL** : `/check_username_up/{username}`
- **Auth** : Optionnel (peut être public)
- **Response attendue** : `true` si disponible, `false` si déjà utilisé

### 2. Vérifier disponibilité email

- **Méthode** : `GET`
- **URL** : `/check_email_up/{email}`
- **Auth** : Optionnel (peut être public)
- **Response attendue** : `true` si disponible, `false` si déjà utilisé

### 3. Vérifier disponibilité téléphone

- **Méthode** : `GET`
- **URL** : `/check_telephone_up/{telephone}`
- **Auth** : Optionnel (peut être public)
- **Response attendue** : `true` si disponible, `false` si déjà utilisé

### 4. Vérifier disponibilité numéro d'enregistrement

- **Méthode** : `GET`
- **URL** : `/check_num_enr_up/{numeroEnr}`
- **Auth** : Optionnel (peut être public)
- **Response attendue** : `true` si disponible, `false` si déjà utilisé

---

## Problème 401 et attentes d'authentification

### Ce qui se passe actuellement

Le serveur refuse l'accès (erreur 401),

### Ce qu'on attend du backend

#### 1. Accepter partout "Authorization: Bearer {token}"

- **Format** : Header `Authorization: Bearer {token}`
- Tous les endpoints protégés doivent accepter ce format standard

#### 2. Donner un token de test valide et combien de temps il dure

- Fournir un token de test non expiré pour les tests
- Documenter la durée de vie du token (ex: 1 heure, 24 heures)
- Endpoint de refresh token : `/auth/refreshtoken`

#### 3. Autoriser l'origine du site (CORS) et les en-têtes nécessaires

- **Origine** : Autoriser l'origine du frontend (ex: `http://localhost:5173`, domaine de production)
- **Méthodes** : `GET`, `POST`, `PUT`, `DELETE`, `OPTIONS`
- **Headers** : `Authorization`, `Content-Type`, `Accept`

#### 4. Dire quels rôles (admin/agent/artisan/étudiant) sont autorisés sur chaque route

- Documenter ou implémenter la vérification de rôles côté backend
- Retourner `403 Forbidden` si le rôle n'a pas la permission

---

## Résumé des endpoints par priorité

### Priorité 1 (Fonctionnalités critiques)
1. ✅ GET `/etudiants/{userId}/disponibilites` - Disponibilités étudiant
2. ✅ PUT `/etudiants/{userId}/disponibilites` - Sauvegarde disponibilités
3. ✅ GET `/inscription_projets/by_user/{userId}` - Liste inscriptions étudiant
4. ✅ PUT `/inscription_projets/{id}/assigner` - Assignation artisan (admin)
5. ✅ PUT `/inscription_projets/{id}/approuver_paiement` - Validation paiement (admin)
6. ✅ GET `/inscription_projets/by_artisan/{artisanId}` - Étudiants assignés (artisan)
7. ✅ GET `/realisations_art/{artisanId}` - Réalisations artisan

### Priorité 2 (Améliorations)
- GET `/artisans_search_page/{page}/{term}` - Recherche artisans
- PUT `/artisans_active` et `/artisans_desactive` - Batch activation/désactivation

### Priorité 3 (Optionnel)
- GET `/auth/artisans_last_premium` - Artisans premium



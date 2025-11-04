# Intégration API - ALONU

## 📋 Vue d'ensemble

Ce document décrit l'intégration de l'API Artisanat v8 dans l'application ALONU et les résultats de tests réels des endpoints clés (Admin, Artisan, Étudiant via "inscription_projets").

## 🔐 Authentification & erreurs

- Tous les appels protégés envoient `Authorization: Bearer <accessToken>`.
- Le client `apiClient` gère le token et normalise les erreurs HTTP (parsing `apierror.subErrors`).

## 🔗 Endpoints Utilisés (v8 validés)

### Admin (utilisateurs)
- `POST /auth/signin` — Authentification (retourne accessToken)
- `GET /users_admin` — Liste administrateurs
- `GET /users_agent` — Liste agents
- `GET /users_not_deleted` — Utilisateurs non supprimés
- `GET /users_deleted` — Utilisateurs supprimés
- `GET /check_email_up/{email}` — Vérifie disponibilité email (bool)
- `GET /check_username_up/{username}` — Vérifie disponibilité username (bool)
- `PUT /users_current` — Mise à jour du profil courant `{ username?, email?, nom?, prenom? }`

UI: `/admin/users` (onglets Admin/Agents/Tous/Supprimés + formulaire “Profil courant” avec debounce sur vérifs d’unicité).

### Artisans
- `GET /artisans`, `GET /artisans_not_deleted`, `GET /artisans_deleted`
- `GET /artisans_pages/{page}`
- `GET /artisans_search_page/{page}/{term}`
- `GET /auth/artisans_last_premium` (max 8)
- `PUT /artisans_active` (body: `ids[]`) — activation en lot
- `PUT /artisans_desactive` (body: `ids[]`) — désactivation en lot

UI: `/admin/artisans` (onglets: Pagination / Non supprimés / Supprimés / Premium, recherche serveur, pagination serveur, actions en lot).

### Étudiants (inscription_projets)
- `GET /inscription_projets_not_deleted`
- `GET /inscription_projets_pages/{page}`
- `GET /search_inscription_projets/{page}/{term}`
- `GET /inscription_projets_count`
- `GET /inscription_projets_by_cat/{categorieId}`
- `POST /inscription_projets` (body: `{ sousCategories, telephone, nom, prenom, apport, niveauEtude }`)

UI: `/admin/etudiants/inscriptions` (pagination/recherche serveur, filtre catégorie, compteur, création avec reset après 201).

## 🏗️ Architecture (extraits)

```
src/
└─ infrastructure/
   └─ api/
      ├─ api.client.ts
      ├─ artisans.admin.api.ts
      ├─ inscriptions.api.ts
      └─ users.api.ts
```

## ✅ Résultats et scripts QA

Des scripts cURL sont fournis pour tester rapidement les endpoints (cf. `scripts/qa-*.sh`).

- Admin: listes (200), vérifs unicité (200 true/false), mise à jour profil (201 ou 200)
- Artisans: pagination/recherche (200), activation/désactivation en lot (201/200)
- Étudiants: listes/pagination/recherche/count/by_cat (200), création (201)



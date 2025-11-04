# 📊 Vue d'ensemble des Dashboards ALONU

Ce document décrit tous les dashboards créés pour les différents rôles (Admin, Artisan, Étudiant).

---

## 🔑 Admin Dashboards

### 1. Dashboard Utilisateurs
**Route**: `/admin/users`

**Fonctionnalités**:
- ✅ **Onglets multiples**:
  - Admins (GET `/users_admin`)
  - Agents (GET `/users_agent`)
  - Tous les utilisateurs (GET `/users_not_deleted`)
  - Utilisateurs supprimés (GET `/users_deleted`)
- ✅ **Tableau** avec colonnes:
  - ID, Username, Email, Nom, Prénom, Rôle, Actif
- ✅ **Formulaire "Profil courant"**:
  - Champs: Username, Email, Nom, Prénom
  - Vérifications d'unicité en live (debounce 400ms):
    - Email: GET `/check_email_up/{email}`
    - Username: GET `/check_username_up/{username}`
  - Mise à jour: PUT `/users_current`
  - Messages inline (disponible/déjà utilisé)

**États UI**:
- Loading, Error, Empty, Success

---

### 2. Dashboard Artisans
**Route**: `/admin/artisans`

**Fonctionnalités**:
- ✅ **Filtres rapides** (onglets):
  - Pagination (GET `/artisans_pages/{page}`)
  - Non supprimés (GET `/artisans_not_deleted`)
  - Supprimés (GET `/artisans_deleted`)
  - Premium (GET `/auth/artisans_last_premium`, max 8)
- ✅ **Recherche serveur**:
  - GET `/artisans_search_page/{page}/{term}` avec debounce 300ms
- ✅ **Pagination serveur**:
  - Boutons Précédent/Suivant
  - Page affichée (1-based côté API)
- ✅ **Tableau** avec colonnes:
  - Sélection (checkbox), ID, Utilisateur (username/email), Catégories, Téléphone, Actif
- ✅ **Actions en lot**:
  - Activer en lot: PUT `/artisans_active` (body: `ids[]`)
  - Désactiver en lot: PUT `/artisans_desactive` (body: `ids[]`)
  - Boutons désactivés si aucune sélection

**États UI**:
- Loading, Error, Empty, Bulk actions loading

---

### 3. Dashboard Étudiants/Inscriptions
**Route**: `/admin/etudiants/inscriptions`

**Fonctionnalités**:
- ✅ **Liste paginée**:
  - GET `/inscription_projets_pages/{page}` (pagination serveur)
  - GET `/search_inscription_projets/{page}/{term}` (recherche serveur avec debounce 300ms)
- ✅ **Compteur**:
  - GET `/inscription_projets_count` (affiché en haut)
- ✅ **Filtre par catégorie**:
  - Select dropdown → GET `/inscription_projets_by_cat/{categorieId}`
- ✅ **Tableau** avec colonnes:
  - ID, Nom, Prénom, Téléphone, Niveau d'étude, Apport, Domaines, Disponibilités, Paiement, **Actions**
- ✅ **Formulaire de création** (complet):
  - Infos personnelles: Nom, Prénom, Téléphone, Niveau d'étude, Apport
  - **Domaines multiselect**: Sous-catégories chargées depuis l'API
  - **Disponibilités avancées**:
    - Jours de la semaine (multiselect: LUN-DIM)
    - Plages horaires multiples (début-fin, ajout/suppression dynamique)
    - Mois (optionnel, multiselect 1-12)
    - Commentaire (texte libre)
  - **Paiement**:
    - Checkbox "Frais payés"
    - Référence paiement (optionnel, si payé)
  - POST `/inscription_projets` avec payload structuré
- ✅ **UI d'assignation** (colonnes Actions):
  - Bouton "Assigner" visible uniquement si `fraisPayes = true` ET `artisanId` absent
  - Modal inline: Select artisan + boutons Confirmer/Annuler
  - PUT `/inscription_projets/{id}/assigner` avec `{ artisanId }`
  - Affichage "Assigné" (vert) si déjà assigné, "Paiement requis" (gris) sinon

**États UI**:
- Loading, Error, Empty, Création loading, Assignation loading

---

## 🎨 Dashboard Artisan

### Mes Étudiants Assignés
**Route**: `/admin/artisans/mes-etudiants`

**Fonctionnalités**:
- ✅ **Liste filtrée** par artisan connecté:
  - GET `/inscription_projets/by_artisan/{artisanId}` (ou filtre côté client temporaire)
- ✅ **Recherche locale**:
  - Par nom, prénom, téléphone (filtre côté client)
- ✅ **Pagination** (côté client, 10 par page)
- ✅ **Tableau** avec colonnes:
  - ID, Nom, Prénom, Téléphone, Niveau d'étude, Domaines, Disponibilités, Paiement

**États UI**:
- Loading, Error, Empty

**Protection**:
- Accès réservé aux artisans connectés (filtré par `user.id`)

---

## 📚 Dashboard Étudiant

### Mes Inscriptions
**Routes**: `/mes-inscriptions` ou `/etudiant/inscriptions`

**Fonctionnalités**:
- ✅ **Liste filtrée** par étudiant connecté:
  - GET `/inscription_projets/by_user/{userId}` (ou filtre côté client temporaire)
- ✅ **Formulaire de création** (identique structure admin):
  - Infos personnelles: Nom, Prénom, Téléphone, Niveau d'étude, Apport
  - **Domaines multiselect**: Sous-catégories
  - **Disponibilités avancées**:
    - Jours de la semaine (LUN-DIM)
    - Plages horaires multiples
    - Mois (optionnel)
    - Commentaire
  - POST `/inscription_projets` avec `userId` auto-injecté
- ✅ **Tableau** avec colonnes:
  - ID, Nom, Prénom, Téléphone, Domaines, Disponibilités, Statut (Paiement + Assignation)

**États UI**:
- Loading, Error, Empty, Création loading

**Protection**:
- Redirection vers `/login` si non connecté
- Affiche uniquement SES inscriptions

---

## 🔒 Authentification & Protection

- Tous les dashboards utilisent `Authorization: Bearer {token}`
- Dashboard Étudiant: Protection route (redirection si non connecté)
- Dashboard Artisan: Filtrage par `user.id` (artisan connecté)
- Dashboard Admin: Nécessite token admin valide

---

## 📍 Routes Complètes

### Admin
- `/admin/users` → Dashboard Utilisateurs
- `/admin/artisans` → Dashboard Artisans (liste/pagination/recherche/actions lot)
- `/admin/artisans/mes-etudiants` → Mes Étudiants Assignés (pour artisan connecté)
- `/admin/etudiants/inscriptions` → Dashboard Inscriptions (liste/création/assignation)

### Étudiant
- `/mes-inscriptions` → Mes Inscriptions
- `/etudiant/inscriptions` → Mes Inscriptions (alias)

---

## 🎯 Fonctionnalités Clés

### Domaines de Formation
- Multiselect des sous-catégories
- Chargement asynchrone depuis API
- Stockage dans payload: `domainesIds: number[]`

### Disponibilités
- Structure:
  ```typescript
  {
    joursSemaine: string[], // ['LUN', 'MER', 'SAM']
    plagesHoraires: [{ debut: string, fin: string }],
    mois?: number[], // [1, 2, 3]
    commentaire?: string
  }
  ```
- UI: Jours checkbox, plages horaires multiples (ajout/suppression), mois optionnel, commentaire

### Paiement
- Flag unique: `fraisPayes: boolean`
- Référence optionnelle: `referencePaiement?: string`
- Condition assignation: `fraisPayes === true`

### Assignation
- Admin uniquement
- Condition: `fraisPayes === true`
- Endpoint: PUT `/inscription_projets/{id}/assigner` avec `{ artisanId }`

---

## ✅ Checklist de Fonctionnalités

### Admin
- [x] Listes utilisateurs (admins/agents/tous/supprimés)
- [x] Formulaire profil courant avec vérifications unicité
- [x] Liste artisans (pagination/recherche/filtres)
- [x] Actions en lot (activer/désactiver)
- [x] Liste inscriptions (pagination/recherche/filtre catégorie)
- [x] Formulaire création inscription (domaines/disponibilités/paiement)
- [x] UI assignation étudiant → artisan
- [x] Compteur inscriptions

### Artisan
- [x] Liste étudiants assignés
- [x] Recherche locale
- [x] Pagination

### Étudiant
- [x] Liste mes inscriptions
- [x] Formulaire création inscription (domaines/disponibilités)
- [x] Protection route (redirection si non connecté)

---

## 📝 Notes Techniques

- **Debounce**: 300-400ms sur recherches et vérifications
- **Pagination**: Serveur pour Admin, côté client pour Artisan/Étudiant (pourrait être serveur selon volumétrie)
- **Endpoints**: Tous préfixés par l'URL de base de l'API
- **Gestion erreurs**: Messages lisibles avec parsing `apierror.subErrors` si présent
- **États UI**: Loading, Error, Empty gérés partout

---

**Dernière mise à jour**: 2025-01-31  
**Version**: 1.0




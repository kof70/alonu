# 🎯 Dashboards par Rôle - ALONU

## 📋 Clarification des Rôles et Accès

### 1. Admin Système
**Rôle**: Administrateur global du système

**Dashboards accessibles**:
- ✅ `/admin/users` → Gestion de TOUS les utilisateurs (admins, agents, tous)
  - Voir/créer/modifier/supprimer des utilisateurs
  - **Profil courant** : Mettre à jour SON propre profil (username, email, nom, prénom)
- ✅ `/admin/artisans` → Gestion de TOUS les artisans
  - Voir/créer/modifier/supprimer des artisans
  - Activer/désactiver en lot
  - Voir premium, non supprimés, supprimés
- ✅ `/admin/etudiants/inscriptions` → Gestion de TOUTES les inscriptions
  - Voir toutes les inscriptions
  - Créer des inscriptions
  - **Assigner** un étudiant à un artisan (si frais payés)

**❌ N'accède PAS à**:
- Dashboard Artisan (mes étudiants assignés)
- Dashboard Étudiant (mes inscriptions)

---

### 2. Artisan
**Rôle**: Artisan connecté

**Dashboard accessible**:
- ✅ `/admin/artisans/mes-etudiants` → Voir SES étudiants assignés uniquement
  - Liste filtrée par artisan connecté
  - Voir les détails : nom, prénom, téléphone, domaines, disponibilités
  - **Pas de création/modification** - lecture seule

**❌ N'accède PAS à**:
- Dashboard Admin Utilisateurs
- Dashboard Admin Artisans (gestion globale)
- Dashboard Admin Inscriptions (gestion globale)
- Dashboard Étudiant

---

### 3. Étudiant
**Rôle**: Étudiant connecté

**Dashboard accessible**:
- ✅ `/mes-inscriptions` ou `/etudiant/inscriptions` → Voir SES inscriptions uniquement
  - Liste filtrée par étudiant connecté
  - **Créer** de nouvelles inscriptions
  - Voir le statut : paiement, assignation

**❌ N'accède PAS à**:
- Dashboard Admin (tous)
- Dashboard Artisan

---

## 🔐 Protection des Routes (à implémenter)

### Routes Admin (accès admin uniquement)
- `/admin/users`
- `/admin/artisans`
- `/admin/etudiants/inscriptions`

### Routes Artisan (accès artisan uniquement)
- `/admin/artisans/mes-etudiants`

### Routes Étudiant (accès étudiant uniquement)
- `/mes-inscriptions`
- `/etudiant/inscriptions`

---

## 📝 "Profil Courant" - Explication

**"Profil courant"** = Le profil de l'utilisateur connecté.

Dans le dashboard Admin Utilisateurs, il y a :
1. **Listes des utilisateurs** (tous les utilisateurs du système) - gestion globale
2. **Formulaire "Profil courant"** - pour que l'admin puisse mettre à jour SON propre profil

C'est une fonctionnalité séparée : l'admin peut gérer tous les utilisateurs ET mettre à jour son propre compte.

---

## ✅ Correction nécessaire

Actuellement, les routes ne sont pas protégées par rôle. Il faut ajouter :
1. Vérification du rôle dans chaque dashboard
2. Redirection vers `/login` si rôle non autorisé
3. Masquer les liens dans la sidebar selon le rôle




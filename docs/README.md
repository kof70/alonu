# 📚 Documentation ALONU - Dossier `/docs`

Bienvenue dans le dossier de documentation du projet **ALONU** - Plateforme de mise en relation pour artisans et étudiants au Togo.

## 📑 Index des Documents

### 🔧 Documentation Technique

| Document | Description | Public |
|----------|-------------|--------|
| [RESUME_CORRECTIONS.md](./RESUME_CORRECTIONS.md) | **À LIRE EN PREMIER** - Résumé simple des corrections d'inscription | Développeurs, PM |
| [correction-inscription.md](./correction-inscription.md) | Documentation détaillée des corrections d'inscription | Développeurs |
| [INSCRIPTION_TESTS.md](./INSCRIPTION_TESTS.md) | Guide complet de test du système d'inscription | QA, Développeurs |
| [API_INTEGRATION.md](./API_INTEGRATION.md) | Guide d'intégration de l'API backend | Développeurs Backend/Frontend |
| [INTEGRATION_GUIDE.md](./INTEGRATION_GUIDE.md) | Guide d'intégration générale du projet | Nouveaux développeurs |

### 📋 Documentation de Gestion

| Document | Description | Public |
|----------|-------------|--------|
| [AGENTS.md](./AGENTS.md) | Configuration des agents IA du projet | DevOps, Lead Dev |
| [INSTRUCTIONS.md](./INSTRUCTIONS.md) | Instructions générales du projet | Tous |
| [PREMIUM_ARTISANS_UPDATE.md](./PREMIUM_ARTISANS_UPDATE.md) | Mise à jour de la fonctionnalité artisans premium | Développeurs |

### 🔍 Autres Ressources

| Fichier | Description |
|---------|-------------|
| [windframe.html](./windframe.html) | Template HTML de référence |

## 🎯 Guides Rapides par Rôle

### Pour un Nouveau Développeur
1. Lire [INTEGRATION_GUIDE.md](./INTEGRATION_GUIDE.md) pour comprendre l'architecture
2. Lire [RESUME_CORRECTIONS.md](./RESUME_CORRECTIONS.md) pour voir les dernières corrections
3. Consulter [API_INTEGRATION.md](./API_INTEGRATION.md) pour l'intégration API

### Pour un Développeur Frontend
1. [RESUME_CORRECTIONS.md](./RESUME_CORRECTIONS.md) - Comprendre le formulaire d'inscription
2. [correction-inscription.md](./correction-inscription.md) - Détails techniques du formulaire
3. [API_INTEGRATION.md](./API_INTEGRATION.md) - Endpoints disponibles

### Pour un Testeur QA
1. [INSCRIPTION_TESTS.md](./INSCRIPTION_TESTS.md) - Guide complet de test
2. Utiliser `/test-auth-endpoints.js` pour les tests automatisés
3. [RESUME_CORRECTIONS.md](./RESUME_CORRECTIONS.md) - Comprendre les corrections

### Pour un Chef de Projet
1. [RESUME_CORRECTIONS.md](./RESUME_CORRECTIONS.md) - Vue d'ensemble des corrections
2. [PREMIUM_ARTISANS_UPDATE.md](./PREMIUM_ARTISANS_UPDATE.md) - Nouvelles fonctionnalités
3. [INTEGRATION_GUIDE.md](./INTEGRATION_GUIDE.md) - État général du projet

## 🔥 Mises à Jour Récentes

### Dernière Mise à Jour : Système d'Inscription ✅

**Problème résolu** : L'inscription des utilisateurs ne fonctionnait pas

**Cause** : Le backend attendait le champ `latidute` au lieu de `latitude`

**Solution** : 
- Correction du formulaire frontend
- Mise en place d'un système de fallback
- Tests automatisés validés à 100%

**Documents mis à jour** :
- ✅ [RESUME_CORRECTIONS.md](./RESUME_CORRECTIONS.md) - Nouveau document de synthèse
- ✅ [correction-inscription.md](./correction-inscription.md) - Documentation détaillée
- ✅ [INSCRIPTION_TESTS.md](./INSCRIPTION_TESTS.md) - Guide de test complet

**Statut** : ✅ **Système opérationnel**

## 🧪 Scripts de Test

| Script | Description | Commande |
|--------|-------------|----------|
| `test-auth-endpoints.js` | Test automatisé des endpoints d'authentification | `node test-auth-endpoints.js` |

### Tests API (Admin, Artisan, Étudiant)

Des scripts automatisés valident les endpoints réels de l’API (v8) et affichent un échantillon de réponses:

```bash
API_BASE_URL="http://51.75.162.85:8080/artisanat_v8/api" node scripts/test-admin-endpoints.js
API_BASE_URL="http://51.75.162.85:8080/artisanat_v8/api" node scripts/test-artisan-endpoints.js
API_BASE_URL="http://51.75.162.85:8080/artisanat_v8/api" node scripts/test-etudiant-endpoints.js
```

Couverture confirmée:
- Admin: login, listes (admins/agents/utilisateurs), vérification unicité email/username, mise à jour profil courant.
- Artisan: listes (globale, non-supprimés/supprimés, premium), pagination, recherche, activation/désactivation en lot.
- Étudiant: via `inscription_projets` (listes, pagination, recherche, count, filtre par catégorie, création).

Référence détaillée: voir `doc/API_INTEGRATION.md`.

## 📊 Architecture du Projet

```
/docs
├── README.md                      # Ce fichier
├── RESUME_CORRECTIONS.md          # ⭐ Résumé des corrections (à lire en premier)
├── correction-inscription.md      # Documentation détaillée inscription
├── INSCRIPTION_TESTS.md          # Guide de test complet
├── API_INTEGRATION.md            # Guide d'intégration API
├── INTEGRATION_GUIDE.md          # Guide d'intégration générale
├── PREMIUM_ARTISANS_UPDATE.md    # Fonctionnalité artisans premium
├── AGENTS.md                     # Configuration agents IA
├── INSTRUCTIONS.md               # Instructions générales
└── windframe.html                # Template HTML

/test-auth-endpoints.js           # Script de test (racine du projet)
```

## 🛠️ Technologies Documentées

### Frontend
- **React** + **TypeScript** + **Vite**
- **React Hook Form** + **Zod** (validation)
- **Shadcn/ui** (composants UI)
- **TailwindCSS** (styles)
- **React Router** (navigation)

### Backend (API)
- **URL de base** : `http://51.75.162.85:8080/artisanat_v8/api`
- **Authentication** : JWT (accessToken + refreshToken)
- **Format** : JSON
- **Endpoints principaux** :
  - `POST /auth/signin` - Connexion
  - `POST /auth/signin-up-all-check` - Inscription (fallback)
  - `POST /auth/refreshtoken` - Refresh token
  - `GET /sous_categorie_not_deleted` - Liste sous-catégories

### Architecture
- **Clean Architecture** (Domain, Use Cases, Infrastructure)
- **Repository Pattern**
- **Use Case Pattern**
- **Context API** (gestion d'état)

## 🔐 Endpoints API Documentés

Consultez [API_INTEGRATION.md](./API_INTEGRATION.md) pour la liste complète.

**Endpoints principaux** :

| Endpoint | Méthode | Description | Statut |
|----------|---------|-------------|--------|
| `/auth/signin` | POST | Connexion admin | ✅ OK |
| `/auth/signin_web` | POST | Connexion utilisateur | ✅ OK |
| `/auth/signin-up-all-check` | POST | Inscription (fallback) | ✅ OK |
| `/auth/refreshtoken` | POST | Refresh token | ✅ OK |
| `/sous_categorie_not_deleted` | GET | Sous-catégories | ✅ OK |

## 📝 Conventions de Documentation

### Format des Documents
- Tous les documents sont en **Markdown** (`.md`)
- Utilisation d'émojis pour la lisibilité
- Exemples de code avec coloration syntaxique
- Tableaux pour les données structurées

### Structure Type
1. **Titre principal** avec émoji
2. **Résumé** (TL;DR)
3. **Table des matières** (pour docs longs)
4. **Sections détaillées** avec sous-titres
5. **Exemples de code**
6. **Références** et liens

### Niveaux de Détail
- **RESUME_*.md** : Vue d'ensemble, simple, pour tous
- **Guide détaillé** : Technique, pour développeurs
- **Tests** : Scripts et procédures, pour QA

## 🤝 Contribution à la Documentation

### Ajouter une Nouvelle Documentation

1. **Créer le fichier** dans `/docs/` avec un nom explicite
2. **Suivre la structure type** (voir ci-dessus)
3. **Ajouter une entrée** dans ce README
4. **Mettre à jour** les liens dans les autres documents si nécessaire

### Mettre à Jour une Documentation

1. **Identifier** le document concerné
2. **Modifier** le contenu
3. **Mettre à jour** la date en bas du document
4. **Vérifier** les liens vers d'autres documents

### Conventions de Nommage

- `README.md` : Index général
- `RESUME_*.md` : Résumé pour tous
- `*-guide.md` : Guide technique
- `*_TESTS.md` : Documentation de test
- `UPPERCASE.md` : Documents importants

## 🔍 Recherche dans la Documentation

### Rechercher un Terme
```bash
# Dans tous les fichiers Markdown
grep -r "terme" docs/*.md

# Avec contexte
grep -C 3 "terme" docs/*.md
```

### Rechercher un Endpoint
```bash
# Chercher un endpoint API
grep -r "/auth/" docs/*.md
```

### Rechercher une Correction
```bash
# Chercher les corrections récentes
grep -r "latidute\|latitude" docs/*.md
```

## 📞 Support

### Questions Techniques
- Consulter d'abord [INTEGRATION_GUIDE.md](./INTEGRATION_GUIDE.md)
- Vérifier [API_INTEGRATION.md](./API_INTEGRATION.md)
- Consulter les logs dans `/test-auth-endpoints.js`

### Problèmes d'Inscription
- Lire [RESUME_CORRECTIONS.md](./RESUME_CORRECTIONS.md)
- Consulter [INSCRIPTION_TESTS.md](./INSCRIPTION_TESTS.md)
- Exécuter `node test-auth-endpoints.js`

### Problèmes API
- Vérifier [API_INTEGRATION.md](./API_INTEGRATION.md)
- Tester avec les collections Postman dans `/`
- Consulter les logs serveur

## 🎯 Roadmap Documentation

### Court Terme
- [ ] Documentation des composants UI
- [ ] Guide de déploiement
- [ ] Documentation de l'architecture backend
- [ ] Guide de contribution au code

### Moyen Terme
- [ ] Diagrammes d'architecture (UML, séquence)
- [ ] Documentation des hooks React personnalisés
- [ ] Guide de performance et optimisation
- [ ] Cas d'usage et user stories

### Long Terme
- [ ] Documentation API interactive (Swagger/OpenAPI)
- [ ] Tutoriels vidéo
- [ ] Wiki complet du projet
- [ ] Documentation multilingue (FR/EN)

## 🏆 Best Practices

### Documentation Code
- Commenter les parties complexes
- Types TypeScript documentés
- JSDoc pour les fonctions publiques

### Documentation Utilisateur
- Langage simple et clair
- Exemples concrets
- Screenshots si nécessaire

### Documentation Technique
- Précision et exhaustivité
- Exemples de code testés
- Références aux sources

## 📚 Ressources Externes

### Frameworks et Libraries
- [React Documentation](https://react.dev)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Vite Guide](https://vitejs.dev/guide/)
- [TailwindCSS Docs](https://tailwindcss.com/docs)
- [Shadcn/ui Components](https://ui.shadcn.com/)
- [React Hook Form](https://react-hook-form.com/)
- [Zod Validation](https://zod.dev/)

### Architecture
- [Clean Architecture](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html)
- [Repository Pattern](https://martinfowler.com/eaaCatalog/repository.html)

## 📝 Changelog Documentation

### 2024-XX-XX - Correction Inscription
- ✅ Ajout de `RESUME_CORRECTIONS.md`
- ✅ Ajout de `INSCRIPTION_TESTS.md`
- ✅ Mise à jour de `correction-inscription.md`
- ✅ Ajout de ce README

### Historique
Consulter les commits Git pour l'historique complet :
```bash
git log --oneline -- docs/
```

---

**Dernière mise à jour** : $(date '+%Y-%m-%d')  
**Mainteneur** : Équipe de développement ALONU  
**Version** : 1.0


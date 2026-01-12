# 📝 Templates de Tickets par Projet

Ce document fournit des templates de tickets prêts à utiliser pour démarrer rapidement chaque projet.

---

## PROJET 1: Infrastructure & Auth

### Backend Tickets

#### [P1-BE-001] Setup serveur Express TypeScript
**Description:**
Créer la structure de base du serveur Express avec TypeScript, middleware essentiels et gestion d'erreurs.

**Critères d'acceptation:**
- [ ] Serveur démarre sur PORT configuré
- [ ] Middleware CORS, Helmet, Compression configurés
- [ ] Morgan pour logging
- [ ] Health check endpoint `/health` fonctionnel
- [ ] Gestion d'erreurs globale
- [ ] Variables d'environnement chargées

**Estimation:** 4h

---

#### [P1-BE-002] Configuration Prisma + PostgreSQL
**Description:**
Configurer Prisma ORM avec PostgreSQL et créer le modèle User initial.

**Critères d'acceptation:**
- [ ] Prisma installé et configuré
- [ ] Connexion PostgreSQL établie
- [ ] Schema User avec role créé
- [ ] Migration initiale créée
- [ ] Prisma Client généré
- [ ] Seed script basique

**Estimation:** 3h

---

#### [P1-BE-003] Service d'authentification JWT
**Description:**
Implémenter la logique d'authentification avec JWT (access + refresh tokens).

**Critères d'acceptation:**
- [ ] Fonction génération access token
- [ ] Fonction génération refresh token
- [ ] Fonction validation token
- [ ] Fonction refresh token
- [ ] Stockage refresh tokens (Redis ou DB)
- [ ] Tests unitaires

**Estimation:** 6h

---

#### [P1-BE-004] API Endpoints Auth
**Description:**
Créer les routes d'authentification (register, login, refresh, logout).

**Critères d'acceptation:**
- [ ] POST `/api/auth/register` - inscription
- [ ] POST `/api/auth/login` - connexion
- [ ] POST `/api/auth/refresh` - refresh token
- [ ] POST `/api/auth/logout` - déconnexion
- [ ] Validation Zod des inputs
- [ ] Hashing bcrypt des passwords
- [ ] Tests d'intégration

**Estimation:** 8h

---

#### [P1-BE-005] Middleware authentification
**Description:**
Créer middleware pour protéger les routes et vérifier les rôles.

**Critères d'acceptation:**
- [ ] Middleware `authenticate` vérifie JWT
- [ ] Middleware `authorize([roles])` vérifie rôles
- [ ] Gestion erreurs 401/403
- [ ] Injection user dans req
- [ ] Tests unitaires

**Estimation:** 4h

---

### Frontend Tickets

#### [P1-FE-001] Configuration React Router
**Description:**
Setup routing avec routes publiques et protégées.

**Critères d'acceptation:**
- [ ] React Router v6 configuré
- [ ] Routes publiques (/, /login, /register)
- [ ] Routes protégées (/dashboard, /profile)
- [ ] Composant ProtectedRoute
- [ ] Redirect vers login si non auth

**Estimation:** 3h

---

#### [P1-FE-002] Store Auth (Zustand)
**Description:**
Créer store global pour gérer l'état d'authentification.

**Critères d'acceptation:**
- [ ] Store Zustand créé
- [ ] State: user, tokens, isAuthenticated
- [ ] Actions: login, logout, refresh
- [ ] Persistence localStorage
- [ ] Hook useAuth personnalisé

**Estimation:** 4h

---

#### [P1-FE-003] Pages Auth UI
**Description:**
Créer les pages Login, Register, Forgot Password avec formulaires.

**Critères d'acceptation:**
- [ ] Page Login avec form email/password
- [ ] Page Register avec form complet
- [ ] Page Forgot Password
- [ ] Validation côté client
- [ ] Messages d'erreur
- [ ] Loading states
- [ ] Responsive mobile

**Estimation:** 8h

---

#### [P1-FE-004] Client API Auth
**Description:**
Créer service API avec interceptors Axios pour JWT.

**Critères d'acceptation:**
- [ ] Instance Axios configurée
- [ ] Interceptor request (ajout token)
- [ ] Interceptor response (refresh auto)
- [ ] Fonctions: register, login, logout, refresh
- [ ] Gestion erreurs réseau

**Estimation:** 5h

---

## PROJET 2: Gestion des Voies

### Backend Tickets

#### [P2-BE-001] Migration Prisma Route model
**Description:**
Créer le modèle Route dans Prisma schema.

**Critères d'acceptation:**
- [ ] Model Route complet
- [ ] Relations User (opener)
- [ ] Enums RouteStatus
- [ ] Migration créée et appliquée
- [ ] Types générés

**Estimation:** 2h

---

#### [P2-BE-002] Service Upload Cloudinary
**Description:**
Implémenter service upload photos/vidéos vers Cloudinary.

**Critères d'acceptation:**
- [ ] Configuration Cloudinary
- [ ] Fonction upload photo
- [ ] Fonction upload vidéo
- [ ] Génération thumbnails
- [ ] Compression automatique
- [ ] Gestion erreurs
- [ ] Tests

**Estimation:** 6h

---

#### [P2-BE-003] API CRUD Routes
**Description:**
Créer endpoints CRUD pour les voies.

**Critères d'acceptation:**
- [ ] GET `/api/routes` - liste (public)
- [ ] GET `/api/routes/:id` - détail (public)
- [ ] POST `/api/routes` - création (OPENER)
- [ ] PUT `/api/routes/:id` - update (OPENER owner)
- [ ] DELETE `/api/routes/:id` - delete (ADMIN)
- [ ] Validation Zod
- [ ] Filtres (grade, color, sector)
- [ ] Pagination
- [ ] Tests

**Estimation:** 10h

---

#### [P2-BE-004] Workflow Validation Admin
**Description:**
Implémenter système de validation des voies par admin.

**Critères d'acceptation:**
- [ ] PUT `/api/routes/:id/status` (ADMIN)
- [ ] Statuts: PENDING, ACTIVE, ARCHIVED
- [ ] Validation auto après X jours (optional)
- [ ] Notification opener
- [ ] Tests

**Estimation:** 4h

---

### Frontend Tickets

#### [P2-FE-001] Page Hub des Voies
**Description:**
Créer la page principale listant toutes les voies.

**Critères d'acceptation:**
- [ ] Grid responsive de RouteCard
- [ ] Filtres sidebar
- [ ] Pagination
- [ ] Loading skeleton
- [ ] Empty state
- [ ] Tri (date, grade, popularité)

**Estimation:** 8h

---

#### [P2-FE-002] Composant RouteCard
**Description:**
Créer carte affichant une voie dans la liste.

**Critères d'acceptation:**
- [ ] Photo principale
- [ ] Nom, grade, couleur
- [ ] Secteur
- [ ] Nombre validations
- [ ] Date d'ouverture
- [ ] Badge statut
- [ ] Hover effects
- [ ] Click → détail

**Estimation:** 4h

---

#### [P2-FE-003] Page Détail Voie
**Description:**
Page complète d'une voie avec toutes ses infos.

**Critères d'acceptation:**
- [ ] Photo + vidéo d'ouverture
- [ ] Infos complètes (grade, couleur, secteur, description, tips)
- [ ] Info ouvreur
- [ ] Bouton validation
- [ ] Section commentaires
- [ ] Galerie photos (si P5 fait)
- [ ] Breadcrumb navigation

**Estimation:** 8h

---

#### [P2-FE-004] Formulaire Création/Édition Voie
**Description:**
Form complet pour créer ou éditer une voie (OPENER).

**Critères d'acceptation:**
- [ ] Tous les champs (nom, grade, couleur, etc.)
- [ ] Upload photo principale
- [ ] Upload vidéo (optional)
- [ ] Preview uploads
- [ ] Validation formulaire
- [ ] Submit avec loading
- [ ] Messages succès/erreur
- [ ] Mode création + édition

**Estimation:** 10h

---

#### [P2-FE-005] Composant MediaUploader
**Description:**
Composant réutilisable pour upload de médias.

**Critères d'acceptation:**
- [ ] Drag & drop
- [ ] Click to upload
- [ ] Preview image/vidéo
- [ ] Progress bar
- [ ] Validation type/taille
- [ ] Remove uploaded
- [ ] Multiple files (optional)

**Estimation:** 6h

---

## PROJET 3: Fonctionnalités Sociales

### Backend Tickets

#### [P3-BE-001] Migrations Validation & Comment
**Description:**
Créer modèles Validation et Comment dans Prisma.

**Critères d'acceptation:**
- [ ] Model Validation avec relation User/Route
- [ ] Model Comment avec relation User/Route
- [ ] Unique constraint userId+routeId pour Validation
- [ ] Enum MediaType pour Comment
- [ ] Migrations appliquées

**Estimation:** 2h

---

#### [P3-BE-002] API Validations
**Description:**
Endpoints pour valider/invalider une voie.

**Critères d'acceptation:**
- [ ] POST `/api/routes/:id/validate` - valider
- [ ] DELETE `/api/routes/:id/validate` - invalider
- [ ] GET `/api/routes/:id/validations` - liste
- [ ] Toggle si déjà validé
- [ ] Compteur validations route
- [ ] Tests

**Estimation:** 5h

---

#### [P3-BE-003] API Comments
**Description:**
CRUD complet pour les commentaires.

**Critères d'acceptation:**
- [ ] POST `/api/routes/:id/comments` - créer
- [ ] PUT `/api/comments/:id` - éditer (author)
- [ ] DELETE `/api/comments/:id` - supprimer (author/ADMIN)
- [ ] GET `/api/routes/:id/comments` - liste paginée
- [ ] Upload média dans commentaire
- [ ] Tests

**Estimation:** 7h

---

#### [P3-BE-004] API User Profile & Stats
**Description:**
Endpoints profil utilisateur et statistiques.

**Critères d'acceptation:**
- [ ] GET `/api/users/:id` - profil public
- [ ] PUT `/api/users/:id` - update profil
- [ ] GET `/api/users/:id/stats` - stats
- [ ] Stats: nb validations, par grade, progression
- [ ] Upload avatar
- [ ] Tests

**Estimation:** 8h

---

### Frontend Tickets

#### [P3-FE-001] Composant ValidationButton
**Description:**
Bouton pour valider/invalider une voie avec compteur.

**Critères d'acceptation:**
- [ ] État non validé / validé
- [ ] Toggle au click
- [ ] Compteur validations
- [ ] Animation feedback
- [ ] Modal confirmation (optional)
- [ ] Loading state

**Estimation:** 4h

---

#### [P3-FE-002] Section Commentaires
**Description:**
Liste des commentaires avec formulaire ajout.

**Critères d'acceptation:**
- [ ] Liste commentaires paginée
- [ ] Tri chronologique
- [ ] Formulaire ajout
- [ ] Upload média dans comment
- [ ] Edit/delete (author)
- [ ] Avatar + nom user
- [ ] Timestamp relative

**Estimation:** 8h

---

#### [P3-FE-003] Page Profil Utilisateur
**Description:**
Page profil avec stats et activité.

**Critères d'acceptation:**
- [ ] Avatar, nom, bio
- [ ] Stats: voies validées, par grade
- [ ] Graphique progression
- [ ] Liste dernières validations
- [ ] Badge rôle (OPENER, ADMIN)
- [ ] Bouton éditer (si own profile)

**Estimation:** 10h

---

#### [P3-FE-004] Formulaire Édition Profil
**Description:**
Form pour modifier son profil.

**Critères d'acceptation:**
- [ ] Champs: nom, bio, email
- [ ] Upload avatar
- [ ] Preview avatar
- [ ] Validation formulaire
- [ ] Save avec feedback
- [ ] Change password (link)

**Estimation:** 6h

---

## PROJET 4: Polish & Déploiement

### Testing Tickets

#### [P4-TEST-001] Tests E2E - Parcours Auth
**Description:**
Tests end-to-end du parcours d'authentification.

**Critères d'acceptation:**
- [ ] Test inscription complète
- [ ] Test login réussi
- [ ] Test login échoué
- [ ] Test logout
- [ ] Test refresh token
- [ ] Tests passent en CI

**Estimation:** 6h

---

#### [P4-TEST-002] Tests E2E - Parcours Voie
**Description:**
Tests création et consultation de voie.

**Critères d'acceptation:**
- [ ] Test création voie OPENER
- [ ] Test upload photo/vidéo
- [ ] Test consultation liste voies
- [ ] Test filtres
- [ ] Test détail voie
- [ ] Tests passent en CI

**Estimation:** 8h

---

#### [P4-TEST-003] Tests E2E - Interactions Sociales
**Description:**
Tests validation et commentaires.

**Critères d'acceptation:**
- [ ] Test validation voie
- [ ] Test invalidation voie
- [ ] Test ajout commentaire
- [ ] Test édition commentaire
- [ ] Test suppression commentaire
- [ ] Tests passent en CI

**Estimation:** 6h

---

### Optimization Tickets

#### [P4-OPT-001] Optimisation Requêtes Prisma
**Description:**
Optimiser les requêtes database pour performance.

**Critères d'acceptation:**
- [ ] Includes optimisés (éviter N+1)
- [ ] Selects ciblés
- [ ] Indexes sur colonnes fréquentes
- [ ] Pagination efficace
- [ ] Query time < 100ms (P95)

**Estimation:** 5h

---

#### [P4-OPT-002] Cache Redis
**Description:**
Implémenter cache Redis pour routes populaires.

**Critères d'acceptation:**
- [ ] Cache liste routes (TTL 5min)
- [ ] Cache détail route (TTL 10min)
- [ ] Invalidation lors update
- [ ] Fallback si Redis down
- [ ] Monitoring hit rate

**Estimation:** 6h

---

#### [P4-OPT-003] Optimisation Frontend
**Description:**
Bundle size, lazy loading, code splitting.

**Critères d'acceptation:**
- [ ] Code splitting par route
- [ ] Lazy loading images
- [ ] Tree shaking
- [ ] Bundle size < 300kb
- [ ] Lighthouse score > 90

**Estimation:** 6h

---

### DevOps Tickets

#### [P4-OPS-001] CI/CD Pipeline
**Description:**
Setup GitHub Actions pour CI/CD complet.

**Critères d'acceptation:**
- [ ] Lint sur chaque PR
- [ ] Tests sur chaque PR
- [ ] Build sur chaque PR
- [ ] Deploy auto sur merge main
- [ ] Rollback si deploy fail

**Estimation:** 8h

---

#### [P4-OPS-002] Déploiement Frontend (Vercel)
**Description:**
Déployer frontend sur Vercel.

**Critères d'acceptation:**
- [ ] Compte Vercel configuré
- [ ] Projet importé depuis Git
- [ ] Variables env configurées
- [ ] Domain custom (optional)
- [ ] SSL actif
- [ ] Preview deploys sur PR

**Estimation:** 3h

---

#### [P4-OPS-003] Déploiement Backend (Railway)
**Description:**
Déployer API + DB + Redis sur Railway.

**Critères d'acceptation:**
- [ ] Service API déployé
- [ ] PostgreSQL provisionné
- [ ] Redis provisionné
- [ ] Variables env configurées
- [ ] Health checks configurés
- [ ] Logs accessibles

**Estimation:** 4h

---

#### [P4-OPS-004] Monitoring (Sentry)
**Description:**
Setup Sentry pour tracking erreurs.

**Critères d'acceptation:**
- [ ] Sentry frontend configuré
- [ ] Sentry backend configuré
- [ ] Source maps uploadés
- [ ] Alerts configurées
- [ ] Integration Slack (optional)

**Estimation:** 3h

---

### Documentation Tickets

#### [P4-DOC-001] Documentation API (Swagger)
**Description:**
Générer documentation API interactive.

**Critères d'acceptation:**
- [ ] Swagger/OpenAPI configuré
- [ ] Tous les endpoints documentés
- [ ] Schémas request/response
- [ ] Exemples
- [ ] Try it out fonctionnel
- [ ] Déployé publiquement

**Estimation:** 6h

---

#### [P4-DOC-002] Guide Développeur
**Description:**
Documentation pour nouveaux développeurs.

**Critères d'acceptation:**
- [ ] Setup environnement
- [ ] Architecture expliquée
- [ ] Conventions code
- [ ] Guide contribution
- [ ] Troubleshooting FAQ

**Estimation:** 4h

---

## Template Générique de Ticket

```markdown
### [PX-XX-000] Titre du Ticket

**Type:** Feature / Bug / Improvement / Docs / Test

**Projet:** PX - Nom du Projet

**Priorité:** P0 (Critique) / P1 (Haute) / P2 (Moyenne) / P3 (Basse)

**Description:**
[Description détaillée de ce qui doit être fait]

**Contexte:**
[Pourquoi c'est nécessaire, contexte business/technique]

**Critères d'acceptation:**
- [ ] Critère 1
- [ ] Critère 2
- [ ] Critère 3

**Tâches techniques:**
1. Tâche 1
2. Tâche 2
3. Tâche 3

**Dépendances:**
- Ticket #XXX doit être complété avant
- API endpoint X doit être disponible

**Estimation:** Xh (Story points: X)

**Assigné à:** [Nom]

**Labels:** `backend`, `frontend`, `p1`, `feature`

**Notes:**
[Informations supplémentaires, liens, ressources]
```

---

## Bonnes Pratiques

### Rédaction de Tickets
- Titre clair et actionnable (verbe à l'infinitif)
- Description concise mais complète
- Critères d'acceptation mesurables
- Estimation réaliste
- Labels appropriés

### Workflow
1. **To Do** → Ticket créé, non assigné
2. **In Progress** → Développement en cours
3. **In Review** → Code review demandée
4. **Testing** → En QA/test
5. **Done** → Merged et déployé

### Definition of Done
- [ ] Code écrit et testé localement
- [ ] Tests unitaires/intégration écrits
- [ ] Code review approuvée
- [ ] Documentation à jour
- [ ] CI/CD passe
- [ ] Déployé en staging et testé
- [ ] Critères d'acceptation validés

---

*Ces templates sont à adapter selon vos besoins et processus.*

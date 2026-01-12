# 🗺️ Roadmap ClimbTracker

Vue d'ensemble visuelle du développement de ClimbTracker.

---

## Phase 1: MVP (8 semaines) - Production Q2 2026

### ✅ PROJET 1: Infrastructure & Auth (Semaines 1-2)
```
Backend          Frontend         DevOps
├─ Express       ├─ React Router  ├─ Docker Compose
├─ PostgreSQL    ├─ Pages Auth    ├─ CI/CD
├─ Prisma        ├─ Auth Store    └─ Seeds
├─ JWT           └─ Protected Routes
└─ Auth API
```
**Valeur:** Fondation technique solide

---

### 🧗 PROJET 2: Gestion des Voies (Semaines 3-4)
```
Backend              Frontend
├─ Routes CRUD       ├─ Hub des voies
├─ Upload Cloudinary ├─ Détail voie
├─ Validation Admin  ├─ Formulaires CRUD
└─ Media Processing  └─ Filtres basiques
```
**Valeur:** Ouvreurs peuvent créer des voies

---

### 💬 PROJET 3: Fonctionnalités Sociales (Semaines 5-6)
```
Backend              Frontend
├─ Validations API   ├─ Bouton validation
├─ Comments API      ├─ Section commentaires
├─ User Stats        └─ Page profil
└─ Profils API
```
**Valeur:** Grimpeurs peuvent interagir avec les voies

---

### 🚀 PROJET 4: Polish & Déploiement (Semaines 7-8)
```
Testing          Optimization      Deploy
├─ E2E Tests     ├─ Performance    ├─ Vercel (Frontend)
├─ Integration   ├─ SEO            ├─ Railway (Backend)
└─ Unit Tests    ├─ A11y           ├─ Sentry
                 └─ Caching        └─ Analytics
```
**Valeur:** Application stable en production

---

## Phase 2: Enrichissement (6 semaines) - Q3 2026

### 📸 PROJET 5: Médias & Recherche (Semaines 9-11)
```
Features
├─ Galeries photos/vidéos
├─ Upload multiple
├─ Recherche full-text
├─ Filtres avancés combinés
└─ Suggestions auto-complete
```
**Valeur:** Expérience utilisateur enrichie

---

### 🔔 PROJET 6: Engagement & Notifications (Semaines 12-14)
```
Features
├─ Notifications real-time
├─ Stats avancées
├─ Graphiques progression
├─ Calendrier activité
└─ PWA notifications
```
**Valeur:** Augmentation rétention utilisateurs

---

## Phase 3: Intelligence Artificielle (8 semaines) - Q4 2026

### 🎯 PROJET 7: Détection des Prises (Semaines 15-18)
```
ML/IA
├─ Dataset 100+ images
├─ Segmentation couleur HSV
├─ Détection contours OpenCV
├─ Classification types
└─ Export TensorFlow.js

Features
├─ Détection auto prises
├─ Annotation manuelle
├─ Visualisation overlay
└─ Correction interactive
```
**Valeur:** Mapping automatique des voies

---

### 🤖 PROJET 8: Analyse Mouvement (Semaines 19-22)
```
ML/IA
├─ MediaPipe Pose + Hands
├─ Calcul métriques
├─ Algorithme scoring (5 critères)
├─ Génération suggestions
└─ Détection patterns

Features
├─ Upload vidéo analyse
├─ Score global + détaillés
├─ Timeline highlights
├─ Suggestions personnalisées
└─ Comparaison vidéos
```
**Valeur:** Coaching IA personnalisé

---

## 📊 Effort Estimé

| Phase | Projets | Durée | FTE* |
|-------|---------|-------|------|
| Phase 1 (MVP) | P1-P4 | 8 sem | 4-5 |
| Phase 2 (Enrichissement) | P5-P6 | 6 sem | 4 |
| Phase 3 (IA) | P7-P8 | 8 sem | 4-5 |
| **Total** | **8 projets** | **22 sem** | **~5 mois** |

*Full-Time Equivalent

---

## 🎯 Jalons Clés

| Date | Jalon | Livrable |
|------|-------|----------|
| Fin S2 | MVP Foundation | Auth fonctionnel |
| Fin S4 | MVP Core | CRUD voies complet |
| Fin S6 | MVP Social | Validations + Commentaires |
| Fin S8 | **🚀 LAUNCH v1.0** | **MVP en production** |
| Fin S11 | v1.1 | Médias & Recherche |
| Fin S14 | v1.2 | Notifications & Stats |
| Fin S18 | v2.0 Beta | Détection prises |
| Fin S22 | **🤖 v2.0 GA** | **IA complète** |

---

## 💡 Approche de Développement

### Itératif & Incrémental
```
P1 ──> P2 ──> P3 ──> P4
 │      │      │      │
 └──────┴──────┴──────┘
         MVP v1.0
              │
        ┌─────┴─────┐
        │           │
       P5          P6
        │           │
        └─────┬─────┘
           v1.1-1.2
              │
        ┌─────┴─────┐
        │           │
       P7          P8
        │           │
        └─────┬─────┘
           v2.0
```

### Chaque projet est:
- ✅ **Indépendant** (peut être développé seul)
- ✅ **Déployable** (apporte de la valeur)
- ✅ **Testable** (critères succès clairs)
- ✅ **Mesurable** (métriques définies)

---

## 🔀 Alternatives de Priorisation

### Option A: Lancement Rapide (Recommandé)
```
Priorité: P1 → P2 → P3 → P4
Timeline: 8 semaines
Objectif: MVP en production rapidement
```

### Option B: Focus Communauté
```
Priorité: P1 → P2 → P3 → P6 → P4 → P5
Timeline: 12 semaines
Objectif: Engagement maximal dès le début
```

### Option C: Différenciation IA
```
Priorité: P1 → P2 → P7 → P3 → P4
Timeline: 12 semaines
Objectif: Feature unique (détection prises) early
```

---

## 📈 Métriques de Succès par Phase

### Phase 1 (MVP)
- 100+ utilisateurs inscrits
- 50+ voies créées
- 200+ validations
- NPS > 40

### Phase 2 (Enrichissement)
- 500+ utilisateurs actifs
- 300+ voies
- 50+ uploads média/semaine
- Rétention J30 > 30%

### Phase 3 (IA)
- 100+ analyses IA utilisées
- Score satisfaction IA > 4/5
- 80%+ précision détection
- 1000+ utilisateurs actifs

---

## ⚠️ Risques & Mitigation

| Risque | Impact | Probabilité | Mitigation |
|--------|--------|-------------|------------|
| Retard Phase 1 | Haut | Moyen | Buffer 2 semaines inclus |
| Précision IA < 80% | Moyen | Moyen | Annotation manuelle fallback |
| Scaling issues | Haut | Faible | Architecture scalable dès P1 |
| Complexité MediaPipe | Moyen | Moyen | POC avant P8 |
| Coûts stockage | Moyen | Faible | Compression + CDN |

---

## 🎓 Skills Requis par Phase

### Phase 1 (MVP)
- React + TypeScript
- Node.js + Express
- PostgreSQL + Prisma
- Docker
- JWT Auth

### Phase 2
- WebSockets (real-time)
- Chart.js (visualisations)
- PWA
- Email notifications

### Phase 3
- TensorFlow.js
- MediaPipe
- OpenCV
- Computer Vision
- ML Engineering

---

## 🛠️ Stack Technique par Projet

```
P1-P4 (MVP)
├─ Frontend: React, Vite, Tailwind, React Query
├─ Backend: Express, Prisma, PostgreSQL, Redis
├─ Auth: JWT, bcrypt
└─ Deploy: Vercel, Railway

P5-P6 (Enrichissement)
├─ +Search: PostgreSQL full-text
├─ +Real-time: WebSockets
├─ +Queue: Bull
└─ +Analytics: Posthog

P7-P8 (IA)
├─ +ML: TensorFlow.js, MediaPipe
├─ +CV: OpenCV.js
├─ +Processing: FFmpeg
└─ +Storage: Cloudinary
```

---

## 📞 Points de Contact

- **Product Owner:** Définition features
- **Tech Lead:** Architecture & reviews
- **Backend Lead:** API & database
- **Frontend Lead:** UI/UX
- **ML Engineer:** Projets 7-8

---

## 🔄 Prochaines Actions

1. [ ] Valider roadmap avec stakeholders
2. [ ] Constituer équipe P1
3. [ ] Setup environnement dev
4. [ ] Kickoff P1 (Infrastructure & Auth)
5. [ ] Premier sprint planning

---

**Date de mise à jour:** 2026-01-01
**Version:** 1.0
**Status:** Draft pour validation

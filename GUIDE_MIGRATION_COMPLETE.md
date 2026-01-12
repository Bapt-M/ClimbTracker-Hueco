# 📋 Guide Complet de Migration - Système de Difficulté par Couleurs

## 🎯 Vue d'ensemble des changements

### Ancien système
- **Difficulté**: `grade` (Débutant, Intermédiaire, Expert, etc.)
- **Statut validation**: `attemptStatus` (WORKING, ATTEMPT_2, ATTEMPT_3, COMPLETED, FLASHED, FAVORITE)

### Nouveau système
- **Difficulté**: `difficulty` (Couleur: Vert, Bleu, Rouge, etc.)
- **Label**: `gradeLabel` (Niveau: Débutant, Intermédiaire, etc.)
- **Statut validation**: `status` (EN_PROJET, VALIDE)
- **Essais**: `attempts` (nombre: 1, 2, 3, 5, etc.)
- **Flash**: `isFlashed` (boolean)
- **Favori**: `isFavorite` (boolean)
- **Compteur**: Afficher le nombre de personnes ayant validé chaque bloc

---

## 🗄️ ÉTAPE 1: Migration de la Base de Données

### 1.1 Sauvegarder la base

```bash
pg_dump -U climbtracker climbtracker > backup_before_migration.sql
```

### 1.2 Exécuter le script de migration

```bash
psql -U climbtracker -d climbtracker -f migration-difficulty-system.sql
```

### 1.3 Vérifier la migration

```sql
-- Toutes les routes doivent avoir difficulty et gradeLabel
SELECT COUNT(*) FROM routes WHERE difficulty IS NULL OR "gradeLabel" IS NULL;
-- Résultat attendu: 0

-- Toutes les validations doivent avoir le nouveau status
SELECT COUNT(*) FROM validations WHERE status IS NULL;
-- Résultat attendu: 0
```

---

## 🔧 ÉTAPE 2: Backend - Services

### 2.1 ✅ `apps/api/src/services/routes.service.ts` (DÉJÀ FAIT)

**Changements appliqués:**
- ✅ Import de `DifficultyColor`, `GradeLabel` au lieu de `GradeLevel`
- ✅ `RouteFilters.difficulty` au lieu de `.grade`
- ✅ `RouteCreateData` et `RouteUpdateData` avec `difficulty` + `gradeLabel`
- ✅ Compteur de validations filtre sur `ValidationStatus.VALIDE`
- ✅ `getRoutesStats()` retourne `byDifficulty` au lieu de `byGrade`

### 2.2 `apps/api/src/services/users.service.ts`

**Fichier:** `apps/api/src/services/users.service.ts`

**Changements à faire:**

```typescript
// ANCIEN
import { AttemptStatus } from '../database/entities/Validation';

// NOUVEAU
import { ValidationStatus } from '../database/entities/Validation';
import { DifficultyColor } from '../database/entities/Route';
```

**Dans `getUserStats()` :**

```typescript
// ANCIEN - ligne ~150
const validations = await this.validationRepository
  .createQueryBuilder('validation')
  .leftJoinAndSelect('validation.route', 'route')
  .where('validation.userId = :userId', { userId })
  .getMany();

const validationsByGrade = validations.reduce((acc, val) => {
  const grade = val.route.grade;
  acc[grade] = (acc[grade] || 0) + 1;
  return acc;
}, {} as Record<string, number>);

// NOUVEAU
const validations = await this.validationRepository
  .createQueryBuilder('validation')
  .leftJoinAndSelect('validation.route', 'route')
  .where('validation.userId = :userId', { userId })
  .andWhere('validation.status = :status', { status: ValidationStatus.VALIDE })
  .getMany();

const validationsByDifficulty = validations.reduce((acc, val) => {
  const difficulty = val.route.difficulty;
  acc[difficulty] = (acc[difficulty] || 0) + 1;
  return acc;
}, {} as Record<string, number>);

return {
  totalValidations: validations.length,
  totalComments,
  totalRoutesCreated,
  validationsByDifficulty: Object.entries(validationsByDifficulty).map(([difficulty, count]) => ({
    difficulty,
    count,
  })),
  recentValidations,
  recentComments,
};
```

**Dans `getUserKiviatData()` :**

```typescript
// Filtrer sur status = VALIDE au lieu de attemptStatus
.where('validation.userId = :userId', { userId })
.andWhere('validation.status = :status', { status: ValidationStatus.VALIDE })
```

**Dans `calculateAverageGrade()` :**

```typescript
// ANCIEN
const gradeMapping: Record<string, number> = {
  'Débutant': 1,
  'Débutant+': 2,
  // ...
};

const gradeValue = gradeMapping[validation.route.grade];

// NOUVEAU
const difficultyMapping: Record<DifficultyColor, number> = {
  [DifficultyColor.VERT]: 10,
  [DifficultyColor.VERT_CLAIR]: 15,
  [DifficultyColor.BLEU_CLAIR]: 20,
  [DifficultyColor.BLEU]: 30,
  [DifficultyColor.BLEU_FONCE]: 40,
  [DifficultyColor.JAUNE]: 50,
  [DifficultyColor.ORANGE_CLAIR]: 60,
  [DifficultyColor.ORANGE]: 70,
  [DifficultyColor.ORANGE_FONCE]: 80,
  [DifficultyColor.ROUGE]: 90,
  [DifficultyColor.VIOLET]: 100,
  [DifficultyColor.NOIR]: 120,
};

const difficultyValue = difficultyMapping[validation.route.difficulty];
```

### 2.3 `apps/api/src/services/validations.service.ts`

**Fichier:** `apps/api/src/services/validations.service.ts`

**Changements à faire:**

```typescript
// ANCIEN imports
import { Validation, AttemptStatus } from '../database/entities/Validation';

// NOUVEAU imports
import { Validation, ValidationStatus } from '../database/entities/Validation';
```

**Méthode `createValidation()` :**

```typescript
// ANCIEN
async createValidation(
  userId: string,
  routeId: string,
  personalNote?: string,
  attemptStatus: AttemptStatus = AttemptStatus.COMPLETED
): Promise<Validation> {
  const validation = this.validationRepository.create({
    userId,
    routeId,
    personalNote,
    attemptStatus,
  });
  return await this.validationRepository.save(validation);
}

// NOUVEAU
async createValidation(
  userId: string,
  routeId: string,
  personalNote?: string,
  status: ValidationStatus = ValidationStatus.EN_PROJET,
  attempts: number = 1,
  isFlashed: boolean = false,
  isFavorite: boolean = false
): Promise<Validation> {
  const validation = this.validationRepository.create({
    userId,
    routeId,
    personalNote,
    status,
    attempts,
    isFlashed,
    isFavorite,
  });
  return await this.validationRepository.save(validation);
}
```

**Méthode `updateValidationStatus()` :**

```typescript
// ANCIEN
async updateValidationStatus(
  validationId: string,
  userId: string,
  attemptStatus: AttemptStatus
): Promise<Validation> {
  const validation = await this.getValidationById(validationId);

  if (validation.userId !== userId) {
    throw new ForbiddenError('You can only update your own validations');
  }

  validation.attemptStatus = attemptStatus;
  return await this.validationRepository.save(validation);
}

// NOUVEAU
async updateValidationStatus(
  validationId: string,
  userId: string,
  status: ValidationStatus,
  attempts?: number,
  isFlashed?: boolean,
  isFavorite?: boolean
): Promise<Validation> {
  const validation = await this.getValidationById(validationId);

  if (validation.userId !== userId) {
    throw new ForbiddenError('You can only update your own validations');
  }

  validation.status = status;
  if (attempts !== undefined) validation.attempts = attempts;
  if (isFlashed !== undefined) validation.isFlashed = isFlashed;
  if (isFavorite !== undefined) validation.isFavorite = isFavorite;

  return await this.validationRepository.save(validation);
}
```

### 2.4 ✅ `apps/api/src/services/leaderboard.service.ts` (DÉJÀ FAIT)

---

## 🔧 ÉTAPE 3: Backend - Validators

### 3.1 `apps/api/src/validators/routes.validators.ts`

**Fichier:** `apps/api/src/validators/routes.validators.ts`

**Changements à faire:**

```typescript
import { z } from 'zod';
import { DifficultyColor, GradeLabel, HoldColorCategory } from '../database/entities/Route';

// ANCIEN
export const createRouteSchema = z.object({
  name: z.string().min(1),
  grade: z.enum([
    'Débutant',
    'Débutant+',
    'Intermédiaire-',
    // ...
  ]),
  // ...
});

// NOUVEAU
export const createRouteSchema = z.object({
  name: z.string().min(1, 'Le nom est requis'),
  difficulty: z.enum([
    DifficultyColor.VERT,
    DifficultyColor.VERT_CLAIR,
    DifficultyColor.BLEU_CLAIR,
    DifficultyColor.BLEU,
    DifficultyColor.BLEU_FONCE,
    DifficultyColor.JAUNE,
    DifficultyColor.ORANGE_CLAIR,
    DifficultyColor.ORANGE,
    DifficultyColor.ORANGE_FONCE,
    DifficultyColor.ROUGE,
    DifficultyColor.VIOLET,
    DifficultyColor.NOIR,
  ] as const, 'Difficulté invalide'),
  gradeLabel: z.enum([
    GradeLabel.DEBUTANT,
    GradeLabel.DEBUTANT_PLUS,
    GradeLabel.INTERMEDIAIRE_MOINS,
    GradeLabel.INTERMEDIAIRE,
    GradeLabel.INTERMEDIAIRE_PLUS,
    GradeLabel.CONFIRME_MOINS,
    GradeLabel.CONFIRME,
    GradeLabel.CONFIRME_PLUS,
    GradeLabel.AVANCE,
    GradeLabel.EXPERT,
    GradeLabel.EXPERT_PLUS,
  ] as const, 'Label de niveau invalide'),
  holdColorHex: z.string().regex(/^#[0-9A-Fa-f]{6}$/, 'Couleur hex invalide'),
  holdColorCategory: z.enum([
    HoldColorCategory.RED,
    HoldColorCategory.BLUE,
    HoldColorCategory.GREEN,
    HoldColorCategory.YELLOW,
    HoldColorCategory.ORANGE,
    HoldColorCategory.PURPLE,
    HoldColorCategory.PINK,
    HoldColorCategory.BLACK,
    HoldColorCategory.WHITE,
    HoldColorCategory.GREY,
  ] as const),
  sector: z.string().min(1),
  routeTypes: z.array(z.string()).optional(),
  description: z.string().optional(),
  tips: z.string().optional(),
  mainPhoto: z.string().url(),
  openingVideo: z.string().url().optional(),
});

export const updateRouteSchema = createRouteSchema.partial();
```

### 3.2 `apps/api/src/validators/validations.validators.ts`

**Fichier:** `apps/api/src/validators/validations.validators.ts`

**Changements à faire:**

```typescript
import { z } from 'zod';
import { ValidationStatus } from '../database/entities/Validation';

// ANCIEN
export const createValidationSchema = z.object({
  routeId: z.string().uuid(),
  personalNote: z.string().optional(),
  attemptStatus: z.enum([
    'WORKING',
    'ATTEMPT_2',
    'ATTEMPT_3',
    'ATTEMPT_5',
    'COMPLETED',
    'FLASHED',
    'FAVORITE',
  ]).default('COMPLETED'),
});

export const updateValidationStatusSchema = z.object({
  attemptStatus: z.enum([
    'WORKING',
    'ATTEMPT_2',
    'ATTEMPT_3',
    'ATTEMPT_5',
    'COMPLETED',
    'FLASHED',
    'FAVORITE',
  ]),
});

// NOUVEAU
export const createValidationSchema = z.object({
  routeId: z.string().uuid('ID de voie invalide'),
  personalNote: z.string().optional(),
  status: z.enum([
    ValidationStatus.EN_PROJET,
    ValidationStatus.VALIDE,
  ] as const).default(ValidationStatus.EN_PROJET),
  attempts: z.number().int().min(1).default(1),
  isFlashed: z.boolean().default(false),
  isFavorite: z.boolean().default(false),
});

export const updateValidationStatusSchema = z.object({
  status: z.enum([
    ValidationStatus.EN_PROJET,
    ValidationStatus.VALIDE,
  ] as const),
  attempts: z.number().int().min(1).optional(),
  isFlashed: z.boolean().optional(),
  isFavorite: z.boolean().optional(),
});
```

---

## 🔧 ÉTAPE 4: Backend - Controllers

### 4.1 `apps/api/src/controllers/routes.controller.ts`

**Pas de changements majeurs nécessaires** - le controller utilise le service qui a déjà été mis à jour.

Vérifier juste que les appels au service passent bien les nouveaux paramètres `difficulty` et `gradeLabel`.

### 4.2 `apps/api/src/controllers/validations.controller.ts`

**Fichier:** `apps/api/src/controllers/validations.controller.ts`

**Changements à faire dans `createValidation()` :**

```typescript
// ANCIEN
async createValidation(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const { routeId, personalNote, attemptStatus } = req.body;
    const userId = req.user!.id;

    const validation = await validationsService.createValidation(
      userId,
      routeId,
      personalNote,
      attemptStatus
    );

    return successResponse(res, validation, 'Validation created', 201);
  } catch (error) {
    next(error);
  }
}

// NOUVEAU
async createValidation(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const { routeId, personalNote, status, attempts, isFlashed, isFavorite } = req.body;
    const userId = req.user!.id;

    const validation = await validationsService.createValidation(
      userId,
      routeId,
      personalNote,
      status,
      attempts,
      isFlashed,
      isFavorite
    );

    return successResponse(res, validation, 'Validation created', 201);
  } catch (error) {
    next(error);
  }
}
```

**Changements dans `updateValidationStatus()` :**

```typescript
// ANCIEN
const { attemptStatus } = req.body;

// NOUVEAU
const { status, attempts, isFlashed, isFavorite } = req.body;

const validation = await validationsService.updateValidationStatus(
  validationId,
  userId,
  status,
  attempts,
  isFlashed,
  isFavorite
);
```

---

## 🎨 ÉTAPE 5: Frontend - API Types

### 5.1 `apps/web/src/lib/api/routes.ts`

**Fichier:** `apps/web/src/lib/api/routes.ts`

**Changements à faire:**

```typescript
// ANCIEN
export interface Route {
  id: string;
  name: string;
  grade: string;
  color: string;
  sector: string;
  description?: string;
  tips?: string;
  mainPhoto: string;
  openingVideo?: string;
  status: 'PENDING' | 'ACTIVE' | 'ARCHIVED';
  openedAt: string;
  closedAt?: string;
  opener: {
    id: string;
    name: string;
  };
  validationsCount?: number;
  commentsCount?: number;
}

// NOUVEAU
export interface Route {
  id: string;
  name: string;
  difficulty: string; // Couleur: 'Vert', 'Bleu', 'Rouge', etc.
  gradeLabel: string; // Niveau: 'Débutant', 'Intermédiaire', etc.
  holdColorHex: string;
  holdColorCategory: string;
  sector: string;
  routeTypes?: string[];
  description?: string;
  tips?: string;
  mainPhoto: string;
  openingVideo?: string;
  status: 'PENDING' | 'ACTIVE' | 'ARCHIVED';
  openedAt: string;
  closedAt?: string;
  opener: {
    id: string;
    name: string;
  };
  validationsCount?: number; // Nombre de personnes ayant VALIDÉ
  commentsCount?: number;
}

export interface RouteFilters {
  difficulty?: string | string[]; // Au lieu de 'grade'
  holdColorCategory?: string | string[];
  sector?: string | string[];
  status?: string[];
  search?: string;
  page?: number;
  limit?: number;
}
```

### 5.2 `apps/web/src/lib/api/validations.ts`

**Fichier:** `apps/web/src/lib/api/validations.ts` (ou dans routes.ts si les validations y sont)

**Changements à faire:**

```typescript
// ANCIEN
export interface Validation {
  id: string;
  userId: string;
  routeId: string;
  attemptStatus: 'WORKING' | 'ATTEMPT_2' | 'ATTEMPT_3' | 'ATTEMPT_5' | 'COMPLETED' | 'FLASHED' | 'FAVORITE';
  personalNote?: string;
  validatedAt: string;
}

// NOUVEAU
export interface Validation {
  id: string;
  userId: string;
  routeId: string;
  status: 'EN_PROJET' | 'VALIDE';
  attempts: number;
  isFlashed: boolean;
  isFavorite: boolean;
  personalNote?: string;
  validatedAt: string;
}

// Fonction pour créer/mettre à jour une validation
export const validationAPI = {
  create: async (data: {
    routeId: string;
    status: 'EN_PROJET' | 'VALIDE';
    attempts: number;
    isFlashed: boolean;
    isFavorite: boolean;
    personalNote?: string;
  }) => {
    const response = await api.post('/api/validations', data);
    return response.data;
  },

  updateStatus: async (validationId: string, data: {
    status: 'EN_PROJET' | 'VALIDE';
    attempts?: number;
    isFlashed?: boolean;
    isFavorite?: boolean;
  }) => {
    const response = await api.put(`/api/validations/${validationId}/status`, data);
    return response.data;
  },
};
```

---

## 🎨 ÉTAPE 6: Frontend - Composants

### 6.1 `apps/web/src/components/QuickStatusMenu.tsx`

**Fichier:** `apps/web/src/components/QuickStatusMenu.tsx`

**Changements majeurs:**

```typescript
// ANCIEN
export type AttemptStatus =
  | 'WORKING'
  | 'ATTEMPT_2'
  | 'ATTEMPT_3'
  | 'ATTEMPT_5'
  | 'COMPLETED'
  | 'FLASHED'
  | 'FAVORITE';

const STATUS_CONFIG: Record<AttemptStatus, StatusConfig> = {
  WORKING: { label: 'En projet', icon: 'work', color: 'text-blue-500' },
  ATTEMPT_2: { label: '2ème essai', icon: 'counter_2', color: 'text-orange-400' },
  ATTEMPT_3: { label: '3ème essai', icon: 'counter_3', color: 'text-orange-500' },
  ATTEMPT_5: { label: '5+ essais', icon: 'counter_5', color: 'text-orange-600' },
  COMPLETED: { label: 'Réussie', icon: 'check_circle', color: 'text-green-500' },
  FLASHED: { label: 'Flashée', icon: 'flash_on', color: 'text-yellow-500' },
  FAVORITE: { label: 'Favorite', icon: 'favorite', color: 'text-red-500' },
};

// NOUVEAU
export type ValidationData = {
  status: 'EN_PROJET' | 'VALIDE';
  attempts: number;
  isFlashed: boolean;
  isFavorite: boolean;
};

interface QuickStatusMenuProps {
  routeId: string;
  currentValidation?: ValidationData;
  onStatusChange: () => void;
}

export const QuickStatusMenu = ({ routeId, currentValidation, onStatusChange }: QuickStatusMenuProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<'EN_PROJET' | 'VALIDE'>(
    currentValidation?.status || 'EN_PROJET'
  );
  const [attempts, setAttempts] = useState(currentValidation?.attempts || 1);
  const [isFlashed, setIsFlashed] = useState(currentValidation?.isFlashed || false);
  const [isFavorite, setIsFavorite] = useState(currentValidation?.isFavorite || false);

  const handleSave = async () => {
    try {
      const token = localStorage.getItem('accessToken');

      if (currentValidation) {
        // Mettre à jour
        await fetch(`http://localhost:3000/api/validations/${currentValidation.id}/status`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            status: selectedStatus,
            attempts,
            isFlashed,
            isFavorite,
          }),
        });
      } else {
        // Créer
        await fetch('http://localhost:3000/api/validations', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            routeId,
            status: selectedStatus,
            attempts,
            isFlashed,
            isFavorite,
          }),
        });
      }

      onStatusChange();
      setIsOpen(false);
    } catch (error) {
      console.error('Error updating validation:', error);
    }
  };

  return (
    <>
      <button onClick={() => setIsOpen(true)}>
        <span className="material-symbols-outlined">more_vert</span>
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 bg-black/50" onClick={() => setIsOpen(false)}>
          <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-mono-900 rounded-t-3xl p-6">
            <h3 className="text-lg font-bold mb-4">Statut de la voie</h3>

            {/* Statut: En projet ou Validé */}
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Statut</label>
              <div className="flex gap-2">
                <button
                  className={`flex-1 py-2 rounded-lg ${selectedStatus === 'EN_PROJET' ? 'bg-blue-500 text-white' : 'bg-mono-200'}`}
                  onClick={() => setSelectedStatus('EN_PROJET')}
                >
                  En projet
                </button>
                <button
                  className={`flex-1 py-2 rounded-lg ${selectedStatus === 'VALIDE' ? 'bg-green-500 text-white' : 'bg-mono-200'}`}
                  onClick={() => setSelectedStatus('VALIDE')}
                >
                  Validé
                </button>
              </div>
            </div>

            {/* Nombre d'essais */}
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">
                Nombre d'essais
              </label>
              <input
                type="number"
                min="1"
                value={attempts}
                onChange={(e) => setAttempts(parseInt(e.target.value))}
                className="w-full px-4 py-2 border rounded-lg"
              />
            </div>

            {/* Flashé (seulement si validé au 1er essai) */}
            {selectedStatus === 'VALIDE' && attempts === 1 && (
              <label className="flex items-center gap-2 mb-4">
                <input
                  type="checkbox"
                  checked={isFlashed}
                  onChange={(e) => setIsFlashed(e.target.checked)}
                  className="w-5 h-5"
                />
                <span>Flashé (premier essai) ⚡</span>
              </label>
            )}

            {/* Favori */}
            <label className="flex items-center gap-2 mb-4">
              <input
                type="checkbox"
                checked={isFavorite}
                onChange={(e) => setIsFavorite(e.target.checked)}
                className="w-5 h-5"
              />
              <span>Marquer comme favori ❤️</span>
            </label>

            {/* Boutons */}
            <div className="flex gap-2">
              <button
                onClick={() => setIsOpen(false)}
                className="flex-1 py-3 bg-mono-200 rounded-lg"
              >
                Annuler
              </button>
              <button
                onClick={handleSave}
                className="flex-1 py-3 bg-highlight text-white rounded-lg"
              >
                Enregistrer
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
```

### 6.2 `apps/web/src/components/ValidationButton.tsx`

**Fichier:** `apps/web/src/components/ValidationButton.tsx`

**Changements à faire:**

```typescript
// Mettre à jour pour utiliser le nouveau système status + attempts
// Afficher l'état actuel: "En projet (3 essais)" ou "Validé ⚡" si flashé

interface ValidationButtonProps {
  routeId: string;
  currentValidation?: {
    status: 'EN_PROJET' | 'VALIDE';
    attempts: number;
    isFlashed: boolean;
    isFavorite: boolean;
  };
  onValidationChange: () => void;
}

export const ValidationButton = ({ routeId, currentValidation, onValidationChange }: ValidationButtonProps) => {
  const getDisplayText = () => {
    if (!currentValidation) return 'Ajouter';

    if (currentValidation.status === 'VALIDE') {
      return currentValidation.isFlashed ? 'Validé ⚡' : `Validé (${currentValidation.attempts} essais)`;
    }

    return `En projet (${currentValidation.attempts} essais)`;
  };

  const getButtonColor = () => {
    if (!currentValidation) return 'bg-mono-200';
    if (currentValidation.status === 'VALIDE' && currentValidation.isFlashed) return 'bg-yellow-500 text-white';
    if (currentValidation.status === 'VALIDE') return 'bg-green-500 text-white';
    return 'bg-blue-500 text-white';
  };

  return (
    <button className={`px-4 py-2 rounded-lg ${getButtonColor()}`}>
      {getDisplayText()}
    </button>
  );
};
```

### 6.3 `apps/web/src/components/RouteCardWithStatus.tsx`

**Fichier:** `apps/web/src/components/RouteCardWithStatus.tsx`

**Changements à faire:**

```typescript
// ANCIEN
<div className="text-sm font-bold text-white">{route.grade}</div>

// NOUVEAU
<div className="space-y-1">
  <div className="text-sm font-bold text-white">{route.difficulty}</div>
  <div className="text-xs text-mono-400">{route.gradeLabel}</div>
</div>

// Ajouter le compteur de validations
{route.validationsCount !== undefined && (
  <div className="flex items-center gap-1 text-xs text-mono-400">
    <span className="material-symbols-outlined text-[14px]">check_circle</span>
    <span>{route.validationsCount} {route.validationsCount > 1 ? 'validations' : 'validation'}</span>
  </div>
)}
```

### 6.4 `apps/web/src/components/GradeFilter.tsx`

**Fichier:** `apps/web/src/components/GradeFilter.tsx`

**À renommer en:** `apps/web/src/components/DifficultyFilter.tsx`

**Changements à faire:**

```typescript
// ANCIEN - Filtres par grade
const GRADES = ['Débutant', 'Débutant+', 'Intermédiaire-', ...];

// NOUVEAU - Filtres par couleur de difficulté
const DIFFICULTIES = [
  { color: 'Vert', hex: '#10b981', label: 'Débutant' },
  { color: 'Vert clair', hex: '#34d399', label: 'Débutant+' },
  { color: 'Bleu clair', hex: '#60a5fa', label: 'Intermédiaire-' },
  { color: 'Bleu', hex: '#3b82f6', label: 'Intermédiaire' },
  { color: 'Bleu foncé', hex: '#2563eb', label: 'Intermédiaire+' },
  { color: 'Jaune', hex: '#fbbf24', label: 'Confirmé-' },
  { color: 'Orange clair', hex: '#fb923c', label: 'Confirmé' },
  { color: 'Orange', hex: '#f97316', label: 'Confirmé+' },
  { color: 'Orange foncé', hex: '#ea580c', label: 'Avancé' },
  { color: 'Rouge', hex: '#ef4444', label: 'Expert' },
  { color: 'Violet', hex: '#a855f7', label: 'Expert+' },
  { color: 'Noir', hex: '#1f2937', label: 'Expert++' },
];

interface DifficultyFilterProps {
  selectedDifficulties: string[];
  onDifficultiesChange: (difficulties: string[]) => void;
}

export const DifficultyFilter = ({ selectedDifficulties, onDifficultiesChange }: DifficultyFilterProps) => {
  // ...
  return (
    <div>
      <h3 className="text-sm font-medium mb-2">Difficulté</h3>
      <div className="flex flex-wrap gap-2">
        {DIFFICULTIES.map((diff) => (
          <button
            key={diff.color}
            onClick={() => toggleDifficulty(diff.color)}
            className={`flex items-center gap-2 px-3 py-1 rounded-full text-xs ${
              selectedDifficulties.includes(diff.color)
                ? 'bg-highlight text-white'
                : 'bg-mono-200 dark:bg-mono-800'
            }`}
          >
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: diff.hex }}
            />
            <span>{diff.color}</span>
            <span className="text-[10px] opacity-70">({diff.label})</span>
          </button>
        ))}
      </div>
    </div>
  );
};
```

---

## 🎨 ÉTAPE 7: Frontend - Pages

### 7.1 `apps/web/src/pages/CreateRoute.tsx`

**Fichier:** `apps/web/src/pages/CreateRoute.tsx`

**Changements majeurs:**

```typescript
// ANCIEN - Un seul champ grade
const [formData, setFormData] = useState({
  name: '',
  grade: 'Intermédiaire',
  // ...
});

// NOUVEAU - Deux champs: difficulty + gradeLabel
const [formData, setFormData] = useState({
  name: '',
  difficulty: 'Bleu' as DifficultyColor,
  gradeLabel: 'Intermédiaire' as GradeLabel,
  holdColorHex: '#3b82f6',
  holdColorCategory: 'blue',
  sector: 'A',
  routeTypes: [] as string[],
  description: '',
  tips: '',
  mainPhoto: '',
  openingVideo: '',
});

// Mapping difficulty -> gradeLabel par défaut
const DIFFICULTY_TO_LABEL: Record<string, string> = {
  'Vert': 'Débutant',
  'Vert clair': 'Débutant+',
  'Bleu clair': 'Intermédiaire-',
  'Bleu': 'Intermédiaire',
  'Bleu foncé': 'Intermédiaire+',
  'Jaune': 'Confirmé-',
  'Orange clair': 'Confirmé',
  'Orange': 'Confirmé+',
  'Orange foncé': 'Avancé',
  'Rouge': 'Expert',
  'Violet': 'Expert+',
  'Noir': 'Expert++',
};

// Lors du changement de difficulté, mettre à jour automatiquement le label
const handleDifficultyChange = (difficulty: string) => {
  setFormData({
    ...formData,
    difficulty,
    gradeLabel: DIFFICULTY_TO_LABEL[difficulty],
  });
};

// UI
<div className="mb-4">
  <label className="block text-sm font-medium mb-2">Difficulté (Couleur)</label>
  <select
    value={formData.difficulty}
    onChange={(e) => handleDifficultyChange(e.target.value)}
    className="w-full px-4 py-2 border rounded-lg"
  >
    {Object.entries(DIFFICULTY_TO_LABEL).map(([diff, label]) => (
      <option key={diff} value={diff}>
        {diff} ({label})
      </option>
    ))}
  </select>
</div>

<div className="mb-4">
  <label className="block text-sm font-medium mb-2">Niveau (Label)</label>
  <input
    type="text"
    value={formData.gradeLabel}
    onChange={(e) => setFormData({ ...formData, gradeLabel: e.target.value })}
    className="w-full px-4 py-2 border rounded-lg"
    placeholder="Intermédiaire, Confirmé, etc."
  />
</div>
```

### 7.2 `apps/web/src/pages/RouteDetail.tsx`

**Fichier:** `apps/web/src/pages/RouteDetail.tsx`

**Changements à faire:**

```typescript
// Afficher difficulty + gradeLabel au lieu de grade
<div className="flex items-center gap-2">
  <div
    className="w-8 h-8 rounded-full"
    style={{ backgroundColor: route.holdColorHex }}
  />
  <div>
    <div className="text-xl font-bold">{route.difficulty}</div>
    <div className="text-sm text-mono-500">{route.gradeLabel}</div>
  </div>
</div>

// Afficher le compteur de validations
<div className="flex items-center gap-4 text-sm">
  <div className="flex items-center gap-1">
    <span className="material-symbols-outlined text-green-500">check_circle</span>
    <span>{route.validationsCount || 0} {route.validationsCount === 1 ? 'validation' : 'validations'}</span>
  </div>
  <div className="flex items-center gap-1">
    <span className="material-symbols-outlined text-mono-400">comment</span>
    <span>{route.commentsCount || 0}</span>
  </div>
</div>
```

### 7.3 `apps/web/src/pages/RoutesHub.tsx`

**Fichier:** `apps/web/src/pages/RoutesHub.tsx`

**Changements à faire:**

```typescript
// Importer DifficultyFilter au lieu de GradeFilter
import { DifficultyFilter } from '../components/DifficultyFilter';

// Changer les états
const [selectedDifficulties, setSelectedDifficulties] = useState<string[]>([]);

// Changer les filtres
useEffect(() => {
  if (selectedDifficulties.length > 0) {
    setFilters((prev) => ({ ...prev, difficulty: selectedDifficulties, page: 1 }));
  } else {
    setFilters((prev) => {
      const { difficulty, ...rest } = prev;
      return { ...rest, page: 1 };
    });
  }
}, [selectedDifficulties]);

// Remplacer GradeFilter par DifficultyFilter
<DifficultyFilter
  selectedDifficulties={selectedDifficulties}
  onDifficultiesChange={setSelectedDifficulties}
/>
```

### 7.4 `apps/web/src/pages/UserProfile.tsx`

**Fichier:** `apps/web/src/pages/UserProfile.tsx`

**Changements à faire:**

```typescript
// Mettre à jour l'affichage des statistiques
// ANCIEN: validationsByGrade
// NOUVEAU: validationsByDifficulty

{stats?.validationsByDifficulty && stats.validationsByDifficulty.length > 0 && (
  <div className="bg-white dark:bg-mono-900 rounded-2xl p-6">
    <h3 className="font-bold mb-4">Par difficulté</h3>
    <div className="space-y-2">
      {stats.validationsByDifficulty.map((item: any) => (
        <div key={item.difficulty} className="flex items-center justify-between">
          <span className="text-sm">{item.difficulty}</span>
          <span className="font-bold">{item.count}</span>
        </div>
      ))}
    </div>
  </div>
)}
```

---

## 🧪 ÉTAPE 8: Tests et Vérification

### 8.1 Tester le backend

```bash
cd apps/api

# Redémarrer le serveur
npm run dev

# Tester la création d'une voie
curl -X POST http://localhost:3000/api/routes \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "name": "Test Route",
    "difficulty": "Bleu",
    "gradeLabel": "Intermédiaire",
    "holdColorHex": "#3b82f6",
    "holdColorCategory": "blue",
    "sector": "A",
    "mainPhoto": "https://example.com/photo.jpg"
  }'

# Tester la création d'une validation
curl -X POST http://localhost:3000/api/validations \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "routeId": "route-id-here",
    "status": "VALIDE",
    "attempts": 1,
    "isFlashed": true,
    "isFavorite": false
  }'
```

### 8.2 Tester le frontend

```bash
cd apps/web
npm run dev
```

**Checklist:**
- [ ] La page Explore affiche les voies avec difficulty + gradeLabel
- [ ] Le compteur de validations s'affiche sur chaque carte
- [ ] Le filtre de difficulté fonctionne
- [ ] La création de voie fonctionne avec les nouveaux champs
- [ ] Le menu de statut permet de choisir EN_PROJET/VALIDE + nombre d'essais
- [ ] La page détail affiche le nombre de validations
- [ ] Le profil utilisateur affiche les stats par difficulté
- [ ] Le classement calcule correctement les points

### 8.3 Tests automatisés

```bash
# Backend
cd apps/api
npm test

# Frontend (si configuré)
cd apps/web
npm test
```

---

## 🚨 Points d'attention

### Données existantes

⚠️ **ATTENTION:** Toutes les routes et validations existantes seront migrées automatiquement par le script SQL. Vérifiez bien le mapping avant de valider la migration en production.

### Compatibilité

- Les anciens champs `grade` et `attemptStatus` peuvent être gardés temporairement pour migration progressive
- Décommentez les `DROP COLUMN` dans le script SQL seulement après vérification complète

### Performance

- Le compteur de validations utilise `loadRelationCountAndMap` qui est optimisé
- Pensez à ajouter des index si nécessaire:
  ```sql
  CREATE INDEX idx_validations_status ON validations(status);
  CREATE INDEX idx_routes_difficulty ON routes(difficulty);
  ```

---

## 📊 Récapitulatif des changements

### Base de données
- ✅ `routes.grade` → `routes.difficulty` + `routes.gradeLabel`
- ✅ `validations.attemptStatus` → `validations.status` + `attempts` + `isFlashed` + `isFavorite`
- ✅ Table `friendships` créée

### Backend (7 fichiers)
- ✅ `routes.service.ts` - Compteur validations filtrées
- ⏳ `users.service.ts` - Stats par difficulté
- ⏳ `validations.service.ts` - Nouveau système
- ⏳ `routes.validators.ts` - Nouveaux enums
- ⏳ `validations.validators.ts` - Nouveaux champs
- ⏳ `routes.controller.ts` - Adaptation
- ⏳ `validations.controller.ts` - Adaptation

### Frontend (12+ fichiers)
- ⏳ `routes.ts` - Types mis à jour
- ⏳ `QuickStatusMenu.tsx` - Nouveau UI
- ⏳ `ValidationButton.tsx` - Nouvel affichage
- ⏳ `RouteCardWithStatus.tsx` - Compteur validations
- ⏳ `GradeFilter.tsx` → `DifficultyFilter.tsx`
- ⏳ `CreateRoute.tsx` - Nouveaux champs
- ⏳ `RouteDetail.tsx` - Compteur validations
- ⏳ `RoutesHub.tsx` - Filtres mis à jour
- ⏳ `UserProfile.tsx` - Stats par difficulté

---

## 🎉 Conclusion

Ce guide couvre **tous les changements nécessaires** pour migrer vers le nouveau système. Suivez les étapes dans l'ordre et testez après chaque modification majeure.

**Temps estimé:** 2-3 jours pour une migration complète et testée.

Bon courage ! 💪

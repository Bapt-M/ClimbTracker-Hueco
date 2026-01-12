-- ====================================================================
-- MIGRATION: Système de difficulté par couleurs + Nouveau système de validation
-- ====================================================================
-- Ce script migre la base de données de l'ancien système (grade) vers
-- le nouveau système (difficulty + gradeLabel + status + attempts)
-- ====================================================================

BEGIN;

-- ====================================================================
-- PARTIE 1: MODIFICATIONS DE LA TABLE ROUTES
-- ====================================================================

-- Créer les nouveaux types ENUM pour difficulty et gradeLabel
CREATE TYPE "difficulty_color" AS ENUM (
  'Vert',
  'Vert clair',
  'Bleu clair',
  'Bleu',
  'Bleu foncé',
  'Jaune',
  'Orange clair',
  'Orange',
  'Orange foncé',
  'Rouge',
  'Violet',
  'Noir'
);

CREATE TYPE "grade_label" AS ENUM (
  'Débutant',
  'Débutant+',
  'Intermédiaire-',
  'Intermédiaire',
  'Intermédiaire+',
  'Confirmé-',
  'Confirmé',
  'Confirmé+',
  'Avancé',
  'Expert',
  'Expert+'
);

-- Ajouter les nouvelles colonnes
ALTER TABLE routes ADD COLUMN difficulty difficulty_color;
ALTER TABLE routes ADD COLUMN "gradeLabel" grade_label;

-- Mapper les anciens grades vers les nouvelles difficultés
-- Map chaque valeur manuellement sans cast direct
UPDATE routes SET
  difficulty = CASE
    WHEN grade::text = 'Débutant' THEN 'Vert'::difficulty_color
    WHEN grade::text = 'Débutant+' THEN 'Vert clair'::difficulty_color
    WHEN grade::text = 'Intermédiaire-' THEN 'Bleu clair'::difficulty_color
    WHEN grade::text = 'Intermédiaire' THEN 'Bleu'::difficulty_color
    WHEN grade::text = 'Intermédiaire+' THEN 'Bleu foncé'::difficulty_color
    WHEN grade::text = 'Confirmé-' THEN 'Jaune'::difficulty_color
    WHEN grade::text = 'Confirmé' THEN 'Orange clair'::difficulty_color
    WHEN grade::text = 'Confirmé+' THEN 'Orange'::difficulty_color
    WHEN grade::text = 'Avancé' THEN 'Orange foncé'::difficulty_color
    WHEN grade::text = 'Expert' THEN 'Rouge'::difficulty_color
    WHEN grade::text = 'Expert+' THEN 'Violet'::difficulty_color
    ELSE 'Bleu'::difficulty_color
  END,
  "gradeLabel" = CASE
    WHEN grade::text = 'Débutant' THEN 'Débutant'::grade_label
    WHEN grade::text = 'Débutant+' THEN 'Débutant+'::grade_label
    WHEN grade::text = 'Intermédiaire-' THEN 'Intermédiaire-'::grade_label
    WHEN grade::text = 'Intermédiaire' THEN 'Intermédiaire'::grade_label
    WHEN grade::text = 'Intermédiaire+' THEN 'Intermédiaire+'::grade_label
    WHEN grade::text = 'Confirmé-' THEN 'Confirmé-'::grade_label
    WHEN grade::text = 'Confirmé' THEN 'Confirmé'::grade_label
    WHEN grade::text = 'Confirmé+' THEN 'Confirmé+'::grade_label
    WHEN grade::text = 'Avancé' THEN 'Avancé'::grade_label
    WHEN grade::text = 'Expert' THEN 'Expert'::grade_label
    WHEN grade::text = 'Expert+' THEN 'Expert+'::grade_label
    ELSE 'Intermédiaire'::grade_label
  END
WHERE difficulty IS NULL;

-- Rendre les colonnes NOT NULL après migration
ALTER TABLE routes ALTER COLUMN difficulty SET NOT NULL;
ALTER TABLE routes ALTER COLUMN "gradeLabel" SET NOT NULL;

-- Supprimer l'ancienne colonne grade (après vérification!)
-- ATTENTION: Décommenter uniquement après avoir vérifié la migration
-- ALTER TABLE routes DROP COLUMN grade;

-- ====================================================================
-- PARTIE 2: MODIFICATIONS DE LA TABLE VALIDATIONS
-- ====================================================================

-- Créer le nouveau type ENUM pour le status
CREATE TYPE "validation_status" AS ENUM (
  'EN_PROJET',
  'VALIDE'
);

-- Ajouter les nouvelles colonnes
ALTER TABLE validations ADD COLUMN status validation_status;
ALTER TABLE validations ADD COLUMN attempts INTEGER DEFAULT 1;
ALTER TABLE validations ADD COLUMN "isFlashed" BOOLEAN DEFAULT false;
ALTER TABLE validations ADD COLUMN "isFavorite" BOOLEAN DEFAULT false;

-- Mapper les anciens attemptStatus vers le nouveau système
UPDATE validations SET
  status = CASE
    WHEN "attemptStatus"::text IN ('COMPLETED', 'FLASHED') THEN 'VALIDE'::validation_status
    WHEN "attemptStatus"::text = 'WORKING' THEN 'EN_PROJET'::validation_status
    WHEN "attemptStatus"::text = 'ATTEMPT_2' THEN 'VALIDE'::validation_status
    WHEN "attemptStatus"::text = 'ATTEMPT_3' THEN 'VALIDE'::validation_status
    WHEN "attemptStatus"::text = 'ATTEMPT_5' THEN 'VALIDE'::validation_status
    WHEN "attemptStatus"::text = 'FAVORITE' THEN 'EN_PROJET'::validation_status
    ELSE 'EN_PROJET'::validation_status
  END,
  attempts = CASE
    WHEN "attemptStatus"::text = 'FLASHED' THEN 1
    WHEN "attemptStatus"::text = 'ATTEMPT_2' THEN 2
    WHEN "attemptStatus"::text = 'ATTEMPT_3' THEN 3
    WHEN "attemptStatus"::text = 'ATTEMPT_5' THEN 5
    WHEN "attemptStatus"::text IN ('COMPLETED', 'WORKING') THEN 1
    ELSE 1
  END,
  "isFlashed" = ("attemptStatus"::text = 'FLASHED'),
  "isFavorite" = ("attemptStatus"::text = 'FAVORITE')
WHERE status IS NULL;

-- Rendre les colonnes NOT NULL après migration
ALTER TABLE validations ALTER COLUMN status SET NOT NULL;
ALTER TABLE validations ALTER COLUMN attempts SET NOT NULL;
ALTER TABLE validations ALTER COLUMN "isFlashed" SET NOT NULL;
ALTER TABLE validations ALTER COLUMN "isFavorite" SET NOT NULL;

-- Supprimer l'ancienne colonne attemptStatus (après vérification!)
-- ATTENTION: Décommenter uniquement après avoir vérifié la migration
-- ALTER TABLE validations DROP COLUMN "attemptStatus";

-- ====================================================================
-- PARTIE 3: CRÉATION DE LA TABLE FRIENDSHIPS (Optionnel - Système d'amis)
-- ====================================================================
-- Note: Cette table existe déjà, skip cette partie

-- CREATE TYPE "friendship_status" AS ENUM (
--   'PENDING',
--   'ACCEPTED',
--   'REJECTED'
-- );

-- CREATE TABLE IF NOT EXISTS friendships (
--   id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
--   "requesterId" UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
--   "addresseeId" UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
--   status friendship_status NOT NULL DEFAULT 'PENDING',
--   "createdAt" TIMESTAMP NOT NULL DEFAULT NOW(),
--   "acceptedAt" TIMESTAMP,
--   CONSTRAINT unique_friendship UNIQUE ("requesterId", "addresseeId")
-- );

-- Index pour améliorer les performances
-- CREATE INDEX IF NOT EXISTS idx_friendships_requester ON friendships("requesterId");
-- CREATE INDEX IF NOT EXISTS idx_friendships_addressee ON friendships("addresseeId");
-- CREATE INDEX IF NOT EXISTS idx_friendships_status ON friendships(status);

-- ====================================================================
-- VERIFICATION
-- ====================================================================

-- Vérifier les routes
SELECT
  COUNT(*) as total_routes,
  COUNT(difficulty) as routes_with_difficulty,
  COUNT("gradeLabel") as routes_with_label
FROM routes;

-- Vérifier les validations
SELECT
  COUNT(*) as total_validations,
  COUNT(status) as validations_with_status,
  COUNT(attempts) as validations_with_attempts
FROM validations;

-- Voir la distribution des difficultés
SELECT difficulty, COUNT(*) as count
FROM routes
GROUP BY difficulty
ORDER BY count DESC;

-- Voir la distribution des statuts de validation
SELECT status, COUNT(*) as count
FROM validations
GROUP BY status;

COMMIT;

-- ====================================================================
-- EN CAS DE PROBLEME - ROLLBACK
-- ====================================================================
-- Si quelque chose ne va pas, exécutez:
-- ROLLBACK;
--
-- Cela annulera toutes les modifications depuis le BEGIN
-- ====================================================================

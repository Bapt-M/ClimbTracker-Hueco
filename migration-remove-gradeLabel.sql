-- Migration: Supprimer la colonne gradeLabel
-- Date: 2026-01-11
-- Description: Supprime gradeLabel car on garde seulement difficulty (couleur de cotation)

BEGIN;

-- Supprimer la colonne gradeLabel de la table routes
ALTER TABLE routes DROP COLUMN IF EXISTS "gradeLabel";

-- Supprimer l'enum grade_label s'il existe
DROP TYPE IF EXISTS grade_label;

COMMIT;

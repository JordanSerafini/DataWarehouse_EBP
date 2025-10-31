-- =====================================================
-- Migration 019: Ajout des colonnes technicien sur incidents_proposed
-- Description: Permet d'attribuer un collègue lors de la conversion en incident
-- Date: 2025-10-31
-- =====================================================

ALTER TABLE mobile.incidents_proposed
  ADD COLUMN IF NOT EXISTS colleague_id VARCHAR(20),
  ADD COLUMN IF NOT EXISTS colleague_name VARCHAR(100);

-- Index pour recherches par technicien
CREATE INDEX IF NOT EXISTS idx_proposed_inc_colleague
  ON mobile.incidents_proposed(colleague_id);

-- Historiser la migration
INSERT INTO mobile.migration_history (migration_number, migration_name, executed_at)
VALUES (19, '019_add_colleague_to_incidents_proposed', NOW())
ON CONFLICT (migration_number) DO NOTHING;

DO $$
BEGIN
  RAISE NOTICE 'Migration 019: Colonnes colleague_id/colleague_name ajoutées à mobile.incidents_proposed';
END $$;


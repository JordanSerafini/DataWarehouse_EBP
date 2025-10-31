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

-- Historiser la migration (robuste aux schémas différents)
DO $$
DECLARE
  has_table BOOLEAN := EXISTS(
    SELECT 1 FROM information_schema.tables
    WHERE table_schema = 'mobile' AND table_name = 'migration_history'
  );
  has_migration_number BOOLEAN := EXISTS(
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'mobile' AND table_name = 'migration_history' AND column_name = 'migration_number'
  );
  has_migration_name BOOLEAN := EXISTS(
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'mobile' AND table_name = 'migration_history' AND column_name = 'migration_name'
  );
BEGIN
  IF has_table THEN
    IF has_migration_number THEN
      -- Schéma avec migration_number
      BEGIN
        INSERT INTO mobile.migration_history (migration_number, migration_name, executed_at)
        VALUES (19, '019_add_colleague_to_incidents_proposed', NOW())
        ON CONFLICT (migration_number) DO NOTHING;
      EXCEPTION WHEN undefined_table OR undefined_column THEN
        -- Ignorer si la structure ne correspond pas
        NULL;
      END;
    ELSIF has_migration_name THEN
      -- Schéma sans migration_number: journaliser par nom uniquement
      BEGIN
        INSERT INTO mobile.migration_history (migration_name, executed_at)
        VALUES ('019_add_colleague_to_incidents_proposed', NOW());
      EXCEPTION WHEN undefined_table OR undefined_column THEN
        NULL;
      END;
    ELSE
      -- Table présente mais colonnes inconnues: ne pas journaliser
      RAISE NOTICE 'migration_history présent mais colonnes incompatibles; skip logging';
    END IF;
  ELSE
    RAISE NOTICE 'Table mobile.migration_history absente; skip logging';
  END IF;
END $$;

DO $$
BEGIN
  RAISE NOTICE 'Migration 019: Colonnes colleague_id/colleague_name ajoutées à mobile.incidents_proposed';
END $$;

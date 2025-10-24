-- =====================================================
-- Rollback Migration 010: Suppression des tables de fichiers
-- =====================================================

-- Supprimer la fonction
DROP FUNCTION IF EXISTS mobile.cleanup_orphan_files() CASCADE;

-- Supprimer la vue
DROP VIEW IF EXISTS mobile.v_intervention_files_stats CASCADE;

-- Supprimer les tables
DROP TABLE IF EXISTS mobile.intervention_signatures CASCADE;
DROP TABLE IF EXISTS mobile.intervention_photos CASCADE;

-- Supprimer l'entrée de migration_history
DELETE FROM mobile.migration_history WHERE migration_number = 10;

-- Success message
DO $$
BEGIN
  RAISE NOTICE 'Rollback Migration 010: Tables de fichiers supprimées';
END $$;

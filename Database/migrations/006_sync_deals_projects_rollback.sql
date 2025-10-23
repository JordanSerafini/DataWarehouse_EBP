-- ============================================================
-- Rollback Migration 006: Sync Deals et Projects
-- ============================================================

DROP FUNCTION IF EXISTS mobile.full_sync_all();
DROP FUNCTION IF EXISTS mobile.sync_quotes(INTEGER[], INTEGER);
DROP FUNCTION IF EXISTS mobile.sync_projects_all();
DROP FUNCTION IF EXISTS mobile.sync_deals(INTEGER[]);

-- Vérification
DO $$
BEGIN
    RAISE NOTICE '✅ Rollback Migration 006 terminé';
    RAISE NOTICE '🗑️  Fonctions de sync deals/projects supprimées';
END $$;

-- ============================================================
-- Rollback Migration 005: Fonctions de synchronisation
-- ============================================================

-- Supprimer les fonctions
DROP FUNCTION IF EXISTS mobile.get_sync_stats();
DROP FUNCTION IF EXISTS mobile.get_dashboard_kpis(DATE, DATE);
DROP FUNCTION IF EXISTS mobile.get_quotes_for_salesperson(VARCHAR, INTEGER);
DROP FUNCTION IF EXISTS mobile.get_projects_for_manager(VARCHAR);
DROP FUNCTION IF EXISTS mobile.initial_sync_all();
DROP FUNCTION IF EXISTS mobile.sync_colleagues();
DROP FUNCTION IF EXISTS mobile.sync_products(INTEGER);
DROP FUNCTION IF EXISTS mobile.sync_contacts();
DROP FUNCTION IF EXISTS mobile.sync_projects(INTEGER, INTEGER);

-- Vérification
DO $$
BEGIN
    RAISE NOTICE '✅ Rollback Migration 005 terminé';
    RAISE NOTICE '🗑️  Toutes les fonctions de synchronisation ont été supprimées';
END $$;

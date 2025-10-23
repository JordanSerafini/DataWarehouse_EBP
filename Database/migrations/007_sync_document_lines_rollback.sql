-- ============================================================
-- Rollback Migration 007: Synchronisation lignes de documents
-- ============================================================

DROP FUNCTION IF EXISTS mobile.get_quote_lines_stats();
DROP FUNCTION IF EXISTS mobile.sync_quotes_with_lines(INTEGER);
DROP FUNCTION IF EXISTS mobile.sync_all_quotes(INTEGER);
DROP FUNCTION IF EXISTS mobile.sync_quote_lines();

-- Vérification
DO $$
BEGIN
    RAISE NOTICE '✅ Rollback Migration 007 terminé';
    RAISE NOTICE '🗑️  Fonctions de sync lignes supprimées';
END $$;

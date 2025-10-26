-- ============================================================
-- Rollback Migration 013 : Synchronisation automatique des collègues EBP
-- ============================================================

BEGIN;

-- Supprimer le trigger (si activé)
DROP TRIGGER IF EXISTS auto_sync_new_colleague ON public."Colleague";

-- Supprimer les fonctions
DROP FUNCTION IF EXISTS mobile.trigger_auto_sync_colleague();
DROP FUNCTION IF EXISTS mobile.sync_all_pending_colleagues(VARCHAR, VARCHAR);
DROP FUNCTION IF EXISTS mobile.sync_colleague(VARCHAR, VARCHAR, VARCHAR);

-- Supprimer la vue
DROP VIEW IF EXISTS mobile.view_colleagues;

RAISE NOTICE '✅ Migration 013 rollback appliqué avec succès';

COMMIT;

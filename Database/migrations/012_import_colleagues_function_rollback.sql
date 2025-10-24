-- ============================================================
-- Rollback Migration 012 : Import automatique des collègues EBP
-- ============================================================

BEGIN;

-- Supprimer les fonctions
DROP FUNCTION IF EXISTS mobile.reset_all_passwords(VARCHAR);
DROP FUNCTION IF EXISTS mobile.reset_user_password(UUID, VARCHAR);
DROP FUNCTION IF EXISTS mobile.import_colleagues_from_ebp(VARCHAR, VARCHAR);

RAISE NOTICE '✅ Migration 012 rollback appliqué avec succès';

COMMIT;

-- ============================================================
-- Rollback Migration 009: Suppression table users
-- ============================================================

-- Supprimer les fonctions
DROP FUNCTION IF EXISTS mobile.cleanup_expired_sessions();
DROP FUNCTION IF EXISTS mobile.revoke_user_sessions(UUID);
DROP FUNCTION IF EXISTS mobile.create_user(VARCHAR, VARCHAR, VARCHAR, VARCHAR, VARCHAR);

-- Supprimer les tables (ordre inverse des dépendances)
DROP TABLE IF EXISTS mobile.user_sessions CASCADE;
DROP TABLE IF EXISTS mobile.users CASCADE;

-- Vérification
DO $$
BEGIN
    RAISE NOTICE '✅ Rollback Migration 009 terminé';
    RAISE NOTICE '🗑️  Tables et fonctions users supprimées';
END $$;

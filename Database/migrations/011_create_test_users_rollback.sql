-- ============================================================
-- Rollback Migration 011 : Créer utilisateurs administrateurs
-- ============================================================

BEGIN;

-- Supprimer les utilisateurs administrateurs créés
DELETE FROM mobile.users
WHERE email IN ('admin@test.local', 'manager@test.local');

RAISE NOTICE '✅ Migration 011 rollback appliqué avec succès';
RAISE NOTICE '🗑️  Utilisateurs administrateurs supprimés';

COMMIT;

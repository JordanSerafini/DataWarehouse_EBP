-- ============================================================
-- Rollback Migration 014 : Retour à l'ancien mapping Colleague
-- ============================================================

BEGIN;

-- Supprimer les fonctions améliorées
DROP FUNCTION IF EXISTS mobile.sync_all_pending_colleagues(VARCHAR, VARCHAR);
DROP FUNCTION IF EXISTS mobile.update_existing_colleagues();

-- Note: Les données utilisateurs ne sont PAS supprimées lors du rollback
-- car cela pourrait causer des pertes de données.
-- Si vous devez revenir aux anciennes fonctions, vous devrez :
-- 1. Sauvegarder les données utilisateurs importantes
-- 2. Supprimer manuellement les utilisateurs concernés
-- 3. Recréer les anciennes fonctions de sync

RAISE NOTICE '⚠️  Migration 014 rollback effectué';
RAISE NOTICE '⚠️  Les utilisateurs existants n''ont PAS été supprimés';
RAISE NOTICE '⚠️  Vous devez manuellement restaurer les anciennes fonctions de sync si nécessaire';

COMMIT;

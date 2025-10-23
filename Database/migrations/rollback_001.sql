-- Rollback Migration 001: Suppression schéma mobile
-- Date: 2025-10-23
-- Description: Rollback SAFE - supprime uniquement le schéma mobile
--
-- PRINCIPE: Zero impact sur EBP

-- ============================================================================
-- ROLLBACK MIGRATION 001
-- ============================================================================

-- Supprimer les index créés sur tables EBP (optionnel - ne font pas de mal)
DROP INDEX IF EXISTS public.idx_scheduleevent_dates;
DROP INDEX IF EXISTS public.idx_scheduleevent_colleague;
DROP INDEX IF EXISTS public.idx_scheduleevent_gps;
DROP INDEX IF EXISTS public.idx_customer_active;
DROP INDEX IF EXISTS public.idx_customer_delivery_gps;
DROP INDEX IF EXISTS public.idx_activity_date;
DROP INDEX IF EXISTS public.idx_activity_linked;

-- Supprimer le schéma mobile et tout son contenu
DROP SCHEMA IF EXISTS mobile CASCADE;

-- Log rollback
DO $$
BEGIN
    RAISE NOTICE 'Rollback 001 terminé';
    RAISE NOTICE 'Schéma mobile supprimé';
    RAISE NOTICE 'Index performance supprimés (optionnel)';
    RAISE NOTICE 'Tables EBP intactes - Zero impact';
END $$;

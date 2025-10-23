-- Rollback Migration 002: Nettoyage GPS
-- Date: 2025-10-23
-- Description: Rollback PARTIEL - ne peut pas supprimer les GPS mis à jour
--
-- ATTENTION: Les coordonnées GPS ajoutées ne seront PAS supprimées
-- (c'est voulu - les données sont utiles même sans app mobile)

-- ============================================================================
-- ROLLBACK MIGRATION 002
-- ============================================================================

-- Supprimer le trigger auto GPS (si activé)
DROP TRIGGER IF EXISTS trg_auto_set_event_gps ON public."ScheduleEvent";
DROP FUNCTION IF EXISTS mobile.auto_set_event_gps();

-- Supprimer les fonctions
DROP FUNCTION IF EXISTS mobile.inherit_customer_gps();

-- Supprimer la procédure
DROP PROCEDURE IF EXISTS mobile.update_customer_gps(VARCHAR, DECIMAL, DECIMAL, VARCHAR, DECIMAL);

-- Supprimer les vues
DROP VIEW IF EXISTS mobile.v_customers_to_geocode;
DROP VIEW IF EXISTS mobile.v_events_to_geocode;

-- Supprimer la table log
DROP TABLE IF EXISTS mobile.geocoding_log;

-- Log rollback
DO $$
BEGIN
    RAISE NOTICE 'Rollback 002 terminé';
    RAISE NOTICE 'Fonctions/vues GPS supprimées';
    RAISE NOTICE '';
    RAISE NOTICE '⚠️  ATTENTION:';
    RAISE NOTICE 'Les coordonnées GPS dans Customer et ScheduleEvent sont CONSERVÉES';
    RAISE NOTICE '(elles restent utiles même sans app mobile)';
    RAISE NOTICE '';
    RAISE NOTICE 'Pour supprimer les GPS (NON RECOMMANDÉ):';
    RAISE NOTICE '  UPDATE public."Customer" SET "MainDeliveryAddress_Latitude" = NULL, "MainDeliveryAddress_Longitude" = NULL;';
    RAISE NOTICE '  UPDATE public."ScheduleEvent" SET "Address_Latitude" = NULL, "Address_Longitude" = NULL;';
END $$;

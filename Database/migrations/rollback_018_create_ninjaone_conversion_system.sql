-- =====================================================
-- Rollback Migration 018: Système de conversion NinjaOne
-- Description: Suppression des tables de propositions et fonctions de conversion
-- Date: 2025-10-31
-- =====================================================

-- Supprimer les vues
DROP VIEW IF EXISTS mobile.v_all_proposals CASCADE;

-- Supprimer les fonctions
DROP FUNCTION IF EXISTS mobile.get_ninjaone_conversion_stats() CASCADE;
DROP FUNCTION IF EXISTS mobile.convert_ninjaone_ticket(INTEGER, VARCHAR, UUID) CASCADE;

-- Supprimer les triggers
DROP TRIGGER IF EXISTS trigger_interventions_proposed_updated ON mobile.interventions_proposed;
DROP TRIGGER IF EXISTS trigger_incidents_proposed_updated ON mobile.incidents_proposed;

-- Supprimer les tables
DROP TABLE IF EXISTS mobile.incidents_proposed CASCADE;
DROP TABLE IF EXISTS mobile.interventions_proposed CASCADE;

-- Message de confirmation
DO $$
BEGIN
    RAISE NOTICE '✅ Rollback migration 018 terminé avec succès';
    RAISE NOTICE '🗑️  Tables supprimées:';
    RAISE NOTICE '   - mobile.interventions_proposed';
    RAISE NOTICE '   - mobile.incidents_proposed';
    RAISE NOTICE '🗑️  Vues supprimées:';
    RAISE NOTICE '   - mobile.v_all_proposals';
    RAISE NOTICE '🗑️  Fonctions supprimées:';
    RAISE NOTICE '   - mobile.convert_ninjaone_ticket()';
    RAISE NOTICE '   - mobile.get_ninjaone_conversion_stats()';
END $$;

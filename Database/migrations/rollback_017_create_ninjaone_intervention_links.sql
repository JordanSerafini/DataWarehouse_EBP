-- =====================================================
-- Rollback Migration 017: Liaison NinjaOne ↔ Interventions EBP
-- Description: Suppression complète des tables de liaison et mapping
-- Date: 2025-10-31
-- =====================================================

-- Supprimer les vues (ordre important: vues avant tables)
DROP VIEW IF EXISTS mobile.v_ninjaone_tickets_unconverted CASCADE;
DROP VIEW IF EXISTS mobile.v_ninjaone_interventions CASCADE;

-- Supprimer les fonctions
DROP FUNCTION IF EXISTS mobile.auto_map_ninjaone_technicians() CASCADE;
DROP FUNCTION IF EXISTS mobile.auto_map_ninjaone_organizations() CASCADE;
DROP FUNCTION IF EXISTS mobile.update_ninjaone_links_timestamp() CASCADE;

-- Supprimer les triggers
DROP TRIGGER IF EXISTS trigger_ninjaone_links_updated ON mobile.ninjaone_intervention_links;

-- Supprimer les tables (ordre important: tables avec FK avant celles référencées)
DROP TABLE IF EXISTS mobile.ninjaone_intervention_links CASCADE;
DROP TABLE IF EXISTS mobile.ninjaone_technician_mapping CASCADE;
DROP TABLE IF EXISTS mobile.ninjaone_customer_mapping CASCADE;

-- Message de confirmation
DO $$
BEGIN
    RAISE NOTICE '✅ Rollback migration 017 terminé avec succès';
    RAISE NOTICE '🗑️  Tables supprimées:';
    RAISE NOTICE '   - mobile.ninjaone_intervention_links';
    RAISE NOTICE '   - mobile.ninjaone_customer_mapping';
    RAISE NOTICE '   - mobile.ninjaone_technician_mapping';
    RAISE NOTICE '🗑️  Vues supprimées:';
    RAISE NOTICE '   - mobile.v_ninjaone_interventions';
    RAISE NOTICE '   - mobile.v_ninjaone_tickets_unconverted';
    RAISE NOTICE '🗑️  Fonctions supprimées:';
    RAISE NOTICE '   - mobile.auto_map_ninjaone_organizations()';
    RAISE NOTICE '   - mobile.auto_map_ninjaone_technicians()';
END $$;

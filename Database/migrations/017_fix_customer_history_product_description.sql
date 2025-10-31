-- Migration 017: Correction définitive du type product_description dans get_customer_history
-- Date: 2025-10-31
-- Description: Corrige l'incompatibilité de type entre la fonction et la vue v_interventions
-- Le problème: la fonction déclarait VARCHAR mais la vue retourne TEXT

-- ============================================================================
-- ÉTAPE 1: Supprimer l'ancienne fonction
-- ============================================================================
DROP FUNCTION IF EXISTS mobile.get_customer_history(VARCHAR, INTEGER);

-- ============================================================================
-- ÉTAPE 2: Recréer la fonction avec product_description en TEXT
-- ============================================================================
CREATE FUNCTION mobile.get_customer_history(
    p_customer_id VARCHAR,
    p_limit INTEGER DEFAULT 50
)
RETURNS TABLE(
    intervention_id VARCHAR,
    title VARCHAR,
    description TEXT,
    start_date TIMESTAMP,
    end_date TIMESTAMP,
    technician_name VARCHAR,
    product_description TEXT,  -- ✅ Corrigé: VARCHAR → TEXT
    created_at TIMESTAMP
)
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN QUERY
    SELECT
        vi.intervention_id,
        vi.title,
        vi.description,
        vi.start_date,
        vi.end_date,
        vi.technician_name,
        vi.product_description,
        vi.created_at
    FROM mobile.v_interventions vi
    WHERE vi.customer_id = p_customer_id
    ORDER BY vi.start_date DESC
    LIMIT p_limit;
END;
$$;

COMMENT ON FUNCTION mobile.get_customer_history(VARCHAR, INTEGER) IS
    'Historique des interventions d''un client (product_description corrigé en TEXT)';

-- ============================================================================
-- VÉRIFICATION
-- ============================================================================
DO $$
BEGIN
    RAISE NOTICE '';
    RAISE NOTICE '=================================================================';
    RAISE NOTICE 'Migration 017 appliquée avec succès';
    RAISE NOTICE '=================================================================';
    RAISE NOTICE '';
    RAISE NOTICE '✅ Fonction mobile.get_customer_history() recréée';
    RAISE NOTICE '   - product_description: VARCHAR → TEXT';
    RAISE NOTICE '   - Compatible avec mobile.v_interventions';
    RAISE NOTICE '';
    RAISE NOTICE 'Impact:';
    RAISE NOTICE '   - Fix erreur 500 sur endpoint GET /api/v1/customers/:id';
    RAISE NOTICE '   - Fix erreur "structure of query does not match function result type"';
    RAISE NOTICE '';
END;
$$;

-- Rollback Migration 017: Restaurer l'ancienne version (avec bug)
-- Note: Ce rollback restaure l'état bugué pour compatibilité historique uniquement

-- ============================================================================
-- RESTAURER L'ANCIENNE FONCTION (avec bug VARCHAR)
-- ============================================================================
DROP FUNCTION IF EXISTS mobile.get_customer_history(VARCHAR, INTEGER);

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
    product_description VARCHAR,  -- ⚠️ Bug: devrait être TEXT
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
        vi.product_description::VARCHAR,  -- Cast forcé
        vi.created_at
    FROM mobile.v_interventions vi
    WHERE vi.customer_id = p_customer_id
    ORDER BY vi.start_date DESC
    LIMIT p_limit;
END;
$$;

COMMENT ON FUNCTION mobile.get_customer_history(VARCHAR, INTEGER) IS
    'Historique des interventions d''un client (version avec bug VARCHAR restaurée)';

DO $$
BEGIN
    RAISE NOTICE '';
    RAISE NOTICE '=================================================================';
    RAISE WARNING 'Rollback 017 appliqué - état bugué restauré';
    RAISE NOTICE '=================================================================';
    RAISE NOTICE '';
    RAISE WARNING '⚠️ Fonction mobile.get_customer_history() restaurée avec bug';
    RAISE WARNING '   - product_description: TEXT → VARCHAR (incompatible)';
    RAISE WARNING '   - Erreur 500 sur GET /api/v1/customers/:id va réapparaître';
    RAISE NOTICE '';
END;
$$;

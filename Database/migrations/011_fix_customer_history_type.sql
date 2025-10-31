-- ============================================================
-- Migration 011: Correction type product_description dans get_customer_history
-- ============================================================
-- Problème: get_customer_history() déclare product_description comme VARCHAR(255)
-- mais mobile.v_interventions retourne TEXT (venant de CustomerProduct.DescriptionClear)
-- Erreur: "Returned type text does not match expected type character varying"
-- ============================================================

-- Recréer la fonction avec le bon type TEXT
CREATE OR REPLACE FUNCTION mobile.get_customer_history(
    p_customer_id VARCHAR(50),
    p_limit INTEGER DEFAULT 50
)
RETURNS TABLE (
    intervention_id VARCHAR(50),
    title VARCHAR(80),
    description TEXT,
    start_date TIMESTAMP,
    end_date TIMESTAMP,
    technician_name VARCHAR(60),
    product_description TEXT,  -- Changé de VARCHAR(255) à TEXT
    created_at TIMESTAMP
) AS $$
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
$$ LANGUAGE plpgsql;

COMMENT ON FUNCTION mobile.get_customer_history(VARCHAR, INTEGER) IS 'Historique des interventions d''un client (type TEXT corrigé pour product_description)';

-- ============================================================
-- Vérifier également get_technician_interventions
-- ============================================================

-- Recréer avec le bon type TEXT
CREATE OR REPLACE FUNCTION mobile.get_technician_interventions(
    p_technician_id VARCHAR(50),
    p_date_from TIMESTAMP DEFAULT NOW() - INTERVAL '7 days',
    p_date_to TIMESTAMP DEFAULT NOW() + INTERVAL '30 days'
)
RETURNS TABLE (
    intervention_id VARCHAR(50),
    title VARCHAR(80),
    description TEXT,
    customer_name VARCHAR(60),
    contact_phone VARCHAR(20),
    address TEXT,
    city VARCHAR(35),
    latitude NUMERIC(20,8),
    longitude NUMERIC(20,8),
    start_date TIMESTAMP,
    end_date TIMESTAMP,
    product_description TEXT  -- Changé de VARCHAR(255) à TEXT
) AS $$
BEGIN
    RETURN QUERY
    SELECT
        vi.intervention_id,
        vi.title,
        vi.description,
        vi.customer_name,
        COALESCE(vi.contact_mobile, vi.contact_phone) as contact_phone,
        vi.address,
        vi.city,
        vi.latitude,
        vi.longitude,
        vi.start_date,
        vi.end_date,
        vi.product_description
    FROM mobile.v_interventions vi
    WHERE vi.technician_id = p_technician_id
      AND vi.start_date >= p_date_from
      AND vi.start_date <= p_date_to
    ORDER BY vi.start_date ASC;
END;
$$ LANGUAGE plpgsql;

COMMENT ON FUNCTION mobile.get_technician_interventions(VARCHAR, TIMESTAMP, TIMESTAMP) IS 'Récupère les interventions d''un technicien (type TEXT corrigé pour product_description)';

-- ============================================================
-- FIN MIGRATION 011
-- ============================================================

DO $$
BEGIN
    RAISE NOTICE '✅ Migration 011 terminée avec succès';
    RAISE NOTICE '🔧 Fonctions corrigées:';
    RAISE NOTICE '   - mobile.get_customer_history() - product_description VARCHAR(255) → TEXT';
    RAISE NOTICE '   - mobile.get_technician_interventions() - product_description VARCHAR(255) → TEXT';
    RAISE NOTICE '📝 Raison: CustomerProduct.DescriptionClear est de type TEXT dans la base EBP';
END $$;

-- Migration 016: Créer table mobile.customer_gps
-- Date: 2025-10-28
-- Description: Table de tracking GPS pour les clients

-- ============================================================================
-- Créer la table customer_gps pour stocker les coordonnées GPS des clients
-- ============================================================================

CREATE TABLE IF NOT EXISTS mobile.customer_gps (
    customer_id VARCHAR(20) PRIMARY KEY,
    latitude NUMERIC(10, 8),
    longitude NUMERIC(11, 8),
    gps_provider VARCHAR(50) DEFAULT 'manual',
    gps_quality NUMERIC(3, 2) DEFAULT 1.0,
    geocoded_at TIMESTAMP DEFAULT NOW(),
    geocoded_address TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Index pour recherche géographique
CREATE INDEX IF NOT EXISTS idx_customer_gps_coords
    ON mobile.customer_gps(latitude, longitude);

-- Index pour tracking qualité
CREATE INDEX IF NOT EXISTS idx_customer_gps_quality
    ON mobile.customer_gps(gps_quality);

-- ============================================================================
-- Fonction pour mettre à jour les coordonnées GPS d'un client
-- ============================================================================

CREATE OR REPLACE FUNCTION mobile.update_customer_gps(
    p_customer_id VARCHAR(20),
    p_latitude NUMERIC(10, 8),
    p_longitude NUMERIC(11, 8),
    p_provider VARCHAR(50) DEFAULT 'manual',
    p_quality NUMERIC(3, 2) DEFAULT 1.0
)
RETURNS VOID AS $$
BEGIN
    INSERT INTO mobile.customer_gps (
        customer_id,
        latitude,
        longitude,
        gps_provider,
        gps_quality,
        geocoded_at,
        updated_at
    ) VALUES (
        p_customer_id,
        p_latitude,
        p_longitude,
        p_provider,
        p_quality,
        NOW(),
        NOW()
    )
    ON CONFLICT (customer_id) DO UPDATE SET
        latitude = EXCLUDED.latitude,
        longitude = EXCLUDED.longitude,
        gps_provider = EXCLUDED.gps_provider,
        gps_quality = EXCLUDED.gps_quality,
        geocoded_at = NOW(),
        updated_at = NOW();
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- Procédure pour mettre à jour les coordonnées GPS (pour CALL)
-- ============================================================================

CREATE OR REPLACE PROCEDURE mobile.update_customer_gps(
    p_customer_id VARCHAR(20),
    p_latitude NUMERIC(10, 8),
    p_longitude NUMERIC(11, 8),
    p_provider VARCHAR(50) DEFAULT 'manual',
    p_quality NUMERIC(3, 2) DEFAULT 1.0
)
LANGUAGE plpgsql AS $$
BEGIN
    PERFORM mobile.update_customer_gps(
        p_customer_id,
        p_latitude,
        p_longitude,
        p_provider,
        p_quality
    );
END;
$$;

-- ============================================================================
-- Peupler avec les coordonnées GPS existantes depuis Customer
-- ============================================================================

INSERT INTO mobile.customer_gps (customer_id, latitude, longitude, gps_provider, gps_quality)
SELECT
    "Id",
    "MainDeliveryAddress_Latitude",
    "MainDeliveryAddress_Longitude",
    'ebp_import',
    1.0
FROM public."Customer"
WHERE "MainDeliveryAddress_Latitude" IS NOT NULL
  AND "MainDeliveryAddress_Longitude" IS NOT NULL
ON CONFLICT (customer_id) DO NOTHING;

-- ============================================================================
-- Statistiques
-- ============================================================================

DO $$
DECLARE
    v_total_customers INTEGER;
    v_customers_with_gps INTEGER;
    v_percentage NUMERIC(5,2);
BEGIN
    SELECT COUNT(*) INTO v_total_customers FROM public."Customer";
    SELECT COUNT(*) INTO v_customers_with_gps FROM mobile.customer_gps;

    v_percentage := ROUND((v_customers_with_gps::NUMERIC / NULLIF(v_total_customers, 0)) * 100, 2);

    RAISE NOTICE '';
    RAISE NOTICE '════════════════════════════════════════════════════════';
    RAISE NOTICE '   ✅ Table mobile.customer_gps créée avec succès';
    RAISE NOTICE '════════════════════════════════════════════════════════';
    RAISE NOTICE '';
    RAISE NOTICE '📊 Statistiques:';
    RAISE NOTICE '  • Total clients: %', v_total_customers;
    RAISE NOTICE '  • Clients avec GPS: % (%%)', v_customers_with_gps, v_percentage;
    RAISE NOTICE '';
    RAISE NOTICE '💡 Fonctions créées:';
    RAISE NOTICE '  • mobile.update_customer_gps() - Fonction';
    RAISE NOTICE '  • mobile.update_customer_gps() - Procédure (CALL)';
    RAISE NOTICE '';
END $$;

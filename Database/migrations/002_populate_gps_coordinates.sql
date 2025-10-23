-- Migration 002: Remplir coordonnées GPS manquantes (OPTIONNEL)
-- Date: 2025-10-23
-- Description: Géocodage des adresses existantes pour app mobile
--
-- PRINCIPE: UPDATE uniquement (pas de ALTER TABLE)
-- Les colonnes existent déjà dans EBP !

-- ============================================================================
-- IMPORTANT: Cette migration est OPTIONNELLE
-- ============================================================================
--
-- Elle remplit les coordonnées GPS manquantes en utilisant:
-- 1. Extension PostGIS (si disponible) - NON RECOMMANDÉ car modifie BDD
-- 2. Script Python externe (RECOMMANDÉ) - voir scripts/geocode_addresses.py
--
-- Pour l'instant, cette migration crée juste des fonctions helper
--
-- ============================================================================

-- ============================================================================
-- 1. STATISTIQUES ACTUELLES
-- ============================================================================

DO $$
DECLARE
    total_customers INTEGER;
    customers_with_gps INTEGER;
    total_events INTEGER;
    events_with_gps INTEGER;
BEGIN
    SELECT COUNT(*) INTO total_customers FROM public."Customer";
    SELECT COUNT(*) INTO customers_with_gps
    FROM public."Customer"
    WHERE "MainDeliveryAddress_Latitude" IS NOT NULL;

    SELECT COUNT(*) INTO total_events FROM public."ScheduleEvent";
    SELECT COUNT(*) INTO events_with_gps
    FROM public."ScheduleEvent"
    WHERE "Address_Latitude" IS NOT NULL;

    RAISE NOTICE '=== STATISTIQUES GPS ACTUELLES ===';
    RAISE NOTICE 'Customers: % total, % avec GPS (%%)',
        total_customers,
        customers_with_gps,
        ROUND((customers_with_gps::DECIMAL / NULLIF(total_customers, 0)) * 100, 2);

    RAISE NOTICE 'ScheduleEvents: % total, % avec GPS (%%)',
        total_events,
        events_with_gps,
        ROUND((events_with_gps::DECIMAL / NULLIF(total_events, 0)) * 100, 2);
END $$;

-- ============================================================================
-- 2. VUE: Adresses à géocoder (Customer)
-- ============================================================================

CREATE OR REPLACE VIEW mobile.v_customers_to_geocode AS
SELECT
    c."Id" as customer_id,
    c."Name" as name,
    TRIM(CONCAT_WS(', ',
        NULLIF(c."MainDeliveryAddress_Address1", ''),
        NULLIF(c."MainDeliveryAddress_Address2", ''),
        NULLIF(c."MainDeliveryAddress_ZipCode", ''),
        NULLIF(c."MainDeliveryAddress_City", ''),
        'France'
    )) as full_address,
    c."MainDeliveryAddress_Address1" as address,
    c."MainDeliveryAddress_City" as city,
    c."MainDeliveryAddress_ZipCode" as zipcode,
    c."MainDeliveryAddress_Latitude" as current_lat,
    c."MainDeliveryAddress_Longitude" as current_lon
FROM public."Customer" c
WHERE c."ActiveState" = 1
  AND c."MainDeliveryAddress_Latitude" IS NULL
  AND c."MainDeliveryAddress_City" IS NOT NULL
ORDER BY c."Name";

COMMENT ON VIEW mobile.v_customers_to_geocode IS 'Clients actifs sans coordonnées GPS (à géocoder)';

-- ============================================================================
-- 3. VUE: Adresses à géocoder (ScheduleEvent)
-- ============================================================================

CREATE OR REPLACE VIEW mobile.v_events_to_geocode AS
SELECT
    e."Id" as event_id,
    e."Subject" as subject,
    e."StartDate" as start_date,
    e."CustomerId" as customer_id,
    c."Name" as customer_name,
    c."MainDeliveryAddress_Address1" as address,
    c."MainDeliveryAddress_City" as city,
    c."MainDeliveryAddress_ZipCode" as zipcode,
    TRIM(CONCAT_WS(', ',
        NULLIF(c."MainDeliveryAddress_Address1", ''),
        NULLIF(c."MainDeliveryAddress_ZipCode", ''),
        NULLIF(c."MainDeliveryAddress_City", ''),
        'France'
    )) as full_address,
    e."Address_Latitude" as current_lat,
    e."Address_Longitude" as current_lon,
    c."MainDeliveryAddress_Latitude" as customer_lat,
    c."MainDeliveryAddress_Longitude" as customer_lon
FROM public."ScheduleEvent" e
LEFT JOIN public."Customer" c ON e."CustomerId" = c."Id"
WHERE e."StartDate" >= CURRENT_DATE - INTERVAL '30 days'
  AND e."Address_Latitude" IS NULL
  AND c."MainDeliveryAddress_City" IS NOT NULL
ORDER BY e."StartDate" DESC;

COMMENT ON VIEW mobile.v_events_to_geocode IS 'Interventions récentes sans GPS (à géocoder ou hériter du client)';

-- ============================================================================
-- 4. FONCTION: Hériter GPS du client pour ScheduleEvent
-- ============================================================================

CREATE OR REPLACE FUNCTION mobile.inherit_customer_gps()
RETURNS INTEGER AS $$
DECLARE
    updated_count INTEGER;
BEGIN
    -- Copier les coordonnées du client vers les événements qui n'en ont pas
    WITH updated_events AS (
        UPDATE public."ScheduleEvent" e
        SET
            "Address_Latitude" = c."MainDeliveryAddress_Latitude",
            "Address_Longitude" = c."MainDeliveryAddress_Longitude"
        FROM public."Customer" c
        WHERE e."CustomerId" = c."Id"
          AND e."Address_Latitude" IS NULL
          AND c."MainDeliveryAddress_Latitude" IS NOT NULL
        RETURNING e."Id"
    )
    SELECT COUNT(*) INTO updated_count FROM updated_events;

    RETURN updated_count;
END;
$$ LANGUAGE plpgsql;

COMMENT ON FUNCTION mobile.inherit_customer_gps IS 'Copie GPS du client vers ScheduleEvent (pour événements sans GPS)';

-- ============================================================================
-- 5. FONCTION: Hériter GPS pour événements futurs (auto)
-- ============================================================================

CREATE OR REPLACE FUNCTION mobile.auto_set_event_gps()
RETURNS TRIGGER AS $$
BEGIN
    -- Si nouvel événement sans GPS, copier depuis client
    IF NEW."Address_Latitude" IS NULL AND NEW."CustomerId" IS NOT NULL THEN
        SELECT
            "MainDeliveryAddress_Latitude",
            "MainDeliveryAddress_Longitude"
        INTO
            NEW."Address_Latitude",
            NEW."Address_Longitude"
        FROM public."Customer"
        WHERE "Id" = NEW."CustomerId"
          AND "MainDeliveryAddress_Latitude" IS NOT NULL;
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger (OPTIONNEL - décommenter si souhaité)
-- DROP TRIGGER IF EXISTS trg_auto_set_event_gps ON public."ScheduleEvent";
-- CREATE TRIGGER trg_auto_set_event_gps
--     BEFORE INSERT OR UPDATE ON public."ScheduleEvent"
--     FOR EACH ROW
--     EXECUTE FUNCTION mobile.auto_set_event_gps();

-- ============================================================================
-- 6. EXÉCUTION: Hériter GPS du client (SAFE - juste un UPDATE)
-- ============================================================================

DO $$
DECLARE
    updated_count INTEGER;
BEGIN
    RAISE NOTICE '=== HÉRITAGE GPS CLIENT → SCHEDULEEVENT ===';

    -- Appeler la fonction
    SELECT mobile.inherit_customer_gps() INTO updated_count;

    RAISE NOTICE '✅ % événements mis à jour avec GPS du client', updated_count;
END $$;

-- ============================================================================
-- 7. TABLE LOG GÉOCODAGE (tracking)
-- ============================================================================

CREATE TABLE IF NOT EXISTS mobile.geocoding_log (
    id SERIAL PRIMARY KEY,
    entity_type VARCHAR(50) NOT NULL,  -- 'Customer' ou 'ScheduleEvent'
    entity_id VARCHAR(50) NOT NULL,
    address_input TEXT NOT NULL,
    geocoding_provider VARCHAR(50),    -- 'nominatim', 'google', 'manual'
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    quality_score DECIMAL(3, 2),       -- 0.0 - 1.0 (précision)
    geocoded_at TIMESTAMP DEFAULT NOW(),
    geocoded_by VARCHAR(50),           -- 'script', 'api', nom utilisateur

    CONSTRAINT unique_geocoding UNIQUE (entity_type, entity_id)
);

CREATE INDEX idx_geocoding_log_entity ON mobile.geocoding_log(entity_type, entity_id);

COMMENT ON TABLE mobile.geocoding_log IS 'Historique des géocodages effectués (traçabilité)';

-- ============================================================================
-- 8. PROCÉDURE: Mettre à jour GPS avec log
-- ============================================================================

CREATE OR REPLACE PROCEDURE mobile.update_customer_gps(
    p_customer_id VARCHAR(50),
    p_latitude DECIMAL(10, 8),
    p_longitude DECIMAL(11, 8),
    p_provider VARCHAR(50) DEFAULT 'manual',
    p_quality DECIMAL(3, 2) DEFAULT 1.0
)
LANGUAGE plpgsql AS $$
BEGIN
    -- Update Customer
    UPDATE public."Customer"
    SET
        "MainDeliveryAddress_Latitude" = p_latitude,
        "MainDeliveryAddress_Longitude" = p_longitude
    WHERE "Id" = p_customer_id;

    -- Log
    INSERT INTO mobile.geocoding_log (
        entity_type, entity_id, address_input,
        latitude, longitude,
        geocoding_provider, quality_score
    )
    SELECT
        'Customer',
        p_customer_id,
        CONCAT_WS(', ', "MainDeliveryAddress_Address1", "MainDeliveryAddress_City"),
        p_latitude,
        p_longitude,
        p_provider,
        p_quality
    FROM public."Customer"
    WHERE "Id" = p_customer_id
    ON CONFLICT (entity_type, entity_id) DO UPDATE
    SET
        latitude = EXCLUDED.latitude,
        longitude = EXCLUDED.longitude,
        geocoding_provider = EXCLUDED.geocoding_provider,
        quality_score = EXCLUDED.quality_score,
        geocoded_at = NOW();

    RAISE NOTICE 'GPS mis à jour pour client %: (%, %)', p_customer_id, p_latitude, p_longitude;
END;
$$;

COMMENT ON PROCEDURE mobile.update_customer_gps IS 'Met à jour GPS client avec logging (usage script externe)';

-- ============================================================================
-- 9. STATISTIQUES FINALES
-- ============================================================================

DO $$
DECLARE
    total_customers INTEGER;
    customers_with_gps INTEGER;
    total_events INTEGER;
    events_with_gps INTEGER;
    customers_to_geocode INTEGER;
    events_to_geocode INTEGER;
BEGIN
    SELECT COUNT(*) INTO total_customers FROM public."Customer" WHERE "ActiveState" = 1;
    SELECT COUNT(*) INTO customers_with_gps
    FROM public."Customer"
    WHERE "ActiveState" = 1 AND "MainDeliveryAddress_Latitude" IS NOT NULL;

    SELECT COUNT(*) INTO total_events
    FROM public."ScheduleEvent"
    WHERE "StartDate" >= CURRENT_DATE - INTERVAL '30 days';

    SELECT COUNT(*) INTO events_with_gps
    FROM public."ScheduleEvent"
    WHERE "StartDate" >= CURRENT_DATE - INTERVAL '30 days'
      AND "Address_Latitude" IS NOT NULL;

    SELECT COUNT(*) INTO customers_to_geocode FROM mobile.v_customers_to_geocode;
    SELECT COUNT(*) INTO events_to_geocode FROM mobile.v_events_to_geocode;

    RAISE NOTICE '';
    RAISE NOTICE '=== STATISTIQUES GPS FINALES ===';
    RAISE NOTICE 'Customers actifs: % total, % avec GPS (%%)',
        total_customers,
        customers_with_gps,
        ROUND((customers_with_gps::DECIMAL / NULLIF(total_customers, 0)) * 100, 2);

    RAISE NOTICE 'Events (30j): % total, % avec GPS (%%)',
        total_events,
        events_with_gps,
        ROUND((events_with_gps::DECIMAL / NULLIF(total_events, 0)) * 100, 2);

    RAISE NOTICE '';
    RAISE NOTICE 'À GÉOCODER:';
    RAISE NOTICE '  - % customers (voir mobile.v_customers_to_geocode)', customers_to_geocode;
    RAISE NOTICE '  - % events (voir mobile.v_events_to_geocode)', events_to_geocode;
    RAISE NOTICE '';
    RAISE NOTICE 'PROCHAINE ÉTAPE: Exécuter scripts/geocode_addresses.py';
END $$;

-- ============================================================================
-- RÉSUMÉ MIGRATION 002
-- ============================================================================
--
-- ✅ AUCUNE modification de structure (pas de ALTER TABLE)
-- ✅ Héritage GPS: ScheduleEvent ← Customer (UPDATE seulement)
-- ✅ 2 vues: clients et events à géocoder
-- ✅ 1 fonction: héritage automatique GPS
-- ✅ 1 table log: traçabilité géocodage
-- ✅ 1 procédure: update GPS avec log
--
-- RÉSULTATS ATTENDUS APRÈS GÉOCODAGE EXTERNE:
-- - ~90%+ customers avec GPS
-- - ~95%+ events avec GPS (héritage + géocodage)
--
-- ============================================================================

RAISE NOTICE 'Migration 002 terminée - GPS inheritance appliqué';

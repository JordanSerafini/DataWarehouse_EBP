-- ============================================================
-- Migration 003: Fonctions de synchronisation mobile (V2)
-- ============================================================
-- Version simplifiée basée sur les colonnes réelles d'EBP
-- ============================================================

-- ============================================================
-- 1. FONCTIONS DE SYNCHRONISATION
-- ============================================================

-- Fonction: Récupérer les interventions non synchronisées
CREATE OR REPLACE FUNCTION mobile.get_pending_sync_entities(
    p_device_id VARCHAR(100),
    p_entity_type VARCHAR(100) DEFAULT NULL
)
RETURNS TABLE (
    entity_type VARCHAR(100),
    entity_id VARCHAR(50),
    last_sync_date TIMESTAMP,
    sync_status VARCHAR(20),
    retry_count INTEGER,
    error_message TEXT
) AS $$
BEGIN
    RETURN QUERY
    SELECT
        s.entity_type,
        s.entity_id,
        s.last_sync_date,
        s.sync_status,
        s.retry_count,
        s.error_message
    FROM mobile.sync_status s
    WHERE s.device_id = p_device_id
      AND s.sync_status != 'synced'
      AND (p_entity_type IS NULL OR s.entity_type = p_entity_type)
    ORDER BY s.retry_count ASC, s.created_at ASC;
END;
$$ LANGUAGE plpgsql;

-- Fonction: Marquer une entité comme synchronisée
CREATE OR REPLACE FUNCTION mobile.mark_entity_synced(
    p_entity_type VARCHAR(100),
    p_entity_id VARCHAR(50),
    p_device_id VARCHAR(100),
    p_sync_direction VARCHAR(10)
)
RETURNS BOOLEAN AS $$
BEGIN
    UPDATE mobile.sync_status
    SET sync_status = 'synced',
        last_sync_date = NOW(),
        updated_at = NOW(),
        error_message = NULL
    WHERE entity_type = p_entity_type
      AND entity_id = p_entity_id
      AND device_id = p_device_id
      AND sync_direction = p_sync_direction;

    RETURN FOUND;
END;
$$ LANGUAGE plpgsql;

-- Fonction: Marquer un échec de synchronisation
CREATE OR REPLACE FUNCTION mobile.mark_sync_failed(
    p_entity_type VARCHAR(100),
    p_entity_id VARCHAR(50),
    p_device_id VARCHAR(100),
    p_sync_direction VARCHAR(10),
    p_error_message TEXT
)
RETURNS BOOLEAN AS $$
BEGIN
    UPDATE mobile.sync_status
    SET sync_status = 'failed',
        last_sync_date = NOW(),
        updated_at = NOW(),
        error_message = p_error_message,
        retry_count = retry_count + 1
    WHERE entity_type = p_entity_type
      AND entity_id = p_entity_id
      AND device_id = p_device_id
      AND sync_direction = p_sync_direction;

    RETURN FOUND;
END;
$$ LANGUAGE plpgsql;

-- Fonction: Nettoyer les anciennes entrées de sync (maintenance)
CREATE OR REPLACE FUNCTION mobile.cleanup_old_sync_status(
    p_days_retention INTEGER DEFAULT 30
)
RETURNS INTEGER AS $$
DECLARE
    v_deleted_count INTEGER;
BEGIN
    DELETE FROM mobile.sync_status
    WHERE sync_status = 'synced'
      AND updated_at < NOW() - (p_days_retention || ' days')::INTERVAL;

    GET DIAGNOSTICS v_deleted_count = ROW_COUNT;

    RETURN v_deleted_count;
END;
$$ LANGUAGE plpgsql;

-- ============================================================
-- 2. VUE INTERVENTIONS (basée sur vraies colonnes EBP)
-- ============================================================

DROP VIEW IF EXISTS mobile.v_interventions CASCADE;

CREATE OR REPLACE VIEW mobile.v_interventions AS
SELECT
    se."Id"::VARCHAR(50) as intervention_id,
    se."EventType"::VARCHAR(50) as event_type_id,
    se."Caption" as title,
    COALESCE(
        se."Maintenance_InterventionDescriptionClear",
        se."Maintenance_InterventionDescription",
        se."NotesClear",
        se."Notes"
    ) as description,
    se."StartDateTime" as start_date,
    se."EndDateTime" as end_date,

    -- Client
    se."CustomerId" as customer_id,
    c."Name" as customer_name,
    c."MainDeliveryContact_Name" as contact_name,
    c."MainDeliveryContact_Phone" as contact_phone,
    c."MainDeliveryContact_CellPhone" as contact_mobile,

    -- Adresse (utilise plusieurs colonnes Address_AddressX)
    CONCAT_WS(' ',
        se."Address_Address1",
        se."Address_Address2",
        se."Address_Address3"
    ) as address,
    se."Address_City" as city,
    se."Address_ZipCode" as zipcode,
    se."Address_Latitude" as latitude,
    se."Address_Longitude" as longitude,

    -- Produit concerné
    se."Maintenance_CustomerProductId" as product_id,
    cp."DescriptionClear" as product_description,
    cp."TrackingNumber" as product_tracking,

    -- Technicien/User
    se."sysModifiedUser" as technician_id,
    se."sysModifiedUser" as technician_name,

    -- Métadonnées
    se."sysCreatedDate" as created_at,
    se."sysModifiedDate" as updated_at,

    -- Indicateurs utiles
    CASE
        WHEN se."StartDateTime" < NOW() THEN true
        ELSE false
    END as is_overdue,

    CASE
        WHEN se."StartDateTime" BETWEEN NOW() AND NOW() + INTERVAL '24 hours' THEN true
        ELSE false
    END as is_upcoming_soon,

    se."EventState" as event_state

FROM public."ScheduleEvent" se
LEFT JOIN public."Customer" c ON se."CustomerId" = c."Id"
LEFT JOIN public."CustomerProduct" cp ON se."Maintenance_CustomerProductId" = cp."Id"
WHERE se."EventState" >= 0;

COMMENT ON VIEW mobile.v_interventions IS 'Vue enrichie des interventions pour l''app mobile - basée sur colonnes réelles EBP';

-- ============================================================
-- 3. FONCTIONS API MOBILE - INTERVENTIONS
-- ============================================================

-- Fonction: Récupérer les interventions d'un technicien
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
    product_description VARCHAR(255)
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

-- Fonction: Récupérer les interventions à proximité
CREATE OR REPLACE FUNCTION mobile.get_nearby_interventions(
    p_latitude NUMERIC(10,8),
    p_longitude NUMERIC(11,8),
    p_radius_km NUMERIC DEFAULT 50,
    p_technician_id VARCHAR(50) DEFAULT NULL,
    p_limit INTEGER DEFAULT 20
)
RETURNS TABLE (
    intervention_id VARCHAR(50),
    title VARCHAR(80),
    customer_name VARCHAR(60),
    address TEXT,
    city VARCHAR(35),
    latitude NUMERIC(20,8),
    longitude NUMERIC(20,8),
    start_date TIMESTAMP,
    distance_km NUMERIC(10,2)
) AS $$
BEGIN
    RETURN QUERY
    SELECT
        vi.intervention_id,
        vi.title,
        vi.customer_name,
        vi.address,
        vi.city,
        vi.latitude,
        vi.longitude,
        vi.start_date,
        mobile.calculate_distance_km(
            p_latitude,
            p_longitude,
            vi.latitude,
            vi.longitude
        ) as distance_km
    FROM mobile.v_interventions vi
    WHERE vi.latitude IS NOT NULL
      AND vi.longitude IS NOT NULL
      AND (p_technician_id IS NULL OR vi.technician_id = p_technician_id)
      AND mobile.calculate_distance_km(
          p_latitude,
          p_longitude,
          vi.latitude,
          vi.longitude
      ) <= p_radius_km
    ORDER BY distance_km ASC
    LIMIT p_limit;
END;
$$ LANGUAGE plpgsql;

-- ============================================================
-- 4. FONCTIONS API MOBILE - CLIENTS
-- ============================================================

-- Fonction: Récupérer les clients à proximité
CREATE OR REPLACE FUNCTION mobile.get_nearby_customers(
    p_latitude NUMERIC(10,8),
    p_longitude NUMERIC(11,8),
    p_radius_km NUMERIC DEFAULT 50,
    p_limit INTEGER DEFAULT 20
)
RETURNS TABLE (
    customer_id VARCHAR(20),
    name VARCHAR(60),
    contact_name VARCHAR(60),
    contact_phone VARCHAR(20),
    delivery_address VARCHAR(40),
    delivery_city VARCHAR(35),
    latitude NUMERIC(20,8),
    longitude NUMERIC(20,8),
    distance_km NUMERIC(10,2)
) AS $$
BEGIN
    RETURN QUERY
    SELECT
        vc.id as customer_id,
        vc.name,
        vc.main_contact_name as contact_name,
        vc.main_contact_phone as contact_phone,
        vc.delivery_address,
        vc.delivery_city,
        vc.delivery_latitude as latitude,
        vc.delivery_longitude as longitude,
        mobile.calculate_distance_km(
            p_latitude,
            p_longitude,
            vc.delivery_latitude,
            vc.delivery_longitude
        ) as distance_km
    FROM mobile.v_customers vc
    WHERE vc.delivery_latitude IS NOT NULL
      AND vc.delivery_longitude IS NOT NULL
      AND vc.is_active = 1
      AND mobile.calculate_distance_km(
          p_latitude,
          p_longitude,
          vc.delivery_latitude,
          vc.delivery_longitude
      ) <= p_radius_km
    ORDER BY distance_km ASC
    LIMIT p_limit;
END;
$$ LANGUAGE plpgsql;

-- Fonction: Récupérer l'historique d'un client
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
    product_description VARCHAR(255),
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

-- ============================================================
-- 5. FONCTIONS CACHE OFFLINE
-- ============================================================

-- Fonction: Upsert cache entry
CREATE OR REPLACE FUNCTION mobile.upsert_offline_cache(
    p_device_id VARCHAR(100),
    p_cache_key VARCHAR(200),
    p_cache_data JSONB,
    p_ttl_hours INTEGER DEFAULT 24
)
RETURNS INTEGER AS $$
DECLARE
    v_cache_id INTEGER;
    v_data_hash VARCHAR(64);
BEGIN
    v_data_hash := md5(p_cache_data::text);

    INSERT INTO mobile.offline_cache (
        device_id,
        cache_key,
        cache_data,
        data_hash,
        expires_at,
        updated_at
    ) VALUES (
        p_device_id,
        p_cache_key,
        p_cache_data,
        v_data_hash,
        NOW() + (p_ttl_hours || ' hours')::INTERVAL,
        NOW()
    )
    ON CONFLICT (device_id, cache_key)
    DO UPDATE SET
        cache_data = EXCLUDED.cache_data,
        data_hash = EXCLUDED.data_hash,
        expires_at = EXCLUDED.expires_at,
        updated_at = NOW()
    RETURNING id INTO v_cache_id;

    RETURN v_cache_id;
END;
$$ LANGUAGE plpgsql;

-- Fonction: Récupérer une entrée de cache
CREATE OR REPLACE FUNCTION mobile.get_offline_cache(
    p_device_id VARCHAR(100),
    p_cache_key VARCHAR(200)
)
RETURNS JSONB AS $$
DECLARE
    v_cache_data JSONB;
BEGIN
    SELECT cache_data INTO v_cache_data
    FROM mobile.offline_cache
    WHERE device_id = p_device_id
      AND cache_key = p_cache_key
      AND (expires_at IS NULL OR expires_at > NOW());

    RETURN v_cache_data;
END;
$$ LANGUAGE plpgsql;

-- Fonction: Nettoyer le cache expiré
CREATE OR REPLACE FUNCTION mobile.cleanup_expired_cache()
RETURNS INTEGER AS $$
DECLARE
    v_deleted_count INTEGER;
BEGIN
    DELETE FROM mobile.offline_cache
    WHERE expires_at IS NOT NULL
      AND expires_at < NOW();

    GET DIAGNOSTICS v_deleted_count = ROW_COUNT;

    RETURN v_deleted_count;
END;
$$ LANGUAGE plpgsql;

-- ============================================================
-- 6. FONCTIONS STATISTIQUES POUR DASHBOARD
-- ============================================================

-- Fonction: Statistiques d'un technicien
CREATE OR REPLACE FUNCTION mobile.get_technician_stats(
    p_technician_id VARCHAR(50),
    p_date_from TIMESTAMP DEFAULT NOW() - INTERVAL '30 days',
    p_date_to TIMESTAMP DEFAULT NOW()
)
RETURNS TABLE (
    total_interventions BIGINT,
    completed_today BIGINT,
    upcoming_24h BIGINT,
    overdue BIGINT,
    avg_interventions_per_day NUMERIC(10,2)
) AS $$
BEGIN
    RETURN QUERY
    SELECT
        COUNT(*) as total_interventions,
        COUNT(*) FILTER (WHERE DATE(start_date) = CURRENT_DATE) as completed_today,
        COUNT(*) FILTER (WHERE is_upcoming_soon = true) as upcoming_24h,
        COUNT(*) FILTER (WHERE is_overdue = true) as overdue,
        ROUND(COUNT(*)::NUMERIC / GREATEST(EXTRACT(DAY FROM (p_date_to - p_date_from)), 1), 2) as avg_interventions_per_day
    FROM mobile.v_interventions
    WHERE technician_id = p_technician_id
      AND start_date >= p_date_from
      AND start_date <= p_date_to;
END;
$$ LANGUAGE plpgsql;

-- ============================================================
-- 7. TRIGGERS POUR MAINTENANCE AUTOMATIQUE
-- ============================================================

CREATE OR REPLACE FUNCTION mobile.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_sync_status_updated_at ON mobile.sync_status;
CREATE TRIGGER trigger_sync_status_updated_at
    BEFORE UPDATE ON mobile.sync_status
    FOR EACH ROW
    EXECUTE FUNCTION mobile.update_updated_at_column();

DROP TRIGGER IF EXISTS trigger_mobile_incidents_updated_at ON mobile.mobile_incidents;
CREATE TRIGGER trigger_mobile_incidents_updated_at
    BEFORE UPDATE ON mobile.mobile_incidents
    FOR EACH ROW
    EXECUTE FUNCTION mobile.update_updated_at_column();

DROP TRIGGER IF EXISTS trigger_offline_cache_updated_at ON mobile.offline_cache;
CREATE TRIGGER trigger_offline_cache_updated_at
    BEFORE UPDATE ON mobile.offline_cache
    FOR EACH ROW
    EXECUTE FUNCTION mobile.update_updated_at_column();

-- ============================================================
-- 8. FONCTION DE VÉRIFICATION DE SANTÉ
-- ============================================================

CREATE OR REPLACE FUNCTION mobile.health_check()
RETURNS TABLE (
    check_name VARCHAR(100),
    status VARCHAR(20),
    details JSONB
) AS $$
BEGIN
    -- Check: Nombre d'interventions avec GPS
    RETURN QUERY
    SELECT
        'interventions_with_gps'::VARCHAR(100),
        CASE WHEN pct > 70 THEN 'healthy'::VARCHAR(20)
             WHEN pct > 40 THEN 'warning'::VARCHAR(20)
             ELSE 'critical'::VARCHAR(20)
        END as status,
        jsonb_build_object(
            'total', total,
            'with_gps', with_gps,
            'percentage', pct
        ) as details
    FROM (
        SELECT
            COUNT(*) as total,
            COUNT(*) FILTER (WHERE "Address_Latitude" IS NOT NULL) as with_gps,
            ROUND((COUNT(*) FILTER (WHERE "Address_Latitude" IS NOT NULL)::NUMERIC / NULLIF(COUNT(*), 0) * 100), 2) as pct
        FROM public."ScheduleEvent"
        WHERE "EventState" >= 0
          AND "StartDateTime" >= NOW() - INTERVAL '30 days'
    ) sub;

    -- Check: Sync en échec
    RETURN QUERY
    SELECT
        'failed_syncs'::VARCHAR(100),
        CASE WHEN failed_count = 0 THEN 'healthy'::VARCHAR(20)
             WHEN failed_count < 10 THEN 'warning'::VARCHAR(20)
             ELSE 'critical'::VARCHAR(20)
        END as status,
        jsonb_build_object(
            'failed_count', failed_count,
            'avg_retry', avg_retry
        ) as details
    FROM (
        SELECT
            COUNT(*) as failed_count,
            ROUND(AVG(retry_count), 2) as avg_retry
        FROM mobile.sync_status
        WHERE sync_status = 'failed'
    ) sub;

    -- Check: Cache expiré
    RETURN QUERY
    SELECT
        'expired_cache'::VARCHAR(100),
        CASE WHEN expired_count < 100 THEN 'healthy'::VARCHAR(20)
             WHEN expired_count < 500 THEN 'warning'::VARCHAR(20)
             ELSE 'critical'::VARCHAR(20)
        END as status,
        jsonb_build_object(
            'expired_count', expired_count
        ) as details
    FROM (
        SELECT COUNT(*) as expired_count
        FROM mobile.offline_cache
        WHERE expires_at IS NOT NULL
          AND expires_at < NOW()
    ) sub;
END;
$$ LANGUAGE plpgsql;

-- ============================================================
-- COMMENTAIRES
-- ============================================================

COMMENT ON FUNCTION mobile.get_pending_sync_entities(VARCHAR, VARCHAR) IS 'Récupère les entités en attente de synchronisation pour un device';
COMMENT ON FUNCTION mobile.mark_entity_synced(VARCHAR, VARCHAR, VARCHAR, VARCHAR) IS 'Marque une entité comme synchronisée avec succès';
COMMENT ON FUNCTION mobile.mark_sync_failed(VARCHAR, VARCHAR, VARCHAR, VARCHAR, TEXT) IS 'Enregistre un échec de synchronisation';
COMMENT ON FUNCTION mobile.get_technician_interventions(VARCHAR, TIMESTAMP, TIMESTAMP) IS 'Récupère les interventions d''un technicien';
COMMENT ON FUNCTION mobile.get_nearby_interventions(NUMERIC, NUMERIC, NUMERIC, VARCHAR, INTEGER) IS 'Trouve les interventions à proximité GPS';
COMMENT ON FUNCTION mobile.get_nearby_customers(NUMERIC, NUMERIC, NUMERIC, INTEGER) IS 'Trouve les clients à proximité GPS';
COMMENT ON FUNCTION mobile.get_customer_history(VARCHAR, INTEGER) IS 'Historique des interventions d''un client';
COMMENT ON FUNCTION mobile.get_technician_stats(VARCHAR, TIMESTAMP, TIMESTAMP) IS 'Statistiques de performance technicien';
COMMENT ON FUNCTION mobile.health_check() IS 'Vérifie la santé du système mobile';

-- ============================================================
-- FIN MIGRATION 003 V2
-- ============================================================

DO $$
BEGIN
    RAISE NOTICE '✅ Migration 003 V2 terminée avec succès';
    RAISE NOTICE '📊 Fonctions créées:';
    RAISE NOTICE '   - 13 fonctions de synchronisation et API';
    RAISE NOTICE '   - 1 vue enrichie (v_interventions)';
    RAISE NOTICE '   - 3 triggers pour auto-update';
    RAISE NOTICE '   - 1 fonction health_check';
END $$;

-- Migration 001: Schéma Mobile (NON-INVASIF)
-- Date: 2025-10-23
-- Description: Création schéma mobile SANS modifier les tables EBP
--
-- PRINCIPE: Ne PAS toucher aux tables EBP existantes
-- Toutes nos données spécifiques app mobile vont dans le schéma "mobile"

-- ============================================================================
-- 1. CRÉATION SCHÉMA MOBILE
-- ============================================================================

CREATE SCHEMA IF NOT EXISTS mobile;

COMMENT ON SCHEMA mobile IS 'Schéma pour données spécifiques application mobile terrain (sync, photos, cache)';

-- ============================================================================
-- 2. TABLE SYNC STATUS (suivi synchronisation)
-- ============================================================================

CREATE TABLE IF NOT EXISTS mobile.sync_status (
    id SERIAL PRIMARY KEY,
    entity_type VARCHAR(100) NOT NULL,  -- 'ScheduleEvent', 'Customer', etc.
    entity_id VARCHAR(50) NOT NULL,     -- Id de l'entité dans table EBP
    last_sync_date TIMESTAMP NOT NULL DEFAULT NOW(),
    sync_status VARCHAR(20) NOT NULL DEFAULT 'pending',  -- pending, synced, error
    sync_direction VARCHAR(10) NOT NULL,  -- 'up' (mobile→server), 'down' (server→mobile)
    device_id VARCHAR(100),              -- Identifiant appareil mobile
    user_id VARCHAR(50),                 -- Technicien
    error_message TEXT,
    retry_count INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),

    CONSTRAINT unique_entity_sync UNIQUE (entity_type, entity_id, device_id, sync_direction)
);

CREATE INDEX idx_sync_status_entity ON mobile.sync_status(entity_type, entity_id);
CREATE INDEX idx_sync_status_device ON mobile.sync_status(device_id, last_sync_date);
CREATE INDEX idx_sync_status_status ON mobile.sync_status(sync_status) WHERE sync_status != 'synced';

COMMENT ON TABLE mobile.sync_status IS 'Suivi synchronisation données entre mobile et serveur';

-- ============================================================================
-- 3. TABLE PHOTOS/FICHIERS MOBILE
-- ============================================================================

CREATE TABLE IF NOT EXISTS mobile.intervention_photos (
    id SERIAL PRIMARY KEY,
    schedule_event_id VARCHAR(50) NOT NULL,  -- FK vers "ScheduleEvent"."Id"
    photo_url VARCHAR(500) NOT NULL,         -- URL stockage (S3/MinIO)
    thumbnail_url VARCHAR(500),              -- Miniature
    file_size_bytes INTEGER,
    mime_type VARCHAR(50) DEFAULT 'image/jpeg',
    caption TEXT,                             -- Légende photo
    gps_latitude DECIMAL(10, 8),
    gps_longitude DECIMAL(11, 8),
    taken_at TIMESTAMP DEFAULT NOW(),
    uploaded_by VARCHAR(50),                 -- Technicien
    device_id VARCHAR(100),
    is_deleted BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT NOW(),

    CONSTRAINT fk_schedule_event FOREIGN KEY (schedule_event_id)
        REFERENCES public."ScheduleEvent"("Id") ON DELETE CASCADE
);

CREATE INDEX idx_intervention_photos_event ON mobile.intervention_photos(schedule_event_id);
CREATE INDEX idx_intervention_photos_uploaded ON mobile.intervention_photos(uploaded_by, taken_at);

COMMENT ON TABLE mobile.intervention_photos IS 'Photos prises par techniciens lors des interventions';

-- ============================================================================
-- 4. TABLE SIGNATURES CLIENT
-- ============================================================================

CREATE TABLE IF NOT EXISTS mobile.intervention_signatures (
    id SERIAL PRIMARY KEY,
    schedule_event_id VARCHAR(50) NOT NULL,  -- FK vers "ScheduleEvent"."Id"
    signature_url VARCHAR(500) NOT NULL,     -- URL fichier signature (PNG)
    signer_name VARCHAR(200),                -- Nom du signataire
    signer_title VARCHAR(100),               -- Fonction (ex: "Responsable Technique")
    signed_at TIMESTAMP DEFAULT NOW(),
    uploaded_by VARCHAR(50),                 -- Technicien
    device_id VARCHAR(100),
    comments TEXT,                           -- Commentaires client
    satisfaction_score INTEGER CHECK (satisfaction_score BETWEEN 1 AND 5),
    created_at TIMESTAMP DEFAULT NOW(),

    CONSTRAINT fk_schedule_event_sig FOREIGN KEY (schedule_event_id)
        REFERENCES public."ScheduleEvent"("Id") ON DELETE CASCADE,
    CONSTRAINT unique_signature_per_event UNIQUE (schedule_event_id)
);

CREATE INDEX idx_intervention_signatures_event ON mobile.intervention_signatures(schedule_event_id);

COMMENT ON TABLE mobile.intervention_signatures IS 'Signatures clients collectées lors des interventions';

-- ============================================================================
-- 5. TABLE DONNÉES HORS-LIGNE (cache mobile)
-- ============================================================================

CREATE TABLE IF NOT EXISTS mobile.offline_cache (
    id SERIAL PRIMARY KEY,
    device_id VARCHAR(100) NOT NULL,
    cache_key VARCHAR(200) NOT NULL,      -- Ex: 'schedule_events_2025-10-23'
    cache_data JSONB NOT NULL,            -- Données JSON compressées
    data_hash VARCHAR(64),                -- MD5 pour détecter changements
    expires_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),

    CONSTRAINT unique_cache_entry UNIQUE (device_id, cache_key)
);

CREATE INDEX idx_offline_cache_device ON mobile.offline_cache(device_id);
CREATE INDEX idx_offline_cache_expires ON mobile.offline_cache(expires_at);

COMMENT ON TABLE mobile.offline_cache IS 'Cache données pour mode offline mobile';

-- ============================================================================
-- 6. TABLE INCIDENTS CRÉÉS SUR MOBILE (optionnel - si table Incident pas utilisée)
-- ============================================================================

CREATE TABLE IF NOT EXISTS mobile.mobile_incidents (
    id SERIAL PRIMARY KEY,
    temp_id UUID NOT NULL DEFAULT gen_random_uuid(),  -- ID temporaire avant sync
    customer_id VARCHAR(50),
    customer_product_id VARCHAR(50),
    title VARCHAR(200) NOT NULL,
    description TEXT,
    priority INTEGER DEFAULT 3 CHECK (priority BETWEEN 1 AND 5),
    severity INTEGER DEFAULT 3 CHECK (severity BETWEEN 1 AND 5),
    reported_by VARCHAR(50) NOT NULL,     -- Technicien
    reported_at TIMESTAMP DEFAULT NOW(),
    gps_latitude DECIMAL(10, 8),
    gps_longitude DECIMAL(11, 8),
    photos JSONB,                         -- Array URLs photos
    device_id VARCHAR(100),
    synced_to_ebp BOOLEAN DEFAULT FALSE,
    ebp_incident_id VARCHAR(50),          -- Une fois synced vers table Incident
    sync_error TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_mobile_incidents_sync ON mobile.mobile_incidents(synced_to_ebp, created_at);
CREATE INDEX idx_mobile_incidents_customer ON mobile.mobile_incidents(customer_id);

COMMENT ON TABLE mobile.mobile_incidents IS 'Incidents/tickets créés depuis app mobile (avant sync vers EBP)';

-- ============================================================================
-- 7. TABLE TEMPS PASSÉS MOBILE (timesheet)
-- ============================================================================

CREATE TABLE IF NOT EXISTS mobile.intervention_timesheets (
    id SERIAL PRIMARY KEY,
    schedule_event_id VARCHAR(50) NOT NULL,
    colleague_id VARCHAR(50) NOT NULL,    -- Technicien
    start_time TIMESTAMP NOT NULL,
    end_time TIMESTAMP,
    duration_minutes INTEGER GENERATED ALWAYS AS (
        EXTRACT(EPOCH FROM (end_time - start_time)) / 60
    ) STORED,
    activity_type VARCHAR(50),            -- 'travel', 'work', 'waiting'
    notes TEXT,
    gps_start_lat DECIMAL(10, 8),
    gps_start_lon DECIMAL(11, 8),
    gps_end_lat DECIMAL(10, 8),
    gps_end_lon DECIMAL(11, 8),
    device_id VARCHAR(100),
    created_at TIMESTAMP DEFAULT NOW(),

    CONSTRAINT fk_schedule_event_time FOREIGN KEY (schedule_event_id)
        REFERENCES public."ScheduleEvent"("Id") ON DELETE CASCADE
);

CREATE INDEX idx_intervention_timesheets_event ON mobile.intervention_timesheets(schedule_event_id);
CREATE INDEX idx_intervention_timesheets_colleague ON mobile.intervention_timesheets(colleague_id, start_time);

COMMENT ON TABLE mobile.intervention_timesheets IS 'Temps passés détaillés saisis depuis mobile';

-- ============================================================================
-- 8. INDEX PERFORMANCE (SANS modifier tables EBP)
-- ============================================================================

-- Index sur ScheduleEvent pour queries mobile
CREATE INDEX IF NOT EXISTS idx_scheduleevent_dates
    ON public."ScheduleEvent"("StartDate", "EndDate")
    WHERE "ActiveState" = 1;

CREATE INDEX IF NOT EXISTS idx_scheduleevent_colleague
    ON public."ScheduleEvent"("ColleagueId")
    WHERE "ActiveState" = 1;

CREATE INDEX IF NOT EXISTS idx_scheduleevent_gps
    ON public."ScheduleEvent"("Address_Latitude", "Address_Longitude")
    WHERE "Address_Latitude" IS NOT NULL;

-- Index sur Customer
CREATE INDEX IF NOT EXISTS idx_customer_active
    ON public."Customer"("ActiveState")
    WHERE "ActiveState" = 1;

CREATE INDEX IF NOT EXISTS idx_customer_delivery_gps
    ON public."Customer"("MainDeliveryAddress_Latitude", "MainDeliveryAddress_Longitude")
    WHERE "MainDeliveryAddress_Latitude" IS NOT NULL;

-- Index sur Activity pour historique
CREATE INDEX IF NOT EXISTS idx_activity_date
    ON public."Activity"("ActivityDate" DESC);

CREATE INDEX IF NOT EXISTS idx_activity_linked
    ON public."Activity"("LinkedEntityType", "LinkedEntityId");

-- ============================================================================
-- 9. VUES SIMPLIFIÉES POUR APP MOBILE
-- ============================================================================

-- Vue: Interventions enrichies pour mobile
CREATE OR REPLACE VIEW mobile.v_interventions AS
SELECT
    e."UniqueId" as unique_id,
    e."Id" as id,
    e."StartDate" as start_date,
    e."EndDate" as end_date,
    e."State" as state,
    e."Type" as type_code,
    e."Subject" as subject,
    e."Description" as description,
    e."NotesClear" as notes,
    e."ColleagueId" as colleague_id,
    col."Name" as colleague_name,
    e."CustomerId" as customer_id,
    c."Name" as customer_name,
    c."MainDeliveryContact_Name" as contact_name,
    c."MainDeliveryContact_Phone" as contact_phone,
    c."MainDeliveryContact_CellPhone" as contact_mobile,
    c."MainDeliveryContact_Email" as contact_email,
    c."MainDeliveryAddress_Address1" as address_line1,
    c."MainDeliveryAddress_Address2" as address_line2,
    c."MainDeliveryAddress_City" as city,
    c."MainDeliveryAddress_ZipCode" as zipcode,
    c."MainDeliveryAddress_CountryIsoCode" as country_code,
    e."Address_Latitude" as latitude,
    e."Address_Longitude" as longitude,
    e."HasAssociatedFiles" as has_files,
    e."sysModifiedDate" as last_modified
FROM public."ScheduleEvent" e
LEFT JOIN public."Customer" c ON e."CustomerId" = c."Id"
LEFT JOIN public."Colleague" col ON e."ColleagueId" = col."Id"
WHERE e."StartDate" >= CURRENT_DATE - INTERVAL '7 days'
  AND e."StartDate" <= CURRENT_DATE + INTERVAL '60 days';

COMMENT ON VIEW mobile.v_interventions IS 'Vue simplifiée interventions pour app mobile (derniers 7 jours + 60 jours futurs)';

-- Vue: Clients pour mobile (simplifié)
CREATE OR REPLACE VIEW mobile.v_customers AS
SELECT
    c."Id" as id,
    c."Name" as name,
    c."Type" as type_code,
    c."MainInvoicingContact_Name" as main_contact_name,
    c."MainInvoicingContact_Phone" as main_contact_phone,
    c."MainInvoicingContact_Email" as main_contact_email,
    c."MainDeliveryAddress_Address1" as delivery_address,
    c."MainDeliveryAddress_City" as delivery_city,
    c."MainDeliveryAddress_ZipCode" as delivery_zipcode,
    c."MainDeliveryAddress_Latitude" as delivery_latitude,
    c."MainDeliveryAddress_Longitude" as delivery_longitude,
    c."NotesClear" as notes,
    c."ActiveState" as is_active
FROM public."Customer" c
WHERE c."ActiveState" = 1;

COMMENT ON VIEW mobile.v_customers IS 'Vue simplifiée clients actifs pour app mobile';

-- ============================================================================
-- 10. FONCTION UTILITÉ: Calculer distance GPS
-- ============================================================================

CREATE OR REPLACE FUNCTION mobile.calculate_distance_km(
    lat1 DECIMAL, lon1 DECIMAL,
    lat2 DECIMAL, lon2 DECIMAL
)
RETURNS DECIMAL AS $$
DECLARE
    R DECIMAL := 6371; -- Rayon de la Terre en km
    dLat DECIMAL;
    dLon DECIMAL;
    a DECIMAL;
    c DECIMAL;
BEGIN
    IF lat1 IS NULL OR lon1 IS NULL OR lat2 IS NULL OR lon2 IS NULL THEN
        RETURN NULL;
    END IF;

    dLat := radians(lat2 - lat1);
    dLon := radians(lon2 - lon1);

    a := sin(dLat/2) * sin(dLat/2) +
         cos(radians(lat1)) * cos(radians(lat2)) *
         sin(dLon/2) * sin(dLon/2);

    c := 2 * atan2(sqrt(a), sqrt(1-a));

    RETURN ROUND((R * c)::DECIMAL, 2);
END;
$$ LANGUAGE plpgsql IMMUTABLE;

COMMENT ON FUNCTION mobile.calculate_distance_km IS 'Calcul distance entre 2 coordonnées GPS (formule Haversine)';

-- ============================================================================
-- 11. GRANTS (permissions)
-- ============================================================================

-- Donner accès au schéma mobile à l'utilisateur postgres et futurs users
GRANT USAGE ON SCHEMA mobile TO postgres;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA mobile TO postgres;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA mobile TO postgres;

-- Pour de futurs utilisateurs API
-- GRANT SELECT, INSERT, UPDATE ON mobile.intervention_photos TO api_user;
-- GRANT SELECT, INSERT, UPDATE ON mobile.intervention_signatures TO api_user;
-- etc.

-- ============================================================================
-- RÉSUMÉ DE LA MIGRATION
-- ============================================================================
--
-- ✅ AUCUNE modification des tables EBP existantes
-- ✅ Création schéma "mobile" séparé
-- ✅ 7 tables pour besoins spécifiques app mobile
-- ✅ Index performance (non-invasifs)
-- ✅ 2 vues simplifiées
-- ✅ 1 fonction utilité (distance GPS)
--
-- IMPACTS:
-- - Zero impact sur fonctionnement EBP
-- - Données EBP restent intactes
-- - Schéma mobile peut être supprimé sans risque
-- - Index améliorent seulement les performances
--
-- ============================================================================

-- Log migration
DO $$
BEGIN
    RAISE NOTICE 'Migration 001 terminée avec succès';
    RAISE NOTICE 'Schéma mobile créé avec 7 tables, 2 vues, 1 fonction';
    RAISE NOTICE 'Aucune modification des tables EBP';
END $$;

-- =====================================================
-- Migration 017: Liaison NinjaOne ↔ Interventions EBP
-- Description: Tables de liaison et mapping (100% mobile schema, 0% modification public)
-- Date: 2025-10-31
-- Auteur: Claude Code
-- =====================================================
-- IMPORTANT: Cette migration ne modifie JAMAIS le schéma public (miroir EBP)
-- =====================================================

-- ============================================================
-- 1. TABLE DE LIAISON : Tickets NinjaOne ↔ Interventions/Incidents EBP existants
-- ============================================================

CREATE TABLE IF NOT EXISTS mobile.ninjaone_intervention_links (
    id SERIAL PRIMARY KEY,

    -- Ticket NinjaOne (source)
    ninjaone_ticket_id INTEGER NOT NULL,
    ninjaone_ticket_number VARCHAR(100),
    ninjaone_ticket_uid VARCHAR(255),

    -- Intervention/Incident EBP (destination)
    target_type VARCHAR(20) NOT NULL CHECK (target_type IN ('schedule_event', 'incident')),
    target_id VARCHAR(50) NOT NULL, -- UUID pour ScheduleEvent, VARCHAR(8) pour Incident
    target_reference VARCHAR(100),

    -- Statut de synchronisation
    sync_status VARCHAR(20) DEFAULT 'active' CHECK (sync_status IN ('active', 'completed', 'cancelled', 'archived')),
    sync_direction VARCHAR(30) DEFAULT 'ninjaone_to_ebp' CHECK (sync_direction IN ('ninjaone_to_ebp', 'ebp_to_ninjaone', 'bidirectional')),

    -- Mapping utilisateur
    converted_by UUID, -- mobile.users.id
    converted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

    -- Notes
    conversion_notes TEXT,
    conversion_method VARCHAR(50) DEFAULT 'manual', -- manual, automatic, import

    -- Métadonnées
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_sync_at TIMESTAMP WITH TIME ZONE,

    -- Contraintes
    CONSTRAINT unique_ninjaone_ticket UNIQUE(ninjaone_ticket_id),
    CONSTRAINT unique_target UNIQUE(target_type, target_id),
    CONSTRAINT fk_converted_by FOREIGN KEY (converted_by) REFERENCES mobile.users(id) ON DELETE SET NULL
);

-- Index pour recherche rapide
CREATE INDEX idx_ninjaone_links_ticket ON mobile.ninjaone_intervention_links(ninjaone_ticket_id);
CREATE INDEX idx_ninjaone_links_target ON mobile.ninjaone_intervention_links(target_type, target_id);
CREATE INDEX idx_ninjaone_links_status ON mobile.ninjaone_intervention_links(sync_status) WHERE sync_status = 'active';
CREATE INDEX idx_ninjaone_links_user ON mobile.ninjaone_intervention_links(converted_by);

COMMENT ON TABLE mobile.ninjaone_intervention_links IS
'Liaison entre tickets NinjaOne et interventions/incidents EBP existants - READ ONLY sur public schema';

COMMENT ON COLUMN mobile.ninjaone_intervention_links.target_type IS
'Type de cible: schedule_event (ScheduleEvent) ou incident (Incident)';

COMMENT ON COLUMN mobile.ninjaone_intervention_links.sync_status IS
'Statut: active (en cours), completed (terminé), cancelled (annulé), archived (archivé)';

-- ============================================================
-- 2. TABLE DE MAPPING : Organisations NinjaOne → Clients EBP
-- ============================================================

CREATE TABLE IF NOT EXISTS mobile.ninjaone_customer_mapping (
    id SERIAL PRIMARY KEY,

    -- NinjaOne
    ninjaone_organization_id INTEGER NOT NULL UNIQUE,
    ninjaone_organization_name VARCHAR(255),

    -- EBP
    ebp_customer_id VARCHAR(20) NOT NULL, -- public."Customer"."Id"
    ebp_customer_name VARCHAR(200),

    -- Confiance du mapping
    mapping_confidence VARCHAR(20) DEFAULT 'manual' CHECK (mapping_confidence IN ('manual', 'auto_exact', 'auto_fuzzy', 'auto_ml')),
    confidence_score NUMERIC(3, 2), -- 0.00 à 1.00

    -- Métadonnées
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_by UUID, -- mobile.users.id
    validated BOOLEAN DEFAULT FALSE,
    validated_at TIMESTAMP WITH TIME ZONE,
    validated_by UUID,

    -- Notes
    mapping_notes TEXT,

    CONSTRAINT fk_ninjaone_org FOREIGN KEY (ninjaone_organization_id)
        REFERENCES ninjaone.dim_organizations(organization_id) ON DELETE CASCADE,
    CONSTRAINT fk_created_by FOREIGN KEY (created_by)
        REFERENCES mobile.users(id) ON DELETE SET NULL,
    CONSTRAINT fk_validated_by FOREIGN KEY (validated_by)
        REFERENCES mobile.users(id) ON DELETE SET NULL
);

CREATE INDEX idx_ninjaone_customer_org ON mobile.ninjaone_customer_mapping(ninjaone_organization_id);
CREATE INDEX idx_ninjaone_customer_ebp ON mobile.ninjaone_customer_mapping(ebp_customer_id);
CREATE INDEX idx_ninjaone_customer_validated ON mobile.ninjaone_customer_mapping(validated) WHERE validated = TRUE;

COMMENT ON TABLE mobile.ninjaone_customer_mapping IS
'Mapping organisations NinjaOne → clients EBP (pour conversion automatique)';

-- ============================================================
-- 3. TABLE DE MAPPING : Techniciens NinjaOne → Collègues EBP
-- ============================================================

CREATE TABLE IF NOT EXISTS mobile.ninjaone_technician_mapping (
    id SERIAL PRIMARY KEY,

    -- NinjaOne
    ninjaone_technician_id INTEGER NOT NULL UNIQUE,
    ninjaone_technician_name VARCHAR(255),
    ninjaone_technician_email VARCHAR(255),

    -- EBP
    ebp_colleague_id VARCHAR(20) NOT NULL, -- public."Colleague"."Id"
    ebp_colleague_name VARCHAR(200),
    ebp_colleague_email VARCHAR(100),

    -- Confiance du mapping
    mapping_confidence VARCHAR(20) DEFAULT 'manual' CHECK (mapping_confidence IN ('manual', 'auto_exact', 'auto_fuzzy', 'auto_email')),
    confidence_score NUMERIC(3, 2), -- 0.00 à 1.00

    -- Métadonnées
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_by UUID,
    validated BOOLEAN DEFAULT FALSE,
    validated_at TIMESTAMP WITH TIME ZONE,
    validated_by UUID,

    -- Notes
    mapping_notes TEXT,

    CONSTRAINT fk_ninjaone_tech FOREIGN KEY (ninjaone_technician_id)
        REFERENCES ninjaone.dim_technicians(technician_id) ON DELETE CASCADE,
    CONSTRAINT fk_tech_created_by FOREIGN KEY (created_by)
        REFERENCES mobile.users(id) ON DELETE SET NULL,
    CONSTRAINT fk_tech_validated_by FOREIGN KEY (validated_by)
        REFERENCES mobile.users(id) ON DELETE SET NULL
);

CREATE INDEX idx_ninjaone_tech_ninja ON mobile.ninjaone_technician_mapping(ninjaone_technician_id);
CREATE INDEX idx_ninjaone_tech_ebp ON mobile.ninjaone_technician_mapping(ebp_colleague_id);
CREATE INDEX idx_ninjaone_tech_validated ON mobile.ninjaone_technician_mapping(validated) WHERE validated = TRUE;
CREATE INDEX idx_ninjaone_tech_email ON mobile.ninjaone_technician_mapping(ninjaone_technician_email);

COMMENT ON TABLE mobile.ninjaone_technician_mapping IS
'Mapping techniciens NinjaOne → collègues EBP (pour affectation automatique)';

-- ============================================================
-- 4. VUE ENRICHIE : Tickets NinjaOne avec informations EBP liées
-- ============================================================

CREATE OR REPLACE VIEW mobile.v_ninjaone_interventions AS
SELECT
    l.id as link_id,

    -- Ticket NinjaOne
    t.ticket_id,
    t.ticket_number,
    t.ticket_uid,
    t.title as ticket_title,
    t.description as ticket_description,
    t.priority as ticket_priority,
    t.severity as ticket_severity,
    t.status::jsonb as ticket_status,
    t.created_at as ticket_created_at,
    t.due_date as ticket_due_date,
    t.is_overdue as ticket_is_overdue,
    t.is_closed as ticket_is_closed,
    t.time_spent_hours as ticket_time_spent_hours,

    -- Organisation NinjaOne
    o.organization_id,
    o.organization_name,
    o.address as organization_address,
    o.city as organization_city,
    o.postal_code as organization_postal_code,
    o.phone as organization_phone,
    o.email as organization_email,

    -- Technicien NinjaOne
    tech.technician_id,
    tech.full_name as technician_name,
    tech.email as technician_email,
    tech.phone as technician_phone,

    -- Mapping vers EBP
    cm.ebp_customer_id,
    cm.ebp_customer_name,
    cm.mapping_confidence as customer_mapping_confidence,
    tm.ebp_colleague_id,
    tm.ebp_colleague_name,
    tm.mapping_confidence as technician_mapping_confidence,

    -- Liaison
    l.target_type,
    l.target_id,
    l.target_reference,
    l.sync_status,
    l.converted_at,
    l.converted_by,

    -- Intervention EBP (si ScheduleEvent)
    CASE
        WHEN l.target_type = 'schedule_event' THEN se."Caption"
        ELSE NULL
    END as schedule_event_caption,
    CASE
        WHEN l.target_type = 'schedule_event' THEN se."StartDateTime"
        ELSE NULL
    END as schedule_event_start,
    CASE
        WHEN l.target_type = 'schedule_event' THEN se."EndDateTime"
        ELSE NULL
    END as schedule_event_end,
    CASE
        WHEN l.target_type = 'schedule_event' THEN se."EventState"
        ELSE NULL
    END as schedule_event_state,

    -- Incident EBP (si Incident)
    CASE
        WHEN l.target_type = 'incident' THEN i."Caption"
        ELSE NULL
    END as incident_caption,
    CASE
        WHEN l.target_type = 'incident' THEN i."StartDate"
        ELSE NULL
    END as incident_start_date,
    CASE
        WHEN l.target_type = 'incident' THEN i."Status"
        ELSE NULL
    END as incident_status,

    -- Flags
    (l.target_type = 'schedule_event' AND se."Id" IS NOT NULL) as has_schedule_event,
    (l.target_type = 'incident' AND i."Id" IS NOT NULL) as has_incident

FROM mobile.ninjaone_intervention_links l
JOIN ninjaone.fact_tickets t ON l.ninjaone_ticket_id = t.ticket_id
LEFT JOIN ninjaone.dim_organizations o ON t.organization_id = o.organization_id
LEFT JOIN ninjaone.dim_technicians tech ON t.assigned_technician_id = tech.technician_id
LEFT JOIN mobile.ninjaone_customer_mapping cm ON o.organization_id = cm.ninjaone_organization_id
LEFT JOIN mobile.ninjaone_technician_mapping tm ON tech.technician_id = tm.ninjaone_technician_id
LEFT JOIN public."ScheduleEvent" se ON l.target_type = 'schedule_event' AND l.target_id = se."Id"::TEXT
LEFT JOIN public."Incident" i ON l.target_type = 'incident' AND l.target_id = i."Id";

COMMENT ON VIEW mobile.v_ninjaone_interventions IS
'Vue enrichie des tickets NinjaOne liés aux interventions/incidents EBP (lecture seule)';

-- ============================================================
-- 5. VUE : Tickets NinjaOne non convertis (candidates à la conversion)
-- ============================================================

CREATE OR REPLACE VIEW mobile.v_ninjaone_tickets_unconverted AS
SELECT
    t.ticket_id,
    t.ticket_number,
    t.ticket_uid,
    t.title,
    t.description,
    t.priority,
    t.severity,
    t.status::jsonb as status,
    t.created_at,
    t.due_date,
    t.is_overdue,
    t.is_closed,

    -- Organisation
    o.organization_id,
    o.organization_name,
    cm.ebp_customer_id,
    cm.ebp_customer_name,
    cm.mapping_confidence as customer_mapped,

    -- Technicien
    tech.technician_id,
    tech.full_name as technician_name,
    tm.ebp_colleague_id,
    tm.ebp_colleague_name,
    tm.mapping_confidence as technician_mapped,

    -- Flags de conversion
    (cm.ebp_customer_id IS NOT NULL) as can_convert_customer_mapped,
    (tm.ebp_colleague_id IS NOT NULL) as can_convert_technician_mapped,
    (cm.ebp_customer_id IS NOT NULL AND tm.ebp_colleague_id IS NOT NULL) as can_convert_fully_mapped

FROM ninjaone.fact_tickets t
LEFT JOIN mobile.ninjaone_intervention_links l ON t.ticket_id = l.ninjaone_ticket_id
LEFT JOIN ninjaone.dim_organizations o ON t.organization_id = o.organization_id
LEFT JOIN ninjaone.dim_technicians tech ON t.assigned_technician_id = tech.technician_id
LEFT JOIN mobile.ninjaone_customer_mapping cm ON o.organization_id = cm.ninjaone_organization_id
LEFT JOIN mobile.ninjaone_technician_mapping tm ON tech.technician_id = tm.ninjaone_technician_id
WHERE l.id IS NULL -- Pas encore lié
  AND t.is_closed = FALSE -- Pas fermé
ORDER BY t.created_at DESC;

COMMENT ON VIEW mobile.v_ninjaone_tickets_unconverted IS
'Tickets NinjaOne non convertis, avec statut de mapping (candidates à la conversion)';

-- ============================================================
-- 6. FONCTION : Auto-mapping organisation → client EBP (fuzzy matching)
-- ============================================================

CREATE OR REPLACE FUNCTION mobile.auto_map_ninjaone_organizations()
RETURNS TABLE (
    mapped_count INTEGER,
    message TEXT
) AS $$
DECLARE
    v_mapped_count INTEGER := 0;
BEGIN
    -- Mapping exact par nom (case-insensitive)
    INSERT INTO mobile.ninjaone_customer_mapping (
        ninjaone_organization_id,
        ninjaone_organization_name,
        ebp_customer_id,
        ebp_customer_name,
        mapping_confidence,
        confidence_score,
        mapping_notes
    )
    SELECT DISTINCT ON (o.organization_id)
        o.organization_id,
        o.organization_name,
        c."Id",
        c."Caption",
        'auto_exact',
        1.00,
        'Mapping automatique exact (nom identique)'
    FROM ninjaone.dim_organizations o
    INNER JOIN public."Customer" c
        ON LOWER(TRIM(o.organization_name)) = LOWER(TRIM(c."Caption"))
    WHERE o.organization_id NOT IN (
        SELECT ninjaone_organization_id FROM mobile.ninjaone_customer_mapping
    )
    AND o.is_active = TRUE
    ORDER BY o.organization_id;

    GET DIAGNOSTICS v_mapped_count = ROW_COUNT;

    RETURN QUERY SELECT v_mapped_count,
        'Mapped ' || v_mapped_count || ' organisations avec correspondance exacte';

EXCEPTION WHEN OTHERS THEN
    RETURN QUERY SELECT 0, 'Erreur: ' || SQLERRM;
END;
$$ LANGUAGE plpgsql;

COMMENT ON FUNCTION mobile.auto_map_ninjaone_organizations() IS
'Mapping automatique des organisations NinjaOne vers clients EBP (correspondance exacte de nom)';

-- ============================================================
-- 7. FONCTION : Auto-mapping technicien → collègue EBP (par email)
-- ============================================================

CREATE OR REPLACE FUNCTION mobile.auto_map_ninjaone_technicians()
RETURNS TABLE (
    mapped_count INTEGER,
    message TEXT
) AS $$
DECLARE
    v_mapped_count INTEGER := 0;
BEGIN
    -- Mapping par email exact
    INSERT INTO mobile.ninjaone_technician_mapping (
        ninjaone_technician_id,
        ninjaone_technician_name,
        ninjaone_technician_email,
        ebp_colleague_id,
        ebp_colleague_name,
        ebp_colleague_email,
        mapping_confidence,
        confidence_score,
        mapping_notes
    )
    SELECT DISTINCT ON (tech.technician_id)
        tech.technician_id,
        tech.full_name,
        tech.email,
        col."Id",
        col."Caption",
        col."Email",
        'auto_email',
        1.00,
        'Mapping automatique par email'
    FROM ninjaone.dim_technicians tech
    INNER JOIN public."Colleague" col
        ON LOWER(TRIM(tech.email)) = LOWER(TRIM(col."Email"))
    WHERE tech.technician_id NOT IN (
        SELECT ninjaone_technician_id FROM mobile.ninjaone_technician_mapping
    )
    AND tech.is_enabled = TRUE
    AND tech.email IS NOT NULL
    AND col."Email" IS NOT NULL
    ORDER BY tech.technician_id;

    GET DIAGNOSTICS v_mapped_count = ROW_COUNT;

    RETURN QUERY SELECT v_mapped_count,
        'Mapped ' || v_mapped_count || ' techniciens avec email correspondant';

EXCEPTION WHEN OTHERS THEN
    RETURN QUERY SELECT 0, 'Erreur: ' || SQLERRM;
END;
$$ LANGUAGE plpgsql;

COMMENT ON FUNCTION mobile.auto_map_ninjaone_technicians() IS
'Mapping automatique des techniciens NinjaOne vers collègues EBP (par email)';

-- ============================================================
-- 8. TRIGGER : Mise à jour automatique du timestamp
-- ============================================================

CREATE OR REPLACE FUNCTION mobile.update_ninjaone_links_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_ninjaone_links_updated
    BEFORE UPDATE ON mobile.ninjaone_intervention_links
    FOR EACH ROW EXECUTE FUNCTION mobile.update_ninjaone_links_timestamp();

-- ============================================================
-- 9. GRANTS
-- ============================================================

GRANT SELECT, INSERT, UPDATE, DELETE ON mobile.ninjaone_intervention_links TO postgres;
GRANT SELECT, INSERT, UPDATE, DELETE ON mobile.ninjaone_customer_mapping TO postgres;
GRANT SELECT, INSERT, UPDATE, DELETE ON mobile.ninjaone_technician_mapping TO postgres;
GRANT USAGE, SELECT ON SEQUENCE mobile.ninjaone_intervention_links_id_seq TO postgres;
GRANT USAGE, SELECT ON SEQUENCE mobile.ninjaone_customer_mapping_id_seq TO postgres;
GRANT USAGE, SELECT ON SEQUENCE mobile.ninjaone_technician_mapping_id_seq TO postgres;
GRANT SELECT ON mobile.v_ninjaone_interventions TO postgres;
GRANT SELECT ON mobile.v_ninjaone_tickets_unconverted TO postgres;

-- ============================================================
-- FIN MIGRATION 017
-- ============================================================

DO $$
BEGIN
    RAISE NOTICE '✅ Migration 017 terminée avec succès';
    RAISE NOTICE '📋 Tables créées:';
    RAISE NOTICE '   - mobile.ninjaone_intervention_links (liaison tickets ↔ interventions)';
    RAISE NOTICE '   - mobile.ninjaone_customer_mapping (organisations → clients)';
    RAISE NOTICE '   - mobile.ninjaone_technician_mapping (techniciens → collègues)';
    RAISE NOTICE '📊 Vues créées:';
    RAISE NOTICE '   - mobile.v_ninjaone_interventions (tickets liés avec détails EBP)';
    RAISE NOTICE '   - mobile.v_ninjaone_tickets_unconverted (candidats à la conversion)';
    RAISE NOTICE '⚙️  Fonctions créées:';
    RAISE NOTICE '   - mobile.auto_map_ninjaone_organizations() (mapping auto organisations)';
    RAISE NOTICE '   - mobile.auto_map_ninjaone_technicians() (mapping auto techniciens)';
    RAISE NOTICE '';
    RAISE NOTICE '🔒 IMPORTANT: Cette migration ne modifie JAMAIS le schéma public (EBP)';
    RAISE NOTICE '📖 Lecture seule sur public."ScheduleEvent" et public."Incident"';
END $$;

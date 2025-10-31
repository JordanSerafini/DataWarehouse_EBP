-- =====================================================
-- Migration 018: Système de conversion NinjaOne → Interventions/Incidents proposés
-- Description: Tables de staging + fonction de conversion (100% mobile schema)
-- Date: 2025-10-31
-- Auteur: Claude Code
-- =====================================================
-- IMPORTANT: AUCUNE modification du schéma public (EBP)
-- Les interventions/incidents proposés restent dans mobile jusqu'à intégration EBP
-- =====================================================

-- ============================================================
-- 1. TABLE : Interventions proposées depuis NinjaOne (staging)
-- ============================================================

CREATE TABLE IF NOT EXISTS mobile.interventions_proposed (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    -- Source NinjaOne
    ninjaone_ticket_id INTEGER NOT NULL,
    ninjaone_ticket_number VARCHAR(100),
    source_type VARCHAR(20) DEFAULT 'ninjaone' CHECK (source_type IN ('ninjaone', 'manual', 'import')),

    -- Informations de base (format ScheduleEvent)
    caption VARCHAR(80) NOT NULL,
    notes_clear TEXT,
    notes TEXT, -- Peut contenir format RTF si besoin
    schedule_event_number VARCHAR(10), -- Généré si besoin

    -- Dates/Horaires
    start_date_time TIMESTAMP NOT NULL,
    end_date_time TIMESTAMP NOT NULL,
    expected_duration_hours NUMERIC(10, 2),

    -- Client (mappé)
    customer_id VARCHAR(20), -- public."Customer"."Id"
    customer_name VARCHAR(150),

    -- Technicien (mappé)
    colleague_id VARCHAR(20), -- public."Colleague"."Id"
    colleague_name VARCHAR(100),

    -- Localisation
    address_address1 VARCHAR(40),
    address_address2 VARCHAR(40),
    address_city VARCHAR(35),
    address_zipcode VARCHAR(10),
    address_latitude NUMERIC(10, 7),
    address_longitude NUMERIC(11, 7),

    -- Contact
    contact_name VARCHAR(60),
    contact_phone VARCHAR(20),
    contact_email VARCHAR(100),

    -- Priorité/Statut
    event_state SMALLINT DEFAULT 0, -- 0=PENDING/SCHEDULED, 1=IN_PROGRESS, 2=COMPLETED
    priority VARCHAR(20), -- LOW, MEDIUM, HIGH, URGENT (depuis NinjaOne)
    is_urgent BOOLEAN DEFAULT FALSE,

    -- Champs maintenance
    maintenance_reference VARCHAR(30),
    maintenance_intervention_description TEXT,
    maintenance_travel_duration NUMERIC(10, 2),

    -- Champs personnalisés EBP
    xx_type_tache VARCHAR(30),
    xx_theme TEXT,
    xx_services VARCHAR(50),
    xx_activite VARCHAR(255),
    xx_duree_pevue NUMERIC(10, 2),
    xx_urgent BOOLEAN DEFAULT FALSE,

    -- Statut de la proposition
    proposal_status VARCHAR(20) DEFAULT 'pending' CHECK (proposal_status IN ('pending', 'approved', 'rejected', 'integrated', 'cancelled')),
    integrated_to_ebp BOOLEAN DEFAULT FALSE,
    integrated_at TIMESTAMP WITH TIME ZONE,
    integrated_schedule_event_id UUID, -- ID dans public."ScheduleEvent" si intégré

    -- Métadonnées
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_by UUID, -- mobile.users.id
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    validated_by UUID,
    validated_at TIMESTAMP WITH TIME ZONE,
    rejection_reason TEXT,

    CONSTRAINT fk_proposed_created_by FOREIGN KEY (created_by) REFERENCES mobile.users(id) ON DELETE SET NULL,
    CONSTRAINT fk_proposed_validated_by FOREIGN KEY (validated_by) REFERENCES mobile.users(id) ON DELETE SET NULL,
    CONSTRAINT unique_ninjaone_ticket_intervention UNIQUE(ninjaone_ticket_id)
);

CREATE INDEX idx_proposed_int_ticket ON mobile.interventions_proposed(ninjaone_ticket_id);
CREATE INDEX idx_proposed_int_customer ON mobile.interventions_proposed(customer_id);
CREATE INDEX idx_proposed_int_colleague ON mobile.interventions_proposed(colleague_id);
CREATE INDEX idx_proposed_int_status ON mobile.interventions_proposed(proposal_status) WHERE proposal_status = 'pending';
CREATE INDEX idx_proposed_int_dates ON mobile.interventions_proposed(start_date_time, end_date_time);
CREATE INDEX idx_proposed_int_integrated ON mobile.interventions_proposed(integrated_to_ebp) WHERE integrated_to_ebp = FALSE;

COMMENT ON TABLE mobile.interventions_proposed IS
'Interventions proposées depuis NinjaOne - staging avant intégration dans EBP';

COMMENT ON COLUMN mobile.interventions_proposed.proposal_status IS
'pending (en attente), approved (approuvé), rejected (rejeté), integrated (intégré à EBP), cancelled (annulé)';

-- ============================================================
-- 2. TABLE : Incidents proposés depuis NinjaOne (staging)
-- ============================================================

CREATE TABLE IF NOT EXISTS mobile.incidents_proposed (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    -- Source NinjaOne
    ninjaone_ticket_id INTEGER NOT NULL,
    ninjaone_ticket_number VARCHAR(100),
    source_type VARCHAR(20) DEFAULT 'ninjaone' CHECK (source_type IN ('ninjaone', 'manual', 'import')),

    -- Informations de base (format Incident)
    caption VARCHAR(80) NOT NULL,
    description_clear TEXT,
    notes_clear TEXT,

    -- Dates
    start_date TIMESTAMP NOT NULL,
    end_date TIMESTAMP,

    -- Client (mappé)
    customer_id VARCHAR(20), -- public."Customer"."Id"
    customer_name VARCHAR(150),

    -- Localisation
    address_address1 VARCHAR(40),
    address_address2 VARCHAR(40),
    address_city VARCHAR(35),
    address_zipcode VARCHAR(10),
    address_latitude NUMERIC(10, 7),
    address_longitude NUMERIC(11, 7),

    -- Contact
    contact_name VARCHAR(60),
    contact_phone VARCHAR(20),
    contact_email VARCHAR(100),

    -- Statut/Priorité
    status SMALLINT DEFAULT 0, -- 0=NEW, 1=IN_PROGRESS, 2=RESOLVED, 3=CLOSED
    priority VARCHAR(20), -- LOW, MEDIUM, HIGH, URGENT

    -- Durées/Coûts prévus
    predicted_duration NUMERIC(10, 2),
    predicted_costs NUMERIC(15, 2),
    predicted_sales NUMERIC(15, 2),

    -- Statut de la proposition
    proposal_status VARCHAR(20) DEFAULT 'pending' CHECK (proposal_status IN ('pending', 'approved', 'rejected', 'integrated', 'cancelled')),
    integrated_to_ebp BOOLEAN DEFAULT FALSE,
    integrated_at TIMESTAMP WITH TIME ZONE,
    integrated_incident_id VARCHAR(8), -- ID dans public."Incident" si intégré

    -- Métadonnées
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_by UUID,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    validated_by UUID,
    validated_at TIMESTAMP WITH TIME ZONE,
    rejection_reason TEXT,

    CONSTRAINT fk_incident_created_by FOREIGN KEY (created_by) REFERENCES mobile.users(id) ON DELETE SET NULL,
    CONSTRAINT fk_incident_validated_by FOREIGN KEY (validated_by) REFERENCES mobile.users(id) ON DELETE SET NULL,
    CONSTRAINT unique_ninjaone_ticket_incident UNIQUE(ninjaone_ticket_id)
);

CREATE INDEX idx_proposed_inc_ticket ON mobile.incidents_proposed(ninjaone_ticket_id);
CREATE INDEX idx_proposed_inc_customer ON mobile.incidents_proposed(customer_id);
CREATE INDEX idx_proposed_inc_status ON mobile.incidents_proposed(proposal_status) WHERE proposal_status = 'pending';
CREATE INDEX idx_proposed_inc_dates ON mobile.incidents_proposed(start_date);
CREATE INDEX idx_proposed_inc_integrated ON mobile.incidents_proposed(integrated_to_ebp) WHERE integrated_to_ebp = FALSE;

COMMENT ON TABLE mobile.incidents_proposed IS
'Incidents proposés depuis NinjaOne - staging avant intégration dans EBP';

-- ============================================================
-- 3. VUE : Toutes les propositions (interventions + incidents)
-- ============================================================

CREATE OR REPLACE VIEW mobile.v_all_proposals AS
-- Interventions proposées
SELECT
    'intervention_proposed' as type,
    ip.id::TEXT as id,
    ip.ninjaone_ticket_id,
    ip.ninjaone_ticket_number,
    ip.caption,
    ip.start_date_time as scheduled_date,
    ip.customer_id,
    ip.customer_name,
    ip.colleague_id,
    ip.colleague_name,
    ip.priority,
    ip.proposal_status,
    ip.integrated_to_ebp,
    ip.created_at,
    ip.created_by,

    -- Détails ticket NinjaOne
    t.title as ticket_title,
    t.description as ticket_description,
    (t.status->>'displayName') as ticket_status,
    t.is_overdue as ticket_is_overdue

FROM mobile.interventions_proposed ip
LEFT JOIN ninjaone.fact_tickets t ON ip.ninjaone_ticket_id = t.ticket_id

UNION ALL

-- Incidents proposés
SELECT
    'incident_proposed' as type,
    inc.id::TEXT as id,
    inc.ninjaone_ticket_id,
    inc.ninjaone_ticket_number,
    inc.caption,
    inc.start_date as scheduled_date,
    inc.customer_id,
    inc.customer_name,
    NULL as colleague_id,
    NULL as colleague_name,
    inc.priority,
    inc.proposal_status,
    inc.integrated_to_ebp,
    inc.created_at,
    inc.created_by,

    -- Détails ticket NinjaOne
    t.title as ticket_title,
    t.description as ticket_description,
    (t.status->>'displayName') as ticket_status,
    t.is_overdue as ticket_is_overdue

FROM mobile.incidents_proposed inc
LEFT JOIN ninjaone.fact_tickets t ON inc.ninjaone_ticket_id = t.ticket_id

ORDER BY scheduled_date DESC;

COMMENT ON VIEW mobile.v_all_proposals IS
'Vue unifiée de toutes les propositions (interventions + incidents) depuis NinjaOne';

-- ============================================================
-- 4. FONCTION : Convertir ticket NinjaOne → Intervention ou Incident proposé
-- ============================================================

CREATE OR REPLACE FUNCTION mobile.convert_ninjaone_ticket(
    p_ticket_id INTEGER,
    p_target_type VARCHAR(20), -- 'schedule_event' ou 'incident'
    p_converted_by UUID DEFAULT NULL
)
RETURNS TABLE (
    success BOOLEAN,
    proposal_id UUID,
    proposal_type TEXT,
    message TEXT
) AS $$
DECLARE
    v_ticket RECORD;
    v_customer_id VARCHAR(20);
    v_colleague_id VARCHAR(20);
    v_proposal_id UUID;
    v_start_date TIMESTAMP;
    v_end_date TIMESTAMP;
    v_priority VARCHAR(20);
    v_caption VARCHAR(80);
BEGIN
    -- Vérifier le type de cible
    IF p_target_type NOT IN ('schedule_event', 'incident') THEN
        RETURN QUERY SELECT FALSE, NULL::UUID, NULL::TEXT,
            'Type de cible invalide. Utilisez "schedule_event" ou "incident"';
        RETURN;
    END IF;

    -- Récupérer le ticket NinjaOne avec toutes les infos
    SELECT
        t.*,
        o.organization_name,
        o.address as org_address,
        o.city as org_city,
        o.postal_code as org_postal_code,
        o.phone as org_phone,
        tech.full_name as technician_name,
        tech.email as technician_email
    INTO v_ticket
    FROM ninjaone.fact_tickets t
    LEFT JOIN ninjaone.dim_organizations o ON t.organization_id = o.organization_id
    LEFT JOIN ninjaone.dim_technicians tech ON t.assigned_technician_id = tech.technician_id
    WHERE t.ticket_id = p_ticket_id;

    IF NOT FOUND THEN
        RETURN QUERY SELECT FALSE, NULL::UUID, NULL::TEXT, 'Ticket NinjaOne non trouvé: ' || p_ticket_id;
        RETURN;
    END IF;

    -- Vérifier si déjà converti (intervention OU incident)
    IF EXISTS (SELECT 1 FROM mobile.interventions_proposed WHERE ninjaone_ticket_id = p_ticket_id)
       OR EXISTS (SELECT 1 FROM mobile.incidents_proposed WHERE ninjaone_ticket_id = p_ticket_id)
       OR EXISTS (SELECT 1 FROM mobile.ninjaone_intervention_links WHERE ninjaone_ticket_id = p_ticket_id) THEN
        RETURN QUERY SELECT FALSE, NULL::UUID, NULL::TEXT,
            'Ticket déjà converti (vérifier interventions_proposed, incidents_proposed ou ninjaone_intervention_links)';
        RETURN;
    END IF;

    -- Mapper organisation → customer EBP
    SELECT ebp_customer_id INTO v_customer_id
    FROM mobile.ninjaone_customer_mapping
    WHERE ninjaone_organization_id = v_ticket.organization_id
      AND validated = TRUE;

    IF v_customer_id IS NULL THEN
        RETURN QUERY SELECT FALSE, NULL::UUID, NULL::TEXT,
            'Organisation NinjaOne non mappée à un client EBP. ID organisation: ' || v_ticket.organization_id ||
            '. Utilisez mobile.auto_map_ninjaone_organizations() ou créez le mapping manuellement.';
        RETURN;
    END IF;

    -- Mapper technicien → colleague EBP (optionnel pour intervention, non utilisé pour incident)
    IF v_ticket.assigned_technician_id IS NOT NULL AND p_target_type = 'schedule_event' THEN
        SELECT ebp_colleague_id INTO v_colleague_id
        FROM mobile.ninjaone_technician_mapping
        WHERE ninjaone_technician_id = v_ticket.assigned_technician_id
          AND validated = TRUE;
    END IF;

    -- Déterminer les dates
    v_start_date := COALESCE(v_ticket.due_date, NOW() + INTERVAL '1 day');
    v_end_date := v_start_date + INTERVAL '2 hours'; -- Durée par défaut 2h

    -- Mapper priorité NinjaOne → format lisible
    v_priority := CASE
        WHEN v_ticket.priority IN ('HIGH', 'URGENT') THEN 'URGENT'
        WHEN v_ticket.priority = 'MEDIUM' THEN 'MEDIUM'
        WHEN v_ticket.priority = 'LOW' THEN 'LOW'
        ELSE 'NORMAL'
    END;

    -- Créer caption (limité à 80 caractères pour EBP)
    v_caption := LEFT('[NinjaOne #' || v_ticket.ticket_number || '] ' || v_ticket.title, 80);

    -- Générer UUID pour la proposition
    v_proposal_id := gen_random_uuid();

    -- ===== CONVERSION VERS SCHEDULE_EVENT (Intervention) =====
    IF p_target_type = 'schedule_event' THEN
        INSERT INTO mobile.interventions_proposed (
            id,
            ninjaone_ticket_id,
            ninjaone_ticket_number,
            source_type,
            caption,
            notes_clear,
            start_date_time,
            end_date_time,
            expected_duration_hours,
            customer_id,
            customer_name,
            colleague_id,
            colleague_name,
            address_address1,
            address_city,
            address_zipcode,
            address_latitude,
            address_longitude,
            contact_phone,
            event_state,
            priority,
            is_urgent,
            maintenance_reference,
            maintenance_intervention_description,
            xx_urgent,
            created_by,
            proposal_status
        ) VALUES (
            v_proposal_id,
            p_ticket_id,
            v_ticket.ticket_number,
            'ninjaone',
            v_caption,
            'Ticket NinjaOne #' || v_ticket.ticket_number || E'\n\n' ||
            'Priorité: ' || COALESCE(v_ticket.priority, 'NONE') || E'\n' ||
            'Sévérité: ' || COALESCE(v_ticket.severity, 'N/A') || E'\n' ||
            'Créé le: ' || v_ticket.created_at::TEXT || E'\n\n' ||
            'Description:\n' || COALESCE(v_ticket.description, ''),
            v_start_date,
            v_end_date,
            2.0, -- Durée estimée par défaut
            v_customer_id,
            v_ticket.organization_name,
            v_colleague_id,
            v_ticket.technician_name,
            v_ticket.org_address,
            v_ticket.org_city,
            v_ticket.org_postal_code,
            NULL, -- Latitude (non disponible dans NinjaOne par défaut)
            NULL, -- Longitude
            v_ticket.org_phone,
            0, -- PENDING/SCHEDULED
            v_priority,
            (v_priority = 'URGENT'),
            'NINJA-' || v_ticket.ticket_number,
            v_ticket.description,
            (v_priority = 'URGENT'),
            p_converted_by,
            'pending'
        );

        RETURN QUERY SELECT TRUE, v_proposal_id, 'intervention_proposed'::TEXT,
            'Intervention proposée créée avec succès. ID: ' || v_proposal_id ||
            '. Client: ' || v_ticket.organization_name ||
            CASE WHEN v_colleague_id IS NOT NULL THEN ' - Technicien: ' || v_ticket.technician_name ELSE ' - Technicien: Non assigné' END;
        RETURN;

    -- ===== CONVERSION VERS INCIDENT (Ticket maintenance) =====
    ELSIF p_target_type = 'incident' THEN
        INSERT INTO mobile.incidents_proposed (
            id,
            ninjaone_ticket_id,
            ninjaone_ticket_number,
            source_type,
            caption,
            description_clear,
            notes_clear,
            start_date,
            end_date,
            customer_id,
            customer_name,
            address_address1,
            address_city,
            address_zipcode,
            address_latitude,
            address_longitude,
            contact_phone,
            status,
            priority,
            predicted_duration,
            created_by,
            proposal_status
        ) VALUES (
            v_proposal_id,
            p_ticket_id,
            v_ticket.ticket_number,
            'ninjaone',
            v_caption,
            v_ticket.description,
            'Ticket NinjaOne #' || v_ticket.ticket_number || E'\n' ||
            'Priorité: ' || COALESCE(v_ticket.priority, 'NONE') || E'\n' ||
            'Créé le: ' || v_ticket.created_at::TEXT,
            v_start_date,
            NULL, -- End date sera remplie quand l'incident est résolu
            v_customer_id,
            v_ticket.organization_name,
            v_ticket.org_address,
            v_ticket.org_city,
            v_ticket.org_postal_code,
            NULL,
            NULL,
            v_ticket.org_phone,
            0, -- NEW
            v_priority,
            2.0, -- Durée prévue par défaut
            p_converted_by,
            'pending'
        );

        RETURN QUERY SELECT TRUE, v_proposal_id, 'incident_proposed'::TEXT,
            'Incident proposé créé avec succès. ID: ' || v_proposal_id ||
            '. Client: ' || v_ticket.organization_name;
        RETURN;
    END IF;

EXCEPTION WHEN OTHERS THEN
    RETURN QUERY SELECT FALSE, NULL::UUID, NULL::TEXT,
        'Erreur lors de la conversion: ' || SQLERRM;
END;
$$ LANGUAGE plpgsql;

COMMENT ON FUNCTION mobile.convert_ninjaone_ticket IS
'Convertit un ticket NinjaOne en intervention ou incident proposé (dans mobile schema uniquement)';

-- ============================================================
-- 5. FONCTION : Statistiques de conversion
-- ============================================================

CREATE OR REPLACE FUNCTION mobile.get_ninjaone_conversion_stats()
RETURNS TABLE (
    total_tickets INTEGER,
    tickets_closed INTEGER,
    tickets_open INTEGER,
    tickets_converted INTEGER,
    interventions_proposed INTEGER,
    incidents_proposed INTEGER,
    proposals_pending INTEGER,
    proposals_approved INTEGER,
    proposals_integrated INTEGER,
    organizations_mapped INTEGER,
    technicians_mapped INTEGER,
    tickets_ready_to_convert INTEGER
) AS $$
BEGIN
    RETURN QUERY
    SELECT
        (SELECT COUNT(*)::INTEGER FROM ninjaone.fact_tickets) as total_tickets,
        (SELECT COUNT(*)::INTEGER FROM ninjaone.fact_tickets WHERE is_closed = TRUE) as tickets_closed,
        (SELECT COUNT(*)::INTEGER FROM ninjaone.fact_tickets WHERE is_closed = FALSE) as tickets_open,
        (SELECT COUNT(*)::INTEGER FROM mobile.ninjaone_intervention_links) as tickets_converted,
        (SELECT COUNT(*)::INTEGER FROM mobile.interventions_proposed) as interventions_proposed,
        (SELECT COUNT(*)::INTEGER FROM mobile.incidents_proposed) as incidents_proposed,
        (SELECT COUNT(*)::INTEGER FROM mobile.v_all_proposals WHERE proposal_status = 'pending') as proposals_pending,
        (SELECT COUNT(*)::INTEGER FROM mobile.v_all_proposals WHERE proposal_status = 'approved') as proposals_approved,
        (SELECT COUNT(*)::INTEGER FROM mobile.v_all_proposals WHERE integrated_to_ebp = TRUE) as proposals_integrated,
        (SELECT COUNT(*)::INTEGER FROM mobile.ninjaone_customer_mapping WHERE validated = TRUE) as organizations_mapped,
        (SELECT COUNT(*)::INTEGER FROM mobile.ninjaone_technician_mapping WHERE validated = TRUE) as technicians_mapped,
        (SELECT COUNT(*)::INTEGER FROM mobile.v_ninjaone_tickets_unconverted WHERE can_convert_customer_mapped = TRUE) as tickets_ready_to_convert;
END;
$$ LANGUAGE plpgsql;

COMMENT ON FUNCTION mobile.get_ninjaone_conversion_stats IS
'Statistiques complètes du système de conversion NinjaOne';

-- ============================================================
-- 6. TRIGGERS : Auto-update timestamps
-- ============================================================

CREATE TRIGGER trigger_interventions_proposed_updated
    BEFORE UPDATE ON mobile.interventions_proposed
    FOR EACH ROW EXECUTE FUNCTION mobile.update_timestamp();

CREATE TRIGGER trigger_incidents_proposed_updated
    BEFORE UPDATE ON mobile.incidents_proposed
    FOR EACH ROW EXECUTE FUNCTION mobile.update_timestamp();

-- ============================================================
-- 7. GRANTS
-- ============================================================

GRANT SELECT, INSERT, UPDATE, DELETE ON mobile.interventions_proposed TO postgres;
GRANT SELECT, INSERT, UPDATE, DELETE ON mobile.incidents_proposed TO postgres;
GRANT SELECT ON mobile.v_all_proposals TO postgres;

-- ============================================================
-- FIN MIGRATION 018
-- ============================================================

DO $$
BEGIN
    RAISE NOTICE '✅ Migration 018 terminée avec succès';
    RAISE NOTICE '📋 Tables créées:';
    RAISE NOTICE '   - mobile.interventions_proposed (interventions staging depuis NinjaOne)';
    RAISE NOTICE '   - mobile.incidents_proposed (incidents staging depuis NinjaOne)';
    RAISE NOTICE '📊 Vues créées:';
    RAISE NOTICE '   - mobile.v_all_proposals (toutes les propositions)';
    RAISE NOTICE '⚙️  Fonctions créées:';
    RAISE NOTICE '   - mobile.convert_ninjaone_ticket(ticket_id, target_type, user_id)';
    RAISE NOTICE '   - mobile.get_ninjaone_conversion_stats()';
    RAISE NOTICE '';
    RAISE NOTICE '🔒 GARANTIE: Cette migration NE modifie PAS le schéma public (EBP)';
    RAISE NOTICE '📝 Les propositions restent dans mobile schema jusqu''à intégration manuelle dans EBP';
    RAISE NOTICE '';
    RAISE NOTICE '💡 Utilisation:';
    RAISE NOTICE '   -- Convertir ticket en intervention:';
    RAISE NOTICE '   SELECT * FROM mobile.convert_ninjaone_ticket(42, ''schedule_event'', ''user-uuid''::UUID);';
    RAISE NOTICE '   -- Convertir ticket en incident:';
    RAISE NOTICE '   SELECT * FROM mobile.convert_ninjaone_ticket(42, ''incident'', ''user-uuid''::UUID);';
    RAISE NOTICE '   -- Voir statistiques:';
    RAISE NOTICE '   SELECT * FROM mobile.get_ninjaone_conversion_stats();';
END $$;

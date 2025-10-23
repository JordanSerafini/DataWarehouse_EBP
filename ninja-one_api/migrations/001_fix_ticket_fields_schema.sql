-- Migration: Fix ticket fields schema for NinjaOne integration
-- Date: 2025-10-23
-- Description: Changes status to JSONB and keeps priority/severity as VARCHAR

-- Drop existing materialized view that depends on these columns
DROP MATERIALIZED VIEW IF EXISTS ninjaone.mv_daily_ticket_summary;

-- Alter table columns
-- status is an object in NinjaOne API: {statusId, displayName, parentId}
ALTER TABLE ninjaone.fact_tickets
    ALTER COLUMN status TYPE jsonb
    USING CASE
        WHEN status IS NULL THEN NULL
        ELSE to_jsonb(status)
    END;

-- priority and severity are strings in NinjaOne API (e.g., "HIGH", "MAJOR")
-- Ensure they are VARCHAR(50) - if they were JSONB, convert back
ALTER TABLE ninjaone.fact_tickets
    ALTER COLUMN priority TYPE varchar(50)
    USING CASE
        WHEN priority IS NULL THEN NULL
        WHEN jsonb_typeof(priority::jsonb) IS NOT NULL THEN trim(both '"' from (priority::text))
        ELSE priority::varchar(50)
    END;

ALTER TABLE ninjaone.fact_tickets
    ALTER COLUMN severity TYPE varchar(50)
    USING CASE
        WHEN severity IS NULL THEN NULL
        WHEN jsonb_typeof(severity::jsonb) IS NOT NULL THEN trim(both '"' from (severity::text))
        ELSE severity::varchar(50)
    END;

-- Recreate the materialized view with correct field types
CREATE MATERIALIZED VIEW ninjaone.mv_daily_ticket_summary AS
SELECT
    d.date,
    d.year,
    d.month,
    d.day,
    o.organization_id,
    o.organization_name,
    COUNT(*) AS total_tickets,
    COUNT(CASE WHEN (t.status->>'displayName') IN ('OPEN', 'NEW', 'Ouvert', 'Nouveau') THEN 1 END) AS open_tickets,
    COUNT(CASE WHEN (t.status->>'displayName') IN ('IN_PROGRESS', 'En cours') THEN 1 END) AS in_progress_tickets,
    COUNT(CASE WHEN (t.status->>'displayName') IN ('RESOLVED', 'RÉSOLU', 'Résolu') THEN 1 END) AS resolved_tickets,
    COUNT(CASE WHEN (t.status->>'displayName') IN ('CLOSED', 'FERMÉ', 'Fermé') THEN 1 END) AS closed_tickets,
    COUNT(CASE WHEN t.priority IN ('LOW', 'Faible', 'Basse') THEN 1 END) AS low_priority,
    COUNT(CASE WHEN t.priority IN ('MEDIUM', 'Moyen', 'Moyenne') THEN 1 END) AS medium_priority,
    COUNT(CASE WHEN t.priority IN ('HIGH', 'Haut', 'Haute', 'Élevé') THEN 1 END) AS high_priority,
    COUNT(CASE WHEN t.priority IN ('URGENT', 'Urgente') THEN 1 END) AS urgent_priority,
    COUNT(CASE WHEN t.priority IN ('CRITICAL', 'Critique') THEN 1 END) AS critical_priority,
    AVG(t.time_to_resolution_seconds / 3600.0) AS avg_resolution_time_hours,
    AVG(t.time_spent_seconds / 3600.0) AS avg_time_spent_hours,
    COUNT(CASE WHEN t.is_overdue THEN 1 END) AS overdue_tickets,
    CURRENT_TIMESTAMP AS last_refreshed
FROM ninjaone.fact_tickets t
JOIN ninjaone.dim_time d ON t.created_date_id = d.time_id
JOIN ninjaone.dim_organizations o ON t.organization_id = o.organization_id
GROUP BY d.date, d.year, d.month, d.day, o.organization_id, o.organization_name;

-- Create indexes for the materialized view
CREATE INDEX idx_mv_daily_date ON ninjaone.mv_daily_ticket_summary(date);
CREATE INDEX idx_mv_daily_org ON ninjaone.mv_daily_ticket_summary(organization_id);

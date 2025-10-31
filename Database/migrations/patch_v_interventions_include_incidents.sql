/**
 * PATCH URGENT: Corriger mobile.v_interventions pour inclure les Incidents
 *
 * Problème: La vue ne regardait que ScheduleEvent, pas Incident
 * Solution: UNION des deux tables pour avoir TOUS les types d'interventions
 */

-- Supprimer l'ancienne vue
DROP VIEW IF EXISTS mobile.v_interventions CASCADE;

-- Recréer la vue avec UNION ScheduleEvent + Incident
CREATE OR REPLACE VIEW mobile.v_interventions AS
-- PARTIE 1: ScheduleEvent (interventions planifiées)
SELECT
  se."Id"::VARCHAR(50) AS intervention_id,
  'schedule_event' AS source_type,
  se."EventType"::VARCHAR(50) AS event_type_id,
  se."Caption" AS title,
  COALESCE(
    se."Maintenance_InterventionDescriptionClear",
    se."Maintenance_InterventionDescription",
    se."NotesClear",
    se."Notes"
  ) AS description,
  se."StartDateTime" AS start_date,
  se."EndDateTime" AS end_date,
  se."CustomerId" AS customer_id,
  c."Name" AS customer_name,
  c."MainDeliveryContact_Name" AS contact_name,
  c."MainDeliveryContact_Phone" AS contact_phone,
  c."MainDeliveryContact_CellPhone" AS contact_mobile,
  CONCAT_WS(' ', se."Address_Address1", se."Address_Address2", se."Address_Address3") AS address,
  se."Address_City" AS city,
  se."Address_ZipCode" AS zipcode,
  se."Address_Latitude" AS latitude,
  se."Address_Longitude" AS longitude,
  se."Maintenance_CustomerProductId" AS product_id,
  cp."DescriptionClear" AS product_description,
  cp."TrackingNumber" AS product_tracking,
  se."ColleagueId" AS technician_id,
  se."ColleagueId" AS technician_name,
  se."sysCreatedDate" AS created_at,
  se."sysModifiedDate" AS updated_at,
  CASE
    WHEN se."StartDateTime" < NOW() THEN TRUE
    ELSE FALSE
  END AS is_overdue,
  CASE
    WHEN se."StartDateTime" >= NOW() AND se."StartDateTime" <= (NOW() + INTERVAL '24 hours') THEN TRUE
    ELSE FALSE
  END AS is_upcoming_soon,
  se."EventState" AS event_state,
  NULL::SMALLINT AS incident_status
FROM public."ScheduleEvent" se
LEFT JOIN public."Customer" c ON se."CustomerId" = c."Id"
LEFT JOIN public."CustomerProduct" cp ON se."Maintenance_CustomerProductId" = cp."Id"
WHERE se."EventState" >= 0

UNION ALL

-- PARTIE 2: Incident (tickets de maintenance)
SELECT
  inc."Id"::VARCHAR(50) AS intervention_id,
  'incident' AS source_type,
  NULL AS event_type_id,
  inc."Caption" AS title,
  inc."Description" AS description,
  inc."StartDate" AS start_date,
  inc."StartDate" + INTERVAL '2 hours' AS end_date, -- Durée estimée par défaut
  inc."CustomerId" AS customer_id,
  inc."CustomerName" AS customer_name,
  inc."Contact_Name" AS contact_name,
  inc."Contact_Phone" AS contact_phone,
  inc."Contact_CellPhone" AS contact_mobile,
  CONCAT_WS(' ', inc."Address_Address1", inc."Address_Address2", inc."Address_Address3") AS address,
  inc."Address_City" AS city,
  inc."Address_ZipCode" AS zipcode,
  inc."Address_Latitude" AS latitude,
  inc."Address_Longitude" AS longitude,
  NULL AS product_id,
  NULL AS product_description,
  NULL AS product_tracking,
  inc."CreatorColleagueId" AS technician_id,
  inc."CreatorColleagueId" AS technician_name,
  inc."sysCreatedDate" AS created_at,
  inc."sysModifiedDate" AS updated_at,
  CASE
    WHEN inc."StartDate" < NOW() AND inc."Status" NOT IN (2, 3) THEN TRUE -- 2=Terminé, 3=Annulé
    ELSE FALSE
  END AS is_overdue,
  CASE
    WHEN inc."StartDate" >= NOW() AND inc."StartDate" <= (NOW() + INTERVAL '24 hours') THEN TRUE
    ELSE FALSE
  END AS is_upcoming_soon,
  -- Mapping du Status Incident vers EventState pour compatibilité
  CASE
    WHEN inc."Status" = 0 THEN 0  -- À faire → Planifié
    WHEN inc."Status" = 1 THEN 1  -- En cours → En cours
    WHEN inc."Status" = 2 THEN 2  -- Terminé → Terminé
    WHEN inc."Status" = 3 THEN -1 -- Annulé → Annulé
    ELSE 0
  END AS event_state,
  inc."Status" AS incident_status
FROM public."Incident" inc;

COMMENT ON VIEW mobile.v_interventions IS
'Vue combinée des interventions planifiées (ScheduleEvent) et tickets de maintenance (Incident).
Utilise UNION ALL pour afficher tous les types d''interventions.
- source_type: ''schedule_event'' ou ''incident''
- incident_status: NULL pour ScheduleEvent, 0-3 pour Incident (0=À faire, 1=En cours, 2=Terminé, 3=Annulé)';

-- Message de confirmation
DO $$
BEGIN
  RAISE NOTICE '✅ Vue mobile.v_interventions corrigée';
  RAISE NOTICE '📋 Maintenant inclut:';
  RAISE NOTICE '   - ScheduleEvent (interventions planifiées)';
  RAISE NOTICE '   - Incident (tickets de maintenance)';
  RAISE NOTICE '';
  RAISE NOTICE '🔍 Nouvelle colonne source_type pour différencier les types';
  RAISE NOTICE '💡 Les utilisateurs verront maintenant TOUTES leurs interventions';
END $$;

-- Script pour créer 5 interventions de test pour JORDAN
-- Exécuter avec: psql -h localhost -U postgres -d ebp_db -f create_jordan_interventions.sql

-- Créer 5 interventions pour JORDAN en copiant le format existant
INSERT INTO public."ScheduleEvent" (
    "Id", "ScheduleEventNumber", "Caption",
    "StartDateTime", "EndDateTime",
    "EventState", "ColleagueId", "CustomerId",
    "ExpectedDuration_DurationInHours",
    "Maintenance_InterventionDescriptionClear",
    "Address_City",
    "sysCreatedDate", "sysModifiedDate"
)
SELECT
    gen_random_uuid(),
    'JOR-' || LPAD((ROW_NUMBER() OVER ())::TEXT, 5, '0'),
    CASE ROW_NUMBER() OVER ()
        WHEN 1 THEN 'Maintenance climatisation'
        WHEN 2 THEN 'Dépannage électrique'
        WHEN 3 THEN 'Installation chaudière'
        WHEN 4 THEN 'Contrôle ascenseur'
        ELSE 'Formation client'
    END,
    CURRENT_DATE + ((ROW_NUMBER() OVER ()) || ' days')::INTERVAL + INTERVAL '9 hours',
    CURRENT_DATE + ((ROW_NUMBER() OVER ()) || ' days')::INTERVAL + INTERVAL '11 hours',
    0, -- Planifiée (EventState = 0)
    'JORDAN',
    c."Id",
    2.0,
    'Intervention de maintenance préventive - TEST',
    c."MainDeliveryAddress_City",
    NOW(),
    NOW()
FROM (
    SELECT "Id", "MainDeliveryAddress_City"
    FROM public."Customer"
    WHERE "MainDeliveryAddress_City" IS NOT NULL
    LIMIT 5
) c;

-- Vérifier les interventions créées
SELECT
    "ScheduleEventNumber" as numero,
    "Caption" as titre,
    TO_CHAR("StartDateTime", 'DD/MM/YYYY HH24:MI') as debut,
    "EventState" as statut,
    "ColleagueId" as technicien
FROM public."ScheduleEvent"
WHERE "ColleagueId" = 'JORDAN'
ORDER BY "StartDateTime";

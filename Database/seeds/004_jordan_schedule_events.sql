/**
 * SEED SCHEDULE EVENTS POUR JORDAN
 *
 * Crée 5 interventions de test pour Jordan avec des dates futures
 *
 * Auteur: Claude Code
 * Date: 2025-10-26
 */

-- Créer 5 interventions pour JORDAN avec des dates futures
DO $$
DECLARE
    v_customer_id VARCHAR(20);
    v_base_date TIMESTAMP := CURRENT_DATE + INTERVAL '1 day';
BEGIN
    -- Récupérer un client au hasard
    SELECT "Id" INTO v_customer_id
    FROM public."Customer"
    WHERE "Name" IS NOT NULL
    LIMIT 1;

    RAISE NOTICE 'Customer sélectionné: %', v_customer_id;

    -- Intervention 1: Demain matin (Planifiée)
    INSERT INTO public."ScheduleEvent" (
        "Id", "ScheduleEventNumber", "Caption",
        "StartDateTime", "EndDateTime",
        "EventState", "EventType",
        "ColleagueId", "CustomerId",
        "ExpectedDuration_DurationInHours",
        "Maintenance_InterventionDescriptionClear",
        "Address_Address1", "Address_City", "Address_ZipCode",
        "sysCreatedDate", "sysModifiedDate"
    ) VALUES (
        gen_random_uuid(),
        'INT-2025-001',
        'Maintenance préventive climatisation',
        v_base_date + INTERVAL '8 hours',
        v_base_date + INTERVAL '10 hours',
        0, -- Planifiée
        1, -- Maintenance
        'JORDAN',
        v_customer_id,
        2.0,
        'Contrôle annuel du système de climatisation - vérification des filtres et du gaz',
        '123 Avenue des Champs',
        'Paris',
        '75008',
        NOW(),
        NOW()
    );

    -- Intervention 2: Demain après-midi (Planifiée)
    INSERT INTO public."ScheduleEvent" (
        "Id", "ScheduleEventNumber", "Caption",
        "StartDateTime", "EndDateTime",
        "EventState", "EventType",
        "ColleagueId", "CustomerId",
        "ExpectedDuration_DurationInHours",
        "Maintenance_InterventionDescriptionClear",
        "Address_Address1", "Address_City", "Address_ZipCode",
        "Address_Latitude", "Address_Longitude",
        "sysCreatedDate", "sysModifiedDate"
    ) VALUES (
        gen_random_uuid(),
        'INT-2025-002',
        'Dépannage système électrique',
        v_base_date + INTERVAL '14 hours',
        v_base_date + INTERVAL '16 hours',
        0,
        2, -- Dépannage
        'JORDAN',
        v_customer_id,
        2.0,
        'Problème électrique signalé - court-circuit probable',
        '45 Rue de la Paix',
        'Lyon',
        '69001',
        45.7640,
        4.8357,
        NOW(),
        NOW()
    );

    -- Intervention 3: Dans 2 jours (Planifiée)
    INSERT INTO public."ScheduleEvent" (
        "Id", "ScheduleEventNumber", "Caption",
        "StartDateTime", "EndDateTime",
        "EventState", "EventType",
        "ColleagueId", "CustomerId",
        "ExpectedDuration_DurationInHours",
        "Maintenance_InterventionDescriptionClear",
        "Address_Address1", "Address_City", "Address_ZipCode",
        "sysCreatedDate", "sysModifiedDate"
    ) VALUES (
        gen_random_uuid(),
        'INT-2025-003',
        'Installation nouvelle chaudière',
        v_base_date + INTERVAL '2 days' + INTERVAL '9 hours',
        v_base_date + INTERVAL '2 days' + INTERVAL '13 hours',
        0,
        3, -- Installation
        'JORDAN',
        v_customer_id,
        4.0,
        'Remplacement de la chaudière ancienne par un modèle récent',
        '78 Boulevard Haussmann',
        'Marseille',
        '13001',
        NOW(),
        NOW()
    );

    -- Intervention 4: Dans 3 jours (Planifiée)
    INSERT INTO public."ScheduleEvent" (
        "Id", "ScheduleEventNumber", "Caption",
        "StartDateTime", "EndDateTime",
        "EventState", "EventType",
        "ColleagueId", "CustomerId",
        "ExpectedDuration_DurationInHours",
        "Maintenance_InterventionDescriptionClear",
        "sysCreatedDate", "sysModifiedDate"
    ) VALUES (
        gen_random_uuid(),
        'INT-2025-004',
        'Contrôle annuel ascenseur',
        v_base_date + INTERVAL '3 days' + INTERVAL '10 hours',
        v_base_date + INTERVAL '3 days' + INTERVAL '11 hours',
        0,
        1,
        'JORDAN',
        v_customer_id,
        1.0,
        'Contrôle réglementaire annuel de l''ascenseur',
        NOW(),
        NOW()
    );

    -- Intervention 5: Dans 1 semaine (Planifiée)
    INSERT INTO public."ScheduleEvent" (
        "Id", "ScheduleEventNumber", "Caption",
        "StartDateTime", "EndDateTime",
        "EventState", "EventType",
        "ColleagueId", "CustomerId",
        "ExpectedDuration_DurationInHours",
        "Maintenance_InterventionDescriptionClear",
        "sysCreatedDate", "sysModifiedDate"
    ) VALUES (
        gen_random_uuid(),
        'INT-2025-005',
        'Formation utilisateur logiciel',
        v_base_date + INTERVAL '7 days' + INTERVAL '14 hours',
        v_base_date + INTERVAL '7 days' + INTERVAL '17 hours',
        0,
        4, -- Formation
        'JORDAN',
        v_customer_id,
        3.0,
        'Formation du client sur le nouveau système de gestion',
        NOW(),
        NOW()
    );

    RAISE NOTICE '✅ 5 interventions créées pour JORDAN';
END $$;

-- Vérifier les interventions créées
SELECT
    "ScheduleEventNumber" as numero,
    "Caption" as titre,
    "StartDateTime" as debut,
    "EventState" as statut,
    "ExpectedDuration_DurationInHours" as duree_h
FROM public."ScheduleEvent"
WHERE "ColleagueId" = 'JORDAN'
ORDER BY "StartDateTime";

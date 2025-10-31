/**
 * SEED: Ajouter l'intervention JORDN006 manquante
 *
 * Ce script ajoute l'intervention JORDN006 qui était manquante dans les seeds précédents.
 * Cela permet de tester les uploads de photos/signatures avec cette référence.
 *
 * Date: 2025-10-31
 */

DO $$
DECLARE
    v_jordan_id VARCHAR(20) := 'JORDAN';
    v_customer_id VARCHAR(20);
    v_intervention_id UUID;
    v_schedule_number VARCHAR(50) := 'JORDN006';
    v_count INTEGER;
BEGIN
    -- Vérifier que Jordan existe
    IF NOT EXISTS (SELECT 1 FROM public."Colleague" WHERE "Id" = v_jordan_id) THEN
        RAISE EXCEPTION 'ERREUR: Colleague JORDAN n''existe pas !';
    END IF;

    -- Récupérer un client aléatoire
    SELECT "Id" INTO v_customer_id
    FROM public."Customer"
    WHERE "ActiveState" = 1
    ORDER BY RANDOM()
    LIMIT 1;

    RAISE NOTICE '';
    RAISE NOTICE '═══════════════════════════════════════════════════════════';
    RAISE NOTICE '    AJOUT INTERVENTION JORDN006 POUR JORDAN';
    RAISE NOTICE '═══════════════════════════════════════════════════════════';
    RAISE NOTICE '';

    -- Vérifier si l'intervention existe déjà
    SELECT COUNT(*) INTO v_count
    FROM public."ScheduleEvent"
    WHERE "ScheduleEventNumber" = v_schedule_number;

    IF v_count = 0 THEN
        v_intervention_id := gen_random_uuid();

        INSERT INTO public."ScheduleEvent" (
            "Id", "ScheduleEventNumber", "Caption",
            "NotesClear", "Maintenance_InterventionDescriptionClear",
            "ColleagueId", "CustomerId",
            "StartDateTime", "EndDateTime",
            "EventState", "EventType",
            "ExpectedDuration_DurationInHours", "AchievedDuration_DurationInHours",
            "Address_Address1", "Address_City", "Address_ZipCode",
            "Address_Latitude", "Address_Longitude",
            "sysCreatedDate", "sysModifiedDate",
            -- Colonnes NOT NULL avec valeurs par défaut
            "xx_Projet", "LineType", "LineOrder", "ScheduleShowTimeLine",
            "SalePriceVatExcluded", "NetAmountVatExcluded",
            "HourlyCostPrice", "CostAmount", "IncludeInRealizedCost",
            "ToInvoice", "DocumentType", "Address_Npai",
            "Contact_NaturalPerson", "Contact_OptIn", "ReminderEnabled",
            "Maintenance_InvoiceTravelExpenseOnLastIntervention",
            "Maintenance_SendConfirmationMail", "Maintenance_NextEventToForesee",
            "Maintenance_DecreaseContractCounterForNextEvent",
            "Maintenance_IncludeInIncidentPredictedCost",
            "Maintenance_IncludeInContractPredictedCost",
            "InvoiceInterveners", "InvoiceEquipments", "PredictedCostAmount",
            "xx_URGENT", "Contact_AllowUsePersonnalDatas", "DisplayType", "ExceptionWorked",
            -- 50 PayrollVariable columns
            "PayrollVariableDuration0", "PayrollVariableDuration1", "PayrollVariableDuration2", "PayrollVariableDuration3", "PayrollVariableDuration4",
            "PayrollVariableDuration5", "PayrollVariableDuration6", "PayrollVariableDuration7", "PayrollVariableDuration8", "PayrollVariableDuration9",
            "PayrollVariableDuration10", "PayrollVariableDuration11", "PayrollVariableDuration12", "PayrollVariableDuration13", "PayrollVariableDuration14",
            "PayrollVariableDuration15", "PayrollVariableDuration16", "PayrollVariableDuration17", "PayrollVariableDuration18", "PayrollVariableDuration19",
            "PayrollVariableDuration20", "PayrollVariableDuration21", "PayrollVariableDuration22", "PayrollVariableDuration23", "PayrollVariableDuration24",
            "PayrollVariableDuration25", "PayrollVariableDuration26", "PayrollVariableDuration27", "PayrollVariableDuration28", "PayrollVariableDuration29",
            "PayrollVariableDuration30", "PayrollVariableDuration31", "PayrollVariableDuration32", "PayrollVariableDuration33", "PayrollVariableDuration34",
            "PayrollVariableDuration35", "PayrollVariableDuration36", "PayrollVariableDuration37", "PayrollVariableDuration38", "PayrollVariableDuration39",
            "PayrollVariableDuration40", "PayrollVariableDuration41", "PayrollVariableDuration42", "PayrollVariableDuration43", "PayrollVariableDuration44",
            "PayrollVariableDuration45", "PayrollVariableDuration46", "PayrollVariableDuration47", "PayrollVariableDuration48", "PayrollVariableDuration49",
            -- ExceptionDaySchedule pour 7 jours (0-6)
            "ExceptionDaySchedule0_Active", "ExceptionDaySchedule0_Customize", "ExceptionDaySchedule0_Duration", "ExceptionDaySchedule0_StartTime", "ExceptionDaySchedule0_EndTime",
            "ExceptionDaySchedule1_Active", "ExceptionDaySchedule1_Customize", "ExceptionDaySchedule1_Duration", "ExceptionDaySchedule1_StartTime", "ExceptionDaySchedule1_EndTime",
            "ExceptionDaySchedule2_Active", "ExceptionDaySchedule2_Customize", "ExceptionDaySchedule2_Duration", "ExceptionDaySchedule2_StartTime", "ExceptionDaySchedule2_EndTime",
            "ExceptionDaySchedule3_Active", "ExceptionDaySchedule3_Customize", "ExceptionDaySchedule3_Duration", "ExceptionDaySchedule3_StartTime", "ExceptionDaySchedule3_EndTime",
            "ExceptionDaySchedule4_Active", "ExceptionDaySchedule4_Customize", "ExceptionDaySchedule4_Duration", "ExceptionDaySchedule4_StartTime", "ExceptionDaySchedule4_EndTime",
            "ExceptionDaySchedule5_Active", "ExceptionDaySchedule5_Customize", "ExceptionDaySchedule5_Duration", "ExceptionDaySchedule5_StartTime", "ExceptionDaySchedule5_EndTime",
            "ExceptionDaySchedule6_Active", "ExceptionDaySchedule6_Customize", "ExceptionDaySchedule6_Duration", "ExceptionDaySchedule6_StartTime", "ExceptionDaySchedule6_EndTime",
            -- Autres colonnes NOT NULL
            "PlannedHours", "WorkedHours", "HasAssociatedFiles", "ConflictIndicator", "ConflictTypes",
            "IsScheduleException", "MustBeCalculated", "GlobalPercentComplete", "LabourPercentComplete",
            "CreatedByExecutionQuote", "DateChangeRemindEnabled"
        ) SELECT
            v_intervention_id, v_schedule_number,
            'Test JORDN006 - Upload Photos & Signature',
            'Intervention de test pour l''upload de fichiers',
            'Test complet des fonctionnalités photos et signature',
            v_jordan_id, v_customer_id,
            NOW() + INTERVAL '3 hours', NOW() + INTERVAL '6 hours',
            1, -- IN_PROGRESS (pour pouvoir tester immédiatement)
            'bb9d173f-9937-4cde-a665-58a66a24ea15'::uuid, -- Rendez-vous
            3.0, 0.5, -- 30min déjà passées
            '10 Rue de Test', 'Paris', '75001',
            48.8566, 2.3522,
            NOW(), NOW(),
            -- Valeurs par défaut NOT NULL
            false, 0, 0, false,
            0, 0, 0, 0, 0,
            false, 0, false,
            false, false, false,
            0, false, false, false,
            0, 0,
            false, false, 0,
            false, false, 0, false,
            -- 50 PayrollVariableDuration (tous à 0)
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            -- ExceptionDaySchedule pour 7 jours (Active, Customize, Duration, StartTime, EndTime)
            false, false, 0, '1900-01-01 00:00:00'::timestamp, '1900-01-01 00:00:00'::timestamp,
            false, false, 0, '1900-01-01 00:00:00'::timestamp, '1900-01-01 00:00:00'::timestamp,
            false, false, 0, '1900-01-01 00:00:00'::timestamp, '1900-01-01 00:00:00'::timestamp,
            false, false, 0, '1900-01-01 00:00:00'::timestamp, '1900-01-01 00:00:00'::timestamp,
            false, false, 0, '1900-01-01 00:00:00'::timestamp, '1900-01-01 00:00:00'::timestamp,
            false, false, 0, '1900-01-01 00:00:00'::timestamp, '1900-01-01 00:00:00'::timestamp,
            false, false, 0, '1900-01-01 00:00:00'::timestamp, '1900-01-01 00:00:00'::timestamp,
            -- Autres colonnes NOT NULL
            0, 0, false, 0, 0,
            false, false, 0, 0,
            false, false;

        RAISE NOTICE '✅ Intervention créée: % (UUID: %)', v_schedule_number, v_intervention_id;
        RAISE NOTICE '   Statut: IN_PROGRESS';
        RAISE NOTICE '   Client: %', v_customer_id;
        RAISE NOTICE '   Technicien: %', v_jordan_id;
    ELSE
        RAISE NOTICE '⚠️  L''intervention % existe déjà', v_schedule_number;

        -- Afficher les détails de l'intervention existante
        SELECT "Id"::text INTO v_intervention_id
        FROM public."ScheduleEvent"
        WHERE "ScheduleEventNumber" = v_schedule_number;

        RAISE NOTICE '   UUID existant: %', v_intervention_id;
    END IF;

    RAISE NOTICE '';
    RAISE NOTICE '═══════════════════════════════════════════════════════════';
    RAISE NOTICE '✅ Vous pouvez maintenant tester l''upload avec JORDN006';
    RAISE NOTICE '═══════════════════════════════════════════════════════════';
    RAISE NOTICE '';
END $$;

/**
 * SEED INTERVENTIONS DE TEST POUR JORDAN
 *
 * Ce script crée des interventions de test pour Jordan (ScheduleEvent dans EBP)
 * Version simplifiée compatible avec la structure réelle de ScheduleEvent
 *
 * ✅ CE QUE CE SCRIPT FAIT :
 * - Crée 5 interventions de test avec différents statuts
 * - PENDING (1), IN_PROGRESS (1), SCHEDULED (2), COMPLETED (1)
 *
 * Auteur: Claude Code
 * Date: 2025-10-26
 */

DO $$
DECLARE
    v_jordan_id VARCHAR(20) := 'JORDAN';
    v_customer_id VARCHAR(20);
    v_intervention_id UUID;
    v_schedule_number VARCHAR(50);
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
    RAISE NOTICE '    CRÉATION DES INTERVENTIONS DE TEST POUR JORDAN';
    RAISE NOTICE '═══════════════════════════════════════════════════════════';
    RAISE NOTICE '';

    -- ========================================================================
    -- INTERVENTION 1: PENDING
    -- ========================================================================
    v_intervention_id := gen_random_uuid();
    v_schedule_number := 'INT-001';

    SELECT COUNT(*) INTO v_count FROM public."ScheduleEvent" WHERE "ScheduleEventNumber" = v_schedule_number;

    IF v_count = 0 THEN
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
            'Test PENDING - Maintenance climatisation',
            'Intervention test en attente',
            'Contrôle annuel climatisation',
            v_jordan_id, v_customer_id,
            NOW() + INTERVAL '2 hours', NOW() + INTERVAL '5 hours',
            4, -- PENDING
            'bb9d173f-9937-4cde-a665-58a66a24ea15'::uuid, -- Rendez-vous
            3.0, 0.0, -- Durées
            '15 Rue de la République', 'Lyon', '69002',
            45.7597, 4.8422,
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

        RAISE NOTICE '✅ Intervention 1: % (PENDING)', v_schedule_number;
    ELSE
        RAISE NOTICE '⚠️  Intervention 1 existe déjà: %', v_schedule_number;
    END IF;

    -- ========================================================================
    -- INTERVENTION 2: IN_PROGRESS
    -- ========================================================================
    v_intervention_id := gen_random_uuid();
    v_schedule_number := 'INT-002';

    SELECT COUNT(*) INTO v_count FROM public."ScheduleEvent" WHERE "ScheduleEventNumber" = v_schedule_number;

    IF v_count = 0 THEN
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
            'Test IN_PROGRESS - Réparation urgente',
            'En cours - TimeSheet à tester',
            'Réparation système électrique',
            v_jordan_id, v_customer_id,
            NOW() - INTERVAL '1 hour', NOW() + INTERVAL '2 hours',
            NOW() - INTERVAL '1 hour',
            1, -- IN_PROGRESS
            'bb9d173f-9937-4cde-a665-58a66a24ea15'::uuid, -- Rendez-vous
            2.5, 1.0, -- 1h déjà passée
            '22 Avenue des Champs', 'Paris', '75008',
            48.8698, 2.3078,
            NOW() - INTERVAL '2 hours', NOW(),
            false, 0, 0, false, 0, 0, 0, 0, 0,
            false, 0, false, false, false, false,
            0, false, false, false, 0, 0,
            false, false, 0, false, false, 0, false,
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

        RAISE NOTICE '✅ Intervention 2: % (IN_PROGRESS)', v_schedule_number;
    ELSE
        RAISE NOTICE '⚠️  Intervention 2 existe déjà: %', v_schedule_number;
    END IF;

    -- ========================================================================
    -- INTERVENTION 3: SCHEDULED (demain)
    -- ========================================================================
    v_intervention_id := gen_random_uuid();
    v_schedule_number := 'INT-003';

    SELECT COUNT(*) INTO v_count FROM public."ScheduleEvent" WHERE "ScheduleEventNumber" = v_schedule_number;

    IF v_count = 0 THEN
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
            'Test SCHEDULED - Installation',
            'Planifiée demain matin',
            'Installation système de sécurité',
            v_jordan_id, v_customer_id,
            NOW() + INTERVAL '1 day' + INTERVAL '9 hours',
            NOW() + INTERVAL '1 day' + INTERVAL '13 hours',
            0, -- SCHEDULED
            'bb9d173f-9937-4cde-a665-58a66a24ea15'::uuid, -- Rendez-vous
            4.0, 0.0,
            '8 Boulevard Haussmann', 'Marseille', '13001',
            43.2965, 5.3698,
            NOW(), NOW(),
            false, 0, 0, false, 0, 0, 0, 0, 0,
            false, 0, false, false, false, false,
            0, false, false, false, 0, 0,
            false, false, 0, false, false, 0, false,
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

        RAISE NOTICE '✅ Intervention 3: % (SCHEDULED)', v_schedule_number;
    ELSE
        RAISE NOTICE '⚠️  Intervention 3 existe déjà: %', v_schedule_number;
    END IF;

    -- ========================================================================
    -- INTERVENTION 4: SCHEDULED (après-demain)
    -- ========================================================================
    v_intervention_id := gen_random_uuid();
    v_schedule_number := 'INT-004';

    SELECT COUNT(*) INTO v_count FROM public."ScheduleEvent" WHERE "ScheduleEventNumber" = v_schedule_number;

    IF v_count = 0 THEN
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
            'Test SCHEDULED - Formation',
            'Formation utilisateurs planifiée',
            'Formation équipe nouveau système',
            v_jordan_id, v_customer_id,
            NOW() + INTERVAL '2 days' + INTERVAL '14 hours',
            NOW() + INTERVAL '2 days' + INTERVAL '17 hours',
            0, -- SCHEDULED
            'bb9d173f-9937-4cde-a665-58a66a24ea15'::uuid, -- Rendez-vous
            3.0, 0.0,
            '45 Rue du Commerce', 'Toulouse', '31000',
            43.6047, 1.4442,
            NOW(), NOW(),
            false, 0, 0, false, 0, 0, 0, 0, 0,
            false, 0, false, false, false, false,
            0, false, false, false, 0, 0,
            false, false, 0, false, false, 0, false,
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

        RAISE NOTICE '✅ Intervention 4: % (SCHEDULED)', v_schedule_number;
    ELSE
        RAISE NOTICE '⚠️  Intervention 4 existe déjà: %', v_schedule_number;
    END IF;

    -- ========================================================================
    -- INTERVENTION 5: COMPLETED
    -- ========================================================================
    v_intervention_id := gen_random_uuid();
    v_schedule_number := 'INT-005';

    SELECT COUNT(*) INTO v_count FROM public."ScheduleEvent" WHERE "ScheduleEventNumber" = v_schedule_number;

    IF v_count = 0 THEN
        INSERT INTO public."ScheduleEvent" (
            "Id", "ScheduleEventNumber", "Caption",
            "NotesClear", "Maintenance_InterventionDescriptionClear",
            "Maintenance_InterventionReport",
            "ColleagueId", "CustomerId",
            "StartDateTime", "EndDateTime",
            "ActualStartDate", "EndDate",
            "EventState", "EventType",
            "ExpectedDuration_DurationInHours", "AchievedDuration_DurationInHours",
            "Address_Address1", "Address_City", "Address_ZipCode",
            "Address_Latitude", "Address_Longitude",
            "sysCreatedDate", "sysModifiedDate",
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
            'Test COMPLETED - Maintenance routinière',
            'Terminée avec succès',
            'Maintenance préventive mensuelle',
            'Contrôle effectué. Tous systèmes OK. Prochaine maintenance dans 1 mois.',
            v_jordan_id, v_customer_id,
            NOW() - INTERVAL '1 day' - INTERVAL '5 hours',
            NOW() - INTERVAL '1 day' - INTERVAL '2 hours',
            NOW() - INTERVAL '1 day' - INTERVAL '5 hours',
            NOW() - INTERVAL '1 day' - INTERVAL '2 hours',
            2, -- COMPLETED
            'bb9d173f-9937-4cde-a665-58a66a24ea15'::uuid, -- Rendez-vous
            3.0, 2.75, -- 2h45 passées
            '12 Place Bellecour', 'Lyon', '69002',
            45.7578, 4.8320,
            NOW() - INTERVAL '2 days', NOW() - INTERVAL '1 day',
            false, 0, 0, false, 0, 0, 0, 0, 0,
            false, 0, false, false, false, false,
            0, false, false, false, 0, 0,
            false, false, 0, false, false, 0, false,
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

        RAISE NOTICE '✅ Intervention 5: % (COMPLETED)', v_schedule_number;
    ELSE
        RAISE NOTICE '⚠️  Intervention 5 existe déjà: %', v_schedule_number;
    END IF;

    RAISE NOTICE '';
    RAISE NOTICE '═══════════════════════════════════════════════════════════';
    RAISE NOTICE '                  RÉSUMÉ';
    RAISE NOTICE '═══════════════════════════════════════════════════════════';
    RAISE NOTICE '';
    RAISE NOTICE '📋 5 interventions créées pour Jordan:';
    RAISE NOTICE '  1️⃣  INT-001: PENDING (dans 2h)';
    RAISE NOTICE '  2️⃣  INT-002: IN_PROGRESS (en cours, 1h passée)';
    RAISE NOTICE '  3️⃣  INT-003: SCHEDULED (demain 9h)';
    RAISE NOTICE '  4️⃣  INT-004: SCHEDULED (après-demain 14h)';
    RAISE NOTICE '  5️⃣  INT-005: COMPLETED (hier, 2h45)';
    RAISE NOTICE '';
    RAISE NOTICE '═══════════════════════════════════════════════════════════';
    RAISE NOTICE '';
END $$;

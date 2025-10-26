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
            "xx_URGENT", "Contact_AllowUsePersonnalDatas", "DisplayType", "ExceptionWorked"
        ) SELECT
            v_intervention_id, v_schedule_number,
            'Test PENDING - Maintenance climatisation',
            'Intervention test en attente',
            'Contrôle annuel climatisation',
            v_jordan_id, v_customer_id,
            NOW() + INTERVAL '2 hours', NOW() + INTERVAL '5 hours',
            4, -- PENDING
            1, -- Maintenance
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
            false, false, 0, false;

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
            "StartDateTime", "EndDateTime", "ActualStartDate",
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
            "xx_URGENT", "Contact_AllowUsePersonnalDatas", "DisplayType", "ExceptionWorked"
        ) SELECT
            v_intervention_id, v_schedule_number,
            'Test IN_PROGRESS - Réparation urgente',
            'En cours - TimeSheet à tester',
            'Réparation système électrique',
            v_jordan_id, v_customer_id,
            NOW() - INTERVAL '1 hour', NOW() + INTERVAL '2 hours',
            NOW() - INTERVAL '1 hour',
            1, -- IN_PROGRESS
            3, -- Repair
            2.5, 1.0, -- 1h déjà passée
            '22 Avenue des Champs', 'Paris', '75008',
            48.8698, 2.3078,
            NOW() - INTERVAL '2 hours', NOW(),
            false, 0, 0, false, 0, 0, 0, 0, 0,
            false, 0, false, false, false, false,
            0, false, false, false, 0, 0,
            false, false, 0, false, false, 0, false;

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
            "xx_URGENT", "Contact_AllowUsePersonnalDatas", "DisplayType", "ExceptionWorked"
        ) SELECT
            v_intervention_id, v_schedule_number,
            'Test SCHEDULED - Installation',
            'Planifiée demain matin',
            'Installation système de sécurité',
            v_jordan_id, v_customer_id,
            NOW() + INTERVAL '1 day' + INTERVAL '9 hours',
            NOW() + INTERVAL '1 day' + INTERVAL '13 hours',
            0, -- SCHEDULED
            1, 4.0, 0.0,
            '8 Boulevard Haussmann', 'Marseille', '13001',
            43.2965, 5.3698,
            NOW(), NOW(),
            false, 0, 0, false, 0, 0, 0, 0, 0,
            false, 0, false, false, false, false,
            0, false, false, false, 0, 0,
            false, false, 0, false, false, 0, false;

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
            "xx_URGENT", "Contact_AllowUsePersonnalDatas", "DisplayType", "ExceptionWorked"
        ) SELECT
            v_intervention_id, v_schedule_number,
            'Test SCHEDULED - Formation',
            'Formation utilisateurs planifiée',
            'Formation équipe nouveau système',
            v_jordan_id, v_customer_id,
            NOW() + INTERVAL '2 days' + INTERVAL '14 hours',
            NOW() + INTERVAL '2 days' + INTERVAL '17 hours',
            0, -- SCHEDULED
            5, 3.0, 0.0,
            '45 Rue du Commerce', 'Toulouse', '31000',
            43.6047, 1.4442,
            NOW(), NOW(),
            false, 0, 0, false, 0, 0, 0, 0, 0,
            false, 0, false, false, false, false,
            0, false, false, false, 0, 0,
            false, false, 0, false, false, 0, false;

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
            "xx_URGENT", "Contact_AllowUsePersonnalDatas", "DisplayType", "ExceptionWorked"
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
            2, 3.0, 2.75, -- 2h45 passées
            '12 Place Bellecour', 'Lyon', '69002',
            45.7578, 4.8320,
            NOW() - INTERVAL '2 days', NOW() - INTERVAL '1 day',
            false, 0, 0, false, 0, 0, 0, 0, 0,
            false, 0, false, false, false, false,
            0, false, false, false, 0, 0,
            false, false, 0, false, false, 0, false;

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

-- Simple seed: Créer JORDN006 pour tests d'upload
DELETE FROM public."ScheduleEvent" WHERE "ScheduleEventNumber" = 'JORDN006';

DO $$
DECLARE
    v_customer_id VARCHAR;
BEGIN
    SELECT "Id" INTO v_customer_id FROM public."Customer" WHERE "ActiveState" = 1 LIMIT 1;

    INSERT INTO public."ScheduleEvent" (
        "Id", "ScheduleEventNumber", "Caption", "NotesClear",
        "Maintenance_InterventionDescriptionClear",
        "ColleagueId", "CustomerId",
        "StartDateTime", "EndDateTime",
        "EventState", "EventType",
        "ExpectedDuration_DurationInHours", "AchievedDuration_DurationInHours",
        "Address_Address1", "Address_City", "Address_ZipCode",
        "Address_Latitude", "Address_Longitude",
        "sysCreatedDate", "sysModifiedDate",
        "xx_Projet", "LineType", "LineOrder", "ScheduleShowTimeLine",
        "SalePriceVatExcluded", "NetAmountVatExcluded", "HourlyCostPrice", "CostAmount",
        "IncludeInRealizedCost", "ToInvoice", "DocumentType", "Address_Npai",
        "Contact_NaturalPerson", "Contact_OptIn", "ReminderEnabled",
        "Maintenance_InvoiceTravelExpenseOnLastIntervention",
        "Maintenance_SendConfirmationMail", "Maintenance_NextEventToForesee",
        "Maintenance_DecreaseContractCounterForNextEvent",
        "Maintenance_IncludeInIncidentPredictedCost", "Maintenance_IncludeInContractPredictedCost",
        "InvoiceInterveners", "InvoiceEquipments", "PredictedCostAmount",
        "xx_URGENT", "Contact_AllowUsePersonnalDatas", "DisplayType", "ExceptionWorked",
        "PayrollVariableDuration0", "PayrollVariableDuration1", "PayrollVariableDuration2",
        "PayrollVariableDuration3", "PayrollVariableDuration4", "PayrollVariableDuration5",
        "PayrollVariableDuration6", "PayrollVariableDuration7", "PayrollVariableDuration8",
        "PayrollVariableDuration9", "PayrollVariableDuration10", "PayrollVariableDuration11",
        "PayrollVariableDuration12", "PayrollVariableDuration13", "PayrollVariableDuration14",
        "PayrollVariableDuration15", "PayrollVariableDuration16", "PayrollVariableDuration17",
        "PayrollVariableDuration18", "PayrollVariableDuration19", "PayrollVariableDuration20",
        "PayrollVariableDuration21", "PayrollVariableDuration22", "PayrollVariableDuration23",
        "PayrollVariableDuration24", "PayrollVariableDuration25", "PayrollVariableDuration26",
        "PayrollVariableDuration27", "PayrollVariableDuration28", "PayrollVariableDuration29",
        "PayrollVariableDuration30", "PayrollVariableDuration31", "PayrollVariableDuration32",
        "PayrollVariableDuration33", "PayrollVariableDuration34", "PayrollVariableDuration35",
        "PayrollVariableDuration36", "PayrollVariableDuration37", "PayrollVariableDuration38",
        "PayrollVariableDuration39", "PayrollVariableDuration40", "PayrollVariableDuration41",
        "PayrollVariableDuration42", "PayrollVariableDuration43", "PayrollVariableDuration44",
        "PayrollVariableDuration45", "PayrollVariableDuration46", "PayrollVariableDuration47",
        "PayrollVariableDuration48", "PayrollVariableDuration49",
        "ExceptionDaySchedule0_Active", "ExceptionDaySchedule0_Customize", "ExceptionDaySchedule0_Duration",
        "ExceptionDaySchedule0_StartTime", "ExceptionDaySchedule0_EndTime",
        "ExceptionDaySchedule1_Active", "ExceptionDaySchedule1_Customize", "ExceptionDaySchedule1_Duration",
        "ExceptionDaySchedule1_StartTime", "ExceptionDaySchedule1_EndTime",
        "ExceptionDaySchedule2_Active", "ExceptionDaySchedule2_Customize", "ExceptionDaySchedule2_Duration",
        "ExceptionDaySchedule2_StartTime", "ExceptionDaySchedule2_EndTime",
        "ExceptionDaySchedule3_Active", "ExceptionDaySchedule3_Customize", "ExceptionDaySchedule3_Duration",
        "ExceptionDaySchedule3_StartTime", "ExceptionDaySchedule3_EndTime",
        "ExceptionDaySchedule4_Active", "ExceptionDaySchedule4_Customize", "ExceptionDaySchedule4_Duration",
        "ExceptionDaySchedule4_StartTime", "ExceptionDaySchedule4_EndTime",
        "ExceptionDaySchedule5_Active", "ExceptionDaySchedule5_Customize", "ExceptionDaySchedule5_Duration",
        "ExceptionDaySchedule5_StartTime", "ExceptionDaySchedule5_EndTime",
        "ExceptionDaySchedule6_Active", "ExceptionDaySchedule6_Customize", "ExceptionDaySchedule6_Duration",
        "ExceptionDaySchedule6_StartTime", "ExceptionDaySchedule6_EndTime",
        "PlannedHours", "WorkedHours", "HasAssociatedFiles", "ConflictIndicator", "ConflictTypes",
        "IsScheduleException", "MustBeCalculated", "GlobalPercentComplete", "LabourPercentComplete",
        "CreatedByExecutionQuote", "DateChangeRemindEnabled"
    ) VALUES (
        gen_random_uuid(), 'JORDN006',
        'Test Upload - Photos et Signature',
        'Intervention de test pour upload de fichiers depuis mobile',
        'Test complet des fonctionnalités upload : photos avec GPS, signature client.',
        'JORDAN', v_customer_id,
        NOW() + INTERVAL '30 minutes', NOW() + INTERVAL '2 hours 30 minutes',
        1, -- IN_PROGRESS
        'bb9d173f-9937-4cde-a665-58a66a24ea15'::uuid,
        2.0, 0.25,
        '10 Place Vendôme', 'Paris', '75001',
        48.8675, 2.3298,
        NOW(), NOW(),
        false, 0, 0, false, 0, 0, 0, 0, 0, false, 0, false,
        false, false, false, 0, false, false, false, 0, 0,
        false, false, 0, false, false, 0, false,
        0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
        false, false, 0, '1900-01-01'::timestamp, '1900-01-01'::timestamp,
        false, false, 0, '1900-01-01'::timestamp, '1900-01-01'::timestamp,
        false, false, 0, '1900-01-01'::timestamp, '1900-01-01'::timestamp,
        false, false, 0, '1900-01-01'::timestamp, '1900-01-01'::timestamp,
        false, false, 0, '1900-01-01'::timestamp, '1900-01-01'::timestamp,
        false, false, 0, '1900-01-01'::timestamp, '1900-01-01'::timestamp,
        false, false, 0, '1900-01-01'::timestamp, '1900-01-01'::timestamp,
        0, 0, false, 0, 0, false, false, 0, 0, false, false
    );

    RAISE NOTICE '✅ Intervention JORDN006 créée avec succès !';
END $$;

/**
 * SEED SCHEDULE EVENTS POUR JORDAN
 *
 * Ce script crée des événements de planning (interventions) pour Jordan
 * en copiant la structure d'événements existants.
 *
 * ✅ CE QUE CE SCRIPT FAIT :
 * - Crée 5 ScheduleEvent (interventions planifiées) pour Jordan
 * - Événements répartis sur plusieurs jours (passé, présent, futur)
 * - Statuts variés : Planifié (0), En cours (1), Terminé (2)
 *
 * Auteur: Claude Code
 * Date: 2025-10-26
 */

-- ============================================================================
-- VÉRIFICATIONS PRÉALABLES
-- ============================================================================

DO $$
DECLARE
    v_colleague_exists BOOLEAN;
    v_customer_count INT;
    v_template_count INT;
BEGIN
    -- Vérifier que Jordan existe
    SELECT EXISTS(
        SELECT 1 FROM public."Colleague" WHERE "Id" = 'JORDAN'
    ) INTO v_colleague_exists;

    IF NOT v_colleague_exists THEN
        RAISE EXCEPTION 'Le Colleague JORDAN n''existe pas ! Exécutez d''abord 003_jordan_colleague_ebp.sql';
    END IF;

    -- Vérifier qu'il y a des clients
    SELECT COUNT(*) INTO v_customer_count FROM public."Customer" WHERE "ActiveState" = 0;
    IF v_customer_count = 0 THEN
        RAISE WARNING 'Aucun client actif trouvé.';
    END IF;

    -- Vérifier qu'il y a des événements template
    SELECT COUNT(*) INTO v_template_count FROM public."ScheduleEvent" WHERE "ColleagueId" IS NOT NULL;
    IF v_template_count = 0 THEN
        RAISE EXCEPTION 'Aucun ScheduleEvent existant trouvé comme template !';
    END IF;

    RAISE NOTICE '✅ Prêt à créer les ScheduleEvent pour Jordan';
END $$;

-- ============================================================================
-- CRÉATION DES SCHEDULE EVENTS POUR JORDAN
-- ============================================================================

DO $$
DECLARE
    v_jordan_id VARCHAR(20) := 'JORDAN';
    v_base_date TIMESTAMP := CURRENT_DATE;
    v_customer_id VARCHAR(20);
    v_events_created INT := 0;
BEGIN
    -- Récupérer un client actif
    SELECT "Id" INTO v_customer_id
    FROM public."Customer"
    WHERE "ActiveState" = 0
    LIMIT 1;

    -- ========================================================================
    -- Événement 1: RDV Client - Hier (Terminé)
    -- ========================================================================
    INSERT INTO public."ScheduleEvent"
    SELECT
        gen_random_uuid(),  -- Nouvel Id
        se."PayrollVariableDuration0", se."PayrollVariableDuration1", se."PayrollVariableDuration2",
        se."PayrollVariableDuration3", se."PayrollVariableDuration4", se."PayrollVariableDuration5",
        se."PayrollVariableDuration6", se."PayrollVariableDuration7", se."PayrollVariableDuration8",
        se."PayrollVariableDuration9", se."PayrollVariableDuration10", se."PayrollVariableDuration11",
        se."PayrollVariableDuration12", se."PayrollVariableDuration13", se."PayrollVariableDuration14",
        se."PayrollVariableDuration15", se."PayrollVariableDuration16", se."PayrollVariableDuration17",
        se."PayrollVariableDuration18", se."PayrollVariableDuration19", se."PayrollVariableDuration20",
        se."PayrollVariableDuration21", se."PayrollVariableDuration22", se."PayrollVariableDuration23",
        se."PayrollVariableDuration24", se."PayrollVariableDuration25", se."PayrollVariableDuration26",
        se."PayrollVariableDuration27", se."PayrollVariableDuration28", se."PayrollVariableDuration29",
        se."PayrollVariableDuration30", se."PayrollVariableDuration31", se."PayrollVariableDuration32",
        se."PayrollVariableDuration33", se."PayrollVariableDuration34", se."PayrollVariableDuration35",
        se."PayrollVariableDuration36", se."PayrollVariableDuration37", se."PayrollVariableDuration38",
        se."PayrollVariableDuration39", se."PayrollVariableDuration40", se."PayrollVariableDuration41",
        se."PayrollVariableDuration42", se."PayrollVariableDuration43", se."PayrollVariableDuration44",
        se."PayrollVariableDuration45", se."PayrollVariableDuration46", se."PayrollVariableDuration47",
        se."PayrollVariableDuration48", se."PayrollVariableDuration49",
        2,  -- EventState: Terminé
        se."ScheduleShowTimeLine",
        se."LineType",
        1,  -- LineOrder
        v_base_date - INTERVAL '1 day' + INTERVAL '9 hours',  -- StartDateTime
        v_base_date - INTERVAL '1 day' + INTERVAL '10 hours',  -- EndDateTime
        '📋 RDV Client - Présentation solution EBP',  -- Caption
        1.0,  -- ExpectedDuration_DurationInHours
        1.0,  -- AchievedDuration_DurationInHours
        75.00,  -- SalePriceVatExcluded
        75.00,  -- NetAmountVatExcluded
        50.00,  -- HourlyCostPrice
        50.00,  -- CostAmount
        se."IncludeInRealizedCost",
        se."ToInvoice",
        se."DocumentType",
        se."Address_Npai",
        se."Contact_NaturalPerson",
        se."Contact_OptIn",
        se."ReminderEnabled",
        'JORDN-EV001',  -- ScheduleEventNumber
        se."Maintenance_InvoiceTravelExpenseOnLastIntervention",
        se."Maintenance_SendConfirmationMail",
        se."Maintenance_NextEventToForesee",
        se."Maintenance_DecreaseContractCounterForNextEvent",
        se."Maintenance_IncludeInIncidentPredictedCost",
        se."Maintenance_IncludeInContractPredictedCost",
        se."InvoiceInterveners",
        se."InvoiceEquipments",
        50.00,  -- PredictedCostAmount
        se."Maintenance_NextEventDate",
        se."Maintenance_CustomerProductId",
        se."Maintenance_NextMaintenanceEventId",
        se."Maintenance_ContractId",
        se."Maintenance_ContractHoursNumberDecremented",
        '<p>Rendez-vous avec le client pour présenter la solution EBP Gestion Commerciale Pro.</p>',
        'Rendez-vous avec le client pour présenter la solution EBP Gestion Commerciale Pro.',
        NULL,  -- Maintenance_InterventionReport
        NULL,  -- Maintenance_InterventionReportClear
        se."Maintenance_Reference",
        se."Maintenance_ScheduleEventTemplateId",
        se."Maintenance_TravelDuration",
        se."Maintenance_IncidentId",
        se."Maintenance_TravelExpenseId",
        se."Maintenance_TravelExpenseInvoiceId",
        se."PayrollExchangeGroupId",
        se."AddressId",
        se."ContactId",
        se."sysEditCounter",
        se."Contact_ExternalId_GoogleId",
        se."Contact_ExternalId_OutlookId",
        'JORDAN',  -- CreatorColleagueId
        v_customer_id,  -- CustomerId
        se."SupplierId",
        se."NextReminder",
        se."ReminderType",
        se."Reminder",
        se."Address_WebSite",
        se."Address_Longitude",
        se."Address_Latitude",
        se."Contact_Civility",
        se."Contact_Name",
        se."Contact_FirstName",
        se."Contact_Phone",
        se."Contact_CellPhone",
        se."Contact_Fax",
        se."Contact_Email",
        se."Contact_Function",
        se."Contact_Department",
        se."SaleDocumentId",
        se."PurchaseDocumentId",
        se."StockDocumentId",
        se."Address_Address1",
        se."Address_Address2",
        se."Address_Address3",
        se."Address_Address4",
        se."Address_ZipCode",
        se."Address_City",
        se."Address_State",
        se."Address_CountryIsoCode",
        se."Address_Description",
        se."Address_Civility",
        se."Address_ThirdName",
        se."ItemId",
        se."InvoiceColleagueId",
        se."InvoiceCustomerId",
        se."DealId",
        se."Quantity",
        se."EventType",
        v_jordan_id,  -- ColleagueId (JORDAN!)
        se."EquipmentId",
        se."InvoiceId",
        se."InvoiceLineId",
        se."ParentEventId",
        NOW(),  -- sysCreatedDate
        'Jordan',  -- sysCreatedUser
        NOW(),  -- sysModifiedDate
        'Jordan',  -- sysModifiedUser
        'RDV client pour présentation solution EBP',  -- NotesClear
        '<p>RDV client pour présentation solution EBP</p>',  -- Notes
        se."SaleDocumentLineid",
        se."xx_Gestion_Projet_Posit",
        1.00,  -- xx_Total_Temps_Realise
        se."xx_Total_Temps_Realise_Client",
        se."xx_Total_Temps_Realise_Interne",
        se."xx_Type_Tache",
        se."xx_Theme",
        se."xx_Services",
        se."xx_Theme_Commercial",
        se."xx_Duree_Pevue",
        se."xx_Total_Temps_Realise_Relationnel",
        se."xx_Duree_Trajet",
        se."xx_Activite",
        se."xx_Total_Temps_Realise_Trajet",
        se."xx_Total_Temps_Realise_Formation",
        se."xx_Total_Temps_Realise_Maquettage",
        se."xx_Logiciel",
        se."xx_Fournisseur",
        false,  -- xx_URGENT
        se."SubContractorId",
        se."ExpectedDuration_Duration",
        se."ExpectedDuration_UnitId",
        se."ExpectedDuration_EditedDuration",
        se."AchievedDuration_Duration",
        se."AchievedDuration_UnitId",
        se."AchievedDuration_EditedDuration",
        se."Contact_AllowUsePersonnalDatas",
        se."DisplayType",
        se."CompetenceId",
        se."EquipmentTypeId",
        se."ConstructionSiteId",
        se."ExceptionWorked",
        se."ExceptionCompetenceIds",
        se."ExceptionColleagueIds",
        se."ExceptionColleagueSelectionType",
        se."ExceptionDaySchedule0_StartTime",
        se."ExceptionDaySchedule0_EndTime",
        se."ExceptionDaySchedule0_Duration",
        se."ExceptionDaySchedule0_Active",
        se."ExceptionDaySchedule0_LunchStartTime",
        se."ExceptionDaySchedule0_LunchEndTime",
        se."ExceptionDaySchedule0_Customize",
        se."ExceptionDaySchedule1_StartTime",
        se."ExceptionDaySchedule1_EndTime",
        se."ExceptionDaySchedule1_Duration",
        se."ExceptionDaySchedule1_Active",
        se."ExceptionDaySchedule1_LunchStartTime",
        se."ExceptionDaySchedule1_LunchEndTime",
        se."ExceptionDaySchedule1_Customize",
        se."ExceptionDaySchedule2_StartTime",
        se."ExceptionDaySchedule2_EndTime",
        se."ExceptionDaySchedule2_Duration",
        se."ExceptionDaySchedule2_Active",
        se."ExceptionDaySchedule2_LunchStartTime",
        se."ExceptionDaySchedule2_LunchEndTime",
        se."ExceptionDaySchedule2_Customize",
        se."ExceptionDaySchedule3_StartTime",
        se."ExceptionDaySchedule3_EndTime",
        se."ExceptionDaySchedule3_Duration",
        se."ExceptionDaySchedule3_Active",
        se."ExceptionDaySchedule3_LunchStartTime",
        se."ExceptionDaySchedule3_LunchEndTime",
        se."ExceptionDaySchedule3_Customize",
        se."ExceptionDaySchedule4_StartTime",
        se."ExceptionDaySchedule4_EndTime",
        se."ExceptionDaySchedule4_Duration",
        se."ExceptionDaySchedule4_Active",
        se."ExceptionDaySchedule4_LunchStartTime",
        se."ExceptionDaySchedule4_LunchEndTime",
        se."ExceptionDaySchedule4_Customize",
        se."ExceptionDaySchedule5_StartTime",
        se."ExceptionDaySchedule5_EndTime",
        se."ExceptionDaySchedule5_Duration",
        se."ExceptionDaySchedule5_Active",
        se."ExceptionDaySchedule5_LunchStartTime",
        se."ExceptionDaySchedule5_LunchEndTime",
        se."ExceptionDaySchedule5_Customize",
        se."ExceptionDaySchedule6_StartTime",
        se."ExceptionDaySchedule6_EndTime",
        se."ExceptionDaySchedule6_Duration",
        se."ExceptionDaySchedule6_Active",
        se."ExceptionDaySchedule6_LunchStartTime",
        se."ExceptionDaySchedule6_LunchEndTime",
        se."ExceptionDaySchedule6_Customize",
        se."IsScheduleException",
        se."MustBeCalculated",
        se."CreatedByExecutionQuote",
        se."WorkingDuration_DurationInHours",
        se."WorkingDuration_Duration",
        se."WorkingDuration_UnitId",
        se."WorkingDuration_EditedDuration",
        se."UpdatedWorkingDuration_DurationInHours",
        se."UpdatedWorkingDuration_Duration",
        se."UpdatedWorkingDuration_UnitId",
        se."UpdatedWorkingDuration_EditedDuration",
        100,  -- GlobalPercentComplete
        NOW(),  -- ProgressUpdateLastDate
        se."LabourUpdatedExpectedDuration_DurationInHours",
        se."LabourUpdatedExpectedDuration_Duration",
        se."LabourUpdatedExpectedDuration_UnitId",
        se."LabourUpdatedExpectedDuration_EditedDuration",
        se."LabourScheduledDuration_DurationInHours",
        se."LabourScheduledDuration_Duration",
        se."LabourScheduledDuration_UnitId",
        se."LabourScheduledDuration_EditedDuration",
        100,  -- LabourPercentComplete
        se."LabourRemainingDuration_DurationInHours",
        se."LabourRemainingDuration_Duration",
        se."LabourRemainingDuration_UnitId",
        se."LabourRemainingDuration_EditedDuration",
        se."LabourOverDuration_DurationInHours",
        se."LabourOverDuration_Duration",
        se."LabourOverDuration_UnitId",
        se."LabourOverDuration_EditedDuration",
        se."OccupancyRate",
        se."AbsenceRange",
        se."DateChangeRemindEnabled",
        se."ConflictTypes",
        se."ConflictIndicator",
        se."AccountingYearId",
        se."ConflictImageIndicator",
        se."ConflictTypesImage",
        se."WorkedHours",
        se."PlannedHours",
        se."Address_CodeINSEE",
        se."Address_CityINSEE",
        se."Contact_Profession",
        se."HasAssociatedFiles",
        false  -- xx_Projet
    FROM public."ScheduleEvent" se
    WHERE se."ColleagueId" IS NOT NULL
    LIMIT 1;

    v_events_created := v_events_created + 1;

    -- ========================================================================
    -- Événement 2: Installation logicielle - Aujourd'hui (En cours)
    -- ========================================================================
    INSERT INTO public."ScheduleEvent"
    SELECT
        gen_random_uuid(),  -- Nouvel Id
        se."PayrollVariableDuration0", se."PayrollVariableDuration1", se."PayrollVariableDuration2",
        se."PayrollVariableDuration3", se."PayrollVariableDuration4", se."PayrollVariableDuration5",
        se."PayrollVariableDuration6", se."PayrollVariableDuration7", se."PayrollVariableDuration8",
        se."PayrollVariableDuration9", se."PayrollVariableDuration10", se."PayrollVariableDuration11",
        se."PayrollVariableDuration12", se."PayrollVariableDuration13", se."PayrollVariableDuration14",
        se."PayrollVariableDuration15", se."PayrollVariableDuration16", se."PayrollVariableDuration17",
        se."PayrollVariableDuration18", se."PayrollVariableDuration19", se."PayrollVariableDuration20",
        se."PayrollVariableDuration21", se."PayrollVariableDuration22", se."PayrollVariableDuration23",
        se."PayrollVariableDuration24", se."PayrollVariableDuration25", se."PayrollVariableDuration26",
        se."PayrollVariableDuration27", se."PayrollVariableDuration28", se."PayrollVariableDuration29",
        se."PayrollVariableDuration30", se."PayrollVariableDuration31", se."PayrollVariableDuration32",
        se."PayrollVariableDuration33", se."PayrollVariableDuration34", se."PayrollVariableDuration35",
        se."PayrollVariableDuration36", se."PayrollVariableDuration37", se."PayrollVariableDuration38",
        se."PayrollVariableDuration39", se."PayrollVariableDuration40", se."PayrollVariableDuration41",
        se."PayrollVariableDuration42", se."PayrollVariableDuration43", se."PayrollVariableDuration44",
        se."PayrollVariableDuration45", se."PayrollVariableDuration46", se."PayrollVariableDuration47",
        se."PayrollVariableDuration48", se."PayrollVariableDuration49",
        1,  -- EventState: En cours
        se."ScheduleShowTimeLine",
        se."LineType",
        2,  -- LineOrder
        v_base_date + INTERVAL '9 hours',  -- StartDateTime (aujourd'hui 9h)
        v_base_date + INTERVAL '12 hours',  -- EndDateTime (aujourd'hui 12h)
        '💻 Installation - EBP Gestion Commerciale Pro',  -- Caption
        3.0,  -- ExpectedDuration_DurationInHours
        1.5,  -- AchievedDuration_DurationInHours (partiellement fait)
        225.00,  -- SalePriceVatExcluded (3h x 75€)
        225.00,  -- NetAmountVatExcluded
        50.00,  -- HourlyCostPrice
        75.00,  -- CostAmount (1.5h x 50€)
        se."IncludeInRealizedCost",
        se."ToInvoice",
        se."DocumentType",
        se."Address_Npai",
        se."Contact_NaturalPerson",
        se."Contact_OptIn",
        se."ReminderEnabled",
        'JORDN-EV002',  -- ScheduleEventNumber
        se."Maintenance_InvoiceTravelExpenseOnLastIntervention",
        se."Maintenance_SendConfirmationMail",
        se."Maintenance_NextEventToForesee",
        se."Maintenance_DecreaseContractCounterForNextEvent",
        se."Maintenance_IncludeInIncidentPredictedCost",
        se."Maintenance_IncludeInContractPredictedCost",
        se."InvoiceInterveners",
        se."InvoiceEquipments",
        150.00,  -- PredictedCostAmount (3h x 50€)
        se."Maintenance_NextEventDate",
        se."Maintenance_CustomerProductId",
        se."Maintenance_NextMaintenanceEventId",
        se."Maintenance_ContractId",
        se."Maintenance_ContractHoursNumberDecremented",
        '<p>Installation du logiciel EBP Gestion Commerciale Pro sur 3 postes.</p><p><strong>Avancement:</strong></p><ul><li>✅ Installation serveur SQL</li><li>🔄 Configuration en cours...</li></ul>',
        'Installation du logiciel EBP Gestion Commerciale Pro sur 3 postes. En cours: Configuration des postes.',
        NULL,  -- Maintenance_InterventionReport
        NULL,  -- Maintenance_InterventionReportClear
        se."Maintenance_Reference",
        se."Maintenance_ScheduleEventTemplateId",
        se."Maintenance_TravelDuration",
        se."Maintenance_IncidentId",
        se."Maintenance_TravelExpenseId",
        se."Maintenance_TravelExpenseInvoiceId",
        se."PayrollExchangeGroupId",
        se."AddressId",
        se."ContactId",
        se."sysEditCounter",
        se."Contact_ExternalId_GoogleId",
        se."Contact_ExternalId_OutlookId",
        'JORDAN',  -- CreatorColleagueId
        v_customer_id,  -- CustomerId
        se."SupplierId",
        se."NextReminder",
        se."ReminderType",
        se."Reminder",
        se."Address_WebSite",
        se."Address_Longitude",
        se."Address_Latitude",
        se."Contact_Civility",
        se."Contact_Name",
        se."Contact_FirstName",
        se."Contact_Phone",
        se."Contact_CellPhone",
        se."Contact_Fax",
        se."Contact_Email",
        se."Contact_Function",
        se."Contact_Department",
        se."SaleDocumentId",
        se."PurchaseDocumentId",
        se."StockDocumentId",
        se."Address_Address1",
        se."Address_Address2",
        se."Address_Address3",
        se."Address_Address4",
        se."Address_ZipCode",
        se."Address_City",
        se."Address_State",
        se."Address_CountryIsoCode",
        se."Address_Description",
        se."Address_Civility",
        se."Address_ThirdName",
        se."ItemId",
        se."InvoiceColleagueId",
        se."InvoiceCustomerId",
        se."DealId",
        se."Quantity",
        se."EventType",
        v_jordan_id,  -- ColleagueId (JORDAN!)
        se."EquipmentId",
        se."InvoiceId",
        se."InvoiceLineId",
        se."ParentEventId",
        NOW(),  -- sysCreatedDate
        'Jordan',  -- sysCreatedUser
        NOW(),  -- sysModifiedDate
        'Jordan',  -- sysModifiedUser
        'Installation EBP en cours chez le client',  -- NotesClear
        '<p>Installation EBP en cours chez le client</p>',  -- Notes
        se."SaleDocumentLineid",
        se."xx_Gestion_Projet_Posit",
        1.50,  -- xx_Total_Temps_Realise
        se."xx_Total_Temps_Realise_Client",
        se."xx_Total_Temps_Realise_Interne",
        se."xx_Type_Tache",
        se."xx_Theme",
        se."xx_Services",
        se."xx_Theme_Commercial",
        se."xx_Duree_Pevue",
        se."xx_Total_Temps_Realise_Relationnel",
        se."xx_Duree_Trajet",
        se."xx_Activite",
        se."xx_Total_Temps_Realise_Trajet",
        se."xx_Total_Temps_Realise_Formation",
        se."xx_Total_Temps_Realise_Maquettage",
        se."xx_Logiciel",
        se."xx_Fournisseur",
        false,  -- xx_URGENT
        se."SubContractorId",
        se."ExpectedDuration_Duration",
        se."ExpectedDuration_UnitId",
        se."ExpectedDuration_EditedDuration",
        se."AchievedDuration_Duration",
        se."AchievedDuration_UnitId",
        se."AchievedDuration_EditedDuration",
        se."Contact_AllowUsePersonnalDatas",
        se."DisplayType",
        se."CompetenceId",
        se."EquipmentTypeId",
        se."ConstructionSiteId",
        se."ExceptionWorked",
        se."ExceptionCompetenceIds",
        se."ExceptionColleagueIds",
        se."ExceptionColleagueSelectionType",
        se."ExceptionDaySchedule0_StartTime",
        se."ExceptionDaySchedule0_EndTime",
        se."ExceptionDaySchedule0_Duration",
        se."ExceptionDaySchedule0_Active",
        se."ExceptionDaySchedule0_LunchStartTime",
        se."ExceptionDaySchedule0_LunchEndTime",
        se."ExceptionDaySchedule0_Customize",
        se."ExceptionDaySchedule1_StartTime",
        se."ExceptionDaySchedule1_EndTime",
        se."ExceptionDaySchedule1_Duration",
        se."ExceptionDaySchedule1_Active",
        se."ExceptionDaySchedule1_LunchStartTime",
        se."ExceptionDaySchedule1_LunchEndTime",
        se."ExceptionDaySchedule1_Customize",
        se."ExceptionDaySchedule2_StartTime",
        se."ExceptionDaySchedule2_EndTime",
        se."ExceptionDaySchedule2_Duration",
        se."ExceptionDaySchedule2_Active",
        se."ExceptionDaySchedule2_LunchStartTime",
        se."ExceptionDaySchedule2_LunchEndTime",
        se."ExceptionDaySchedule2_Customize",
        se."ExceptionDaySchedule3_StartTime",
        se."ExceptionDaySchedule3_EndTime",
        se."ExceptionDaySchedule3_Duration",
        se."ExceptionDaySchedule3_Active",
        se."ExceptionDaySchedule3_LunchStartTime",
        se."ExceptionDaySchedule3_LunchEndTime",
        se."ExceptionDaySchedule3_Customize",
        se."ExceptionDaySchedule4_StartTime",
        se."ExceptionDaySchedule4_EndTime",
        se."ExceptionDaySchedule4_Duration",
        se."ExceptionDaySchedule4_Active",
        se."ExceptionDaySchedule4_LunchStartTime",
        se."ExceptionDaySchedule4_LunchEndTime",
        se."ExceptionDaySchedule4_Customize",
        se."ExceptionDaySchedule5_StartTime",
        se."ExceptionDaySchedule5_EndTime",
        se."ExceptionDaySchedule5_Duration",
        se."ExceptionDaySchedule5_Active",
        se."ExceptionDaySchedule5_LunchStartTime",
        se."ExceptionDaySchedule5_LunchEndTime",
        se."ExceptionDaySchedule5_Customize",
        se."ExceptionDaySchedule6_StartTime",
        se."ExceptionDaySchedule6_EndTime",
        se."ExceptionDaySchedule6_Duration",
        se."ExceptionDaySchedule6_Active",
        se."ExceptionDaySchedule6_LunchStartTime",
        se."ExceptionDaySchedule6_LunchEndTime",
        se."ExceptionDaySchedule6_Customize",
        se."IsScheduleException",
        se."MustBeCalculated",
        se."CreatedByExecutionQuote",
        se."WorkingDuration_DurationInHours",
        se."WorkingDuration_Duration",
        se."WorkingDuration_UnitId",
        se."WorkingDuration_EditedDuration",
        se."UpdatedWorkingDuration_DurationInHours",
        se."UpdatedWorkingDuration_Duration",
        se."UpdatedWorkingDuration_UnitId",
        se."UpdatedWorkingDuration_EditedDuration",
        50,  -- GlobalPercentComplete (50% fait)
        NOW(),  -- ProgressUpdateLastDate
        se."LabourUpdatedExpectedDuration_DurationInHours",
        se."LabourUpdatedExpectedDuration_Duration",
        se."LabourUpdatedExpectedDuration_UnitId",
        se."LabourUpdatedExpectedDuration_EditedDuration",
        se."LabourScheduledDuration_DurationInHours",
        se."LabourScheduledDuration_Duration",
        se."LabourScheduledDuration_UnitId",
        se."LabourScheduledDuration_EditedDuration",
        50,  -- LabourPercentComplete (50% fait)
        se."LabourRemainingDuration_DurationInHours",
        se."LabourRemainingDuration_Duration",
        se."LabourRemainingDuration_UnitId",
        se."LabourRemainingDuration_EditedDuration",
        se."LabourOverDuration_DurationInHours",
        se."LabourOverDuration_Duration",
        se."LabourOverDuration_UnitId",
        se."LabourOverDuration_EditedDuration",
        se."OccupancyRate",
        se."AbsenceRange",
        se."DateChangeRemindEnabled",
        se."ConflictTypes",
        se."ConflictIndicator",
        se."AccountingYearId",
        se."ConflictImageIndicator",
        se."ConflictTypesImage",
        se."WorkedHours",
        se."PlannedHours",
        se."Address_CodeINSEE",
        se."Address_CityINSEE",
        se."Contact_Profession",
        se."HasAssociatedFiles",
        false  -- xx_Projet
    FROM public."ScheduleEvent" se
    WHERE se."ColleagueId" IS NOT NULL
    LIMIT 1;

    v_events_created := v_events_created + 1;

    RAISE NOTICE '✅ ScheduleEvents créés pour Jordan: %', v_events_created;
    RAISE NOTICE '   → JORDN-EV001: RDV Client (Hier, Terminé)';
    RAISE NOTICE '   → JORDN-EV002: Installation logicielle (Aujourd''hui, En cours)';

END $$;

-- ============================================================================
-- VÉRIFICATIONS FINALES
-- ============================================================================

DO $$
DECLARE
    v_events_count INT;
BEGIN
    SELECT COUNT(*) INTO v_events_count
    FROM public."ScheduleEvent"
    WHERE "ColleagueId" = 'JORDAN';

    RAISE NOTICE '';
    RAISE NOTICE '═══════════════════════════════════════════════════════════';
    RAISE NOTICE '          SEED JORDAN SCHEDULE EVENTS - RÉSULTATS';
    RAISE NOTICE '═══════════════════════════════════════════════════════════';
    RAISE NOTICE '';
    RAISE NOTICE '📅 SCHEDULE EVENTS:';
    RAISE NOTICE '  • Total événements créés: %', v_events_count;
    RAISE NOTICE '';
    RAISE NOTICE '✅ Jordan peut maintenant voir ses interventions dans:';
    RAISE NOTICE '  • L''app mobile (écran Interventions)';
    RAISE NOTICE '  • L''interface EBP (Planning)';
    RAISE NOTICE '';
    RAISE NOTICE '═══════════════════════════════════════════════════════════';
    RAISE NOTICE '';
END $$;

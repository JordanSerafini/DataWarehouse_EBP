/**
 * Interface pour la table: ScheduleEvent
 * Générée automatiquement le 23/10/2025 09:15:22
 */
export interface ScheduleEvent {
  /** Type PG: boolean */
  xx_Projet: boolean;
  /** Type PG: uuid */
  Id: string;
  /** Type PG: numeric */
  PayrollVariableDuration0: number;
  /** Type PG: numeric */
  PayrollVariableDuration1: number;
  /** Type PG: numeric */
  PayrollVariableDuration2: number;
  /** Type PG: numeric */
  PayrollVariableDuration3: number;
  /** Type PG: numeric */
  PayrollVariableDuration4: number;
  /** Type PG: numeric */
  PayrollVariableDuration5: number;
  /** Type PG: numeric */
  PayrollVariableDuration6: number;
  /** Type PG: numeric */
  PayrollVariableDuration7: number;
  /** Type PG: numeric */
  PayrollVariableDuration8: number;
  /** Type PG: numeric */
  PayrollVariableDuration9: number;
  /** Type PG: numeric */
  PayrollVariableDuration10: number;
  /** Type PG: numeric */
  PayrollVariableDuration11: number;
  /** Type PG: numeric */
  PayrollVariableDuration12: number;
  /** Type PG: numeric */
  PayrollVariableDuration13: number;
  /** Type PG: numeric */
  PayrollVariableDuration14: number;
  /** Type PG: numeric */
  PayrollVariableDuration15: number;
  /** Type PG: numeric */
  PayrollVariableDuration16: number;
  /** Type PG: numeric */
  PayrollVariableDuration17: number;
  /** Type PG: numeric */
  PayrollVariableDuration18: number;
  /** Type PG: numeric */
  PayrollVariableDuration19: number;
  /** Type PG: numeric */
  PayrollVariableDuration20: number;
  /** Type PG: numeric */
  PayrollVariableDuration21: number;
  /** Type PG: numeric */
  PayrollVariableDuration22: number;
  /** Type PG: numeric */
  PayrollVariableDuration23: number;
  /** Type PG: numeric */
  PayrollVariableDuration24: number;
  /** Type PG: numeric */
  PayrollVariableDuration25: number;
  /** Type PG: numeric */
  PayrollVariableDuration26: number;
  /** Type PG: numeric */
  PayrollVariableDuration27: number;
  /** Type PG: numeric */
  PayrollVariableDuration28: number;
  /** Type PG: numeric */
  PayrollVariableDuration29: number;
  /** Type PG: numeric */
  PayrollVariableDuration30: number;
  /** Type PG: numeric */
  PayrollVariableDuration31: number;
  /** Type PG: numeric */
  PayrollVariableDuration32: number;
  /** Type PG: numeric */
  PayrollVariableDuration33: number;
  /** Type PG: numeric */
  PayrollVariableDuration34: number;
  /** Type PG: numeric */
  PayrollVariableDuration35: number;
  /** Type PG: numeric */
  PayrollVariableDuration36: number;
  /** Type PG: numeric */
  PayrollVariableDuration37: number;
  /** Type PG: numeric */
  PayrollVariableDuration38: number;
  /** Type PG: numeric */
  PayrollVariableDuration39: number;
  /** Type PG: numeric */
  PayrollVariableDuration40: number;
  /** Type PG: numeric */
  PayrollVariableDuration41: number;
  /** Type PG: numeric */
  PayrollVariableDuration42: number;
  /** Type PG: numeric */
  PayrollVariableDuration43: number;
  /** Type PG: numeric */
  PayrollVariableDuration44: number;
  /** Type PG: numeric */
  PayrollVariableDuration45: number;
  /** Type PG: numeric */
  PayrollVariableDuration46: number;
  /** Type PG: numeric */
  PayrollVariableDuration47: number;
  /** Type PG: numeric */
  PayrollVariableDuration48: number;
  /** Type PG: numeric */
  PayrollVariableDuration49: number;
  /** Type PG: smallint */
  EventState: number;
  /** Type PG: boolean */
  ScheduleShowTimeLine: boolean;
  /** Type PG: smallint */
  LineType: number;
  /** Type PG: integer */
  LineOrder: number;
  /** Type PG: timestamp without time zone */
  StartDateTime: Date;
  /** Type PG: timestamp without time zone */
  EndDateTime: Date;
  /** Type PG: character varying | Max length: 80 */
  Caption: string;
  /** Type PG: numeric */
  ExpectedDuration_DurationInHours?: number;
  /** Type PG: numeric */
  AchievedDuration_DurationInHours?: number;
  /** Type PG: numeric */
  SalePriceVatExcluded: number;
  /** Type PG: numeric */
  NetAmountVatExcluded: number;
  /** Type PG: numeric */
  HourlyCostPrice: number;
  /** Type PG: numeric */
  CostAmount: number;
  /** Type PG: smallint */
  IncludeInRealizedCost: number;
  /** Type PG: boolean */
  ToInvoice: boolean;
  /** Type PG: smallint */
  DocumentType: number;
  /** Type PG: boolean */
  Address_Npai: boolean;
  /** Type PG: boolean */
  Contact_NaturalPerson: boolean;
  /** Type PG: boolean */
  Contact_OptIn: boolean;
  /** Type PG: boolean */
  ReminderEnabled: boolean;
  /** Type PG: character varying | Max length: 10 */
  ScheduleEventNumber: string;
  /** Type PG: smallint */
  Maintenance_InvoiceTravelExpenseOnLastIntervention: number;
  /** Type PG: boolean */
  Maintenance_SendConfirmationMail: boolean;
  /** Type PG: boolean */
  Maintenance_NextEventToForesee: boolean;
  /** Type PG: boolean */
  Maintenance_DecreaseContractCounterForNextEvent: boolean;
  /** Type PG: smallint */
  Maintenance_IncludeInIncidentPredictedCost: number;
  /** Type PG: smallint */
  Maintenance_IncludeInContractPredictedCost: number;
  /** Type PG: boolean */
  InvoiceInterveners: boolean;
  /** Type PG: boolean */
  InvoiceEquipments: boolean;
  /** Type PG: numeric */
  PredictedCostAmount: number;
  /** Type PG: timestamp without time zone */
  Maintenance_NextEventDate?: Date;
  /** Type PG: character varying | Max length: 8 */
  Maintenance_CustomerProductId?: string;
  /** Type PG: uuid */
  Maintenance_NextMaintenanceEventId?: string;
  /** Type PG: character varying | Max length: 8 */
  Maintenance_ContractId?: string;
  /** Type PG: numeric */
  Maintenance_ContractHoursNumberDecremented?: number;
  /** Type PG: text */
  Maintenance_InterventionDescription?: string;
  /** Type PG: text */
  Maintenance_InterventionDescriptionClear?: string;
  /** Type PG: text */
  Maintenance_InterventionReport?: string;
  /** Type PG: text */
  Maintenance_InterventionReportClear?: string;
  /** Type PG: character varying | Max length: 30 */
  Maintenance_Reference?: string;
  /** Type PG: character varying | Max length: 8 */
  Maintenance_ScheduleEventTemplateId?: string;
  /** Type PG: numeric */
  Maintenance_TravelDuration?: number;
  /** Type PG: character varying | Max length: 8 */
  Maintenance_IncidentId?: string;
  /** Type PG: character varying | Max length: 8 */
  Maintenance_TravelExpenseId?: string;
  /** Type PG: uuid */
  Maintenance_TravelExpenseInvoiceId?: string;
  /** Type PG: uuid */
  PayrollExchangeGroupId?: string;
  /** Type PG: uuid */
  AddressId?: string;
  /** Type PG: uuid */
  ContactId?: string;
  /** Type PG: integer */
  sysEditCounter?: number;
  /** Type PG: character varying | Max length: 255 */
  Contact_ExternalId_GoogleId?: string;
  /** Type PG: character varying | Max length: 255 */
  Contact_ExternalId_OutlookId?: string;
  /** Type PG: character varying | Max length: 20 */
  CreatorColleagueId?: string;
  /** Type PG: character varying | Max length: 20 */
  CustomerId?: string;
  /** Type PG: character varying | Max length: 20 */
  SupplierId?: string;
  /** Type PG: timestamp without time zone */
  NextReminder?: Date;
  /** Type PG: smallint */
  ReminderType?: number;
  /** Type PG: smallint */
  Reminder?: number;
  /** Type PG: character varying | Max length: 100 */
  Address_WebSite?: string;
  /** Type PG: numeric */
  Address_Longitude?: number;
  /** Type PG: numeric */
  Address_Latitude?: number;
  /** Type PG: character varying | Max length: 25 */
  Contact_Civility?: string;
  /** Type PG: character varying | Max length: 60 */
  Contact_Name?: string;
  /** Type PG: character varying | Max length: 60 */
  Contact_FirstName?: string;
  /** Type PG: character varying | Max length: 20 */
  Contact_Phone?: string;
  /** Type PG: character varying | Max length: 20 */
  Contact_CellPhone?: string;
  /** Type PG: character varying | Max length: 20 */
  Contact_Fax?: string;
  /** Type PG: character varying | Max length: 100 */
  Contact_Email?: string;
  /** Type PG: character varying | Max length: 40 */
  Contact_Function?: string;
  /** Type PG: character varying | Max length: 40 */
  Contact_Department?: string;
  /** Type PG: uuid */
  SaleDocumentId?: string;
  /** Type PG: uuid */
  PurchaseDocumentId?: string;
  /** Type PG: uuid */
  StockDocumentId?: string;
  /** Type PG: character varying | Max length: 40 */
  Address_Address1?: string;
  /** Type PG: character varying | Max length: 40 */
  Address_Address2?: string;
  /** Type PG: character varying | Max length: 40 */
  Address_Address3?: string;
  /** Type PG: character varying | Max length: 40 */
  Address_Address4?: string;
  /** Type PG: character varying | Max length: 10 */
  Address_ZipCode?: string;
  /** Type PG: character varying | Max length: 35 */
  Address_City?: string;
  /** Type PG: character varying | Max length: 50 */
  Address_State?: string;
  /** Type PG: character varying | Max length: 3 */
  Address_CountryIsoCode?: string;
  /** Type PG: character varying | Max length: 50 */
  Address_Description?: string;
  /** Type PG: character varying | Max length: 25 */
  Address_Civility?: string;
  /** Type PG: character varying | Max length: 60 */
  Address_ThirdName?: string;
  /** Type PG: character varying | Max length: 40 */
  ItemId?: string;
  /** Type PG: character varying | Max length: 20 */
  InvoiceColleagueId?: string;
  /** Type PG: character varying | Max length: 20 */
  InvoiceCustomerId?: string;
  /** Type PG: character varying | Max length: 10 */
  DealId?: string;
  /** Type PG: numeric */
  Quantity?: number;
  /** Type PG: uuid */
  EventType?: string;
  /** Type PG: character varying | Max length: 20 */
  ColleagueId?: string;
  /** Type PG: character varying | Max length: 10 */
  EquipmentId?: string;
  /** Type PG: uuid */
  InvoiceId?: string;
  /** Type PG: uuid */
  InvoiceLineId?: string;
  /** Type PG: uuid */
  ParentEventId?: string;
  /** Type PG: timestamp without time zone */
  sysCreatedDate?: Date;
  /** Type PG: character varying | Max length: 255 */
  sysCreatedUser?: string;
  /** Type PG: timestamp without time zone */
  sysModifiedDate?: Date;
  /** Type PG: character varying | Max length: 255 */
  sysModifiedUser?: string;
  /** Type PG: text */
  NotesClear?: string;
  /** Type PG: text */
  Notes?: string;
  /** Type PG: uuid */
  SaleDocumentLineid?: string;
  /** Type PG: character varying | Max length: 10 */
  xx_Gestion_Projet_Posit?: string;
  /** Type PG: numeric */
  xx_Total_Temps_Realise?: number;
  /** Type PG: numeric */
  xx_Total_Temps_Realise_Client?: number;
  /** Type PG: numeric */
  xx_Total_Temps_Realise_Interne?: number;
  /** Type PG: character varying | Max length: 30 */
  xx_Type_Tache?: string;
  /** Type PG: text */
  xx_Theme?: string;
  /** Type PG: character varying | Max length: 50 */
  xx_Services?: string;
  /** Type PG: character varying | Max length: 250 */
  xx_Theme_Commercial?: string;
  /** Type PG: numeric */
  xx_Duree_Pevue?: number;
  /** Type PG: numeric */
  xx_Total_Temps_Realise_Relationnel?: number;
  /** Type PG: numeric */
  xx_Duree_Trajet?: number;
  /** Type PG: character varying | Max length: 255 */
  xx_Activite?: string;
  /** Type PG: numeric */
  xx_Total_Temps_Realise_Trajet?: number;
  /** Type PG: numeric */
  xx_Total_Temps_Realise_Formation?: number;
  /** Type PG: numeric */
  xx_Total_Temps_Realise_Maquettage?: number;
  /** Type PG: character varying | Max length: 30 */
  xx_Logiciel?: string;
  /** Type PG: character varying | Max length: 20 */
  xx_Fournisseur?: string;
  /** Type PG: boolean */
  xx_URGENT: boolean;
  /** Type PG: character varying | Max length: 20 */
  SubContractorId?: string;
  /** Type PG: numeric */
  ExpectedDuration_Duration?: number;
  /** Type PG: character varying | Max length: 4 */
  ExpectedDuration_UnitId?: string;
  /** Type PG: character varying | Max length: 30 */
  ExpectedDuration_EditedDuration?: string;
  /** Type PG: numeric */
  AchievedDuration_Duration?: number;
  /** Type PG: character varying | Max length: 4 */
  AchievedDuration_UnitId?: string;
  /** Type PG: character varying | Max length: 30 */
  AchievedDuration_EditedDuration?: string;
  /** Type PG: boolean */
  Contact_AllowUsePersonnalDatas: boolean;
  /** Type PG: smallint */
  DisplayType: number;
  /** Type PG: character varying | Max length: 8 */
  CompetenceId?: string;
  /** Type PG: character varying | Max length: 9 */
  EquipmentTypeId?: string;
  /** Type PG: character varying | Max length: 10 */
  ConstructionSiteId?: string;
  /** Type PG: boolean */
  ExceptionWorked: boolean;
  /** Type PG: text */
  ExceptionCompetenceIds?: string;
  /** Type PG: text */
  ExceptionColleagueIds?: string;
  /** Type PG: smallint */
  ExceptionColleagueSelectionType?: number;
  /** Type PG: timestamp without time zone */
  ExceptionDaySchedule0_StartTime: Date;
  /** Type PG: timestamp without time zone */
  ExceptionDaySchedule0_EndTime: Date;
  /** Type PG: double precision */
  ExceptionDaySchedule0_Duration: number;
  /** Type PG: boolean */
  ExceptionDaySchedule0_Active: boolean;
  /** Type PG: timestamp without time zone */
  ExceptionDaySchedule0_LunchStartTime?: Date;
  /** Type PG: timestamp without time zone */
  ExceptionDaySchedule0_LunchEndTime?: Date;
  /** Type PG: boolean */
  ExceptionDaySchedule0_Customize: boolean;
  /** Type PG: timestamp without time zone */
  ExceptionDaySchedule1_StartTime: Date;
  /** Type PG: timestamp without time zone */
  ExceptionDaySchedule1_EndTime: Date;
  /** Type PG: double precision */
  ExceptionDaySchedule1_Duration: number;
  /** Type PG: boolean */
  ExceptionDaySchedule1_Active: boolean;
  /** Type PG: timestamp without time zone */
  ExceptionDaySchedule1_LunchStartTime?: Date;
  /** Type PG: timestamp without time zone */
  ExceptionDaySchedule1_LunchEndTime?: Date;
  /** Type PG: boolean */
  ExceptionDaySchedule1_Customize: boolean;
  /** Type PG: timestamp without time zone */
  ExceptionDaySchedule2_StartTime: Date;
  /** Type PG: timestamp without time zone */
  ExceptionDaySchedule2_EndTime: Date;
  /** Type PG: double precision */
  ExceptionDaySchedule2_Duration: number;
  /** Type PG: boolean */
  ExceptionDaySchedule2_Active: boolean;
  /** Type PG: timestamp without time zone */
  ExceptionDaySchedule2_LunchStartTime?: Date;
  /** Type PG: timestamp without time zone */
  ExceptionDaySchedule2_LunchEndTime?: Date;
  /** Type PG: boolean */
  ExceptionDaySchedule2_Customize: boolean;
  /** Type PG: timestamp without time zone */
  ExceptionDaySchedule3_StartTime: Date;
  /** Type PG: timestamp without time zone */
  ExceptionDaySchedule3_EndTime: Date;
  /** Type PG: double precision */
  ExceptionDaySchedule3_Duration: number;
  /** Type PG: boolean */
  ExceptionDaySchedule3_Active: boolean;
  /** Type PG: timestamp without time zone */
  ExceptionDaySchedule3_LunchStartTime?: Date;
  /** Type PG: timestamp without time zone */
  ExceptionDaySchedule3_LunchEndTime?: Date;
  /** Type PG: boolean */
  ExceptionDaySchedule3_Customize: boolean;
  /** Type PG: timestamp without time zone */
  ExceptionDaySchedule4_StartTime: Date;
  /** Type PG: timestamp without time zone */
  ExceptionDaySchedule4_EndTime: Date;
  /** Type PG: double precision */
  ExceptionDaySchedule4_Duration: number;
  /** Type PG: boolean */
  ExceptionDaySchedule4_Active: boolean;
  /** Type PG: timestamp without time zone */
  ExceptionDaySchedule4_LunchStartTime?: Date;
  /** Type PG: timestamp without time zone */
  ExceptionDaySchedule4_LunchEndTime?: Date;
  /** Type PG: boolean */
  ExceptionDaySchedule4_Customize: boolean;
  /** Type PG: timestamp without time zone */
  ExceptionDaySchedule5_StartTime: Date;
  /** Type PG: timestamp without time zone */
  ExceptionDaySchedule5_EndTime: Date;
  /** Type PG: double precision */
  ExceptionDaySchedule5_Duration: number;
  /** Type PG: boolean */
  ExceptionDaySchedule5_Active: boolean;
  /** Type PG: timestamp without time zone */
  ExceptionDaySchedule5_LunchStartTime?: Date;
  /** Type PG: timestamp without time zone */
  ExceptionDaySchedule5_LunchEndTime?: Date;
  /** Type PG: boolean */
  ExceptionDaySchedule5_Customize: boolean;
  /** Type PG: timestamp without time zone */
  ExceptionDaySchedule6_StartTime: Date;
  /** Type PG: timestamp without time zone */
  ExceptionDaySchedule6_EndTime: Date;
  /** Type PG: double precision */
  ExceptionDaySchedule6_Duration: number;
  /** Type PG: boolean */
  ExceptionDaySchedule6_Active: boolean;
  /** Type PG: timestamp without time zone */
  ExceptionDaySchedule6_LunchStartTime?: Date;
  /** Type PG: timestamp without time zone */
  ExceptionDaySchedule6_LunchEndTime?: Date;
  /** Type PG: boolean */
  ExceptionDaySchedule6_Customize: boolean;
  /** Type PG: boolean */
  IsScheduleException: boolean;
  /** Type PG: boolean */
  MustBeCalculated: boolean;
  /** Type PG: boolean */
  CreatedByExecutionQuote: boolean;
  /** Type PG: numeric */
  WorkingDuration_DurationInHours?: number;
  /** Type PG: numeric */
  WorkingDuration_Duration?: number;
  /** Type PG: character varying | Max length: 4 */
  WorkingDuration_UnitId?: string;
  /** Type PG: character varying | Max length: 30 */
  WorkingDuration_EditedDuration?: string;
  /** Type PG: numeric */
  UpdatedWorkingDuration_DurationInHours?: number;
  /** Type PG: numeric */
  UpdatedWorkingDuration_Duration?: number;
  /** Type PG: character varying | Max length: 4 */
  UpdatedWorkingDuration_UnitId?: string;
  /** Type PG: character varying | Max length: 30 */
  UpdatedWorkingDuration_EditedDuration?: string;
  /** Type PG: smallint */
  GlobalPercentComplete: number;
  /** Type PG: timestamp without time zone */
  ProgressUpdateLastDate?: Date;
  /** Type PG: numeric */
  LabourUpdatedExpectedDuration_DurationInHours?: number;
  /** Type PG: numeric */
  LabourUpdatedExpectedDuration_Duration?: number;
  /** Type PG: character varying | Max length: 4 */
  LabourUpdatedExpectedDuration_UnitId?: string;
  /** Type PG: character varying | Max length: 30 */
  LabourUpdatedExpectedDuration_EditedDuration?: string;
  /** Type PG: numeric */
  LabourScheduledDuration_DurationInHours?: number;
  /** Type PG: numeric */
  LabourScheduledDuration_Duration?: number;
  /** Type PG: character varying | Max length: 4 */
  LabourScheduledDuration_UnitId?: string;
  /** Type PG: character varying | Max length: 30 */
  LabourScheduledDuration_EditedDuration?: string;
  /** Type PG: smallint */
  LabourPercentComplete: number;
  /** Type PG: numeric */
  LabourRemainingDuration_DurationInHours?: number;
  /** Type PG: numeric */
  LabourRemainingDuration_Duration?: number;
  /** Type PG: character varying | Max length: 4 */
  LabourRemainingDuration_UnitId?: string;
  /** Type PG: character varying | Max length: 30 */
  LabourRemainingDuration_EditedDuration?: string;
  /** Type PG: numeric */
  LabourOverDuration_DurationInHours?: number;
  /** Type PG: numeric */
  LabourOverDuration_Duration?: number;
  /** Type PG: character varying | Max length: 4 */
  LabourOverDuration_UnitId?: string;
  /** Type PG: character varying | Max length: 30 */
  LabourOverDuration_EditedDuration?: string;
  /** Type PG: smallint */
  OccupancyRate?: number;
  /** Type PG: smallint */
  AbsenceRange?: number;
  /** Type PG: boolean */
  DateChangeRemindEnabled: boolean;
  /** Type PG: integer */
  ConflictTypes: number;
  /** Type PG: smallint */
  ConflictIndicator: number;
  /** Type PG: uuid */
  AccountingYearId?: string;
  /** Type PG: bytea */
  ConflictImageIndicator?: Buffer;
  /** Type PG: bytea */
  ConflictTypesImage?: Buffer;
  /** Type PG: numeric */
  WorkedHours: number;
  /** Type PG: numeric */
  PlannedHours: number;
  /** Type PG: character varying | Max length: 10 */
  Address_CodeINSEE?: string;
  /** Type PG: character varying | Max length: 50 */
  Address_CityINSEE?: string;
  /** Type PG: character varying | Max length: 40 */
  Contact_Profession?: string;
  /** Type PG: boolean */
  HasAssociatedFiles: boolean;
}

/**
 * Interface pour la table: MaintenanceContract
 * Générée automatiquement le 23/10/2025 09:15:22
 */
export interface MaintenanceContract {
  /** Type PG: numeric */
  PredictedDuration: number;
  /** Type PG: numeric */
  AccomplishedDuration: number;
  /** Type PG: numeric */
  ProfitsOnDuration: number;
  /** Type PG: numeric */
  PredictedPeriodicInvoicingAmount: number;
  /** Type PG: boolean */
  ArePartsCovered: boolean;
  /** Type PG: numeric */
  PartsDuration: number;
  /** Type PG: boolean */
  IsLabourCovered: boolean;
  /** Type PG: numeric */
  LabourDuration: number;
  /** Type PG: boolean */
  IsTravelCovered: boolean;
  /** Type PG: numeric */
  TravelDuration: number;
  /** Type PG: boolean */
  TransferRemainingCounterWhenRenewal: boolean;
  /** Type PG: boolean */
  InvoicingAddress_Npai: boolean;
  /** Type PG: boolean */
  TacitRenewal: boolean;
  /** Type PG: boolean */
  DuplicateContractWhenRenewal: boolean;
  /** Type PG: smallint */
  InvoiceContentType: number;
  /** Type PG: boolean */
  InvoicingVatIncluded: boolean;
  /** Type PG: boolean */
  EventToForesee: boolean;
  /** Type PG: boolean */
  MailBeforeEvent: boolean;
  /** Type PG: smallint */
  InterventionPeriodicity_Type: number;
  /** Type PG: boolean */
  InterventionPeriodicity_Monday: boolean;
  /** Type PG: boolean */
  InterventionPeriodicity_Tuesday: boolean;
  /** Type PG: boolean */
  InterventionPeriodicity_Wednesday: boolean;
  /** Type PG: boolean */
  InterventionPeriodicity_Thursday: boolean;
  /** Type PG: boolean */
  InterventionPeriodicity_Friday: boolean;
  /** Type PG: boolean */
  InterventionPeriodicity_Saturday: boolean;
  /** Type PG: boolean */
  InterventionPeriodicity_Sunday: boolean;
  /** Type PG: character varying | Max length: 80 */
  Caption: string;
  /** Type PG: smallint */
  CounterType: number;
  /** Type PG: boolean */
  InterventionPeriodicity_DayRankSelector: boolean;
  /** Type PG: boolean */
  InterventionPeriodicity_DayNumberSelector: boolean;
  /** Type PG: character varying | Max length: 255 */
  InterventionPeriodicity_Caption: string;
  /** Type PG: character varying | Max length: 8 */
  Id: string;
  /** Type PG: character varying | Max length: 20 */
  CustomerId: string;
  /** Type PG: timestamp without time zone */
  StartDate: Date;
  /** Type PG: timestamp without time zone */
  EndDate: Date;
  /** Type PG: smallint */
  Status: number;
  /** Type PG: boolean */
  InvoicingContact_NaturalPerson: boolean;
  /** Type PG: boolean */
  InvoicingContact_OptIn: boolean;
  /** Type PG: numeric */
  PredictedCosts: number;
  /** Type PG: numeric */
  PredictedSales: number;
  /** Type PG: numeric */
  PredictedGrossMargin: number;
  /** Type PG: numeric */
  AccomplishedCosts: number;
  /** Type PG: numeric */
  AccomplishedSales: number;
  /** Type PG: numeric */
  AccomplishedGrossMargin: number;
  /** Type PG: numeric */
  ProfitsOnCosts: number;
  /** Type PG: numeric */
  ProfitsOnSales: number;
  /** Type PG: numeric */
  ProfitsOnGrossMargin: number;
  /** Type PG: smallint */
  NeedToUpdateAnalysis: number;
  /** Type PG: character varying | Max length: 3 */
  ContractLanguage: string;
  /** Type PG: boolean */
  CounterAlertActive: boolean;
  /** Type PG: numeric */
  CounterAlertThreshold?: number;
  /** Type PG: uuid */
  CancellationAcknowledgementLetterReportId?: string;
  /** Type PG: smallint */
  CancellationReason?: number;
  /** Type PG: timestamp without time zone */
  CancellationDate?: Date;
  /** Type PG: integer */
  sysEditCounter?: number;
  /** Type PG: character varying | Max length: 255 */
  InvoicingContact_ExternalId_GoogleId?: string;
  /** Type PG: character varying | Max length: 255 */
  InvoicingContact_ExternalId_OutlookId?: string;
  /** Type PG: timestamp without time zone */
  LastEventGeneratedDate?: Date;
  /** Type PG: timestamp without time zone */
  PeriodicInvoicingStartDate?: Date;
  /** Type PG: numeric */
  RemainingCounterNumber?: number;
  /** Type PG: character varying | Max length: 8 */
  TravelExpenseId?: string;
  /** Type PG: character varying | Max length: 20 */
  ColleagueId?: string;
  /** Type PG: timestamp without time zone */
  ProposeRenewalDate?: Date;
  /** Type PG: character varying | Max length: 20 */
  InvoicingCustomerId?: string;
  /** Type PG: character varying | Max length: 10 */
  DealId?: string;
  /** Type PG: character varying | Max length: 8 */
  ContractTemplateId?: string;
  /** Type PG: character varying | Max length: 8 */
  ScheduleEventTemplateId?: string;
  /** Type PG: integer */
  InterventionPeriodicity_UserIncrement?: number;
  /** Type PG: smallint */
  InterventionPeriodicity_SelectedDayOfWeek?: number;
  /** Type PG: smallint */
  InterventionPeriodicity_DayNumber?: number;
  /** Type PG: numeric */
  InitialCounterNumber?: number;
  /** Type PG: smallint */
  InterventionPeriodicity_DayRank?: number;
  /** Type PG: uuid */
  ScheduleEventTypeId?: string;
  /** Type PG: uuid */
  ContractReportId?: string;
  /** Type PG: uuid */
  TacitRenewalLetterReportId?: string;
  /** Type PG: uuid */
  ContractRenewalLetterReportId?: string;
  /** Type PG: character varying | Max length: 10 */
  PeriodicInvoicingId?: string;
  /** Type PG: character varying | Max length: 100 */
  InvoicingAddress_WebSite?: string;
  /** Type PG: numeric */
  InvoicingAddress_Longitude?: number;
  /** Type PG: numeric */
  InvoicingAddress_Latitude?: number;
  /** Type PG: uuid */
  InvoicingContactId?: string;
  /** Type PG: character varying | Max length: 25 */
  InvoicingContact_Civility?: string;
  /** Type PG: character varying | Max length: 60 */
  InvoicingContact_Name?: string;
  /** Type PG: character varying | Max length: 60 */
  InvoicingContact_FirstName?: string;
  /** Type PG: character varying | Max length: 20 */
  InvoicingContact_Phone?: string;
  /** Type PG: character varying | Max length: 20 */
  InvoicingContact_CellPhone?: string;
  /** Type PG: character varying | Max length: 20 */
  InvoicingContact_Fax?: string;
  /** Type PG: character varying | Max length: 100 */
  InvoicingContact_Email?: string;
  /** Type PG: character varying | Max length: 40 */
  InvoicingContact_Function?: string;
  /** Type PG: character varying | Max length: 40 */
  InvoicingContact_Department?: string;
  /** Type PG: timestamp without time zone */
  LastRenewalDate?: Date;
  /** Type PG: character varying | Max length: 8 */
  OriginContractId?: string;
  /** Type PG: uuid */
  InvoicingAddressId?: string;
  /** Type PG: character varying | Max length: 40 */
  InvoicingAddress_Address1?: string;
  /** Type PG: character varying | Max length: 40 */
  InvoicingAddress_Address2?: string;
  /** Type PG: character varying | Max length: 40 */
  InvoicingAddress_Address3?: string;
  /** Type PG: character varying | Max length: 40 */
  InvoicingAddress_Address4?: string;
  /** Type PG: character varying | Max length: 10 */
  InvoicingAddress_ZipCode?: string;
  /** Type PG: character varying | Max length: 35 */
  InvoicingAddress_City?: string;
  /** Type PG: character varying | Max length: 50 */
  InvoicingAddress_State?: string;
  /** Type PG: character varying | Max length: 3 */
  InvoicingAddress_CountryIsoCode?: string;
  /** Type PG: character varying | Max length: 50 */
  InvoicingAddress_Description?: string;
  /** Type PG: character varying | Max length: 25 */
  InvoicingAddress_Civility?: string;
  /** Type PG: character varying | Max length: 60 */
  InvoicingAddress_ThirdName?: string;
  /** Type PG: text */
  Description?: string;
  /** Type PG: text */
  DescriptionClear?: string;
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
  /** Type PG: character varying | Max length: 8 */
  ContractFamilyId?: string;
  /** Type PG: numeric */
  RenewalUpdatingRate?: number;
  /** Type PG: boolean */
  UseContractAddressInDeliveryAdressInvoice: boolean;
  /** Type PG: uuid */
  InterventionAddressId?: string;
  /** Type PG: boolean */
  InvoicingContact_AllowUsePersonnalDatas: boolean;
  /** Type PG: character varying | Max length: 10 */
  ConstructionSiteId?: string;
  /** Type PG: character varying | Max length: 10 */
  InvoicingAddress_CodeINSEE?: string;
  /** Type PG: character varying | Max length: 50 */
  InvoicingAddress_CityINSEE?: string;
  /** Type PG: numeric */
  TotalInvoiceAmountVatExcluded: number;
  /** Type PG: numeric */
  TotalInvoiceAmountVatIncluded: number;
  /** Type PG: character varying | Max length: 40 */
  InvoicingContact_Profession?: string;
  /** Type PG: boolean */
  HasAssociatedFiles: boolean;
}

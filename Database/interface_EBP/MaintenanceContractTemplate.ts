/**
 * Interface pour la table: MaintenanceContractTemplate
 * Générée automatiquement le 23/10/2025 09:15:22
 */
export interface MaintenanceContractTemplate {
  /** Type PG: boolean */
  CounterAlertActive: boolean;
  /** Type PG: boolean */
  InterventionPeriodicity_DayNumberSelector: boolean;
  /** Type PG: character varying | Max length: 255 */
  InterventionPeriodicity_Caption: string;
  /** Type PG: boolean */
  TacitRenewal: boolean;
  /** Type PG: boolean */
  DuplicateContractWhenRenewal: boolean;
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
  /** Type PG: smallint */
  InvoiceContentType: number;
  /** Type PG: boolean */
  InvoicingVatIncluded: boolean;
  /** Type PG: boolean */
  EventToForesee: boolean;
  /** Type PG: boolean */
  MailBeforeEvent: boolean;
  /** Type PG: character varying | Max length: 80 */
  Caption: string;
  /** Type PG: smallint */
  CounterType: number;
  /** Type PG: boolean */
  InterventionPeriodicity_DayRankSelector: boolean;
  /** Type PG: character varying | Max length: 8 */
  Id: string;
  /** Type PG: numeric */
  Duration: number;
  /** Type PG: smallint */
  DaysNumberForProposeRenewal?: number;
  /** Type PG: character varying | Max length: 80 */
  LocalizableCaption_2?: string;
  /** Type PG: character varying | Max length: 80 */
  LocalizableCaption_3?: string;
  /** Type PG: character varying | Max length: 80 */
  LocalizableCaption_4?: string;
  /** Type PG: character varying | Max length: 80 */
  LocalizableCaption_5?: string;
  /** Type PG: text */
  LocalizableDescription_2?: string;
  /** Type PG: text */
  LocalizableDescription_Clear_2?: string;
  /** Type PG: text */
  LocalizableDescription_3?: string;
  /** Type PG: text */
  LocalizableDescription_Clear_3?: string;
  /** Type PG: text */
  LocalizableDescription_4?: string;
  /** Type PG: text */
  LocalizableDescription_Clear_4?: string;
  /** Type PG: text */
  LocalizableDescription_5?: string;
  /** Type PG: text */
  LocalizableDescription_Clear_5?: string;
  /** Type PG: uuid */
  LocalizableContractReportId_2?: string;
  /** Type PG: uuid */
  LocalizableContractReportId_3?: string;
  /** Type PG: uuid */
  LocalizableContractReportId_4?: string;
  /** Type PG: uuid */
  LocalizableContractReportId_5?: string;
  /** Type PG: uuid */
  LocalizableTacitRenewalLetterReportId_2?: string;
  /** Type PG: uuid */
  LocalizableTacitRenewalLetterReportId_3?: string;
  /** Type PG: uuid */
  LocalizableTacitRenewalLetterReportId_4?: string;
  /** Type PG: uuid */
  LocalizableTacitRenewalLetterReportId_5?: string;
  /** Type PG: uuid */
  LocalizableContractRenewalLetterReportId_2?: string;
  /** Type PG: uuid */
  LocalizableContractRenewalLetterReportId_3?: string;
  /** Type PG: uuid */
  LocalizableContractRenewalLetterReportId_4?: string;
  /** Type PG: uuid */
  LocalizableContractRenewalLetterReportId_5?: string;
  /** Type PG: uuid */
  LocalizableCancellationAcknowledgementLetterReportId_2?: string;
  /** Type PG: uuid */
  LocalizableCancellationAcknowledgementLetterReportId_3?: string;
  /** Type PG: uuid */
  LocalizableCancellationAcknowledgementLetterReportId_4?: string;
  /** Type PG: uuid */
  LocalizableCancellationAcknowledgementLetterReportId_5?: string;
  /** Type PG: integer */
  sysEditCounter?: number;
  /** Type PG: smallint */
  InterventionPeriodicity_SelectedDayOfWeek?: number;
  /** Type PG: smallint */
  InterventionPeriodicity_DayNumber?: number;
  /** Type PG: numeric */
  InitialCounterNumber?: number;
  /** Type PG: uuid */
  ScheduleEventTypeId?: string;
  /** Type PG: smallint */
  InterventionPeriodicity_DayRank?: number;
  /** Type PG: text */
  Description?: string;
  /** Type PG: text */
  DescriptionClear?: string;
  /** Type PG: uuid */
  ContractReportId?: string;
  /** Type PG: uuid */
  TacitRenewalLetterReportId?: string;
  /** Type PG: uuid */
  ContractRenewalLetterReportId?: string;
  /** Type PG: character varying | Max length: 10 */
  PeriodicInvoicingId?: string;
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
  /** Type PG: character varying | Max length: 8 */
  ScheduleEventTemplateId?: string;
  /** Type PG: integer */
  InterventionPeriodicity_UserIncrement?: number;
  /** Type PG: numeric */
  CounterAlertThreshold?: number;
  /** Type PG: uuid */
  CancellationAcknowledgementLetterReportId?: string;
  /** Type PG: boolean */
  UseContractAddressInDeliveryAdressInvoice: boolean;
}

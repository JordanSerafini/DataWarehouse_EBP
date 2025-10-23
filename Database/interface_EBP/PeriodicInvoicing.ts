/**
 * Interface pour la table: PeriodicInvoicing
 * Générée automatiquement le 23/10/2025 09:15:22
 */
export interface PeriodicInvoicing {
  /** Type PG: character varying | Max length: 10 */
  Id: string;
  /** Type PG: character varying | Max length: 40 */
  Caption: string;
  /** Type PG: timestamp without time zone */
  Periodicity_StartDate: Date;
  /** Type PG: smallint */
  Periodicity_Type: number;
  /** Type PG: boolean */
  Periodicity_Monday: boolean;
  /** Type PG: boolean */
  Periodicity_Tuesday: boolean;
  /** Type PG: boolean */
  Periodicity_Wednesday: boolean;
  /** Type PG: boolean */
  Periodicity_Thursday: boolean;
  /** Type PG: boolean */
  Periodicity_Friday: boolean;
  /** Type PG: boolean */
  Periodicity_Saturday: boolean;
  /** Type PG: boolean */
  Periodicity_Sunday: boolean;
  /** Type PG: character varying | Max length: 255 */
  Periodicity_Caption: string;
  /** Type PG: boolean */
  UpdatePrices: boolean;
  /** Type PG: boolean */
  RetrieveCustomerInformations: boolean;
  /** Type PG: boolean */
  ApplyCustomerDiscount: boolean;
  /** Type PG: boolean */
  ApplyPriceList: boolean;
  /** Type PG: smallint */
  InvoicingMode: number;
  /** Type PG: boolean */
  AssortItemLines: boolean;
  /** Type PG: boolean */
  CopyTextLines: boolean;
  /** Type PG: boolean */
  CreateSubTotal: boolean;
  /** Type PG: boolean */
  IgnoreCheckAddress: boolean;
  /** Type PG: boolean */
  IgnoreCheckUserDefinedFields: boolean;
  /** Type PG: smallint */
  DelayBeforeAssortEnabled: number;
  /** Type PG: smallint */
  CurrencyCalculationMethod: number;
  /** Type PG: boolean */
  UseCustomSettlementMode: boolean;
  /** Type PG: boolean */
  Periodicity_DayRankSelector: boolean;
  /** Type PG: boolean */
  Periodicity_DayNumberSelector: boolean;
  /** Type PG: boolean */
  UpdatePurchaseAndCostPrice: boolean;
  /** Type PG: boolean */
  DoNotAddOriginDocumentInformationLine: boolean;
  /** Type PG: boolean */
  KeepBillOfQuantitiesProgramActive: boolean;
  /** Type PG: boolean */
  KeepUnitPriceProgramActive: boolean;
  /** Type PG: boolean */
  DoNotSetLastDebitSepaToLast: boolean;
  /** Type PG: integer */
  Periodicity_UserIncrement?: number;
  /** Type PG: smallint */
  Periodicity_SelectedDayOfWeek?: number;
  /** Type PG: smallint */
  Periodicity_DayNumber?: number;
  /** Type PG: integer */
  sysEditCounter?: number;
  /** Type PG: character varying | Max length: 6 */
  SettlementModeId?: string;
  /** Type PG: smallint */
  Periodicity_DayRank?: number;
  /** Type PG: timestamp without time zone */
  Periodicity_EndDate?: Date;
  /** Type PG: uuid */
  ReferenceDocumentId?: string;
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
  /** Type PG: boolean */
  GetDefaultBank: boolean;
}

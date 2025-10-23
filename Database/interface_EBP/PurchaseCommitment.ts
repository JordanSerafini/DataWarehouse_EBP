/**
 * Interface pour la table: PurchaseCommitment
 * Générée automatiquement le 23/10/2025 09:15:22
 */
export interface PurchaseCommitment {
  /** Type PG: boolean */
  GenerateSettlement: boolean;
  /** Type PG: numeric */
  CurrencyAmount: number;
  /** Type PG: numeric */
  CurrencyBalanceDue: number;
  /** Type PG: smallint */
  LiquidationType: number;
  /** Type PG: boolean */
  IsCorrected: boolean;
  /** Type PG: uuid */
  Id: string;
  /** Type PG: timestamp without time zone */
  DueDate: Date;
  /** Type PG: numeric */
  Amount: number;
  /** Type PG: numeric */
  BalanceDue: number;
  /** Type PG: boolean */
  IsDeposit: boolean;
  /** Type PG: smallint */
  DaysNumber: number;
  /** Type PG: smallint */
  CommitmentType: number;
  /** Type PG: boolean */
  AccountingMonth: boolean;
  /** Type PG: boolean */
  IsLiquidated: boolean;
  /** Type PG: smallint */
  AccountingTransferState: number;
  /** Type PG: numeric */
  LiquidationAmount: number;
  /** Type PG: numeric */
  TransferedLiquidationAmount: number;
  /** Type PG: smallint */
  DocumentType: number;
  /** Type PG: smallint */
  LiquidationAccountingTransferState: number;
  /** Type PG: uuid */
  LiquidationAccountingExchangeGroupId?: string;
  /** Type PG: uuid */
  ExternalDocumentId?: string;
  /** Type PG: smallint */
  DocumentSubType?: number;
  /** Type PG: timestamp without time zone */
  LiquidationStateChangeDate?: Date;
  /** Type PG: timestamp without time zone */
  TransferedLiquidationStateChangeDate?: Date;
  /** Type PG: uuid */
  AccountingExchangeGroupId?: string;
  /** Type PG: character varying | Max length: 20 */
  ThirdId?: string;
  /** Type PG: character varying | Max length: 6 */
  PaymentTypeId?: string;
  /** Type PG: smallint */
  DayOfMonth?: number;
  /** Type PG: numeric */
  PercentageDistribution?: number;
  /** Type PG: uuid */
  DocumentId?: string;
  /** Type PG: timestamp without time zone */
  sysCreatedDate?: Date;
  /** Type PG: character varying | Max length: 255 */
  sysCreatedUser?: string;
  /** Type PG: timestamp without time zone */
  sysModifiedDate?: Date;
  /** Type PG: character varying | Max length: 255 */
  sysModifiedUser?: string;
  /** Type PG: uuid */
  sysModuleId?: string;
  /** Type PG: uuid */
  sysDatabaseId?: string;
  /** Type PG: smallint */
  PreviousLiquidationType?: number;
  /** Type PG: numeric */
  LiquidationCurrencyAmount?: number;
  /** Type PG: numeric */
  TransferedLiquidationCurrencyAmount?: number;
  /** Type PG: character varying | Max length: 3 */
  CurrencyId?: string;
  /** Type PG: character varying | Max length: 20 */
  PaymentThirdId?: string;
  /** Type PG: boolean */
  WithoutSettlementGapAccountingEntry: boolean;
}

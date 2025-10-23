/**
 * Interface pour la table: SaleSettlement
 * Générée automatiquement le 23/10/2025 09:15:22
 */
export interface SaleSettlement {
  /** Type PG: boolean */
  IsPosReceipt: boolean;
  /** Type PG: numeric */
  FinancialDiscountAmount: number;
  /** Type PG: numeric */
  CurrencyFinancialDiscountAmount: number;
  /** Type PG: uuid */
  BillOfExchangeCommitmentId: string;
  /** Type PG: uuid */
  BillOfExchangePointingId: string;
  /** Type PG: smallint */
  LiquidationAccountingTransferState: number;
  /** Type PG: uuid */
  Id: string;
  /** Type PG: character varying | Max length: 20 */
  ThirdId: string;
  /** Type PG: timestamp without time zone */
  SettlementDate: Date;
  /** Type PG: character varying | Max length: 6 */
  PaymentTypeId: string;
  /** Type PG: numeric */
  Amount: number;
  /** Type PG: numeric */
  RemainingAmount: number;
  /** Type PG: numeric */
  CurrencyRemainingAmount: number;
  /** Type PG: smallint */
  ValidationState: number;
  /** Type PG: boolean */
  IsLiquidated: boolean;
  /** Type PG: smallint */
  AccountingTransferMode: number;
  /** Type PG: numeric */
  CurrencyConversionRate: number;
  /** Type PG: numeric */
  CurrencyAmount: number;
  /** Type PG: boolean */
  CurrencyExchangeDifference: boolean;
  /** Type PG: boolean */
  IsDeposit: boolean;
  /** Type PG: boolean */
  IsUnpaid: boolean;
  /** Type PG: character varying | Max length: 3 */
  EconomicReasonId?: string;
  /** Type PG: smallint */
  RecoveredFrom?: number;
  /** Type PG: character varying | Max length: 35 */
  SepaMandateIdentification?: string;
  /** Type PG: timestamp without time zone */
  SepaMandateDate?: Date;
  /** Type PG: integer */
  sysRecordVersion?: number;
  /** Type PG: uuid */
  sysRecordVersionId?: string;
  /** Type PG: smallint */
  PreviousLiquidationType?: number;
  /** Type PG: uuid */
  ThirdBankAccountId?: string;
  /** Type PG: uuid */
  AssociatedOrderId?: string;
  /** Type PG: uuid */
  AssociatedDeliveryId?: string;
  /** Type PG: uuid */
  AssociatedInvoiceId?: string;
  /** Type PG: character varying | Max length: 3 */
  CurrencyId?: string;
  /** Type PG: numeric */
  LiquidationAmount?: number;
  /** Type PG: numeric */
  TransferedLiquidationAmount?: number;
  /** Type PG: timestamp without time zone */
  LiquidationStateChangeDate?: Date;
  /** Type PG: timestamp without time zone */
  TransferedLiquidationStateChangeDate?: Date;
  /** Type PG: uuid */
  AccountingExchangeGroupId?: string;
  /** Type PG: character varying | Max length: 6 */
  BankId?: string;
  /** Type PG: character varying | Max length: 70 */
  Reference?: string;
  /** Type PG: character varying | Max length: 10 */
  DraweeReference?: string;
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
  LiquidationAccountingExchangeGroupId?: string;
  /** Type PG: uuid */
  BankRemittanceId?: string;
  /** Type PG: numeric */
  LiquidationCurrencyAmount?: number;
  /** Type PG: numeric */
  TransferedLiquidationCurrencyAmount?: number;
  /** Type PG: smallint */
  AcceptationId?: number;
  /** Type PG: timestamp without time zone */
  BankRemittancePlannedDate?: Date;
  /** Type PG: numeric */
  BankRemittanceChargeAmounts0?: number;
  /** Type PG: numeric */
  BankRemittanceChargeAmounts1?: number;
  /** Type PG: numeric */
  BankRemittanceChargeAmounts2?: number;
  /** Type PG: numeric */
  BankRemittanceChargeAmounts3?: number;
  /** Type PG: numeric */
  BankRemittanceChargeAmounts4?: number;
  /** Type PG: smallint */
  SepaDirectDebitSequence?: number;
  /** Type PG: timestamp without time zone */
  BankRemittanceOperationDate?: Date;
  /** Type PG: smallint */
  UnpaidState?: number;
  /** Type PG: integer */
  sysEditCounter?: number;
  /** Type PG: uuid */
  FinancialDiscountId?: string;
  /** Type PG: character varying | Max length: 35 */
  OriginSepaMandateIdentification?: string;
  /** Type PG: character varying | Max length: 7 */
  PosTerminalId?: string;
  /** Type PG: numeric */
  PosReturningChangeAmount?: number;
  /** Type PG: uuid */
  AssociatedProgressStateId?: string;
  /** Type PG: uuid */
  AssociatedQuoteId?: string;
  /** Type PG: boolean */
  NewAccount: boolean;
  /** Type PG: uuid */
  AssociatedExecutionQuoteId?: string;
  /** Type PG: uuid */
  Hash_Hash_ChainedId?: string;
  /** Type PG: bytea */
  Hash_Hash_Hash?: Buffer;
  /** Type PG: character varying | Max length: 60 */
  ThirdName?: string;
  /** Type PG: character varying | Max length: 60 */
  PaymentTypeCaption?: string;
  /** Type PG: timestamp without time zone */
  MandateExecutionDate?: Date;
  /** Type PG: smallint */
  GoCardLessPaymentStatus?: number;
  /** Type PG: smallint */
  GoCardLessPaymentCause?: number;
  /** Type PG: timestamp without time zone */
  GoCardLessStatusDate?: Date;
  /** Type PG: character varying | Max length: 20 */
  GoCardLessPaymentId?: string;
}

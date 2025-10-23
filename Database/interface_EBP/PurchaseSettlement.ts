/**
 * Interface pour la table: PurchaseSettlement
 * Générée automatiquement le 23/10/2025 09:15:22
 */
export interface PurchaseSettlement {
  /** Type PG: numeric */
  FinancialDiscountAmount: number;
  /** Type PG: numeric */
  CurrencyFinancialDiscountAmount: number;
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
  IsDeposit: boolean;
  /** Type PG: boolean */
  IsLiquidated: boolean;
  /** Type PG: uuid */
  Id: string;
  /** Type PG: smallint */
  LiquidationAccountingTransferState: number;
  /** Type PG: smallint */
  AccountingTransferMode: number;
  /** Type PG: numeric */
  CurrencyConversionRate: number;
  /** Type PG: numeric */
  CurrencyAmount: number;
  /** Type PG: boolean */
  CurrencyExchangeDifference: boolean;
  /** Type PG: uuid */
  BillOfExchangeCommitmentId: string;
  /** Type PG: uuid */
  BillOfExchangePointingId: string;
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
  /** Type PG: uuid */
  LiquidationAccountingExchangeGroupId?: string;
  /** Type PG: uuid */
  DisbursementId?: string;
  /** Type PG: character varying | Max length: 70 */
  Reference?: string;
  /** Type PG: character varying | Max length: 10 */
  DraweeReference?: string;
  /** Type PG: numeric */
  LiquidationAmount?: number;
  /** Type PG: numeric */
  TransferedLiquidationAmount?: number;
  /** Type PG: timestamp without time zone */
  LiquidationStateChangeDate?: Date;
  /** Type PG: timestamp without time zone */
  TransferedLiquidationStateChangeDate?: Date;
  /** Type PG: character varying | Max length: 3 */
  EconomicReasonId?: string;
  /** Type PG: smallint */
  RecoveredFrom?: number;
  /** Type PG: integer */
  sysRecordVersion?: number;
  /** Type PG: uuid */
  sysRecordVersionId?: string;
  /** Type PG: uuid */
  AccountingExchangeGroupId?: string;
  /** Type PG: character varying | Max length: 6 */
  BankId?: string;
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
  /** Type PG: numeric */
  LiquidationCurrencyAmount?: number;
  /** Type PG: numeric */
  TransferedLiquidationCurrencyAmount?: number;
  /** Type PG: smallint */
  AcceptationId?: number;
  /** Type PG: timestamp without time zone */
  BankRemittancePlannedDate?: Date;
  /** Type PG: timestamp without time zone */
  BankRemittanceOperationDate?: Date;
  /** Type PG: uuid */
  FinancialDiscountId?: string;
  /** Type PG: integer */
  sysEditCounter?: number;
  /** Type PG: uuid */
  AssociatedQuoteId?: string;
  /** Type PG: uuid */
  AssociatedProgressStateId?: string;
}

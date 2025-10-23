/**
 * Interface pour la table: PosTerminalOpenClose
 * Générée automatiquement le 23/10/2025 09:15:22
 */
export interface PosTerminalOpenClose {
  /** Type PG: numeric */
  DepositsAmountVatIncluded: number;
  /** Type PG: numeric */
  SaleInAccountAmountVatIncluded: number;
  /** Type PG: numeric */
  LiquidatedAmount: number;
  /** Type PG: numeric */
  TotalCreditMemoBalanceDue: number;
  /** Type PG: numeric */
  SoldGiftVouchers: number;
  /** Type PG: numeric */
  ReturningChangeGiftVouchers: number;
  /** Type PG: uuid */
  Id: string;
  /** Type PG: character varying | Max length: 7 */
  PosTerminalId?: string;
  /** Type PG: timestamp without time zone */
  OpenDateTime: Date;
  /** Type PG: numeric */
  OpenAmount: number;
  /** Type PG: numeric */
  CloseAmount: number;
  /** Type PG: numeric */
  AmountOfDeposit: number;
  /** Type PG: numeric */
  WithdrawalAmount: number;
  /** Type PG: numeric */
  CollectedAmount: number;
  /** Type PG: integer */
  PosReceiptCount: number;
  /** Type PG: numeric */
  AmountVatExcluded: number;
  /** Type PG: numeric */
  AmountVatIncluded: number;
  /** Type PG: character varying | Max length: 20 */
  UserId: string;
  /** Type PG: smallint */
  AccountingTransferState: number;
  /** Type PG: uuid */
  AccountingExchangeGroupId?: string;
  /** Type PG: numeric */
  TheoreticalCloseAmount?: number;
  /** Type PG: numeric */
  CashRegisterGapAmount?: number;
  /** Type PG: timestamp without time zone */
  CloseDateTime?: Date;
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
  /** Type PG: integer */
  sysEditCounter?: number;
  /** Type PG: uuid */
  Hash_Hash_ChainedId?: string;
  /** Type PG: bytea */
  Hash_Hash_Hash?: Buffer;
  /** Type PG: smallint */
  PeriodType: number;
  /** Type PG: timestamp without time zone */
  ClosedPeriodBeginning?: Date;
  /** Type PG: timestamp without time zone */
  ClosedPeriodEnding?: Date;
  /** Type PG: numeric */
  OrderAmountVatExcluded: number;
  /** Type PG: numeric */
  OrderAmountVatIncluded: number;
  /** Type PG: numeric */
  DeliveryOrderAmountVatExcluded: number;
  /** Type PG: numeric */
  DeliveryOrderAmountVatIncluded: number;
}

/**
 * Interface pour la table: UnpaidSaleSettlementLine
 * Générée automatiquement le 23/10/2025 09:15:22
 */
export interface UnpaidSaleSettlementLine {
  /** Type PG: uuid */
  Id: string;
  /** Type PG: uuid */
  SettlementId: string;
  /** Type PG: integer */
  LineOrder: number;
  /** Type PG: smallint */
  UnpaidState: number;
  /** Type PG: timestamp without time zone */
  UnpaidDate: Date;
  /** Type PG: character varying | Max length: 100 */
  Reason: string;
  /** Type PG: numeric */
  ChargeAmountVatExcluded: number;
  /** Type PG: numeric */
  ChargeAmountVatIncluded: number;
  /** Type PG: boolean */
  MustCreateChargesInvoice: boolean;
  /** Type PG: smallint */
  AccountingTransferState: number;
  /** Type PG: numeric */
  CurrencyChargeAmountVatExcluded: number;
  /** Type PG: numeric */
  CurrencyChargeAmountVatIncluded: number;
  /** Type PG: numeric */
  CurrencyConversionRate: number;
  /** Type PG: numeric */
  SettlementAmount: number;
  /** Type PG: numeric */
  SettlementCurrencyAmount: number;
  /** Type PG: timestamp without time zone */
  SettlementDate?: Date;
  /** Type PG: character varying | Max length: 3 */
  SettlementCurrencyId?: string;
  /** Type PG: uuid */
  AccountingExchangeGroupId?: string;
  /** Type PG: uuid */
  BankRemittanceId?: string;
  /** Type PG: uuid */
  ChargeInvoiceId?: string;
  /** Type PG: character varying | Max length: 40 */
  ChargeInvoiceItemId?: string;
  /** Type PG: timestamp without time zone */
  DateToRemitAgain?: Date;
  /** Type PG: uuid */
  ChargeVatId?: string;
  /** Type PG: timestamp without time zone */
  sysCreatedDate?: Date;
  /** Type PG: character varying | Max length: 255 */
  sysCreatedUser?: string;
  /** Type PG: timestamp without time zone */
  sysModifiedDate?: Date;
  /** Type PG: character varying | Max length: 255 */
  sysModifiedUser?: string;
  /** Type PG: boolean */
  IncludeUnpaidChargeToRemit: boolean;
}

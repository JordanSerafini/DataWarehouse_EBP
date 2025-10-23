/**
 * Interface pour la table: BankRemittance
 * Générée automatiquement le 23/10/2025 09:15:22
 */
export interface BankRemittance {
  /** Type PG: uuid */
  Id: string;
  /** Type PG: character varying | Max length: 10 */
  BankRemittanceNumber: string;
  /** Type PG: timestamp without time zone */
  BankRemittanceDate: Date;
  /** Type PG: character varying | Max length: 6 */
  BankId: string;
  /** Type PG: character varying | Max length: 6 */
  PaymentTypeId: string;
  /** Type PG: smallint */
  BankRemittanceState: number;
  /** Type PG: numeric */
  Amount: number;
  /** Type PG: numeric */
  CurrencyAmount: number;
  /** Type PG: boolean */
  CfonbFileGenerated: boolean;
  /** Type PG: numeric */
  CurrencyConversionRate: number;
  /** Type PG: smallint */
  RemittanceType: number;
  /** Type PG: boolean */
  AccountingTransferWithCommitmentDate: boolean;
  /** Type PG: numeric */
  ChargeAmounts0: number;
  /** Type PG: numeric */
  ChargeAmounts1: number;
  /** Type PG: numeric */
  ChargeAmounts2: number;
  /** Type PG: numeric */
  ChargeAmounts3: number;
  /** Type PG: numeric */
  ChargeAmounts4: number;
  /** Type PG: numeric */
  CurrencyChargeAmounts0: number;
  /** Type PG: numeric */
  CurrencyChargeAmounts1: number;
  /** Type PG: numeric */
  CurrencyChargeAmounts2: number;
  /** Type PG: numeric */
  CurrencyChargeAmounts3: number;
  /** Type PG: numeric */
  CurrencyChargeAmounts4: number;
  /** Type PG: boolean */
  UseRemittanceAccountsForAccountingTransfer: boolean;
  /** Type PG: boolean */
  ContainsUnpaidSettlement: boolean;
  /** Type PG: timestamp without time zone */
  CollectionDate?: Date;
  /** Type PG: timestamp without time zone */
  ChargesEntryDate?: Date;
  /** Type PG: character varying | Max length: 10 */
  LastSepaMessageId?: string;
  /** Type PG: character varying | Max length: 3 */
  CurrencyId?: string;
  /** Type PG: uuid */
  AccountingExchangeGroupId?: string;
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
  ChargesAccountingEntryId?: string;
}

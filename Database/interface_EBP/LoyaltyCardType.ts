/**
 * Interface pour la table: LoyaltyCardType
 * Générée automatiquement le 23/10/2025 09:15:22
 */
export interface LoyaltyCardType {
  /** Type PG: character varying | Max length: 10 */
  Id: string;
  /** Type PG: character varying | Max length: 40 */
  Caption: string;
  /** Type PG: smallint */
  CalculationType: number;
  /** Type PG: numeric */
  PointValue: number;
  /** Type PG: smallint */
  DecreaseLoyalty: number;
  /** Type PG: boolean */
  ExcludeLinesWithDiscount: boolean;
  /** Type PG: boolean */
  ConsiderInvoices: boolean;
  /** Type PG: boolean */
  ExcludePosReceiptWithCustomerAdvantage: boolean;
  /** Type PG: boolean */
  SubstractCreditMemoAndNegativePosReceipt: boolean;
  /** Type PG: smallint */
  CalculationBaseForCommercialNomenclature: number;
  /** Type PG: uuid */
  RoundId?: string;
  /** Type PG: integer */
  sysEditCounter?: number;
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
  /** Type PG: character varying | Max length: 40 */
  InvoicingItemId?: string;
}

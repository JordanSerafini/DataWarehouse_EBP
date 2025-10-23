/**
 * Interface pour la table: CurrencyTable
 * Générée automatiquement le 23/10/2025 09:15:22
 */
export interface CurrencyTable {
  /** Type PG: character varying | Max length: 3 */
  Id: string;
  /** Type PG: character varying | Max length: 50 */
  Caption: string;
  /** Type PG: character varying | Max length: 10 */
  Symbol: string;
  /** Type PG: numeric */
  ConversionRate: number;
  /** Type PG: smallint */
  DecimalCount: number;
  /** Type PG: timestamp without time zone */
  ConversionRateDate: Date;
  /** Type PG: uuid */
  UniqueId: string;
  /** Type PG: integer */
  sysRecordVersion?: number;
  /** Type PG: uuid */
  sysRecordVersionId?: string;
  /** Type PG: character varying | Max length: 255 */
  ProviderName?: string;
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
  /** Type PG: character varying | Max length: 10 */
  SalesJournal?: string;
  /** Type PG: character varying | Max length: 10 */
  PurchasesJournal?: string;
}

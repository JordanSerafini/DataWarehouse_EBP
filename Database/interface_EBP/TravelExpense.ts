/**
 * Interface pour la table: TravelExpense
 * Générée automatiquement le 23/10/2025 09:15:22
 */
export interface TravelExpense {
  /** Type PG: character varying | Max length: 8 */
  Id: string;
  /** Type PG: character varying | Max length: 40 */
  Caption: string;
  /** Type PG: numeric */
  AmountVatExcluded?: number;
  /** Type PG: uuid */
  VatId?: string;
  /** Type PG: numeric */
  AmountVatIncluded?: number;
  /** Type PG: character varying | Max length: 40 */
  ReferenceItemId?: string;
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
}

/**
 * Interface pour la table: ComplementaryDiscount
 * Générée automatiquement le 23/10/2025 09:15:22
 */
export interface ComplementaryDiscount {
  /** Type PG: character varying | Max length: 10 */
  Code: string;
  /** Type PG: character varying | Max length: 30 */
  Caption: string;
  /** Type PG: character varying | Max length: 20 */
  SaleAccount: string;
  /** Type PG: character varying | Max length: 20 */
  PurchaseAccount: string;
  /** Type PG: boolean */
  TransferToAccounting: boolean;
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

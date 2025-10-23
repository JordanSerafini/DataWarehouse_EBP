/**
 * Interface pour la table: SubTax
 * Générée automatiquement le 23/10/2025 09:15:22
 */
export interface SubTax {
  /** Type PG: uuid */
  Id: string;
  /** Type PG: character varying | Max length: 100 */
  Caption: string;
  /** Type PG: uuid */
  TaxId: string;
  /** Type PG: numeric */
  TaxValue: number;
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
}

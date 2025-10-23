/**
 * Interface pour la table: EcotaxCalculationBase
 * Générée automatiquement le 23/10/2025 09:15:22
 */
export interface EcotaxCalculationBase {
  /** Type PG: smallint */
  CalculationBase: number;
  /** Type PG: numeric */
  TaxValue: number;
  /** Type PG: character varying | Max length: 8 */
  Id: string;
  /** Type PG: character varying | Max length: 40 */
  Caption: string;
  /** Type PG: numeric */
  AmountVatIncluded: number;
  /** Type PG: character varying | Max length: 4 */
  UnitId?: string;
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

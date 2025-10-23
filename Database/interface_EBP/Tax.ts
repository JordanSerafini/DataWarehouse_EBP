/**
 * Interface pour la table: Tax
 * Générée automatiquement le 23/10/2025 09:15:22
 */
export interface Tax {
  /** Type PG: uuid */
  Id: string;
  /** Type PG: character varying | Max length: 100 */
  Caption: string;
  /** Type PG: smallint */
  CalculationBase: number;
  /** Type PG: boolean */
  SubjectToVat: boolean;
  /** Type PG: numeric */
  TaxValue: number;
  /** Type PG: integer */
  sysEditCounter?: number;
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
  /** Type PG: character varying | Max length: 100 */
  LocalizableCaption_2?: string;
  /** Type PG: character varying | Max length: 100 */
  LocalizableCaption_3?: string;
  /** Type PG: character varying | Max length: 100 */
  LocalizableCaption_4?: string;
  /** Type PG: character varying | Max length: 100 */
  LocalizableCaption_5?: string;
}

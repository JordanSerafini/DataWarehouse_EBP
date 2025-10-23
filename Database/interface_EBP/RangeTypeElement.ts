/**
 * Interface pour la table: RangeTypeElement
 * Générée automatiquement le 23/10/2025 09:15:22
 */
export interface RangeTypeElement {
  /** Type PG: integer */
  RangeTypeOrder: number;
  /** Type PG: character varying | Max length: 10 */
  RangeTypeId: string;
  /** Type PG: uuid */
  Id: string;
  /** Type PG: character varying | Max length: 6 */
  Code: string;
  /** Type PG: character varying | Max length: 50 */
  Caption: string;
  /** Type PG: character varying | Max length: 50 */
  LocalizableCaption_2?: string;
  /** Type PG: character varying | Max length: 50 */
  LocalizableCaption_3?: string;
  /** Type PG: character varying | Max length: 50 */
  LocalizableCaption_4?: string;
  /** Type PG: character varying | Max length: 50 */
  LocalizableCaption_5?: string;
  /** Type PG: timestamp without time zone */
  sysCreatedDate?: Date;
  /** Type PG: character varying | Max length: 255 */
  sysCreatedUser?: string;
  /** Type PG: timestamp without time zone */
  sysModifiedDate?: Date;
  /** Type PG: character varying | Max length: 255 */
  sysModifiedUser?: string;
}

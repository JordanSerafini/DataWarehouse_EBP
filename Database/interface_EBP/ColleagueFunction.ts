/**
 * Interface pour la table: ColleagueFunction
 * Générée automatiquement le 23/10/2025 09:15:22
 */
export interface ColleagueFunction {
  /** Type PG: uuid */
  Id: string;
  /** Type PG: character varying | Max length: 60 */
  Caption: string;
  /** Type PG: integer */
  sysRecordVersion?: number;
  /** Type PG: uuid */
  sysRecordVersionId?: string;
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
  /** Type PG: character varying | Max length: 60 */
  LocalizableCaption_2?: string;
  /** Type PG: character varying | Max length: 60 */
  LocalizableCaption_3?: string;
  /** Type PG: character varying | Max length: 60 */
  LocalizableCaption_4?: string;
  /** Type PG: character varying | Max length: 60 */
  LocalizableCaption_5?: string;
}

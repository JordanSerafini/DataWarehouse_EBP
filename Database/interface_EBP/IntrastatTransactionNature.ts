/**
 * Interface pour la table: IntrastatTransactionNature
 * Générée automatiquement le 23/10/2025 09:15:22
 */
export interface IntrastatTransactionNature {
  /** Type PG: character varying | Max length: 2 */
  Id: string;
  /** Type PG: character varying | Max length: 150 */
  Caption: string;
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
  /** Type PG: character varying | Max length: 150 */
  LocalizableCaption_2?: string;
  /** Type PG: character varying | Max length: 150 */
  LocalizableCaption_3?: string;
  /** Type PG: character varying | Max length: 150 */
  LocalizableCaption_4?: string;
  /** Type PG: character varying | Max length: 150 */
  LocalizableCaption_5?: string;
  /** Type PG: text */
  LocalizableNotes_2?: string;
  /** Type PG: text */
  LocalizableNotes_Clear_2?: string;
  /** Type PG: text */
  LocalizableNotes_3?: string;
  /** Type PG: text */
  LocalizableNotes_Clear_3?: string;
  /** Type PG: text */
  LocalizableNotes_4?: string;
  /** Type PG: text */
  LocalizableNotes_Clear_4?: string;
  /** Type PG: text */
  LocalizableNotes_5?: string;
  /** Type PG: text */
  LocalizableNotes_Clear_5?: string;
}

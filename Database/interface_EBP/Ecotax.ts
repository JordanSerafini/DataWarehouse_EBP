/**
 * Interface pour la table: Ecotax
 * Générée automatiquement le 23/10/2025 09:15:22
 */
export interface Ecotax {
  /** Type PG: boolean */
  Inactive: boolean;
  /** Type PG: character varying | Max length: 8 */
  Id: string;
  /** Type PG: character varying | Max length: 70 */
  Caption: string;
  /** Type PG: numeric */
  AmountVatExcluded: number;
  /** Type PG: numeric */
  AmountVatInclued: number;
  /** Type PG: uuid */
  UniqueId: string;
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
  /** Type PG: character varying | Max length: 10 */
  Code?: string;
  /** Type PG: character varying | Max length: 70 */
  LocalizableCaption_2?: string;
  /** Type PG: text */
  LocalizableNotes_2?: string;
  /** Type PG: text */
  LocalizableNotes_Clear_2?: string;
  /** Type PG: character varying | Max length: 70 */
  LocalizableCaption_3?: string;
  /** Type PG: character varying | Max length: 70 */
  LocalizableCaption_4?: string;
  /** Type PG: character varying | Max length: 70 */
  LocalizableCaption_5?: string;
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

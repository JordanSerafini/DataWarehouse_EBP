/**
 * Interface pour la table: IntrastatNc8Nomenclature
 * Générée automatiquement le 23/10/2025 09:15:22
 */
export interface IntrastatNc8Nomenclature {
  /** Type PG: character varying | Max length: 9 */
  Id: string;
  /** Type PG: text */
  Caption: string;
  /** Type PG: text */
  Chapter?: string;
  /** Type PG: text */
  Sh4?: string;
  /** Type PG: text */
  Sh6?: string;
  /** Type PG: text */
  Nc8Section?: string;
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
  /** Type PG: text */
  LocalizableCaption_2?: string;
  /** Type PG: text */
  LocalizableChapter_2?: string;
  /** Type PG: text */
  LocalizableSh4_2?: string;
  /** Type PG: text */
  LocalizableSh6_2?: string;
  /** Type PG: text */
  LocalizableSection_2?: string;
  /** Type PG: text */
  LocalizableCaption_3?: string;
  /** Type PG: text */
  LocalizableCaption_4?: string;
  /** Type PG: text */
  LocalizableCaption_5?: string;
  /** Type PG: text */
  LocalizableChapter_3?: string;
  /** Type PG: text */
  LocalizableChapter_4?: string;
  /** Type PG: text */
  LocalizableChapter_5?: string;
  /** Type PG: text */
  LocalizableSh4_3?: string;
  /** Type PG: text */
  LocalizableSh4_4?: string;
  /** Type PG: text */
  LocalizableSh4_5?: string;
  /** Type PG: text */
  LocalizableSh6_3?: string;
  /** Type PG: text */
  LocalizableSh6_4?: string;
  /** Type PG: text */
  LocalizableSh6_5?: string;
  /** Type PG: text */
  LocalizableSection_3?: string;
  /** Type PG: text */
  LocalizableSection_4?: string;
  /** Type PG: text */
  LocalizableSection_5?: string;
}

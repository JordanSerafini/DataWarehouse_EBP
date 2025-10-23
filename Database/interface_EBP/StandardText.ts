/**
 * Interface pour la table: StandardText
 * Générée automatiquement le 23/10/2025 09:15:22
 */
export interface StandardText {
  /** Type PG: character varying | Max length: 10 */
  Id: string;
  /** Type PG: character varying | Max length: 40 */
  Caption: string;
  /** Type PG: text */
  StandardTextClear: string;
  /** Type PG: text */
  StandardText: string;
  /** Type PG: timestamp without time zone */
  sysCreatedDate?: Date;
  /** Type PG: character varying | Max length: 255 */
  sysCreatedUser?: string;
  /** Type PG: timestamp without time zone */
  sysModifiedDate?: Date;
  /** Type PG: character varying | Max length: 255 */
  sysModifiedUser?: string;
  /** Type PG: character varying | Max length: 40 */
  LocalizableCaption_2?: string;
  /** Type PG: text */
  LocalizableStandardText_2?: string;
  /** Type PG: text */
  LocalizableStandardText_Clear_2?: string;
  /** Type PG: character varying | Max length: 40 */
  LocalizableCaption_3?: string;
  /** Type PG: character varying | Max length: 40 */
  LocalizableCaption_4?: string;
  /** Type PG: character varying | Max length: 40 */
  LocalizableCaption_5?: string;
  /** Type PG: text */
  LocalizableStandardText_3?: string;
  /** Type PG: text */
  LocalizableStandardText_Clear_3?: string;
  /** Type PG: text */
  LocalizableStandardText_4?: string;
  /** Type PG: text */
  LocalizableStandardText_Clear_4?: string;
  /** Type PG: text */
  LocalizableStandardText_5?: string;
  /** Type PG: text */
  LocalizableStandardText_Clear_5?: string;
  /** Type PG: smallint */
  Type?: number;
}

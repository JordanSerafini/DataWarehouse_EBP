/**
 * Interface pour la table: Unit
 * Générée automatiquement le 23/10/2025 09:15:22
 */
export interface Unit {
  /** Type PG: character varying | Max length: 4 */
  Id: string;
  /** Type PG: character varying | Max length: 40 */
  Caption: string;
  /** Type PG: smallint */
  UnitType: number;
  /** Type PG: smallint */
  Decimals: number;
  /** Type PG: numeric */
  ConversionRate: number;
  /** Type PG: uuid */
  UniqueId: string;
  /** Type PG: uuid */
  sysModuleId?: string;
  /** Type PG: uuid */
  sysDatabaseId?: string;
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
  /** Type PG: character varying | Max length: 40 */
  LocalizableCaption_2?: string;
  /** Type PG: character varying | Max length: 40 */
  LocalizableCaption_3?: string;
  /** Type PG: character varying | Max length: 40 */
  LocalizableCaption_4?: string;
  /** Type PG: character varying | Max length: 40 */
  LocalizableCaption_5?: string;
  /** Type PG: character varying | Max length: 15 */
  DurationCaption?: string;
  /** Type PG: smallint */
  DefaultDurationCaptionType: number;
  /** Type PG: character varying | Max length: 3 */
  UNECECode?: string;
  /** Type PG: boolean */
  IsInactive: boolean;
}

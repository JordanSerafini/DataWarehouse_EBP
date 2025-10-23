/**
 * Interface pour la table: EbpSysCloudPublication
 * Générée automatiquement le 23/10/2025 09:15:22
 */
export interface EbpSysCloudPublication {
  /** Type PG: uuid */
  Id: string;
  /** Type PG: character varying | Max length: 80 */
  Caption: string;
  /** Type PG: smallint */
  IconPreset: number;
  /** Type PG: boolean */
  IsModified: boolean;
  /** Type PG: boolean */
  IsInactive: boolean;
  /** Type PG: smallint */
  Periodicity_Type: number;
  /** Type PG: boolean */
  Periodicity_Monday: boolean;
  /** Type PG: boolean */
  Periodicity_Tuesday: boolean;
  /** Type PG: boolean */
  Periodicity_Wednesday: boolean;
  /** Type PG: boolean */
  Periodicity_Thursday: boolean;
  /** Type PG: boolean */
  Periodicity_Friday: boolean;
  /** Type PG: boolean */
  Periodicity_Saturday: boolean;
  /** Type PG: boolean */
  Periodicity_Sunday: boolean;
  /** Type PG: character varying | Max length: 40 */
  Folder: string;
  /** Type PG: boolean */
  Periodicity_DayRankSelector: boolean;
  /** Type PG: character varying | Max length: 255 */
  Periodicity_Caption: string;
  /** Type PG: boolean */
  Periodicity_DayNumberSelector: boolean;
  /** Type PG: integer */
  Periodicity_UserIncrement?: number;
  /** Type PG: integer */
  sysEditCounter?: number;
  /** Type PG: smallint */
  Periodicity_SelectedDayOfWeek?: number;
  /** Type PG: smallint */
  Periodicity_DayNumber?: number;
  /** Type PG: bytea */
  Icon?: Buffer;
  /** Type PG: smallint */
  Periodicity_DayRank?: number;
  /** Type PG: timestamp without time zone */
  NextPublishDate?: Date;
  /** Type PG: timestamp without time zone */
  Periodicity_StartDate?: Date;
  /** Type PG: timestamp without time zone */
  Periodicity_EndDate?: Date;
  /** Type PG: timestamp without time zone */
  Periodicity_Time?: Date;
  /** Type PG: character varying | Max length: 200 */
  Description?: string;
  /** Type PG: timestamp without time zone */
  LastPublishedDate?: Date;
  /** Type PG: timestamp without time zone */
  sysCreatedDate?: Date;
  /** Type PG: character varying | Max length: 255 */
  sysCreatedUser?: string;
  /** Type PG: timestamp without time zone */
  sysModifiedDate?: Date;
  /** Type PG: character varying | Max length: 255 */
  sysModifiedUser?: string;
}

/**
 * Interface pour la table: EbpSysAlert
 * Générée automatiquement le 23/10/2025 09:15:22
 */
export interface EbpSysAlert {
  /** Type PG: character varying | Max length: 100 */
  Caption: string;
  /** Type PG: boolean */
  OpeningDatabase: boolean;
  /** Type PG: boolean */
  OpeningEntryForm: boolean;
  /** Type PG: boolean */
  EditingEntryForm: boolean;
  /** Type PG: boolean */
  SavingEntryForm: boolean;
  /** Type PG: text */
  MessageClear: string;
  /** Type PG: text */
  Message: string;
  /** Type PG: boolean */
  Inactive: boolean;
  /** Type PG: character varying | Max length: 10 */
  Id: string;
  /** Type PG: uuid */
  UniqueId: string;
  /** Type PG: boolean */
  CreatedBySystem: boolean;
  /** Type PG: character varying | Max length: 255 */
  TableName?: string;
  /** Type PG: uuid */
  LogicalSubTypeId?: string;
  /** Type PG: character varying | Max length: 20 */
  UserId?: string;
  /** Type PG: character varying | Max length: 20 */
  UserGroupdId?: string;
  /** Type PG: text */
  Conditions?: string;
  /** Type PG: timestamp without time zone */
  ValidityDateFrom?: Date;
  /** Type PG: integer */
  ValidityDateFromType?: number;
  /** Type PG: timestamp without time zone */
  ValidityDateTo?: Date;
  /** Type PG: timestamp without time zone */
  RemindDateTime?: Date;
  /** Type PG: timestamp without time zone */
  sysCreatedDate?: Date;
  /** Type PG: character varying | Max length: 255 */
  sysCreatedUser?: string;
  /** Type PG: timestamp without time zone */
  sysModifiedDate?: Date;
  /** Type PG: character varying | Max length: 255 */
  sysModifiedUser?: string;
}

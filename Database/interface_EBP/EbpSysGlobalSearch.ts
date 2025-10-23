/**
 * Interface pour la table: EbpSysGlobalSearch
 * Générée automatiquement le 23/10/2025 09:15:22
 */
export interface EbpSysGlobalSearch {
  /** Type PG: timestamp without time zone */
  sysCreatedDate?: Date;
  /** Type PG: character varying | Max length: 255 */
  sysCreatedUser?: string;
  /** Type PG: timestamp without time zone */
  sysModifiedDate?: Date;
  /** Type PG: character varying | Max length: 255 */
  sysModifiedUser?: string;
  /** Type PG: character varying | Max length: 255 */
  TableName?: string;
  /** Type PG: uuid */
  LogicalSubTypeId?: string;
  /** Type PG: boolean */
  Inactive: boolean;
  /** Type PG: character varying | Max length: 20 */
  UserId?: string;
  /** Type PG: uuid */
  UniqueId: string;
  /** Type PG: boolean */
  CreatedBySystem: boolean;
  /** Type PG: uuid */
  Id: string;
  /** Type PG: text */
  QuerySet: string;
}

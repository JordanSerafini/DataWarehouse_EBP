/**
 * Interface pour la table: EbpSysCloudAccount
 * Générée automatiquement le 23/10/2025 09:15:22
 */
export interface EbpSysCloudAccount {
  /** Type PG: boolean */
  IsAdministrator: boolean;
  /** Type PG: character varying | Max length: 100 */
  Id: string;
  /** Type PG: uuid */
  UniqueId: string;
  /** Type PG: character varying | Max length: 60 */
  LastName: string;
  /** Type PG: character varying | Max length: 60 */
  FirstName?: string;
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
}

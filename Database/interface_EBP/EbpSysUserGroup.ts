/**
 * Interface pour la table: EbpSysUserGroup
 * Générée automatiquement le 23/10/2025 09:15:22
 */
export interface EbpSysUserGroup {
  /** Type PG: character varying | Max length: 20 */
  Id: string;
  /** Type PG: character varying | Max length: 100 */
  Name: string;
  /** Type PG: uuid */
  UniqueId: string;
  /** Type PG: integer */
  sysEditCounter?: number;
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

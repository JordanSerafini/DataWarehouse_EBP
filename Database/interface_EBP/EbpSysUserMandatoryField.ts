/**
 * Interface pour la table: EbpSysUserMandatoryField
 * Générée automatiquement le 23/10/2025 09:15:22
 */
export interface EbpSysUserMandatoryField {
  /** Type PG: uuid */
  Id: string;
  /** Type PG: character varying | Max length: 255 */
  TableName: string;
  /** Type PG: character varying | Max length: 255 */
  ColumnName: string;
  /** Type PG: uuid */
  LogicalSubTypeId?: string;
  /** Type PG: text */
  Conditions?: string;
  /** Type PG: timestamp without time zone */
  sysCreatedDate?: Date;
  /** Type PG: character varying | Max length: 255 */
  sysCreatedUser?: string;
  /** Type PG: timestamp without time zone */
  sysModifiedDate?: Date;
  /** Type PG: character varying | Max length: 255 */
  sysModifiedUser?: string;
}

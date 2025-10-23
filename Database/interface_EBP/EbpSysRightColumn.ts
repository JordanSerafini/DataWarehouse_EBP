/**
 * Interface pour la table: EbpSysRightColumn
 * Générée automatiquement le 23/10/2025 09:15:22
 */
export interface EbpSysRightColumn {
  /** Type PG: uuid */
  Id: string;
  /** Type PG: uuid */
  RightId: string;
  /** Type PG: character varying | Max length: 64 */
  RightTableName: string;
  /** Type PG: character varying | Max length: 64 */
  RightColumnName: string;
  /** Type PG: smallint */
  Authorizations: number;
  /** Type PG: timestamp without time zone */
  sysCreatedDate?: Date;
  /** Type PG: character varying | Max length: 255 */
  sysCreatedUser?: string;
  /** Type PG: timestamp without time zone */
  sysModifiedDate?: Date;
  /** Type PG: character varying | Max length: 255 */
  sysModifiedUser?: string;
}

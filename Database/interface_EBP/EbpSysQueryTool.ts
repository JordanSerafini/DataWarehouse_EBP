/**
 * Interface pour la table: EbpSysQueryTool
 * Générée automatiquement le 23/10/2025 09:15:22
 */
export interface EbpSysQueryTool {
  /** Type PG: uuid */
  Id: string;
  /** Type PG: character varying | Max length: 150 */
  Caption: string;
  /** Type PG: text */
  Query: string;
  /** Type PG: timestamp without time zone */
  sysCreatedDate?: Date;
  /** Type PG: character varying | Max length: 255 */
  sysCreatedUser?: string;
  /** Type PG: timestamp without time zone */
  sysModifiedDate?: Date;
  /** Type PG: character varying | Max length: 255 */
  sysModifiedUser?: string;
}

/**
 * Interface pour la table: EbpSysUserConnection
 * Générée automatiquement le 23/10/2025 09:15:22
 */
export interface EbpSysUserConnection {
  /** Type PG: character varying | Max length: 20 */
  UserId: string;
  /** Type PG: integer */
  ConnectedCount: number;
  /** Type PG: uuid */
  ApplicationId: string;
  /** Type PG: uuid */
  MainApplicationId: string;
  /** Type PG: integer */
  ProcessId?: number;
  /** Type PG: character varying | Max length: 255 */
  ProcessName?: string;
  /** Type PG: timestamp without time zone */
  sysCreatedDate?: Date;
  /** Type PG: character varying | Max length: 255 */
  sysCreatedUser?: string;
  /** Type PG: timestamp without time zone */
  sysModifiedDate?: Date;
  /** Type PG: character varying | Max length: 255 */
  sysModifiedUser?: string;
  /** Type PG: uuid */
  Id: string;
  /** Type PG: smallint */
  ApplicationType: number;
}

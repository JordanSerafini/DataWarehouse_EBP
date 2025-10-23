/**
 * Interface pour la table: EbpSysAsynchronousLog
 * Générée automatiquement le 23/10/2025 09:15:22
 */
export interface EbpSysAsynchronousLog {
  /** Type PG: integer */
  Id: number;
  /** Type PG: character varying | Max length: 20 */
  UserId: string;
  /** Type PG: character varying | Max length: 128 */
  ConnectedMachine: string;
  /** Type PG: timestamp without time zone */
  ExecutionDate: Date;
  /** Type PG: character varying | Max length: 255 */
  Caption: string;
  /** Type PG: smallint */
  ErrorKind: number;
  /** Type PG: text */
  Content?: string;
  /** Type PG: timestamp without time zone */
  sysCreatedDate?: Date;
  /** Type PG: character varying | Max length: 255 */
  sysCreatedUser?: string;
  /** Type PG: timestamp without time zone */
  sysModifiedDate?: Date;
  /** Type PG: character varying | Max length: 255 */
  sysModifiedUser?: string;
}

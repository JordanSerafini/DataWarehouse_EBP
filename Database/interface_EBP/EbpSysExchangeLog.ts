/**
 * Interface pour la table: EbpSysExchangeLog
 * Générée automatiquement le 23/10/2025 09:15:22
 */
export interface EbpSysExchangeLog {
  /** Type PG: uuid */
  Id: string;
  /** Type PG: character varying | Max length: 20 */
  UserId: string;
  /** Type PG: character varying | Max length: 128 */
  ConnectedMachine: string;
  /** Type PG: timestamp without time zone */
  SaveDate: Date;
  /** Type PG: character varying | Max length: 255 */
  Destination: string;
  /** Type PG: text */
  Content?: string;
  /** Type PG: character varying | Max length: 40 */
  ApplicationId: string;
  /** Type PG: character varying | Max length: 20 */
  ApplicationVersion: string;
  /** Type PG: smallint */
  OperationType: number;
}

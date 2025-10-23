/**
 * Interface pour la table: EbpSysSaveLog
 * Générée automatiquement le 23/10/2025 09:15:22
 */
export interface EbpSysSaveLog {
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
  /** Type PG: smallint */
  ProcessType: number;
  /** Type PG: uuid */
  Hash_Hash_ChainedId?: string;
  /** Type PG: bytea */
  Hash_Hash_Hash?: Buffer;
}

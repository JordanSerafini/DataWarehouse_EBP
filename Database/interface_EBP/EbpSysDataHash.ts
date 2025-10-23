/**
 * Interface pour la table: EbpSysDataHash
 * Générée automatiquement le 23/10/2025 09:15:22
 */
export interface EbpSysDataHash {
  /** Type PG: uuid */
  Id: string;
  /** Type PG: timestamp without time zone */
  HashDate: Date;
  /** Type PG: character varying | Max length: 50 */
  Category: string;
  /** Type PG: bytea */
  HashValues?: Buffer;
  /** Type PG: bytea */
  Hash?: Buffer;
}

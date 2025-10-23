/**
 * Interface pour la table: EbpSysSchemaSynchronizationLog
 * Générée automatiquement le 23/10/2025 09:15:22
 */
export interface EbpSysSchemaSynchronizationLog {
  /** Type PG: timestamp without time zone */
  SynchronizationDate: Date;
  /** Type PG: boolean */
  Success: boolean;
  /** Type PG: text */
  Errors?: string;
  /** Type PG: character varying | Max length: 40 */
  SchemaIdBefore?: string;
  /** Type PG: character varying | Max length: 40 */
  SchemaIdAfter?: string;
  /** Type PG: character varying | Max length: 20 */
  SchemaVersionBefore?: string;
  /** Type PG: character varying | Max length: 20 */
  SchemaVersionAfter?: string;
  /** Type PG: character varying | Max length: 20 */
  SystemVersionBefore?: string;
  /** Type PG: character varying | Max length: 20 */
  SystemVersionAfter?: string;
  /** Type PG: character varying | Max length: 40 */
  ApplicationIdBefore?: string;
  /** Type PG: character varying | Max length: 40 */
  ApplicationIdAfter?: string;
  /** Type PG: character varying | Max length: 20 */
  ApplicationVersionBefore?: string;
  /** Type PG: character varying | Max length: 20 */
  ApplicationVersionAfter?: string;
  /** Type PG: text */
  SchemaMetaDataBefore?: string;
}

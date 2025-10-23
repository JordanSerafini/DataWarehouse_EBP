/**
 * Interface pour la table: EventLog
 * Générée automatiquement le 23/10/2025 09:15:22
 */
export interface EventLog {
  /** Type PG: uuid */
  Id: string;
  /** Type PG: character varying | Max length: 250 */
  Caption: string;
  /** Type PG: timestamp without time zone */
  EventDate: Date;
  /** Type PG: integer */
  EventType: number;
  /** Type PG: timestamp without time zone */
  sysCreatedDate?: Date;
  /** Type PG: character varying | Max length: 255 */
  sysCreatedUser?: string;
  /** Type PG: timestamp without time zone */
  sysModifiedDate?: Date;
  /** Type PG: character varying | Max length: 255 */
  sysModifiedUser?: string;
  /** Type PG: text */
  Details?: string;
  /** Type PG: uuid */
  Hash_Hash_ChainedId?: string;
  /** Type PG: bytea */
  Hash_Hash_Hash?: Buffer;
}

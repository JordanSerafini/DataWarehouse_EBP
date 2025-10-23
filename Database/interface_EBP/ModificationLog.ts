/**
 * Interface pour la table: ModificationLog
 * Générée automatiquement le 23/10/2025 09:15:22
 */
export interface ModificationLog {
  /** Type PG: uuid */
  Id: string;
  /** Type PG: character varying | Max length: 200 */
  ModifiedObjectId: string;
  /** Type PG: smallint */
  Type: number;
  /** Type PG: uuid */
  ModificationGroupId?: string;
  /** Type PG: timestamp without time zone */
  sysCreatedDate?: Date;
  /** Type PG: character varying | Max length: 255 */
  sysCreatedUser?: string;
  /** Type PG: timestamp without time zone */
  sysModifiedDate?: Date;
  /** Type PG: character varying | Max length: 255 */
  sysModifiedUser?: string;
}

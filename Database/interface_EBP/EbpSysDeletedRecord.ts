/**
 * Interface pour la table: EbpSysDeletedRecord
 * Générée automatiquement le 23/10/2025 09:15:22
 */
export interface EbpSysDeletedRecord {
  /** Type PG: character varying | Max length: 255 */
  Id: string;
  /** Type PG: uuid */
  UniqueId: string;
  /** Type PG: uuid */
  Kind: string;
  /** Type PG: integer */
  Version: number;
  /** Type PG: timestamp without time zone */
  sysCreatedDate?: Date;
  /** Type PG: character varying | Max length: 255 */
  sysCreatedUser?: string;
  /** Type PG: timestamp without time zone */
  sysModifiedDate?: Date;
  /** Type PG: character varying | Max length: 255 */
  sysModifiedUser?: string;
}

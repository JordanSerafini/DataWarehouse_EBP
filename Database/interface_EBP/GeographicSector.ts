/**
 * Interface pour la table: GeographicSector
 * Générée automatiquement le 23/10/2025 09:15:22
 */
export interface GeographicSector {
  /** Type PG: uuid */
  UniqueId: string;
  /** Type PG: character varying | Max length: 10 */
  Code: string;
  /** Type PG: character varying | Max length: 30 */
  Name: string;
  /** Type PG: character varying | Max length: 40 */
  AnalyticAccounting_GridId?: string;
  /** Type PG: timestamp without time zone */
  sysCreatedDate?: Date;
  /** Type PG: character varying | Max length: 255 */
  sysCreatedUser?: string;
  /** Type PG: timestamp without time zone */
  sysModifiedDate?: Date;
  /** Type PG: character varying | Max length: 255 */
  sysModifiedUser?: string;
  /** Type PG: text */
  NotesClear?: string;
  /** Type PG: text */
  Notes?: string;
  /** Type PG: integer */
  sysRecordVersion?: number;
  /** Type PG: uuid */
  sysRecordVersionId?: string;
}

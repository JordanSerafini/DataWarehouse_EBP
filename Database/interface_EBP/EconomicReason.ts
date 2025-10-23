/**
 * Interface pour la table: EconomicReason
 * Générée automatiquement le 23/10/2025 09:15:22
 */
export interface EconomicReason {
  /** Type PG: character varying | Max length: 3 */
  Id: string;
  /** Type PG: character varying | Max length: 170 */
  Caption: string;
  /** Type PG: uuid */
  UniqueId: string;
  /** Type PG: uuid */
  sysModuleId?: string;
  /** Type PG: uuid */
  sysDatabaseId?: string;
  /** Type PG: integer */
  sysRecordVersion?: number;
  /** Type PG: uuid */
  sysRecordVersionId?: string;
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
}

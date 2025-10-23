/**
 * Interface pour la table: ClassificationGroup
 * Générée automatiquement le 23/10/2025 09:15:22
 */
export interface ClassificationGroup {
  /** Type PG: uuid */
  Id: string;
  /** Type PG: character varying | Max length: 255 */
  Caption: string;
  /** Type PG: smallint */
  GroupType: number;
  /** Type PG: character varying | Max length: 40 */
  AnalyticAccounting_GridId?: string;
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

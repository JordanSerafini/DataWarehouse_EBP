/**
 * Interface pour la table: CommissionScale
 * Générée automatiquement le 23/10/2025 09:15:22
 */
export interface CommissionScale {
  /** Type PG: smallint */
  CSScope: number;
  /** Type PG: smallint */
  ObjectiveType: number;
  /** Type PG: smallint */
  Mode: number;
  /** Type PG: smallint */
  GroupBy: number;
  /** Type PG: uuid */
  UniqueId: string;
  /** Type PG: character varying | Max length: 10 */
  Id: string;
  /** Type PG: character varying | Max length: 40 */
  Caption: string;
  /** Type PG: timestamp without time zone */
  DateBeginning?: Date;
  /** Type PG: timestamp without time zone */
  DateEnd?: Date;
  /** Type PG: integer */
  sysRecordVersion?: number;
  /** Type PG: uuid */
  sysRecordVersionId?: string;
  /** Type PG: integer */
  sysEditCounter?: number;
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

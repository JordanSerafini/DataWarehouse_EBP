/**
 * Interface pour la table: AnalyticPlan
 * Générée automatiquement le 23/10/2025 09:15:22
 */
export interface AnalyticPlan {
  /** Type PG: character varying | Max length: 40 */
  Id: string;
  /** Type PG: integer */
  MaxDepth: number;
  /** Type PG: uuid */
  UniqueId: string;
  /** Type PG: boolean */
  IsActive: boolean;
  /** Type PG: integer */
  sysEditCounter?: number;
  /** Type PG: integer */
  sysRecordVersion?: number;
  /** Type PG: uuid */
  sysRecordVersionId?: string;
  /** Type PG: integer */
  WaitingPlanItemId?: number;
  /** Type PG: character varying | Max length: 50 */
  Label?: string;
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

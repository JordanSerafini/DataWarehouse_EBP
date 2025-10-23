/**
 * Interface pour la table: AnalyticPlanItem
 * Générée automatiquement le 23/10/2025 09:15:22
 */
export interface AnalyticPlanItem {
  /** Type PG: integer */
  Id: number;
  /** Type PG: character varying | Max length: 13 */
  Code: string;
  /** Type PG: character varying | Max length: 40 */
  PlanId: string;
  /** Type PG: boolean */
  IsLeaf: boolean;
  /** Type PG: integer */
  HierarchyLevel: number;
  /** Type PG: boolean */
  IsActive: boolean;
  /** Type PG: uuid */
  UniqueId: string;
  /** Type PG: integer */
  LineOrder: number;
  /** Type PG: character varying | Max length: 50 */
  Label?: string;
  /** Type PG: integer */
  sysRecordVersion?: number;
  /** Type PG: uuid */
  sysRecordVersionId?: string;
  /** Type PG: integer */
  ParentId?: number;
  /** Type PG: character varying | Max length: 169 */
  FullPathCode?: string;
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

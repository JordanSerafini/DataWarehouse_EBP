/**
 * Interface pour la table: WinRangePivotGridTemplate
 * Générée automatiquement le 23/10/2025 09:15:22
 */
export interface WinRangePivotGridTemplate {
  /** Type PG: uuid */
  RangePivotGridId: string;
  /** Type PG: uuid */
  TemplateId: string;
  /** Type PG: character varying | Max length: 100 */
  Label: string;
  /** Type PG: uuid */
  OwningId: string;
  /** Type PG: uuid */
  GridId: string;
  /** Type PG: character varying | Max length: 10 */
  RangeTypeId0?: string;
  /** Type PG: character varying | Max length: 10 */
  RangeTypeId1?: string;
  /** Type PG: character varying | Max length: 10 */
  RangeTypeId2?: string;
  /** Type PG: character varying | Max length: 10 */
  RangeTypeId3?: string;
  /** Type PG: character varying | Max length: 10 */
  RangeTypeId4?: string;
  /** Type PG: text */
  Template?: string;
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
  /** Type PG: character varying | Max length: 20 */
  UserId?: string;
  /** Type PG: character varying | Max length: 20 */
  GroupId?: string;
}

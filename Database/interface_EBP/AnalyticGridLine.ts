/**
 * Interface pour la table: AnalyticGridLine
 * Générée automatiquement le 23/10/2025 09:15:22
 */
export interface AnalyticGridLine {
  /** Type PG: integer */
  Id: number;
  /** Type PG: integer */
  AnalyticPlanItem: number;
  /** Type PG: numeric */
  Percentage: number;
  /** Type PG: character varying | Max length: 40 */
  AnalyticGridId: string;
  /** Type PG: uuid */
  UniqueId: string;
  /** Type PG: timestamp without time zone */
  sysCreatedDate?: Date;
  /** Type PG: character varying | Max length: 255 */
  sysCreatedUser?: string;
  /** Type PG: timestamp without time zone */
  sysModifiedDate?: Date;
  /** Type PG: character varying | Max length: 255 */
  sysModifiedUser?: string;
}

/**
 * Interface pour la table: DealResourcesCost
 * Générée automatiquement le 23/10/2025 09:15:22
 */
export interface DealResourcesCost {
  /** Type PG: numeric */
  PredictedDuration: number;
  /** Type PG: numeric */
  AccomplishedDuration: number;
  /** Type PG: numeric */
  ProfitsOnDuration: number;
  /** Type PG: numeric */
  NetAmountVatExcluded: number;
  /** Type PG: numeric */
  CostAmount: number;
  /** Type PG: numeric */
  PredictedCostamount: number;
  /** Type PG: uuid */
  Id: string;
  /** Type PG: character varying | Max length: 10 */
  DealId?: string;
  /** Type PG: character varying | Max length: 20 */
  ColleagueId?: string;
  /** Type PG: character varying | Max length: 10 */
  EquipmentId?: string;
  /** Type PG: timestamp without time zone */
  sysCreatedDate?: Date;
  /** Type PG: character varying | Max length: 255 */
  sysCreatedUser?: string;
  /** Type PG: timestamp without time zone */
  sysModifiedDate?: Date;
  /** Type PG: character varying | Max length: 255 */
  sysModifiedUser?: string;
  /** Type PG: character varying | Max length: 10 */
  ConstructionSiteId?: string;
}

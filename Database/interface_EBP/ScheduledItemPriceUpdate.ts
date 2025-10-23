/**
 * Interface pour la table: ScheduledItemPriceUpdate
 * Générée automatiquement le 23/10/2025 09:15:22
 */
export interface ScheduledItemPriceUpdate {
  /** Type PG: timestamp without time zone */
  sysCreatedDate?: Date;
  /** Type PG: character varying | Max length: 255 */
  sysCreatedUser?: string;
  /** Type PG: timestamp without time zone */
  sysModifiedDate?: Date;
  /** Type PG: character varying | Max length: 255 */
  sysModifiedUser?: string;
  /** Type PG: uuid */
  Id: string;
  /** Type PG: character varying | Max length: 40 */
  ItemId: string;
  /** Type PG: timestamp without time zone */
  ScheduledUpdateDate: Date;
  /** Type PG: numeric */
  PurchasePrice: number;
  /** Type PG: numeric */
  CostPrice: number;
  /** Type PG: numeric */
  SalePriceVatExcluded: number;
  /** Type PG: numeric */
  SalePriceVatIncluded: number;
  /** Type PG: boolean */
  IsPriceUpdateApplied: boolean;
}

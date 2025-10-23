/**
 * Interface pour la table: TrackingStockItem
 * Générée automatiquement le 23/10/2025 09:15:22
 */
export interface TrackingStockItem {
  /** Type PG: character varying | Max length: 40 */
  ItemId: string;
  /** Type PG: uuid */
  StorehouseId: string;
  /** Type PG: numeric */
  RealStock: number;
  /** Type PG: character varying | Max length: 40 */
  TrackingNumber: string;
  /** Type PG: numeric */
  UnitValue: number;
  /** Type PG: numeric */
  StockValue: number;
  /** Type PG: character varying | Max length: 20 */
  LocationId: string;
  /** Type PG: numeric */
  VirtualStock: number;
  /** Type PG: numeric */
  VirtualUnitValue: number;
  /** Type PG: numeric */
  VirtualStockValue: number;
  /** Type PG: numeric */
  BookedQuantity: number;
  /** Type PG: timestamp without time zone */
  LimitDate?: Date;
  /** Type PG: timestamp without time zone */
  AdjustedLimitDate?: Date;
  /** Type PG: timestamp without time zone */
  sysCreatedDate?: Date;
  /** Type PG: character varying | Max length: 255 */
  sysCreatedUser?: string;
  /** Type PG: timestamp without time zone */
  sysModifiedDate?: Date;
  /** Type PG: character varying | Max length: 255 */
  sysModifiedUser?: string;
  /** Type PG: timestamp without time zone */
  LastMovementDate?: Date;
}

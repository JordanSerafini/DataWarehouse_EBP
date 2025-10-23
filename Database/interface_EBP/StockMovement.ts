/**
 * Interface pour la table: StockMovement
 * Générée automatiquement le 23/10/2025 09:15:22
 */
export interface StockMovement {
  /** Type PG: numeric */
  VirtualUnitCost: number;
  /** Type PG: numeric */
  VirtualCost: number;
  /** Type PG: smallint */
  MovementType: number;
  /** Type PG: integer */
  Id: number;
  /** Type PG: character varying | Max length: 40 */
  ItemId: string;
  /** Type PG: uuid */
  DocumentId: string;
  /** Type PG: uuid */
  DocumentLineId: string;
  /** Type PG: uuid */
  StorehouseId: string;
  /** Type PG: timestamp without time zone */
  DocumentDate: Date;
  /** Type PG: integer */
  DocumentOrder: number;
  /** Type PG: character varying | Max length: 26 */
  DocumentNumber: string;
  /** Type PG: smallint */
  DocumentType: number;
  /** Type PG: smallint */
  DocumentSubType: number;
  /** Type PG: numeric */
  Quantity: number;
  /** Type PG: numeric */
  UnitCost: number;
  /** Type PG: numeric */
  Cost: number;
  /** Type PG: numeric */
  Pump: number;
  /** Type PG: numeric */
  RealStock: number;
  /** Type PG: numeric */
  StockValue: number;
  /** Type PG: boolean */
  UsePumpForSaleReturn: boolean;
  /** Type PG: numeric */
  VirtualStock: number;
  /** Type PG: numeric */
  VirtualPump: number;
  /** Type PG: numeric */
  VirtualStockValue: number;
  /** Type PG: numeric */
  TrackingVirtualStock?: number;
  /** Type PG: numeric */
  TrackingVirtualPump?: number;
  /** Type PG: numeric */
  TrackingVirtualStockValue?: number;
  /** Type PG: integer */
  ReferenceMovementId?: number;
  /** Type PG: numeric */
  StockChargeAmount?: number;
  /** Type PG: timestamp without time zone */
  sysCreatedDate?: Date;
  /** Type PG: character varying | Max length: 255 */
  sysCreatedUser?: string;
  /** Type PG: timestamp without time zone */
  sysModifiedDate?: Date;
  /** Type PG: character varying | Max length: 255 */
  sysModifiedUser?: string;
  /** Type PG: character varying | Max length: 40 */
  TrackingNumber?: string;
  /** Type PG: timestamp without time zone */
  LimitDate?: Date;
  /** Type PG: numeric */
  TrackingRealStock?: number;
  /** Type PG: numeric */
  TrackingPump?: number;
  /** Type PG: numeric */
  TrackingStockValue?: number;
  /** Type PG: character varying | Max length: 20 */
  LocationId?: string;
}

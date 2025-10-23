/**
 * Interface pour la table: StockDocumentLineTrackingDispatch
 * Générée automatiquement le 23/10/2025 09:15:22
 */
export interface StockDocumentLineTrackingDispatch {
  /** Type PG: numeric */
  RemainingQuantity: number;
  /** Type PG: numeric */
  TargetQuantity: number;
  /** Type PG: numeric */
  Quantity: number;
  /** Type PG: integer */
  DispatchIndex: number;
  /** Type PG: uuid */
  Id: string;
  /** Type PG: uuid */
  DocumentLineId: string;
  /** Type PG: character varying | Max length: 40 */
  ItemId: string;
  /** Type PG: uuid */
  StorehouseId: string;
  /** Type PG: character varying | Max length: 40 */
  TrackingNumber?: string;
  /** Type PG: integer */
  StockMovementId?: number;
  /** Type PG: timestamp without time zone */
  LimitDate?: Date;
  /** Type PG: integer */
  TargetStockMovementId?: number;
  /** Type PG: integer */
  GapStockMovementId?: number;
  /** Type PG: integer */
  TransitInputStockMovementId?: number;
  /** Type PG: integer */
  TransitOutputStockMovementId?: number;
  /** Type PG: numeric */
  ReceivedQuantity?: number;
  /** Type PG: numeric */
  Gap?: number;
  /** Type PG: timestamp without time zone */
  sysCreatedDate?: Date;
  /** Type PG: character varying | Max length: 255 */
  sysCreatedUser?: string;
  /** Type PG: timestamp without time zone */
  sysModifiedDate?: Date;
  /** Type PG: character varying | Max length: 255 */
  sysModifiedUser?: string;
  /** Type PG: character varying | Max length: 20 */
  LocationId?: string;
  /** Type PG: character varying | Max length: 20 */
  TransitLocationId?: string;
  /** Type PG: character varying | Max length: 20 */
  TargetLocationId?: string;
  /** Type PG: uuid */
  OriginId?: string;
  /** Type PG: uuid */
  ProgressStateLineTrackingDispatchId?: string;
}

/**
 * Interface pour la table: PurchaseDocumentLineTrackingDispatch
 * Générée automatiquement le 23/10/2025 09:15:22
 */
export interface PurchaseDocumentLineTrackingDispatch {
  /** Type PG: uuid */
  Id: string;
  /** Type PG: uuid */
  DocumentLineId: string;
  /** Type PG: character varying | Max length: 40 */
  ItemId: string;
  /** Type PG: uuid */
  StorehouseId: string;
  /** Type PG: numeric */
  ReturnedQuantity: number;
  /** Type PG: numeric */
  RemainingQuantity: number;
  /** Type PG: numeric */
  ReturnedQuantityByPreviousCreditMemo: number;
  /** Type PG: numeric */
  Quantity: number;
  /** Type PG: integer */
  DispatchIndex: number;
  /** Type PG: numeric */
  DeliveredQuantity: number;
  /** Type PG: timestamp without time zone */
  LimitDate?: Date;
  /** Type PG: numeric */
  OriginQuantity?: number;
  /** Type PG: integer */
  StockMovementId?: number;
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
  /** Type PG: uuid */
  OriginId?: string;
  /** Type PG: character varying | Max length: 20 */
  ReturnOriginLocationId?: string;
  /** Type PG: character varying | Max length: 40 */
  TrackingNumber?: string;
  /** Type PG: numeric */
  RemainingQuantityToDeliverGap?: number;
  /** Type PG: numeric */
  InvoicedQuantity?: number;
}

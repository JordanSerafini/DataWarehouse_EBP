/**
 * Interface pour la table: StockDocumentLine
 * Générée automatiquement le 23/10/2025 09:15:22
 */
export interface StockDocumentLine {
  /** Type PG: boolean */
  BillOfQuantitiesProgram_IsActive: boolean;
  /** Type PG: boolean */
  FixedQuantity: boolean;
  /** Type PG: boolean */
  Booked: boolean;
  /** Type PG: boolean */
  StockBookingAllowed: boolean;
  /** Type PG: boolean */
  ToInvoice: boolean;
  /** Type PG: smallint */
  TargetLocation_MultiLocationMode: number;
  /** Type PG: smallint */
  TransitLocation_MultiLocationMode: number;
  /** Type PG: integer */
  PhaseLevel: number;
  /** Type PG: boolean */
  UpdateComponentsStockInFabrication: boolean;
  /** Type PG: uuid */
  Id: string;
  /** Type PG: uuid */
  DocumentId: string;
  /** Type PG: smallint */
  LineType: number;
  /** Type PG: integer */
  LineOrder: number;
  /** Type PG: boolean */
  IsReferencedItem: boolean;
  /** Type PG: numeric */
  Quantity: number;
  /** Type PG: numeric */
  RealQuantity: number;
  /** Type PG: boolean */
  ManageStock: boolean;
  /** Type PG: integer */
  NomenclatureLevel: number;
  /** Type PG: smallint */
  IsPrintable: number;
  /** Type PG: smallint */
  QuantityDecimalNumber: number;
  /** Type PG: smallint */
  PricesDecimalNumber: number;
  /** Type PG: boolean */
  IsManagedByCountermark: boolean;
  /** Type PG: boolean */
  IsCountermarkInitiated: boolean;
  /** Type PG: numeric */
  Volume: number;
  /** Type PG: numeric */
  TotalVolume: number;
  /** Type PG: boolean */
  HasTrackingDispatch: boolean;
  /** Type PG: numeric */
  Weight: number;
  /** Type PG: numeric */
  TotalWeight: number;
  /** Type PG: numeric */
  ItemValue: number;
  /** Type PG: numeric */
  TotalValue: number;
  /** Type PG: numeric */
  CurrentStock: number;
  /** Type PG: numeric */
  NewTotalValue: number;
  /** Type PG: numeric */
  AccountingNewTotalValue: number;
  /** Type PG: boolean */
  ExistingTrackingNumber: boolean;
  /** Type PG: boolean */
  TrackingMasterLine: boolean;
  /** Type PG: numeric */
  PreviousTotalValue: number;
  /** Type PG: smallint */
  Location_MultiLocationMode: number;
  /** Type PG: boolean */
  MustProcessOriginQuantity: boolean;
  /** Type PG: character varying | Max length: 10 */
  DealId?: string;
  /** Type PG: character varying | Max length: 20 */
  TransitLocation_LocationId?: string;
  /** Type PG: numeric */
  Gap?: number;
  /** Type PG: numeric */
  JustificationQuantity1?: number;
  /** Type PG: numeric */
  JustificationQuantity2?: number;
  /** Type PG: numeric */
  JustificationQuantity3?: number;
  /** Type PG: numeric */
  JustificationQuantity4?: number;
  /** Type PG: numeric */
  JustificationQuantity5?: number;
  /** Type PG: uuid */
  TargetStorehouseId?: string;
  /** Type PG: numeric */
  ReceivedQuantity?: number;
  /** Type PG: integer */
  TargetStockMovementId?: number;
  /** Type PG: numeric */
  StockChargeAmount?: number;
  /** Type PG: integer */
  GapStockMovementId?: number;
  /** Type PG: uuid */
  OriginLineId?: string;
  /** Type PG: numeric */
  RemainingQuantity?: number;
  /** Type PG: numeric */
  TargetQuantity?: number;
  /** Type PG: integer */
  TransitInputStockMovementId?: number;
  /** Type PG: integer */
  TransitOutputStockMovementId?: number;
  /** Type PG: character varying | Max length: 50 */
  LocationCaption?: string;
  /** Type PG: character varying | Max length: 40 */
  UnitCaption?: string;
  /** Type PG: character varying | Max length: 80 */
  Commentary?: string;
  /** Type PG: numeric */
  NewPump?: number;
  /** Type PG: numeric */
  CurrentPump?: number;
  /** Type PG: character varying | Max length: 4 */
  WeightUnitId?: string;
  /** Type PG: timestamp without time zone */
  LimitDate?: Date;
  /** Type PG: character varying | Max length: 4 */
  VolumeUnitId?: string;
  /** Type PG: character varying | Max length: 40 */
  TrackingNumber?: string;
  /** Type PG: character varying | Max length: 4 */
  UnitId?: string;
  /** Type PG: uuid */
  StorehouseId?: string;
  /** Type PG: integer */
  StockMovementId?: number;
  /** Type PG: text */
  Description?: string;
  /** Type PG: text */
  DescriptionClear?: string;
  /** Type PG: character varying | Max length: 40 */
  ItemId?: string;
  /** Type PG: uuid */
  ParentLineId?: string;
  /** Type PG: uuid */
  TopParentLineId?: string;
  /** Type PG: timestamp without time zone */
  sysCreatedDate?: Date;
  /** Type PG: character varying | Max length: 255 */
  sysCreatedUser?: string;
  /** Type PG: timestamp without time zone */
  sysModifiedDate?: Date;
  /** Type PG: character varying | Max length: 255 */
  sysModifiedUser?: string;
  /** Type PG: character varying | Max length: 20 */
  Location_LocationId?: string;
  /** Type PG: character varying | Max length: 20 */
  TargetLocation_LocationId?: string;
  /** Type PG: character varying | Max length: 40 */
  RangeItemId?: string;
  /** Type PG: character varying | Max length: 8 */
  MaintenanceContractId?: string;
  /** Type PG: character varying | Max length: 8 */
  GuaranteeTypeId?: string;
  /** Type PG: character varying | Max length: 8 */
  IncidentId?: string;
  /** Type PG: uuid */
  InvoiceLineId?: string;
  /** Type PG: character varying | Max length: 8 */
  CustomerProductId?: string;
  /** Type PG: text */
  BillOfQuantitiesProgram_Program?: string;
  /** Type PG: text */
  TechnicalDescription?: string;
  /** Type PG: text */
  TechnicalDescriptionClear?: string;
  /** Type PG: uuid */
  ExecutionQuoteLineId?: string;
  /** Type PG: uuid */
  ProgressDocumentLineId?: string;
  /** Type PG: boolean */
  ExcludeFixedQuantityForPrice: boolean;
}

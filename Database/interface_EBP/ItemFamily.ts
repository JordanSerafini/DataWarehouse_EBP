/**
 * Interface pour la table: ItemFamily
 * Générée automatiquement le 23/10/2025 09:15:22
 */
export interface ItemFamily {
  /** Type PG: boolean */
  BillOfQuantitiesProgram_KeepActiveFromQuoteToOrder: boolean;
  /** Type PG: boolean */
  SaleUnitPriceProgram_KeepActiveFromQuoteToOrder: boolean;
  /** Type PG: uuid */
  UniqueId: string;
  /** Type PG: character varying | Max length: 10 */
  Id: string;
  /** Type PG: character varying | Max length: 40 */
  Caption: string;
  /** Type PG: boolean */
  ManageStock: boolean;
  /** Type PG: smallint */
  TrackingMode: number;
  /** Type PG: smallint */
  LimitDateMode: number;
  /** Type PG: smallint */
  LimitDateSafetyDelay: number;
  /** Type PG: smallint */
  LimitDateSafetyDelayMode: number;
  /** Type PG: boolean */
  AllowNegativeStock: boolean;
  /** Type PG: smallint */
  PriceDecimalNumber: number;
  /** Type PG: boolean */
  AllowPublishOnWeb: boolean;
  /** Type PG: boolean */
  IsManagedByCountermark: boolean;
  /** Type PG: boolean */
  IsCounterMarkForced: boolean;
  /** Type PG: boolean */
  NotOnMarket: boolean;
  /** Type PG: boolean */
  PurchaseBillOfQuantitiesProgram_KeepActiveFromQuoteToOrder: boolean;
  /** Type PG: boolean */
  PurchaseUnitPriceProgram_KeepActiveFromQuoteToOrder: boolean;
  /** Type PG: boolean */
  CreateCustomerProductInCustomerPark: boolean;
  /** Type PG: boolean */
  StockBookingAllowed: boolean;
  /** Type PG: boolean */
  AutomaticStockBooking: boolean;
  /** Type PG: boolean */
  StockBillOfQuantitiesProgram_KeepActiveFromQuoteToOrder: boolean;
  /** Type PG: character varying | Max length: 11 */
  EcotaxFurnitureId?: string;
  /** Type PG: text */
  PurchaseUnitPriceProgram_Program?: string;
  /** Type PG: character varying | Max length: 40 */
  AnalyticAccounting_GridId?: string;
  /** Type PG: uuid */
  VatId?: string;
  /** Type PG: character varying | Max length: 20 */
  MainIntervener?: string;
  /** Type PG: numeric */
  InterestRate?: number;
  /** Type PG: numeric */
  ChargeRate?: number;
  /** Type PG: character varying | Max length: 8 */
  EcotaxId?: string;
  /** Type PG: smallint */
  NotPrintable?: number;
  /** Type PG: smallint */
  NotIncluded?: number;
  /** Type PG: smallint */
  IsFixedPrice?: number;
  /** Type PG: character varying | Max length: 20 */
  SupplierId?: string;
  /** Type PG: character varying | Max length: 20 */
  LocationId?: string;
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
  /** Type PG: integer */
  sysRecordVersion?: number;
  /** Type PG: uuid */
  sysRecordVersionId?: string;
  /** Type PG: integer */
  sysEditCounter?: number;
  /** Type PG: text */
  BillOfQuantitiesProgram_Program?: string;
  /** Type PG: text */
  SaleUnitPriceProgram_Program?: string;
  /** Type PG: uuid */
  StorehouseId?: string;
  /** Type PG: text */
  PurchaseBillOfQuantitiesProgram_Program?: string;
  /** Type PG: character varying | Max length: 8 */
  GuaranteeTypeId?: string;
  /** Type PG: text */
  StockBillOfQuantitiesProgram_Program?: string;
  /** Type PG: smallint */
  ExtraFeeDistributionIndex?: number;
  /** Type PG: boolean */
  PickMovementDisallowedOnTotallyBookedItem: boolean;
  /** Type PG: smallint */
  ExcludedFromFooterDiscount?: number;
  /** Type PG: smallint */
  ExcludedFromFinancialDiscount?: number;
  /** Type PG: smallint */
  PurchasePriceUpdateType?: number;
  /** Type PG: boolean */
  Sustainable: boolean;
  /** Type PG: boolean */
  IsEligibleMealVoucher: boolean;
  /** Type PG: boolean */
  IsEligibleTakeawaySale: boolean;
}

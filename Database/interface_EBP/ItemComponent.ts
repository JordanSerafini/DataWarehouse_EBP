/**
 * Interface pour la table: ItemComponent
 * Générée automatiquement le 23/10/2025 09:15:22
 */
export interface ItemComponent {
  /** Type PG: boolean */
  ExcludeFixedQuantityForPrice: boolean;
  /** Type PG: boolean */
  BillOfQuantitiesProgram_KeepActiveFromQuoteToOrder: boolean;
  /** Type PG: uuid */
  Id: string;
  /** Type PG: character varying | Max length: 40 */
  ItemId: string;
  /** Type PG: boolean */
  CreateCustomerProductInCustomerPark: boolean;
  /** Type PG: boolean */
  NotIncluded: boolean;
  /** Type PG: boolean */
  SaleUnitPriceProgram_KeepActiveFromQuoteToOrder: boolean;
  /** Type PG: boolean */
  UpdateComponentsStockInFabrication: boolean;
  /** Type PG: boolean */
  PurchaseUnitPriceProgram_KeepActiveFromQuoteToOrder: boolean;
  /** Type PG: boolean */
  PurchaseBillOfQuantitiesProgram_KeepActiveFromQuoteToOrder: boolean;
  /** Type PG: integer */
  ComponentOrder: number;
  /** Type PG: numeric */
  Quantity: number;
  /** Type PG: numeric */
  DispatchedPurchasePrice: number;
  /** Type PG: numeric */
  DispatchedCostPrice: number;
  /** Type PG: numeric */
  DispatchedSalePriceVatExcluded: number;
  /** Type PG: numeric */
  DispatchedSalePriceVatIncluded: number;
  /** Type PG: boolean */
  FixedQuantity: boolean;
  /** Type PG: numeric */
  PurchasePricePercentage: number;
  /** Type PG: numeric */
  CostPricePercentage: number;
  /** Type PG: numeric */
  SalePriceVatExcludedPercentage: number;
  /** Type PG: boolean */
  IncludeToRecursiveReplenishment: boolean;
  /** Type PG: boolean */
  StockBillOfQuantitiesProgram_KeepActiveFromQuoteToOrder: boolean;
  /** Type PG: boolean */
  MustProcessOriginQuantity: boolean;
  /** Type PG: character varying | Max length: 8 */
  GuaranteeTypeId?: string;
  /** Type PG: numeric */
  FreePercentage?: number;
  /** Type PG: text */
  PurchaseUnitPriceProgram_Program?: string;
  /** Type PG: timestamp without time zone */
  sysCreatedDate?: Date;
  /** Type PG: character varying | Max length: 255 */
  sysCreatedUser?: string;
  /** Type PG: timestamp without time zone */
  sysModifiedDate?: Date;
  /** Type PG: character varying | Max length: 255 */
  sysModifiedUser?: string;
  /** Type PG: text */
  BillOfQuantitiesProgram_Program?: string;
  /** Type PG: text */
  SaleUnitPriceProgram_Program?: string;
  /** Type PG: text */
  PurchaseBillOfQuantitiesProgram_Program?: string;
  /** Type PG: character varying | Max length: 40 */
  ParentRangeItemId?: string;
  /** Type PG: character varying | Max length: 40 */
  ParentItemId?: string;
  /** Type PG: text */
  StockBillOfQuantitiesProgram_Program?: string;
}

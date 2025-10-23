/**
 * Interface pour la table: SupplierItem
 * Générée automatiquement le 23/10/2025 09:15:22
 */
export interface SupplierItem {
  /** Type PG: boolean */
  UseEcotax: boolean;
  /** Type PG: numeric */
  CurrencyPublicPurchasePrice: number;
  /** Type PG: numeric */
  CurrencyDiscountAmount: number;
  /** Type PG: uuid */
  Id: string;
  /** Type PG: character varying | Max length: 20 */
  SupplierId: string;
  /** Type PG: boolean */
  MainSupplier: boolean;
  /** Type PG: numeric */
  PurchaseOrderMinimumQuantity: number;
  /** Type PG: numeric */
  PurchaseOrderMultipleQuantity: number;
  /** Type PG: numeric */
  SalePurchaseConversionRate: number;
  /** Type PG: numeric */
  PublicPurchasePrice: number;
  /** Type PG: numeric */
  DiscountRate: number;
  /** Type PG: numeric */
  DiscountAmount: number;
  /** Type PG: numeric */
  NetPurchasePrice: number;
  /** Type PG: integer */
  DeliveryDelay: number;
  /** Type PG: timestamp without time zone */
  PriceModifiedDate: Date;
  /** Type PG: boolean */
  SetItemPurchasePriceWithNetPurchasePrice: boolean;
  /** Type PG: numeric */
  DiscountRateOnAdvisedSalePrice: number;
  /** Type PG: numeric */
  DiscountAmountOnAdvisedSalePrice: number;
  /** Type PG: boolean */
  IsPurchasePriceLinkedToAdvisedSalePrice: boolean;
  /** Type PG: numeric */
  CurrencyNetPurchasePrice: number;
  /** Type PG: character varying | Max length: 4 */
  PurchaseUnitId?: string;
  /** Type PG: timestamp without time zone */
  sysCreatedDate?: Date;
  /** Type PG: character varying | Max length: 255 */
  sysCreatedUser?: string;
  /** Type PG: timestamp without time zone */
  sysModifiedDate?: Date;
  /** Type PG: character varying | Max length: 255 */
  sysModifiedUser?: string;
  /** Type PG: uuid */
  ReferenceId?: string;
  /** Type PG: character varying | Max length: 8 */
  EcotaxId?: string;
  /** Type PG: character varying | Max length: 40 */
  RangeItemId?: string;
  /** Type PG: character varying | Max length: 80 */
  Caption?: string;
  /** Type PG: character varying | Max length: 40 */
  ItemId?: string;
  /** Type PG: smallint */
  SupplierPriceType: number;
  /** Type PG: boolean */
  MainSubContractor: boolean;
}

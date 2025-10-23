/**
 * Interface pour la table: DealPurchaseDocumentLine
 * Générée automatiquement le 23/10/2025 09:15:22
 */
export interface DealPurchaseDocumentLine {
  /** Type PG: smallint */
  QuantityDecimalNumber: number;
  /** Type PG: smallint */
  PricesDecimalNumber: number;
  /** Type PG: boolean */
  IncludeAmountInCost: boolean;
  /** Type PG: numeric */
  PurchasePrice: number;
  /** Type PG: numeric */
  Quantity: number;
  /** Type PG: numeric */
  GrossInterestBase: number;
  /** Type PG: uuid */
  Id: string;
  /** Type PG: smallint */
  LineType: number;
  /** Type PG: integer */
  LineOrder: number;
  /** Type PG: uuid */
  DocumentId: string;
  /** Type PG: numeric */
  IncludedAmount: number;
  /** Type PG: text */
  DescriptionClear?: string;
  /** Type PG: character varying | Max length: 40 */
  ItemId?: string;
  /** Type PG: timestamp without time zone */
  sysCreatedDate?: Date;
  /** Type PG: character varying | Max length: 255 */
  sysCreatedUser?: string;
  /** Type PG: timestamp without time zone */
  sysModifiedDate?: Date;
  /** Type PG: character varying | Max length: 255 */
  sysModifiedUser?: string;
  /** Type PG: uuid */
  ParentLineId?: string;
  /** Type PG: numeric */
  AmountVatExcluded?: number;
  /** Type PG: numeric */
  NetAmountVatExcludedWithDiscount?: number;
  /** Type PG: numeric */
  NetAmountVatIncludedWithDiscount?: number;
  /** Type PG: character varying | Max length: 10 */
  DealId?: string;
  /** Type PG: uuid */
  DocumentLineId?: string;
  /** Type PG: text */
  TechnicalDescriptionClear?: string;
  /** Type PG: character varying | Max length: 10 */
  ConstructionSiteId?: string;
  /** Type PG: boolean */
  HasCostDispatch: boolean;
  /** Type PG: numeric */
  QuantityToInclude: number;
  /** Type PG: numeric */
  CostAmount: number;
}

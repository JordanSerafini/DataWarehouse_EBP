/**
 * Interface pour la table: Vat
 * Générée automatiquement le 23/10/2025 09:15:22
 */
export interface Vat {
  /** Type PG: uuid */
  Id: string;
  /** Type PG: uuid */
  TerritorialityId: string;
  /** Type PG: numeric */
  Rate: number;
  /** Type PG: numeric */
  RERate: number;
  /** Type PG: boolean */
  TerritorialityDefaultRate: boolean;
  /** Type PG: boolean */
  Inactive: boolean;
  /** Type PG: boolean */
  Npr: boolean;
  /** Type PG: character varying | Max length: 20 */
  SellingCollectionVatAccount?: string;
  /** Type PG: character varying | Max length: 20 */
  SellingDebitVatAccount?: string;
  /** Type PG: character varying | Max length: 20 */
  SellingGoodsAccount?: string;
  /** Type PG: character varying | Max length: 20 */
  SellingServicesAccount?: string;
  /** Type PG: character varying | Max length: 20 */
  SellingShippingAccount?: string;
  /** Type PG: character varying | Max length: 20 */
  SellingEcotaxAccount?: string;
  /** Type PG: character varying | Max length: 20 */
  PurchaseCollectionVatAccount?: string;
  /** Type PG: character varying | Max length: 20 */
  PurchaseDebitVatAccount?: string;
  /** Type PG: character varying | Max length: 20 */
  PurchaseGoodsAccount?: string;
  /** Type PG: character varying | Max length: 20 */
  PurchaseServicesAccount?: string;
  /** Type PG: character varying | Max length: 20 */
  PurchaseShippingAccount?: string;
  /** Type PG: character varying | Max length: 20 */
  REAccount?: string;
  /** Type PG: integer */
  sysRecordVersion?: number;
  /** Type PG: uuid */
  sysRecordVersionId?: string;
  /** Type PG: character varying | Max length: 60 */
  Description?: string;
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
  /** Type PG: character varying | Max length: 20 */
  PurchaseEcotaxAccount?: string;
  /** Type PG: character varying | Max length: 20 */
  SellingEcotaxFurnitureAccount?: string;
  /** Type PG: character varying | Max length: 20 */
  PurchaseEcotaxFurnitureAccount?: string;
  /** Type PG: character varying | Max length: 20 */
  SellingInvoicingChargesAccount?: string;
  /** Type PG: character varying | Max length: 20 */
  PurchaseInvoicingChargesAccount?: string;
  /** Type PG: character varying | Max length: 20 */
  GoodsReverseChargeAccount?: string;
  /** Type PG: character varying | Max length: 20 */
  ServicesReverseChargeAccount?: string;
  /** Type PG: character varying | Max length: 20 */
  SubContractorCollectionVatAccount?: string;
  /** Type PG: character varying | Max length: 20 */
  SubContractorDebitVatAccount?: string;
  /** Type PG: character varying | Max length: 20 */
  SubContractorGoodsAccount?: string;
  /** Type PG: character varying | Max length: 20 */
  SubContractorServicesAccount?: string;
  /** Type PG: character varying | Max length: 20 */
  SubContractorShippingAccount?: string;
  /** Type PG: character varying | Max length: 20 */
  SubContractorInvoicingChargesAccount?: string;
  /** Type PG: character varying | Max length: 20 */
  SubContractorEcotaxAccount?: string;
  /** Type PG: character varying | Max length: 20 */
  SubContractorEcotaxFurnitureAccount?: string;
  /** Type PG: character varying | Max length: 20 */
  GoodsReverseChargeSubContractorAccount?: string;
  /** Type PG: character varying | Max length: 20 */
  ServicesReverseChargeSubContractorAccount?: string;
  /** Type PG: character varying | Max length: 20 */
  TaxableBaseAccount?: string;
  /** Type PG: character varying | Max length: 20 */
  NonTaxableBaseAccount?: string;
  /** Type PG: numeric */
  DeterminedItemNatureRate?: number;
  /** Type PG: numeric */
  UndeterminedItemNatureRate?: number;
}

/**
 * Interface pour la table: SupplierFamily
 * Générée automatiquement le 23/10/2025 09:15:22
 */
export interface SupplierFamily {
  /** Type PG: smallint */
  VatMode: number;
  /** Type PG: numeric */
  IRPFRate: number;
  /** Type PG: uuid */
  UniqueId: string;
  /** Type PG: character varying | Max length: 10 */
  Id: string;
  /** Type PG: character varying | Max length: 40 */
  Caption: string;
  /** Type PG: numeric */
  DiscountRate: number;
  /** Type PG: numeric */
  FinancialDiscountRate: number;
  /** Type PG: numeric */
  SecondDiscountRate: number;
  /** Type PG: numeric */
  InvoicingChargesAmount: number;
  /** Type PG: uuid */
  InvoicingChargesVatId?: string;
  /** Type PG: integer */
  SchedulerColor?: number;
  /** Type PG: character varying | Max length: 8 */
  PriceListCategoryId?: string;
  /** Type PG: character varying | Max length: 6 */
  SettlementModeId?: string;
  /** Type PG: smallint */
  PaymentDate?: number;
  /** Type PG: character varying | Max length: 20 */
  ColleagueId?: string;
  /** Type PG: character varying | Max length: 2 */
  DocumentSerialId?: string;
  /** Type PG: character varying | Max length: 40 */
  AnalyticAccounting_GridId?: string;
  /** Type PG: uuid */
  TerritorialityId?: string;
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
  sysEditCounter?: number;
  /** Type PG: integer */
  sysRecordVersion?: number;
  /** Type PG: uuid */
  sysRecordVersionId?: string;
  /** Type PG: character varying | Max length: 8 */
  ShippingId?: string;
  /** Type PG: uuid */
  TaxIds0?: string;
  /** Type PG: uuid */
  TaxIds1?: string;
  /** Type PG: uuid */
  TaxIds2?: string;
}

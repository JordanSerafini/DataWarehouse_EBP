/**
 * Interface pour la table: SubTaxTerritoriality
 * Générée automatiquement le 23/10/2025 09:15:22
 */
export interface SubTaxTerritoriality {
  /** Type PG: uuid */
  Id: string;
  /** Type PG: uuid */
  TerritorialityId: string;
  /** Type PG: uuid */
  TaxId: string;
  /** Type PG: boolean */
  ForSale: boolean;
  /** Type PG: boolean */
  ForPurchase: boolean;
  /** Type PG: character varying | Max length: 20 */
  SaleAccount?: string;
  /** Type PG: character varying | Max length: 20 */
  PurchaseAccount?: string;
  /** Type PG: timestamp without time zone */
  sysCreatedDate?: Date;
  /** Type PG: character varying | Max length: 255 */
  sysCreatedUser?: string;
  /** Type PG: timestamp without time zone */
  sysModifiedDate?: Date;
  /** Type PG: character varying | Max length: 255 */
  sysModifiedUser?: string;
  /** Type PG: uuid */
  VatId?: string;
}

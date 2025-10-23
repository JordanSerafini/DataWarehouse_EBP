/**
 * Interface pour la table: PurchaseDocumentComplementaryDiscount
 * Générée automatiquement le 23/10/2025 09:15:22
 */
export interface PurchaseDocumentComplementaryDiscount {
  /** Type PG: numeric */
  Rate: number;
  /** Type PG: numeric */
  Amount: number;
  /** Type PG: uuid */
  Id: string;
  /** Type PG: uuid */
  DocumentId: string;
  /** Type PG: integer */
  LineOrder: number;
  /** Type PG: numeric */
  CurrencyAmount: number;
  /** Type PG: character varying | Max length: 10 */
  Code?: string;
  /** Type PG: character varying | Max length: 30 */
  Caption?: string;
  /** Type PG: smallint */
  DiscountType?: number;
  /** Type PG: timestamp without time zone */
  sysCreatedDate?: Date;
  /** Type PG: character varying | Max length: 255 */
  sysCreatedUser?: string;
  /** Type PG: timestamp without time zone */
  sysModifiedDate?: Date;
  /** Type PG: character varying | Max length: 255 */
  sysModifiedUser?: string;
  /** Type PG: uuid */
  DocumentReferenceOriginComplementaryDiscountId?: string;
  /** Type PG: boolean */
  IsPriceListDiscount: boolean;
}

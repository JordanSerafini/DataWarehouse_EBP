/**
 * Interface pour la table: LinkedItem
 * Générée automatiquement le 23/10/2025 09:15:22
 */
export interface LinkedItem {
  /** Type PG: boolean */
  IsProportional: boolean;
  /** Type PG: boolean */
  OfferForSale: boolean;
  /** Type PG: uuid */
  Id: string;
  /** Type PG: character varying | Max length: 40 */
  LinkedItemId: string;
  /** Type PG: integer */
  LineOrder: number;
  /** Type PG: numeric */
  Quantity: number;
  /** Type PG: boolean */
  IsFree: boolean;
  /** Type PG: boolean */
  OfferForPurchase: boolean;
  /** Type PG: smallint */
  DocumentType: number;
  /** Type PG: timestamp without time zone */
  sysCreatedDate?: Date;
  /** Type PG: character varying | Max length: 255 */
  sysCreatedUser?: string;
  /** Type PG: timestamp without time zone */
  sysModifiedDate?: Date;
  /** Type PG: character varying | Max length: 255 */
  sysModifiedUser?: string;
  /** Type PG: character varying | Max length: 40 */
  ItemId?: string;
  /** Type PG: character varying | Max length: 40 */
  RangeItemId?: string;
}

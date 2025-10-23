/**
 * Interface pour la table: DiscountCouponBarCode
 * Générée automatiquement le 23/10/2025 09:15:22
 */
export interface DiscountCouponBarCode {
  /** Type PG: uuid */
  Id: string;
  /** Type PG: character varying | Max length: 40 */
  BarCodeId: string;
  /** Type PG: character varying | Max length: 8 */
  DiscountCouponId: string;
  /** Type PG: timestamp without time zone */
  IssuedDate: Date;
  /** Type PG: boolean */
  Used: boolean;
  /** Type PG: timestamp without time zone */
  UsedDate?: Date;
  /** Type PG: uuid */
  UsedDocumentId?: string;
  /** Type PG: uuid */
  ComplementaryDiscountId?: string;
  /** Type PG: uuid */
  IssuedDocumentId?: string;
  /** Type PG: timestamp without time zone */
  sysCreatedDate?: Date;
  /** Type PG: character varying | Max length: 255 */
  sysCreatedUser?: string;
  /** Type PG: timestamp without time zone */
  sysModifiedDate?: Date;
  /** Type PG: character varying | Max length: 255 */
  sysModifiedUser?: string;
}

/**
 * Interface pour la table: DiscountCoupon
 * Générée automatiquement le 23/10/2025 09:15:22
 */
export interface DiscountCoupon {
  /** Type PG: character varying | Max length: 8 */
  Id: string;
  /** Type PG: character varying | Max length: 150 */
  Caption: string;
  /** Type PG: character varying | Max length: 40 */
  BarCode: string;
  /** Type PG: boolean */
  UseSameBarCode: boolean;
  /** Type PG: integer */
  IssuedCounter: number;
  /** Type PG: integer */
  UsedCounter: number;
  /** Type PG: character varying | Max length: 10 */
  PriceListId: string;
  /** Type PG: text */
  Commentary?: string;
  /** Type PG: integer */
  sysEditCounter?: number;
  /** Type PG: timestamp without time zone */
  PrintAvaliableDateFrom?: Date;
  /** Type PG: timestamp without time zone */
  PrintAvaliableDateTo?: Date;
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
}

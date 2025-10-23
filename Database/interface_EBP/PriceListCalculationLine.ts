/**
 * Interface pour la table: PriceListCalculationLine
 * Générée automatiquement le 23/10/2025 09:15:22
 */
export interface PriceListCalculationLine {
  /** Type PG: smallint */
  FreeType: number;
  /** Type PG: uuid */
  Id: string;
  /** Type PG: character varying | Max length: 10 */
  PriceListId: string;
  /** Type PG: numeric */
  Threshold: number;
  /** Type PG: integer */
  CalculationType: number;
  /** Type PG: numeric */
  DiscountValue: number;
  /** Type PG: numeric */
  PriceValue?: number;
  /** Type PG: uuid */
  VatId?: string;
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
  /** Type PG: character varying | Max length: 40 */
  FreeItemId?: string;
  /** Type PG: numeric */
  FreeQuantity?: number;
  /** Type PG: character varying | Max length: 40 */
  RangeItemId?: string;
  /** Type PG: uuid */
  RoundId?: string;
}

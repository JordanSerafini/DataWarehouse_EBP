/**
 * Interface pour la table: CustomerAdvantage
 * Générée automatiquement le 23/10/2025 09:15:22
 */
export interface CustomerAdvantage {
  /** Type PG: character varying | Max length: 20 */
  Id: string;
  /** Type PG: character varying | Max length: 20 */
  CustomerId: string;
  /** Type PG: timestamp without time zone */
  AdvantageDate: Date;
  /** Type PG: smallint */
  AdvantageState: number;
  /** Type PG: numeric */
  ThresholdValue: number;
  /** Type PG: timestamp without time zone */
  ExpiryDate?: Date;
  /** Type PG: uuid */
  CreatedByDocumentId?: string;
  /** Type PG: uuid */
  UsedInDocumentId?: string;
  /** Type PG: uuid */
  AppliedToDiscountId?: string;
  /** Type PG: character varying | Max length: 40 */
  FreeItemId?: string;
  /** Type PG: uuid */
  LoyaltyCalculationLineId?: string;
  /** Type PG: timestamp without time zone */
  sysCreatedDate?: Date;
  /** Type PG: character varying | Max length: 255 */
  sysCreatedUser?: string;
  /** Type PG: timestamp without time zone */
  sysModifiedDate?: Date;
  /** Type PG: character varying | Max length: 255 */
  sysModifiedUser?: string;
  /** Type PG: numeric */
  DiscountOnCumulativeTurnover: number;
  /** Type PG: numeric */
  CumulativeTurnover: number;
}

/**
 * Interface pour la table: CustomerSubscription
 * Générée automatiquement le 23/10/2025 09:15:22
 */
export interface CustomerSubscription {
  /** Type PG: timestamp without time zone */
  sysCreatedDate?: Date;
  /** Type PG: character varying | Max length: 255 */
  sysCreatedUser?: string;
  /** Type PG: timestamp without time zone */
  sysModifiedDate?: Date;
  /** Type PG: character varying | Max length: 255 */
  sysModifiedUser?: string;
  /** Type PG: character varying | Max length: 20 */
  Id: string;
  /** Type PG: character varying | Max length: 20 */
  CustomerId: string;
  /** Type PG: character varying | Max length: 40 */
  SubscriptionId: string;
  /** Type PG: timestamp without time zone */
  ExpiryDate: Date;
  /** Type PG: smallint */
  TotalPassingsAllowed: number;
  /** Type PG: smallint */
  RemainingPassings: number;
  /** Type PG: uuid */
  SaleDocumentLineId?: string;
  /** Type PG: numeric */
  SalePriceVatIncluded: number;
  /** Type PG: smallint */
  SubscriptionState: number;
}

/**
 * Interface pour la table: DealPurchaseDocumentLineCostDispatch
 * Générée automatiquement le 23/10/2025 09:15:22
 */
export interface DealPurchaseDocumentLineCostDispatch {
  /** Type PG: timestamp without time zone */
  sysCreatedDate?: Date;
  /** Type PG: character varying | Max length: 255 */
  sysCreatedUser?: string;
  /** Type PG: timestamp without time zone */
  sysModifiedDate?: Date;
  /** Type PG: character varying | Max length: 255 */
  sysModifiedUser?: string;
  /** Type PG: uuid */
  Id: string;
  /** Type PG: uuid */
  DealDocumentLineId?: string;
  /** Type PG: character varying | Max length: 10 */
  DealId?: string;
  /** Type PG: character varying | Max length: 10 */
  ConstructionSiteId?: string;
  /** Type PG: uuid */
  ExecutionQuoteLineId: string;
  /** Type PG: uuid */
  DocumentLineId: string;
  /** Type PG: smallint */
  QuantityDecimalNumber: number;
  /** Type PG: numeric */
  QuantityToInclude: number;
  /** Type PG: boolean */
  QuantityUserModified: boolean;
  /** Type PG: numeric */
  IncludedAmount: number;
}

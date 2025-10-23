/**
 * Interface pour la table: DealStockDocument
 * Générée automatiquement le 23/10/2025 09:15:22
 */
export interface DealStockDocument {
  /** Type PG: boolean */
  IncludeAmountInCost: boolean;
  /** Type PG: numeric */
  Amount: number;
  /** Type PG: numeric */
  IncludedAmount: number;
  /** Type PG: uuid */
  Id: string;
  /** Type PG: uuid */
  DocumentId: string;
  /** Type PG: character varying | Max length: 26 */
  DocumentNumber: string;
  /** Type PG: timestamp without time zone */
  DocumentDate: Date;
  /** Type PG: smallint */
  DocumentType: number;
  /** Type PG: uuid */
  StorehouseId: string;
  /** Type PG: uuid */
  TargetStorehouseId?: string;
  /** Type PG: uuid */
  TransferedDocumentId?: string;
  /** Type PG: character varying | Max length: 10 */
  DealId?: string;
  /** Type PG: timestamp without time zone */
  sysCreatedDate?: Date;
  /** Type PG: character varying | Max length: 255 */
  sysCreatedUser?: string;
  /** Type PG: timestamp without time zone */
  sysModifiedDate?: Date;
  /** Type PG: character varying | Max length: 255 */
  sysModifiedUser?: string;
  /** Type PG: character varying | Max length: 10 */
  ConstructionSiteId?: string;
  /** Type PG: boolean */
  CreatedFromConstructionSiteConsumptions: boolean;
  /** Type PG: smallint */
  PickStockOperationType?: number;
  /** Type PG: integer */
  DocumentEditCounter?: number;
}

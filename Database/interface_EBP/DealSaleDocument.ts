/**
 * Interface pour la table: DealSaleDocument
 * Générée automatiquement le 23/10/2025 09:15:22
 */
export interface DealSaleDocument {
  /** Type PG: uuid */
  Id: string;
  /** Type PG: uuid */
  DocumentId: string;
  /** Type PG: character varying | Max length: 30 */
  DocumentNumber: string;
  /** Type PG: timestamp without time zone */
  DocumentDate: Date;
  /** Type PG: smallint */
  InvoiceCorrectionType: number;
  /** Type PG: smallint */
  DocumentType: number;
  /** Type PG: character varying | Max length: 20 */
  CustomerId: string;
  /** Type PG: character varying | Max length: 60 */
  CustomerName: string;
  /** Type PG: character varying | Max length: 20 */
  ColleagueId?: string;
  /** Type PG: numeric */
  NetInterestAmount?: number;
  /** Type PG: numeric */
  GrossInterestAmount?: number;
  /** Type PG: numeric */
  InterestAmount?: number;
  /** Type PG: integer */
  DocumentState?: number;
  /** Type PG: uuid */
  TransferedDocumentId?: string;
  /** Type PG: numeric */
  AmountVatExcluded?: number;
  /** Type PG: numeric */
  NetAmountVatExcludedWithDiscount?: number;
  /** Type PG: numeric */
  DocumentTotalAmountVatExcludedWithDiscount?: number;
  /** Type PG: numeric */
  NetAmountVatIncludedWithDiscount?: number;
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
  /** Type PG: numeric */
  AchievedDuration?: number;
  /** Type PG: numeric */
  ExpectedDuration?: number;
  /** Type PG: numeric */
  ToScheduleDuration?: number;
  /** Type PG: numeric */
  InvoicableAchievedDuration?: number;
  /** Type PG: numeric */
  InvoicableExpectedDuration?: number;
  /** Type PG: numeric */
  InvoicableToScheduleDuration?: number;
  /** Type PG: character varying | Max length: 10 */
  ConstructionSiteId?: string;
  /** Type PG: character varying | Max length: 100 */
  GlobalDocumentState?: string;
  /** Type PG: boolean */
  IsReferenceDocument?: boolean;
  /** Type PG: integer */
  DocumentEditCounter?: number;
}

/**
 * Interface pour la table: RecoveredDocument
 * Générée automatiquement le 23/10/2025 09:15:22
 */
export interface RecoveredDocument {
  /** Type PG: uuid */
  Id: string;
  /** Type PG: character varying | Max length: 24 */
  DocumentNumber: string;
  /** Type PG: character varying | Max length: 14 */
  NumberPrefix: string;
  /** Type PG: character varying | Max length: 10 */
  NumberSuffix: string;
  /** Type PG: timestamp without time zone */
  DocumentDate: Date;
  /** Type PG: smallint */
  DocumentType: number;
  /** Type PG: smallint */
  DocumentSubType: number;
  /** Type PG: character varying | Max length: 60 */
  ThirdName: string;
  /** Type PG: numeric */
  AmountVatExcluded: number;
  /** Type PG: numeric */
  VatAmount: number;
  /** Type PG: numeric */
  AmountVatIncluded: number;
  /** Type PG: smallint */
  RecoveredFrom: number;
  /** Type PG: character varying | Max length: 20 */
  CustomerId?: string;
  /** Type PG: character varying | Max length: 20 */
  SupplierId?: string;
  /** Type PG: integer */
  sysEditCounter?: number;
  /** Type PG: smallint */
  SaleDocumentSubType?: number;
  /** Type PG: smallint */
  PurchaseDocumentSubType?: number;
  /** Type PG: timestamp without time zone */
  sysCreatedDate?: Date;
  /** Type PG: character varying | Max length: 255 */
  sysCreatedUser?: string;
  /** Type PG: timestamp without time zone */
  sysModifiedDate?: Date;
  /** Type PG: character varying | Max length: 255 */
  sysModifiedUser?: string;
}

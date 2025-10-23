/**
 * Interface pour la table: CustomerCustomReport
 * Générée automatiquement le 23/10/2025 09:15:22
 */
export interface CustomerCustomReport {
  /** Type PG: uuid */
  Id: string;
  /** Type PG: smallint */
  DocumentSubType: number;
  /** Type PG: integer */
  NumberOfCopies: number;
  /** Type PG: character varying | Max length: 20 */
  ParentId: string;
  /** Type PG: smallint */
  PriceTaxeBased: number;
  /** Type PG: uuid */
  ReportId?: string;
  /** Type PG: timestamp without time zone */
  sysCreatedDate?: Date;
  /** Type PG: character varying | Max length: 255 */
  sysCreatedUser?: string;
  /** Type PG: timestamp without time zone */
  sysModifiedDate?: Date;
  /** Type PG: character varying | Max length: 255 */
  sysModifiedUser?: string;
}

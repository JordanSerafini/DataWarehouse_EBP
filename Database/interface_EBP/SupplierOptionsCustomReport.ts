/**
 * Interface pour la table: SupplierOptionsCustomReport
 * Générée automatiquement le 23/10/2025 09:15:22
 */
export interface SupplierOptionsCustomReport {
  /** Type PG: uuid */
  Id: string;
  /** Type PG: smallint */
  DocumentSubType: number;
  /** Type PG: integer */
  NumberOfCopies: number;
  /** Type PG: timestamp without time zone */
  sysCreatedDate?: Date;
  /** Type PG: character varying | Max length: 255 */
  sysCreatedUser?: string;
  /** Type PG: timestamp without time zone */
  sysModifiedDate?: Date;
  /** Type PG: character varying | Max length: 255 */
  sysModifiedUser?: string;
}

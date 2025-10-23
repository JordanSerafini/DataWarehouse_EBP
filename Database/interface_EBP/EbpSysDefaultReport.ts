/**
 * Interface pour la table: EbpSysDefaultReport
 * Générée automatiquement le 23/10/2025 09:15:22
 */
export interface EbpSysDefaultReport {
  /** Type PG: uuid */
  Id: string;
  /** Type PG: uuid */
  ReportCategoryId: string;
  /** Type PG: smallint */
  ElementType: number;
  /** Type PG: uuid */
  ReportId: string;
  /** Type PG: integer */
  NumberOfCopies: number;
  /** Type PG: character varying | Max length: 3 */
  ReportLanguage: string;
  /** Type PG: timestamp without time zone */
  sysCreatedDate?: Date;
  /** Type PG: character varying | Max length: 255 */
  sysCreatedUser?: string;
  /** Type PG: timestamp without time zone */
  sysModifiedDate?: Date;
  /** Type PG: character varying | Max length: 255 */
  sysModifiedUser?: string;
}

/**
 * Interface pour la table: EbpSysReportTagAssociation
 * Générée automatiquement le 23/10/2025 09:15:22
 */
export interface EbpSysReportTagAssociation {
  /** Type PG: uuid */
  TagId: string;
  /** Type PG: uuid */
  ReportId: string;
  /** Type PG: timestamp without time zone */
  sysCreatedDate?: Date;
  /** Type PG: character varying | Max length: 255 */
  sysCreatedUser?: string;
  /** Type PG: timestamp without time zone */
  sysModifiedDate?: Date;
  /** Type PG: character varying | Max length: 255 */
  sysModifiedUser?: string;
}

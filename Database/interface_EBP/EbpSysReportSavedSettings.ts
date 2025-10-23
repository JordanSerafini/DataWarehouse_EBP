/**
 * Interface pour la table: EbpSysReportSavedSettings
 * Générée automatiquement le 23/10/2025 09:15:22
 */
export interface EbpSysReportSavedSettings {
  /** Type PG: uuid */
  Id: string;
  /** Type PG: character varying | Max length: 200 */
  Label: string;
  /** Type PG: uuid */
  ReportCategoryId: string;
  /** Type PG: text */
  SettingsData: string;
  /** Type PG: boolean */
  IsDefault: boolean;
  /** Type PG: timestamp without time zone */
  sysCreatedDate?: Date;
  /** Type PG: character varying | Max length: 255 */
  sysCreatedUser?: string;
  /** Type PG: timestamp without time zone */
  sysModifiedDate?: Date;
  /** Type PG: character varying | Max length: 255 */
  sysModifiedUser?: string;
}

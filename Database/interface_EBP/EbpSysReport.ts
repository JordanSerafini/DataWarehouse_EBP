/**
 * Interface pour la table: EbpSysReport
 * Générée automatiquement le 23/10/2025 09:15:22
 */
export interface EbpSysReport {
  /** Type PG: character varying | Max length: 3 */
  ReportLanguage: string;
  /** Type PG: boolean */
  IsVisible: boolean;
  /** Type PG: boolean */
  IsTemplate: boolean;
  /** Type PG: uuid */
  Id: string;
  /** Type PG: uuid */
  CategoryId: string;
  /** Type PG: character varying | Max length: 200 */
  Label: string;
  /** Type PG: text */
  Description: string;
  /** Type PG: boolean */
  IsSystem: boolean;
  /** Type PG: integer */
  PrintCount: number;
  /** Type PG: timestamp without time zone */
  ReportModifiedDate?: Date;
  /** Type PG: smallint */
  ReportDesignState?: number;
  /** Type PG: uuid */
  DesignerId?: string;
  /** Type PG: text */
  DesignerInfo?: string;
  /** Type PG: bytea */
  Report?: Buffer;
  /** Type PG: bytea */
  Thumbnail?: Buffer;
  /** Type PG: uuid */
  LevelId?: string;
  /** Type PG: timestamp without time zone */
  sysCreatedDate?: Date;
  /** Type PG: character varying | Max length: 255 */
  sysCreatedUser?: string;
  /** Type PG: timestamp without time zone */
  sysModifiedDate?: Date;
  /** Type PG: character varying | Max length: 255 */
  sysModifiedUser?: string;
  /** Type PG: uuid */
  ExtensionId?: string;
  /** Type PG: integer */
  Version: number;
}

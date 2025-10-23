/**
 * Interface pour la table: OlapTemplateTable
 * Générée automatiquement le 23/10/2025 09:15:22
 */
export interface OlapTemplateTable {
  /** Type PG: boolean */
  UserSetting_SaveFilters: boolean;
  /** Type PG: smallint */
  UserSetting_ChartTitlePosition: number;
  /** Type PG: smallint */
  UserSetting_ChartType: number;
  /** Type PG: boolean */
  UserSetting_DisplayHeader: boolean;
  /** Type PG: uuid */
  TemplateId: string;
  /** Type PG: character varying | Max length: 100 */
  Label: string;
  /** Type PG: text */
  Template: string;
  /** Type PG: boolean */
  IsSystem: boolean;
  /** Type PG: boolean */
  UserSetting_DisplayFooter: boolean;
  /** Type PG: boolean */
  UserSetting_DisplayGrid: boolean;
  /** Type PG: boolean */
  UserSetting_DisplayChart: boolean;
  /** Type PG: boolean */
  UserSetting_DisplayChartInFullPage: boolean;
  /** Type PG: integer */
  UserSetting_LeftMargin: number;
  /** Type PG: integer */
  UserSetting_RightMargin: number;
  /** Type PG: integer */
  UserSetting_TopMargin: number;
  /** Type PG: integer */
  UserSetting_BottomMargin: number;
  /** Type PG: boolean */
  UserSetting_Landscape: boolean;
  /** Type PG: smallint */
  UserSetting_PaperKind: number;
  /** Type PG: text */
  UserSetting_Watermark?: string;
  /** Type PG: bytea */
  UserSetting_GridCollapseState?: Buffer;
  /** Type PG: text */
  UserSetting_FooterText?: string;
  /** Type PG: text */
  Description?: string;
  /** Type PG: character varying | Max length: 50 */
  AssociatedCube?: string;
  /** Type PG: timestamp without time zone */
  sysCreatedDate?: Date;
  /** Type PG: character varying | Max length: 255 */
  sysCreatedUser?: string;
  /** Type PG: timestamp without time zone */
  sysModifiedDate?: Date;
  /** Type PG: character varying | Max length: 255 */
  sysModifiedUser?: string;
  /** Type PG: uuid */
  CategoryId?: string;
  /** Type PG: character varying | Max length: 100 */
  UserSetting_GridTitle?: string;
  /** Type PG: character varying | Max length: 100 */
  UserSetting_ChartTitle?: string;
  /** Type PG: text */
  UserSetting_HeaderText?: string;
  /** Type PG: bytea */
  UserSetting_FilterValues?: Buffer;
}

/**
 * Interface pour la table: EbpSysAutoTreeCategory
 * Générée automatiquement le 23/10/2025 09:15:22
 */
export interface EbpSysAutoTreeCategory {
  /** Type PG: boolean */
  Visible: boolean;
  /** Type PG: character varying | Max length: 36 */
  ListId: string;
  /** Type PG: character varying | Max length: 128 */
  ViewNamespace: string;
  /** Type PG: character varying | Max length: 128 */
  TreeCategoryName: string;
  /** Type PG: integer */
  TreeCategoryKey: number;
  /** Type PG: character varying | Max length: 80 */
  FirstFilter: string;
  /** Type PG: character varying | Max length: 80 */
  SecondFilter?: string;
  /** Type PG: timestamp without time zone */
  sysCreatedDate?: Date;
  /** Type PG: character varying | Max length: 255 */
  sysCreatedUser?: string;
  /** Type PG: timestamp without time zone */
  sysModifiedDate?: Date;
  /** Type PG: character varying | Max length: 255 */
  sysModifiedUser?: string;
}

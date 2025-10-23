/**
 * Interface pour la table: EbpSysCustomTreeCategory
 * Générée automatiquement le 23/10/2025 09:15:22
 */
export interface EbpSysCustomTreeCategory {
  /** Type PG: character varying | Max length: 36 */
  ListId: string;
  /** Type PG: character varying | Max length: 128 */
  ViewNamespace: string;
  /** Type PG: character varying | Max length: 128 */
  TreeCategoryName: string;
  /** Type PG: character varying | Max length: 3 */
  TreeCategoryKey: string;
  /** Type PG: character varying | Max length: 27 */
  ParentId?: string;
  /** Type PG: timestamp without time zone */
  sysCreatedDate?: Date;
  /** Type PG: character varying | Max length: 255 */
  sysCreatedUser?: string;
  /** Type PG: timestamp without time zone */
  sysModifiedDate?: Date;
  /** Type PG: character varying | Max length: 255 */
  sysModifiedUser?: string;
  /** Type PG: uuid */
  Id: string;
}

/**
 * Interface pour la table: ConstructionSiteAssociatedFiles
 * Générée automatiquement le 23/10/2025 09:15:22
 */
export interface ConstructionSiteAssociatedFiles {
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
  /** Type PG: character varying | Max length: 10 */
  ParentId: string;
  /** Type PG: character varying | Max length: 255 */
  Name: string;
  /** Type PG: bytea */
  Content?: Buffer;
  /** Type PG: smallint */
  DocumentType: number;
  /** Type PG: integer */
  sysEditCounter?: number;
  /** Type PG: text */
  OneDriveShareUrl?: string;
  /** Type PG: text */
  OneDriveItemId?: string;
  /** Type PG: text */
  OneDriveCode?: string;
  /** Type PG: character varying | Max length: 255 */
  TypeMime?: string;
  /** Type PG: smallint */
  StorageType: number;
}

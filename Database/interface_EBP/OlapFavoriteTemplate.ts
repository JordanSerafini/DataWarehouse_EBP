/**
 * Interface pour la table: OlapFavoriteTemplate
 * Générée automatiquement le 23/10/2025 09:15:22
 */
export interface OlapFavoriteTemplate {
  /** Type PG: uuid */
  TemplateId: string;
  /** Type PG: timestamp without time zone */
  sysCreatedDate?: Date;
  /** Type PG: character varying | Max length: 255 */
  sysCreatedUser?: string;
  /** Type PG: timestamp without time zone */
  sysModifiedDate?: Date;
  /** Type PG: character varying | Max length: 255 */
  sysModifiedUser?: string;
}

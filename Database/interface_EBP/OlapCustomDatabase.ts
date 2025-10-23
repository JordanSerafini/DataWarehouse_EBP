/**
 * Interface pour la table: OlapCustomDatabase
 * Générée automatiquement le 23/10/2025 09:15:22
 */
export interface OlapCustomDatabase {
  /** Type PG: character varying | Max length: 100 */
  Id: string;
  /** Type PG: text */
  Xml: string;
  /** Type PG: timestamp without time zone */
  sysCreatedDate?: Date;
  /** Type PG: character varying | Max length: 255 */
  sysCreatedUser?: string;
  /** Type PG: timestamp without time zone */
  sysModifiedDate?: Date;
  /** Type PG: character varying | Max length: 255 */
  sysModifiedUser?: string;
}

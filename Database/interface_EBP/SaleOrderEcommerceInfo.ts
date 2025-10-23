/**
 * Interface pour la table: SaleOrderEcommerceInfo
 * Générée automatiquement le 23/10/2025 09:15:22
 */
export interface SaleOrderEcommerceInfo {
  /** Type PG: uuid */
  Id: string;
  /** Type PG: uuid */
  ParentId: string;
  /** Type PG: character varying | Max length: 255 */
  InfoKey: string;
  /** Type PG: text */
  InfoValue?: string;
  /** Type PG: timestamp without time zone */
  sysCreatedDate?: Date;
  /** Type PG: character varying | Max length: 255 */
  sysCreatedUser?: string;
  /** Type PG: timestamp without time zone */
  sysModifiedDate?: Date;
  /** Type PG: character varying | Max length: 255 */
  sysModifiedUser?: string;
}

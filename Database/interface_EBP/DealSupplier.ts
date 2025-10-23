/**
 * Interface pour la table: DealSupplier
 * Générée automatiquement le 23/10/2025 09:15:22
 */
export interface DealSupplier {
  /** Type PG: boolean */
  IsAutoLoaded: boolean;
  /** Type PG: uuid */
  Id: string;
  /** Type PG: character varying | Max length: 20 */
  ThirdId: string;
  /** Type PG: character varying | Max length: 60 */
  Name: string;
  /** Type PG: numeric */
  Turnover: number;
  /** Type PG: timestamp without time zone */
  sysCreatedDate?: Date;
  /** Type PG: character varying | Max length: 255 */
  sysCreatedUser?: string;
  /** Type PG: timestamp without time zone */
  sysModifiedDate?: Date;
  /** Type PG: character varying | Max length: 255 */
  sysModifiedUser?: string;
  /** Type PG: character varying | Max length: 10 */
  DealId?: string;
  /** Type PG: character varying | Max length: 10 */
  ConstructionSiteId?: string;
}

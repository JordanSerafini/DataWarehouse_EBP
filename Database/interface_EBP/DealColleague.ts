/**
 * Interface pour la table: DealColleague
 * Générée automatiquement le 23/10/2025 09:15:22
 */
export interface DealColleague {
  /** Type PG: boolean */
  InvoiceDefault: boolean;
  /** Type PG: boolean */
  IsAutoLoaded: boolean;
  /** Type PG: uuid */
  Id: string;
  /** Type PG: character varying | Max length: 20 */
  ColleagueId: string;
  /** Type PG: character varying | Max length: 10 */
  DealId?: string;
  /** Type PG: character varying | Max length: 60 */
  LastName?: string;
  /** Type PG: character varying | Max length: 60 */
  FirstName?: string;
  /** Type PG: timestamp without time zone */
  sysCreatedDate?: Date;
  /** Type PG: character varying | Max length: 255 */
  sysCreatedUser?: string;
  /** Type PG: timestamp without time zone */
  sysModifiedDate?: Date;
  /** Type PG: character varying | Max length: 255 */
  sysModifiedUser?: string;
  /** Type PG: character varying | Max length: 10 */
  ConstructionSiteId?: string;
}

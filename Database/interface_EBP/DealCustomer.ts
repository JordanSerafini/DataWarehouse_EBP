/**
 * Interface pour la table: DealCustomer
 * Générée automatiquement le 23/10/2025 09:15:22
 */
export interface DealCustomer {
  /** Type PG: boolean */
  InvoiceDefault: boolean;
  /** Type PG: uuid */
  Id: string;
  /** Type PG: character varying | Max length: 20 */
  ThirdId: string;
  /** Type PG: character varying | Max length: 60 */
  Name: string;
  /** Type PG: numeric */
  Turnover: number;
  /** Type PG: smallint */
  Type: number;
  /** Type PG: boolean */
  IsAutoLoaded: boolean;
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

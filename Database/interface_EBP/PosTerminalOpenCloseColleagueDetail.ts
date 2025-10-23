/**
 * Interface pour la table: PosTerminalOpenCloseColleagueDetail
 * Générée automatiquement le 23/10/2025 09:15:22
 */
export interface PosTerminalOpenCloseColleagueDetail {
  /** Type PG: integer */
  PosReceiptCount: number;
  /** Type PG: numeric */
  NetSalesVatIncluded: number;
  /** Type PG: numeric */
  AverageBasket: number;
  /** Type PG: boolean */
  Positive: boolean;
  /** Type PG: uuid */
  Id: string;
  /** Type PG: uuid */
  ParentId: string;
  /** Type PG: character varying | Max length: 20 */
  ColleagueId?: string;
  /** Type PG: timestamp without time zone */
  sysCreatedDate?: Date;
  /** Type PG: character varying | Max length: 255 */
  sysCreatedUser?: string;
  /** Type PG: timestamp without time zone */
  sysModifiedDate?: Date;
  /** Type PG: character varying | Max length: 255 */
  sysModifiedUser?: string;
}

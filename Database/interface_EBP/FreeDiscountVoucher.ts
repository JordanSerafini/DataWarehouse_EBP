/**
 * Interface pour la table: FreeDiscountVoucher
 * Générée automatiquement le 23/10/2025 09:15:22
 */
export interface FreeDiscountVoucher {
  /** Type PG: timestamp without time zone */
  sysCreatedDate?: Date;
  /** Type PG: character varying | Max length: 255 */
  sysCreatedUser?: string;
  /** Type PG: timestamp without time zone */
  sysModifiedDate?: Date;
  /** Type PG: character varying | Max length: 255 */
  sysModifiedUser?: string;
  /** Type PG: character varying | Max length: 8 */
  Id: string;
  /** Type PG: character varying | Max length: 8 */
  CampaignId: string;
  /** Type PG: smallint */
  Status: number;
  /** Type PG: uuid */
  DocumentId?: string;
}

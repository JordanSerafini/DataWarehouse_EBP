/**
 * Interface pour la table: DealSaleSettlement
 * Générée automatiquement le 23/10/2025 09:15:22
 */
export interface DealSaleSettlement {
  /** Type PG: boolean */
  IsDeposit: boolean;
  /** Type PG: uuid */
  Id: string;
  /** Type PG: uuid */
  SettlementId: string;
  /** Type PG: character varying | Max length: 20 */
  ThirdId: string;
  /** Type PG: character varying | Max length: 60 */
  ThirdName: string;
  /** Type PG: timestamp without time zone */
  SettlementDate: Date;
  /** Type PG: character varying | Max length: 6 */
  PaymentTypeId: string;
  /** Type PG: numeric */
  Amount: number;
  /** Type PG: character varying | Max length: 10 */
  DealId?: string;
  /** Type PG: uuid */
  DepositLastAttachedDocumentId?: string;
  /** Type PG: smallint */
  DepositLastAttachedDocumentType?: number;
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

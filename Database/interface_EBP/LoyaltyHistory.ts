/**
 * Interface pour la table: LoyaltyHistory
 * Générée automatiquement le 23/10/2025 09:15:22
 */
export interface LoyaltyHistory {
  /** Type PG: uuid */
  Id: string;
  /** Type PG: numeric */
  LoyaltyValue: number;
  /** Type PG: boolean */
  IsInitialized: boolean;
  /** Type PG: boolean */
  IsOriginReport: boolean;
  /** Type PG: character varying | Max length: 20 */
  CustomerId?: string;
  /** Type PG: uuid */
  DocumentId?: string;
  /** Type PG: character varying | Max length: 10 */
  LoyaltyCardTypeId?: string;
  /** Type PG: timestamp without time zone */
  sysCreatedDate?: Date;
  /** Type PG: character varying | Max length: 255 */
  sysCreatedUser?: string;
  /** Type PG: timestamp without time zone */
  sysModifiedDate?: Date;
  /** Type PG: character varying | Max length: 255 */
  sysModifiedUser?: string;
  /** Type PG: numeric */
  LoyaltyTurnover: number;
}

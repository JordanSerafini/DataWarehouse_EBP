/**
 * Interface pour la table: LoyaltyCalculationLine
 * Générée automatiquement le 23/10/2025 09:15:22
 */
export interface LoyaltyCalculationLine {
  /** Type PG: uuid */
  Id: string;
  /** Type PG: character varying | Max length: 10 */
  LoyaltyId: string;
  /** Type PG: numeric */
  Threshold: number;
  /** Type PG: smallint */
  AdvantageType: number;
  /** Type PG: numeric */
  AdvantageValue?: number;
  /** Type PG: text */
  FreeItemId?: string;
  /** Type PG: text */
  FreeItemFamilyId?: string;
  /** Type PG: timestamp without time zone */
  sysCreatedDate?: Date;
  /** Type PG: character varying | Max length: 255 */
  sysCreatedUser?: string;
  /** Type PG: timestamp without time zone */
  sysModifiedDate?: Date;
  /** Type PG: character varying | Max length: 255 */
  sysModifiedUser?: string;
}

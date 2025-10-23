/**
 * Interface pour la table: LoyaltyInclusionLine
 * Générée automatiquement le 23/10/2025 09:15:22
 */
export interface LoyaltyInclusionLine {
  /** Type PG: boolean */
  IsExcluded: boolean;
  /** Type PG: integer */
  InclusionOrder: number;
  /** Type PG: character varying | Max length: 10 */
  LoyaltyId: string;
  /** Type PG: uuid */
  Id: string;
  /** Type PG: smallint */
  InclusionType: number;
  /** Type PG: character varying | Max length: 40 */
  StartElementId?: string;
  /** Type PG: character varying | Max length: 40 */
  EndElementId?: string;
  /** Type PG: timestamp without time zone */
  sysCreatedDate?: Date;
  /** Type PG: character varying | Max length: 255 */
  sysCreatedUser?: string;
  /** Type PG: timestamp without time zone */
  sysModifiedDate?: Date;
  /** Type PG: character varying | Max length: 255 */
  sysModifiedUser?: string;
  /** Type PG: character varying | Max length: 10 */
  RangeTypeId?: string;
}

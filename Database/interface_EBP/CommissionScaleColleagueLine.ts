/**
 * Interface pour la table: CommissionScaleColleagueLine
 * Générée automatiquement le 23/10/2025 09:15:22
 */
export interface CommissionScaleColleagueLine {
  /** Type PG: integer */
  CommissionOrder: number;
  /** Type PG: uuid */
  Id: string;
  /** Type PG: character varying | Max length: 10 */
  CommissionScaleId: string;
  /** Type PG: character varying | Max length: 20 */
  ColleagueId?: string;
  /** Type PG: character varying | Max length: 10 */
  ColleagueFamilyId?: string;
  /** Type PG: timestamp without time zone */
  sysCreatedDate?: Date;
  /** Type PG: character varying | Max length: 255 */
  sysCreatedUser?: string;
  /** Type PG: timestamp without time zone */
  sysModifiedDate?: Date;
  /** Type PG: character varying | Max length: 255 */
  sysModifiedUser?: string;
}

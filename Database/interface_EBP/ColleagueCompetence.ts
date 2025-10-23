/**
 * Interface pour la table: ColleagueCompetence
 * Générée automatiquement le 23/10/2025 09:15:22
 */
export interface ColleagueCompetence {
  /** Type PG: timestamp without time zone */
  sysCreatedDate?: Date;
  /** Type PG: character varying | Max length: 255 */
  sysCreatedUser?: string;
  /** Type PG: timestamp without time zone */
  sysModifiedDate?: Date;
  /** Type PG: character varying | Max length: 255 */
  sysModifiedUser?: string;
  /** Type PG: uuid */
  Id: string;
  /** Type PG: character varying | Max length: 20 */
  ColleagueId: string;
  /** Type PG: character varying | Max length: 8 */
  CompetenceId: string;
  /** Type PG: timestamp without time zone */
  StartDate?: Date;
  /** Type PG: timestamp without time zone */
  EndDate?: Date;
  /** Type PG: integer */
  Threshold: number;
  /** Type PG: timestamp without time zone */
  AlertDate?: Date;
  /** Type PG: integer */
  ComptetenceValidityDuration?: number;
  /** Type PG: integer */
  CompetenceOrder: number;
}

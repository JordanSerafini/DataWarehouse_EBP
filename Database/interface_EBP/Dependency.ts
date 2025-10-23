/**
 * Interface pour la table: Dependency
 * Générée automatiquement le 23/10/2025 09:15:22
 */
export interface Dependency {
  /** Type PG: timestamp without time zone */
  sysCreatedDate?: Date;
  /** Type PG: character varying | Max length: 255 */
  sysCreatedUser?: string;
  /** Type PG: timestamp without time zone */
  sysModifiedDate?: Date;
  /** Type PG: character varying | Max length: 255 */
  sysModifiedUser?: string;
  /** Type PG: character varying | Max length: 10 */
  Id: string;
  /** Type PG: character varying | Max length: 50 */
  Caption?: string;
  /** Type PG: smallint */
  DependencyType: number;
  /** Type PG: numeric */
  Lag_DurationInHours?: number;
  /** Type PG: numeric */
  Lag_Duration?: number;
  /** Type PG: character varying | Max length: 4 */
  Lag_UnitId?: string;
  /** Type PG: character varying | Max length: 30 */
  Lag_EditedDuration?: string;
  /** Type PG: uuid */
  PredecessorId: string;
  /** Type PG: uuid */
  SuccessorId: string;
}

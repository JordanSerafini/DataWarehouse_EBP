/**
 * Interface pour la table: ScheduleEventTemplate
 * Générée automatiquement le 23/10/2025 09:15:22
 */
export interface ScheduleEventTemplate {
  /** Type PG: character varying | Max length: 8 */
  Id: string;
  /** Type PG: character varying | Max length: 40 */
  Caption: string;
  /** Type PG: numeric */
  WorkingDuration_DurationInHours?: number;
  /** Type PG: character varying | Max length: 8 */
  TravelExpenseId?: string;
  /** Type PG: uuid */
  ScheduleEventTypeId?: string;
  /** Type PG: integer */
  sysEditCounter?: number;
  /** Type PG: text */
  Description?: string;
  /** Type PG: text */
  DescriptionClear?: string;
  /** Type PG: timestamp without time zone */
  sysCreatedDate?: Date;
  /** Type PG: character varying | Max length: 255 */
  sysCreatedUser?: string;
  /** Type PG: timestamp without time zone */
  sysModifiedDate?: Date;
  /** Type PG: character varying | Max length: 255 */
  sysModifiedUser?: string;
  /** Type PG: text */
  NotesClear?: string;
  /** Type PG: text */
  Notes?: string;
  /** Type PG: numeric */
  WorkingDuration_Duration?: number;
  /** Type PG: character varying | Max length: 4 */
  WorkingDuration_UnitId?: string;
  /** Type PG: character varying | Max length: 30 */
  WorkingDuration_EditedDuration?: string;
}

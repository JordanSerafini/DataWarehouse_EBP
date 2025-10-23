/**
 * Interface pour la table: ScheduleEventExpectedResource
 * Générée automatiquement le 23/10/2025 09:15:22
 */
export interface ScheduleEventExpectedResource {
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
  /** Type PG: uuid */
  ParentId: string;
  /** Type PG: character varying | Max length: 8 */
  CompetenceId?: string;
  /** Type PG: character varying | Max length: 9 */
  EquipmentTypeId?: string;
  /** Type PG: integer */
  QuantityToSchedule: number;
  /** Type PG: numeric */
  ExpectedDuration_DurationInHours?: number;
  /** Type PG: numeric */
  ExpectedDuration_Duration?: number;
  /** Type PG: character varying | Max length: 4 */
  ExpectedDuration_UnitId?: string;
  /** Type PG: character varying | Max length: 30 */
  ExpectedDuration_EditedDuration?: string;
  /** Type PG: integer */
  ScheduledQuantity: number;
  /** Type PG: numeric */
  ScheduledDuration_DurationInHours?: number;
  /** Type PG: numeric */
  ScheduledDuration_Duration?: number;
  /** Type PG: character varying | Max length: 4 */
  ScheduledDuration_UnitId?: string;
  /** Type PG: character varying | Max length: 30 */
  ScheduledDuration_EditedDuration?: string;
  /** Type PG: boolean */
  CreatedBySoftware: boolean;
}

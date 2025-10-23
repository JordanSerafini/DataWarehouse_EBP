/**
 * Interface pour la table: ScheduleEventTemplateExpectedResource
 * Générée automatiquement le 23/10/2025 09:15:22
 */
export interface ScheduleEventTemplateExpectedResource {
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
  /** Type PG: character varying | Max length: 8 */
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
}

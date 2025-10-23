/**
 * Interface pour la table: Equipment
 * Générée automatiquement le 23/10/2025 09:15:22
 */
export interface Equipment {
  /** Type PG: character varying | Max length: 10 */
  Id: string;
  /** Type PG: character varying | Max length: 40 */
  Caption: string;
  /** Type PG: numeric */
  SalePriceVatExcluded: number;
  /** Type PG: character varying | Max length: 40 */
  ReferenceItemId?: string;
  /** Type PG: character varying | Max length: 10 */
  FamilyId?: string;
  /** Type PG: integer */
  sysEditCounter?: number;
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
  /** Type PG: character varying | Max length: 9 */
  EquipmentTypeId?: string;
  /** Type PG: character varying | Max length: 8 */
  CompetenceId?: string;
  /** Type PG: numeric */
  HourlyCostPrice: number;
}

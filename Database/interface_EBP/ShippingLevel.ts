/**
 * Interface pour la table: ShippingLevel
 * Générée automatiquement le 23/10/2025 09:15:22
 */
export interface ShippingLevel {
  /** Type PG: uuid */
  Id: string;
  /** Type PG: character varying | Max length: 8 */
  ShippingId: string;
  /** Type PG: numeric */
  Threshold: number;
  /** Type PG: numeric */
  LevelValue: number;
  /** Type PG: timestamp without time zone */
  sysCreatedDate?: Date;
  /** Type PG: character varying | Max length: 255 */
  sysCreatedUser?: string;
  /** Type PG: timestamp without time zone */
  sysModifiedDate?: Date;
  /** Type PG: character varying | Max length: 255 */
  sysModifiedUser?: string;
  /** Type PG: smallint */
  LevelValueType: number;
}

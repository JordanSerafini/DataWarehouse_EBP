/**
 * Interface pour la table: EbpSysDashboardPart
 * Générée automatiquement le 23/10/2025 09:15:22
 */
export interface EbpSysDashboardPart {
  /** Type PG: uuid */
  Id: string;
  /** Type PG: uuid */
  DashboardId: string;
  /** Type PG: uuid */
  PartId: string;
  /** Type PG: uuid */
  PartInstanceId: string;
  /** Type PG: text */
  Config?: string;
  /** Type PG: timestamp without time zone */
  sysCreatedDate?: Date;
  /** Type PG: character varying | Max length: 255 */
  sysCreatedUser?: string;
  /** Type PG: timestamp without time zone */
  sysModifiedDate?: Date;
  /** Type PG: character varying | Max length: 255 */
  sysModifiedUser?: string;
}

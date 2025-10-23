/**
 * Interface pour la table: SaleDocumentLineHumanServiceDetail
 * Générée automatiquement le 23/10/2025 09:15:22
 */
export interface SaleDocumentLineHumanServiceDetail {
  /** Type PG: uuid */
  Id: string;
  /** Type PG: integer */
  LineOrder: number;
  /** Type PG: uuid */
  ParentLineId: string;
  /** Type PG: character varying | Max length: 20 */
  IntervenerId: string;
  /** Type PG: timestamp without time zone */
  InterventionDate: Date;
  /** Type PG: numeric */
  InterventionDuration: number;
  /** Type PG: timestamp without time zone */
  sysCreatedDate?: Date;
  /** Type PG: character varying | Max length: 255 */
  sysCreatedUser?: string;
  /** Type PG: timestamp without time zone */
  sysModifiedDate?: Date;
  /** Type PG: character varying | Max length: 255 */
  sysModifiedUser?: string;
}

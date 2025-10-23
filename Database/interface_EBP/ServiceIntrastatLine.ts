/**
 * Interface pour la table: ServiceIntrastatLine
 * Générée automatiquement le 23/10/2025 09:15:22
 */
export interface ServiceIntrastatLine {
  /** Type PG: uuid */
  Id: string;
  /** Type PG: uuid */
  IntrastatId: string;
  /** Type PG: integer */
  LineNumber: number;
  /** Type PG: numeric */
  Amount: number;
  /** Type PG: character varying | Max length: 20 */
  PurchaserCeNumber?: string;
  /** Type PG: uuid */
  DocumentId?: string;
  /** Type PG: uuid */
  DocumentLineId?: string;
  /** Type PG: smallint */
  DocumentType?: number;
  /** Type PG: timestamp without time zone */
  sysCreatedDate?: Date;
  /** Type PG: character varying | Max length: 255 */
  sysCreatedUser?: string;
  /** Type PG: timestamp without time zone */
  sysModifiedDate?: Date;
  /** Type PG: character varying | Max length: 255 */
  sysModifiedUser?: string;
}

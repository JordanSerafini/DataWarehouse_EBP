/**
 * Interface pour la table: VatExemptionReason
 * Générée automatiquement le 23/10/2025 09:15:22
 */
export interface VatExemptionReason {
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
  /** Type PG: character varying | Max length: 3 */
  Category?: string;
  /** Type PG: character varying | Max length: 20 */
  Vatex?: string;
  /** Type PG: character varying | Max length: 255 */
  RegulatoryMeasure: string;
  /** Type PG: character varying | Max length: 255 */
  PrintMention: string;
}

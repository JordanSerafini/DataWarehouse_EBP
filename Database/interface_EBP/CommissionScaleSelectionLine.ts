/**
 * Interface pour la table: CommissionScaleSelectionLine
 * Générée automatiquement le 23/10/2025 09:15:22
 */
export interface CommissionScaleSelectionLine {
  /** Type PG: uuid */
  Id: string;
  /** Type PG: character varying | Max length: 10 */
  CommissionScaleId: string;
  /** Type PG: smallint */
  SelectionType: number;
  /** Type PG: boolean */
  Exclude: boolean;
  /** Type PG: integer */
  SelectionOrder: number;
  /** Type PG: timestamp without time zone */
  sysCreatedDate?: Date;
  /** Type PG: character varying | Max length: 255 */
  sysCreatedUser?: string;
  /** Type PG: timestamp without time zone */
  sysModifiedDate?: Date;
  /** Type PG: character varying | Max length: 255 */
  sysModifiedUser?: string;
  /** Type PG: character varying | Max length: 40 */
  IdFrom?: string;
  /** Type PG: character varying | Max length: 40 */
  IdTo?: string;
}

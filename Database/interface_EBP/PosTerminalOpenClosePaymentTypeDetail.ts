/**
 * Interface pour la table: PosTerminalOpenClosePaymentTypeDetail
 * Générée automatiquement le 23/10/2025 09:15:22
 */
export interface PosTerminalOpenClosePaymentTypeDetail {
  /** Type PG: uuid */
  Id: string;
  /** Type PG: uuid */
  ParentId: string;
  /** Type PG: character varying | Max length: 6 */
  PaymentTypeId: string;
  /** Type PG: integer */
  PaymentCount: number;
  /** Type PG: numeric */
  TotalAmount: number;
  /** Type PG: boolean */
  Positive: boolean;
  /** Type PG: boolean */
  IsPaymentType: boolean;
  /** Type PG: numeric */
  PosReturningChangeAmount: number;
  /** Type PG: timestamp without time zone */
  sysCreatedDate?: Date;
  /** Type PG: character varying | Max length: 255 */
  sysCreatedUser?: string;
  /** Type PG: timestamp without time zone */
  sysModifiedDate?: Date;
  /** Type PG: character varying | Max length: 255 */
  sysModifiedUser?: string;
}

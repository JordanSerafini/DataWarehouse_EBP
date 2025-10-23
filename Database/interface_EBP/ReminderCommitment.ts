/**
 * Interface pour la table: ReminderCommitment
 * Générée automatiquement le 23/10/2025 09:15:22
 */
export interface ReminderCommitment {
  /** Type PG: integer */
  NewReminderLevel: number;
  /** Type PG: smallint */
  SendingMode: number;
  /** Type PG: boolean */
  IsSelected: boolean;
  /** Type PG: uuid */
  Id: string;
  /** Type PG: uuid */
  ReminderLetterId: string;
  /** Type PG: uuid */
  CommitmentId: string;
  /** Type PG: timestamp without time zone */
  CommitmentDate: Date;
  /** Type PG: numeric */
  CommitmentDueAmount: number;
  /** Type PG: numeric */
  CommitmentTotalAmount: number;
  /** Type PG: character varying | Max length: 3 */
  DocumentCurrencyId?: string;
  /** Type PG: numeric */
  CommitmentCurrencyTotalAmount?: number;
  /** Type PG: numeric */
  CommitmentCurrencyDueAmount?: number;
  /** Type PG: timestamp without time zone */
  sysCreatedDate?: Date;
  /** Type PG: character varying | Max length: 255 */
  sysCreatedUser?: string;
  /** Type PG: timestamp without time zone */
  sysModifiedDate?: Date;
  /** Type PG: character varying | Max length: 255 */
  sysModifiedUser?: string;
  /** Type PG: uuid */
  ThirdAddressId?: string;
}

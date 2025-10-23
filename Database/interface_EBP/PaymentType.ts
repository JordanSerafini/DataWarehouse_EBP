/**
 * Interface pour la table: PaymentType
 * Générée automatiquement le 23/10/2025 09:15:22
 */
export interface PaymentType {
  /** Type PG: boolean */
  MustOpenPosCashDrawerDuringSettlement: boolean;
  /** Type PG: boolean */
  AllowPosReturningChange: boolean;
  /** Type PG: character varying | Max length: 6 */
  Id: string;
  /** Type PG: character varying | Max length: 60 */
  Caption: string;
  /** Type PG: smallint */
  Nature: number;
  /** Type PG: boolean */
  RemitToBank: boolean;
  /** Type PG: uuid */
  UniqueId: string;
  /** Type PG: boolean */
  TransferAtCommitmentDate: boolean;
  /** Type PG: boolean */
  GenerateCustomerSettlement: boolean;
  /** Type PG: boolean */
  GenerateSupplierSettlement: boolean;
  /** Type PG: integer */
  sysRecordVersion?: number;
  /** Type PG: uuid */
  sysRecordVersionId?: string;
  /** Type PG: character varying | Max length: 6 */
  BankId?: string;
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
  /** Type PG: character varying | Max length: 20 */
  BillForCollectionAccount?: string;
  /** Type PG: character varying | Max length: 10 */
  BillForCollectionBook?: string;
  /** Type PG: character varying | Max length: 10 */
  BillForDiscountBook?: string;
  /** Type PG: character varying | Max length: 20 */
  BillForDiscountAccount?: string;
  /** Type PG: character varying | Max length: 60 */
  LocalizableCaption_2?: string;
  /** Type PG: character varying | Max length: 60 */
  LocalizableCaption_3?: string;
  /** Type PG: character varying | Max length: 60 */
  LocalizableCaption_4?: string;
  /** Type PG: character varying | Max length: 60 */
  LocalizableCaption_5?: string;
  /** Type PG: boolean */
  IncludeUnpaidChargeToRemit: boolean;
  /** Type PG: boolean */
  OpenPaymentReference: boolean;
  /** Type PG: boolean */
  IsInactive: boolean;
}

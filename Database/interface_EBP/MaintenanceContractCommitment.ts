/**
 * Interface pour la table: MaintenanceContractCommitment
 * Générée automatiquement le 23/10/2025 09:15:22
 */
export interface MaintenanceContractCommitment {
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
  /** Type PG: uuid */
  Id: string;
  /** Type PG: character varying | Max length: 8 */
  MaintenanceContractId: string;
  /** Type PG: timestamp without time zone */
  CommitmentDate: Date;
  /** Type PG: numeric */
  InvoiceAmountVatExcluded: number;
  /** Type PG: numeric */
  InvoiceAmountVatIncluded: number;
}

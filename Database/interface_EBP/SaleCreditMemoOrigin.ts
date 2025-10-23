/**
 * Interface pour la table: SaleCreditMemoOrigin
 * Générée automatiquement le 23/10/2025 09:15:22
 */
export interface SaleCreditMemoOrigin {
  /** Type PG: integer */
  Id: number;
  /** Type PG: uuid */
  CreditMemoId: string;
  /** Type PG: character varying | Max length: 24 */
  InvoiceNumber: string;
  /** Type PG: timestamp without time zone */
  InvoiceDate: Date;
  /** Type PG: boolean */
  IsInsertedManuelly: boolean;
}

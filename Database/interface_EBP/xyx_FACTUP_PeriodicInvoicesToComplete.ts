/**
 * Interface pour la table: xyx_FACTUP_PeriodicInvoicesToComplete
 * Générée automatiquement le 23/10/2025 09:15:22
 */
export interface XyxFACTUPPeriodicInvoicesToComplete {
  /** Type PG: uuid */
  xy_sysId: string;
  /** Type PG: character varying | Max length: 10 */
  xy_FACTUP_PeriodicInvoice: string;
  /** Type PG: character varying | Max length: 20 */
  xy_FACTUP_Customer: string;
  /** Type PG: timestamp without time zone */
  xy_FACTUP_InvoiceDate: Date;
  /** Type PG: character varying | Max length: 255 */
  xy_FACTUP_Status?: string;
  /** Type PG: uuid */
  xy_FACTUP_Document?: string;
}

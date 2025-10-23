/**
 * Interface pour la table: DealContact
 * Générée automatiquement le 23/10/2025 09:15:22
 */
export interface DealContact {
  /** Type PG: uuid */
  Id: string;
  /** Type PG: boolean */
  Selected: boolean;
  /** Type PG: uuid */
  ContactId: string;
  /** Type PG: character varying | Max length: 10 */
  DealId?: string;
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
  /** Type PG: character varying | Max length: 10 */
  ConstructionSiteId?: string;
  /** Type PG: smallint */
  PrintSendOptions_Quote: number;
  /** Type PG: smallint */
  PrintSendOptions_ExecutionQuote: number;
  /** Type PG: smallint */
  PrintSendOptions_Order: number;
  /** Type PG: smallint */
  PrintSendOptions_DeliveryOrder: number;
  /** Type PG: smallint */
  PrintSendOptions_Invoice: number;
  /** Type PG: smallint */
  PrintSendOptions_CreditMemo: number;
  /** Type PG: smallint */
  PrintSendOptions_DepositInvoice: number;
  /** Type PG: smallint */
  PrintSendOptions_DepositCreditMemo: number;
  /** Type PG: smallint */
  PrintSendOptions_ProgressStateDocument: number;
  /** Type PG: smallint */
  PrintSendOptions_PurchaseQuote: number;
  /** Type PG: smallint */
  PrintSendOptions_PurchaseOrder: number;
  /** Type PG: smallint */
  PrintSendOptions_ReceiptOrder: number;
  /** Type PG: smallint */
  PrintSendOptions_ReturnOrder: number;
  /** Type PG: smallint */
  PrintSendOptions_PurchaseInvoice: number;
  /** Type PG: smallint */
  PrintSendOptions_PurchaseCreditMemo: number;
  /** Type PG: smallint */
  PrintSendOptions_PurchaseDepositInvoice: number;
  /** Type PG: smallint */
  PrintSendOptions_PurchaseDepositCreditMemo: number;
  /** Type PG: smallint */
  PrintSendOptions_PurchaseProgressStateDocument: number;
}

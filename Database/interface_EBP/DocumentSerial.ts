/**
 * Interface pour la table: DocumentSerial
 * Générée automatiquement le 23/10/2025 09:15:22
 */
export interface DocumentSerial {
  /** Type PG: character varying | Max length: 2 */
  Id: string;
  /** Type PG: character varying | Max length: 100 */
  Caption: string;
  /** Type PG: smallint */
  DocumentSerialType: number;
  /** Type PG: boolean */
  IsDefault: boolean;
  /** Type PG: uuid */
  UniqueId: string;
  /** Type PG: boolean */
  ApplyToSale: boolean;
  /** Type PG: boolean */
  ApplyToPurchase: boolean;
  /** Type PG: boolean */
  ApplyToStock: boolean;
  /** Type PG: boolean */
  IsDefaultForSale: boolean;
  /** Type PG: boolean */
  IsDefaultForPurchase: boolean;
  /** Type PG: boolean */
  IsDefaultForStock: boolean;
  /** Type PG: boolean */
  AddIdToDocumentNumber: boolean;
  /** Type PG: character varying | Max length: 2 */
  SerialToDisplay?: string;
  /** Type PG: uuid */
  sysModuleId?: string;
  /** Type PG: uuid */
  sysDatabaseId?: string;
  /** Type PG: integer */
  sysRecordVersion?: number;
  /** Type PG: uuid */
  sysRecordVersionId?: string;
  /** Type PG: character varying | Max length: 2 */
  CorrectiveSerialId?: string;
  /** Type PG: character varying | Max length: 10 */
  SalesAccountingBook?: string;
  /** Type PG: character varying | Max length: 10 */
  PurchasesAccountingBook?: string;
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
  StocksAccountingBook?: string;
}

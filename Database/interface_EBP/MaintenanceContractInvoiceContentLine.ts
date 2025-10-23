/**
 * Interface pour la table: MaintenanceContractInvoiceContentLine
 * Générée automatiquement le 23/10/2025 09:15:22
 */
export interface MaintenanceContractInvoiceContentLine {
  /** Type PG: numeric */
  Quantity: number;
  /** Type PG: uuid */
  Id: string;
  /** Type PG: integer */
  LineOrder: number;
  /** Type PG: text */
  LocalizableDescription_2?: string;
  /** Type PG: text */
  LocalizableDescription_Clear_2?: string;
  /** Type PG: text */
  LocalizableDescription_3?: string;
  /** Type PG: text */
  LocalizableDescription_Clear_3?: string;
  /** Type PG: text */
  LocalizableDescription_4?: string;
  /** Type PG: text */
  LocalizableDescription_Clear_4?: string;
  /** Type PG: text */
  LocalizableDescription_5?: string;
  /** Type PG: text */
  LocalizableDescription_Clear_5?: string;
  /** Type PG: character varying | Max length: 8 */
  ContractTemplateId?: string;
  /** Type PG: character varying | Max length: 8 */
  ContractId?: string;
  /** Type PG: character varying | Max length: 40 */
  ItemId?: string;
  /** Type PG: text */
  Description?: string;
  /** Type PG: text */
  DescriptionClear?: string;
  /** Type PG: timestamp without time zone */
  sysCreatedDate?: Date;
  /** Type PG: character varying | Max length: 255 */
  sysCreatedUser?: string;
  /** Type PG: timestamp without time zone */
  sysModifiedDate?: Date;
  /** Type PG: character varying | Max length: 255 */
  sysModifiedUser?: string;
  /** Type PG: character varying | Max length: 4 */
  UnitId?: string;
  /** Type PG: numeric */
  PriceVatExcluded?: number;
  /** Type PG: numeric */
  PriceVatIncluded?: number;
  /** Type PG: uuid */
  TVA: string;
}

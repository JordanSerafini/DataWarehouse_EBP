/**
 * Interface pour la table: PeriodicInvoicingCustomer
 * Générée automatiquement le 23/10/2025 09:15:22
 */
export interface PeriodicInvoicingCustomer {
  /** Type PG: integer */
  LineNumber: number;
  /** Type PG: uuid */
  Id: string;
  /** Type PG: character varying | Max length: 10 */
  PeriodicInvoicingId: string;
  /** Type PG: character varying | Max length: 20 */
  CustomerId?: string;
  /** Type PG: character varying | Max length: 10 */
  CustomerFamilyId?: string;
  /** Type PG: timestamp without time zone */
  StartDate?: Date;
  /** Type PG: timestamp without time zone */
  EndDate?: Date;
  /** Type PG: timestamp without time zone */
  PreviousInvoicingDate?: Date;
  /** Type PG: timestamp without time zone */
  NextInvoicingDate?: Date;
  /** Type PG: timestamp without time zone */
  sysCreatedDate?: Date;
  /** Type PG: character varying | Max length: 255 */
  sysCreatedUser?: string;
  /** Type PG: timestamp without time zone */
  sysModifiedDate?: Date;
  /** Type PG: character varying | Max length: 255 */
  sysModifiedUser?: string;
  /** Type PG: character varying | Max length: 35 */
  SepaMandateIdentification?: string;
  /** Type PG: timestamp without time zone */
  SepaMandateDate?: Date;
  /** Type PG: smallint */
  SepaSequence?: number;
  /** Type PG: uuid */
  BankAccountId?: string;
  /** Type PG: character varying | Max length: 8 */
  MaintenanceContractId?: string;
  /** Type PG: numeric */
  MaintenanceContractUpdatingRate?: number;
}

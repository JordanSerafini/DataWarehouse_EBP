/**
 * Interface pour la table: IncidentCustomerProduct
 * Générée automatiquement le 23/10/2025 09:15:22
 */
export interface IncidentCustomerProduct {
  /** Type PG: boolean */
  DoNotCreateMovementForExchangedItem: boolean;
  /** Type PG: smallint */
  PartsCoverType: number;
  /** Type PG: smallint */
  LabourCoverType: number;
  /** Type PG: smallint */
  TravelCoverType: number;
  /** Type PG: boolean */
  StandardExchange: boolean;
  /** Type PG: character varying | Max length: 80 */
  Caption: string;
  /** Type PG: boolean */
  DecrementMaintenanceContractCounter: boolean;
  /** Type PG: uuid */
  Id: string;
  /** Type PG: character varying | Max length: 8 */
  IncidentId: string;
  /** Type PG: smallint */
  Status: number;
  /** Type PG: timestamp without time zone */
  ReceiptDate?: Date;
  /** Type PG: timestamp without time zone */
  ReturnDate?: Date;
  /** Type PG: character varying | Max length: 40 */
  TrackingNumber?: string;
  /** Type PG: character varying | Max length: 40 */
  ExchangeItemId?: string;
  /** Type PG: timestamp without time zone */
  ExchangeDate?: Date;
  /** Type PG: character varying | Max length: 40 */
  ExchangeTrackingNumber?: string;
  /** Type PG: uuid */
  StorehouseId?: string;
  /** Type PG: character varying | Max length: 8 */
  MaintenanceContractId?: string;
  /** Type PG: uuid */
  ExchangeStockDocumentId?: string;
  /** Type PG: text */
  ExchangeStockDocumentLineId?: string;
  /** Type PG: character varying | Max length: 8 */
  ExchangeCustomerProductId?: string;
  /** Type PG: timestamp without time zone */
  sysCreatedDate?: Date;
  /** Type PG: character varying | Max length: 255 */
  sysCreatedUser?: string;
  /** Type PG: timestamp without time zone */
  sysModifiedDate?: Date;
  /** Type PG: character varying | Max length: 255 */
  sysModifiedUser?: string;
  /** Type PG: character varying | Max length: 8 */
  CustomerProductId?: string;
  /** Type PG: character varying | Max length: 40 */
  ItemId?: string;
}

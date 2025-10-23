/**
 * Interface pour la table: MaintenanceContractCustomerProduct
 * Générée automatiquement le 23/10/2025 09:15:22
 */
export interface MaintenanceContractCustomerProduct {
  /** Type PG: uuid */
  Id: string;
  /** Type PG: character varying | Max length: 8 */
  ContractId: string;
  /** Type PG: boolean */
  ArePartsCovered: boolean;
  /** Type PG: numeric */
  PartsDuration: number;
  /** Type PG: boolean */
  IsLabourCovered: boolean;
  /** Type PG: numeric */
  LabourDuration: number;
  /** Type PG: boolean */
  IsTravelCovered: boolean;
  /** Type PG: numeric */
  TravelDuration: number;
  /** Type PG: character varying | Max length: 80 */
  Caption: string;
  /** Type PG: character varying | Max length: 40 */
  TrackingNumber?: string;
  /** Type PG: character varying | Max length: 8 */
  CustomerProductId?: string;
  /** Type PG: character varying | Max length: 40 */
  ItemId?: string;
  /** Type PG: timestamp without time zone */
  sysCreatedDate?: Date;
  /** Type PG: character varying | Max length: 255 */
  sysCreatedUser?: string;
  /** Type PG: timestamp without time zone */
  sysModifiedDate?: Date;
  /** Type PG: character varying | Max length: 255 */
  sysModifiedUser?: string;
}

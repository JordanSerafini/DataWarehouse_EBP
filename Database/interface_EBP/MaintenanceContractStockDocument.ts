/**
 * Interface pour la table: MaintenanceContractStockDocument
 * Générée automatiquement le 23/10/2025 09:15:22
 */
export interface MaintenanceContractStockDocument {
  /** Type PG: uuid */
  Id: string;
  /** Type PG: uuid */
  DocumentId: string;
  /** Type PG: boolean */
  IncludeInCosts: boolean;
  /** Type PG: character varying | Max length: 8 */
  MaintenanceContractId?: string;
  /** Type PG: timestamp without time zone */
  sysCreatedDate?: Date;
  /** Type PG: character varying | Max length: 255 */
  sysCreatedUser?: string;
  /** Type PG: timestamp without time zone */
  sysModifiedDate?: Date;
  /** Type PG: character varying | Max length: 255 */
  sysModifiedUser?: string;
}

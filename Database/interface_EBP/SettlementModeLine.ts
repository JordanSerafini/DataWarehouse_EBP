/**
 * Interface pour la table: SettlementModeLine
 * Générée automatiquement le 23/10/2025 09:15:22
 */
export interface SettlementModeLine {
  /** Type PG: boolean */
  GenerateCustomerSettlement: boolean;
  /** Type PG: boolean */
  GenerateSupplierSettlement: boolean;
  /** Type PG: smallint */
  DaysNumber: number;
  /** Type PG: smallint */
  CommitmentType: number;
  /** Type PG: uuid */
  Id: string;
  /** Type PG: character varying | Max length: 6 */
  SettlementModeId: string;
  /** Type PG: numeric */
  PercentageDistribution: number;
  /** Type PG: boolean */
  AccountingMonth: boolean;
  /** Type PG: character varying | Max length: 6 */
  PaymentTypeId?: string;
  /** Type PG: timestamp without time zone */
  sysCreatedDate?: Date;
  /** Type PG: character varying | Max length: 255 */
  sysCreatedUser?: string;
  /** Type PG: timestamp without time zone */
  sysModifiedDate?: Date;
  /** Type PG: character varying | Max length: 255 */
  sysModifiedUser?: string;
  /** Type PG: smallint */
  DayOfMonth?: number;
}

/**
 * Interface pour la table: SaleSettlementCommitmentAssociation
 * Générée automatiquement le 23/10/2025 09:15:22
 */
export interface SaleSettlementCommitmentAssociation {
  /** Type PG: numeric */
  FinancialDiscount: number;
  /** Type PG: numeric */
  CurrencyFinancialDiscount: number;
  /** Type PG: boolean */
  IsDoubtfulAssociation: boolean;
  /** Type PG: boolean */
  IsUnrecoverableAssociation: boolean;
  /** Type PG: uuid */
  Id: string;
  /** Type PG: uuid */
  CommitmentId: string;
  /** Type PG: numeric */
  AssignedAmount: number;
  /** Type PG: numeric */
  CurrencyAssignedAmount: number;
  /** Type PG: boolean */
  IsTransferedToAccounting: boolean;
  /** Type PG: boolean */
  IncludeInThirdCurrentAmount: boolean;
  /** Type PG: numeric */
  AmountToInclude: number;
  /** Type PG: uuid */
  AccountingExchangeGroupId?: string;
  /** Type PG: uuid */
  LinkedCommitmentId?: string;
  /** Type PG: character varying | Max length: 3 */
  CurrencyId?: string;
  /** Type PG: uuid */
  sysModuleId?: string;
  /** Type PG: uuid */
  sysDatabaseId?: string;
  /** Type PG: uuid */
  SettlementId?: string;
  /** Type PG: timestamp without time zone */
  sysCreatedDate?: Date;
  /** Type PG: character varying | Max length: 255 */
  sysCreatedUser?: string;
  /** Type PG: timestamp without time zone */
  sysModifiedDate?: Date;
  /** Type PG: character varying | Max length: 255 */
  sysModifiedUser?: string;
  /** Type PG: uuid */
  SecondarySettlementId?: string;
  /** Type PG: character varying | Max length: 70 */
  Reference?: string;
}

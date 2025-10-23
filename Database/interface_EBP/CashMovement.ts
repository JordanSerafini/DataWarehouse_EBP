/**
 * Interface pour la table: CashMovement
 * Générée automatiquement le 23/10/2025 09:15:22
 */
export interface CashMovement {
  /** Type PG: smallint */
  AccountingTransferState: number;
  /** Type PG: uuid */
  Id: string;
  /** Type PG: timestamp without time zone */
  MovementDateTime: Date;
  /** Type PG: character varying | Max length: 40 */
  Caption: string;
  /** Type PG: smallint */
  MovementType: number;
  /** Type PG: numeric */
  Amount: number;
  /** Type PG: character varying | Max length: 7 */
  SourceSafeId?: string;
  /** Type PG: character varying | Max length: 7 */
  TargetSafeId?: string;
  /** Type PG: character varying | Max length: 7 */
  SourceTerminalId?: string;
  /** Type PG: character varying | Max length: 7 */
  TargetTerminalId?: string;
  /** Type PG: uuid */
  SourceTerminalOpenCloseId?: string;
  /** Type PG: uuid */
  TargetTerminalOpenCloseId?: string;
  /** Type PG: smallint */
  AccountingType?: number;
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
  /** Type PG: uuid */
  AccountingExchangeGroupId?: string;
  /** Type PG: uuid */
  BankRemittanceId?: string;
  /** Type PG: numeric */
  BankRemittanceChargeAmounts0?: number;
  /** Type PG: numeric */
  BankRemittanceChargeAmounts1?: number;
  /** Type PG: numeric */
  BankRemittanceChargeAmounts2?: number;
  /** Type PG: numeric */
  BankRemittanceChargeAmounts3?: number;
  /** Type PG: numeric */
  BankRemittanceChargeAmounts4?: number;
}

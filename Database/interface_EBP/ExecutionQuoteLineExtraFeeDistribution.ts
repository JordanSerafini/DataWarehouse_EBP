/**
 * Interface pour la table: ExecutionQuoteLineExtraFeeDistribution
 * Générée automatiquement le 23/10/2025 09:15:22
 */
export interface ExecutionQuoteLineExtraFeeDistribution {
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
  Id: string;
  /** Type PG: uuid */
  ExtraFeeLineId: string;
  /** Type PG: uuid */
  DocumentLineId: string;
  /** Type PG: smallint */
  LineType: number;
  /** Type PG: numeric */
  Amount: number;
  /** Type PG: numeric */
  Rate: number;
  /** Type PG: smallint */
  ComponentCalculationType?: number;
  /** Type PG: boolean */
  AllowComponentsModification: boolean;
}

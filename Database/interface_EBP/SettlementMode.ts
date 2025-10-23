/**
 * Interface pour la table: SettlementMode
 * Générée automatiquement le 23/10/2025 09:15:22
 */
export interface SettlementMode {
  /** Type PG: character varying | Max length: 6 */
  Id: string;
  /** Type PG: character varying | Max length: 60 */
  Caption: string;
  /** Type PG: uuid */
  UniqueId: string;
  /** Type PG: integer */
  sysRecordVersion?: number;
  /** Type PG: uuid */
  sysRecordVersionId?: string;
  /** Type PG: character varying | Max length: 100 */
  OxatisPaymentTypeCaption?: string;
  /** Type PG: integer */
  sysEditCounter?: number;
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
  /** Type PG: character varying | Max length: 60 */
  LocalizableCaption_2?: string;
  /** Type PG: character varying | Max length: 60 */
  LocalizableCaption_3?: string;
  /** Type PG: character varying | Max length: 60 */
  LocalizableCaption_4?: string;
  /** Type PG: character varying | Max length: 60 */
  LocalizableCaption_5?: string;
  /** Type PG: boolean */
  IsInactive: boolean;
}

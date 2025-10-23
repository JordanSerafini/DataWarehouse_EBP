/**
 * Interface pour la table: EbpSysLock
 * Générée automatiquement le 23/10/2025 09:15:22
 */
export interface EbpSysLock {
  /** Type PG: character varying | Max length: 255 */
  keyValue: string;
  /** Type PG: character varying | Max length: 20 */
  userId: string;
  /** Type PG: character varying | Max length: 128 */
  userName: string;
  /** Type PG: character varying | Max length: 64 */
  computerName: string;
  /** Type PG: timestamp without time zone */
  creationDate: Date;
  /** Type PG: character varying | Max length: 36 */
  contextId: string;
  /** Type PG: character varying | Max length: 128 */
  productName: string;
  /** Type PG: character varying | Max length: 32 */
  productVersion: string;
  /** Type PG: uuid */
  mainApplicationId?: string;
  /** Type PG: character varying | Max length: 36 */
  groupId?: string;
  /** Type PG: uuid */
  TransactionUnlockId?: string;
  /** Type PG: smallint */
  ApplicationType: number;
}

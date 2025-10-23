/**
 * Interface pour la table: EbpSysMachineInfo
 * Générée automatiquement le 23/10/2025 09:15:22
 */
export interface EbpSysMachineInfo {
  /** Type PG: character varying | Max length: 255 */
  MachineName: string;
  /** Type PG: character varying | Max length: 13 */
  MachineKey: string;
  /** Type PG: character varying | Max length: 255 */
  CompanyName?: string;
  /** Type PG: character varying | Max length: 19 */
  ActivationCode?: string;
  /** Type PG: timestamp without time zone */
  ConnectionDate?: Date;
  /** Type PG: character varying | Max length: 255 */
  WindowsUserName?: string;
  /** Type PG: character varying | Max length: 255 */
  WindowsDomain?: string;
  /** Type PG: character varying | Max length: 255 */
  OsVersion?: string;
  /** Type PG: text */
  MachineKeyInfo?: string;
  /** Type PG: timestamp without time zone */
  sysCreatedDate?: Date;
  /** Type PG: character varying | Max length: 255 */
  sysCreatedUser?: string;
  /** Type PG: timestamp without time zone */
  sysModifiedDate?: Date;
  /** Type PG: character varying | Max length: 255 */
  sysModifiedUser?: string;
}

/**
 * Interface pour la table: EbpSysLinkedExtension
 * Générée automatiquement le 23/10/2025 09:15:22
 */
export interface EbpSysLinkedExtension {
  /** Type PG: uuid */
  Id: string;
  /** Type PG: character varying | Max length: 255 */
  Name: string;
  /** Type PG: text */
  Description: string;
  /** Type PG: character varying | Max length: 10 */
  ExtensionVersion: string;
  /** Type PG: character varying | Max length: 255 */
  RelativePath: string;
  /** Type PG: character varying | Max length: 255 */
  ExtensionTypeName: string;
  /** Type PG: boolean */
  Enabled: boolean;
  /** Type PG: uuid */
  InterfaceExtensionId: string;
  /** Type PG: character varying | Max length: 10 */
  InterfaceExtensionVersion: string;
  /** Type PG: character varying | Max length: 6 */
  InterfaceExtensionPrefix: string;
  /** Type PG: timestamp without time zone */
  sysCreatedDate?: Date;
  /** Type PG: character varying | Max length: 255 */
  sysCreatedUser?: string;
  /** Type PG: timestamp without time zone */
  sysModifiedDate?: Date;
  /** Type PG: character varying | Max length: 255 */
  sysModifiedUser?: string;
}

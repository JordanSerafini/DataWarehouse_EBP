/**
 * Interface pour la table: EbpSysOptions
 * Générée automatiquement le 23/10/2025 09:15:22
 */
export interface EbpSysOptions {
  /** Type PG: character varying | Max length: 250 */
  OptionName: string;
  /** Type PG: character varying | Max length: 255 */
  LocalUser: string;
  /** Type PG: character varying | Max length: 255 */
  LocalWorkstation: string;
  /** Type PG: integer */
  OptionHashCode: number;
  /** Type PG: text */
  OptionValue?: string;
  /** Type PG: bytea */
  OptionBlobValue?: Buffer;
  /** Type PG: uuid */
  ExtensionId?: string;
}

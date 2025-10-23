/**
 * Interface pour la table: EbpSysStatisticCustomFilter
 * Générée automatiquement le 23/10/2025 09:15:22
 */
export interface EbpSysStatisticCustomFilter {
  /** Type PG: uuid */
  Id: string;
  /** Type PG: character varying | Max length: 200 */
  Label: string;
  /** Type PG: uuid */
  ContextualFilterId: string;
  /** Type PG: text */
  CustomFilters: string;
  /** Type PG: timestamp without time zone */
  sysCreatedDate?: Date;
  /** Type PG: character varying | Max length: 255 */
  sysCreatedUser?: string;
  /** Type PG: timestamp without time zone */
  sysModifiedDate?: Date;
  /** Type PG: character varying | Max length: 255 */
  sysModifiedUser?: string;
}

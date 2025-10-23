/**
 * Interface pour la table: EbpSysRight
 * Générée automatiquement le 23/10/2025 09:15:22
 */
export interface EbpSysRight {
  /** Type PG: uuid */
  Id: string;
  /** Type PG: uuid */
  ApplicationRightId: string;
  /** Type PG: smallint */
  Authorizations: number;
  /** Type PG: uuid */
  ParentId?: string;
  /** Type PG: character varying | Max length: 20 */
  UserId?: string;
  /** Type PG: character varying | Max length: 20 */
  GroupId?: string;
  /** Type PG: timestamp without time zone */
  sysCreatedDate?: Date;
  /** Type PG: character varying | Max length: 255 */
  sysCreatedUser?: string;
  /** Type PG: timestamp without time zone */
  sysModifiedDate?: Date;
  /** Type PG: character varying | Max length: 255 */
  sysModifiedUser?: string;
}

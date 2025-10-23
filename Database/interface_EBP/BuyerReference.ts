/**
 * Interface pour la table: BuyerReference
 * Générée automatiquement le 23/10/2025 09:15:22
 */
export interface BuyerReference {
  /** Type PG: timestamp without time zone */
  sysCreatedDate?: Date;
  /** Type PG: character varying | Max length: 255 */
  sysCreatedUser?: string;
  /** Type PG: timestamp without time zone */
  sysModifiedDate?: Date;
  /** Type PG: character varying | Max length: 255 */
  sysModifiedUser?: string;
  /** Type PG: uuid */
  Id: string;
  /** Type PG: character varying | Max length: 100 */
  Code: string;
  /** Type PG: character varying | Max length: 100 */
  Caption: string;
  /** Type PG: character varying | Max length: 20 */
  Siret: string;
  /** Type PG: boolean */
  LegalCommitment: boolean;
}

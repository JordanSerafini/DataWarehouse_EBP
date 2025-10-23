/**
 * Interface pour la table: GuaranteeType
 * Générée automatiquement le 23/10/2025 09:15:22
 */
export interface GuaranteeType {
  /** Type PG: character varying | Max length: 8 */
  Id: string;
  /** Type PG: character varying | Max length: 60 */
  Caption: string;
  /** Type PG: smallint */
  ActiveState: number;
  /** Type PG: numeric */
  ProducerGuarantee_PartsDuration: number;
  /** Type PG: numeric */
  ProducerGuarantee_LabourDuration: number;
  /** Type PG: numeric */
  ProducerGuarantee_TravelDuration: number;
  /** Type PG: numeric */
  CommercialGuarantee_PartsDuration: number;
  /** Type PG: numeric */
  CommercialGuarantee_LabourDuration: number;
  /** Type PG: numeric */
  CommercialGuarantee_TravelDuration: number;
  /** Type PG: boolean */
  PartsIncludeInProducer: boolean;
  /** Type PG: boolean */
  LabourIncludeInProducer: boolean;
  /** Type PG: boolean */
  TravelIncludeInProducer: boolean;
  /** Type PG: boolean */
  StandardExchange: boolean;
  /** Type PG: numeric */
  StandardExchangeDuration?: number;
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
}

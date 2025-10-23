/**
 * Interface pour la table: ThirdBankAccountDetail
 * Générée automatiquement le 23/10/2025 09:15:22
 */
export interface ThirdBankAccountDetail {
  /** Type PG: boolean */
  IsActive: boolean;
  /** Type PG: uuid */
  Id: string;
  /** Type PG: boolean */
  IsMain: boolean;
  /** Type PG: character varying | Max length: 46 */
  AccountDetail_BasicBankAccountNumber?: string;
  /** Type PG: character varying | Max length: 50 */
  AccountDetail_InternationalBankAccountNumber?: string;
  /** Type PG: character varying | Max length: 11 */
  AccountDetail_BankIdentifierCode?: string;
  /** Type PG: character varying | Max length: 60 */
  AccountDetail_Caption?: string;
  /** Type PG: character varying | Max length: 3 */
  AccountDetail_CountryIsoCode?: string;
  /** Type PG: character varying | Max length: 60 */
  AccountDetail_Domiciliation1?: string;
  /** Type PG: character varying | Max length: 60 */
  AccountDetail_Domiciliation2?: string;
  /** Type PG: character varying | Max length: 60 */
  AccountDetail_Domiciliation3?: string;
  /** Type PG: character varying | Max length: 20 */
  CustomerId?: string;
  /** Type PG: character varying | Max length: 20 */
  SupplierId?: string;
  /** Type PG: timestamp without time zone */
  sysCreatedDate?: Date;
  /** Type PG: character varying | Max length: 255 */
  sysCreatedUser?: string;
  /** Type PG: timestamp without time zone */
  sysModifiedDate?: Date;
  /** Type PG: character varying | Max length: 255 */
  sysModifiedUser?: string;
  /** Type PG: character varying | Max length: 13 */
  AccountDetail_OtherBankIdentifier?: string;
  /** Type PG: character varying | Max length: 35 */
  SepaMandateIdentification?: string;
  /** Type PG: timestamp without time zone */
  SepaMandateDate?: Date;
  /** Type PG: smallint */
  SepaSequence?: number;
  /** Type PG: character varying | Max length: 35 */
  OriginSepaMandateIdentification?: string;
  /** Type PG: boolean */
  NewAccount: boolean;
  /** Type PG: character varying | Max length: 35 */
  GoCardLessMandateId?: string;
  /** Type PG: smallint */
  GoCardLessMandateStatus?: number;
  /** Type PG: smallint */
  GoCardLessMandateCause?: number;
  /** Type PG: timestamp without time zone */
  GoCardLessStatusDate?: Date;
  /** Type PG: character varying | Max length: 100 */
  AccountHolder?: string;
}

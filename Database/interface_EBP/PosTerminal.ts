/**
 * Interface pour la table: PosTerminal
 * Générée automatiquement le 23/10/2025 09:15:22
 */
export interface PosTerminal {
  /** Type PG: character varying | Max length: 7 */
  Id: string;
  /** Type PG: character varying | Max length: 40 */
  Caption: string;
  /** Type PG: smallint */
  ActionOnDatabaseOpened: number;
  /** Type PG: boolean */
  ShowHoldReceiptsForAllTerminals: boolean;
  /** Type PG: character varying | Max length: 6 */
  BankId?: string;
  /** Type PG: integer */
  sysEditCounter?: number;
  /** Type PG: smallint */
  CatId?: number;
  /** Type PG: uuid */
  StorehouseId?: string;
  /** Type PG: smallint */
  Screen?: number;
  /** Type PG: character varying | Max length: 40 */
  ComputerName?: string;
  /** Type PG: character varying | Max length: 2 */
  DefaultSerial?: string;
  /** Type PG: character varying | Max length: 20 */
  DefaultCustomerId?: string;
  /** Type PG: character varying | Max length: 10 */
  NewCustomerDefaultFamily?: string;
  /** Type PG: character varying | Max length: 7 */
  DefaultSafeId?: string;
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
  /** Type PG: character varying | Max length: 40 */
  Address_Address1?: string;
  /** Type PG: character varying | Max length: 40 */
  Address_Address2?: string;
  /** Type PG: character varying | Max length: 40 */
  Address_Address3?: string;
  /** Type PG: character varying | Max length: 40 */
  Address_Address4?: string;
  /** Type PG: character varying | Max length: 10 */
  Address_ZipCode?: string;
  /** Type PG: character varying | Max length: 35 */
  Address_City?: string;
  /** Type PG: character varying | Max length: 50 */
  Address_State?: string;
  /** Type PG: character varying | Max length: 3 */
  Address_CountryIsoCode?: string;
  /** Type PG: numeric */
  Address_Longitude?: number;
  /** Type PG: numeric */
  Address_Latitude?: number;
  /** Type PG: character varying | Max length: 20 */
  Phone?: string;
  /** Type PG: character varying | Max length: 20 */
  Fax?: string;
  /** Type PG: smallint */
  TabTipMode: number;
  /** Type PG: boolean */
  ApplyFamilyParameters: boolean;
  /** Type PG: character varying | Max length: 10 */
  Address_CodeINSEE?: string;
  /** Type PG: character varying | Max length: 50 */
  Address_CityINSEE?: string;
  /** Type PG: character varying | Max length: 2 */
  DefaultSerialCorrective?: string;
  /** Type PG: smallint */
  CalculationMode: number;
  /** Type PG: boolean */
  InputCashMovementReceiptComment: boolean;
  /** Type PG: boolean */
  ShowBirthdayWarning: boolean;
  /** Type PG: smallint */
  DaysBeforeBirthday?: number;
  /** Type PG: smallint */
  DaysAfterBirthday?: number;
  /** Type PG: smallint */
  CustomerScreen?: number;
  /** Type PG: character varying | Max length: 255 */
  MediaFile?: string;
  /** Type PG: character varying | Max length: 255 */
  CustomerScreenFooter?: string;
}

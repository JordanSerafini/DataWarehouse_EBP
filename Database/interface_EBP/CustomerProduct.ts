/**
 * Interface pour la table: CustomerProduct
 * Générée automatiquement le 23/10/2025 09:15:22
 */
export interface CustomerProduct {
  /** Type PG: boolean */
  xx_Controle: boolean;
  /** Type PG: boolean */
  DeliveryAddress_Npai: boolean;
  /** Type PG: boolean */
  DeliveryContact_NaturalPerson: boolean;
  /** Type PG: boolean */
  DeliveryContact_OptIn: boolean;
  /** Type PG: character varying | Max length: 8 */
  Id: string;
  /** Type PG: character varying | Max length: 80 */
  Caption: string;
  /** Type PG: smallint */
  ActiveState: number;
  /** Type PG: character varying | Max length: 20 */
  CustomerId: string;
  /** Type PG: character varying | Max length: 60 */
  CustomerName: string;
  /** Type PG: uuid */
  DeliveryAddressId?: string;
  /** Type PG: character varying | Max length: 40 */
  DeliveryAddress_Address1?: string;
  /** Type PG: character varying | Max length: 40 */
  DeliveryAddress_Address2?: string;
  /** Type PG: character varying | Max length: 40 */
  DeliveryAddress_Address3?: string;
  /** Type PG: character varying | Max length: 40 */
  DeliveryAddress_Address4?: string;
  /** Type PG: character varying | Max length: 10 */
  DeliveryAddress_ZipCode?: string;
  /** Type PG: character varying | Max length: 35 */
  DeliveryAddress_City?: string;
  /** Type PG: character varying | Max length: 50 */
  DeliveryAddress_State?: string;
  /** Type PG: character varying | Max length: 3 */
  DeliveryAddress_CountryIsoCode?: string;
  /** Type PG: character varying | Max length: 50 */
  DeliveryAddress_Description?: string;
  /** Type PG: character varying | Max length: 25 */
  DeliveryAddress_Civility?: string;
  /** Type PG: character varying | Max length: 60 */
  DeliveryAddress_ThirdName?: string;
  /** Type PG: text */
  Description?: string;
  /** Type PG: text */
  DescriptionClear?: string;
  /** Type PG: character varying | Max length: 8 */
  GuaranteeTypeId?: string;
  /** Type PG: timestamp without time zone */
  LabourStartDate?: Date;
  /** Type PG: timestamp without time zone */
  LabourEndDate?: Date;
  /** Type PG: timestamp without time zone */
  PartsStartDate?: Date;
  /** Type PG: timestamp without time zone */
  PartsEndDate?: Date;
  /** Type PG: timestamp without time zone */
  TravelStartDate?: Date;
  /** Type PG: timestamp without time zone */
  TravelEndDate?: Date;
  /** Type PG: uuid */
  SaleDocumentLineId?: string;
  /** Type PG: character varying | Max length: 8 */
  CustomerProductFamilyId?: string;
  /** Type PG: character varying | Max length: 40 */
  ItemId?: string;
  /** Type PG: character varying | Max length: 40 */
  TrackingNumber?: string;
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
  /** Type PG: character varying | Max length: 255 */
  DeliveryContact_ExternalId_GoogleId?: string;
  /** Type PG: character varying | Max length: 255 */
  DeliveryContact_ExternalId_OutlookId?: string;
  /** Type PG: bytea */
  CustomerProductImage?: Buffer;
  /** Type PG: character varying | Max length: 255 */
  BlockReason?: string;
  /** Type PG: character varying | Max length: 8 */
  GuaranteeExtensionTypeId?: string;
  /** Type PG: integer */
  sysEditCounter?: number;
  /** Type PG: character varying | Max length: 100 */
  DeliveryAddress_WebSite?: string;
  /** Type PG: numeric */
  DeliveryAddress_Longitude?: number;
  /** Type PG: numeric */
  DeliveryAddress_Latitude?: number;
  /** Type PG: uuid */
  DeliveryContactId?: string;
  /** Type PG: character varying | Max length: 25 */
  DeliveryContact_Civility?: string;
  /** Type PG: character varying | Max length: 60 */
  DeliveryContact_Name?: string;
  /** Type PG: character varying | Max length: 60 */
  DeliveryContact_FirstName?: string;
  /** Type PG: character varying | Max length: 20 */
  DeliveryContact_Phone?: string;
  /** Type PG: character varying | Max length: 20 */
  DeliveryContact_CellPhone?: string;
  /** Type PG: character varying | Max length: 20 */
  DeliveryContact_Fax?: string;
  /** Type PG: character varying | Max length: 100 */
  DeliveryContact_Email?: string;
  /** Type PG: character varying | Max length: 40 */
  DeliveryContact_Function?: string;
  /** Type PG: character varying | Max length: 40 */
  DeliveryContact_Department?: string;
  /** Type PG: character varying | Max length: 20 */
  xx_Logiciel?: string;
  /** Type PG: character varying | Max length: 20 */
  xx_Gamme?: string;
  /** Type PG: character varying | Max length: 10 */
  xx_Version?: string;
  /** Type PG: character varying | Max length: 20 */
  xx_Detail_Version?: string;
  /** Type PG: integer */
  xx_Nb_Postes?: number;
  /** Type PG: character varying | Max length: 10 */
  xx_Mode?: string;
  /** Type PG: character varying | Max length: 10 */
  xx_Technologie?: string;
  /** Type PG: character varying | Max length: 10 */
  xx_Licence?: string;
  /** Type PG: character varying | Max length: 10 */
  xx_Cle_Web?: string;
  /** Type PG: text */
  xx_Cles_PC?: string;
  /** Type PG: timestamp without time zone */
  xx_Mise_a_Jour?: Date;
  /** Type PG: text */
  xx_Modules_Optionnels?: string;
  /** Type PG: boolean */
  DeliveryContact_AllowUsePersonnalDatas: boolean;
  /** Type PG: boolean */
  xx_Specif_developpement: boolean;
  /** Type PG: timestamp without time zone */
  xx_Prochaine_maj?: Date;
  /** Type PG: character varying | Max length: 10 */
  DeliveryAddress_CodeINSEE?: string;
  /** Type PG: character varying | Max length: 50 */
  DeliveryAddress_CityINSEE?: string;
  /** Type PG: character varying | Max length: 40 */
  DeliveryContact_Profession?: string;
  /** Type PG: boolean */
  HasAssociatedFiles: boolean;
}

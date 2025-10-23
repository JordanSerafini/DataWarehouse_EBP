/**
 * Interface pour la table: ConstructionSite
 * Générée automatiquement le 23/10/2025 09:15:22
 */
export interface ConstructionSite {
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
  /** Type PG: boolean */
  InvoiceScheduleEvent: boolean;
  /** Type PG: boolean */
  InvoiceScheduleTimeEvent: boolean;
  /** Type PG: numeric */
  PredictedCosts: number;
  /** Type PG: numeric */
  PredictedSales: number;
  /** Type PG: numeric */
  PredictedGrossMargin: number;
  /** Type PG: numeric */
  PredictedDuration: number;
  /** Type PG: numeric */
  AccomplishedCosts: number;
  /** Type PG: numeric */
  AccomplishedSales: number;
  /** Type PG: numeric */
  AccomplishedGrossMargin: number;
  /** Type PG: numeric */
  AccomplishedDuration: number;
  /** Type PG: numeric */
  ProfitsOnCosts: number;
  /** Type PG: numeric */
  ProfitsOnSales: number;
  /** Type PG: numeric */
  ProfitsOnGrossMargin: number;
  /** Type PG: numeric */
  ProfitsOnDuration: number;
  /** Type PG: character varying | Max length: 40 */
  AnalyticAccounting_GridId?: string;
  /** Type PG: numeric */
  ActualTreasury: number;
  /** Type PG: numeric */
  CustomerCommitmentBalanceDues: number;
  /** Type PG: numeric */
  SupplierCommitmentBalanceDues: number;
  /** Type PG: numeric */
  SubContractorCommitmentBalanceDues: number;
  /** Type PG: numeric */
  OtherCosts: number;
  /** Type PG: numeric */
  TreasuryBalanceDue: number;
  /** Type PG: character varying | Max length: 10 */
  Id: string;
  /** Type PG: uuid */
  ReferenceDocumentId?: string;
  /** Type PG: uuid */
  ConstructionSiteReferenceDocumentId?: string;
  /** Type PG: character varying | Max length: 80 */
  Caption: string;
  /** Type PG: timestamp without time zone */
  StartDate: Date;
  /** Type PG: timestamp without time zone */
  EndDate: Date;
  /** Type PG: integer */
  Status: number;
  /** Type PG: character varying | Max length: 10 */
  DealId?: string;
  /** Type PG: smallint */
  DeliveryAddressType: number;
  /** Type PG: smallint */
  ManagementStockType: number;
  /** Type PG: uuid */
  StorehouseId?: string;
  /** Type PG: text */
  Description?: string;
  /** Type PG: text */
  DescriptionClear?: string;
  /** Type PG: character varying | Max length: 20 */
  CustomerId: string;
  /** Type PG: boolean */
  UseConstructionSiteAddressAsDeliveryAddressForSales: boolean;
  /** Type PG: uuid */
  ConstructionSiteAddressId?: string;
  /** Type PG: character varying | Max length: 40 */
  ConstructionSiteAddress_Address1?: string;
  /** Type PG: character varying | Max length: 40 */
  ConstructionSiteAddress_Address2?: string;
  /** Type PG: character varying | Max length: 40 */
  ConstructionSiteAddress_Address3?: string;
  /** Type PG: character varying | Max length: 40 */
  ConstructionSiteAddress_Address4?: string;
  /** Type PG: character varying | Max length: 10 */
  ConstructionSiteAddress_ZipCode?: string;
  /** Type PG: character varying | Max length: 35 */
  ConstructionSiteAddress_City: string;
  /** Type PG: character varying | Max length: 50 */
  ConstructionSiteAddress_State?: string;
  /** Type PG: character varying | Max length: 3 */
  ConstructionSiteAddress_CountryIsoCode: string;
  /** Type PG: character varying | Max length: 50 */
  ConstructionSiteAddress_Description?: string;
  /** Type PG: character varying | Max length: 25 */
  ConstructionSiteAddress_Civility?: string;
  /** Type PG: character varying | Max length: 60 */
  ConstructionSiteAddress_ThirdName?: string;
  /** Type PG: boolean */
  ConstructionSiteAddress_Npai: boolean;
  /** Type PG: character varying | Max length: 100 */
  ConstructionSiteAddress_WebSite?: string;
  /** Type PG: numeric */
  ConstructionSiteAddress_Longitude?: number;
  /** Type PG: numeric */
  ConstructionSiteAddress_Latitude?: number;
  /** Type PG: uuid */
  InvoicingAddressId?: string;
  /** Type PG: character varying | Max length: 40 */
  InvoicingAddress_Address1?: string;
  /** Type PG: character varying | Max length: 40 */
  InvoicingAddress_Address2?: string;
  /** Type PG: character varying | Max length: 40 */
  InvoicingAddress_Address3?: string;
  /** Type PG: character varying | Max length: 40 */
  InvoicingAddress_Address4?: string;
  /** Type PG: character varying | Max length: 10 */
  InvoicingAddress_ZipCode?: string;
  /** Type PG: character varying | Max length: 35 */
  InvoicingAddress_City: string;
  /** Type PG: character varying | Max length: 50 */
  InvoicingAddress_State?: string;
  /** Type PG: character varying | Max length: 3 */
  InvoicingAddress_CountryIsoCode: string;
  /** Type PG: character varying | Max length: 50 */
  InvoicingAddress_Description?: string;
  /** Type PG: character varying | Max length: 25 */
  InvoicingAddress_Civility?: string;
  /** Type PG: character varying | Max length: 60 */
  InvoicingAddress_ThirdName?: string;
  /** Type PG: boolean */
  InvoicingAddress_Npai: boolean;
  /** Type PG: character varying | Max length: 100 */
  InvoicingAddress_WebSite?: string;
  /** Type PG: numeric */
  InvoicingAddress_Longitude?: number;
  /** Type PG: numeric */
  InvoicingAddress_Latitude?: number;
  /** Type PG: numeric */
  GlobalCost: number;
  /** Type PG: numeric */
  TotalGrossInterestAmount: number;
  /** Type PG: numeric */
  GrossInterestTotalRate: number;
  /** Type PG: numeric */
  TotalBrandRate: number;
  /** Type PG: integer */
  sysEditCounter?: number;
  /** Type PG: character varying | Max length: 10 */
  ConstructionSiteAddress_CodeINSEE?: string;
  /** Type PG: character varying | Max length: 50 */
  ConstructionSiteAddress_CityINSEE?: string;
  /** Type PG: character varying | Max length: 10 */
  InvoicingAddress_CodeINSEE?: string;
  /** Type PG: character varying | Max length: 50 */
  InvoicingAddress_CityINSEE?: string;
  /** Type PG: boolean */
  HasAssociatedFiles: boolean;
}

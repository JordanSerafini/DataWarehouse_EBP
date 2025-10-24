# AUDIT COMPLET DE LA BASE DE DONNÉES EBP

Date d'analyse: 23/10/2025 09:23:14

---

## 1. VUE D'ENSEMBLE

- **Nombre total de tables**: 319
- **Nombre total de colonnes**: 9919
- **Nombre total de lignes**: 670 349

## 2. RÉPARTITION PAR DOMAINE MÉTIER

| Domaine | Nombre de tables | Total de lignes |
|---------|------------------|----------------|
| Ventes | 55 | 275 340 |
| Stock | 36 | 100 664 |
| Achats | 20 | 95 619 |
| Planification | 11 | 65 095 |
| Autre | 86 | 55 832 |
| Référentiels | 11 | 39 193 |
| Système | 59 | 28 105 |
| Comptabilité | 11 | 8 505 |
| Chantiers | 6 | 1 680 |
| Maintenance | 11 | 270 |
| Ressources Humaines | 10 | 46 |
| Analytique | 3 | 0 |

## 3. TOP 30 TABLES PAR VOLUMÉTRIE

| Table | Domaine | Lignes | Colonnes | Score |
|-------|---------|--------|----------|-------|
| SaleDocumentLine | Ventes | 112 684 | 336 | 18 |
| ItemAccount | Stock | 72 428 | 11 | 15 |
| Activity | Planification | 44 145 | 46 | 5 |
| Zipcode | Référentiels | 38 893 | 19 | 5 |
| PurchaseDocumentLine | Achats | 38 887 | 281 | 18 |
| DocumentLineAssociation | Autre | 33 249 | 13 | 5 |
| DealSaleDocumentLine | Ventes | 29 551 | 28 | 15 |
| SaleDocument | Ventes | 23 837 | 538 | 18 |
| SaleDocumentEx | Ventes | 23 837 | 304 | 18 |
| SaleCommitment | Ventes | 15 924 | 60 | 15 |
| SaleSettlementCommitmentAssociation | Ventes | 15 516 | 23 | 15 |
| SaleSettlement | Ventes | 12 962 | 79 | 15 |
| EventLog | Autre | 12 500 | 11 | 5 |
| PurchaseDocument | Achats | 12 477 | 508 | 18 |
| PurchaseDocumentEx | Achats | 12 477 | 135 | 18 |
| StockMovement | Stock | 12 158 | 38 | 15 |
| ScheduleEvent | Planification | 11 935 | 280 | 8 |
| EbpSysDataHash | Système | 10 553 | 5 | 0 |
| DealSaleDocument | Ventes | 9 882 | 33 | 13 |
| PurchaseCommitment | Achats | 8 603 | 42 | 13 |
| PurchaseSettlementCommitmentAssociation | Achats | 8 082 | 19 | 13 |
| EbpSysDeletedRecord | Système | 7 818 | 8 | 0 |
| StockItem | Stock | 6 831 | 32 | 13 |
| DealItem | Ventes | 6 428 | 18 | 13 |
| DealPurchaseDocumentLine | Ventes | 5 572 | 28 | 13 |
| PurchaseSettlement | Achats | 5 183 | 59 | 13 |
| ScheduleEventExpectedResource | Planification | 5 097 | 19 | 3 |
| SupplierItem | Achats | 5 007 | 32 | 13 |
| DealSaleSettlement | Ventes | 4 991 | 16 | 13 |
| BankRemittance | Comptabilité | 4 901 | 36 | 3 |

## 4. TOP 30 TABLES PAR COMPLEXITÉ (Nombre de colonnes)

| Table | Domaine | Colonnes | Lignes | Score |
|-------|---------|----------|--------|-------|
| SaleDocument | Ventes | 538 | 23 837 | 18 |
| ConstructionSiteReferenceDocument | Chantiers | 515 | 268 | 4 |
| PurchaseDocument | Achats | 508 | 12 477 | 18 |
| ConstructionSiteReferenceDocumentLine | Chantiers | 339 | 872 | 4 |
| SaleDocumentLine | Ventes | 336 | 112 684 | 18 |
| SaleDocumentEx | Ventes | 304 | 23 837 | 18 |
| ConstructionSiteReferenceDocumentEx | Chantiers | 303 | 268 | 4 |
| PurchaseDocumentLine | Achats | 281 | 38 887 | 18 |
| ScheduleEvent | Planification | 280 | 11 935 | 8 |
| Item | Stock | 245 | 3 837 | 16 |
| Customer | Ventes | 204 | 1 338 | 16 |
| RangeItem | Stock | 201 | 0 | 13 |
| Supplier | Achats | 147 | 268 | 14 |
| PurchaseDocumentEx | Achats | 135 | 12 477 | 18 |
| MaintenanceContract | Maintenance | 124 | 268 | 4 |
| Colleague | Ressources Humaines | 102 | 31 | 3 |
| StockDocumentLine | Stock | 91 | 3 163 | 13 |
| Bank | Comptabilité | 85 | 2 | 0 |
| Contact | Autre | 84 | 2 615 | 3 |
| ConstructionSite | Chantiers | 84 | 272 | 1 |
| MaintenanceContractTemplate | Maintenance | 81 | 2 | 0 |
| SaleSettlement | Ventes | 79 | 12 962 | 15 |
| CustomerProduct | Ventes | 78 | 405 | 11 |
| Incident | Maintenance | 69 | 0 | 0 |
| StockDocument | Stock | 67 | 245 | 11 |
| ColleagueFamily | Ressources Humaines | 63 | 1 | 5 |
| SaleCommitment | Ventes | 60 | 15 924 | 15 |
| PurchaseSettlement | Achats | 59 | 5 183 | 13 |
| ItemFamily | Stock | 58 | 51 | 15 |
| Deal | Ventes | 54 | 1 493 | 3 |

## 5. TABLES CRITIQUES (Score d'importance > 10)

| Table | Domaine | Score | Lignes | Colonnes |
|-------|---------|-------|--------|----------|
| SaleDocument | Ventes | 18 | 23 837 | 538 |
| PurchaseDocument | Achats | 18 | 12 477 | 508 |
| SaleDocumentLine | Ventes | 18 | 112 684 | 336 |
| SaleDocumentEx | Ventes | 18 | 23 837 | 304 |
| PurchaseDocumentLine | Achats | 18 | 38 887 | 281 |
| PurchaseDocumentEx | Achats | 18 | 12 477 | 135 |
| Item | Stock | 16 | 3 837 | 245 |
| Customer | Ventes | 16 | 1 338 | 204 |
| ItemFamilyAccount | Stock | 16 | 168 | 13 |
| ItemSubFamily | Stock | 16 | 135 | 11 |
| SaleSettlement | Ventes | 15 | 12 962 | 79 |
| SaleCommitment | Ventes | 15 | 15 924 | 60 |
| ItemFamily | Stock | 15 | 51 | 58 |
| StockMovement | Stock | 15 | 12 158 | 38 |
| CustomerFamily | Ventes | 15 | 3 | 36 |
| SupplierFamily | Achats | 15 | 0 | 31 |
| DealSaleDocumentLine | Ventes | 15 | 29 551 | 28 |
| SaleSettlementCommitmentAssociation | Ventes | 15 | 15 516 | 23 |
| CustomerSubFamily | Ventes | 15 | 1 | 14 |
| SupplierSubFamily | Achats | 15 | 0 | 14 |
| PosTerminalOpenCloseItemFamilyDetail | Stock | 15 | 0 | 12 |
| PosTerminalOpenCloseSaleInAccountPaymentTypeDetail | Ventes | 15 | 0 | 12 |
| ItemAccount | Stock | 15 | 72 428 | 11 |
| CustomerFamilyCustomReport | Ventes | 15 | 0 | 10 |
| SupplierFamilyCustomReport | Achats | 15 | 0 | 10 |
| ItemFamilyVatTerritoriality | Stock | 15 | 0 | 9 |
| CustomerProductFamily | Ventes | 15 | 1 | 8 |
| Supplier | Achats | 14 | 268 | 147 |
| RangeItem | Stock | 13 | 0 | 201 |
| StockDocumentLine | Stock | 13 | 3 163 | 91 |
| PurchaseSettlement | Achats | 13 | 5 183 | 59 |
| PurchaseCommitment | Achats | 13 | 8 603 | 42 |
| DealSaleDocument | Ventes | 13 | 9 882 | 33 |
| StockItem | Stock | 13 | 6 831 | 32 |
| SupplierItem | Achats | 13 | 5 007 | 32 |
| DealPurchaseDocumentLine | Ventes | 13 | 5 572 | 28 |
| DealPurchaseDocument | Ventes | 13 | 2 741 | 24 |
| PurchaseDocumentLineTrackingDispatch | Achats | 13 | 1 779 | 23 |
| PurchaseSettlementCommitmentAssociation | Achats | 13 | 8 082 | 19 |
| DealItem | Ventes | 13 | 6 428 | 18 |
| TrackingStockItem | Stock | 13 | 1 338 | 18 |
| DealSaleSettlement | Ventes | 13 | 4 991 | 16 |
| DealPurchaseSettlement | Ventes | 13 | 1 070 | 16 |
| PurchaseDocumentAssociatedFiles | Achats | 13 | 2 762 | 15 |
| SaleDocumentAssociatedFiles | Ventes | 13 | 1 165 | 15 |
| DealCustomer | Ventes | 13 | 1 535 | 13 |
| CustomerProduct | Ventes | 11 | 405 | 78 |
| StockDocument | Stock | 11 | 245 | 67 |
| StockDocumentLineTrackingDispatch | Stock | 11 | 144 | 26 |
| SaleDocumentLineTrackingDispatch | Ventes | 11 | 967 | 23 |
| PeriodicInvoicingCustomer | Ventes | 11 | 683 | 19 |
| CustomerAssociatedFiles | Ventes | 11 | 210 | 15 |
| LinkedItem | Stock | 11 | 103 | 15 |
| DealSupplier | Ventes | 11 | 658 | 11 |

## 6. DÉTAIL PAR DOMAINE MÉTIER

### Ventes

**Nombre de tables**: 55

| Table | Lignes | Colonnes | Score |
|-------|--------|----------|-------|
| SaleDocumentLine | 112 684 | 336 | 18 |
| DealSaleDocumentLine | 29 551 | 28 | 15 |
| SaleDocument | 23 837 | 538 | 18 |
| SaleDocumentEx | 23 837 | 304 | 18 |
| SaleCommitment | 15 924 | 60 | 15 |
| SaleSettlementCommitmentAssociation | 15 516 | 23 | 15 |
| SaleSettlement | 12 962 | 79 | 15 |
| DealSaleDocument | 9 882 | 33 | 13 |
| DealItem | 6 428 | 18 | 13 |
| DealPurchaseDocumentLine | 5 572 | 28 | 13 |
| DealSaleSettlement | 4 991 | 16 | 13 |
| DealPurchaseDocument | 2 741 | 24 | 13 |
| DealCustomer | 1 535 | 13 | 13 |
| Deal | 1 493 | 54 | 3 |
| DealColleague | 1 490 | 12 | 3 |

### Stock

**Nombre de tables**: 36

| Table | Lignes | Colonnes | Score |
|-------|--------|----------|-------|
| ItemAccount | 72 428 | 11 | 15 |
| StockMovement | 12 158 | 38 | 15 |
| StockItem | 6 831 | 32 | 13 |
| Item | 3 837 | 245 | 16 |
| StockDocumentLine | 3 163 | 91 | 13 |
| TrackingStockItem | 1 338 | 18 | 13 |
| StockDocument | 245 | 67 | 11 |
| ItemFamilyAccount | 168 | 13 | 16 |
| StockDocumentLineTrackingDispatch | 144 | 26 | 11 |
| ItemSubFamily | 135 | 11 | 16 |
| LinkedItem | 103 | 15 | 11 |
| ItemComponent | 54 | 36 | 10 |
| ItemFamily | 51 | 58 | 15 |
| ItemAssociatedFiles | 7 | 15 | 10 |
| StockDocumentAssociatedFiles | 2 | 15 | 10 |

### Achats

**Nombre de tables**: 20

| Table | Lignes | Colonnes | Score |
|-------|--------|----------|-------|
| PurchaseDocumentLine | 38 887 | 281 | 18 |
| PurchaseDocument | 12 477 | 508 | 18 |
| PurchaseDocumentEx | 12 477 | 135 | 18 |
| PurchaseCommitment | 8 603 | 42 | 13 |
| PurchaseSettlementCommitmentAssociation | 8 082 | 19 | 13 |
| PurchaseSettlement | 5 183 | 59 | 13 |
| SupplierItem | 5 007 | 32 | 13 |
| PurchaseDocumentAssociatedFiles | 2 762 | 15 | 13 |
| PurchaseDocumentLineTrackingDispatch | 1 779 | 23 | 13 |
| Supplier | 268 | 147 | 14 |
| PurchaseDocumentComplementaryDiscount | 92 | 15 | 10 |
| SupplierAssociatedFiles | 2 | 15 | 10 |
| IncidentPurchaseDocument | 0 | 8 | 10 |
| MaintenanceContractPurchaseDocument | 0 | 8 | 10 |
| PurchaseDocumentLineAnalyticAffectation | 0 | 9 | 10 |

### Planification

**Nombre de tables**: 11

| Table | Lignes | Colonnes | Score |
|-------|--------|----------|-------|
| Activity | 44 145 | 46 | 5 |
| ScheduleEvent | 11 935 | 280 | 8 |
| ScheduleEventExpectedResource | 5 097 | 19 | 3 |
| ActivityAssociatedFiles | 3 908 | 15 | 3 |
| ScheduleEventType | 8 | 15 | 5 |
| ScheduleEventTemplate | 1 | 17 | 0 |
| ScheduleEventTemplateResource | 1 | 14 | 0 |
| ScheduleEventAssociatedFiles | 0 | 15 | 0 |
| ScheduleEventOutlookSynchronization | 0 | 9 | 0 |
| ScheduleEventTemplateExpectedResource | 0 | 13 | 0 |
| ScheduleEventTypeResource | 0 | 8 | 5 |

### Autre

**Nombre de tables**: 86

| Table | Lignes | Colonnes | Score |
|-------|--------|----------|-------|
| DocumentLineAssociation | 33 249 | 13 | 5 |
| EventLog | 12 500 | 11 | 5 |
| ThirdReference | 3 622 | 13 | 3 |
| Contact | 2 615 | 84 | 3 |
| Address | 1 627 | 30 | 3 |
| Naf | 736 | 15 | 1 |
| PeriodicInvoicing | 690 | 47 | 1 |
| Ecotax | 107 | 27 | 1 |
| States | 106 | 17 | 1 |
| EconomicReason | 102 | 13 | 1 |
| xyx_FACTUP_PeriodicInvoicesToComplete | 97 | 6 | 0 |
| Vat | 78 | 49 | 0 |
| ReminderLetter | 50 | 15 | 0 |
| BuyerReference | 30 | 9 | 0 |
| PriceListInclusionLine | 28 | 12 | 0 |

### Référentiels

**Nombre de tables**: 11

| Table | Lignes | Colonnes | Score |
|-------|--------|----------|-------|
| Zipcode | 38 893 | 19 | 5 |
| Country | 227 | 18 | 1 |
| Civility | 27 | 15 | 0 |
| ServiceType | 27 | 8 | 5 |
| PaymentType | 19 | 30 | 5 |
| EquipmentFamily | 0 | 11 | 5 |
| EquipmentType | 0 | 9 | 5 |
| GuaranteeType | 0 | 20 | 5 |
| LoyaltyCardType | 0 | 19 | 5 |
| PosTerminalOpenClosePaymentTypeDetail | 0 | 12 | 5 |
| PriceListCategory | 0 | 14 | 5 |

### Système

**Nombre de tables**: 59

| Table | Lignes | Colonnes | Score |
|-------|--------|----------|-------|
| EbpSysDataHash | 10 553 | 5 | 0 |
| EbpSysDeletedRecord | 7 818 | 8 | 0 |
| EbpSysAsynchronousLog | 3 344 | 11 | 0 |
| EbpSysWinForm | 1 221 | 7 | 0 |
| EbpSysReport | 908 | 22 | 0 |
| EbpSysRight | 884 | 10 | 0 |
| EbpSysOptions | 499 | 7 | 0 |
| EbpSysWinListTemplate | 466 | 13 | 0 |
| EbpSysSaveLog | 418 | 9 | 0 |
| EbpSysDefaultReport | 377 | 10 | 0 |
| EbpSysRightColumn | 358 | 9 | 0 |
| EbpSysWinListView | 314 | 10 | 0 |
| EbpSysWinGridTemplate | 187 | 15 | 0 |
| EbpSysWinList | 128 | 7 | 0 |
| EbpSysWinLayoutDefaultTemplate | 92 | 11 | 0 |

### Comptabilité

**Nombre de tables**: 11

| Table | Lignes | Colonnes | Score |
|-------|--------|----------|-------|
| BankRemittance | 4 901 | 36 | 3 |
| AccountingExchangeGroup | 1 468 | 11 | 3 |
| AccountingExchangeGroupProcessDetail | 1 468 | 9 | 3 |
| ReminderCommitment | 362 | 17 | 1 |
| ThirdBankAccountDetail | 218 | 28 | 1 |
| SettlementModeLine | 42 | 14 | 5 |
| SettlementMode | 34 | 18 | 5 |
| MaintenanceContractCommitment | 9 | 11 | 0 |
| Bank | 2 | 85 | 0 |
| AccountingYear | 1 | 14 | 0 |
| UnpaidSettlementReason | 0 | 8 | 0 |

### Chantiers

**Nombre de tables**: 6

| Table | Lignes | Colonnes | Score |
|-------|--------|----------|-------|
| ConstructionSiteReferenceDocumentLine | 872 | 339 | 4 |
| ConstructionSite | 272 | 84 | 1 |
| ConstructionSiteReferenceDocument | 268 | 515 | 4 |
| ConstructionSiteReferenceDocumentEx | 268 | 303 | 4 |
| ConstructionSiteAssociatedFiles | 0 | 15 | 0 |
| ConstructionSiteReferenceDocumentLineTrackingDispatch | 0 | 23 | 0 |

### Maintenance

**Nombre de tables**: 11

| Table | Lignes | Colonnes | Score |
|-------|--------|----------|-------|
| MaintenanceContract | 268 | 124 | 4 |
| MaintenanceContractTemplate | 2 | 81 | 0 |
| Incident | 0 | 69 | 0 |
| IncidentAssociatedFiles | 0 | 15 | 0 |
| IncidentExtraCost | 0 | 16 | 0 |
| IncidentTemplate | 0 | 11 | 0 |
| IncidentTemplateExtraCost | 0 | 16 | 0 |
| MaintenanceContractAssociatedFiles | 0 | 15 | 0 |
| MaintenanceContractCost | 0 | 16 | 0 |
| MaintenanceContractFamily | 0 | 8 | 5 |
| MaintenanceContractInvoiceContentLine | 0 | 24 | 0 |

### Ressources Humaines

**Nombre de tables**: 10

| Table | Lignes | Colonnes | Score |
|-------|--------|----------|-------|
| Colleague | 31 | 102 | 3 |
| ColleagueFunction | 10 | 14 | 0 |
| CommissionScaleColleagueLine | 4 | 9 | 0 |
| ColleagueFamily | 1 | 63 | 5 |
| ColleagueAssociatedFiles | 0 | 15 | 0 |
| ColleagueCompetence | 0 | 13 | 0 |
| ColleagueWebSynchronizationInfo | 0 | 8 | 0 |
| PayrollExchangeGroup | 0 | 9 | 0 |
| PayrollExchangeGroupProcessDetail | 0 | 9 | 0 |
| PosTerminalOpenCloseColleagueDetail | 0 | 11 | 0 |

### Analytique

**Nombre de tables**: 3

| Table | Lignes | Colonnes | Score |
|-------|--------|----------|-------|
| AnalyticGrid | 0 | 12 | 0 |
| AnalyticGridLine | 0 | 9 | 0 |
| AnalyticPlan | 0 | 15 | 0 |

## 7. RELATIONS POTENTIELLES DÉTECTÉES

Analyse basée sur les noms de colonnes se terminant par "Id".

| Table source | Colonne | Table référencée (potentielle) |
|--------------|---------|-------------------------------|
| AccountingExchangeGroupProcessDetail | AccountingExchangeGroupId | Accountingexchangegroup |
| AccountingYear | SynchronizationUniqueId | Synchronizationunique |
| Activity | Contact_ExternalId_GoogleId | Contactexternalidgoogle |
| Activity | Contact_ExternalId_OutlookId | Contactexternalidoutlook |
| Activity | CustomerId | Customer |
| Activity | SupplierId | Supplier |
| Activity | ContactId | Contact |
| Activity | IncidentId | Incident |
| Activity | MaintenanceContractId | Maintenancecontract |
| Activity | ReminderLetterId | Reminderletter |
| Activity | SaleDocumentId | Saledocument |
| Activity | PurchaseDocumentId | Purchasedocument |
| Activity | ScheduleEventId | Scheduleevent |
| Activity | ColleagueId | Colleague |
| Activity | DealId | Deal |
| Activity | CreatorColleagueId | Creatorcolleague |
| Activity | ConstructionSiteId | Constructionsite |
| ActivityAssociatedFiles | ParentId | Parent |
| ActivityAssociatedFiles | OneDriveItemId | Onedriveitem |
| Address | AssociatedCustomerId | Associatedcustomer |
| Address | AssociatedSupplierId | Associatedsupplier |
| AnalyticGridLine | AnalyticGridId | Analyticgrid |
| AnalyticPlan | WaitingPlanItemId | Waitingplanitem |
| AnalyticPlanItem | PlanId | Plan |
| AnalyticPlanItem | ParentId | Parent |
| AttachmentFile | ParentId | Parent |
| AttachmentFile | OneDriveItemId | Onedriveitem |
| Bank | CurrencyId | Currency |
| Bank | DocumentSerialId | Documentserial |
| BankRemittance | BankId | Bank |
| BankRemittance | PaymentTypeId | Paymenttype |
| BankRemittance | LastSepaMessageId | Lastsepamessage |
| BankRemittance | CurrencyId | Currency |
| BankRemittance | AccountingExchangeGroupId | Accountingexchangegroup |
| BankRemittance | ChargesAccountingEntryId | Chargesaccountingentry |
| CashMovement | SourceSafeId | Sourcesafe |
| CashMovement | TargetSafeId | Targetsafe |
| CashMovement | SourceTerminalId | Sourceterminal |
| CashMovement | TargetTerminalId | Targetterminal |
| CashMovement | SourceTerminalOpenCloseId | Sourceterminalopenclose |
| CashMovement | TargetTerminalOpenCloseId | Targetterminalopenclose |
| CashMovement | AccountingExchangeGroupId | Accountingexchangegroup |
| CashMovement | BankRemittanceId | Bankremittance |
| ClassificationGroup | AnalyticAccounting_GridId | Analyticaccountinggrid |
| Colleague | ReferenceItemId | Referenceitem |
| Colleague | EmployeePayrollId | Employeepayroll |
| Colleague | DocumentSerialId | Documentserial |
| Colleague | AnalyticAccounting_GridId | Analyticaccountinggrid |
| Colleague | UserId | User |
| Colleague | ColleagueFamilyId | Colleaguefamily |
| Colleague | StorehouseId | Storehouse |
| ColleagueAssociatedFiles | ParentId | Parent |
| ColleagueAssociatedFiles | OneDriveItemId | Onedriveitem |
| ColleagueCompetence | ColleagueId | Colleague |
| ColleagueCompetence | CompetenceId | Competence |
| ColleagueFamily | AnalyticAccounting_GridId | Analyticaccountinggrid |
| ColleagueFamily | DocumentSerialId | Documentserial |
| ColleagueWebSynchronizationInfo | ParentId | Parent |
| CommissionScaleColleagueLine | CommissionScaleId | Commissionscale |
| CommissionScaleColleagueLine | ColleagueId | Colleague |
| CommissionScaleColleagueLine | ColleagueFamilyId | Colleaguefamily |
| CommissionScaleSelectionLine | CommissionScaleId | Commissionscale |
| CommissionScaleStageLine | CommissionScaleId | Commissionscale |
| ConstructionSite | AnalyticAccounting_GridId | Analyticaccountinggrid |
| ConstructionSite | ReferenceDocumentId | Referencedocument |
| ConstructionSite | ConstructionSiteReferenceDocumentId | Constructionsitereferencedocument |
| ConstructionSite | DealId | Deal |
| ConstructionSite | StorehouseId | Storehouse |
| ConstructionSite | CustomerId | Customer |
| ConstructionSite | ConstructionSiteAddressId | Constructionsiteaddress |
| ConstructionSite | InvoicingAddressId | Invoicingaddress |
| ConstructionSiteAssociatedFiles | ParentId | Parent |
| ConstructionSiteAssociatedFiles | OneDriveItemId | Onedriveitem |
| ConstructionSiteReferenceDocument | StorehouseId | Storehouse |
| ConstructionSiteReferenceDocument | TransferedDocumentId | Transfereddocument |
| ConstructionSiteReferenceDocument | DealId | Deal |
| ConstructionSiteReferenceDocument | SerialId | Serial |
| ConstructionSiteReferenceDocument | MaintenanceContractId | Maintenancecontract |
| ConstructionSiteReferenceDocument | IncidentId | Incident |
| ConstructionSiteReferenceDocument | ConstructionSiteId | Constructionsite |
| ConstructionSiteReferenceDocument | Hash_ChainedId | Hashchained |
| ConstructionSiteReferenceDocument | AssociatedInvoiceId | Associatedinvoice |
| ConstructionSiteReferenceDocument | AssociatedDeliveryOrderId | Associateddeliveryorder |
| ConstructionSiteReferenceDocument | AssociatedOrderId | Associatedorder |
| ConstructionSiteReferenceDocument | TerritorialityId | Territoriality |
| ConstructionSiteReferenceDocument | VatId | Vat |
| ConstructionSiteReferenceDocument | InvoicingAddressId | Invoicingaddress |
| ConstructionSiteReferenceDocument | InvoicingContactId | Invoicingcontact |
| ConstructionSiteReferenceDocument | DeliveryAddressId | Deliveryaddress |
| ConstructionSiteReferenceDocument | DeliveryContactId | Deliverycontact |
| ConstructionSiteReferenceDocument | SettlementModeId | Settlementmode |
| ConstructionSiteReferenceDocument | ShippingId | Shipping |
| ConstructionSiteReferenceDocument | ShippingVatId | Shippingvat |
| ConstructionSiteReferenceDocument | DetailVatAmount0_DetailVatId | Detailvatamount0detailvat |
| ConstructionSiteReferenceDocument | DetailVatAmount1_DetailVatId | Detailvatamount1detailvat |
| ConstructionSiteReferenceDocument | DetailVatAmount2_DetailVatId | Detailvatamount2detailvat |
| ConstructionSiteReferenceDocument | DetailVatAmount3_DetailVatId | Detailvatamount3detailvat |
| ConstructionSiteReferenceDocument | DetailVatAmount4_DetailVatId | Detailvatamount4detailvat |
| ConstructionSiteReferenceDocument | DetailVatAmount5_DetailVatId | Detailvatamount5detailvat |
| ConstructionSiteReferenceDocument | PaymentTypeId | Paymenttype |

**Note**: 100 relations potentielles détectées (affichage limité à 100)


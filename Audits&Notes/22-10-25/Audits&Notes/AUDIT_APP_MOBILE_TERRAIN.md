# AUDIT POUR APPLICATION MOBILE TERRAIN
## EBP - Solution Ticketing & Interventions

Date d'analyse: 23/10/2025

---

## 1. CONTEXTE & OBJECTIFS

### Besoin métier
Application mobile orientée terrain pour la gestion :
- **Tickets** et incidents
- **Interventions** sur site
- **Maintenance** préventive et curative
- **Chantiers** et suivi de travaux
- **Relation client** en mobilité

### Critères de sélection des données
- Tables avec volumétrie significative
- Données utilisables en mode déconnecté
- Informations pertinentes pour techniciens terrain
- Capacité de synchronisation bidirectionnelle

---

## 2. TABLES CRITIQUES POUR L'APP MOBILE

### 2.1 CORE - Interventions & Tickets (Priorité HAUTE)

#### ScheduleEvent - Événements planifiés (11 935 lignes, 280 colonnes)
**Usage**: Rendez-vous, interventions planifiées
- Score d'importance: 8
- Domaine: Planification
- **Colonnes clés à conserver**:
  - Identifiants: `UniqueId`, `Id`
  - Dates: `StartDate`, `EndDate`, `CreationDate`
  - Statut: `State`, `ActiveState`, `Type`
  - Client: `CustomerId`, `CustomerName`
  - Localisation: `Address`, `City`, `ZipCode`, `GPS coordinates` (si disponibles)
  - Technicien: `ColleagueId`, `ResourceIds`
  - Description: `Subject`, `Description`, `NotesClear`
  - Contact: `ContactId`, `ContactName`, `ContactPhone`, `ContactEmail`

**Recommandations**:
- ✅ Réduire de 280 → 40-50 colonnes pour l'app mobile
- ✅ Indexer sur `StartDate`, `CustomerId`, `ColleagueId`
- ✅ Ajouter champ `sync_status` pour gestion offline

#### Incident - Tickets et demandes (0 lignes actuellement, 69 colonnes)
**Usage**: Gestion des incidents et tickets SAV
- Score: 0 (table vide mais structure importante)
- Domaine: Maintenance
- **Colonnes clés**:
  - Identifiants: `Id`, `UniqueId`
  - Priorité: `Priority`, `Severity`, `Type`
  - Statut: `State`, `StateDate`
  - Client: `CustomerId`, `CustomerProductId`
  - Assignation: `AssignedTo`, `ColleagueId`
  - Dates: `CreationDate`, `ResolutionDate`, `DueDate`
  - Description: `Title`, `Description`, `Resolution`

**Recommandations**:
- ✅ Activer et utiliser cette table pour le ticketing
- ✅ Réduire à 30-35 colonnes essentielles
- ✅ Ajouter champs: `latitude`, `longitude`, `photo_ids`, `signature`

#### Activity - Historique d'activités (44 145 lignes, 46 colonnes)
**Usage**: Historique des interactions clients
- Score: 5
- **Colonnes clés**:
  - Type: `Type`, `ActivityType`
  - Dates: `ActivityDate`, `ActivityEndDate`
  - Entité liée: `LinkedEntityType`, `LinkedEntityId`
  - Description: `Subject`, `Comment`
  - Assigné: `AssignedToId`

**Recommandations**:
- ✅ Table déjà optimisée (46 colonnes)
- ✅ Filtrer sur les 6 derniers mois pour sync mobile
- ✅ Read-only sur mobile

### 2.2 CLIENTS & CONTACTS (Priorité HAUTE)

#### Customer - Clients (1 338 lignes, 204 colonnes)
**Usage**: Informations clients
- Score: 16
- **Colonnes critiques pour mobile** (25-30 colonnes):
  - `Id`, `Name`, `Type`
  - `MainInvoicingContact_*`: Name, Phone, CellPhone, Email
  - `MainDeliveryContact_*`: Name, Phone, Email
  - `MainInvoicingAddress_*`: Address1-4, ZipCode, City
  - `MainDeliveryAddress_*`: Address1-4, ZipCode, City
  - `MainDeliveryAddress_Latitude`, `MainDeliveryAddress_Longitude`
  - `NotesClear`
  - `ActiveState`

**Recommandations**:
- ✅ Réduire 204 → 30 colonnes pour mobile
- ✅ **CRITIQUE**: Ajouter latitude/longitude si absentes
- ✅ Dénormaliser contacts principaux
- ✅ Sync complète (faible volumétrie)

#### Contact - Contacts (2 615 lignes, 84 colonnes)
**Usage**: Contacts clients/chantiers
- **Colonnes mobile** (20 colonnes):
  - `Id`, `CustomerId`, `Name`, `FirstName`
  - `Phone`, `CellPhone`, `Email`
  - `Function`, `Department`
  - `NaturalPerson`, `OptIn`

**Recommandations**:
- ✅ Réduire 84 → 20 colonnes
- ✅ Relation forte avec Customer et ScheduleEvent

#### CustomerProduct - Produits clients (405 lignes, 78 colonnes)
**Usage**: Équipements installés chez clients
- Score: 11
- **Colonnes mobile** (25 colonnes):
  - `Id`, `CustomerId`, `ItemId`
  - `SerialNumber`, `InstallationDate`
  - `GuaranteeStartDate`, `GuaranteeEndDate`
  - `MaintenanceContractId`
  - `State`, `Location`
  - `NotesClear`

**Recommandations**:
- ✅ Essentiel pour interventions maintenance
- ✅ Lien avec MaintenanceContract

### 2.3 MAINTENANCE & CHANTIERS (Priorité MOYENNE)

#### MaintenanceContract - Contrats (268 lignes, 124 colonnes)
**Usage**: Contrats de maintenance actifs
- **Colonnes mobile** (20 colonnes):
  - `Id`, `CustomerId`, `State`
  - `StartDate`, `EndDate`, `RenewalDate`
  - `Type`, `Reference`
  - Liste des équipements couverts

**Recommandations**:
- ✅ Sync uniquement contrats actifs
- ✅ Réduire à 20 colonnes

#### ConstructionSite - Chantiers (272 lignes, 84 colonnes)
**Usage**: Gestion de chantiers
- **Colonnes mobile** (25-30 colonnes):
  - `Id`, `Name`, `Reference`
  - `CustomerId`, `State`
  - `Address_*`, `City`, `ZipCode`
  - `Latitude`, `Longitude` (à ajouter si absent)
  - `StartDate`, `EndDate`
  - `NotesClear`

**Recommandations**:
- ✅ Géolocalisation OBLIGATOIRE
- ✅ Réduire à 30 colonnes

### 2.4 PRODUITS & STOCK (Priorité BASSE)

#### Item - Articles (3 837 lignes, 245 colonnes)
**Usage**: Catalogue produits/pièces
- **Colonnes mobile** (15-20 colonnes):
  - `Id`, `Name`, `Reference`
  - `ItemFamilyId`, `ItemSubFamilyId`
  - `Type`, `ActiveState`
  - `SellingPriceVatExcluded`, `SellingPriceVatIncluded`
  - `StockLevel` (si pertinent)
  - Photo/Image principale

**Recommandations**:
- ✅ Catalogue read-only
- ✅ Sync partielle (produits fréquents uniquement)
- ✅ Réduire drastiquement: 245 → 20 colonnes

#### StockItem - Stock par dépôt (6 831 lignes, 32 colonnes)
**Usage**: Disponibilité stock
- **Colonnes mobile** (10 colonnes):
  - `ItemId`, `StorehouseId`
  - `RealStock`, `TheoreticalStock`
  - `MinStock`, `MaxStock`

**Recommandations**:
- ✅ Read-only
- ✅ Sync uniquement stocks principaux

### 2.5 DOCUMENTS & FICHIERS (Priorité MOYENNE)

#### *AssociatedFiles - Fichiers joints
Tables concernées:
- `ScheduleEventAssociatedFiles` (36 colonnes)
- `ActivityAssociatedFiles` (15 colonnes)
- `ContactAssociatedFiles` (36 colonnes)
- `CustomerAssociatedFiles` (36 colonnes)
- `IncidentAssociatedFiles` (36 colonnes)

**Recommandations**:
- ✅ Réduire à 8-10 colonnes par table
- ✅ Colonnes: `Id`, `ParentId`, `FileName`, `FileSize`, `MimeType`, `FilePath`, `UploadDate`
- ✅ Sync intelligente: miniatures uniquement, téléchargement à la demande
- ⚠️ Gestion du storage local sur mobile

---

## 3. ARCHITECTURE PROPOSÉE - COUCHE MOBILE

### 3.1 Layer 1: API Data Sync (Bronze Light)

**Tables à synchroniser** (10 tables principales):
1. **ScheduleEvent** - Interventions (sync bidirectionnelle)
2. **Incident** - Tickets (sync bidirectionnelle)
3. **Activity** - Historique (sync descendante uniquement)
4. **Customer** - Clients (sync descendante + cache)
5. **Contact** - Contacts (sync descendante + cache)
6. **CustomerProduct** - Équipements (sync descendante)
7. **MaintenanceContract** - Contrats (sync descendante)
8. **ConstructionSite** - Chantiers (sync bidirectionnelle)
9. **Item** - Produits (cache partiel)
10. **Colleague** - Techniciens (cache)

**Volume total estimé**:
- Données actives: ~50 000 enregistrements
- Taille estimée: 50-100 MB (sans photos)

### 3.2 Stratégie de synchronisation

#### Sync complète (download initial)
- Customer (1 338 lignes) → 1,3K
- Contact (2 615 lignes) → 2,6K
- Colleague (31 lignes) → 31
- CustomerProduct (405 lignes) → 405

#### Sync incrémentale (delta)
- ScheduleEvent: 7 derniers jours + 30 prochains jours
- Incident: tickets ouverts uniquement
- Activity: 3 derniers mois
- Item: top 500 produits les plus utilisés

#### Sync ascendante (mobile → serveur)
- Nouveaux tickets créés offline
- Interventions complétées
- Photos/signatures
- Temps passés
- Notes terrain

### 3.3 Schéma mobile simplifié

```
MobileScheduleEvent (40 colonnes)
├── id, uniqueId
├── customerId → MobileCustomer
├── customerProductId → MobileCustomerProduct
├── colleagueId → MobileColleague
├── startDate, endDate
├── state, type, priority
├── subject, description
├── address, city, zipCode, latitude, longitude
├── contactName, contactPhone
├── photos[], signature
└── syncStatus, lastSyncDate

MobileIncident (35 colonnes)
├── id, uniqueId
├── customerId → MobileCustomer
├── priority, severity, type
├── state, assignedTo
├── title, description, resolution
├── creationDate, dueDate, resolutionDate
├── latitude, longitude
├── photos[], signature
└── syncStatus

MobileCustomer (30 colonnes)
├── id, name, type
├── mainContactName, mainContactPhone, mainContactEmail
├── deliveryAddress, deliveryCity, deliveryZipCode
├── deliveryLatitude, deliveryLongitude
├── invoicingAddress, invoicingCity, invoicingZipCode
├── notes
└── lastSyncDate
```

---

## 4. FONCTIONNALITÉS MOBILES PRIORITAIRES

### Phase 1 - MVP (3-4 mois)
✅ Consultation agenda interventions
✅ Détail intervention + navigation GPS
✅ Consultation fiche client
✅ Prise de photos
✅ Signature client
✅ Clôture intervention
✅ Mode offline basique

### Phase 2 - Ticketing (2-3 mois)
✅ Création ticket terrain
✅ Affectation ticket
✅ Historique interventions par client
✅ Gestion équipements clients
✅ Temps passés

### Phase 3 - Avancé (3-4 mois)
✅ Gestion stock mobile
✅ Bon d'intervention PDF
✅ Planification optimisée par géolocalisation
✅ Chat/messaging entre techniciens

---

## 5. OPTIMISATIONS CRITIQUES BASE DE DONNÉES

### 5.1 Ajouts indispensables

**Colonnes à ajouter**:
```sql
-- Géolocalisation
ALTER TABLE "ScheduleEvent" ADD COLUMN latitude DECIMAL(10, 8);
ALTER TABLE "ScheduleEvent" ADD COLUMN longitude DECIMAL(11, 8);
ALTER TABLE "ConstructionSite" ADD COLUMN latitude DECIMAL(10, 8);
ALTER TABLE "ConstructionSite" ADD COLUMN longitude DECIMAL(11, 8);

-- Sync mobile
ALTER TABLE "ScheduleEvent" ADD COLUMN mobile_sync_date TIMESTAMP;
ALTER TABLE "ScheduleEvent" ADD COLUMN mobile_sync_status VARCHAR(20);
ALTER TABLE "Incident" ADD COLUMN mobile_sync_date TIMESTAMP;
ALTER TABLE "Incident" ADD COLUMN mobile_sync_status VARCHAR(20);

-- Photos et signatures
ALTER TABLE "ScheduleEvent" ADD COLUMN photos_json JSONB;
ALTER TABLE "ScheduleEvent" ADD COLUMN signature_url VARCHAR(255);
ALTER TABLE "Incident" ADD COLUMN photos_json JSONB;
ALTER TABLE "Incident" ADD COLUMN signature_url VARCHAR(255);
```

**Index à créer**:
```sql
-- Performance queries mobile
CREATE INDEX idx_schedule_event_dates ON "ScheduleEvent"("StartDate", "EndDate");
CREATE INDEX idx_schedule_event_colleague ON "ScheduleEvent"("ColleagueId") WHERE "ActiveState" = 1;
CREATE INDEX idx_incident_state ON "Incident"("State", "AssignedTo");
CREATE INDEX idx_customer_active ON "Customer"("ActiveState");
CREATE INDEX idx_activity_date ON "Activity"("ActivityDate");

-- Géolocalisation
CREATE INDEX idx_schedule_event_geo ON "ScheduleEvent" USING GIST (
  ll_to_earth(latitude, longitude)
) WHERE latitude IS NOT NULL AND longitude IS NOT NULL;
```

### 5.2 Vues simplifiées

```sql
-- Vue mobile intervention
CREATE VIEW mobile_intervention AS
SELECT
  e."UniqueId",
  e."Id",
  e."StartDate",
  e."EndDate",
  e."State",
  e."Type",
  e."Subject",
  e."Description",
  e."ColleagueId",
  c."Name" as customer_name,
  c."MainDeliveryContact_Phone" as contact_phone,
  c."MainDeliveryContact_Email" as contact_email,
  c."MainDeliveryAddress_Address1" as address,
  c."MainDeliveryAddress_City" as city,
  c."MainDeliveryAddress_ZipCode" as zipcode,
  e.latitude,
  e.longitude
FROM "ScheduleEvent" e
LEFT JOIN "Customer" c ON e."CustomerId" = c."Id"
WHERE e."StartDate" >= CURRENT_DATE - INTERVAL '7 days'
  AND e."StartDate" <= CURRENT_DATE + INTERVAL '30 days';
```

---

## 6. MÉTRIQUES & KPIs À MONITORER

### Volumétrie
- Nombre d'interventions/jour: ~40-50 (basé sur 11 935 total)
- Nombre de tickets actifs: À définir
- Nombre de techniciens actifs: 31 (Colleague)
- Nombre de clients actifs: 1 338

### Performance cibles
- Temps sync initiale: < 30 secondes
- Temps sync delta: < 5 secondes
- Autonomie offline: 7 jours minimum
- Délai sync ascendante: < 1 minute après retour réseau

---

## 7. RISQUES & RECOMMANDATIONS

### ⚠️ Risques identifiés

1. **Tables surchargées**:
   - SaleDocument (538 colonnes) - NON utilisée mobile
   - PurchaseDocument (508 colonnes) - NON utilisée mobile
   - ScheduleEvent (280 colonnes) - Réduire à 40

2. **Données manquantes**:
   - Pas de géolocalisation native
   - Photos non structurées
   - Incident table vide (à activer)

3. **Performance**:
   - Pas d'index géographiques
   - Pas d'index pour sync mobile
   - Volumétrie SaleDocumentLine élevée (112K lignes)

### ✅ Recommandations prioritaires

1. **Immédiat**:
   - Ajouter colonnes géolocalisation
   - Créer index performance
   - Activer table Incident pour ticketing
   - Définir stratégie photos (S3/Blob storage)

2. **Court terme (1 mois)**:
   - Créer vues SQL simplifiées pour mobile
   - Développer API REST sync
   - Implémenter système de conflits (sync bidirectionnelle)
   - Tests charge sync avec 30+ techniciens

3. **Moyen terme (3 mois)**:
   - Archivage données anciennes (> 2 ans)
   - Optimisation requêtes géographiques
   - Monitoring performances mobile
   - Analytics utilisation app

---

## 8. CONCLUSION

### Tables retenues pour app mobile: **10 tables principales**
- 3 tables critiques: ScheduleEvent, Incident, Customer
- 7 tables support: Contact, Activity, CustomerProduct, MaintenanceContract, ConstructionSite, Item, Colleague

### Réduction volumétrique
- De 670 349 lignes totales → ~50 000 lignes sync mobile
- De 9 919 colonnes totales → ~250 colonnes sync mobile
- Réduction: **~92%** des données

### Prochaines étapes
1. Validation schéma mobile avec équipe métier
2. Développement API sync + endpoints REST
3. POC mobile (React Native / Flutter)
4. Tests terrain avec 2-3 techniciens pilotes
5. Déploiement progressif

# AUDIT : MAPPING DES TICKETS NINJAONE ↔ EBP

**Date**: 24 octobre 2025
**Auteur**: Audit Technique Système
**Version**: 1.0
**Statut**: Analyse complète

---

## SOMMAIRE EXÉCUTIF

Ce document présente l'analyse détaillée du mapping et de la synchronisation des tickets entre deux systèmes :

- **NinjaOne** : Plateforme RMM (Remote Monitoring & Management) externe avec ticketing intégré
- **EBP** : ERP français avec gestion d'interventions terrain et incidents SAV

**Objectif** : Établir une synchronisation bidirectionnelle pour unifier la gestion des tickets, permettant aux techniciens de consulter et mettre à jour les tickets depuis l'application mobile EBP tout en maintenant la cohérence avec NinjaOne.

**Volumétrie actuelle** :
- **NinjaOne** : 965 tickets, 114 organisations, 11 techniciens
- **EBP** : 11 935 interventions (ScheduleEvent), 0 incidents (table vide)

**Verdict** : Synchronisation techniquement faisable avec défis importants au niveau de la sémantique des statuts et de la bidirectionnalité.

---

## TABLE DES MATIÈRES

1. [Analyse des structures](#1-analyse-des-structures)
2. [Mapping détaillé des champs](#2-mapping-détaillé-des-champs)
3. [Défis et contraintes](#3-défis-et-contraintes)
4. [Stratégie de synchronisation](#4-stratégie-de-synchronisation)
5. [Architecture technique](#5-architecture-technique)
6. [Plan d'implémentation](#6-plan-dimplémentation)
7. [Recommandations](#7-recommandations)

---

## 1. ANALYSE DES STRUCTURES

### 1.1 Vue d'ensemble des systèmes

#### A. NinjaOne : Système de ticketing RMM

**Architecture** : Data Warehouse (Star Schema)
**Schéma PostgreSQL** : `ninjaone`
**Table principale** : `ninjaone.fact_tickets`

**Caractéristiques** :
- Modèle orienté support IT / RMM
- Forte liaison avec les devices (ordinateurs, serveurs, équipements)
- Statuts prédéfinis (7 statuts standards)
- Priorités standardisées (LOW, MEDIUM, HIGH, URGENT, CRITICAL)
- Système de temps tracké (secondes)
- JSONB pour flexibilité (status, tags, custom_fields)

**Tables de dimensions** :
```
ninjaone.dim_organizations  → Clients/Organisations
ninjaone.dim_technicians    → Techniciens NinjaOne
ninjaone.dim_devices        → Équipements monitorés
ninjaone.dim_time           → Dimension temporelle
ninjaone.dim_ticket_statuses → Statuts prédéfinis
```

**Volumétrie** :
- 965 tickets actifs
- 78.8% non assignés (760 tickets)
- 51.6% ouverts (498 tickets)
- 48.4% fermés (467 tickets)

#### B. EBP : Système d'interventions terrain

**Architecture** : Base relationnelle ERP classique
**Schéma PostgreSQL** : `public` (EBP) + `mobile` (app mobile)
**Tables principales** :
- `public.ScheduleEvent` (interventions planifiées)
- `public.Incident` (tickets SAV - actuellement vide)

**Caractéristiques** :
- Modèle orienté interventions terrain / maintenance
- Forte liaison avec les contrats de maintenance
- Localisation GPS (latitude/longitude)
- Gestion détaillée des durées (prévue, réalisée, déplacement)
- Champs métier spécialisés (rapport d'intervention, description technique)
- Lien avec affaires commerciales (Deal), chantiers (ConstructionSite)

**ScheduleEvent** (11 935 lignes, 280 colonnes) :
- ID : UUID
- Numéro : VARCHAR(10) - ScheduleEventNumber
- Statut : EventState (smallint)
- GPS : Address_Latitude, Address_Longitude
- Durées : ExpectedDuration, AchievedDuration, WorkingDuration (en heures)
- Acteurs : ColleagueId (technicien), CustomerId (client), CreatorColleagueId
- Maintenance : Maintenance_InterventionDescription, Maintenance_InterventionReport

**Incident** (0 lignes, 69 colonnes - structure disponible) :
- ID : VARCHAR(8)
- Caption : VARCHAR(80) - Titre
- Statut : Status (smallint)
- GPS : Address_Latitude, Address_Longitude
- Acteurs : CustomerId, ContactId, CreatorColleagueId
- Financier : PredictedCosts, AccomplishedCosts, PredictedSales, etc.
- Lien : DealId (affaire), ContractId (contrat maintenance)

---

### 1.2 Comparaison structurelle

| Aspect | NinjaOne | EBP (ScheduleEvent) | EBP (Incident) |
|--------|----------|---------------------|----------------|
| **Identifiant** | INTEGER (ticket_id) + UUID (ticket_uid) | UUID (Id) | VARCHAR(8) (Id) |
| **Numéro** | VARCHAR(100) (ticket_number) | VARCHAR(10) (ScheduleEventNumber) | - |
| **Titre** | TEXT (title) | - | VARCHAR(80) (Caption) |
| **Description** | TEXT (description) | TEXT (Maintenance_InterventionDescription) | TEXT (Description) |
| **Statut** | JSONB + INTEGER (status_id) | SMALLINT (EventState) | SMALLINT (Status) |
| **Priorité** | VARCHAR(50) standardisé | - | - |
| **Sévérité** | VARCHAR(50) | - | - |
| **Type** | VARCHAR(100) (ticket_type) | SMALLINT (EventType FK) | - |
| **Client** | INTEGER (organization_id FK) | VARCHAR(20) (CustomerId FK) | VARCHAR(20) (CustomerId FK) |
| **Technicien assigné** | INTEGER (assigned_technician_id) | VARCHAR(20) (ColleagueId) | - |
| **Créateur** | INTEGER (created_by_technician_id) | VARCHAR(20) (CreatorColleagueId) | VARCHAR(20) (CreatorColleagueId) |
| **Contact** | - | UUID (ContactId) | UUID (ContactId) |
| **Device/Équipement** | INTEGER (device_id FK) | - | - |
| **Localisation GPS** | - | Latitude/Longitude (numeric) | Latitude/Longitude (numeric) |
| **Date création** | TIMESTAMP (created_at) | TIMESTAMP (StartDate) | TIMESTAMP (StartDate) |
| **Date mise à jour** | TIMESTAMP (updated_at) | - | sysModifiedDate |
| **Date résolution** | TIMESTAMP (resolved_at) | - | - |
| **Date clôture** | TIMESTAMP (closed_at) | TIMESTAMP (EndDate) | TIMESTAMP (EndDate) |
| **Date échéance** | TIMESTAMP (due_date) | - | - |
| **Temps passé** | INTEGER secondes (time_spent_seconds) | NUMERIC heures (AchievedDuration) | NUMERIC (AccomplishedDuration) |
| **Temps estimé** | INTEGER secondes (estimated_time_seconds) | NUMERIC heures (ExpectedDuration) | NUMERIC (PredictedDuration) |
| **Temps déplacement** | - | NUMERIC heures (Maintenance_TravelDuration) | - |
| **Tags** | JSONB (tags array) | - | - |
| **Champs custom** | JSONB (custom_fields) | 50+ colonnes PayrollVariableDuration, xx_*, etc. | - |
| **Commentaires** | Table séparée (ticket_comments) | - | TEXT (NotesClear, Notes) |
| **Pièces jointes** | Table séparée (ticket_attachments) | BOOLEAN (HasAssociatedFiles) + Table séparée | BOOLEAN (HasAssociatedFiles) |
| **Historique** | Table (ticket_activity) | Table (Activity) | - |
| **Financier** | - | - | PredictedCosts, AccomplishedCosts, Margins |
| **Lien affaire** | - | VARCHAR(10) (DealId) | VARCHAR(10) (DealId) |
| **Lien contrat** | - | VARCHAR(8) (Maintenance_ContractId) | VARCHAR(8) (ContractId) |
| **Lien chantier** | - | VARCHAR(10) (ConstructionSiteId) | VARCHAR(10) (ConstructionSiteId) |

---

## 2. MAPPING DÉTAILLÉ DES CHAMPS

### 2.1 Mapping NinjaOne → EBP (ScheduleEvent)

**Table cible recommandée** : `public.ScheduleEvent` (11 935 lignes existantes)

#### Identifiants et métadonnées

| NinjaOne | EBP ScheduleEvent | Transformation | Priorité |
|----------|-------------------|----------------|----------|
| `ticket_id` (INTEGER) | `external_id` (nouveau champ TEXT) ou mapping table | Stocker comme "NINJA_{ticket_id}" | **CRITIQUE** |
| `ticket_uid` (UUID) | `Id` (UUID) | Générer nouveau UUID pour EBP, mapper dans table externe | **CRITIQUE** |
| `ticket_number` (VARCHAR) | `ScheduleEventNumber` (VARCHAR 10) | Tronquer ou préfixer "NJ" + 8 premiers chars | **HAUTE** |
| `external_id` | - | Ignorer (champ propre à NinjaOne) | BASSE |

**Recommandation** : Créer une table de mapping `mobile.ticket_mapping` :
```sql
CREATE TABLE mobile.ticket_mapping (
  id SERIAL PRIMARY KEY,
  ninjaone_ticket_id INTEGER NOT NULL UNIQUE,
  ninjaone_ticket_uid VARCHAR(255),
  ebp_schedule_event_id UUID REFERENCES "ScheduleEvent"(Id),
  ebp_incident_id VARCHAR(8) REFERENCES "Incident"(Id),
  sync_direction VARCHAR(20), -- 'ninjaone_to_ebp', 'ebp_to_ninjaone', 'bidirectional'
  last_sync_at TIMESTAMP WITH TIME ZONE,
  last_sync_direction VARCHAR(20),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### Contenu du ticket

| NinjaOne | EBP ScheduleEvent | Transformation | Priorité |
|----------|-------------------|----------------|----------|
| `title` (TEXT) | `Maintenance_InterventionDescription` (TEXT) | Direct | **HAUTE** |
| `description` (TEXT) | `Maintenance_InterventionReport` (TEXT) ou `NotesClear` | Direct (préférer Report pour la desc initiale) | **HAUTE** |
| `category` (VARCHAR 100) | `xx_Type_Tache` (VARCHAR) ou mapping vers `EventType` | Mapper catégories NinjaOne → Types EBP | MOYENNE |
| `subcategory` (VARCHAR 100) | Champ custom `xx_Subcategory` (à créer) | Direct | BASSE |

#### Statut et workflow

| NinjaOne | EBP ScheduleEvent | Transformation | Priorité |
|----------|-------------------|----------------|----------|
| `status` (JSONB) | `EventState` (SMALLINT) | **Mapping complexe** (voir section 2.4) | **CRITIQUE** |
| `status.statusId` | Mapping table | Ex: 1000 (NEW) → EventState 0 (Planifié) | **CRITIQUE** |
| `status.displayName` | - | Stocker dans notes pour référence | BASSE |
| `priority` (VARCHAR) | Champ custom `xx_Priority` (à créer) | Créer colonne VARCHAR(50) | **MOYENNE** |
| `severity` (VARCHAR) | Champ custom `xx_Severity` (à créer) | Créer colonne VARCHAR(50) | MOYENNE |
| `ticket_type` (VARCHAR) | `EventType` (SMALLINT FK) | Mapper types NinjaOne → ScheduleEventType | MOYENNE |

**Valeurs EventState existantes dans EBP** (à déterminer via analyse données) :
```
0 = Planifié
1 = En cours
2 = Terminé
3 = Annulé
(à vérifier avec les données réelles)
```

#### Acteurs

| NinjaOne | EBP ScheduleEvent | Transformation | Priorité |
|----------|-------------------|----------------|----------|
| `organization_id` | `CustomerId` (VARCHAR 20) | Lookup dans `dim_organizations` → mapping vers `Customer` | **CRITIQUE** |
| `organization.name` | `CustomerName` (dénormalisé) | Lookup nom client | **HAUTE** |
| `assigned_technician_id` | `ColleagueId` (VARCHAR 20) | Lookup dans `dim_technicians` → mapping vers `Colleague` | **CRITIQUE** |
| `created_by_technician_id` | `CreatorColleagueId` (VARCHAR 20) | Lookup technicien créateur | **HAUTE** |
| `requester_name` | `Contact_Name` (VARCHAR 60) | Direct si ContactId résolu | MOYENNE |
| `requester_email` | `Contact_Email` (VARCHAR 100) | Direct si ContactId résolu | MOYENNE |
| `requester_phone` | `Contact_Phone` (VARCHAR 20) | Direct si ContactId résolu | MOYENNE |
| `device_id` | `xx_Device_Id` (champ custom à créer) | Stocker référence NinjaOne device | BASSE |
| `device.name` | `xx_Device_Name` (champ custom à créer) | Stocker nom device | BASSE |

**Challenge** : Mapping des identifiants entre systèmes
- **NinjaOne Organizations** (INTEGER) → **EBP Customer** (VARCHAR 20)
- **NinjaOne Technicians** (INTEGER) → **EBP Colleague** (VARCHAR 20)

**Solution** : Table de correspondance `mobile.actor_mapping` :
```sql
CREATE TABLE mobile.actor_mapping (
  id SERIAL PRIMARY KEY,
  entity_type VARCHAR(50) NOT NULL, -- 'organization', 'technician', 'device'
  ninjaone_id INTEGER NOT NULL,
  ninjaone_name VARCHAR(255),
  ebp_id VARCHAR(50),
  ebp_entity_table VARCHAR(100), -- 'Customer', 'Colleague', etc.
  confidence_score NUMERIC(3,2) DEFAULT 1.0, -- 0.0 à 1.0
  is_verified BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(entity_type, ninjaone_id)
);
```

#### Dates

| NinjaOne | EBP ScheduleEvent | Transformation | Priorité |
|----------|-------------------|----------------|----------|
| `created_at` (TIMESTAMP TZ) | `StartDate` (TIMESTAMP) | Direct (enlever timezone) | **CRITIQUE** |
| `updated_at` (TIMESTAMP TZ) | `sysModifiedDate` (TIMESTAMP) | Direct | **HAUTE** |
| `resolved_at` (TIMESTAMP TZ) | Champ custom `xx_Resolved_At` (à créer) | Créer colonne TIMESTAMP | MOYENNE |
| `closed_at` (TIMESTAMP TZ) | `EndDate` (TIMESTAMP) | Direct | **HAUTE** |
| `due_date` (TIMESTAMP TZ) | `ExpectedEndDate` (à vérifier si existe) ou champ custom | Créer si nécessaire | MOYENNE |

#### Métriques de temps

| NinjaOne | EBP ScheduleEvent | Transformation | Priorité |
|----------|-------------------|----------------|----------|
| `time_spent_seconds` (INTEGER) | `AchievedDuration_DurationInHours` (NUMERIC) | Convertir : secondes / 3600 = heures | **HAUTE** |
| `estimated_time_seconds` (INTEGER) | `ExpectedDuration_DurationInHours` (NUMERIC) | Convertir : secondes / 3600 = heures | **HAUTE** |
| - | `WorkingDuration_DurationInHours` (NUMERIC) | Utiliser time_spent si disponible | MOYENNE |
| - | `Maintenance_TravelDuration` (NUMERIC) | Pas de correspondance NinjaOne | BASSE |

**Formules de conversion** :
```javascript
ebp_hours = ninjaone_seconds / 3600
ninjaone_seconds = ebp_hours * 3600
```

#### Localisation GPS

| NinjaOne | EBP ScheduleEvent | Transformation | Priorité |
|----------|-------------------|----------------|----------|
| - | `Address_Latitude` (NUMERIC) | Récupérer depuis organization ou device si disponible | MOYENNE |
| - | `Address_Longitude` (NUMERIC) | Récupérer depuis organization ou device si disponible | MOYENNE |
| - | `Address_*` (40+ champs) | Récupérer depuis organization | BASSE |

**Note** : NinjaOne ne stocke pas de GPS au niveau ticket, mais au niveau organisation/location. Possible enrichissement depuis `dim_organizations`.

#### Données additionnelles

| NinjaOne | EBP ScheduleEvent | Transformation | Priorité |
|----------|-------------------|----------------|----------|
| `tags` (JSONB array) | `xx_Tags` (TEXT champ custom à créer) | Convertir en chaîne séparée par virgules | BASSE |
| `custom_fields` (JSONB) | Colonnes `xx_*` individuelles | Mapper champs importants individuellement | BASSE |
| `comments_count` (INTEGER) | - | Pas de correspondance directe | BASSE |
| `attachments_count` (INTEGER) | `HasAssociatedFiles` (BOOLEAN) | Mettre TRUE si > 0 | BASSE |
| `is_overdue` (BOOLEAN) | Calculé | Comparer EndDate < NOW() et EventState != Terminé | BASSE |

---

### 2.2 Mapping NinjaOne → EBP (Incident)

**Table cible alternative** : `public.Incident` (0 lignes - table vide)

**Avantages** :
- Table dédiée aux incidents/tickets SAV
- Champs financiers (coûts, ventes, marges)
- Meilleure séparation sémantique (Incident ≠ Intervention planifiée)

**Inconvénients** :
- Table actuellement vide (pas de données historiques)
- Moins de champs que ScheduleEvent (69 vs 280)
- Moins de liaison avec maintenance/contrats

#### Mapping simplifié Incident

| NinjaOne | EBP Incident | Transformation | Priorité |
|----------|--------------|----------------|----------|
| `ticket_uid` | `Id` (VARCHAR 8) | Générer ID court (ex: "NJ" + 6 chars hex) | **CRITIQUE** |
| `ticket_number` | Pas de champ natif | Stocker dans mapping externe | MOYENNE |
| `title` | `Caption` (VARCHAR 80) | Direct (tronquer si > 80 chars) | **HAUTE** |
| `description` | `Description` (TEXT) | Direct | **HAUTE** |
| `status` | `Status` (SMALLINT) | Mapping statuts (voir section 2.4) | **CRITIQUE** |
| `organization_id` | `CustomerId` (VARCHAR 20) | Lookup via mapping table | **CRITIQUE** |
| `created_by_technician_id` | `CreatorColleagueId` (VARCHAR 20) | Lookup via mapping table | **HAUTE** |
| `created_at` | `StartDate` (TIMESTAMP) | Direct | **CRITIQUE** |
| `closed_at` | `EndDate` (TIMESTAMP) | Direct | **HAUTE** |
| `time_spent_seconds` | `AccomplishedDuration` (NUMERIC) | Convertir en heures | **HAUTE** |
| `estimated_time_seconds` | `PredictedDuration` (NUMERIC) | Convertir en heures | MOYENNE |
| `requester_*` | `Contact_*` (champs dénormalisés) | Direct si ContactId résolu | MOYENNE |
| `tags`, `custom_fields` | Pas de champs natifs | Stocker en notes ou ignorer | BASSE |

**Recommandation** : **Utiliser ScheduleEvent** pour cohérence avec données existantes, sauf si besoin de séparer strictement tickets SAV vs interventions planifiées.

---

### 2.3 Mapping EBP → NinjaOne (Sync inverse)

**Direction** : `public.ScheduleEvent` → `ninjaone.fact_tickets`

#### Identifiants

| EBP ScheduleEvent | NinjaOne | Transformation | Priorité |
|-------------------|----------|----------------|----------|
| `Id` (UUID) | Mapping table | Lookup `ticket_id` depuis `mobile.ticket_mapping` | **CRITIQUE** |
| `ScheduleEventNumber` | `ticket_number` (VARCHAR 100) | Direct | **HAUTE** |

#### Contenu

| EBP ScheduleEvent | NinjaOne | Transformation | Priorité |
|-------------------|----------|----------------|----------|
| `Maintenance_InterventionDescription` | `title` (TEXT) | Direct (tronquer si > limite) | **HAUTE** |
| `Maintenance_InterventionReport` | `description` (TEXT) | Direct | **HAUTE** |
| `xx_Type_Tache` | `category` (VARCHAR 100) | Mapping inverse | MOYENNE |
| `EventType` (FK) | `ticket_type` (VARCHAR 100) | Lookup ScheduleEventType.Caption | MOYENNE |

#### Statut et workflow

| EBP ScheduleEvent | NinjaOne | Transformation | Priorité |
|-------------------|----------|----------------|----------|
| `EventState` (SMALLINT) | `status` (JSONB) + `status_id` | **Mapping inverse** (voir section 2.4) | **CRITIQUE** |
| `xx_Priority` (custom) | `priority` (VARCHAR 50) | Direct si champ existe | MOYENNE |
| `xx_Severity` (custom) | `severity` (VARCHAR 50) | Direct si champ existe | MOYENNE |

#### Acteurs

| EBP ScheduleEvent | NinjaOne | Transformation | Priorité |
|-------------------|----------|----------------|----------|
| `CustomerId` | `organization_id` (INTEGER) | Lookup inverse dans `mobile.actor_mapping` | **CRITIQUE** |
| `ColleagueId` | `assigned_technician_id` (INTEGER) | Lookup inverse dans `mobile.actor_mapping` | **CRITIQUE** |
| `CreatorColleagueId` | `created_by_technician_id` (INTEGER) | Lookup inverse dans `mobile.actor_mapping` | **HAUTE** |
| `ContactId` | `requester` (objet) | Lookup dans Contact, extraire name/email/phone | MOYENNE |

#### Dates

| EBP ScheduleEvent | NinjaOne | Transformation | Priorité |
|-------------------|----------|----------------|----------|
| `StartDate` | `created_at` (TIMESTAMP TZ) | Ajouter timezone UTC | **CRITIQUE** |
| `sysModifiedDate` | `updated_at` (TIMESTAMP TZ) | Ajouter timezone UTC | **HAUTE** |
| `xx_Resolved_At` (custom) | `resolved_at` (TIMESTAMP TZ) | Si champ existe | MOYENNE |
| `EndDate` | `closed_at` (TIMESTAMP TZ) | Ajouter timezone UTC | **HAUTE** |

#### Métriques

| EBP ScheduleEvent | NinjaOne | Transformation | Priorité |
|-------------------|----------|----------------|----------|
| `AchievedDuration_DurationInHours` | `time_spent_seconds` (INTEGER) | Convertir : heures * 3600 = secondes | **HAUTE** |
| `ExpectedDuration_DurationInHours` | `estimated_time_seconds` (INTEGER) | Convertir : heures * 3600 = secondes | **HAUTE** |

#### Localisation

| EBP ScheduleEvent | NinjaOne | Transformation | Priorité |
|-------------------|----------|----------------|----------|
| `Address_Latitude`, `Address_Longitude` | - | NinjaOne ne stocke pas GPS au niveau ticket | N/A |

**Note** : GPS est une force d'EBP absente dans NinjaOne. Information perdue dans le sens EBP → NinjaOne.

---

### 2.4 Mapping des statuts (CRITIQUE)

**Défi majeur** : Les statuts ont des sémantiques différentes entre les deux systèmes.

#### Statuts NinjaOne (dim_ticket_statuses)

| ID | Nom | Display | Ouvert | Résolu | Fermé |
|----|-----|---------|--------|--------|-------|
| 1000 | NEW | Nouveau | ✓ | | |
| 2000 | OPEN | Ouvert | ✓ | | |
| 2001 | IN_PROGRESS | En cours | ✓ | | |
| 2002 | MAINTENANCE_TODO | Maintenance à faire | ✓ | | |
| 3000 | ON_HOLD | En attente | ✓ | | |
| 3001 | PAUSED | En pause | ✓ | | |
| 4000 | TO_BILL | À facturer | | ✓ | |
| 5000 | RESOLVED | Résolu | | ✓ | |
| 6000 | CLOSED | Fermé | | ✓ | ✓ |

#### Statuts EBP ScheduleEvent (EventState)

**À ANALYSER** : Requête SQL nécessaire pour identifier les valeurs réelles :

```sql
SELECT
  "EventState",
  COUNT(*) AS count,
  ROUND(COUNT(*) * 100.0 / SUM(COUNT(*)) OVER (), 2) AS percentage
FROM public."ScheduleEvent"
GROUP BY "EventState"
ORDER BY count DESC;
```

**Hypothèse de mapping** (à ajuster selon données réelles) :

| EventState EBP | Nom supposé | → | NinjaOne Status ID | Nom NinjaOne |
|----------------|-------------|---|--------------------|--------------|
| 0 | Planifié | → | 1000 | NEW |
| 1 | Confirmé | → | 2000 | OPEN |
| 2 | En cours | → | 2001 | IN_PROGRESS |
| 3 | En attente | → | 3000 | ON_HOLD |
| 4 | Terminé | → | 5000 | RESOLVED |
| 5 | Facturé | → | 4000 | TO_BILL |
| 9 | Annulé | → | 6000 | CLOSED |

**Mapping inverse** (NinjaOne → EBP) :

| NinjaOne | → | EventState EBP | Notes |
|----------|---|----------------|-------|
| 1000 (NEW) | → | 0 (Planifié) | Nouveau ticket = intervention à planifier |
| 2000 (OPEN) | → | 1 (Confirmé) | Ouvert = confirmé par client/technicien |
| 2001 (IN_PROGRESS) | → | 2 (En cours) | Direct |
| 2002 (MAINTENANCE_TODO) | → | 0 (Planifié) | Maintenance = planification |
| 3000 (ON_HOLD) | → | 3 (En attente) | Direct |
| 3001 (PAUSED) | → | 3 (En attente) | Pause = attente |
| 4000 (TO_BILL) | → | 5 (Facturé) | À facturer ou facturé |
| 5000 (RESOLVED) | → | 4 (Terminé) | Résolu = intervention terminée |
| 6000 (CLOSED) | → | 9 (Annulé) ou 4 (Terminé) | Selon contexte |

**Table de mapping recommandée** :

```sql
CREATE TABLE mobile.status_mapping (
  id SERIAL PRIMARY KEY,
  ninjaone_status_id INTEGER,
  ninjaone_status_name VARCHAR(100),
  ebp_event_state INTEGER,
  ebp_event_state_name VARCHAR(100),
  ebp_incident_status INTEGER,
  ebp_incident_status_name VARCHAR(100),
  direction VARCHAR(20), -- 'ninjaone_to_ebp', 'ebp_to_ninjaone', 'bidirectional'
  is_default BOOLEAN DEFAULT FALSE,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Exemples de données
INSERT INTO mobile.status_mapping (ninjaone_status_id, ninjaone_status_name, ebp_event_state, ebp_event_state_name, direction, is_default) VALUES
(1000, 'NEW', 0, 'Planifié', 'bidirectional', TRUE),
(2001, 'IN_PROGRESS', 2, 'En cours', 'bidirectional', TRUE),
(5000, 'RESOLVED', 4, 'Terminé', 'bidirectional', TRUE),
(6000, 'CLOSED', 9, 'Annulé', 'ninjaone_to_ebp', FALSE);
```

**Conflits potentiels** :
- Plusieurs statuts NinjaOne → même EventState EBP (perte d'information)
- Statuts métier EBP spécifiques (facturé, confirmé) absents de NinjaOne
- Résolution : stocker statut NinjaOne original en champ custom `xx_NinjaOne_Status`

---

### 2.5 Mapping des priorités

**NinjaOne** : 5 niveaux standardisés
- NONE (65.7% des tickets)
- LOW (0.31%)
- MEDIUM (12.44%)
- HIGH (21.55%)
- URGENT (0%)
- CRITICAL (0%)

**EBP** : Pas de champ priorité natif dans ScheduleEvent ou Incident

**Recommandation** : Créer champ custom dans EBP

```sql
-- Ajouter colonne priorité dans ScheduleEvent
ALTER TABLE public."ScheduleEvent"
ADD COLUMN xx_Priority VARCHAR(50);

-- Ajouter index pour performance
CREATE INDEX idx_scheduleevent_priority
ON public."ScheduleEvent"(xx_Priority);
```

**Mapping direct** :
```javascript
{
  'NONE': null, // ou 'NORMALE'
  'LOW': 'BASSE',
  'MEDIUM': 'MOYENNE',
  'HIGH': 'HAUTE',
  'URGENT': 'URGENTE',
  'CRITICAL': 'CRITIQUE'
}
```

---

### 2.6 Données non mappables

#### Données NinjaOne sans équivalent EBP

| Champ NinjaOne | Raison | Solution |
|----------------|--------|----------|
| `device_id`, `device_name` | EBP n'a pas de gestion d'équipements IT | Créer champs custom `xx_Device_*` |
| `severity` | Concept absent EBP | Créer champ custom `xx_Severity` |
| `ticket_uid` | EBP utilise UUID différent | Table de mapping externe |
| `board_id` | Concept tableau Kanban absent | Ignorer ou mapper vers `EventType` |
| `time_to_resolution_seconds` | Métrique calculée | Recalculer dans EBP |
| `is_overdue` | Flag calculé | Recalculer dans EBP |

#### Données EBP sans équivalent NinjaOne

| Champ EBP | Raison | Solution |
|-----------|--------|----------|
| `Address_Latitude`, `Address_Longitude` | NinjaOne ne gère pas GPS | **Perte d'information** dans sync inverse |
| `Maintenance_TravelDuration` | Métrique absente NinjaOne | Ne pas syncer vers NinjaOne |
| `Maintenance_ContractId` | Lien contrat maintenance absent | Stocker en custom_fields JSON |
| `DealId` | Lien affaire commerciale absent | Stocker en custom_fields JSON |
| `ConstructionSiteId` | Lien chantier absent | Stocker en custom_fields JSON |
| `PayrollVariableDuration*` (50 cols) | Paie absente NinjaOne | Ne pas syncer |
| Champs financiers (Costs, Sales, Margin) | Absents NinjaOne | Ne pas syncer (ou custom_fields) |

---

## 3. DÉFIS ET CONTRAINTES

### 3.1 Défis techniques

#### A. Identifiants hétérogènes

**Problème** :
- NinjaOne : INTEGER (auto-increment)
- EBP : UUID (ScheduleEvent), VARCHAR(8) (Incident), VARCHAR(20) (Customer/Colleague)

**Impact** : Impossibilité de corréler directement les entités

**Solutions** :
1. **Table de mapping centralisée** (`mobile.ticket_mapping`, `mobile.actor_mapping`)
2. **Champs externes** : Ajouter `xx_NinjaOne_Ticket_ID` dans EBP
3. **UUID bridge** : Utiliser `ticket_uid` de NinjaOne comme clé universelle

**Implémentation recommandée** :
```sql
-- Table de mapping tickets
CREATE TABLE mobile.ticket_mapping (
  id SERIAL PRIMARY KEY,
  ninjaone_ticket_id INTEGER NOT NULL UNIQUE,
  ninjaone_ticket_uid VARCHAR(255),
  ebp_schedule_event_id UUID REFERENCES public."ScheduleEvent"("Id"),
  last_sync_at TIMESTAMP WITH TIME ZONE,
  sync_status VARCHAR(50), -- 'synced', 'conflict', 'pending'
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index pour lookups rapides
CREATE INDEX idx_ticket_mapping_ninjaone ON mobile.ticket_mapping(ninjaone_ticket_id);
CREATE INDEX idx_ticket_mapping_ebp ON mobile.ticket_mapping(ebp_schedule_event_id);
```

#### B. Mapping des acteurs (Organisations & Techniciens)

**Problème** : Aucun identifiant commun entre NinjaOne et EBP

**Exemple** :
```
NinjaOne : Organization ID=123, Name="ACME Corp"
EBP      : Customer ID="C00042", Name="ACME CORP SARL"
```

**Stratégies de matching** :

1. **Fuzzy matching sur noms** :
```javascript
function matchOrganization(ninjaoneName, ebpCustomers) {
  // Normaliser : majuscules, trim, enlever accents, SARL/SAS/etc.
  const normalized = normalize(ninjaoneName);

  // Levenshtein distance ou Jaro-Winkler
  const matches = ebpCustomers
    .map(c => ({
      customer: c,
      score: similarity(normalized, normalize(c.Name))
    }))
    .filter(m => m.score > 0.85) // Seuil 85%
    .sort((a, b) => b.score - a.score);

  return matches[0]?.customer;
}
```

2. **Matching manuel initial** :
```sql
-- Table de correspondance avec flag vérification manuelle
CREATE TABLE mobile.actor_mapping (
  id SERIAL PRIMARY KEY,
  entity_type VARCHAR(50) NOT NULL,
  ninjaone_id INTEGER NOT NULL,
  ninjaone_name VARCHAR(255),
  ebp_id VARCHAR(50),
  ebp_entity_table VARCHAR(100),
  match_method VARCHAR(50), -- 'manual', 'fuzzy', 'email'
  confidence_score NUMERIC(3,2) DEFAULT 1.0,
  is_verified BOOLEAN DEFAULT FALSE,
  verified_by VARCHAR(100),
  verified_at TIMESTAMP WITH TIME ZONE,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(entity_type, ninjaone_id)
);
```

3. **Matching par email** (pour techniciens) :
```sql
-- Match techniciens via email
INSERT INTO mobile.actor_mapping (entity_type, ninjaone_id, ninjaone_name, ebp_id, match_method, confidence_score)
SELECT
  'technician',
  nt.technician_id,
  nt.full_name,
  c."Id",
  'email',
  1.0
FROM ninjaone.dim_technicians nt
JOIN public."Colleague" c ON LOWER(nt.email) = LOWER(c."Contact_Email")
WHERE nt.email IS NOT NULL;
```

**Recommandation** : Approche hybride
- Phase 1 : Matching automatique (email > 90%, fuzzy > 85%)
- Phase 2 : Interface de validation manuelle pour correspondances < 85%
- Phase 3 : Gestion continue avec UI admin

#### C. Sémantique des statuts

**Problème** : Statuts ont des significations métier différentes

| Concept | NinjaOne | EBP |
|---------|----------|-----|
| Création | NEW | Planifié |
| Début travail | IN_PROGRESS | En cours |
| Pause | PAUSED, ON_HOLD | En attente |
| Résolution | RESOLVED | Terminé |
| Clôture admin | CLOSED | Fermé/Annulé |
| Facturation | TO_BILL | Facturé (? à vérifier) |

**Exemples de conflits** :

1. **Ticket résolu mais pas fermé** :
   - NinjaOne : `RESOLVED` (ticket résolu, attend validation client)
   - EBP : `Terminé` (intervention terminée = fermée)
   - **Conflit** : Un ticket RESOLVED devient Terminé dans EBP, mais peut être rouvert dans NinjaOne

2. **Ticket en attente** :
   - NinjaOne : `ON_HOLD` (attente pièce), `PAUSED` (pause technicien)
   - EBP : Probablement même `EventState = En attente`
   - **Perte** : Distinction entre types d'attente

**Solutions** :

1. **Mapping avec perte d'information acceptable** :
```javascript
const statusMapping = {
  // NinjaOne → EBP
  1000: 0, // NEW → Planifié
  2001: 2, // IN_PROGRESS → En cours
  3000: 3, // ON_HOLD → En attente
  3001: 3, // PAUSED → En attente (PERTE de distinction)
  5000: 4, // RESOLVED → Terminé
  6000: 9, // CLOSED → Annulé/Fermé
};
```

2. **Champ custom pour préserver statut origine** :
```sql
ALTER TABLE public."ScheduleEvent"
ADD COLUMN xx_NinjaOne_Status VARCHAR(100),
ADD COLUMN xx_NinjaOne_Status_ID INTEGER;
```

3. **Règles de synchronisation** :
```javascript
// Règle : Statuts terminaux ne peuvent être modifiés
const isTerminal = (status) => ['CLOSED', 'CANCELLED'].includes(status);

function syncStatus(ninjaoneStatus, ebpStatus, lastSyncDirection) {
  // Si statut terminal, ne pas écraser
  if (isTerminal(ninjaoneStatus) && lastSyncDirection === 'ninjaone_to_ebp') {
    throw new Error('Cannot overwrite terminal status from EBP');
  }

  // Si conflit, priorité à la dernière mise à jour
  // ...
}
```

#### D. Types de données incompatibles

| Champ | NinjaOne | EBP | Conversion |
|-------|----------|-----|------------|
| Temps | INTEGER secondes | NUMERIC heures | `seconds / 3600` |
| Dates | TIMESTAMP WITH TZ | TIMESTAMP | Enlever timezone |
| Statut | JSONB + INTEGER | SMALLINT | Extraire statusId |
| Tags | JSONB array | Pas de champ | Créer TEXT séparé virgules |
| UUID | VARCHAR(255) | UUID natif | Parsing/casting |

**Fonction utilitaire recommandée** :

```javascript
class TypeConverter {
  static secondsToHours(seconds: number): number {
    return seconds ? Math.round(seconds / 3600 * 100) / 100 : 0;
  }

  static hoursToSeconds(hours: number): number {
    return hours ? Math.round(hours * 3600) : 0;
  }

  static timestampToTimestampTZ(timestamp: Date): string {
    return timestamp ? timestamp.toISOString() : null;
  }

  static tagsArrayToString(tags: string[]): string {
    return tags && tags.length ? tags.join(', ') : null;
  }

  static tagsStringToArray(tagsStr: string): string[] {
    return tagsStr ? tagsStr.split(',').map(t => t.trim()) : [];
  }
}
```

---

### 3.2 Défis métier

#### A. Deux modèles métier différents

**NinjaOne** : Support IT / RMM
- Focus : Résolution incidents IT, monitoring devices
- Workflow : Ticket créé → assigné → résolu → fermé
- Acteurs : Techniciens IT, clients MSP
- Lien fort : Device (ordinateur/serveur)

**EBP** : Interventions terrain / Maintenance
- Focus : Interventions physiques, maintenance préventive/curative
- Workflow : Intervention planifiée → confirmée → en cours → terminée → facturée
- Acteurs : Techniciens terrain, chefs de chantier, clients BTP/SAV
- Lien fort : Contrat maintenance, Chantier, GPS

**Exemples de cas d'usage divergents** :

1. **Ticket NinjaOne** : "Serveur Exchange down - Urgent"
   - Device: SRV-EXCHANGE-01
   - Priority: CRITICAL
   - Estimated time: 2h
   - **Pas d'équivalent naturel dans EBP** (pas de notion de serveur/device)

2. **Intervention EBP** : "Maintenance annuelle climatisation - Site Marseille"
   - Contrat: MAINT-2024-042
   - GPS: 43.2965, 5.3698
   - Durée déplacement: 1h30
   - **Pas d'équivalent dans NinjaOne** (pas de GPS, contrat, déplacement)

**Question stratégique** : **Faut-il vraiment synchroniser TOUS les tickets ?**

**Recommandation** :
- Synchroniser uniquement les tickets **pertinents pour les deux systèmes**
- Critères de filtre :
  - NinjaOne → EBP : Tickets nécessitant intervention physique (catégorie "On-site", tags spécifiques)
  - EBP → NinjaOne : Interventions liées à des équipements IT monitorés dans NinjaOne

```sql
-- Exemple : Ne synchroniser que les tickets avec tag "on-site"
SELECT * FROM ninjaone.fact_tickets
WHERE tags @> '["on-site"]'::jsonb
  OR category IN ('Hardware', 'Network', 'Printer');
```

#### B. Ownership et source de vérité

**Question critique** : Qui est la source de vérité pour quoi ?

**Scénarios** :

1. **Ticket créé dans NinjaOne** (alerte monitoring)
   - Source de vérité : **NinjaOne**
   - Sync vers EBP : Pour planification intervention terrain
   - Mise à jour EBP (temps passé, notes) : Sync retour vers NinjaOne
   - **Winner en cas de conflit** : NinjaOne (statut), EBP (durées)

2. **Intervention créée dans EBP** (contrat maintenance)
   - Source de vérité : **EBP**
   - Sync vers NinjaOne : Pour visibilité centralisée MSP
   - Mise à jour NinjaOne : Ne pas syncer retour vers EBP (éviter boucle)
   - **Winner en cas de conflit** : EBP

3. **Ticket modifié dans les deux systèmes simultanément**
   - **Conflit** : Comment résoudre ?
   - Options :
     - Last-write-wins (dernière modification gagne)
     - Field-level merging (champ par champ)
     - Manual resolution (alerte admin)

**Stratégie recommandée** : **Ownership par origine**

```sql
-- Table de mapping avec ownership
ALTER TABLE mobile.ticket_mapping
ADD COLUMN source_system VARCHAR(20) NOT NULL, -- 'ninjaone' ou 'ebp'
ADD COLUMN sync_direction VARCHAR(20) NOT NULL, -- 'unidirectional' ou 'bidirectional'
ADD COLUMN conflict_resolution VARCHAR(50) DEFAULT 'source_wins'; -- 'source_wins', 'last_write', 'manual'
```

**Règles de synchronisation** :

```javascript
class SyncRules {
  static resolveConflict(ticket, ninjaoneData, ebpData, mapping) {
    // Si ownership = source system, source gagne
    if (mapping.conflict_resolution === 'source_wins') {
      return mapping.source_system === 'ninjaone' ? ninjaoneData : ebpData;
    }

    // Si last-write-wins, comparer timestamps
    if (mapping.conflict_resolution === 'last_write') {
      return ninjaoneData.updated_at > ebpData.sysModifiedDate
        ? ninjaoneData
        : ebpData;
    }

    // Sinon, marquer pour résolution manuelle
    return { status: 'conflict', requires_manual_resolution: true };
  }

  static canSyncField(fieldName, sourceSystem, targetSystem) {
    // Règles métier : certains champs ne se synchronisent que dans un sens
    const unidirectionalFields = {
      'ninjaone_to_ebp': ['device_id', 'severity', 'board_id'],
      'ebp_to_ninjaone': ['Address_Latitude', 'Maintenance_ContractId', 'DealId']
    };

    const direction = `${sourceSystem}_to_${targetSystem}`;
    return !unidirectionalFields[direction]?.includes(fieldName);
  }
}
```

#### C. Synchronisation des commentaires et pièces jointes

**Problème** :
- NinjaOne : Tables séparées (`ticket_comments`, `ticket_attachments`)
- EBP ScheduleEvent : Pas de table native commentaires (seulement `NotesClear` TEXT)
- EBP : Table `ScheduleEventAssociatedFiles` existe mais structure différente

**Options** :

1. **Option 1** : Commentaires NinjaOne → Notes EBP (format texte concaténé)
```sql
-- Exemple : Agréger commentaires en texte
SELECT
  ticket_id,
  string_agg(
    format('[%s] %s: %s', created_at, author_name, body),
    E'\n---\n'
    ORDER BY created_at
  ) AS aggregated_comments
FROM ninjaone.ticket_comments
GROUP BY ticket_id;
```

Avantages : Simple
Inconvénients : Perte structure, pas de modification individuelle

2. **Option 2** : Créer table mobile.ticket_comments_sync
```sql
CREATE TABLE mobile.ticket_comments_sync (
  id SERIAL PRIMARY KEY,
  ninjaone_comment_id INTEGER,
  ebp_schedule_event_id UUID REFERENCES public."ScheduleEvent"("Id"),
  author_name VARCHAR(255),
  body TEXT,
  is_internal BOOLEAN,
  created_at TIMESTAMP WITH TIME ZONE,
  source_system VARCHAR(20),
  last_sync_at TIMESTAMP WITH TIME ZONE
);
```

Avantages : Structure préservée, modifications individuelles
Inconvénients : Complexité accrue, pas visible nativement dans EBP

3. **Option 3** : Utiliser table mobile avec API dédiée
```sql
-- Vue unifiée commentaires des deux systèmes
CREATE VIEW mobile.v_unified_ticket_comments AS
SELECT
  nc.id AS comment_id,
  'ninjaone' AS source_system,
  nc.ticket_id AS source_ticket_id,
  tm.ebp_schedule_event_id AS ebp_ticket_id,
  nc.body,
  nc.author_name,
  nc.is_internal,
  nc.created_at
FROM ninjaone.ticket_comments nc
JOIN mobile.ticket_mapping tm ON tm.ninjaone_ticket_id = nc.ticket_id
UNION ALL
SELECT
  NULL,
  'ebp',
  se."Id",
  se."Id",
  se."NotesClear",
  c."Contact_Name",
  FALSE,
  se."sysModifiedDate"
FROM public."ScheduleEvent" se
LEFT JOIN public."Colleague" c ON c."Id" = se."CreatorColleagueId"
WHERE se."NotesClear" IS NOT NULL;
```

**Recommandation** : **Option 3** (vue unifiée + table sync)
- Lecture : Via vue unifiée
- Écriture : Via API qui met à jour les deux systèmes
- Mobile app : Utilise uniquement la vue unifiée

#### D. Gestion des cycles de synchronisation

**Problème** : Éviter les boucles infinies de synchronisation

**Exemple de boucle** :
```
1. Ticket modifié dans NinjaOne (updated_at = T1)
2. Sync vers EBP (sysModifiedDate = T2)
3. EBP trigger met à jour sysModifiedDate = T3
4. Sync détecte changement EBP (T3 > T1)
5. Sync retour vers NinjaOne (updated_at = T4)
6. Sync détecte changement NinjaOne (T4 > T3)
7. BOUCLE INFINIE
```

**Solutions** :

1. **Tracking de la dernière sync** :
```sql
ALTER TABLE mobile.ticket_mapping
ADD COLUMN last_sync_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN last_sync_direction VARCHAR(20), -- 'ninjaone_to_ebp' ou 'ebp_to_ninjaone'
ADD COLUMN last_sync_checksum VARCHAR(64); -- Hash du contenu
```

2. **Checksum du contenu** :
```javascript
function calculateTicketChecksum(ticket) {
  const relevantFields = {
    title: ticket.title,
    description: ticket.description,
    status: ticket.status,
    assignedTo: ticket.assignedTo,
    timeSpent: ticket.timeSpent
  };

  return crypto
    .createHash('sha256')
    .update(JSON.stringify(relevantFields))
    .digest('hex');
}

function shouldSync(ticket, mapping) {
  const currentChecksum = calculateTicketChecksum(ticket);

  // Si checksum identique, pas de sync
  if (currentChecksum === mapping.last_sync_checksum) {
    return false;
  }

  // Si modifié depuis dernière sync, syncer
  if (ticket.updated_at > mapping.last_sync_at) {
    return true;
  }

  return false;
}
```

3. **Cooldown period** :
```javascript
const SYNC_COOLDOWN_SECONDS = 60; // 1 minute

function canSyncNow(mapping) {
  const timeSinceLastSync = Date.now() - mapping.last_sync_at;
  return timeSinceLastSync > SYNC_COOLDOWN_SECONDS * 1000;
}
```

4. **Flag sync interne** :
```sql
-- Ajouter flag pour indiquer qu'une modification vient d'une sync
ALTER TABLE public."ScheduleEvent"
ADD COLUMN xx_Sync_Source VARCHAR(50), -- 'ninjaone_sync', 'manual', 'mobile_app'
ADD COLUMN xx_Last_Synced_At TIMESTAMP WITH TIME ZONE;

-- Trigger pour éviter re-sync
CREATE OR REPLACE FUNCTION prevent_sync_loop()
RETURNS TRIGGER AS $$
BEGIN
  -- Si modification vient d'une sync, ne pas déclencher sync retour
  IF NEW.xx_Sync_Source = 'ninjaone_sync' THEN
    RETURN NEW;
  END IF;

  -- Sinon, marquer pour sync
  NEW.xx_Sync_Source := 'manual';
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_prevent_sync_loop
BEFORE UPDATE ON public."ScheduleEvent"
FOR EACH ROW
EXECUTE FUNCTION prevent_sync_loop();
```

---

### 3.3 Contraintes techniques

#### A. Performance et volumétrie

**Volumétrie actuelle** :
- NinjaOne : 965 tickets (relativement faible)
- EBP : 11 935 interventions ScheduleEvent

**Projections** :
- Croissance annuelle : +50% (hypothèse)
- Dans 3 ans : ~40 000 interventions EBP, ~2 000 tickets NinjaOne

**Contraintes de sync** :
- Latence acceptable : < 5 minutes pour sync incrémentale
- Sync complète : < 30 minutes (pour reconciliation hebdomadaire)

**Stratégies d'optimisation** :

1. **Sync incrémentale basée sur timestamps** :
```sql
-- Ne synchroniser que les tickets modifiés depuis dernière sync
SELECT *
FROM ninjaone.fact_tickets
WHERE updated_at > (
  SELECT MAX(last_sync_at)
  FROM mobile.sync_history
  WHERE sync_type = 'ninjaone_to_ebp'
)
LIMIT 1000;
```

2. **Batch processing** :
```javascript
async function syncBatch(tickets, batchSize = 100) {
  for (let i = 0; i < tickets.length; i += batchSize) {
    const batch = tickets.slice(i, i + batchSize);
    await Promise.all(batch.map(syncTicket));
    await sleep(1000); // Rate limiting
  }
}
```

3. **Index critiques** :
```sql
-- Index pour sync incrémentale
CREATE INDEX idx_tickets_updated_at ON ninjaone.fact_tickets(updated_at);
CREATE INDEX idx_scheduleevent_modified ON public."ScheduleEvent"("sysModifiedDate");

-- Index pour lookups de mapping
CREATE INDEX idx_ticket_mapping_ninjaone ON mobile.ticket_mapping(ninjaone_ticket_id);
CREATE INDEX idx_ticket_mapping_ebp ON mobile.ticket_mapping(ebp_schedule_event_id);
CREATE INDEX idx_actor_mapping_lookup ON mobile.actor_mapping(entity_type, ninjaone_id);
```

4. **Cache Redis pour mappings** :
```javascript
class MappingCache {
  async getTicketMapping(ninjaoneId) {
    // Check cache Redis
    const cached = await redis.get(`ticket_map:${ninjaoneId}`);
    if (cached) return JSON.parse(cached);

    // Sinon, fetch DB et cache
    const mapping = await db.query(
      'SELECT * FROM mobile.ticket_mapping WHERE ninjaone_ticket_id = $1',
      [ninjaoneId]
    );

    await redis.setex(`ticket_map:${ninjaoneId}`, 3600, JSON.stringify(mapping));
    return mapping;
  }
}
```

#### B. Rate limiting API NinjaOne

**Limites API NinjaOne** (à vérifier dans documentation) :
- Hypothèse : 1000 requêtes / heure
- Bulk endpoints : 100 tickets par requête

**Stratégie** :
```javascript
class RateLimiter {
  constructor(maxRequests = 1000, windowMs = 3600000) {
    this.maxRequests = maxRequests;
    this.windowMs = windowMs;
    this.requests = [];
  }

  async acquire() {
    const now = Date.now();

    // Nettoyer requêtes anciennes
    this.requests = this.requests.filter(t => now - t < this.windowMs);

    // Si limite atteinte, attendre
    if (this.requests.length >= this.maxRequests) {
      const oldestRequest = Math.min(...this.requests);
      const waitTime = this.windowMs - (now - oldestRequest);
      await sleep(waitTime);
      return this.acquire(); // Retry
    }

    this.requests.push(now);
  }
}
```

#### C. Gestion des erreurs et retry

**Types d'erreurs** :
1. **Erreurs réseau** : Timeout, connexion perdue
2. **Erreurs API** : 429 Too Many Requests, 500 Server Error
3. **Erreurs données** : Validation échouée, FK violation
4. **Erreurs mapping** : Organisation/Technicien introuvable

**Stratégie de retry** :
```javascript
class SyncService {
  async syncWithRetry(ticket, maxRetries = 3) {
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        await this.syncTicket(ticket);
        return { success: true };

      } catch (error) {
        // Erreurs non-retriables
        if (error.code === 'VALIDATION_ERROR' || error.code === 'MAPPING_NOT_FOUND') {
          await this.logFailure(ticket, error, 'non_retriable');
          return { success: false, error };
        }

        // Erreurs retriables
        if (attempt < maxRetries) {
          const backoff = Math.pow(2, attempt) * 1000; // Exponential backoff
          await sleep(backoff);
          continue;
        }

        // Max retries atteint
        await this.logFailure(ticket, error, 'max_retries');
        return { success: false, error };
      }
    }
  }

  async logFailure(ticket, error, reason) {
    await db.query(`
      INSERT INTO mobile.sync_failures (
        ticket_id,
        source_system,
        error_message,
        reason,
        retry_after
      ) VALUES ($1, $2, $3, $4, $5)
    `, [
      ticket.id,
      'ninjaone',
      error.message,
      reason,
      reason === 'non_retriable' ? null : new Date(Date.now() + 3600000) // 1h
    ]);
  }
}
```

**Table d'échecs** :
```sql
CREATE TABLE mobile.sync_failures (
  id SERIAL PRIMARY KEY,
  ticket_id VARCHAR(255) NOT NULL,
  source_system VARCHAR(20) NOT NULL,
  error_message TEXT,
  error_stack TEXT,
  reason VARCHAR(100), -- 'non_retriable', 'max_retries', 'timeout'
  retry_count INTEGER DEFAULT 0,
  retry_after TIMESTAMP WITH TIME ZONE,
  resolved_at TIMESTAMP WITH TIME ZONE,
  resolved_by VARCHAR(100),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

---

## 4. STRATÉGIE DE SYNCHRONISATION

### 4.1 Architecture de synchronisation

#### A. Modes de synchronisation

**3 modes possibles** :

1. **Mode Unidirectionnel NinjaOne → EBP** (Recommandé pour MVP)
   - NinjaOne est source de vérité
   - Tickets créés/modifiés dans NinjaOne se propagent vers EBP
   - Modifications EBP NE se propagent PAS vers NinjaOne
   - **Cas d'usage** : Techniciens consultent tickets NinjaOne depuis app mobile EBP
   - **Avantages** : Simplicité, pas de conflits, pas de boucles
   - **Inconvénients** : EBP en lecture seule pour tickets NinjaOne

2. **Mode Unidirectionnel EBP → NinjaOne**
   - EBP est source de vérité
   - Interventions créées dans EBP apparaissent dans NinjaOne
   - Modifications NinjaOne NE se propagent PAS vers EBP
   - **Cas d'usage** : Visibilité centralisée des interventions terrain dans dashboard NinjaOne
   - **Avantages** : Simplicité
   - **Inconvénients** : Moins pertinent (NinjaOne pas outil de gestion terrain)

3. **Mode Bidirectionnel** (Objectif long terme)
   - Synchronisation dans les deux sens
   - Gestion des conflits
   - **Cas d'usage** : Système unifié, modifications n'importe où se propagent partout
   - **Avantages** : Flexibilité maximale
   - **Inconvénients** : Complexité très élevée

**Recommandation** : **Démarrer en mode 1 (NinjaOne → EBP), évoluer vers mode 3**

#### B. Fréquence de synchronisation

**Options** :

1. **Sync temps réel (< 1 minute)**
   - Via webhooks NinjaOne (si disponibles)
   - Ou polling toutes les 30-60 secondes
   - **Avantages** : Données toujours à jour
   - **Inconvénients** : Charge serveur élevée, risque de boucles

2. **Sync fréquente (5-15 minutes)**
   - Polling toutes les 5-15 minutes
   - **Avantages** : Bon compromis temps réel vs charge
   - **Inconvénients** : Latence acceptable pour la plupart des cas
   - **Recommandé pour** : Production

3. **Sync périodique (1-4 heures)**
   - Cron job toutes les heures
   - **Avantages** : Faible charge
   - **Inconvénients** : Latence élevée
   - **Recommandé pour** : Systèmes non-critiques

4. **Sync manuelle**
   - Déclenchée par admin ou action utilisateur
   - **Avantages** : Contrôle total
   - **Inconvénients** : Pas pratique
   - **Recommandé pour** : Testing, situations exceptionnelles

**Recommandation** :
- **MVP** : Sync périodique toutes les heures (cron)
- **Production** : Sync fréquente toutes les 5 minutes (polling)
- **Futur** : Webhooks temps réel + fallback polling

#### C. Architecture technique

**Composants** :

```
┌─────────────────────────────────────────────────────────────────┐
│                         ARCHITECTURE SYNC                        │
└─────────────────────────────────────────────────────────────────┘

┌────────────────┐                              ┌────────────────┐
│   NinjaOne     │                              │   EBP Database │
│   API (EU)     │                              │   PostgreSQL   │
│                │                              │                │
│ - Tickets      │                              │ - ScheduleEvent│
│ - Orgs         │                              │ - Incident     │
│ - Technicians  │                              │ - Customer     │
│ - Devices      │                              │ - Colleague    │
└────────┬───────┘                              └───────┬────────┘
         │                                              │
         │ REST API                                     │ SQL
         │                                              │
         ▼                                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                    SYNC ENGINE (NestJS)                          │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │              Sync Orchestrator Service                    │  │
│  │  - Schedule cron jobs                                     │  │
│  │  - Coordinate services                                    │  │
│  │  - Handle webhooks (future)                               │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                  │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────────────┐ │
│  │  NinjaOne    │  │   Mapping    │  │   EBP Database       │ │
│  │  Service     │  │   Service    │  │   Service            │ │
│  │              │  │              │  │                      │ │
│  │ - Fetch data │  │ - Map IDs    │  │ - Upsert tickets     │ │
│  │ - Transform  │  │ - Fuzzy match│  │ - Transactions       │ │
│  │ - Cache      │  │ - Resolve FK │  │ - Validation         │ │
│  └──────────────┘  └──────────────┘  └──────────────────────┘ │
│                                                                  │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │                  Conflict Resolver                        │  │
│  │  - Detect conflicts                                       │  │
│  │  - Apply resolution rules                                 │  │
│  │  - Queue manual resolution                                │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                  │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │                  Retry & Error Handler                    │  │
│  │  - Exponential backoff                                    │  │
│  │  - Dead letter queue                                      │  │
│  │  - Monitoring & alerts                                    │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                  │
└──────────────────────────┬───────────────────────────────────────┘
                           │
                           ▼
                  ┌─────────────────┐
                  │  Redis Cache    │
                  │  - Mappings     │
                  │  - Rate limits  │
                  │  - Locks        │
                  └─────────────────┘
                           │
                           ▼
                  ┌─────────────────┐
                  │  Sync DB Schema │
                  │  (mobile.*)     │
                  │                 │
                  │ - ticket_mapping│
                  │ - actor_mapping │
                  │ - status_mapping│
                  │ - sync_history  │
                  │ - sync_failures │
                  └─────────────────┘
```

**Services détaillés** :

1. **SyncOrchestratorService**
```typescript
@Injectable()
export class SyncOrchestratorService {
  constructor(
    private ninjaoneService: NinjaOneService,
    private mappingService: MappingService,
    private ebpService: EbpDatabaseService,
    private conflictResolver: ConflictResolverService
  ) {}

  @Cron('*/5 * * * *') // Toutes les 5 minutes
  async syncIncrementalNinjaOneToEbp() {
    const lastSync = await this.getLastSyncTimestamp('ninjaone_to_ebp');
    const updatedTickets = await this.ninjaoneService.getUpdatedTickets(lastSync);

    const results = {
      total: updatedTickets.length,
      success: 0,
      failed: 0,
      conflicts: 0
    };

    for (const ticket of updatedTickets) {
      try {
        await this.syncTicket(ticket);
        results.success++;
      } catch (error) {
        if (error.code === 'CONFLICT') {
          results.conflicts++;
          await this.conflictResolver.queueForResolution(ticket, error);
        } else {
          results.failed++;
          await this.logError(ticket, error);
        }
      }
    }

    await this.saveSyncHistory('ninjaone_to_ebp', results);
    return results;
  }

  async syncTicket(ninjaoneTicket: NinjaOneTicket) {
    // 1. Map actors (organization, technicians)
    const mapping = await this.mappingService.mapTicket(ninjaoneTicket);

    // 2. Check if ticket already exists in EBP
    const existingMapping = await this.mappingService.getTicketMapping(ninjaoneTicket.id);

    // 3. Transform to EBP format
    const ebpData = this.transformToEbp(ninjaoneTicket, mapping);

    // 4. Upsert in EBP
    if (existingMapping) {
      await this.ebpService.updateScheduleEvent(existingMapping.ebp_schedule_event_id, ebpData);
    } else {
      const ebpId = await this.ebpService.createScheduleEvent(ebpData);
      await this.mappingService.createTicketMapping(ninjaoneTicket.id, ebpId);
    }
  }
}
```

2. **MappingService**
```typescript
@Injectable()
export class MappingService {
  constructor(
    private db: DatabaseService,
    private cache: RedisService
  ) {}

  async mapOrganization(ninjaoneOrgId: number): Promise<string> {
    // Check cache
    const cached = await this.cache.get(`org_map:${ninjaoneOrgId}`);
    if (cached) return cached;

    // Check DB mapping
    const mapping = await this.db.query(`
      SELECT ebp_id
      FROM mobile.actor_mapping
      WHERE entity_type = 'organization' AND ninjaone_id = $1
    `, [ninjaoneOrgId]);

    if (mapping.rows[0]) {
      const ebpId = mapping.rows[0].ebp_id;
      await this.cache.set(`org_map:${ninjaoneOrgId}`, ebpId, 3600);
      return ebpId;
    }

    // Auto-mapping via fuzzy match
    const ninjaoneOrg = await this.ninjaoneService.getOrganization(ninjaoneOrgId);
    const ebpCustomer = await this.fuzzyMatchCustomer(ninjaoneOrg.name);

    if (ebpCustomer && ebpCustomer.confidence > 0.85) {
      await this.createActorMapping('organization', ninjaoneOrgId, ebpCustomer.id, 'fuzzy');
      await this.cache.set(`org_map:${ninjaoneOrgId}`, ebpCustomer.id, 3600);
      return ebpCustomer.id;
    }

    throw new Error(`Organization mapping not found: NinjaOne ID ${ninjaoneOrgId}`);
  }

  async fuzzyMatchCustomer(name: string): Promise<{ id: string, confidence: number }> {
    // Implement fuzzy matching logic
    // ...
  }
}
```

3. **ConflictResolverService**
```typescript
@Injectable()
export class ConflictResolverService {
  async resolveConflict(ticket: Ticket, conflictType: string): Promise<Resolution> {
    // Get resolution strategy from mapping
    const mapping = await this.getTicketMapping(ticket.id);

    switch (mapping.conflict_resolution) {
      case 'source_wins':
        return this.applySourceWins(ticket, mapping);

      case 'last_write':
        return this.applyLastWrite(ticket, mapping);

      case 'field_level':
        return this.applyFieldLevelMerge(ticket, mapping);

      case 'manual':
      default:
        return this.queueForManualResolution(ticket, mapping);
    }
  }

  async queueForManualResolution(ticket: Ticket, mapping: TicketMapping) {
    await this.db.query(`
      INSERT INTO mobile.sync_conflicts (
        ticket_id,
        ninjaone_data,
        ebp_data,
        conflict_type,
        status
      ) VALUES ($1, $2, $3, $4, 'pending')
    `, [ticket.id, ticket.ninjaoneData, ticket.ebpData, 'concurrent_modification']);
  }
}
```

---

### 4.2 Flux de synchronisation détaillés

#### Flow 1: NinjaOne → EBP (Nouveau ticket)

```
┌────────────────────────────────────────────────────────────────┐
│  1. CRÉATION TICKET DANS NINJAONE                              │
└────────────────────────────────────────────────────────────────┘
   Ticket ID: 1234
   Subject: "Serveur exchange down"
   Organization ID: 123
   Assigned Technician ID: 5
   Status: IN_PROGRESS (2001)
   Created: 2025-10-24 10:00:00

                        ▼

┌────────────────────────────────────────────────────────────────┐
│  2. SYNC ENGINE - FETCH TICKET (API NinjaOne)                  │
└────────────────────────────────────────────────────────────────┘
   GET /v2/ticketing/ticket/1234
   Response: { id: 1234, subject: "...", ... }

                        ▼

┌────────────────────────────────────────────────────────────────┐
│  3. MAPPING SERVICE - RESOLVE ACTORS                           │
└────────────────────────────────────────────────────────────────┘
   Organization 123 → Lookup mobile.actor_mapping
     → Found: EBP Customer "C00042" (ACME Corp)

   Technician 5 → Lookup mobile.actor_mapping
     → Found: EBP Colleague "TECH01" (Jean Dupont)

                        ▼

┌────────────────────────────────────────────────────────────────┐
│  4. MAPPING SERVICE - RESOLVE STATUS                           │
└────────────────────────────────────────────────────────────────┘
   NinjaOne Status 2001 (IN_PROGRESS)
     → Lookup mobile.status_mapping
     → EBP EventState 2 (En cours)

                        ▼

┌────────────────────────────────────────────────────────────────┐
│  5. TRANSFORM SERVICE - BUILD EBP DATA                         │
└────────────────────────────────────────────────────────────────┘
   {
     Id: <generate new UUID>,
     ScheduleEventNumber: "NJ1234",
     Maintenance_InterventionDescription: "Serveur exchange down",
     CustomerId: "C00042",
     ColleagueId: "TECH01",
     EventState: 2,
     StartDate: "2025-10-24 10:00:00",
     xx_NinjaOne_Ticket_ID: 1234,
     xx_Priority: "HIGH"
   }

                        ▼

┌────────────────────────────────────────────────────────────────┐
│  6. EBP SERVICE - INSERT SCHEDULEEVENT                         │
└────────────────────────────────────────────────────────────────┘
   BEGIN TRANSACTION;

   INSERT INTO public."ScheduleEvent" (...) VALUES (...);
   → EBP UUID: 550e8400-e29b-41d4-a716-446655440000

   INSERT INTO mobile.ticket_mapping (
     ninjaone_ticket_id,
     ebp_schedule_event_id,
     source_system,
     sync_direction
   ) VALUES (
     1234,
     '550e8400-e29b-41d4-a716-446655440000',
     'ninjaone',
     'unidirectional'
   );

   COMMIT;

                        ▼

┌────────────────────────────────────────────────────────────────┐
│  7. SYNC HISTORY - LOG SUCCESS                                 │
└────────────────────────────────────────────────────────────────┘
   INSERT INTO mobile.sync_history (
     sync_type,
     direction,
     total_tickets,
     success_count,
     completed_at
   ) VALUES (
     'incremental',
     'ninjaone_to_ebp',
     1,
     1,
     NOW()
   );

                        ▼

                ✅ SYNC COMPLETE
   Ticket NinjaOne 1234 → EBP ScheduleEvent 550e8400...
```

#### Flow 2: NinjaOne → EBP (Mise à jour ticket existant)

```
┌────────────────────────────────────────────────────────────────┐
│  1. MODIFICATION TICKET DANS NINJAONE                          │
└────────────────────────────────────────────────────────────────┘
   Ticket ID: 1234
   Status: IN_PROGRESS → RESOLVED (5000)
   Time Spent: 0 → 7200 seconds (2h)
   Updated: 2025-10-24 14:30:00

                        ▼

┌────────────────────────────────────────────────────────────────┐
│  2. SYNC ENGINE - DETECT CHANGE (Incremental)                 │
└────────────────────────────────────────────────────────────────┘
   Query: WHERE updated_at > '2025-10-24 10:05:00'
   Found: Ticket 1234

                        ▼

┌────────────────────────────────────────────────────────────────┐
│  3. MAPPING SERVICE - FIND EXISTING MAPPING                    │
└────────────────────────────────────────────────────────────────┘
   SELECT ebp_schedule_event_id, last_sync_checksum
   FROM mobile.ticket_mapping
   WHERE ninjaone_ticket_id = 1234;

   Found: EBP UUID 550e8400-e29b-41d4-a716-446655440000
   Last Checksum: "abc123..."

                        ▼

┌────────────────────────────────────────────────────────────────┐
│  4. CONFLICT DETECTOR - CHECK FOR CONCURRENT MODIFICATIONS     │
└────────────────────────────────────────────────────────────────┘
   NinjaOne updated_at: 2025-10-24 14:30:00
   EBP sysModifiedDate: 2025-10-24 10:05:00 (last sync)

   ✅ No conflict (EBP not modified since last sync)

                        ▼

┌────────────────────────────────────────────────────────────────┐
│  5. TRANSFORM SERVICE - BUILD UPDATE DATA                      │
└────────────────────────────────────────────────────────────────┘
   {
     EventState: 2 → 4 (Terminé),
     AchievedDuration_DurationInHours: 7200 / 3600 = 2.0,
     EndDate: "2025-10-24 14:30:00",
     xx_NinjaOne_Status: "RESOLVED"
   }

                        ▼

┌────────────────────────────────────────────────────────────────┐
│  6. EBP SERVICE - UPDATE SCHEDULEEVENT                         │
└────────────────────────────────────────────────────────────────┘
   UPDATE public."ScheduleEvent"
   SET
     "EventState" = 4,
     "AchievedDuration_DurationInHours" = 2.0,
     "EndDate" = '2025-10-24 14:30:00',
     xx_Sync_Source = 'ninjaone_sync',
     xx_Last_Synced_At = NOW()
   WHERE "Id" = '550e8400-e29b-41d4-a716-446655440000';

                        ▼

┌────────────────────────────────────────────────────────────────┐
│  7. UPDATE MAPPING - SAVE CHECKSUM                             │
└────────────────────────────────────────────────────────────────┘
   UPDATE mobile.ticket_mapping
   SET
     last_sync_at = NOW(),
     last_sync_direction = 'ninjaone_to_ebp',
     last_sync_checksum = 'def456...'
   WHERE ninjaone_ticket_id = 1234;

                        ▼

                ✅ UPDATE COMPLETE
```

#### Flow 3: Gestion d'un conflit

```
┌────────────────────────────────────────────────────────────────┐
│  1. MODIFICATIONS CONCURRENTES                                 │
└────────────────────────────────────────────────────────────────┘
   NinjaOne (14:30): Status → RESOLVED, Time Spent → 2h
   EBP (14:25):      Status → En attente (3), Notes ajoutées

                        ▼

┌────────────────────────────────────────────────────────────────┐
│  2. CONFLICT DETECTOR - DETECT CONCURRENT MODIFICATION         │
└────────────────────────────────────────────────────────────────┘
   NinjaOne updated_at: 2025-10-24 14:30:00
   EBP sysModifiedDate: 2025-10-24 14:25:00
   Last Sync: 2025-10-24 10:05:00

   ❌ CONFLICT DETECTED
   Both systems modified since last sync

                        ▼

┌────────────────────────────────────────────────────────────────┐
│  3. CONFLICT RESOLVER - DETERMINE STRATEGY                     │
└────────────────────────────────────────────────────────────────┘
   Ticket Mapping config: conflict_resolution = 'source_wins'
   Source System: 'ninjaone'

   Decision: NinjaOne data wins

                        ▼

┌────────────────────────────────────────────────────────────────┐
│  4. APPLY RESOLUTION - MERGE STRATEGY                          │
└────────────────────────────────────────────────────────────────┘
   Strategy: Source wins + preserve non-conflicting fields

   From NinjaOne (wins):
     - Status → RESOLVED (4)
     - Time Spent → 2h

   From EBP (preserve):
     - Notes → Keep EBP notes (non-conflicting field)

   Final State:
     - Status: RESOLVED (4)
     - Time: 2h
     - Notes: EBP notes preserved

                        ▼

┌────────────────────────────────────────────────────────────────┐
│  5. LOG CONFLICT                                               │
└────────────────────────────────────────────────────────────────┘
   INSERT INTO mobile.sync_conflicts (
     ticket_id,
     conflict_type,
     resolution_strategy,
     ninjaone_data,
     ebp_data,
     merged_data,
     status,
     resolved_at
   ) VALUES (
     1234,
     'concurrent_modification',
     'source_wins',
     '{"status": "RESOLVED", ...}',
     '{"EventState": 3, ...}',
     '{"EventState": 4, "Notes": "..."}',
     'auto_resolved',
     NOW()
   );

                        ▼

                ✅ CONFLICT RESOLVED
```

---

### 4.3 Tables de synchronisation

#### Table: mobile.ticket_mapping

```sql
CREATE TABLE mobile.ticket_mapping (
  id SERIAL PRIMARY KEY,

  -- Identifiants NinjaOne
  ninjaone_ticket_id INTEGER NOT NULL UNIQUE,
  ninjaone_ticket_uid VARCHAR(255),

  -- Identifiants EBP
  ebp_schedule_event_id UUID REFERENCES public."ScheduleEvent"("Id"),
  ebp_incident_id VARCHAR(8) REFERENCES public."Incident"("Id"),

  -- Configuration sync
  source_system VARCHAR(20) NOT NULL, -- 'ninjaone' ou 'ebp'
  sync_direction VARCHAR(20) NOT NULL DEFAULT 'unidirectional',
    -- 'unidirectional', 'bidirectional'
  conflict_resolution VARCHAR(50) DEFAULT 'source_wins',
    -- 'source_wins', 'last_write', 'field_level', 'manual'

  -- Tracking sync
  last_sync_at TIMESTAMP WITH TIME ZONE,
  last_sync_direction VARCHAR(20), -- 'ninjaone_to_ebp', 'ebp_to_ninjaone'
  last_sync_checksum VARCHAR(64), -- SHA256 du contenu
  sync_count INTEGER DEFAULT 0,

  -- Status
  is_active BOOLEAN DEFAULT TRUE,
  sync_enabled BOOLEAN DEFAULT TRUE,

  -- Métadonnées
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  CONSTRAINT chk_ebp_reference CHECK (
    ebp_schedule_event_id IS NOT NULL OR ebp_incident_id IS NOT NULL
  )
);

CREATE INDEX idx_ticket_mapping_ninjaone ON mobile.ticket_mapping(ninjaone_ticket_id);
CREATE INDEX idx_ticket_mapping_ebp_schedule ON mobile.ticket_mapping(ebp_schedule_event_id);
CREATE INDEX idx_ticket_mapping_ebp_incident ON mobile.ticket_mapping(ebp_incident_id);
CREATE INDEX idx_ticket_mapping_last_sync ON mobile.ticket_mapping(last_sync_at);
```

#### Table: mobile.actor_mapping

```sql
CREATE TABLE mobile.actor_mapping (
  id SERIAL PRIMARY KEY,

  -- Type d'entité
  entity_type VARCHAR(50) NOT NULL, -- 'organization', 'technician', 'device'

  -- Identifiants NinjaOne
  ninjaone_id INTEGER NOT NULL,
  ninjaone_name VARCHAR(255),
  ninjaone_email VARCHAR(255),

  -- Identifiants EBP
  ebp_id VARCHAR(50),
  ebp_entity_table VARCHAR(100), -- 'Customer', 'Colleague', etc.
  ebp_name VARCHAR(255),
  ebp_email VARCHAR(255),

  -- Matching
  match_method VARCHAR(50), -- 'manual', 'fuzzy', 'email', 'exact'
  confidence_score NUMERIC(3,2) DEFAULT 1.0, -- 0.00 à 1.00

  -- Vérification
  is_verified BOOLEAN DEFAULT FALSE,
  verified_by VARCHAR(100),
  verified_at TIMESTAMP WITH TIME ZONE,

  -- Status
  is_active BOOLEAN DEFAULT TRUE,

  -- Métadonnées
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  UNIQUE(entity_type, ninjaone_id)
);

CREATE INDEX idx_actor_mapping_lookup ON mobile.actor_mapping(entity_type, ninjaone_id);
CREATE INDEX idx_actor_mapping_ebp ON mobile.actor_mapping(entity_type, ebp_id);
CREATE INDEX idx_actor_mapping_email ON mobile.actor_mapping(ninjaone_email, ebp_email);
CREATE INDEX idx_actor_mapping_unverified ON mobile.actor_mapping(is_verified) WHERE is_verified = FALSE;
```

#### Table: mobile.status_mapping

```sql
CREATE TABLE mobile.status_mapping (
  id SERIAL PRIMARY KEY,

  -- Statuts NinjaOne
  ninjaone_status_id INTEGER,
  ninjaone_status_name VARCHAR(100),
  ninjaone_is_open BOOLEAN,
  ninjaone_is_closed BOOLEAN,

  -- Statuts EBP ScheduleEvent
  ebp_event_state INTEGER,
  ebp_event_state_name VARCHAR(100),

  -- Statuts EBP Incident
  ebp_incident_status INTEGER,
  ebp_incident_status_name VARCHAR(100),

  -- Configuration
  direction VARCHAR(20), -- 'ninjaone_to_ebp', 'ebp_to_ninjaone', 'bidirectional'
  is_default BOOLEAN DEFAULT FALSE,
  priority INTEGER DEFAULT 0, -- Pour résoudre ambiguïtés

  -- Métadonnées
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Données initiales (à ajuster selon analyse EBP)
INSERT INTO mobile.status_mapping VALUES
(1, 1000, 'NEW', TRUE, FALSE, 0, 'Planifié', NULL, NULL, 'bidirectional', TRUE, 1, 'Nouveau ticket = Intervention à planifier'),
(2, 2000, 'OPEN', TRUE, FALSE, 1, 'Confirmé', NULL, NULL, 'bidirectional', TRUE, 1, 'Ticket ouvert = Intervention confirmée'),
(3, 2001, 'IN_PROGRESS', TRUE, FALSE, 2, 'En cours', NULL, NULL, 'bidirectional', TRUE, 1, 'Direct'),
(4, 3000, 'ON_HOLD', TRUE, FALSE, 3, 'En attente', NULL, NULL, 'bidirectional', TRUE, 1, 'Direct'),
(5, 3001, 'PAUSED', TRUE, FALSE, 3, 'En attente', NULL, NULL, 'ninjaone_to_ebp', FALSE, 2, 'PAUSED mapped to En attente (perte distinction)'),
(6, 5000, 'RESOLVED', FALSE, FALSE, 4, 'Terminé', NULL, NULL, 'bidirectional', TRUE, 1, 'Résolu = Terminé'),
(7, 6000, 'CLOSED', FALSE, TRUE, 9, 'Annulé', NULL, NULL, 'ninjaone_to_ebp', TRUE, 1, 'Fermé = Annulé (à ajuster)');
```

#### Table: mobile.sync_history

```sql
CREATE TABLE mobile.sync_history (
  id SERIAL PRIMARY KEY,

  -- Type de sync
  sync_type VARCHAR(50) NOT NULL, -- 'incremental', 'full', 'manual'
  direction VARCHAR(50) NOT NULL, -- 'ninjaone_to_ebp', 'ebp_to_ninjaone'

  -- Statistiques
  total_tickets INTEGER,
  success_count INTEGER DEFAULT 0,
  failed_count INTEGER DEFAULT 0,
  conflict_count INTEGER DEFAULT 0,
  skipped_count INTEGER DEFAULT 0,

  -- Timing
  started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  completed_at TIMESTAMP WITH TIME ZONE,
  duration_seconds INTEGER,

  -- Détails
  error_summary TEXT,
  processed_ticket_ids TEXT, -- JSON array

  -- Métadonnées
  triggered_by VARCHAR(100), -- 'cron', 'webhook', 'manual:admin_name'
  sync_version VARCHAR(20) DEFAULT '1.0'
);

CREATE INDEX idx_sync_history_completed ON mobile.sync_history(completed_at DESC);
CREATE INDEX idx_sync_history_direction ON mobile.sync_history(direction);
```

#### Table: mobile.sync_failures

```sql
CREATE TABLE mobile.sync_failures (
  id SERIAL PRIMARY KEY,

  -- Identification
  ticket_id VARCHAR(255) NOT NULL,
  source_system VARCHAR(20) NOT NULL, -- 'ninjaone', 'ebp'

  -- Erreur
  error_type VARCHAR(100), -- 'mapping_not_found', 'validation_error', 'timeout', 'api_error'
  error_message TEXT,
  error_stack TEXT,

  -- Retry
  reason VARCHAR(100), -- 'non_retriable', 'max_retries', 'timeout'
  retry_count INTEGER DEFAULT 0,
  max_retries INTEGER DEFAULT 3,
  retry_after TIMESTAMP WITH TIME ZONE,

  -- Résolution
  status VARCHAR(50) DEFAULT 'pending', -- 'pending', 'retrying', 'resolved', 'ignored'
  resolved_at TIMESTAMP WITH TIME ZONE,
  resolved_by VARCHAR(100),
  resolution_notes TEXT,

  -- Métadonnées
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_sync_failures_pending ON mobile.sync_failures(status, retry_after)
  WHERE status = 'pending';
CREATE INDEX idx_sync_failures_ticket ON mobile.sync_failures(ticket_id, source_system);
```

#### Table: mobile.sync_conflicts

```sql
CREATE TABLE mobile.sync_conflicts (
  id SERIAL PRIMARY KEY,

  -- Identification
  ticket_id INTEGER NOT NULL,
  ninjaone_ticket_id INTEGER,
  ebp_schedule_event_id UUID,

  -- Type de conflit
  conflict_type VARCHAR(100), -- 'concurrent_modification', 'status_mismatch', 'actor_changed'
  conflicting_fields TEXT[], -- Array de noms de champs

  -- Données en conflit
  ninjaone_data JSONB,
  ebp_data JSONB,

  -- Résolution
  resolution_strategy VARCHAR(50), -- 'source_wins', 'last_write', 'field_level', 'manual'
  merged_data JSONB,
  status VARCHAR(50) DEFAULT 'pending', -- 'pending', 'auto_resolved', 'manual_resolved', 'ignored'

  -- Timing
  detected_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  resolved_at TIMESTAMP WITH TIME ZONE,
  resolved_by VARCHAR(100),
  resolution_notes TEXT,

  -- Métadonnées
  sync_history_id INTEGER REFERENCES mobile.sync_history(id)
);

CREATE INDEX idx_sync_conflicts_pending ON mobile.sync_conflicts(status)
  WHERE status = 'pending';
CREATE INDEX idx_sync_conflicts_ticket ON mobile.sync_conflicts(ninjaone_ticket_id);
```

---

## 5. ARCHITECTURE TECHNIQUE

### 5.1 Module NestJS de synchronisation

**Structure proposée** :

```
backend/src/sync/
├── sync.module.ts
├── controllers/
│   ├── sync.controller.ts           # Endpoints API sync
│   └── sync-admin.controller.ts     # Interface admin conflicts
├── services/
│   ├── sync-orchestrator.service.ts # Coordinateur principal
│   ├── ninjaone-sync.service.ts     # Fetch NinjaOne
│   ├── ebp-sync.service.ts          # Write EBP
│   ├── mapping.service.ts           # Résolution mappings
│   ├── transform.service.ts         # Transformations données
│   ├── conflict-resolver.service.ts # Gestion conflits
│   └── retry-handler.service.ts     # Retry & error handling
├── dto/
│   ├── sync-ticket.dto.ts
│   ├── sync-stats.dto.ts
│   └── conflict-resolution.dto.ts
├── entities/
│   ├── ticket-mapping.entity.ts
│   ├── actor-mapping.entity.ts
│   ├── status-mapping.entity.ts
│   ├── sync-history.entity.ts
│   ├── sync-failure.entity.ts
│   └── sync-conflict.entity.ts
├── interfaces/
│   ├── sync-config.interface.ts
│   └── mapping-result.interface.ts
├── utils/
│   ├── checksum.util.ts
│   ├── fuzzy-match.util.ts
│   └── type-converter.util.ts
└── constants/
    └── sync.constants.ts
```

**Endpoints API** :

```typescript
// sync.controller.ts
@Controller('api/sync')
@UseGuards(JwtAuthGuard, RolesGuard)
export class SyncController {
  @Post('ninjaone-to-ebp')
  @Roles('super_admin', 'admin')
  async syncNinjaOneToEbp(@Body() options?: SyncOptions) {
    return this.syncOrchestrator.syncNinjaOneToEbp(options);
  }

  @Post('ebp-to-ninjaone')
  @Roles('super_admin', 'admin')
  async syncEbpToNinjaOne(@Body() options?: SyncOptions) {
    return this.syncOrchestrator.syncEbpToNinjaOne(options);
  }

  @Get('status')
  async getSyncStatus() {
    return this.syncOrchestrator.getStatus();
  }

  @Get('history')
  async getSyncHistory(@Query() query: SyncHistoryQueryDto) {
    return this.syncOrchestrator.getHistory(query);
  }

  @Get('failures')
  @Roles('super_admin', 'admin')
  async getFailures(@Query() query: FailureQueryDto) {
    return this.syncOrchestrator.getFailures(query);
  }

  @Post('failures/:id/retry')
  @Roles('super_admin', 'admin')
  async retryFailure(@Param('id') id: number) {
    return this.syncOrchestrator.retryFailure(id);
  }

  @Get('conflicts')
  @Roles('super_admin', 'admin')
  async getConflicts(@Query() query: ConflictQueryDto) {
    return this.conflictResolver.getConflicts(query);
  }

  @Post('conflicts/:id/resolve')
  @Roles('super_admin', 'admin')
  async resolveConflict(
    @Param('id') id: number,
    @Body() resolution: ConflictResolutionDto
  ) {
    return this.conflictResolver.resolveManually(id, resolution);
  }
}
```

---

### 5.2 Interface d'administration

**Dashboard de synchronisation** :

```
┌─────────────────────────────────────────────────────────────────┐
│                  DASHBOARD SYNCHRONISATION                       │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│  Statut Général                                                  │
├─────────────────────────────────────────────────────────────────┤
│  Dernière sync: Il y a 5 minutes (14:25)                         │
│  Prochaine sync: Dans 10 minutes (14:40)                         │
│  Mode: Incrémental automatique (toutes les 15 min)               │
│                                                                  │
│  [  Lancer sync manuelle  ]  [  Configurer  ]                   │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│  Statistiques 24h                                                │
├─────────────────────────────────────────────────────────────────┤
│  ┌──────────────┬───────────┬─────────┬──────────┬──────────┐  │
│  │ Direction    │ Succès    │ Échecs  │ Conflits │ Total    │  │
│  ├──────────────┼───────────┼─────────┼──────────┼──────────┤  │
│  │ NinjaOne→EBP │ 156 (98%) │ 2 (1%)  │ 1 (1%)   │ 159      │  │
│  │ EBP→NinjaOne │ -         │ -       │ -        │ -        │  │
│  └──────────────┴───────────┴─────────┴──────────┴──────────┘  │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│  Mappings                                                        │
├─────────────────────────────────────────────────────────────────┤
│  Organisations: 95/114 mappées (83%)  [  Gérer mappings  ]      │
│  Techniciens:   10/11 mappés (91%)    [  Gérer mappings  ]      │
│  Tickets:       842/965 synchronisés  [  Voir détails   ]       │
│                                                                  │
│  ⚠️ 19 organisations non mappées                                │
│  ⚠️ 1 technicien non mappé                                      │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│  Alertes                                                         │
├─────────────────────────────────────────────────────────────────┤
│  🔴 1 conflit nécessite résolution manuelle                     │
│     Ticket #1234 : Modifications concurrentes                   │
│     [  Résoudre maintenant  ]                                   │
│                                                                  │
│  🟡 2 échecs en attente de retry                                │
│     Tickets #1345, #1567 : Mapping organisation manquant        │
│     [  Voir détails  ]                                          │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│  Historique récent                                               │
├─────────────────────────────────────────────────────────────────┤
│  14:25  Sync incrémentale NinjaOne→EBP  ✅ 12 tickets           │
│  14:10  Sync incrémentale NinjaOne→EBP  ✅ 8 tickets            │
│  13:55  Sync incrémentale NinjaOne→EBP  ✅ 15 tickets           │
│  13:40  Sync incrémentale NinjaOne→EBP  ⚠️  10 tickets, 1 conflit │
│                                                                  │
│  [  Voir historique complet  ]                                  │
└─────────────────────────────────────────────────────────────────┘
```

**Interface de résolution des conflits** :

```
┌─────────────────────────────────────────────────────────────────┐
│  Résolution Conflit : Ticket #1234                               │
└─────────────────────────────────────────────────────────────────┘

Type de conflit: Modifications concurrentes
Détecté le: 24/10/2025 14:25

┌─────────────────────────────────────────────────────────────────┐
│  Champs en conflit                                               │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  Status:                                                         │
│    NinjaOne (14:30): RESOLVED                                    │
│    EBP (14:25):      En attente (3)                              │
│    [  NinjaOne  ]  [  EBP  ]  [  Manuel:  ▼  ]                  │
│                                                                  │
│  Temps passé:                                                    │
│    NinjaOne (14:30): 2.0 heures                                  │
│    EBP (14:25):      1.5 heures                                  │
│    [  NinjaOne  ]  [  EBP  ]  [  Manuel: [____] heures  ]       │
│                                                                  │
│  Notes:                                                          │
│    NinjaOne (14:30): (vide)                                      │
│    EBP (14:25):      "En attente pièce détachée"                │
│    [  NinjaOne  ]  [  EBP  ]  [  Fusionner les deux  ]          │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│  Stratégie de résolution                                         │
├─────────────────────────────────────────────────────────────────┤
│  (•) NinjaOne gagne (source de vérité)                           │
│  ( ) EBP gagne                                                   │
│  ( ) Dernière modification gagne                                 │
│  ( ) Fusion champ par champ (sélection ci-dessus)               │
│                                                                  │
│  [ ] Appliquer cette stratégie pour futurs conflits similaires  │
└─────────────────────────────────────────────────────────────────┘

Notes (optionnel):
┌─────────────────────────────────────────────────────────────────┐
│                                                                  │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘

[  Annuler  ]  [  Appliquer résolution  ]
```

---

## 6. PLAN D'IMPLÉMENTATION

### Phase 1: Fondations (2 semaines)

**Semaine 1: Setup infrastructure**
- [ ] Créer module NestJS `backend/src/sync`
- [ ] Créer migrations pour tables de synchronisation :
  - `mobile.ticket_mapping`
  - `mobile.actor_mapping`
  - `mobile.status_mapping`
  - `mobile.sync_history`
  - `mobile.sync_failures`
  - `mobile.sync_conflicts`
- [ ] Implémenter entités TypeORM
- [ ] Setup Redis pour cache mappings

**Semaine 2: Services de base**
- [ ] `MappingService` : Résolution IDs (organisations, techniciens)
- [ ] `TransformService` : Conversions NinjaOne ↔ EBP
- [ ] `TypeConverterUtil` : Conversions types (secondes/heures, timestamps, etc.)
- [ ] Tests unitaires services

**Livrables** :
- ✅ Infrastructure BD prête
- ✅ Services de base testés
- ✅ Cache Redis opérationnel

---

### Phase 2: Mapping initial (2 semaines)

**Semaine 3: Analyse et matching automatique**
- [ ] Script d'analyse des données EBP :
  - Identifier valeurs `EventState` existantes
  - Identifier types `EventType`
  - Statistiques clients/techniciens
- [ ] Implémenter fuzzy matching organisations :
  - Algorithme Jaro-Winkler
  - Normalisation noms (SARL, accents, etc.)
  - Seuil de confiance 85%
- [ ] Implémenter matching techniciens par email
- [ ] Générer table `status_mapping` complète

**Semaine 4: Validation manuelle**
- [ ] Interface admin pour valider/corriger mappings
- [ ] Export CSV mappings pour revue
- [ ] Import CSV mappings corrigés
- [ ] Statistiques qualité mappings

**Livrables** :
- ✅ 80%+ organisations mappées automatiquement
- ✅ 90%+ techniciens mappés
- ✅ Table `status_mapping` validée
- ✅ Interface validation opérationnelle

---

### Phase 3: Sync unidirectionnelle MVP (3 semaines)

**Semaine 5: Sync basique NinjaOne → EBP**
- [ ] `SyncOrchestratorService` : Fetch tickets NinjaOne
- [ ] Transformation vers format EBP
- [ ] Insertion `ScheduleEvent` (nouveaux tickets)
- [ ] Mise à jour `ScheduleEvent` (tickets existants)
- [ ] Logging dans `sync_history`

**Semaine 6: Gestion erreurs**
- [ ] `RetryHandlerService` : Retry avec exponential backoff
- [ ] Logging `sync_failures`
- [ ] Dead letter queue pour échecs non-retriables
- [ ] Monitoring et alertes (email admin)

**Semaine 7: Optimisations et tests**
- [ ] Sync incrémentale (basée sur `updated_at`)
- [ ] Batch processing (100 tickets/batch)
- [ ] Index BD pour performance
- [ ] Tests E2E sync complète
- [ ] Documentation technique

**Livrables** :
- ✅ Sync manuelle fonctionnelle
- ✅ Gestion erreurs robuste
- ✅ Tests E2E passent
- ✅ Documentation complète

---

### Phase 4: Automatisation et monitoring (2 semaines)

**Semaine 8: Cron et automation**
- [ ] Cron job sync toutes les heures
- [ ] Configuration via variables d'environnement
- [ ] Endpoints API pour déclencher sync manuellement
- [ ] Pause/Reprise synchronisation

**Semaine 9: Dashboard admin**
- [ ] Interface stats synchronisation
- [ ] Visualisation historique
- [ ] Gestion échecs (retry, ignore)
- [ ] Export rapports

**Livrables** :
- ✅ Sync automatique opérationnelle
- ✅ Dashboard admin fonctionnel
- ✅ Monitoring en place

---

### Phase 5: Sync bidirectionnelle (4 semaines) - OPTIONNEL

**Semaine 10-11: EBP → NinjaOne**
- [ ] Service sync inverse
- [ ] Trigger PostgreSQL sur `ScheduleEvent` UPDATE
- [ ] Transformation EBP → NinjaOne
- [ ] Update tickets NinjaOne via API

**Semaine 12: Détection conflits**
- [ ] `ConflictDetectorService`
- [ ] Calcul checksums
- [ ] Cooldown period
- [ ] Flag `xx_Sync_Source`

**Semaine 13: Résolution conflits**
- [ ] Stratégies résolution (source wins, last write, field level)
- [ ] Interface résolution manuelle
- [ ] Tests conflits

**Livrables** :
- ✅ Sync bidirectionnelle opérationnelle
- ✅ Gestion conflits robuste
- ✅ Interface résolution intuitive

---

### Phase 6: Fonctionnalités avancées (3 semaines) - FUTUR

**Semaine 14: Commentaires et pièces jointes**
- [ ] Sync commentaires NinjaOne → EBP
- [ ] Sync pièces jointes (stockage S3/MinIO)
- [ ] Vue unifiée `mobile.v_unified_ticket_comments`

**Semaine 15: Webhooks temps réel**
- [ ] Endpoint webhook NinjaOne
- [ ] Validation signature webhook
- [ ] Sync immédiate sur événement
- [ ] Fallback polling si webhook échoue

**Semaine 16: Analytics et optimisations**
- [ ] Métriques temps synchronisation
- [ ] Optimisation requêtes BD
- [ ] Cache Redis agressif
- [ ] Compression données historiques

**Livrables** :
- ✅ Commentaires synchronisés
- ✅ Webhooks temps réel opérationnels
- ✅ Performance optimale

---

## 7. RECOMMANDATIONS

### 7.1 Recommandations stratégiques

#### A. Démarrer en mode unidirectionnel (NinjaOne → EBP)

**Justification** :
- **Simplicité** : Pas de gestion des conflits, pas de boucles de synchronisation
- **Risque faible** : EBP reste en lecture seule pour les tickets NinjaOne
- **Temps de mise en œuvre** : 6-9 semaines au lieu de 13-16 semaines
- **ROI rapide** : Techniciens peuvent consulter tickets NinjaOne depuis l'app mobile EBP

**Cas d'usage** :
- Ticket créé dans NinjaOne (alerte monitoring serveur)
- Sync automatique vers EBP toutes les heures
- Technicien voit le ticket dans son app mobile
- Technicien met à jour statut/notes dans EBP
- **Mise à jour reste locale à EBP** (ne remonte pas vers NinjaOne pour MVP)

**Évolution future** : Passer en mode bidirectionnel en Phase 5 (optionnel)

#### B. Ne synchroniser que les tickets pertinents

**Problème** : Les deux systèmes ont des modèles métier différents (support IT vs interventions terrain)

**Recommandation** : Filtrer les tickets à synchroniser

**Critères de filtre NinjaOne → EBP** :
```sql
-- Ne synchroniser que les tickets nécessitant intervention physique
SELECT * FROM ninjaone.fact_tickets
WHERE
  -- Catégories pertinentes
  category IN ('Hardware', 'Network', 'On-site', 'Printer', 'Installation')
  -- Ou tags spécifiques
  OR tags @> '["on-site", "intervention"]'::jsonb
  -- Ou priorité élevée
  OR priority IN ('HIGH', 'URGENT', 'CRITICAL')
  -- Ou device avec localisation
  OR device_id IS NOT NULL;
```

**Avantages** :
- Réduit volume de données à synchroniser (965 → ~200-300 tickets pertinents)
- Évite pollution EBP avec tickets purement IT/software
- Focus sur tickets à valeur ajoutée pour techniciens terrain

**Configuration** :
```typescript
// config/sync.config.ts
export const SYNC_FILTERS = {
  ninjaone_to_ebp: {
    categories: ['Hardware', 'Network', 'On-site', 'Printer'],
    tags: ['on-site', 'intervention', 'maintenance'],
    min_priority: 'MEDIUM',
    exclude_categories: ['Software', 'Remote Support', 'Billing']
  }
};
```

#### C. Mapping initial assisté (humain dans la boucle)

**Problème** : Matching automatique peut échouer (noms différents, homonymes, etc.)

**Recommandation** : Approche hybride automatique + validation manuelle

**Phase 1 : Matching automatique** (Semaine 3)
- Email exact → 95% confiance
- Email similaire (jdupont@ vs jean.dupont@) → 85% confiance
- Fuzzy matching nom > 90% → 80% confiance
- Fuzzy matching nom > 85% → 70% confiance (flaguer pour validation)

**Phase 2 : Validation manuelle** (Semaine 4)
- Interface admin affiche correspondances < 85% confiance
- Admin valide ou corrige manuellement
- Export CSV pour revue bulk

**Phase 3 : Apprentissage** (Continu)
- Système apprend des validations manuelles
- Améliore l'algorithme de matching
- Réduit progressivement le taux de validation manuelle

**Métrique de succès** :
- 80%+ organisations mappées automatiquement avec confiance > 85%
- 90%+ techniciens mappés automatiquement
- < 10% de corrections manuelles après validation initiale

#### D. Gestion prudente des statuts

**Problème** : Sémantique différente entre NinjaOne et EBP

**Recommandation** : Mapping conservateur + champ original

**Stratégie** :
1. Créer table `mobile.status_mapping` avec règles explicites
2. Ajouter champ `xx_NinjaOne_Status` dans EBP pour préserver statut original
3. Ne pas synchroniser certains statuts (ex: TO_BILL si pas géré dans EBP)
4. Documenter les pertes d'information (PAUSED vs ON_HOLD → En attente)

**Exemple** :
```sql
-- Ticket NinjaOne PAUSED devient En attente dans EBP
-- Mais on garde trace de l'original
UPDATE public."ScheduleEvent"
SET
  "EventState" = 3, -- En attente
  xx_NinjaOne_Status = 'PAUSED',
  xx_NinjaOne_Status_ID = 3001
WHERE "Id" = '...';

-- Si besoin de revenir en arrière, on peut retrouver l'info
```

**Règle d'or** : **Ne jamais écraser un statut terminal** (CLOSED, CANCELLED) sans validation manuelle

---

### 7.2 Recommandations techniques

#### A. Utiliser PostgreSQL JSONB pour flexibilité

**Problème** : Structures de données différentes, champs custom variés

**Recommandation** : Stocker données brutes en JSONB pour traçabilité

```sql
-- Ajouter colonne JSONB dans ScheduleEvent pour données NinjaOne brutes
ALTER TABLE public."ScheduleEvent"
ADD COLUMN xx_NinjaOne_Raw_Data JSONB;

-- Lors de la sync, stocker les données originales
UPDATE public."ScheduleEvent"
SET
  ..., -- Champs mappés
  xx_NinjaOne_Raw_Data = '{
    "ticket_id": 1234,
    "status": {"statusId": 2001, "displayName": "En cours"},
    "priority": "HIGH",
    "tags": ["urgent", "hardware"],
    "custom_fields": { ... }
  }'::jsonb
WHERE ...;
```

**Avantages** :
- Traçabilité complète (toujours possible de reconstruire état original)
- Debuggage facilité
- Permet d'ajouter mappings futurs sans migration
- Requêtes JSON possibles (`xx_NinjaOne_Raw_Data->>'priority'`)

**Inconvénient** :
- Augmente taille BD (~2-5 Ko par ticket)

**Mitigation** : Compresser JSONB après 6 mois d'âge

#### B. Implémenter circuit breaker

**Problème** : Si API NinjaOne down, les retries peuvent surcharger le système

**Recommandation** : Pattern Circuit Breaker

```typescript
@Injectable()
export class NinjaOneCircuitBreaker {
  private state: 'CLOSED' | 'OPEN' | 'HALF_OPEN' = 'CLOSED';
  private failureCount = 0;
  private lastFailureTime: Date;

  async call<T>(fn: () => Promise<T>): Promise<T> {
    if (this.state === 'OPEN') {
      // Circuit ouvert : refuser les appels pendant cooldown
      const cooldown = 5 * 60 * 1000; // 5 minutes
      if (Date.now() - this.lastFailureTime.getTime() < cooldown) {
        throw new Error('Circuit breaker OPEN: NinjaOne API unavailable');
      }
      this.state = 'HALF_OPEN'; // Tenter une requête de test
    }

    try {
      const result = await fn();

      // Succès : réinitialiser
      if (this.state === 'HALF_OPEN') {
        this.state = 'CLOSED';
        this.failureCount = 0;
      }

      return result;

    } catch (error) {
      this.failureCount++;
      this.lastFailureTime = new Date();

      // Si trop d'échecs, ouvrir le circuit
      if (this.failureCount >= 5) {
        this.state = 'OPEN';
        await this.notifyAdmins('NinjaOne API circuit breaker OPEN');
      }

      throw error;
    }
  }
}
```

#### C. Index PostgreSQL critiques

**Problème** : Avec 10k+ tickets, les lookups peuvent être lents

**Recommandation** : Index stratégiques

```sql
-- Index de mapping (CRITIQUE pour performance)
CREATE INDEX CONCURRENTLY idx_ticket_mapping_ninjaone
  ON mobile.ticket_mapping(ninjaone_ticket_id);

CREATE INDEX CONCURRENTLY idx_ticket_mapping_ebp
  ON mobile.ticket_mapping(ebp_schedule_event_id);

-- Index pour sync incrémentale (filtre sur updated_at)
CREATE INDEX CONCURRENTLY idx_tickets_updated_at
  ON ninjaone.fact_tickets(updated_at DESC);

CREATE INDEX CONCURRENTLY idx_scheduleevent_modified
  ON public."ScheduleEvent"("sysModifiedDate" DESC NULLS LAST);

-- Index pour lookups acteurs
CREATE INDEX CONCURRENTLY idx_actor_mapping_composite
  ON mobile.actor_mapping(entity_type, ninjaone_id);

-- Index JSONB pour tags
CREATE INDEX CONCURRENTLY idx_tickets_tags_gin
  ON ninjaone.fact_tickets USING GIN(tags);

-- Index pour status mapping
CREATE INDEX CONCURRENTLY idx_status_mapping_lookup
  ON mobile.status_mapping(ninjaone_status_id, direction);

-- Index pour échecs non résolus
CREATE INDEX CONCURRENTLY idx_sync_failures_pending
  ON mobile.sync_failures(status, retry_after)
  WHERE status = 'pending';
```

**Note** : Utiliser `CONCURRENTLY` pour créer index sans bloquer les écritures

#### D. Logging structuré et observabilité

**Problème** : Debugger une sync échouée est difficile sans logs détaillés

**Recommandation** : Logging JSON structuré + métriques

```typescript
// Utiliser Winston avec format JSON
import { Logger } from '@nestjs/common';

class SyncLogger {
  private logger = new Logger('SyncService');

  logSyncStart(direction: string, ticketCount: number) {
    this.logger.log({
      event: 'sync_started',
      direction,
      ticket_count: ticketCount,
      timestamp: new Date().toISOString()
    });
  }

  logTicketSync(ticketId: number, action: string, success: boolean, duration: number) {
    this.logger.log({
      event: 'ticket_synced',
      ticket_id: ticketId,
      action, // 'create', 'update', 'skip'
      success,
      duration_ms: duration,
      timestamp: new Date().toISOString()
    });
  }

  logError(ticketId: number, error: Error, context: any) {
    this.logger.error({
      event: 'sync_error',
      ticket_id: ticketId,
      error_message: error.message,
      error_stack: error.stack,
      context,
      timestamp: new Date().toISOString()
    });
  }
}
```

**Métriques à tracker** :
- Durée moyenne de sync (ms)
- Taux de succès (%)
- Nombre de conflits détectés
- Nombre d'échecs par type d'erreur
- Latence API NinjaOne (ms)

**Outils recommandés** :
- **Logs** : Winston + Elasticsearch ou Loki
- **Métriques** : Prometheus + Grafana
- **Alertes** : PagerDuty ou email si taux d'échec > 10%

#### E. Tests automatisés complets

**Recommandation** : Couvrir tous les cas de figure

```typescript
// tests/sync/ninjaone-to-ebp.e2e.spec.ts

describe('Sync NinjaOne → EBP (E2E)', () => {
  it('should sync new ticket and create ScheduleEvent', async () => {
    // Given
    const ninjaoneTicket = createMockTicket({ id: 9999 });
    mockNinjaOneApi.getTicket.mockResolvedValue(ninjaoneTicket);

    // When
    await syncService.syncTicket(ninjaoneTicket);

    // Then
    const mapping = await getMappingByNinjaOneId(9999);
    expect(mapping).toBeDefined();

    const scheduleEvent = await getScheduleEventById(mapping.ebp_schedule_event_id);
    expect(scheduleEvent.Maintenance_InterventionDescription)
      .toBe(ninjaoneTicket.title);
  });

  it('should handle mapping not found error gracefully', async () => {
    // Given
    const ticket = createMockTicket({ organizationId: 99999 }); // Org inexistante
    mockNinjaOneApi.getTicket.mockResolvedValue(ticket);

    // When
    const result = await syncService.syncTicket(ticket);

    // Then
    expect(result.success).toBe(false);
    expect(result.error.code).toBe('MAPPING_NOT_FOUND');

    const failure = await getSyncFailure(ticket.id);
    expect(failure.reason).toBe('non_retriable');
  });

  it('should detect and resolve conflicts using source_wins', async () => {
    // Given
    const ticket = createMockTicket({ id: 1234, status: 'RESOLVED' });
    const existingMapping = await createMapping({
      ninjaone_ticket_id: 1234,
      conflict_resolution: 'source_wins'
    });

    // Modifier EBP entre-temps
    await updateScheduleEvent(existingMapping.ebp_schedule_event_id, {
      EventState: 3 // En attente
    });

    // When
    await syncService.syncTicket(ticket);

    // Then
    const conflict = await getConflictByTicketId(1234);
    expect(conflict.status).toBe('auto_resolved');
    expect(conflict.resolution_strategy).toBe('source_wins');

    const scheduleEvent = await getScheduleEventById(existingMapping.ebp_schedule_event_id);
    expect(scheduleEvent.EventState).toBe(4); // Terminé (NinjaOne wins)
  });
});
```

**Couverture recommandée** :
- Tests unitaires : > 80%
- Tests E2E : Tous les flows critiques
- Tests de charge : 1000 tickets en < 30 min

---

### 7.3 Recommandations organisationnelles

#### A. Désigner un "Sync Champion"

**Rôle** : Responsable technique de la synchronisation

**Responsabilités** :
- Valider mappings initiaux (organisations, techniciens)
- Résoudre conflits manuels
- Surveiller dashboard synchronisation quotidiennement
- Améliorer règles de mapping au fil du temps
- Former les utilisateurs

**Profil** : Technicien senior ou chef de projet connaissant bien les deux systèmes

#### B. Documentation et formation

**Documentation à créer** :
1. **Guide administrateur** : Comment gérer la synchronisation
2. **Guide utilisateur** : Comment les tickets NinjaOne apparaissent dans l'app mobile
3. **Runbook** : Que faire en cas d'échec de sync
4. **FAQ** : Questions fréquentes

**Formation** :
- Session 1h pour admins : Dashboard, résolution conflits
- Session 30min pour techniciens : Comprendre les tickets synchronisés
- Vidéo demo : Workflow complet

#### C. Plan de déploiement progressif

**Phase 1 : Testing (Semaine 7)**
- Sync sur environnement de dev
- Validation avec 10-20 tickets tests
- Correction bugs

**Phase 2 : Pilot (Semaine 8)**
- Sync sur production avec filtre restrictif (ex: 1 organisation pilote)
- Monitoring quotidien
- Recueil feedback techniciens
- Ajustements

**Phase 3 : Rollout (Semaine 9)**
- Élargir à toutes les organisations par tranches de 10-20
- Monitoring hebdomadaire
- Communication utilisateurs

**Phase 4 : Production complète (Semaine 10)**
- Sync toutes les organisations
- Monitoring mensuel
- Optimisations continues

---

## 8. CONCLUSION

### Synthèse

La synchronisation des tickets entre **NinjaOne** et **EBP** est **techniquement faisable** mais présente des **défis importants** :

**Points forts** :
✅ Les deux systèmes ont des structures de données riches et bien définies
✅ PostgreSQL permet des mappings flexibles via tables intermédiaires
✅ API NinjaOne est robuste et bien documentée
✅ EBP offre GPS et champs custom extensibles

**Défis majeurs** :
⚠️ Identifiants hétérogènes (INTEGER vs UUID vs VARCHAR)
⚠️ Sémantique des statuts différente (perte d'information)
⚠️ Modèles métier divergents (support IT vs interventions terrain)
⚠️ Risque de boucles en mode bidirectionnel

**Approche recommandée** :
1. **MVP : Sync unidirectionnelle NinjaOne → EBP** (9 semaines)
2. **Filtrage tickets pertinents** (hardware, on-site, haute priorité)
3. **Mapping assisté** (automatique + validation manuelle)
4. **Évolution future** : Mode bidirectionnel (optionnel, +7 semaines)

### Estimation budgétaire

**Phase 1-4 (MVP Unidirectionnel)** : 9 semaines
- Développeur senior full-time : 9 semaines × 5 jours × 600€ = **27 000 €**
- DevOps (setup infra, monitoring) : 1 semaine = **3 000 €**
- Chef de projet (coordination, documentation) : 3 semaines = **9 000 €**
- **Total MVP** : **39 000 €**

**Phase 5-6 (Bidirectionnel + Avancé)** : 7 semaines supplémentaires
- Développeur senior : 7 semaines × 5 jours × 600€ = **21 000 €**
- **Total complet** : **60 000 €**

**Coûts récurrents** :
- Maintenance : 2-4h/mois = **1 200-2 400 €/an**
- Infrastructure (Redis, monitoring) : **500 €/an**

### ROI attendu

**Gains** :
- Temps techniciens : -15 min/jour (consultation centralisée tickets) × 11 techniciens × 220 jours = **605h/an**
- Valorisation 50€/h = **30 250 €/an**
- Réduction erreurs saisie manuelle : **5 000 €/an**
- **Total gains** : **35 250 €/an**

**Break-even** :
- MVP : 39 000 € / 35 250 €/an = **13 mois**
- Complet : 60 000 € / 35 250 €/an = **20 mois**

### Décision recommandée

**GO pour MVP (Phase 1-4)** :
- Investissement raisonnable (39k€)
- ROI positif en 13 mois
- Risque technique maîtrisé (unidirectionnel)
- Valeur immédiate pour techniciens terrain

**NO GO pour bidirectionnel immédiat** :
- Complexité élevée
- ROI marginal (+21k€ pour gains similaires)
- Risque de boucles et conflits

**Recommandation** : Démarrer avec MVP unidirectionnel, évaluer après 6 mois d'utilisation si bidirectionnel apporte valeur suffisante.

---

## ANNEXES

### Annexe A : Requêtes SQL d'analyse EBP

```sql
-- Analyser les valeurs EventState dans ScheduleEvent
SELECT
  "EventState",
  COUNT(*) AS count,
  ROUND(COUNT(*) * 100.0 / SUM(COUNT(*)) OVER (), 2) AS percentage,
  MIN("StartDate") AS oldest,
  MAX("StartDate") AS newest
FROM public."ScheduleEvent"
GROUP BY "EventState"
ORDER BY count DESC;

-- Identifier les types d'événements
SELECT
  set."Id",
  set."Caption",
  COUNT(se."Id") AS event_count
FROM public."ScheduleEventType" set
LEFT JOIN public."ScheduleEvent" se ON se."EventType" = set."Id"
GROUP BY set."Id", set."Caption"
ORDER BY event_count DESC;

-- Analyser les customers EBP
SELECT
  "Id",
  "Name",
  "Contact_Email",
  COUNT(se."Id") AS intervention_count
FROM public."Customer" c
LEFT JOIN public."ScheduleEvent" se ON se."CustomerId" = c."Id"
GROUP BY c."Id", c."Name", c."Contact_Email"
HAVING COUNT(se."Id") > 0
ORDER BY intervention_count DESC
LIMIT 50;

-- Analyser les techniciens EBP
SELECT
  "Id",
  "Contact_Name",
  "Contact_Email",
  COUNT(se."Id") AS intervention_count
FROM public."Colleague" c
LEFT JOIN public."ScheduleEvent" se ON se."ColleagueId" = c."Id"
GROUP BY c."Id", c."Contact_Name", c."Contact_Email"
HAVING COUNT(se."Id") > 0
ORDER BY intervention_count DESC;
```

### Annexe B : Script de matching fuzzy

```typescript
import Fuse from 'fuse.js';

interface Organization {
  id: string | number;
  name: string;
  email?: string;
}

class FuzzyMatcher {
  /**
   * Normalise un nom d'organisation pour le matching
   */
  static normalizeName(name: string): string {
    return name
      .toUpperCase()
      .trim()
      // Enlever accents
      .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
      // Enlever formes juridiques
      .replace(/\b(SARL|SAS|SA|EURL|SCI|SASU|SNC)\b/g, '')
      // Enlever ponctuation
      .replace(/[^\w\s]/g, ' ')
      // Normaliser espaces
      .replace(/\s+/g, ' ')
      .trim();
  }

  /**
   * Match organisations NinjaOne avec customers EBP
   */
  static matchOrganizations(
    ninjaoneOrgs: Organization[],
    ebpCustomers: Organization[]
  ): Array<{
    ninjaone: Organization;
    ebp: Organization | null;
    score: number;
    method: string;
  }> {
    const results = [];

    // Préparer Fuse.js pour fuzzy search
    const fuse = new Fuse(ebpCustomers, {
      keys: ['name'],
      threshold: 0.3,
      getFn: (obj) => this.normalizeName(obj.name)
    });

    for (const ninjaoneOrg of ninjaoneOrgs) {
      let match = null;
      let score = 0;
      let method = 'none';

      // Méthode 1 : Match exact (après normalisation)
      const normalizedName = this.normalizeName(ninjaoneOrg.name);
      const exactMatch = ebpCustomers.find(
        c => this.normalizeName(c.name) === normalizedName
      );

      if (exactMatch) {
        match = exactMatch;
        score = 1.0;
        method = 'exact';
      }

      // Méthode 2 : Fuzzy matching
      else {
        const fuzzyResults = fuse.search(normalizedName);
        if (fuzzyResults.length > 0 && fuzzyResults[0].score <= 0.15) {
          match = fuzzyResults[0].item;
          score = 1 - fuzzyResults[0].score; // Convertir en score de similarité
          method = 'fuzzy';
        }
      }

      results.push({
        ninjaone: ninjaoneOrg,
        ebp: match,
        score,
        method
      });
    }

    return results;
  }
}
```

### Annexe C : Variables d'environnement

```env
# .env pour module sync

# PostgreSQL
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=postgres
DB_NAME=ebp_db

# NinjaOne API
NINJAONE_CLIENT_ID=EPn-C2V8MCFVh11AerkGNOuFiX4
NINJAONE_CLIENT_SECRET=5oEPoGgG5zqFavkyYTqvOc3T0gG96xWAMzfW6edoEMH6ZQFYFbEHOQ
NINJAONE_BASE_URL=https://eu.ninjarmm.com

# Redis (pour cache)
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=
REDIS_DB=0

# Sync Configuration
SYNC_ENABLED=true
SYNC_MODE=unidirectional # unidirectional, bidirectional
SYNC_DIRECTION=ninjaone_to_ebp # ninjaone_to_ebp, ebp_to_ninjaone
SYNC_FREQUENCY_MINUTES=60 # Toutes les heures
SYNC_BATCH_SIZE=100
SYNC_CONCURRENT_LIMIT=5

# Sync Filters
SYNC_FILTER_CATEGORIES=Hardware,Network,On-site,Printer
SYNC_FILTER_TAGS=on-site,intervention,maintenance
SYNC_FILTER_MIN_PRIORITY=MEDIUM

# Conflict Resolution
DEFAULT_CONFLICT_RESOLUTION=source_wins # source_wins, last_write, manual
CONFLICT_COOLDOWN_SECONDS=60

# Retry Configuration
RETRY_MAX_ATTEMPTS=3
RETRY_BACKOFF_MULTIPLIER=2
RETRY_INITIAL_DELAY_MS=1000

# Monitoring
MONITORING_ENABLED=true
ALERT_EMAIL=admin@example.com
ALERT_ON_FAILURE_RATE=0.1 # 10%
ALERT_ON_CONFLICT_RATE=0.05 # 5%

# Logging
LOG_LEVEL=info # debug, info, warn, error
LOG_FORMAT=json # json, text
LOG_SQL_QUERIES=false
```

---

**FIN DU DOCUMENT**

**Auteur** : Audit Technique Système
**Date** : 24 octobre 2025
**Version** : 1.0
**Statut** : Complet et prêt pour revue
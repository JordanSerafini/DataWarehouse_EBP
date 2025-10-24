# API NinjaOne - Organisations

## Vue d'ensemble

Cette documentation décrit l'API REST complète pour gérer les **organisations** (clients) dans NinjaOne RMM. Les organisations représentent les entreprises clientes gérées dans le système RMM.

---

## Architecture

### Entité Organisation

**Table**: `ninjaone.dim_organizations`

**Entité TypeORM**: `Organization` ([organization.entity.ts](src/ninja-one/entities/organization.entity.ts:9))

#### Structure de données

```typescript
{
  organizationId: number;           // ID unique de l'organisation (clé primaire)
  organizationUid: string;          // UID unique NinjaOne
  organizationName: string;         // Nom de l'organisation
  nodeApprovalMode: string;         // Mode d'approbation des nœuds
  description: string;              // Description de l'organisation
  address: string;                  // Adresse complète
  city: string;                     // Ville (max 100 caractères)
  state: string;                    // État/Province (max 100 caractères)
  country: string;                  // Pays (max 100 caractères)
  postalCode: string;               // Code postal (max 20 caractères)
  phone: string;                    // Numéro de téléphone (max 50 caractères)
  email: string;                    // Email de contact (max 255 caractères)
  website: string;                  // Site web (max 255 caractères)
  tags: any;                        // Tags JSON (type JSONB)
  customFields: any;                // Champs personnalisés JSON (type JSONB)
  createdAt: Date;                  // Date de création dans NinjaOne
  updatedAt: Date;                  // Date de dernière mise à jour
  isActive: boolean;                // Statut actif (défaut: true)
  etlLoadedAt: Date;                // Date de chargement ETL
  etlSource: string;                // Source ETL (défaut: 'ninjaone_api')
}
```

### Services

1. **NinjaOneService** ([ninja-one.service.ts](src/ninja-one/ninja-one.service.ts:7))
   - Gestion de l'authentification OAuth 2.0
   - Appels à l'API NinjaOne
   - Cache automatique du token d'accès

2. **DatabaseSyncService** ([database-sync.service.ts](src/ninja-one/services/database-sync.service.ts:11))
   - Synchronisation des données NinjaOne vers PostgreSQL
   - Transformation des données de l'API vers le format base de données
   - Gestion des erreurs et statistiques de synchronisation

---

## Endpoints API

### Endpoints actuellement implémentés

Les endpoints suivants sont **implémentés et fonctionnels** dans le projet:

- ✅ **GET** `/ninja-one/organizations` - Liste de toutes les organisations
- ✅ **POST** `/ninja-one/sync/organizations` - Synchronisation vers PostgreSQL
- ✅ **POST** `/ninja-one/sync/all` - Synchronisation complète (orgs, techs, devices, tickets)

### Endpoints API NinjaOne disponibles (non implémentés)

L'API NinjaOne officielle offre des endpoints supplémentaires pour les organisations:

| Endpoint | Description | Documentation |
|----------|-------------|---------------|
| `GET /v2/organizations` | Liste toutes les organisations | ✅ Implémenté |
| `GET /v2/organization/{id}` | Détails d'une organisation spécifique | ⚠️ À implémenter |
| `GET /v2/organization/{id}/locations` | Liste des emplacements/sites d'une organisation | ⚠️ À implémenter |
| `GET /v2/organization/{id}/devices` | Liste des appareils d'une organisation | ⚠️ À implémenter |
| `GET /v2/organization/{id}/end-users` | Liste des utilisateurs finaux d'une organisation | ⚠️ À implémenter |
| `GET /v2/organization/{id}/documents` | Documents attachés à l'organisation | ⚠️ À implémenter |
| `GET /v2/organization/documents/{clientDocumentId}/attributes` | Attributs d'un document organisation avec valeurs | ⚠️ À implémenter |
| `POST /v2/organization` | Créer une nouvelle organisation | ❌ Non implémenté |
| `PATCH /v2/organization/{id}` | Modifier une organisation | ❌ Non implémenté |
| `DELETE /v2/organization/{id}` | Supprimer une organisation | ❌ Non implémenté |

**Référence API officielle**: [NinjaOne API Docs - Core Resources](https://app.ninjarmm.com/apidocs-beta/core-resources/operations/getOrganizations)

> **Note**: Les endpoints en lecture (GET) sont prioritaires pour l'intégration. Les endpoints d'écriture (POST/PATCH/DELETE) nécessitent des permissions supplémentaires et ne sont généralement pas nécessaires pour un système d'intégration RMM en lecture seule.

---

### 1. Récupérer toutes les organisations

**GET** `/ninja-one/organizations`

Récupère la liste complète des organisations depuis l'API NinjaOne.

#### Requête

```bash
curl http://localhost:3001/ninja-one/organizations
```

#### Réponse

```json
[
  {
    "id": 123,
    "uid": "abc-123-def-456",
    "name": "Entreprise ABC",
    "nodeApprovalMode": "AUTOMATIC",
    "description": "Client principal services informatiques",
    "address": "123 Rue de la République",
    "city": "Paris",
    "state": "Île-de-France",
    "country": "France",
    "postalCode": "75001",
    "phone": "+33 1 23 45 67 89",
    "email": "contact@entreprise-abc.fr",
    "website": "https://www.entreprise-abc.fr",
    "tags": ["Premium", "SLA-Gold"],
    "fields": {
      "contrat_type": "Annuel",
      "nb_postes": "50"
    },
    "createTime": 1609459200
  },
  {
    "id": 124,
    "uid": "xyz-789-ghi-012",
    "name": "Société XYZ",
    "nodeApprovalMode": "MANUAL",
    "description": "Client services cloud",
    "address": "456 Avenue des Champs",
    "city": "Lyon",
    "state": "Auvergne-Rhône-Alpes",
    "country": "France",
    "postalCode": "69001",
    "phone": "+33 4 78 90 12 34",
    "email": "info@societe-xyz.fr",
    "website": "https://www.societe-xyz.fr",
    "tags": ["Standard"],
    "fields": {
      "contrat_type": "Mensuel",
      "nb_postes": "25"
    },
    "createTime": 1612137600
  }
]
```

#### Champs de réponse (format API NinjaOne)

| Champ | Type | Description |
|-------|------|-------------|
| `id` | number | ID unique de l'organisation |
| `uid` | string | Identifiant unique universel |
| `name` | string | Nom de l'organisation |
| `nodeApprovalMode` | string | Mode d'approbation: `AUTOMATIC`, `MANUAL`, `REJECT` |
| `description` | string | Description de l'organisation |
| `address` | string | Adresse complète |
| `city` | string | Ville |
| `state` | string | État/Province/Région |
| `country` | string | Pays |
| `postalCode` | string | Code postal |
| `phone` | string | Numéro de téléphone |
| `email` | string | Email de contact |
| `website` | string | Site web |
| `tags` | array | Liste des tags |
| `fields` | object | Champs personnalisés (custom fields) |
| `createTime` | number | Timestamp Unix de création |

---

### 2. Synchroniser les organisations vers la base de données

**POST** `/ninja-one/sync/organizations`

Synchronise toutes les organisations depuis l'API NinjaOne vers la base de données PostgreSQL (schéma `ninjaone`).

#### Requête

```bash
curl -X POST http://localhost:3001/ninja-one/sync/organizations
```

#### Réponse

```json
{
  "synced": 114,
  "errors": 0,
  "message": "Organizations sync completed: 114 synced, 0 errors"
}
```

#### Processus de synchronisation

Le service `DatabaseSyncService` effectue les opérations suivantes ([database-sync.service.ts:29](src/ninja-one/services/database-sync.service.ts:29)):

1. **Récupération** des organisations depuis l'API NinjaOne
2. **Transformation** des données :
   - `id` → `organizationId`
   - `uid` → `organizationUid`
   - `name` → `organizationName`
   - `fields` → `customFields` (format JSONB)
   - `createTime` → `createdAt` (conversion Unix timestamp → Date)
3. **Upsert** dans la table `ninjaone.dim_organizations`
4. **Gestion des erreurs** avec logs détaillés
5. **Retour de statistiques** (nombre d'éléments synchronisés et erreurs)

#### Mapping des champs

| API NinjaOne | Base de données PostgreSQL | Transformation |
|--------------|----------------------------|----------------|
| `id` | `organization_id` | Direct |
| `uid` | `organization_uid` | Direct |
| `name` | `organization_name` | Direct |
| `nodeApprovalMode` | `node_approval_mode` | Direct |
| `description` | `description` | Direct |
| `address` | `address` | Direct |
| `city` | `city` | Direct |
| `state` | `state` | Direct |
| `country` | `country` | Direct |
| `postalCode` | `postal_code` | Direct |
| `phone` | `phone` | Direct |
| `email` | `email` | Direct |
| `website` | `website` | Direct |
| `tags` | `tags` | JSONB |
| `fields` | `custom_fields` | JSONB |
| `createTime` | `created_at` | Unix timestamp → Date (`new Date(createTime * 1000)`) |
| - | `updated_at` | Auto-généré (TypeORM `@UpdateDateColumn`) |
| - | `is_active` | Défaut: `true` |
| - | `etl_loaded_at` | Auto-généré (TypeORM `@CreateDateColumn`) |
| - | `etl_source` | Défaut: `'ninjaone_api'` |

---

### 3. Synchronisation complète (tous les modules)

**POST** `/ninja-one/sync/all`

Synchronise **toutes les données** NinjaOne (organisations, techniciens, appareils, tickets) en une seule opération.

#### Requête

```bash
curl -X POST http://localhost:3001/ninja-one/sync/all
```

#### Réponse

```json
{
  "organizations": {
    "synced": 114,
    "errors": 0,
    "message": "Organizations sync completed: 114 synced, 0 errors"
  },
  "technicians": {
    "synced": 11,
    "errors": 0,
    "message": "Technicians sync completed: 11 synced, 0 errors"
  },
  "devices": {
    "synced": 450,
    "errors": 0,
    "message": "Devices sync completed: 450 synced, 0 errors"
  },
  "tickets": {
    "synced": 965,
    "errors": 0,
    "message": "Tickets sync completed: 965 synced, 0 errors"
  },
  "message": "Full sync completed successfully"
}
```

#### Ordre d'exécution

La synchronisation s'effectue dans cet ordre ([database-sync.service.ts:374](src/ninja-one/services/database-sync.service.ts:374)):

1. **Organizations** (en premier car d'autres entités en dépendent)
2. **Technicians** (techniciens/utilisateurs)
3. **Devices** (appareils liés aux organisations)
4. **Tickets** (tickets liés aux organisations, techniciens et appareils)

---

## Relations avec d'autres entités

### Tickets par organisation

Les tickets sont liés aux organisations via le champ `organizationId`.

**Dans le service de sync des tickets** ([database-sync.service.ts:238](src/ninja-one/services/database-sync.service.ts:238)):

```typescript
// Chargement des organisations pour mapping
const organizations = await this.organizationRepository.find();

// Map nom d'organisation → ID
const orgNameToId = new Map(
  organizations.map(o => [o.organizationName?.toLowerCase(), o.organizationId])
);

// Mapping pour chaque ticket
const orgId = orgNameToId.get(tkt.organization?.toLowerCase());
```

### Appareils par organisation

Les appareils (devices) sont rattachés aux organisations via `organizationId` ([device.entity.ts](src/ninja-one/entities/device.entity.ts)).

### Hiérarchie des données

```
Organization (dim_organizations)
    ├─> Devices (dim_devices)
    │      └─> deviceId, organizationId
    │
    ├─> Tickets (fact_tickets)
    │      └─> ticketId, organizationId, deviceId, assignedTechnicianId
    │
    └─> Technicians (dim_technicians)
           └─> technicianId (peut être global ou lié à une organisation)
```

---

## Authentification

Tous les appels à l'API NinjaOne nécessitent une authentification OAuth 2.0 avec le flux **Client Credentials**.

### Configuration

Variables d'environnement requises dans `.env`:

```env
CLIENT_ID=<votre_client_id>
CLIENT_SECRET=<votre_client_secret>
NINJA_ONE_BASE_URL=https://eu.ninjarmm.com
```

### Mécanisme

Le service `NinjaOneService` gère automatiquement ([ninja-one.service.ts:27](src/ninja-one/ninja-one.service.ts:27)):

1. **Authentification initiale** lors du premier appel
2. **Cache du token** avec expiration
3. **Renouvellement automatique** si le token est expiré
4. **Réutilisation** du token valide pour tous les appels suivants

```typescript
async authenticate(): Promise<string> {
  // Vérifier si le token est toujours valide
  if (this.accessToken && this.tokenExpiry && new Date() < this.tokenExpiry) {
    return this.accessToken;
  }

  // Sinon, obtenir un nouveau token
  const response = await this.httpService.post(
    `${this.baseUrl}/ws/oauth/token`,
    new URLSearchParams({
      grant_type: 'client_credentials',
      client_id: clientId,
      client_secret: clientSecret,
      scope: 'monitoring management control',
    })
  );

  this.accessToken = response.data.access_token;
  this.tokenExpiry = new Date(Date.now() + response.data.expires_in * 1000);

  return this.accessToken;
}
```

### Régions disponibles

L'API NinjaOne est disponible dans plusieurs régions:

| Région | URL de base |
|--------|-------------|
| **EU (Europe)** | `https://eu.ninjarmm.com` ⭐ (utilisée actuellement) |
| US (États-Unis) | `https://app.ninjarmm.com` |
| OC (Océanie) | `https://oc.ninjarmm.com` |
| CA (Canada) | `https://ca.ninjarmm.com` |

**Endpoint de test** pour toutes les régions:

```bash
GET /ninja-one/auth/test-all-regions
```

---

## Endpoints avancés à implémenter

### Documents d'organisation

**Endpoint API NinjaOne**: `GET /v2/organization/{id}/documents`

Les organisations peuvent avoir des **documents attachés** (documentation technique, contrats, procédures, etc.). Chaque document peut avoir des **attributs personnalisés** avec des valeurs.

#### Cas d'usage

1. **Gestion documentaire centralisée**: Accès aux contrats, SLA, procédures spécifiques au client
2. **Automatisation**: Récupération automatique des informations contractuelles (type de contrat, durée, SLA)
3. **Audit et conformité**: Traçabilité des documents liés aux organisations

#### Structure typique d'un document

```json
{
  "id": 456,
  "name": "Contrat de service - Entreprise ABC",
  "documentTemplateId": 12,
  "organizationId": 123,
  "attributes": [
    {
      "name": "Type de contrat",
      "value": "Maintenance annuelle"
    },
    {
      "name": "Date de début",
      "value": "2024-01-01"
    },
    {
      "name": "Nombre de postes couverts",
      "value": "50"
    },
    {
      "name": "SLA - Temps de réponse",
      "value": "4 heures"
    }
  ],
  "createdAt": "2024-01-01T00:00:00Z",
  "updatedAt": "2024-10-15T14:30:00Z"
}
```

#### Implémentation proposée

```typescript
// src/ninja-one/ninja-one.service.ts

async getOrganizationDocuments(organizationId: number): Promise<any> {
  const token = await this.authenticate();

  const response = await firstValueFrom(
    this.httpService.get(
      `${this.baseUrl}/v2/organization/${organizationId}/documents`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/json',
        },
      }
    )
  );

  return response.data;
}

async getOrganizationDocumentAttributes(clientDocumentId: number): Promise<any> {
  const token = await this.authenticate();

  const response = await firstValueFrom(
    this.httpService.get(
      `${this.baseUrl}/v2/organization/documents/${clientDocumentId}/attributes`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/json',
        },
      }
    )
  );

  return response.data;
}
```

### Locations (emplacements) d'organisation

**Endpoint API NinjaOne**: `GET /v2/organization/{id}/locations`

Les grandes organisations ont souvent **plusieurs sites** (bureaux, agences, succursales). NinjaOne permet de gérer ces emplacements séparément.

#### Cas d'usage

1. **Gestion multi-sites**: Suivi des interventions par site géographique
2. **Logistique**: Planification des déplacements techniciens par proximité
3. **Reporting**: Statistiques par emplacement (tickets, appareils, incidents)

#### Structure typique d'une location

```json
{
  "id": 789,
  "name": "Siège social - Paris",
  "organizationId": 123,
  "address": "123 Rue de la République",
  "city": "Paris",
  "state": "Île-de-France",
  "country": "France",
  "postalCode": "75001",
  "phone": "+33 1 23 45 67 89",
  "description": "Bureau principal - 50 employés",
  "tags": ["Principal", "IT-Support-24/7"],
  "customFields": {
    "nb_employes": "50",
    "horaires": "8h-18h"
  }
}
```

#### Implémentation proposée

```typescript
// src/ninja-one/ninja-one.service.ts

async getOrganizationLocations(organizationId: number): Promise<any> {
  const token = await this.authenticate();

  const response = await firstValueFrom(
    this.httpService.get(
      `${this.baseUrl}/v2/organization/${organizationId}/locations`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/json',
        },
      }
    )
  );

  return response.data;
}
```

### Organisation unique (détails)

**Endpoint API NinjaOne**: `GET /v2/organization/{id}`

Récupérer les détails d'une organisation spécifique par son ID.

#### Implémentation proposée

```typescript
// src/ninja-one/ninja-one.service.ts

async getOrganizationById(organizationId: number): Promise<any> {
  const token = await this.authenticate();

  try {
    this.logger.log(`Fetching organization ${organizationId} from NinjaOne API...`);

    const response = await firstValueFrom(
      this.httpService.get(
        `${this.baseUrl}/v2/organization/${organizationId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: 'application/json',
          },
        }
      )
    );

    return response.data;
  } catch (error) {
    this.logger.error(
      `Failed to fetch organization ${organizationId}:`,
      error.response?.data || error.message
    );
    throw new Error(`Failed to fetch organization ${organizationId} from NinjaOne API`);
  }
}
```

```typescript
// src/ninja-one/ninja-one.controller.ts

@Get('organizations/:id')
async getOrganizationById(@Param('id', ParseIntPipe) id: number) {
  return this.ninjaOneService.getOrganizationById(id);
}

@Get('organizations/:id/locations')
async getOrganizationLocations(@Param('id', ParseIntPipe) id: number) {
  return this.ninjaOneService.getOrganizationLocations(id);
}

@Get('organizations/:id/documents')
async getOrganizationDocuments(@Param('id', ParseIntPipe) id: number) {
  return this.ninjaOneService.getOrganizationDocuments(id);
}
```

---

## Cas d'usage métier

### 1. Dashboard multi-organisations

**Besoin**: Afficher la liste de toutes les organisations avec statistiques (nombre d'appareils, tickets ouverts, etc.)

**Solution**:
```bash
# Récupérer toutes les organisations
GET /ninja-one/organizations

# Pour chaque organisation, requêter les statistiques via l'API Tickets
GET /api/organizations/:id/tickets/stats
```

### 2. Vue détaillée organisation

**Besoin**: Afficher les informations complètes d'une organisation avec tous ses tickets et appareils

**Requêtes**:
```bash
# 1. Récupérer les infos de l'organisation
GET /ninja-one/organizations
# (puis filtrer client-side par ID ou nom)

# 2. Récupérer les tickets de cette organisation
GET /api/organizations/:id/tickets?isClosed=false

# 3. Récupérer les statistiques
GET /api/tickets/stats?organizationId=:id
```

### 3. Synchronisation planifiée

**Besoin**: Maintenir les données à jour automatiquement

**Solution**: Créer un cron job qui appelle l'endpoint de synchronisation:

```bash
# Toutes les heures
0 * * * * curl -X POST http://localhost:3001/ninja-one/sync/organizations

# Ou synchronisation complète toutes les 6 heures
0 */6 * * * curl -X POST http://localhost:3001/ninja-one/sync/all
```

### 4. Recherche d'organisation par nom

**Besoin**: Trouver une organisation par son nom

**Requête**:
```bash
# Récupérer toutes les organisations
GET /ninja-one/organizations

# Filtrer côté client ou via requête SQL
SELECT * FROM ninjaone.dim_organizations
WHERE organization_name ILIKE '%entreprise%';
```

### 5. Export des données organisations

**Besoin**: Exporter toutes les organisations pour reporting

**SQL Direct**:
```sql
-- Export CSV
COPY (
  SELECT
    organization_id,
    organization_name,
    city,
    country,
    phone,
    email,
    website,
    created_at
  FROM ninjaone.dim_organizations
  WHERE is_active = true
  ORDER BY organization_name
) TO '/tmp/organizations_export.csv' WITH CSV HEADER;
```

---

## Schéma de base de données

### Table `ninjaone.dim_organizations`

```sql
CREATE TABLE ninjaone.dim_organizations (
  organization_id INTEGER PRIMARY KEY,
  organization_uid VARCHAR,
  organization_name VARCHAR NOT NULL,
  node_approval_mode VARCHAR,
  description TEXT,
  address TEXT,
  city VARCHAR(100),
  state VARCHAR(100),
  country VARCHAR(100),
  postal_code VARCHAR(20),
  phone VARCHAR(50),
  email VARCHAR(255),
  website VARCHAR(255),
  tags JSONB,
  custom_fields JSONB,
  created_at TIMESTAMP WITH TIME ZONE,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  is_active BOOLEAN DEFAULT true,
  etl_loaded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  etl_source VARCHAR DEFAULT 'ninjaone_api'
);

CREATE INDEX idx_organizations_name ON ninjaone.dim_organizations(organization_name);
CREATE INDEX idx_organizations_active ON ninjaone.dim_organizations(is_active);
CREATE INDEX idx_organizations_tags ON ninjaone.dim_organizations USING GIN(tags);
CREATE INDEX idx_organizations_custom_fields ON ninjaone.dim_organizations USING GIN(custom_fields);
```

### Relations

```sql
-- Tickets liés aux organisations
SELECT
  o.organization_name,
  COUNT(t.ticket_id) as total_tickets,
  COUNT(CASE WHEN t.is_closed = false THEN 1 END) as open_tickets
FROM ninjaone.dim_organizations o
LEFT JOIN ninjaone.fact_tickets t ON o.organization_id = t.organization_id
GROUP BY o.organization_id, o.organization_name;

-- Appareils par organisation
SELECT
  o.organization_name,
  COUNT(d.device_id) as total_devices,
  COUNT(CASE WHEN d.is_offline = true THEN 1 END) as offline_devices
FROM ninjaone.dim_organizations o
LEFT JOIN ninjaone.dim_devices d ON o.organization_id = d.organization_id
GROUP BY o.organization_id, o.organization_name;
```

---

## Configuration et démarrage

### Installation

```bash
cd ninja-one_api
npm install
```

### Configuration

Créer un fichier `.env`:

```env
# OAuth NinjaOne
CLIENT_ID=votre_client_id_ninjaone
CLIENT_SECRET=votre_client_secret_ninjaone
NINJA_ONE_BASE_URL=https://eu.ninjarmm.com

# Port (3001 pour éviter conflit avec backend:3000)
PORT=3001

# Base de données PostgreSQL
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=postgres
DB_NAME=ebp_db
```

### Démarrage

```bash
# Mode développement (avec watch)
npm run start:dev

# Mode production
npm run start:prod

# Build
npm run build
```

### Tests

```bash
# Tester l'authentification
curl http://localhost:3001/ninja-one/auth/test

# Récupérer les organisations
curl http://localhost:3001/ninja-one/organizations

# Synchroniser vers la base de données
curl -X POST http://localhost:3001/ninja-one/sync/organizations
```

---

## Performance et bonnes pratiques

### 1. Cache du token

Le token OAuth est automatiquement mis en cache et réutilisé jusqu'à expiration. **Ne pas** appeler `authenticate()` manuellement avant chaque requête.

### 2. Batch operations

Pour synchroniser un grand nombre d'organisations, le service effectue les opérations en boucle avec gestion d'erreurs individuelles pour ne pas bloquer l'ensemble.

### 3. Logs détaillés

Tous les logs sont disponibles via le Logger NestJS:

```typescript
this.logger.log('Fetching organizations from NinjaOne API...');
this.logger.log(`Retrieved ${response.data?.length || 0} organizations`);
this.logger.error('Failed to fetch organizations:', error.message);
```

### 4. Gestion des erreurs

Chaque organisation est synchronisée individuellement. Si une organisation échoue, les autres continuent:

```typescript
for (const org of organizations) {
  try {
    await this.organizationRepository.save(organization);
    synced++;
  } catch (error) {
    this.logger.error(`Error syncing organization ${org.id}: ${error.message}`);
    errors++;
  }
}
```

---

## Statistiques actuelles

D'après la dernière synchronisation:

- **114 organisations** dans la base de données
- Aucune erreur de synchronisation
- Relations avec:
  - **965 tickets**
  - **11 techniciens**
  - **~450 appareils** (estimation)

---

## Endpoints connexes

Pour une utilisation complète de l'API NinjaOne, consultez aussi:

- **[API_TICKETS.md](API_TICKETS.md)** - API complète des tickets (filtres avancés, statistiques)
- **API Technicians** (à documenter)
- **API Devices** (à documenter)

---

## Support et ressources

### Documentation officielle

- **NinjaOne API Docs**: https://app.ninjarmm.com/apidocs-beta/
- **NinjaOne Developer Portal**: https://developer.ninjarmm.com/

### Code source

- **Entité**: [src/ninja-one/entities/organization.entity.ts](src/ninja-one/entities/organization.entity.ts)
- **Service API**: [src/ninja-one/ninja-one.service.ts](src/ninja-one/ninja-one.service.ts)
- **Service Sync**: [src/ninja-one/services/database-sync.service.ts](src/ninja-one/services/database-sync.service.ts)
- **Contrôleur**: [src/ninja-one/ninja-one.controller.ts](src/ninja-one/ninja-one.controller.ts)

### Logs et debugging

Pour activer les logs détaillés:

```bash
# Logs en temps réel
npm run start:dev

# Ou en production avec logs
NODE_ENV=production npm run start:prod | tee logs/api.log
```

---

**Document créé le**: 2025-10-24
**Version**: 1.0
**Auteur**: Documentation générée pour DataWarehouse_EBP

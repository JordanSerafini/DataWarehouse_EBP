# API NinjaOne Tickets - Documentation Complète

## Vue d'ensemble

API REST complète pour interroger et analyser les tickets NinjaOne avec filtres avancés, statistiques et agrégations.

**Base URL**: `http://localhost:3001`

---

## Endpoints Principaux

### 1. Liste de tickets avec filtres

```http
GET /api/tickets
```

Récupère une liste paginée de tickets avec filtres avancés.

#### Paramètres de pagination

| Paramètre | Type | Défaut | Description |
|-----------|------|--------|-------------|
| `page` | number | 1 | Numéro de page |
| `limit` | number | 50 | Nombre de tickets par page |
| `sortBy` | string | createdAt | Colonne de tri (voir options ci-dessous) |
| `sortOrder` | string | DESC | Ordre de tri (ASC/DESC) |

**Options de tri**: `createdAt`, `updatedAt`, `resolvedAt`, `closedAt`, `dueDate`, `priority`, `title`, `ticketId`, `timeSpentSeconds`, `timeToResolutionSeconds`

#### Filtres par ID (relations)

| Paramètre | Type | Description |
|-----------|------|-------------|
| `organizationId` | number | Filtrer par organisation |
| `assignedTechnicianId` | number | Filtrer par technicien assigné |
| `createdByTechnicianId` | number | Filtrer par technicien créateur |
| `deviceId` | number | Filtrer par device/équipement |
| `locationId` | number | Filtrer par localisation |
| `statusId` | number | Filtrer par ID de statut |

#### Filtres par texte

| Paramètre | Type | Valeurs possibles | Description |
|-----------|------|-------------------|-------------|
| `statusName` | string | Nouveau, Fermé, Ouvert, Résolu, En attente, En pause | Nom du statut (insensible à la casse) |
| `priority` | string | NONE, LOW, MEDIUM, HIGH, URGENT, CRITICAL | Priorité du ticket |
| `severity` | string | - | Sévérité du ticket |
| `source` | string | - | Source du ticket |
| `channel` | string | - | Canal de communication |
| `category` | string | - | Catégorie |
| `ticketType` | string | - | Type de ticket |
| `requesterName` | string | - | Nom du demandeur (recherche partielle) |
| `search` | string | - | Recherche full-text dans titre + description |

#### Filtres par date

| Paramètre | Type | Format | Description |
|-----------|------|--------|-------------|
| `createdAfter` | date | YYYY-MM-DD | Créés après cette date |
| `createdBefore` | date | YYYY-MM-DD | Créés avant cette date |
| `updatedAfter` | date | YYYY-MM-DD | Mis à jour après |
| `updatedBefore` | date | YYYY-MM-DD | Mis à jour avant |
| `resolvedAfter` | date | YYYY-MM-DD | Résolus après |
| `resolvedBefore` | date | YYYY-MM-DD | Résolus avant |
| `closedAfter` | date | YYYY-MM-DD | Fermés après |
| `closedBefore` | date | YYYY-MM-DD | Fermés avant |
| `dueAfter` | date | YYYY-MM-DD | Échéance après |
| `dueBefore` | date | YYYY-MM-DD | Échéance avant |

#### Filtres booléens

| Paramètre | Type | Description |
|-----------|------|-------------|
| `isOverdue` | boolean | Tickets en retard |
| `isResolved` | boolean | Tickets résolus |
| `isClosed` | boolean | Tickets fermés |
| `hasComments` | boolean | Tickets avec commentaires |
| `hasAttachments` | boolean | Tickets avec pièces jointes |
| `unassigned` | boolean | **Tickets non assignés** (78.8% actuellement !) |

#### Filtres spéciaux

| Paramètre | Type | Description |
|-----------|------|-------------|
| `tag` | string | Recherche d'un tag spécifique dans le JSONB |

#### Options d'inclusion

| Paramètre | Type | Défaut | Description |
|-----------|------|--------|-------------|
| `includeOrganization` | boolean | true | Inclure les infos d'organisation |
| `includeTechnicians` | boolean | true | Inclure les infos des techniciens |
| `includeDevice` | boolean | false | Inclure les infos du device |

#### Exemples de requêtes

```bash
# Tous les tickets
curl http://localhost:3001/api/tickets

# Tickets d'une organisation spécifique
curl http://localhost:3001/api/tickets?organizationId=123

# Tickets non assignés (IMPORTANT pour le pool de tickets)
curl http://localhost:3001/api/tickets?unassigned=true

# Tickets ouverts avec priorité élevée
curl http://localhost:3001/api/tickets?isClosed=false&priority=HIGH

# Tickets d'un technicien spécifique
curl http://localhost:3001/api/tickets?assignedTechnicianId=5

# Tickets par statut
curl http://localhost:3001/api/tickets?statusName=Nouveau

# Recherche par mot-clé
curl http://localhost:3001/api/tickets?search=wifi

# Tickets créés ce mois
curl "http://localhost:3001/api/tickets?createdAfter=2024-10-01&createdBefore=2024-10-31"

# Combinaison de filtres
curl "http://localhost:3001/api/tickets?organizationId=123&isClosed=false&priority=HIGH&sortBy=createdAt&sortOrder=DESC"
```

#### Réponse

```json
{
  "data": [
    {
      "ticket": {
        "ticketId": 12345,
        "title": "Problème wifi",
        "description": "...",
        "priority": "HIGH",
        "status": {
          "statusId": 1,
          "displayName": "Nouveau"
        },
        "organizationId": 123,
        "assignedTechnicianId": 5,
        "createdAt": "2024-10-23T10:00:00Z",
        "timeSpentSeconds": 1200,
        "timeSpentHours": 0.33,
        "tags": ["urgent", "wifi"],
        "source": "EMAIL",
        "requesterName": "Jean Dupont",
        ...
      },
      "organization": {
        "organizationId": 123,
        "organizationName": "MGV",
        ...
      },
      "assignedTechnician": {
        "technicianId": 5,
        "firstName": "Adrien",
        "lastName": "PERRICHON",
        "fullName": "Adrien PERRICHON",
        ...
      }
    }
  ],
  "pagination": {
    "total": 965,
    "page": 1,
    "limit": 50,
    "totalPages": 20
  },
  "filters": {
    "applied": ["organizationId", "isClosed"],
    "available": {
      "priorities": ["NONE", "LOW", "MEDIUM", "HIGH"],
      "statuses": ["Nouveau", "Fermé", "Ouvert", "Résolu"],
      "sources": ["EMAIL", "PORTAL", "API"],
      "totalOrganizations": 348,
      "totalTechnicians": 16
    }
  }
}
```

---

### 2. Détail d'un ticket

```http
GET /api/tickets/:id
```

Récupère un ticket spécifique avec toutes ses relations.

#### Exemple

```bash
curl http://localhost:3001/api/tickets/12345
```

---

### 3. Statistiques globales

```http
GET /api/tickets/stats
```

Récupère des statistiques globales sur les tickets (peut être filtré).

#### Paramètres

Accepte tous les filtres de la liste des tickets.

#### Exemples

```bash
# Stats globales
curl http://localhost:3001/api/tickets/stats

# Stats pour une organisation
curl http://localhost:3001/api/tickets/stats?organizationId=123

# Stats pour un technicien
curl http://localhost:3001/api/tickets/stats?assignedTechnicianId=5

# Stats pour une période
curl "http://localhost:3001/api/tickets/stats?createdAfter=2024-10-01"
```

#### Réponse

```json
{
  "total": 965,
  "open": 498,
  "closed": 467,
  "resolved": 47,
  "unassigned": 760,
  "overdue": 0,
  "byStatus": [
    {
      "status": "Fermé",
      "count": 467,
      "percentage": 48.39
    },
    {
      "status": "Nouveau",
      "count": 355,
      "percentage": 36.79
    },
    ...
  ],
  "byPriority": [
    {
      "priority": "NONE",
      "count": 634,
      "percentage": 65.70
    },
    {
      "priority": "HIGH",
      "count": 208,
      "percentage": 21.55
    },
    ...
  ],
  "timeMetrics": {
    "avgTimeSpentHours": 0.31,
    "avgTimeToResolutionHours": 0,
    "totalTimeSpentHours": 299.71
  }
}
```

---

### 4. Statistiques par organisation

```http
GET /api/tickets/stats/by-organization
```

Récupère des statistiques groupées par organisation.

#### Exemples

```bash
# Stats de toutes les organisations
curl http://localhost:3001/api/tickets/stats/by-organization

# Stats des organisations pour une période
curl "http://localhost:3001/api/tickets/stats/by-organization?createdAfter=2024-10-01"
```

#### Réponse

```json
[
  {
    "organization": {
      "organizationId": 123,
      "organizationName": "MGV",
      ...
    },
    "stats": {
      "total": 50,
      "open": 25,
      "closed": 25,
      "unassigned": 10,
      "timeMetrics": {
        "avgTimeSpentHours": 0.5,
        ...
      }
    }
  },
  ...
]
```

---

### 5. Statistiques par technicien

```http
GET /api/tickets/stats/by-technician
```

Récupère des statistiques groupées par technicien.

#### Exemples

```bash
# Stats de tous les techniciens
curl http://localhost:3001/api/tickets/stats/by-technician

# Stats des techniciens d'une organisation
curl http://localhost:3001/api/tickets/stats/by-technician?organizationId=123
```

#### Réponse

```json
[
  {
    "technician": {
      "technicianId": 5,
      "firstName": "Adrien",
      "lastName": "PERRICHON",
      "fullName": "Adrien PERRICHON",
      ...
    },
    "stats": {
      "total": 205,
      "open": 100,
      "closed": 105,
      "timeMetrics": {
        "avgTimeSpentHours": 0.3,
        "avgTimeToResolutionHours": 2.5,
        ...
      }
    }
  },
  ...
]
```

---

### 6. Statistiques par période

```http
GET /api/tickets/stats/by-period?groupBy={day|week|month}
```

Récupère des statistiques groupées par période temporelle.

#### Paramètres requis

| Paramètre | Type | Valeurs | Description |
|-----------|------|---------|-------------|
| `groupBy` | string | day, week, month | Granularité du groupement |

#### Exemples

```bash
# Stats par jour
curl "http://localhost:3001/api/tickets/stats/by-period?groupBy=day"

# Stats par semaine pour une organisation
curl "http://localhost:3001/api/tickets/stats/by-period?groupBy=week&organizationId=123"

# Stats par mois pour une période
curl "http://localhost:3001/api/tickets/stats/by-period?groupBy=month&createdAfter=2024-01-01"
```

#### Réponse

```json
[
  {
    "period": "2024-10-23",
    "year": 2024,
    "month": 10,
    "day": 23,
    "created": 15,
    "resolved": 8,
    "closed": 10,
    "avgResolutionTimeHours": 2.5
  },
  ...
]
```

---

## Endpoints par organisation

### Liste des tickets d'une organisation

```http
GET /api/organizations/:organizationId/tickets
```

Accepte tous les paramètres de filtrage des tickets.

#### Exemples

```bash
# Tous les tickets de l'organisation 123
curl http://localhost:3001/api/organizations/123/tickets

# Tickets ouverts de l'organisation 123
curl http://localhost:3001/api/organizations/123/tickets?isClosed=false

# Tickets prioritaires de l'organisation 123
curl http://localhost:3001/api/organizations/123/tickets?priority=HIGH
```

### Statistiques d'une organisation

```http
GET /api/organizations/:organizationId/tickets/stats
```

#### Exemple

```bash
curl http://localhost:3001/api/organizations/123/tickets/stats
```

---

## Endpoints par technicien

### Liste des tickets d'un technicien

```http
GET /api/technicians/:technicianId/tickets
```

Accepte tous les paramètres de filtrage des tickets.

#### Exemples

```bash
# Tous les tickets du technicien 5
curl http://localhost:3001/api/technicians/5/tickets

# Tickets ouverts du technicien 5
curl http://localhost:3001/api/technicians/5/tickets?isClosed=false
```

### Statistiques d'un technicien

```http
GET /api/technicians/:technicianId/tickets/stats
```

#### Exemple

```bash
curl http://localhost:3001/api/technicians/5/tickets/stats
```

---

## Cas d'usage métier

### 1. Dashboard Manager/Chef

Voir tous les tickets de son organisation avec statistiques:

```bash
# Vue d'ensemble
curl http://localhost:3001/api/organizations/123/tickets/stats

# Liste des tickets ouverts
curl http://localhost:3001/api/organizations/123/tickets?isClosed=false&sortBy=priority

# Tickets non assignés de l'organisation (besoin d'assignation)
curl http://localhost:3001/api/organizations/123/tickets?unassigned=true

# Tendances par mois
curl "http://localhost:3001/api/tickets/stats/by-period?groupBy=month&organizationId=123"
```

### 2. Vue Technicien

Voir ses tickets et le pool non assigné:

```bash
# Mes tickets ouverts
curl http://localhost:3001/api/technicians/5/tickets?isClosed=false

# Mes stats
curl http://localhost:3001/api/technicians/5/tickets/stats

# Pool de tickets non assignés (à prendre)
curl http://localhost:3001/api/tickets?unassigned=true&isClosed=false
```

### 3. Vue Admin/Support globale

Vue multi-organisation:

```bash
# Stats globales
curl http://localhost:3001/api/tickets/stats

# Stats par organisation
curl http://localhost:3001/api/tickets/stats/by-organization

# Stats par technicien
curl http://localhost:3001/api/tickets/stats/by-technician

# Tous les tickets non assignés (78.8% actuellement!)
curl http://localhost:3001/api/tickets?unassigned=true&limit=100
```

### 4. Reporting et KPIs

Analyse de performance:

```bash
# Volume par période
curl "http://localhost:3001/api/tickets/stats/by-period?groupBy=day&createdAfter=2024-10-01"

# Distribution priorité/statut
curl http://localhost:3001/api/tickets/stats

# Charge par technicien
curl http://localhost:3001/api/tickets/stats/by-technician

# Performance par organisation
curl http://localhost:3001/api/tickets/stats/by-organization
```

### 5. Recherche avancée

Combinaisons de filtres complexes:

```bash
# Tickets urgents non assignés créés cette semaine
curl "http://localhost:3001/api/tickets?unassigned=true&priority=HIGH&createdAfter=2024-10-21&isClosed=false"

# Tickets d'une organisation avec un mot-clé
curl "http://localhost:3001/api/tickets?organizationId=123&search=wifi"

# Tickets en retard avec priorité haute
curl "http://localhost:3001/api/tickets?isOverdue=true&priority=HIGH"
```

---

## Données actuelles (Snapshot)

- **Total tickets**: 965
- **Organisations avec tickets**: 114
- **Techniciens avec tickets**: 11
- **Tickets ouverts**: 498 (51.6%)
- **Tickets fermés**: 467 (48.4%)
- **Tickets non assignés**: 760 (78.8%) ⚠️

### Distribution des statuts

| Statut | Count | % |
|--------|-------|---|
| Fermé | 467 | 48.39% |
| Nouveau | 355 | 36.79% |
| Ouvert | 56 | 5.80% |
| Résolu | 47 | 4.87% |
| En attente | 35 | 3.63% |
| En pause | 3 | 0.31% |

### Distribution des priorités

| Priorité | Count | % |
|----------|-------|---|
| NONE | 634 | 65.70% |
| HIGH | 208 | 21.55% |
| MEDIUM | 120 | 12.44% |
| LOW | 3 | 0.31% |

---

## Notes d'implémentation

### Performance

- **Pagination**: Limite par défaut de 50 tickets pour éviter les surcharges
- **Relations**: Chargement optimisé en batch (pas de N+1 queries)
- **Filtres**: Index sur organization_id, assigned_technician_id, priority, status_id, created_at
- **Agrégations**: Utilise PostgreSQL FILTER pour des stats performantes

### Types de données

- **JSONB**: Les champs `status`, `tags`, `custom_fields` sont stockés en JSONB pour flexibilité
- **Time Dimensions**: Liens vers dim_time pour analyse temporelle avancée
- **Relations**: Liens vers dim_organizations, dim_technicians, dim_devices

### Limitations actuelles

- **Comments/Activity/Attachments**: Tables vides (pas encore synchronisées depuis NinjaOne)
- **Champs détaillés**: Certains champs (resolved_at, closed_at, ticket_number) nécessitent l'API détail NinjaOne (endpoint /v2/ticketing/ticket/{id})
- **Time to resolution**: Pas encore calculé car resolved_at souvent NULL

---

## Configuration

### Port
L'API tourne sur le port **3001** (configuré dans .env)

### Base de données
- **Schéma**: ninjaone
- **Tables principales**: fact_tickets, dim_organizations, dim_technicians, dim_devices, dim_time

### Authentification
Actuellement aucune authentification n'est requise (à ajouter pour production)

---

## Prochaines étapes recommandées

1. Ajouter authentification/autorisation (JWT, OAuth)
2. Synchroniser comments/activity/attachments depuis NinjaOne
3. Implémenter rate limiting
4. Ajouter endpoints PATCH/POST pour mise à jour de tickets
5. Créer des webhooks pour synchronisation temps réel
6. Implémenter cache Redis pour statistiques
7. Ajouter Swagger/OpenAPI documentation

# NinjaOne Data Warehouse - Documentation

## 📊 Vue d'ensemble

Cette documentation décrit l'architecture du Data Warehouse NinjaOne, séparé des données EBP pour une meilleure organisation et maintenance.

## 🏗️ Architecture

### Schéma séparé : `ninjaone`

Toutes les tables NinjaOne sont dans le schéma `ninjaone` pour :
- **Isolation** : Séparation claire des données NinjaOne et EBP
- **Sécurité** : Permissions granulaires par schéma
- **Maintenance** : Backups et migrations indépendants
- **Performance** : Index et optimisations spécifiques

## 📋 Structure des tables

### Tables de Dimensions (Dim)

#### 1. `dim_organizations` - Clients/Organisations
```sql
ninjaone.dim_organizations
├── organization_id (PK)
├── organization_name
├── contact info (address, phone, email)
├── tags (JSONB)
└── audit fields
```

**Utilisation** : Référence pour tous les tickets et devices par client

#### 2. `dim_locations` - Localisations
```sql
ninjaone.dim_locations
├── location_id (PK)
├── organization_id (FK)
├── location_name
└── address info
```

**Utilisation** : Sous-organisation géographique des clients

#### 3. `dim_technicians` - Employés/Techniciens
```sql
ninjaone.dim_technicians
├── technician_id (PK)
├── technician_uid (UNIQUE)
├── first_name, last_name, email
├── user_type (TECHNICIAN, ADMIN)
├── permissions
└── security settings
```

**Utilisation** : Assignation des tickets, traçabilité des actions

#### 4. `dim_devices` - Appareils gérés
```sql
ninjaone.dim_devices
├── device_id (PK)
├── device_uid (UNIQUE)
├── organization_id (FK)
├── system_name, dns_name
├── node_class (WINDOWS_SERVER, WORKSTATION, etc.)
└── status (online/offline)
```

**Utilisation** : Liaison tickets ↔ appareils

#### 5. `dim_ticket_statuses` - Statuts de tickets
```sql
ninjaone.dim_ticket_statuses
├── status_id (PK)
├── status_name
├── status_type (OPEN, CLOSED, etc.)
└── flags (is_open, is_closed, is_resolved)
```

**Utilisation** : Normalisation des statuts

#### 6. `dim_time` - Dimension temporelle
```sql
ninjaone.dim_time
├── time_id (PK) [format: YYYYMMDD]
├── date (UNIQUE)
├── year, quarter, month, week, day
├── day_of_week, day_of_year
├── month_name, day_name
├── is_weekend, is_holiday
└── fiscal periods
```

**Utilisation** : Analyses temporelles, agrégations par période

---

### Table de Faits (Fact)

#### `fact_tickets` - Tickets (Table principale)

```sql
ninjaone.fact_tickets
├── ticket_id (PK)
├── ticket_uid, ticket_number
│
├── DIMENSIONS (Foreign Keys)
│   ├── organization_id → dim_organizations
│   ├── location_id → dim_locations
│   ├── assigned_technician_id → dim_technicians
│   ├── created_by_technician_id → dim_technicians
│   ├── device_id → dim_devices
│   ├── status_id → dim_ticket_statuses
│   ├── created_date_id → dim_time
│   ├── resolved_date_id → dim_time
│   ├── closed_date_id → dim_time
│   └── due_date_id → dim_time
│
├── DÉTAILS
│   ├── title, description
│   ├── category, subcategory
│   ├── status, priority, severity
│   └── ticket_type
│
├── DATES (Timestamps complets)
│   ├── created_at
│   ├── updated_at
│   ├── resolved_at
│   ├── closed_at
│   └── due_date
│
├── MÉTRIQUES (en secondes)
│   ├── time_spent_seconds
│   ├── estimated_time_seconds
│   ├── time_to_resolution_seconds
│   └── time_to_first_response_seconds
│
├── MÉTRIQUES CALCULÉES (en heures - GENERATED)
│   ├── time_spent_hours
│   ├── estimated_time_hours
│   ├── time_to_resolution_hours
│   └── time_to_first_response_hours
│
├── FLAGS
│   ├── is_overdue, is_resolved, is_closed
│   ├── has_attachments, has_comments
│   └── counts (comments, attachments, activity)
│
├── DONNÉES DÉNORMALISÉES (pour performance)
│   ├── requester_name, requester_email
│   ├── tags (JSONB)
│   └── custom_fields (JSONB)
│
└── ETL METADATA
    ├── etl_loaded_at
    ├── etl_source
    └── etl_version
```

---

### Tables de Support

#### `ticket_comments` - Commentaires
```sql
ninjaone.ticket_comments
├── comment_id (PK, SERIAL)
├── ticket_id (FK)
├── comment_body
├── author_technician_id (FK)
├── is_internal
├── created_at
└── attachments (JSONB)
```

#### `ticket_activity` - Journal d'activité
```sql
ninjaone.ticket_activity
├── activity_id (PK, SERIAL)
├── ticket_id (FK)
├── activity_type (status_change, assignment, etc.)
├── activity_description
├── old_value, new_value
├── time_tracked_seconds
└── created_at
```

#### `ticket_attachments` - Pièces jointes
```sql
ninjaone.ticket_attachments
├── attachment_id (PK, SERIAL)
├── ticket_id (FK)
├── file_name, file_url
├── file_size, mime_type
└── uploaded_by_technician_id (FK)
```

---

## 🔄 Mapping API NinjaOne → Base de données

### Transformation des Tickets

| Champ API NinjaOne | Type | → | Champ BDD | Type | Notes |
|-------------------|------|---|-----------|------|-------|
| `id` | number | → | `ticket_id` | INTEGER | Clé primaire |
| `uid` | string | → | `ticket_uid` | VARCHAR | Identifiant unique |
| `subject` | string | → | `title` | TEXT | Sujet du ticket |
| `description` | string | → | `description` | TEXT | Description complète |
| `status` | string | → | `status` | VARCHAR | Statut textuel |
| `statusId` | number | → | `status_id` | INTEGER | FK vers dim_ticket_statuses |
| `priority` | string | → | `priority` | VARCHAR | LOW, MEDIUM, HIGH, URGENT, CRITICAL |
| `severity` | string | → | `severity` | VARCHAR | MINOR, MODERATE, MAJOR, CRITICAL |
| `clientId` | number | → | `organization_id` | INTEGER | FK vers dim_organizations |
| `assignedTo` | number | → | `assigned_technician_id` | INTEGER | FK vers dim_technicians |
| `createBy` | number | → | `created_by_technician_id` | INTEGER | FK vers dim_technicians |
| `deviceId` | number | → | `device_id` | INTEGER | FK vers dim_devices |
| `createTime` | timestamp | → | `created_at` | TIMESTAMP | Conversion UNIX → ISO |
| `lastUpdateTime` | timestamp | → | `updated_at` | TIMESTAMP | Conversion UNIX → ISO |
| `resolvedTime` | timestamp | → | `resolved_at` | TIMESTAMP | Conversion UNIX → ISO |
| `closedTime` | timestamp | → | `closed_at` | TIMESTAMP | Conversion UNIX → ISO |
| `dueDate` | timestamp | → | `due_date` | TIMESTAMP | Conversion UNIX → ISO |
| `timeTracked` | seconds | → | `time_spent_seconds` | INTEGER | Temps passé en secondes |
| `estimatedTime` | seconds | → | `estimated_time_seconds` | INTEGER | Temps estimé |
| `tags` | array | → | `tags` | JSONB | Stockage JSON |
| `customFields` | object | → | `custom_fields` | JSONB | Champs personnalisés |

### Transformations spéciales

#### 1. **Dates**
```typescript
// API NinjaOne: timestamps UNIX (secondes)
createTime: 1761230784

// Base de données: ISO 8601
created_at: '2025-10-23T14:46:24.000Z'
```

#### 2. **Dimension Temps**
```typescript
// Extraction automatique
created_at: '2025-10-23T14:46:24Z'
→ created_date_id: 20251023  // Pour jointures avec dim_time
```

#### 3. **Métriques de temps**
```typescript
// Secondes → Heures (calculé automatiquement)
time_spent_seconds: 7200
→ time_spent_hours: 2.00  // GENERATED COLUMN
```

#### 4. **Flags booléens**
```typescript
// Calculés à l'insertion
is_overdue = (due_date < NOW() AND status NOT IN ('CLOSED', 'RESOLVED'))
is_resolved = (status IN ('RESOLVED', 'CLOSED'))
is_closed = (status = 'CLOSED')
```

---

## 🔍 Vues matérialisées (Performance)

### `mv_daily_ticket_summary`

Vue pré-calculée pour analyses quotidiennes :

```sql
SELECT * FROM ninjaone.mv_daily_ticket_summary
WHERE date = '2025-10-23'
  AND organization_id = 2;
```

**Contenu** :
- Comptes de tickets par statut
- Comptes par priorité
- Métriques moyennes (résolution, temps passé)
- Tickets en retard

**Rafraîchissement** :
```sql
SELECT ninjaone.refresh_materialized_views();
```

---

## 📊 Exemples de requêtes analytiques

### 1. Tickets par client et statut
```sql
SELECT
    o.organization_name,
    t.status,
    COUNT(*) as ticket_count,
    AVG(t.time_to_resolution_hours) as avg_resolution_hours
FROM ninjaone.fact_tickets t
JOIN ninjaone.dim_organizations o ON t.organization_id = o.organization_id
WHERE t.created_at >= '2025-01-01'
GROUP BY o.organization_name, t.status
ORDER BY ticket_count DESC;
```

### 2. Performance des techniciens
```sql
SELECT
    tech.full_name,
    COUNT(*) as tickets_assigned,
    COUNT(CASE WHEN t.is_resolved THEN 1 END) as tickets_resolved,
    AVG(t.time_spent_hours) as avg_time_spent,
    AVG(t.time_to_resolution_hours) as avg_resolution_time
FROM ninjaone.fact_tickets t
JOIN ninjaone.dim_technicians tech ON t.assigned_technician_id = tech.technician_id
WHERE t.created_at >= CURRENT_DATE - INTERVAL '30 days'
GROUP BY tech.technician_id, tech.full_name
ORDER BY tickets_resolved DESC;
```

### 3. Analyse temporelle (par mois)
```sql
SELECT
    dt.year,
    dt.month,
    dt.month_name,
    COUNT(*) as total_tickets,
    COUNT(CASE WHEN t.is_resolved THEN 1 END) as resolved_tickets,
    ROUND(AVG(t.time_to_resolution_hours), 2) as avg_resolution_hours
FROM ninjaone.fact_tickets t
JOIN ninjaone.dim_time dt ON t.created_date_id = dt.time_id
GROUP BY dt.year, dt.month, dt.month_name
ORDER BY dt.year, dt.month;
```

### 4. Tickets en retard par client
```sql
SELECT
    o.organization_name,
    COUNT(*) as overdue_tickets,
    AVG(EXTRACT(EPOCH FROM (NOW() - t.due_date))/3600) as avg_hours_overdue
FROM ninjaone.fact_tickets t
JOIN ninjaone.dim_organizations o ON t.organization_id = o.organization_id
WHERE t.is_overdue = TRUE
GROUP BY o.organization_id, o.organization_name
ORDER BY overdue_tickets DESC;
```

### 5. Analyse par priorité et device type
```sql
SELECT
    d.node_class as device_type,
    t.priority,
    COUNT(*) as ticket_count,
    AVG(t.time_to_resolution_hours) as avg_resolution_hours
FROM ninjaone.fact_tickets t
JOIN ninjaone.dim_devices d ON t.device_id = d.device_id
WHERE t.created_at >= '2025-01-01'
GROUP BY d.node_class, t.priority
ORDER BY device_type, ticket_count DESC;
```

---

## 🔐 Permissions recommandées

```sql
-- Création d'un rôle pour l'application NinjaOne API
CREATE ROLE ninjaone_api_user LOGIN PASSWORD 'secure_password';

-- Permissions sur le schéma
GRANT USAGE ON SCHEMA ninjaone TO ninjaone_api_user;

-- Permissions sur les tables
GRANT SELECT, INSERT, UPDATE ON ALL TABLES IN SCHEMA ninjaone TO ninjaone_api_user;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA ninjaone TO ninjaone_api_user;

-- Permissions sur les vues matérialisées
GRANT SELECT ON ALL MATERIALIZED VIEWS IN SCHEMA ninjaone TO ninjaone_api_user;

-- Permissions par défaut pour les futures tables
ALTER DEFAULT PRIVILEGES IN SCHEMA ninjaone
GRANT SELECT, INSERT, UPDATE ON TABLES TO ninjaone_api_user;
```

---

## 🚀 Initialisation de la base de données

### 1. Création du schéma
```bash
psql -h localhost -U postgres -d ebp_db -f schema_ninjaone.sql
```

### 2. Vérification
```sql
-- Vérifier les tables créées
SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'ninjaone';

-- Vérifier la dimension temps
SELECT COUNT(*) FROM ninjaone.dim_time;
-- Devrait retourner ~2190 jours (2020-2025)
```

### 3. Premier chargement de données
```typescript
// Via l'API NestJS
POST http://localhost:3000/ninja-one/sync/organizations
POST http://localhost:3000/ninja-one/sync/technicians
POST http://localhost:3000/ninja-one/sync/devices
POST http://localhost:3000/ninja-one/sync/tickets
```

---

## 📈 Maintenance

### Rafraîchissement des vues matérialisées
```sql
-- Manuel
SELECT ninjaone.refresh_materialized_views();

-- Automatique (via cron ou pg_cron)
SELECT cron.schedule(
    'refresh-ninjaone-views',
    '0 2 * * *',  -- Tous les jours à 2h du matin
    'SELECT ninjaone.refresh_materialized_views();'
);
```

### Vacuum et Analyze
```sql
-- Après un gros chargement
VACUUM ANALYZE ninjaone.fact_tickets;
VACUUM ANALYZE ninjaone.dim_organizations;
```

### Monitoring de la croissance
```sql
SELECT
    schemaname,
    tablename,
    pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) AS size
FROM pg_tables
WHERE schemaname = 'ninjaone'
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;
```

---

## 🔄 Pipeline ETL

### Flux de données

```
NinjaOne API
    ↓
NestJS Service (transformation)
    ↓
PostgreSQL (ninjaone schema)
    ↓
Power BI / Tableau / Autres outils BI
```

### Stratégie de chargement

1. **Initial Load** : Chargement complet historique
2. **Incremental Load** : Mise à jour quotidienne
3. **Real-time** : Webhooks NinjaOne (optionnel)

---

## 📚 Ressources

- [API NinjaOne Documentation](https://app.ninjarmm.com/apidocs-beta/)
- [PostgreSQL Time Dimension Best Practices](https://www.postgresql.org/docs/)
- [Star Schema Design](https://en.wikipedia.org/wiki/Star_schema)

---

## 📞 Support

Pour toute question sur cette structure :
- Vérifier le code dans `ninjaone_api/src/ninja-one/`
- Consulter les DTOs dans `dto/ticket-transform.dto.ts`
- Voir le service de transformation dans `services/ticket-transform.service.ts`

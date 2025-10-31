# Guide d'utilisation : Système de conversion NinjaOne → Interventions EBP

**Date**: 2025-10-31
**Migrations**: 017 et 018
**Auteur**: Claude Code

---

## 📋 Table des matières

1. [Vue d'ensemble](#vue-densemble)
2. [Architecture](#architecture)
3. [Installation](#installation)
4. [Workflow complet](#workflow-complet)
5. [Exemples d'utilisation](#exemples-dutilisation)
6. [Référence API](#référence-api)
7. [FAQ & Troubleshooting](#faq--troubleshooting)

---

## 🎯 Vue d'ensemble

Le système de conversion NinjaOne permet de transformer les tickets RMM (Remote Monitoring and Management) de NinjaOne en **interventions** ou **incidents** dans EBP, tout en respectant la règle d'or :

> **🔒 RÈGLE CRITIQUE** : Le schéma `public` (miroir EBP MSSQL) n'est **JAMAIS modifié**. Toutes les opérations se font dans le schéma `mobile`.

### Fonctionnalités principales

- ✅ **Liaison existante** : Lier des tickets NinjaOne à des `ScheduleEvent` ou `Incident` existants dans EBP
- ✅ **Conversion proposée** : Créer des propositions d'interventions/incidents dans `mobile` schema
- ✅ **Mapping automatique** : Organisations NinjaOne → Clients EBP, Techniciens NinjaOne → Collègues EBP
- ✅ **Traçabilité complète** : Suivi bidirectionnel ticket ↔ intervention/incident
- ✅ **Statistiques** : Dashboard complet de l'état de conversion

---

## 🏗️ Architecture

### Schémas de données

```
┌─────────────────────────────────────────────────────────────┐
│                      ninjaone schema                         │
│  - fact_tickets (965 tickets)                                │
│  - dim_organizations (348 organisations)                     │
│  - dim_technicians (16 techniciens)                          │
└────────────────┬────────────────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────────────────┐
│                      mobile schema                           │
│  📊 MAPPING                                                  │
│  - ninjaone_customer_mapping (orgs → clients EBP)            │
│  - ninjaone_technician_mapping (techs → collègues EBP)       │
│                                                              │
│  🔗 LIAISON                                                  │
│  - ninjaone_intervention_links (tickets ↔ interventions)     │
│                                                              │
│  📝 PROPOSITIONS (staging)                                   │
│  - interventions_proposed (→ ScheduleEvent dans EBP)         │
│  - incidents_proposed (→ Incident dans EBP)                  │
└────────────────┬────────────────────────────────────────────┘
                 │
                 ▼ (READ ONLY)
┌─────────────────────────────────────────────────────────────┐
│                      public schema (EBP)                     │
│  - "ScheduleEvent" (interventions planifiées)                │
│  - "Incident" (tickets maintenance)                          │
│  - "Customer" (clients)                                      │
│  - "Colleague" (techniciens/collègues)                       │
└─────────────────────────────────────────────────────────────┘
```

### Tables principales

| Table | Schéma | Description | Lecture/Écriture |
|-------|--------|-------------|------------------|
| `fact_tickets` | `ninjaone` | Tickets RMM NinjaOne | ✅ Lecture |
| `dim_organizations` | `ninjaone` | Organisations RMM | ✅ Lecture |
| `dim_technicians` | `ninjaone` | Techniciens RMM | ✅ Lecture |
| `ninjaone_customer_mapping` | `mobile` | Mapping orgs → clients | ✅✏️ R/W |
| `ninjaone_technician_mapping` | `mobile` | Mapping techs → collègues | ✅✏️ R/W |
| `ninjaone_intervention_links` | `mobile` | Liaison tickets ↔ interventions | ✅✏️ R/W |
| `interventions_proposed` | `mobile` | Interventions proposées (staging) | ✅✏️ R/W |
| `incidents_proposed` | `mobile` | Incidents proposés (staging) | ✅✏️ R/W |
| `"ScheduleEvent"` | `public` | Interventions EBP | ✅ Lecture seule ⛔ |
| `"Incident"` | `public` | Incidents EBP | ✅ Lecture seule ⛔ |
| `"Customer"` | `public` | Clients EBP | ✅ Lecture seule ⛔ |
| `"Colleague"` | `public` | Collègues EBP | ✅ Lecture seule ⛔ |

---

## 🚀 Installation

### 1. Exécuter les migrations

```bash
# Migration 017 : Tables de liaison et mapping
psql -h localhost -U postgres -d ebp_db -f Database/migrations/017_create_ninjaone_intervention_links.sql

# Migration 018 : Système de conversion
psql -h localhost -U postgres -d ebp_db -f Database/migrations/018_create_ninjaone_conversion_system.sql
```

### 2. Vérifier l'installation

```sql
-- Vérifier que les tables existent
SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'mobile'
  AND table_name LIKE 'ninjaone%';

-- Résultat attendu :
-- ninjaone_intervention_links
-- ninjaone_customer_mapping
-- ninjaone_technician_mapping
```

### 3. Initialiser le mapping automatique

```sql
-- Mapper automatiquement les organisations (par nom exact)
SELECT * FROM mobile.auto_map_ninjaone_organizations();

-- Mapper automatiquement les techniciens (par email)
SELECT * FROM mobile.auto_map_ninjaone_technicians();

-- Voir les résultats
SELECT * FROM mobile.get_ninjaone_conversion_stats();
```

---

## 🔄 Workflow complet

### Étape 1 : Mapping initial (une seule fois)

#### 1.1 Mapping automatique

```sql
-- Auto-mapping par nom exact et email
SELECT * FROM mobile.auto_map_ninjaone_organizations();
SELECT * FROM mobile.auto_map_ninjaone_technicians();
```

#### 1.2 Mapping manuel (pour les cas non automatiques)

```sql
-- Voir les organisations NinjaOne non mappées
SELECT
    o.organization_id,
    o.organization_name,
    o.city,
    o.phone
FROM ninjaone.dim_organizations o
LEFT JOIN mobile.ninjaone_customer_mapping m
    ON o.organization_id = m.ninjaone_organization_id
WHERE m.id IS NULL
  AND o.is_active = TRUE;

-- Mapper manuellement une organisation
INSERT INTO mobile.ninjaone_customer_mapping (
    ninjaone_organization_id,
    ninjaone_organization_name,
    ebp_customer_id,
    ebp_customer_name,
    mapping_confidence,
    confidence_score,
    validated,
    mapping_notes
) VALUES (
    123,                    -- ID organisation NinjaOne
    'ACME Corporation',     -- Nom NinjaOne
    'CUST001',              -- ID client EBP
    'ACME Corp',            -- Nom EBP
    'manual',
    1.00,
    TRUE,
    'Mapping manuel - noms légèrement différents'
);

-- Même principe pour les techniciens
INSERT INTO mobile.ninjaone_technician_mapping (
    ninjaone_technician_id,
    ninjaone_technician_name,
    ninjaone_technician_email,
    ebp_colleague_id,
    ebp_colleague_name,
    ebp_colleague_email,
    mapping_confidence,
    validated
) VALUES (
    5,
    'John Doe',
    'john.doe@company.com',
    'TECH01',
    'John DOE',
    'jdoe@company.com',
    'manual',
    TRUE
);
```

### Étape 2 : Identifier les tickets à convertir

```sql
-- Voir tous les tickets non encore convertis
SELECT * FROM mobile.v_ninjaone_tickets_unconverted
ORDER BY ticket_created_at DESC;

-- Filtrer par critères
SELECT * FROM mobile.v_ninjaone_tickets_unconverted
WHERE can_convert_fully_mapped = TRUE  -- Client ET technicien mappés
  AND ticket_is_overdue = FALSE        -- Pas en retard
  AND ticket_priority = 'HIGH';        -- Priorité haute
```

### Étape 3 : Convertir un ticket

#### Option A : Conversion en intervention (ScheduleEvent)

```sql
-- Convertir le ticket #42 en intervention
SELECT * FROM mobile.convert_ninjaone_ticket(
    p_ticket_id := 42,
    p_target_type := 'schedule_event',
    p_converted_by := 'user-uuid-here'::UUID
);

-- Résultat :
-- success | proposal_id              | proposal_type          | message
-- TRUE    | uuid-xxx-xxx-xxx-xxx     | intervention_proposed  | Intervention proposée créée avec succès...
```

#### Option B : Conversion en incident

```sql
-- Convertir le ticket #42 en incident
SELECT * FROM mobile.convert_ninjaone_ticket(
    p_ticket_id := 42,
    p_target_type := 'incident',
    p_converted_by := 'user-uuid-here'::UUID
);
```

### Étape 4 : Consulter les propositions

```sql
-- Voir toutes les propositions en attente
SELECT * FROM mobile.v_all_proposals
WHERE proposal_status = 'pending'
ORDER BY scheduled_date;

-- Voir les détails d'une intervention proposée
SELECT
    ip.*,
    c."Caption" as customer_caption,
    col."Caption" as colleague_caption
FROM mobile.interventions_proposed ip
LEFT JOIN public."Customer" c ON ip.customer_id = c."Id"
LEFT JOIN public."Colleague" col ON ip.colleague_id = col."Id"
WHERE ip.id = 'proposal-uuid-here'::UUID;
```

### Étape 5 : Approuver/Rejeter une proposition

```sql
-- Approuver une intervention proposée
UPDATE mobile.interventions_proposed
SET proposal_status = 'approved',
    validated_by = 'admin-user-uuid'::UUID,
    validated_at = NOW()
WHERE id = 'proposal-uuid'::UUID;

-- Rejeter une proposition
UPDATE mobile.interventions_proposed
SET proposal_status = 'rejected',
    validated_by = 'admin-user-uuid'::UUID,
    validated_at = NOW(),
    rejection_reason = 'Client a annulé la demande'
WHERE id = 'proposal-uuid'::UUID;
```

### Étape 6 : Intégrer à EBP (processus externe)

Les propositions approuvées doivent être **intégrées manuellement dans EBP** via :

1. **Export CSV** des propositions approuvées
2. **Import dans EBP** via l'interface EBP officielle
3. **Marquer comme intégré** dans la base

```sql
-- Export CSV (exemple)
COPY (
    SELECT
        caption,
        start_date_time,
        end_date_time,
        customer_id,
        colleague_id,
        notes_clear,
        priority
    FROM mobile.interventions_proposed
    WHERE proposal_status = 'approved'
      AND integrated_to_ebp = FALSE
) TO '/tmp/interventions_to_import.csv' WITH CSV HEADER;

-- Après import dans EBP, marquer comme intégré
UPDATE mobile.interventions_proposed
SET integrated_to_ebp = TRUE,
    integrated_at = NOW(),
    integrated_schedule_event_id = 'schedule-event-uuid'::UUID,
    proposal_status = 'integrated'
WHERE id = 'proposal-uuid'::UUID;
```

---

## 📝 Exemples d'utilisation

### Exemple 1 : Conversion complète d'un ticket urgent

```sql
-- 1. Identifier un ticket urgent non converti
SELECT
    ticket_id,
    ticket_number,
    title,
    priority,
    organization_name,
    can_convert_fully_mapped
FROM mobile.v_ninjaone_tickets_unconverted
WHERE priority = 'HIGH'
  AND can_convert_fully_mapped = TRUE
LIMIT 1;

-- Résultat : ticket_id = 123

-- 2. Convertir en intervention
SELECT * FROM mobile.convert_ninjaone_ticket(
    123,
    'schedule_event',
    'current-user-uuid'::UUID
);

-- 3. Vérifier la proposition
SELECT
    id,
    caption,
    start_date_time,
    customer_name,
    colleague_name,
    proposal_status
FROM mobile.interventions_proposed
WHERE ninjaone_ticket_id = 123;

-- 4. Approuver
UPDATE mobile.interventions_proposed
SET proposal_status = 'approved',
    validated_by = 'admin-uuid'::UUID,
    validated_at = NOW()
WHERE ninjaone_ticket_id = 123;
```

### Exemple 2 : Lier un ticket à une intervention EBP existante

```sql
-- Si une intervention existe déjà dans EBP pour ce ticket
INSERT INTO mobile.ninjaone_intervention_links (
    ninjaone_ticket_id,
    ninjaone_ticket_number,
    ninjaone_ticket_uid,
    target_type,
    target_id,
    target_reference,
    converted_by,
    conversion_method,
    conversion_notes
) VALUES (
    456,
    '123456',
    'uid-ninja-ticket',
    'schedule_event',
    'existing-schedule-event-uuid',
    'INT-2025-00456',
    'user-uuid'::UUID,
    'manual',
    'Intervention créée avant migration - liaison rétroactive'
);
```

### Exemple 3 : Conversion par batch (plusieurs tickets)

```sql
-- Convertir tous les tickets HIGH priority non convertis
DO $$
DECLARE
    v_ticket RECORD;
    v_result RECORD;
BEGIN
    FOR v_ticket IN
        SELECT ticket_id
        FROM mobile.v_ninjaone_tickets_unconverted
        WHERE priority = 'HIGH'
          AND can_convert_fully_mapped = TRUE
        LIMIT 10
    LOOP
        SELECT * INTO v_result
        FROM mobile.convert_ninjaone_ticket(
            v_ticket.ticket_id,
            'schedule_event',
            'batch-conversion-user-uuid'::UUID
        );

        RAISE NOTICE 'Ticket % : %', v_ticket.ticket_id, v_result.message;
    END LOOP;
END $$;
```

---

## 📚 Référence API

### Fonctions principales

#### `mobile.convert_ninjaone_ticket(ticket_id, target_type, user_id)`

Convertit un ticket NinjaOne en intervention ou incident proposé.

**Paramètres** :
- `p_ticket_id` (INTEGER) : ID du ticket NinjaOne
- `p_target_type` (VARCHAR) : `'schedule_event'` ou `'incident'`
- `p_converted_by` (UUID) : ID utilisateur mobile.users

**Retour** :
```sql
success    | BOOLEAN
proposal_id| UUID
type       | TEXT (intervention_proposed ou incident_proposed)
message    | TEXT (détail du résultat)
```

**Exemple** :
```sql
SELECT * FROM mobile.convert_ninjaone_ticket(42, 'schedule_event', 'uuid'::UUID);
```

---

#### `mobile.auto_map_ninjaone_organizations()`

Mappe automatiquement les organisations NinjaOne → clients EBP (correspondance exacte de nom).

**Retour** :
```sql
mapped_count | INTEGER (nombre d'organisations mappées)
message      | TEXT
```

**Exemple** :
```sql
SELECT * FROM mobile.auto_map_ninjaone_organizations();
-- Résultat : (25, 'Mapped 25 organisations avec correspondance exacte')
```

---

#### `mobile.auto_map_ninjaone_technicians()`

Mappe automatiquement les techniciens NinjaOne → collègues EBP (correspondance email).

**Retour** :
```sql
mapped_count | INTEGER
message      | TEXT
```

**Exemple** :
```sql
SELECT * FROM mobile.auto_map_ninjaone_technicians();
-- Résultat : (8, 'Mapped 8 techniciens avec email correspondant')
```

---

#### `mobile.get_ninjaone_conversion_stats()`

Statistiques complètes du système de conversion.

**Retour** :
```sql
total_tickets              | INTEGER (965)
tickets_closed             | INTEGER
tickets_open               | INTEGER
tickets_converted          | INTEGER
interventions_proposed     | INTEGER
incidents_proposed         | INTEGER
proposals_pending          | INTEGER
proposals_approved         | INTEGER
proposals_integrated       | INTEGER
organizations_mapped       | INTEGER
technicians_mapped         | INTEGER
tickets_ready_to_convert   | INTEGER
```

**Exemple** :
```sql
SELECT * FROM mobile.get_ninjaone_conversion_stats();
```

---

### Vues principales

#### `mobile.v_ninjaone_interventions`

Vue enrichie des tickets NinjaOne liés à des interventions/incidents EBP existants.

**Colonnes** :
- Informations ticket NinjaOne
- Organisation NinjaOne
- Technicien NinjaOne
- Mapping vers EBP (client, collègue)
- Détails ScheduleEvent si lié
- Détails Incident si lié

**Exemple** :
```sql
SELECT
    ticket_number,
    ticket_title,
    organization_name,
    ebp_customer_name,
    target_type,
    schedule_event_caption
FROM mobile.v_ninjaone_interventions
WHERE sync_status = 'active';
```

---

#### `mobile.v_ninjaone_tickets_unconverted`

Tickets NinjaOne candidats à la conversion (non encore convertis).

**Colonnes** :
- Informations ticket
- Mapping organisations/techniciens
- Flags de conversion (`can_convert_fully_mapped`, etc.)

**Exemple** :
```sql
SELECT * FROM mobile.v_ninjaone_tickets_unconverted
WHERE can_convert_customer_mapped = TRUE
ORDER BY ticket_created_at DESC;
```

---

#### `mobile.v_all_proposals`

Vue unifiée de toutes les propositions (interventions + incidents).

**Colonnes** :
- `type` : 'intervention_proposed' ou 'incident_proposed'
- `proposal_status` : 'pending', 'approved', 'rejected', 'integrated'
- Détails ticket NinjaOne
- Détails client/technicien mappé

**Exemple** :
```sql
SELECT * FROM mobile.v_all_proposals
WHERE proposal_status = 'pending'
ORDER BY scheduled_date;
```

---

## ❓ FAQ & Troubleshooting

### Q1 : "Organisation NinjaOne non mappée à un client EBP"

**Erreur** :
```
Organisation NinjaOne non mappée à un client EBP. ID organisation: 123
```

**Solution** :
```sql
-- 1. Vérifier si l'organisation existe
SELECT * FROM ninjaone.dim_organizations WHERE organization_id = 123;

-- 2. Chercher un client EBP correspondant
SELECT "Id", "Caption", "MainDeliveryAddress_City"
FROM public."Customer"
WHERE LOWER("Caption") LIKE '%nom-organisation%';

-- 3. Créer le mapping manuellement
INSERT INTO mobile.ninjaone_customer_mapping (
    ninjaone_organization_id,
    ninjaone_organization_name,
    ebp_customer_id,
    ebp_customer_name,
    mapping_confidence,
    validated
) VALUES (123, 'Nom Organisation', 'CUST_ID', 'Nom Client EBP', 'manual', TRUE);
```

---

### Q2 : "Ticket déjà converti"

**Erreur** :
```
Ticket déjà converti (vérifier interventions_proposed, incidents_proposed ou ninjaone_intervention_links)
```

**Solution** :
```sql
-- Vérifier où le ticket est déjà lié
SELECT 'intervention_proposed' as source, id, proposal_status
FROM mobile.interventions_proposed
WHERE ninjaone_ticket_id = 42
UNION ALL
SELECT 'incident_proposed', id, proposal_status
FROM mobile.incidents_proposed
WHERE ninjaone_ticket_id = 42
UNION ALL
SELECT 'ninjaone_links', id::TEXT, sync_status
FROM mobile.ninjaone_intervention_links
WHERE ninjaone_ticket_id = 42;

-- Si la proposition est rejetée/annulée, la supprimer pour reconvertir
DELETE FROM mobile.interventions_proposed
WHERE ninjaone_ticket_id = 42 AND proposal_status = 'rejected';
```

---

### Q3 : Comment valider le mapping automatique ?

```sql
-- Voir les mappings non validés
SELECT
    m.ninjaone_organization_name,
    m.ebp_customer_name,
    m.mapping_confidence,
    m.confidence_score
FROM mobile.ninjaone_customer_mapping m
WHERE m.validated = FALSE;

-- Valider si correct
UPDATE mobile.ninjaone_customer_mapping
SET validated = TRUE,
    validated_by = 'admin-uuid'::UUID,
    validated_at = NOW()
WHERE id = 123;

-- Corriger si incorrect
UPDATE mobile.ninjaone_customer_mapping
SET ebp_customer_id = 'CORRECT_CUSTOMER_ID',
    ebp_customer_name = 'Correct Name',
    validated = TRUE
WHERE id = 123;
```

---

### Q4 : Comment supprimer une proposition ?

```sql
-- Annuler une proposition (soft delete)
UPDATE mobile.interventions_proposed
SET proposal_status = 'cancelled'
WHERE id = 'proposal-uuid'::UUID;

-- Supprimer définitivement (hard delete)
DELETE FROM mobile.interventions_proposed
WHERE id = 'proposal-uuid'::UUID;
```

---

### Q5 : Dashboard complet de l'état du système

```sql
-- Statistiques globales
SELECT * FROM mobile.get_ninjaone_conversion_stats();

-- Tickets par priorité non convertis
SELECT
    priority,
    COUNT(*) as count,
    SUM(CASE WHEN can_convert_fully_mapped THEN 1 ELSE 0 END) as ready_to_convert
FROM mobile.v_ninjaone_tickets_unconverted
GROUP BY priority
ORDER BY priority DESC;

-- Propositions par statut
SELECT
    type,
    proposal_status,
    COUNT(*) as count
FROM mobile.v_all_proposals
GROUP BY type, proposal_status
ORDER BY type, proposal_status;

-- Mapping organisations : taux de complétion
SELECT
    COUNT(DISTINCT o.organization_id) as total_orgs,
    COUNT(DISTINCT m.ninjaone_organization_id) as mapped_orgs,
    ROUND(100.0 * COUNT(DISTINCT m.ninjaone_organization_id) / NULLIF(COUNT(DISTINCT o.organization_id), 0), 2) as completion_rate
FROM ninjaone.dim_organizations o
LEFT JOIN mobile.ninjaone_customer_mapping m ON o.organization_id = m.ninjaone_organization_id
WHERE o.is_active = TRUE;
```

---

## 🔐 Sécurité et bonnes pratiques

### ✅ Bonnes pratiques

1. **Toujours valider les mappings automatiques** avant conversion massive
2. **Utiliser des UUIDs utilisateurs** pour traçabilité des actions
3. **Approuver les propositions** avant intégration EBP
4. **Ne jamais supprimer** les liaisons une fois intégrées à EBP
5. **Backup avant conversion** massive

### ⛔ À éviter

1. **Ne JAMAIS insérer** directement dans `public."ScheduleEvent"` ou `public."Incident"`
2. **Ne pas supprimer** les mappings utilisés dans des liaisons actives
3. **Ne pas bypass** le processus d'approbation pour les propositions
4. **Ne pas modifier** directement les tables `ninjaone.*` (lecture seule)

---

## 📊 Rollback

En cas de problème, utilisez les scripts de rollback :

```bash
# Rollback migration 018 (système de conversion)
psql -h localhost -U postgres -d ebp_db -f Database/migrations/rollback_018_create_ninjaone_conversion_system.sql

# Rollback migration 017 (tables de liaison)
psql -h localhost -U postgres -d ebp_db -f Database/migrations/rollback_017_create_ninjaone_intervention_links.sql
```

**⚠️ Attention** : Le rollback supprime toutes les données de conversion (propositions, mappings, liaisons).

---

## 📞 Support

Pour toute question ou problème :

1. Consulter les vues de statistiques : `mobile.get_ninjaone_conversion_stats()`
2. Vérifier les logs PostgreSQL
3. Consulter la documentation du projet : `CLAUDE.md`
4. Créer une issue sur GitHub

---

**Dernière mise à jour** : 2025-10-31
**Version** : 1.0.0
**Migrations** : 017, 018

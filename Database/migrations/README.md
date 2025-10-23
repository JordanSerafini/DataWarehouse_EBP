# 📦 Migrations Base de Données - EBP Mobile App

Migrations **100% NON-INVASIVES** pour l'application mobile terrain.

## 🎯 Principe Fondamental

**AUCUNE MODIFICATION des tables EBP existantes**

Toutes nos données spécifiques vont dans un **schéma séparé** `mobile`.

---

## 📋 Liste des Migrations

### Migration 001: Schéma Mobile ✅ **OBLIGATOIRE**

**Fichier**: `001_create_mobile_schema.sql`

**Ce qu'elle fait**:
- Crée schéma `mobile` (séparé des tables EBP)
- Crée 7 tables pour app mobile:
  - `sync_status` - Suivi synchronisation
  - `intervention_photos` - Photos terrain
  - `intervention_signatures` - Signatures clients
  - `offline_cache` - Cache mode offline
  - `mobile_incidents` - Tickets créés sur mobile
  - `intervention_timesheets` - Temps passés
- Ajoute **index performance** (non-invasifs)
- Crée 2 vues simplifiées:
  - `v_interventions` - Interventions enrichies
  - `v_customers` - Clients simplifiés
- 1 fonction utilité: `calculate_distance_km()`

**Impact EBP**: **ZÉRO** ❌
- Aucune table EBP modifiée
- Seulement des index ajoutés (améliore performance)
- Schéma mobile peut être supprimé sans risque

**Exécution**:
```bash
./run_migrations.sh
# OU manuellement:
psql -d ebp_db -f 001_create_mobile_schema.sql
```

---

### Migration 002: GPS & Géocodage ⚠️ **OPTIONNELLE**

**Fichier**: `002_populate_gps_coordinates.sql`

**Ce qu'elle fait**:
- **Hérite** GPS: `ScheduleEvent` ← `Customer` (UPDATE seulement)
- Crée outils géocodage:
  - 2 vues: clients/events à géocoder
  - 1 fonction: héritage automatique GPS
  - 1 table log: traçabilité géocodage
  - 1 procédure: update GPS avec logging

**Découverte importante**: Les colonnes GPS **existent déjà** dans EBP ! 🎉
- `ScheduleEvent`: `Address_Latitude`, `Address_Longitude`
- `Customer`: `MainDeliveryAddress_Latitude`, `MainDeliveryAddress_Longitude`

**Impact EBP**: **MINIMAL** ⚠️
- Pas de ALTER TABLE (structure intacte)
- Seulement UPDATE (remplit colonnes vides)
- Données EBP enrichies (GPS utile même sans app mobile)

**Exécution**:
```bash
./run_migrations.sh  # Demande confirmation pour migration 002
# OU manuellement:
psql -d ebp_db -f 002_populate_gps_coordinates.sql
```

---

## 🚀 Exécution des Migrations

### Méthode 1: Script automatique (RECOMMANDÉ)

```bash
cd migrations
./run_migrations.sh
```

Le script:
1. ✅ Vérifie connexion PostgreSQL
2. ✅ Propose backup avant migration
3. ✅ Exécute migrations dans l'ordre
4. ✅ Affiche résumé détaillé
5. ✅ Demande confirmation pour migrations optionnelles

### Méthode 2: Manuellement

```bash
# Se connecter à PostgreSQL
psql -h localhost -U postgres -d ebp_db

-- Migration 001 (obligatoire)
\i 001_create_mobile_schema.sql

-- Migration 002 (optionnelle)
\i 002_populate_gps_coordinates.sql
```

---

## 🔄 Rollback (Annulation)

### Rollback Migration 001

```bash
psql -d ebp_db -f rollback_001.sql
```

**Effet**:
- ✅ Supprime schéma `mobile` et tout son contenu
- ✅ Supprime index performance
- ✅ **ZÉRO impact** sur tables EBP

### Rollback Migration 002

```bash
psql -d ebp_db -f rollback_002.sql
```

**Effet**:
- ✅ Supprime fonctions/vues géocodage
- ✅ Supprime table log
- ⚠️ **Conserve** les coordonnées GPS (voulu - données utiles)

Pour supprimer les GPS (NON RECOMMANDÉ):
```sql
UPDATE public."Customer"
SET "MainDeliveryAddress_Latitude" = NULL,
    "MainDeliveryAddress_Longitude" = NULL;

UPDATE public."ScheduleEvent"
SET "Address_Latitude" = NULL,
    "Address_Longitude" = NULL;
```

---

## 📊 Vérification Post-Migration

### Vérifier schéma mobile créé

```bash
psql -d ebp_db -c "\dn"  # Liste schémas
psql -d ebp_db -c "\dt mobile.*"  # Tables schéma mobile
```

### Statistiques GPS

```sql
-- Customers avec GPS
SELECT
    COUNT(*) as total,
    COUNT("MainDeliveryAddress_Latitude") as with_gps,
    ROUND((COUNT("MainDeliveryAddress_Latitude")::DECIMAL / COUNT(*)) * 100, 2) as pct
FROM public."Customer"
WHERE "ActiveState" = 1;

-- Events récents avec GPS
SELECT
    COUNT(*) as total,
    COUNT("Address_Latitude") as with_gps,
    ROUND((COUNT("Address_Latitude")::DECIMAL / COUNT(*)) * 100, 2) as pct
FROM public."ScheduleEvent"
WHERE "StartDate" >= CURRENT_DATE - INTERVAL '30 days';
```

### Voir clients à géocoder

```sql
SELECT * FROM mobile.v_customers_to_geocode LIMIT 10;
```

### Voir événements à géocoder

```sql
SELECT * FROM mobile.v_events_to_geocode LIMIT 10;
```

---

## 🛠️ Géocodage Externe (Optionnel)

Après migration 002, utiliser script Python pour géocoder adresses manquantes.

**Script**: `../scripts/geocode_addresses.py` (à créer)

```bash
cd ..
python scripts/geocode_addresses.py --limit 100
```

Le script:
1. Lit `mobile.v_customers_to_geocode`
2. Appelle API géocodage (Nominatim/Google)
3. Update via `mobile.update_customer_gps()`
4. Log dans `mobile.geocoding_log`

**APIs géocodage recommandées**:
- **Nominatim** (OpenStreetMap) - Gratuit, rate-limited
- **Google Maps Geocoding** - Payant, précis
- **HERE API** - Freemium
- **Photon** - Open-source, self-hosted

---

## 🎯 Cas d'Usage

### Héritage GPS client → événement

```sql
-- Copier GPS du client vers événements sans GPS
SELECT mobile.inherit_customer_gps();
```

### Update GPS manuel (client)

```sql
CALL mobile.update_customer_gps(
    'CLIENT001',           -- customer_id
    48.8566,               -- latitude (Paris)
    2.3522,                -- longitude
    'manual',              -- provider
    1.0                    -- quality (0.0-1.0)
);
```

### Calculer distance entre 2 points

```sql
SELECT mobile.calculate_distance_km(
    48.8566, 2.3522,   -- Paris
    45.764, 4.8357     -- Lyon
) as distance_km;
-- Résultat: ~392 km
```

### Requête événements avec distance

```sql
SELECT
    e."Id",
    e."Subject",
    c."Name" as customer,
    mobile.calculate_distance_km(
        48.8566, 2.3522,  -- Position technicien (ex: Paris)
        e."Address_Latitude",
        e."Address_Longitude"
    ) as distance_km
FROM public."ScheduleEvent" e
LEFT JOIN public."Customer" c ON e."CustomerId" = c."Id"
WHERE e."StartDate" >= CURRENT_DATE
  AND e."Address_Latitude" IS NOT NULL
ORDER BY distance_km ASC
LIMIT 10;
```

---

## ⚠️ Points d'Attention

### 1. Backup OBLIGATOIRE avant migration

```bash
pg_dump -h localhost -U postgres ebp_db -F c -f backup_$(date +%Y%m%d).dump
```

### 2. Tester sur environnement DEV d'abord

**Ne JAMAIS** migrer directement en production !

### 3. Coordonnées GPS

Les colonnes GPS existent déjà dans EBP mais sont souvent vides.
Migration 002 remplit les valeurs manquantes.

### 4. Performance

Les index créés améliorent les performances pour:
- Requêtes app mobile
- Dashboards BI
- Pas d'impact négatif sur EBP

### 5. Compatibilité EBP

**100% compatible** - EBP ne touche pas au schéma `mobile`.

---

## 📝 Structure Créée

```
PostgreSQL Database: ebp_db
│
├── public (schéma EBP - INTOUCHÉ)
│   ├── Customer ✅ (colonnes GPS existantes)
│   ├── ScheduleEvent ✅ (colonnes GPS existantes)
│   ├── Activity
│   ├── ... (319 tables EBP)
│   └── Index ajoutés (performance)
│
└── mobile (schéma nouveau - ISOLÉ)
    ├── Tables
    │   ├── sync_status
    │   ├── intervention_photos
    │   ├── intervention_signatures
    │   ├── offline_cache
    │   ├── mobile_incidents
    │   ├── intervention_timesheets
    │   └── geocoding_log
    │
    ├── Vues
    │   ├── v_interventions
    │   ├── v_customers
    │   ├── v_customers_to_geocode
    │   └── v_events_to_geocode
    │
    ├── Fonctions
    │   ├── calculate_distance_km()
    │   ├── inherit_customer_gps()
    │   └── auto_set_event_gps()
    │
    └── Procédures
        └── update_customer_gps()
```

---

## 🎉 Résumé

### Migrations SAFE ✅

- ✅ **ZÉRO modification** structure EBP
- ✅ Schéma `mobile` **isolé**
- ✅ **Rollback facile** sans risque
- ✅ **Compatible** avec EBP
- ✅ **Performance améliorée** (index)

### Prochaines Étapes

1. ✅ Exécuter migrations: `./run_migrations.sh`
2. ✅ Vérifier création schéma: `\dt mobile.*`
3. ✅ (Optionnel) Géocoder adresses: `python geocode_addresses.py`
4. ✅ Développer API REST backend
5. ✅ Développer app mobile

---

**Date création**: 2025-10-23
**Auteur**: Data Team
**Version**: 1.0.0

# 🌍 Script de Géocodage - Adresses Clients EBP

Script Python pour géocoder automatiquement les adresses clients via l'API Nominatim (OpenStreetMap).

---

## 📋 Installation

### 1. Installer Python 3 et psycopg2

```bash
# Ubuntu/Debian
sudo apt-get update
sudo apt-get install python3 python3-pip python3-psycopg2

# Ou via pip
pip3 install psycopg2-binary
```

### 2. Vérifier l'installation

```bash
python3 -c "import psycopg2; print('✅ psycopg2 installé')"
```

---

## 🚀 Utilisation

### Géocoder les 10 premiers clients (TEST)

```bash
cd /home/tinkerbell/Desktop/Code/DataWarehouse_EBP
python3 scripts/geocode_addresses.py
```

### Géocoder N premiers clients

```bash
# 100 premiers clients (~2 minutes)
python3 scripts/geocode_addresses.py --limit 100

# 50 clients
python3 scripts/geocode_addresses.py --limit 50
```

### Géocoder TOUS les clients (783 clients)

```bash
# ⚠️  Prendra ~15 minutes (rate limit 1 req/sec)
python3 scripts/geocode_addresses.py --all
```

### Géocoder un client spécifique

```bash
python3 scripts/geocode_addresses.py --customer-id PULSER
```

### Voir toutes les options

```bash
python3 scripts/geocode_addresses.py --help
```

---

## ⚙️ Configuration

### Modifier la base de données

Éditer `scripts/geocode_addresses.py` :

```python
DB_CONFIG = {
    'host': 'localhost',
    'port': 5432,
    'user': 'postgres',
    'password': 'postgres',  # ← Modifier si nécessaire
    'database': 'ebp_db'
}
```

---

## ⚠️ Points d'Attention

### Rate Limiting Nominatim

L'API Nominatim (gratuite) impose:
- **1 requête par seconde maximum**
- User-Agent obligatoire (déjà configuré)

**Conséquence**:
- 100 clients = ~2 minutes
- 783 clients = ~15 minutes

### Qualité du Géocodage

Le script calcule un **score de qualité** (0.0 - 1.0):
- **1.0** = Adresse exacte trouvée
- **0.5-0.9** = Ville/code postal trouvé
- **< 0.5** = Résultat imprécis

Consulter les logs dans `mobile.geocoding_log`:
```sql
SELECT * FROM mobile.geocoding_log
WHERE quality_score < 0.7
ORDER BY geocoded_at DESC;
```

### Adresses Problématiques

Certaines adresses peuvent échouer:
- Adresses incomplètes
- Codes postaux invalides
- Villes mal orthographiées
- Adresses étrangères (hors France)

**Solution**: Corriger manuellement dans EBP ou via SQL:
```sql
CALL mobile.update_customer_gps(
    'CUSTOMER_ID',
    48.8566,  -- latitude
    2.3522,   -- longitude
    'manual',
    1.0
);
```

---

## 📊 Vérifications

### Voir clients à géocoder

```bash
psql -d ebp_db -c "SELECT * FROM mobile.v_customers_to_geocode LIMIT 10;"
```

### Statistiques GPS

```sql
-- Clients avec GPS
SELECT
    COUNT(*) as total,
    COUNT("MainDeliveryAddress_Latitude") as with_gps,
    ROUND((COUNT("MainDeliveryAddress_Latitude")::DECIMAL / COUNT(*)) * 100, 2) as pct
FROM public."Customer"
WHERE "ActiveState" = 1;

-- Historique géocodage
SELECT
    COUNT(*) as total_geocoded,
    AVG(quality_score) as avg_quality,
    geocoding_provider,
    DATE(geocoded_at) as date
FROM mobile.geocoding_log
GROUP BY geocoding_provider, DATE(geocoded_at)
ORDER BY date DESC;
```

### Voir clients géocodés aujourd'hui

```sql
SELECT
    c."Id",
    c."Name",
    c."MainDeliveryAddress_City",
    l.latitude,
    l.longitude,
    l.quality_score,
    l.geocoded_at
FROM mobile.geocoding_log l
JOIN public."Customer" c ON l.entity_id = c."Id"
WHERE l.entity_type = 'Customer'
  AND DATE(l.geocoded_at) = CURRENT_DATE
ORDER BY l.geocoded_at DESC;
```

---

## 🔄 Alternatives API Géocodage

### Google Maps Geocoding API (PAYANT)

**Avantages**:
- Très précis
- Pas de rate limit strict
- Support international

**Coût**: ~5$/1000 requêtes

**Configuration**:
```python
# Modifier geocode_address() dans le script
import googlemaps
gmaps = googlemaps.Client(key='YOUR_API_KEY')
result = gmaps.geocode(full_address)
```

### HERE Geocoding API (FREEMIUM)

**Avantages**:
- 250k requêtes/mois gratuites
- Très bon pour Europe

**URL**: https://developer.here.com

### Photon (SELF-HOSTED)

**Avantages**:
- Gratuit, illimité
- Basé sur OpenStreetMap
- Peut être installé localement

**URL**: https://photon.komoot.io

---

## 🐛 Dépannage

### Erreur: `psycopg2` not found

```bash
pip3 install psycopg2-binary
```

### Erreur: Rate limit exceeded

Nominatim a bloqué votre IP (trop de requêtes).

**Solution**:
- Attendre 24h
- Utiliser un VPN
- Passer à API payante (Google Maps)

### Erreur: Connection refused

PostgreSQL n'est pas démarré ou mauvais credentials.

**Solution**:
```bash
# Vérifier PostgreSQL
sudo systemctl status postgresql

# Tester connexion
psql -h localhost -U postgres -d ebp_db -c "SELECT 1;"
```

### Adresse non trouvée

Nominatim n'a pas trouvé l'adresse.

**Solution**:
- Vérifier l'adresse dans EBP (orthographe)
- Géocoder manuellement:
  ```sql
  -- Trouver coordonnées sur Google Maps, puis:
  CALL mobile.update_customer_gps('CUSTOMER_ID', 48.8566, 2.3522, 'manual', 1.0);
  ```

---

## 📈 Exemple Output

```
🌍 Démarrage géocodage adresses clients EBP
============================================================
✅ Connecté à ebp_db

📍 Géocodage des 10 premiers clients
📊 10 clients à traiter

⚠️  Rate limit: 1 requête/seconde (Nominatim policy)
⏱️  Temps estimé: ~11 secondes (~0.2 minutes)

============================================================
🚀 Démarrage géocodage...

[1/10] 1'Pulser  -  Mr Fabien Ros (Le BOURGET du LAC Cedex)
    📍 Savoie Technolac, BP 360, 73372, Le BOURGET du LAC Cedex, France
    ✅ GPS: 45.644856, 5.862804 (qualité: 0.87)

[2/10] 2 I Process                (SEYSSINET Cedex)
    📍 12, Av Pierre de Coubertin, Z.I. Perceval, 38174, SEYSSINET Cedex, France
    ✅ GPS: 45.159733, 5.690078 (qualité: 0.92)

...

============================================================
📊 RÉSUMÉ
============================================================
✅ Succès:    9/10 (90.0%)
❌ Échecs:    1/10 (10.0%)

📊 Clients actifs avec GPS: 9/1338 (0.67%)
📍 Clients restant à géocoder: 774

✅ Géocodage terminé!
```

---

## 🎯 Workflow Recommandé

### Phase 1: Test (10 clients)

```bash
python3 scripts/geocode_addresses.py --limit 10
```

Vérifier résultats:
```sql
SELECT * FROM mobile.geocoding_log ORDER BY geocoded_at DESC LIMIT 10;
```

### Phase 2: Batch moyen (100 clients)

```bash
python3 scripts/geocode_addresses.py --limit 100
```

### Phase 3: Tous les clients (background)

```bash
# Lancer en arrière-plan
nohup python3 scripts/geocode_addresses.py --all > geocoding.log 2>&1 &

# Suivre progression
tail -f geocoding.log
```

### Phase 4: Vérification qualité

```sql
-- Clients avec mauvais score (< 0.7)
SELECT
    c."Id",
    c."Name",
    c."MainDeliveryAddress_City",
    l.quality_score
FROM mobile.geocoding_log l
JOIN public."Customer" c ON l.entity_id = c."Id"
WHERE l.quality_score < 0.7
ORDER BY l.quality_score ASC;
```

Corriger manuellement les adresses problématiques.

---

## ✅ Checklist

- [ ] psycopg2 installé (`pip3 install psycopg2-binary`)
- [ ] Test 10 clients OK
- [ ] Vérification logs géocodage
- [ ] Lancement batch complet (--all)
- [ ] Vérification qualité (< 0.7)
- [ ] Corrections manuelles si nécessaire

---

**Date**: 2025-10-23
**API utilisée**: Nominatim (OpenStreetMap)
**Rate limit**: 1 req/sec
**Clients à géocoder**: 783

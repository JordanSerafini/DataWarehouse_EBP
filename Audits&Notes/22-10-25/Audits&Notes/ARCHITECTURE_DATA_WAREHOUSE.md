# ARCHITECTURE DATA WAREHOUSE EBP
## Approche Bronze → Silver → Gold (Medallion Architecture)

Date d'analyse: 23/10/2025

---

## 1. VUE D'ENSEMBLE

### Objectifs du Data Warehouse
1. **Analytics & BI**: Dashboards, rapports, KPIs métier
2. **Machine Learning**: Prédictions, détection d'anomalies
3. **Historisation**: Conservation données long terme
4. **Performance**: Séparation OLTP/OLAP

### Architecture cible

```
┌─────────────────────────────────────────────────────────────┐
│                     COUCHE BRONZE                           │
│              (Raw Data - Données brutes)                     │
│                      PostgreSQL                              │
└────────────┬────────────────────────────────────────────────┘
             │
             │ ETL/ELT (dbt, Apache Airflow, ou custom)
             ▼
┌─────────────────────────────────────────────────────────────┐
│                     COUCHE SILVER                            │
│       (Cleaned & Enriched - Données nettoyées)               │
│              PostgreSQL ou DataWarehouse                     │
└────────────┬────────────────────────────────────────────────┘
             │
             │ Aggregation & Business Logic
             ▼
┌─────────────────────────────────────────────────────────────┐
│                      COUCHE GOLD                             │
│          (Analytics Ready - Données agrégées)                │
│                   Star Schema / OLAP                         │
└────────────┬────────────────────────────────────────────────┘
             │
             ├─────────► Dashboards BI (Metabase, Superset, Power BI)
             ├─────────► ML Models (Python, scikit-learn, TensorFlow)
             └─────────► API Analytics
```

---

## 2. COUCHE BRONZE - DONNÉES BRUTES

### 2.1 Stratégie d'ingestion

**Source**: Base EBP PostgreSQL (ebp_db) - 319 tables, 670K lignes

**Méthode d'ingestion**:
- **CDC (Change Data Capture)**: Debezium + Kafka (recommandé)
- **Batch ETL**: Scripts Python/Node.js quotidiens (alternatif)
- **Log shipping**: pg_logical_replication (PostgreSQL natif)

### 2.2 Tables Bronze prioritaires

#### Tier 1 - Très haute priorité (15 tables)

**Ventes** (7 tables):
```
bronze_sale_document (23 837 lignes, 538 colonnes)
bronze_sale_document_line (112 684 lignes, 336 colonnes)
bronze_sale_commitment (15 924 lignes)
bronze_sale_settlement (12 962 lignes)
bronze_deal (1 493 lignes)
bronze_deal_sale_document (9 882 lignes)
bronze_deal_sale_document_line (29 551 lignes)
```

**Clients** (2 tables):
```
bronze_customer (1 338 lignes, 204 colonnes)
bronze_contact (2 615 lignes)
```

**Achats** (3 tables):
```
bronze_purchase_document (12 477 lignes, 508 colonnes)
bronze_purchase_document_line (38 887 lignes, 281 colonnes)
bronze_supplier (268 lignes)
```

**Stock & Produits** (3 tables):
```
bronze_item (3 837 lignes, 245 colonnes)
bronze_stock_movement (12 158 lignes)
bronze_stock_item (6 831 lignes)
```

#### Tier 2 - Haute priorité (10 tables)

**Interventions**:
```
bronze_schedule_event (11 935 lignes, 280 colonnes)
bronze_activity (44 145 lignes)
bronze_incident (0 lignes actuellement)
```

**Maintenance**:
```
bronze_maintenance_contract (268 lignes)
bronze_customer_product (405 lignes)
```

**Référentiels**:
```
bronze_item_family (51 lignes)
bronze_customer_family (3 lignes)
bronze_supplier_family (0 lignes)
bronze_zipcode (38 893 lignes)
bronze_colleague (31 lignes)
```

#### Tier 3 - Priorité moyenne (Tables support)
- Chantiers, Comptabilité, Analytique
- ~20 tables supplémentaires

### 2.3 Règles Bronze

✅ **Conserver**: Structure originale identique
✅ **Ajouter**: Colonnes techniques
   - `bronze_loaded_at TIMESTAMP`
   - `bronze_source VARCHAR(50)`
   - `bronze_batch_id VARCHAR(100)`
✅ **Format**: Même types de données que source
✅ **Qualité**: Aucune validation (toutes les données)
❌ **Interdit**: Transformation, nettoyage, filtrage

---

## 3. COUCHE SILVER - DONNÉES NETTOYÉES

### 3.1 Transformations Silver

**Objectifs**:
- Nettoyage et validation
- Dénormalisation partielle
- Enrichissement contextuel
- Standardisation formats
- Gestion historique (SCD Type 2)

### 3.2 Tables Silver principales

#### 3.2.1 Dimensions (SCD Type 2)

**silver_dim_customer**
```sql
CREATE TABLE silver_dim_customer (
  customer_key SERIAL PRIMARY KEY,              -- Clé technique
  customer_id VARCHAR(20) NOT NULL,              -- Clé métier (Id EBP)
  customer_name VARCHAR(200),
  customer_type SMALLINT,
  active_state SMALLINT,

  -- Contact principal
  main_contact_name VARCHAR(120),
  main_contact_phone VARCHAR(20),
  main_contact_email VARCHAR(100),

  -- Adresse normalisée
  delivery_address_full TEXT,                    -- Adresse complète concaténée
  delivery_city VARCHAR(35),
  delivery_zipcode VARCHAR(10),
  delivery_latitude DECIMAL(10, 8),
  delivery_longitude DECIMAL(11, 8),
  delivery_country VARCHAR(3),

  invoicing_address_full TEXT,
  invoicing_city VARCHAR(35),
  invoicing_zipcode VARCHAR(10),

  -- Enrichissement
  customer_segment VARCHAR(50),                  -- À calculer: VIP, Standard, Petit
  customer_region VARCHAR(50),                   -- Basé sur département
  is_active BOOLEAN,
  lifetime_value DECIMAL(15, 2),                 -- À calculer

  -- SCD Type 2
  valid_from TIMESTAMP NOT NULL,
  valid_to TIMESTAMP,
  is_current BOOLEAN DEFAULT TRUE,

  -- Audit
  silver_created_at TIMESTAMP DEFAULT NOW(),
  silver_updated_at TIMESTAMP,

  UNIQUE (customer_id, valid_from)
);

CREATE INDEX idx_silver_customer_id ON silver_dim_customer(customer_id);
CREATE INDEX idx_silver_customer_current ON silver_dim_customer(is_current) WHERE is_current = TRUE;
CREATE INDEX idx_silver_customer_segment ON silver_dim_customer(customer_segment);
```

**silver_dim_item** (Produits)
```sql
CREATE TABLE silver_dim_item (
  item_key SERIAL PRIMARY KEY,
  item_id VARCHAR(20) NOT NULL,
  item_reference VARCHAR(40),
  item_name VARCHAR(100),
  item_type SMALLINT,

  -- Classification enrichie
  item_family_id VARCHAR(10),
  item_family_name VARCHAR(100),
  item_subfamily_id VARCHAR(10),
  item_subfamily_name VARCHAR(100),

  -- Pricing (derniers prix connus)
  selling_price_vat_excluded DECIMAL(15, 2),
  selling_price_vat_included DECIMAL(15, 2),
  purchase_price DECIMAL(15, 2),
  margin_rate DECIMAL(5, 2),                     -- Calculé

  -- Flags métier
  is_service BOOLEAN,
  is_stockable BOOLEAN,
  is_active BOOLEAN,

  -- Enrichissement
  item_category VARCHAR(50),                     -- ABC analysis
  avg_monthly_sales DECIMAL(10, 2),              -- À calculer

  -- SCD Type 2
  valid_from TIMESTAMP NOT NULL,
  valid_to TIMESTAMP,
  is_current BOOLEAN DEFAULT TRUE,

  silver_created_at TIMESTAMP DEFAULT NOW(),
  silver_updated_at TIMESTAMP,

  UNIQUE (item_id, valid_from)
);
```

**silver_dim_colleague** (Techniciens)
```sql
CREATE TABLE silver_dim_colleague (
  colleague_key SERIAL PRIMARY KEY,
  colleague_id VARCHAR(20) NOT NULL,
  colleague_name VARCHAR(60),
  colleague_firstname VARCHAR(60),

  -- Contact
  email VARCHAR(100),
  phone VARCHAR(20),
  cell_phone VARCHAR(20),

  -- Métier
  function VARCHAR(40),
  department VARCHAR(40),
  is_field_technician BOOLEAN,                   -- Flag pour app mobile
  specialties TEXT[],                            -- Compétences

  -- Statistiques (pré-calculées)
  avg_interventions_per_month DECIMAL(5, 1),
  avg_ticket_resolution_hours DECIMAL(6, 2),

  active_state SMALLINT,
  is_active BOOLEAN,

  -- SCD Type 2
  valid_from TIMESTAMP NOT NULL,
  valid_to TIMESTAMP,
  is_current BOOLEAN DEFAULT TRUE,

  silver_created_at TIMESTAMP DEFAULT NOW()
);
```

**silver_dim_date** (Dimension temps)
```sql
CREATE TABLE silver_dim_date (
  date_key INTEGER PRIMARY KEY,                  -- Format: YYYYMMDD
  full_date DATE NOT NULL,

  -- Décomposition
  year INTEGER,
  quarter INTEGER,
  month INTEGER,
  month_name VARCHAR(20),
  week INTEGER,
  day_of_month INTEGER,
  day_of_week INTEGER,
  day_name VARCHAR(20),

  -- Flags
  is_weekend BOOLEAN,
  is_holiday BOOLEAN,
  is_working_day BOOLEAN,

  -- Fiscal (si pertinent)
  fiscal_year INTEGER,
  fiscal_quarter INTEGER,
  fiscal_month INTEGER
);

-- Pré-remplir 10 ans de dates
-- Script à exécuter lors de l'initialisation
```

#### 3.2.2 Tables de faits

**silver_fact_sale**
```sql
CREATE TABLE silver_fact_sale (
  sale_fact_key BIGSERIAL PRIMARY KEY,

  -- Clés dimensions
  customer_key INTEGER REFERENCES silver_dim_customer(customer_key),
  item_key INTEGER REFERENCES silver_dim_item(item_key),
  colleague_key INTEGER REFERENCES silver_dim_colleague(colleague_key),
  date_key INTEGER REFERENCES silver_dim_date(date_key),

  -- Clés métier
  document_id VARCHAR(20),
  document_line_id VARCHAR(20),
  document_number VARCHAR(40),

  -- Document info
  document_type SMALLINT,                        -- 1=Devis, 2=Commande, 3=BL, 4=Facture
  document_state SMALLINT,
  document_date DATE,

  -- Métriques
  quantity DECIMAL(15, 4),
  unit_price_vat_excluded DECIMAL(15, 2),
  line_amount_vat_excluded DECIMAL(15, 2),
  vat_amount DECIMAL(15, 2),
  line_amount_vat_included DECIMAL(15, 2),
  discount_rate DECIMAL(5, 2),
  discount_amount DECIMAL(15, 2),

  -- Marges (enrichi)
  cost_price DECIMAL(15, 2),
  margin_amount DECIMAL(15, 2),                  -- Prix vente - Prix achat
  margin_rate DECIMAL(5, 2),                     -- %

  -- Audit
  silver_created_at TIMESTAMP DEFAULT NOW(),

  -- Index
  UNIQUE (document_id, document_line_id)
);

CREATE INDEX idx_silver_fact_sale_customer ON silver_fact_sale(customer_key);
CREATE INDEX idx_silver_fact_sale_item ON silver_fact_sale(item_key);
CREATE INDEX idx_silver_fact_sale_date ON silver_fact_sale(date_key);
CREATE INDEX idx_silver_fact_sale_doc_type ON silver_fact_sale(document_type);
```

**silver_fact_intervention**
```sql
CREATE TABLE silver_fact_intervention (
  intervention_fact_key BIGSERIAL PRIMARY KEY,

  -- Clés dimensions
  customer_key INTEGER REFERENCES silver_dim_customer(customer_key),
  colleague_key INTEGER REFERENCES silver_dim_colleague(colleague_key),
  date_key INTEGER REFERENCES silver_dim_date(date_key),

  -- Clés métier
  schedule_event_id VARCHAR(20),
  incident_id VARCHAR(20),

  -- Intervention info
  event_type SMALLINT,
  event_state SMALLINT,
  priority SMALLINT,

  -- Dates/Durées
  start_date TIMESTAMP,
  end_date TIMESTAMP,
  planned_duration_minutes INTEGER,
  actual_duration_minutes INTEGER,
  response_time_hours DECIMAL(6, 2),             -- Si incident: temps avant intervention

  -- Localisation
  distance_km DECIMAL(8, 2),                     -- Distance depuis dépôt
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),

  -- Métriques qualité
  is_completed_on_time BOOLEAN,
  customer_satisfaction_score SMALLINT,          -- 1-5 si disponible
  has_follow_up BOOLEAN,

  -- Enrichissement
  intervention_category VARCHAR(50),              -- Maintenance, Dépannage, Installation...
  time_slot VARCHAR(20),                         -- Matin, Après-midi, Soir

  silver_created_at TIMESTAMP DEFAULT NOW(),

  UNIQUE (schedule_event_id)
);

CREATE INDEX idx_silver_fact_intervention_customer ON silver_fact_intervention(customer_key);
CREATE INDEX idx_silver_fact_intervention_colleague ON silver_fact_intervention(colleague_key);
CREATE INDEX idx_silver_fact_intervention_date ON silver_fact_intervention(date_key);
```

**silver_fact_stock_movement**
```sql
CREATE TABLE silver_fact_stock_movement (
  stock_movement_key BIGSERIAL PRIMARY KEY,

  -- Dimensions
  item_key INTEGER REFERENCES silver_dim_item(item_key),
  date_key INTEGER REFERENCES silver_dim_date(date_key),

  -- Mouvement
  movement_id VARCHAR(20),
  movement_type SMALLINT,                        -- 1=Entrée, 2=Sortie, 3=Transfert
  movement_date TIMESTAMP,

  quantity DECIMAL(15, 4),
  unit_cost DECIMAL(15, 2),
  total_value DECIMAL(15, 2),

  storehouse_id VARCHAR(20),
  reference_document VARCHAR(40),

  silver_created_at TIMESTAMP DEFAULT NOW()
);
```

### 3.3 Règles de transformation Bronze → Silver

**Nettoyage**:
```python
# Exemple logique de transformation
def transform_customer(bronze_row):
    return {
        'customer_id': bronze_row['Id'],
        'customer_name': clean_text(bronze_row['Name']),
        'customer_type': bronze_row['Type'],

        # Normalisation contact
        'main_contact_name': normalize_name(
            bronze_row['MainInvoicingContact_Name'],
            bronze_row['MainInvoicingContact_FirstName']
        ),
        'main_contact_phone': normalize_phone(
            bronze_row['MainInvoicingContact_Phone']
        ),
        'main_contact_email': normalize_email(
            bronze_row['MainInvoicingContact_Email']
        ),

        # Adresse complète
        'delivery_address_full': concat_address([
            bronze_row['MainDeliveryAddress_Address1'],
            bronze_row['MainDeliveryAddress_Address2'],
            bronze_row['MainDeliveryAddress_Address3'],
            bronze_row['MainDeliveryAddress_Address4']
        ]),

        # Géolocalisation (API Geocoding si absent)
        'delivery_latitude': get_or_geocode_lat(bronze_row),
        'delivery_longitude': get_or_geocode_lng(bronze_row),

        # Enrichissement
        'customer_segment': calculate_segment(bronze_row['Id']),
        'customer_region': extract_region(
            bronze_row['MainDeliveryAddress_ZipCode']
        ),

        'is_active': bronze_row['ActiveState'] == 1,

        'valid_from': datetime.now(),
        'is_current': True
    }
```

**Enrichissements**:
- Géocodage des adresses
- Calcul de métriques agrégées
- Classification ABC (clients, produits)
- Détection segment clients

---

## 4. COUCHE GOLD - ANALYTICS & ML

### 4.1 Tables Gold agrégées

#### 4.1.1 KPIs Commerciaux

**gold_sales_kpi_daily**
```sql
CREATE TABLE gold_sales_kpi_daily (
  date_key INTEGER REFERENCES silver_dim_date(date_key),
  customer_key INTEGER REFERENCES silver_dim_customer(customer_key),
  item_family_id VARCHAR(10),

  -- Volumétrie
  nb_orders INTEGER,
  nb_quotes INTEGER,
  nb_invoices INTEGER,
  nb_unique_customers INTEGER,

  -- Montants
  total_revenue_vat_excluded DECIMAL(15, 2),
  total_revenue_vat_included DECIMAL(15, 2),
  total_margin DECIMAL(15, 2),
  avg_order_value DECIMAL(15, 2),

  -- Marges
  margin_rate DECIMAL(5, 2),

  gold_created_at TIMESTAMP DEFAULT NOW(),
  PRIMARY KEY (date_key, customer_key, item_family_id)
);
```

**gold_customer_lifetime_metrics**
```sql
CREATE TABLE gold_customer_lifetime_metrics (
  customer_key INTEGER PRIMARY KEY REFERENCES silver_dim_customer(customer_key),

  -- Activité
  first_order_date DATE,
  last_order_date DATE,
  days_since_last_order INTEGER,
  customer_age_days INTEGER,

  -- Volumétrie
  total_orders INTEGER,
  total_quotes INTEGER,
  total_invoices INTEGER,

  -- Montants
  lifetime_revenue DECIMAL(15, 2),
  lifetime_margin DECIMAL(15, 2),
  avg_order_value DECIMAL(15, 2),
  max_order_value DECIMAL(15, 2),

  -- Comportement
  avg_days_between_orders DECIMAL(6, 1),
  order_frequency_score INTEGER,                 -- 1-10
  recency_score INTEGER,                         -- 1-10 (RFM)
  monetary_score INTEGER,                        -- 1-10 (RFM)
  rfm_segment VARCHAR(20),                       -- Champions, Loyaux, À risque...

  -- Prédictions
  churn_probability DECIMAL(5, 4),               -- 0-1 (ML model)
  predicted_next_order_date DATE,
  predicted_ltv_12m DECIMAL(15, 2),

  gold_updated_at TIMESTAMP DEFAULT NOW()
);
```

#### 4.1.2 KPIs Interventions

**gold_intervention_kpi_monthly**
```sql
CREATE TABLE gold_intervention_kpi_monthly (
  year_month INTEGER,                            -- Format: YYYYMM
  colleague_key INTEGER REFERENCES silver_dim_colleague(colleague_key),

  -- Volumétrie
  nb_interventions INTEGER,
  nb_tickets_created INTEGER,
  nb_tickets_resolved INTEGER,

  -- Qualité
  avg_response_time_hours DECIMAL(6, 2),
  avg_resolution_time_hours DECIMAL(6, 2),
  pct_completed_on_time DECIMAL(5, 2),
  avg_customer_satisfaction DECIMAL(3, 2),

  -- Efficacité
  total_intervention_hours DECIMAL(8, 1),
  total_travel_km DECIMAL(10, 1),
  avg_interventions_per_day DECIMAL(4, 1),

  gold_created_at TIMESTAMP DEFAULT NOW(),
  PRIMARY KEY (year_month, colleague_key)
);
```

**gold_equipment_failure_analysis**
```sql
CREATE TABLE gold_equipment_failure_analysis (
  item_key INTEGER REFERENCES silver_dim_item(item_key),
  customer_product_id VARCHAR(20),

  -- Installation
  installation_date DATE,
  equipment_age_months INTEGER,

  -- Historique pannes
  nb_incidents INTEGER,
  first_incident_date DATE,
  last_incident_date DATE,
  mtbf_days DECIMAL(8, 1),                       -- Mean Time Between Failures

  -- Coûts
  total_maintenance_cost DECIMAL(15, 2),
  avg_repair_cost DECIMAL(15, 2),

  -- Prédiction
  failure_risk_score DECIMAL(5, 4),              -- ML: probabilité panne 3 mois
  recommended_action VARCHAR(50),                 -- Maintenance, Remplacement...

  gold_updated_at TIMESTAMP DEFAULT NOW(),
  PRIMARY KEY (item_key, customer_product_id)
);
```

#### 4.1.3 Analytics Produits

**gold_product_performance**
```sql
CREATE TABLE gold_product_performance (
  item_key INTEGER PRIMARY KEY REFERENCES silver_dim_item(item_key),

  -- Ventes
  total_qty_sold DECIMAL(15, 2),
  total_revenue DECIMAL(15, 2),
  total_margin DECIMAL(15, 2),
  margin_rate DECIMAL(5, 2),

  -- Classements
  abc_category CHAR(1),                          -- A, B, C
  xyz_category CHAR(1),                          -- Variabilité demande

  -- Stock
  current_stock DECIMAL(15, 2),
  avg_stock_level DECIMAL(15, 2),
  stock_rotation_rate DECIMAL(6, 2),             -- Rotation annuelle
  stockout_days INTEGER,                         -- Jours rupture

  -- Tendances
  sales_trend VARCHAR(20),                       -- Croissance, Stable, Déclin
  yoy_growth_rate DECIMAL(6, 2),                 -- % croissance année

  gold_updated_at TIMESTAMP DEFAULT NOW()
);
```

### 4.2 Vues Gold pour BI

**Vue: Tableau de bord commercial**
```sql
CREATE VIEW gold_commercial_dashboard AS
SELECT
  d.full_date,
  d.month_name,
  c.customer_name,
  c.customer_segment,
  i.item_family_name,
  COUNT(DISTINCT f.document_id) as nb_documents,
  SUM(f.line_amount_vat_excluded) as revenue,
  SUM(f.margin_amount) as margin,
  AVG(f.margin_rate) as avg_margin_rate
FROM silver_fact_sale f
JOIN silver_dim_date d ON f.date_key = d.date_key
JOIN silver_dim_customer c ON f.customer_key = c.customer_key
JOIN silver_dim_item i ON f.item_key = i.item_key
WHERE c.is_current = TRUE
  AND i.is_current = TRUE
  AND d.full_date >= CURRENT_DATE - INTERVAL '12 months'
GROUP BY 1, 2, 3, 4, 5;
```

**Vue: Performance techniciens**
```sql
CREATE VIEW gold_technician_performance AS
SELECT
  c.colleague_name,
  COUNT(*) as nb_interventions,
  AVG(i.actual_duration_minutes) as avg_duration_min,
  SUM(i.distance_km) as total_distance_km,
  AVG(CASE WHEN i.is_completed_on_time THEN 1 ELSE 0 END) * 100 as pct_on_time,
  AVG(i.customer_satisfaction_score) as avg_satisfaction
FROM silver_fact_intervention i
JOIN silver_dim_colleague c ON i.colleague_key = c.colleague_key
JOIN silver_dim_date d ON i.date_key = d.date_key
WHERE d.full_date >= CURRENT_DATE - INTERVAL '3 months'
GROUP BY c.colleague_name;
```

---

## 5. MACHINE LEARNING & ANALYTICS AVANCÉS

### 5.1 Cas d'usage ML

#### 5.1.1 Prédiction Churn Client
**Objectif**: Identifier clients à risque de départ

**Features**:
- Récence dernière commande (days)
- Fréquence commandes (nb/an)
- Montant moyen commande
- Évolution CA (tendance)
- Taux marge moyen
- Nb réclamations
- Nb interventions SAV
- Segment client

**Modèle**: Random Forest / XGBoost
**Target**: churn_90_days (booléen)
**Métrique**: AUC-ROC > 0.80

**Pipeline**:
```python
# Feature engineering
features = [
    'days_since_last_order',
    'avg_order_value',
    'order_frequency_12m',
    'revenue_trend_6m',
    'nb_complaints',
    'avg_satisfaction_score',
    'customer_segment_encoded'
]

# Training
from sklearn.ensemble import RandomForestClassifier
model = RandomForestClassifier(n_estimators=100)
model.fit(X_train, y_train)

# Scoring mensuel
UPDATE gold_customer_lifetime_metrics
SET churn_probability = model.predict_proba(features)[:, 1];
```

#### 5.1.2 Prédiction Défaillance Équipement
**Objectif**: Maintenance prédictive

**Features**:
- Âge équipement (mois)
- Nb pannes historiques
- MTBF (Mean Time Between Failures)
- Type équipement
- Conditions utilisation
- Nb heures fonctionnement
- Historique maintenance

**Modèle**: Survival Analysis / Cox Proportional Hazards
**Target**: failure_next_90_days

#### 5.1.3 Optimisation Tournées Techniciens
**Objectif**: Minimiser temps trajet, maximiser interventions

**Approche**: Vehicle Routing Problem (VRP)
- Algorithme génétique
- Contraintes: horaires, compétences, priorités
- Optimisation: distance totale, temps total

**Librairies**: OR-Tools (Google), OSRM

#### 5.1.4 Détection Anomalies Ventes
**Objectif**: Alertes fraudes, erreurs saisie

**Méthode**: Isolation Forest
**Features**:
- Montant commande vs historique client
- Quantité vs moyenne produit
- Remise vs politique commerciale
- Délai validation commande

**Alertes**: Anomaly score > 0.8

#### 5.1.5 Recommandation Produits
**Objectif**: Cross-sell / Up-sell

**Approche**: Collaborative Filtering
- Association Rules (Apriori)
- Matrix Factorization (ALS)

**Use case**: "Les clients qui ont acheté X ont aussi acheté Y"

### 5.2 KPIs à monitorer (Dashboards)

#### Dashboard Commercial
- **CA du jour/mois/année** (vs objectifs)
- **Nb commandes** (évolution)
- **Panier moyen** (tendance)
- **Taux conversion** devis → commande
- **Top 10 clients** (CA)
- **Top 10 produits** (volume, marge)
- **Répartition CA par région**
- **Pipeline commercial** (devis en cours)

#### Dashboard Interventions
- **Nb interventions du jour/semaine**
- **Taux résolution 1er passage**
- **Temps moyen intervention**
- **Temps moyen réponse** (SLA)
- **Satisfaction client** (NPS)
- **Charge techniciens** (%)
- **Backlog tickets** ouverts
- **Carte géographique** interventions

#### Dashboard Stock
- **Taux rotation** stock
- **Valeur stock** total
- **Nb références** en rupture
- **Stock dormant** (> 6 mois)
- **Couverture stock** (jours)
- **Top produits** à réapprovisionner

#### Dashboard Financier
- **Marge brute** (%)
- **CA par famille** produits
- **Créances clients** (DSO)
- **Dettes fournisseurs** (DPO)
- **Cash flow** prévisionnel

---

## 6. STACK TECHNOLOGIQUE RECOMMANDÉE

### 6.1 Option 1 - Stack Open Source (Budget limité)

**Stockage**:
- Bronze/Silver: PostgreSQL 16+
- Gold: PostgreSQL + Timescale (time-series)

**Orchestration ETL**:
- Apache Airflow (ou Prefect, Dagster)
- dbt (data build tool) pour transformations SQL

**BI / Dashboards**:
- Metabase (facile) ou Apache Superset (avancé)
- Streamlit pour apps custom

**ML**:
- Python: pandas, scikit-learn, XGBoost
- Jupyter Notebooks
- MLflow pour tracking

**Monitoring**:
- Grafana + Prometheus

**Coût**: ~500-1000€/mois (infra cloud)

### 6.2 Option 2 - Stack Cloud (Scalabilité)

**Stockage**:
- Bronze: S3 (Parquet) ou Google Cloud Storage
- Silver/Gold: BigQuery ou Snowflake

**Orchestration**:
- dbt Cloud
- Airbyte (ingestion)
- Airflow ou Prefect Cloud

**BI**:
- Power BI ou Looker Studio

**ML**:
- Google Vertex AI ou AWS SageMaker

**Coût**: ~2000-5000€/mois

### 6.3 Option 3 - Stack Hybride (Recommandé)

**Stockage**:
- Bronze/Silver: PostgreSQL on-premise
- Gold: PostgreSQL + export vers cloud

**ETL**:
- Scripts Python/Node.js custom
- dbt pour transformations

**BI**:
- Metabase (interne)
- Power BI (dirigeants)

**ML**:
- Python local + cloud pour entraînement

**Coût**: ~1000-2000€/mois

---

## 7. PIPELINE ETL - ARCHITECTURE DÉTAILLÉE

### 7.1 Jobs quotidiens (Batch)

**01:00 - Ingestion Bronze**
```bash
# Extraction complète incrémentale
python etl/bronze/extract_sales.py --date yesterday
python etl/bronze/extract_purchases.py --date yesterday
python etl/bronze/extract_stock.py --date yesterday
```

**02:00 - Transformation Silver**
```bash
# dbt transformations
dbt run --models silver.*
dbt test --models silver.*
```

**03:00 - Agrégation Gold**
```bash
dbt run --models gold.*
```

**04:00 - ML Scoring**
```bash
python ml/score_customer_churn.py
python ml/predict_equipment_failure.py
```

**05:00 - Refresh dashboards**
```bash
# Pré-calcul métriques lourdes
python dashboards/refresh_materialized_views.py
```

### 7.2 Jobs temps réel (Streaming - optionnel)

**CDC avec Debezium**:
```yaml
# Kafka Connect config
connector: debezium-postgres
tables:
  - SaleDocument
  - SaleDocumentLine
  - ScheduleEvent
  - Incident
output: Kafka topic → Bronze PostgreSQL
latency: < 5 secondes
```

---

## 8. DATA QUALITY & GOUVERNANCE

### 8.1 Règles de qualité

**Bronze**:
- ✅ Toutes données acceptées
- ✅ Logs d'erreurs ingestion

**Silver**:
- ✅ NOT NULL sur clés métier
- ✅ CHECK contraintes sur types
- ✅ Validation emails, téléphones
- ✅ Dédoublonnage

**Gold**:
- ✅ Tests cohérence (totaux)
- ✅ Alertes sur variations > 20%

### 8.2 Monitoring & Alertes

**Métriques à suivre**:
- Latence ingestion (< 1h pour batch)
- Taux échec jobs ETL (< 1%)
- Volumétrie quotidienne (alertes anomalies)
- Qualité données (% nulls, duplicates)

**Alertes**:
- Slack/Email si job failed
- Dashboard temps réel freshness data

---

## 9. ROADMAP IMPLÉMENTATION

### Phase 1 - Fondations (2-3 mois)
✅ Setup infrastructure (PostgreSQL, Airflow)
✅ Ingestion Bronze (15 tables prioritaires)
✅ Création dimensions Silver (Customer, Item, Colleague, Date)
✅ Dashboard BI basique (ventes, interventions)

### Phase 2 - Enrichissement (2 mois)
✅ Toutes tables Silver + faits
✅ Agrégations Gold quotidiennes
✅ Dashboards avancés (10+ KPIs)
✅ Tests qualité données

### Phase 3 - ML (3 mois)
✅ Feature engineering
✅ Modèle churn client
✅ Modèle défaillance équipement
✅ Détection anomalies

### Phase 4 - Optimisation (continu)
✅ Performance queries
✅ Partitionnement tables
✅ Archivage données anciennes
✅ Automatisation complète

**Total**: 9-12 mois pour data warehouse complet

---

## 10. MÉTRIQUES DE SUCCÈS

### KPIs Techniques
- ✅ Latence ingestion: < 1h (batch) ou < 1min (streaming)
- ✅ Disponibilité: > 99.5%
- ✅ Freshness données: < 24h
- ✅ Taux erreur ETL: < 0.1%

### KPIs Métier
- ✅ Adoption dashboards: > 80% utilisateurs
- ✅ Temps analyse réduit: -50%
- ✅ Décisions data-driven: +30%
- ✅ ROI prédictions ML: mesurable (ex: -15% churn)

---

## 11. COÛTS ESTIMÉS

### Infrastructure (par mois)
- PostgreSQL (4 vCPU, 16GB RAM): 150€
- Storage (1TB): 50€
- Airflow (2 vCPU, 8GB): 80€
- Metabase (2 vCPU, 4GB): 50€
- Backups: 30€

**Total infra**: ~360€/mois

### Développement (one-time)
- ETL Bronze/Silver: 20-30 jours x 500€ = 10 000-15 000€
- Gold + Dashboards: 15-20 jours x 500€ = 7 500-10 000€
- ML models: 20-30 jours x 600€ = 12 000-18 000€

**Total dev**: 30 000-45 000€

### Maintenance (par mois)
- Ops/Support: 5-10 jours/mois x 500€ = 2 500-5 000€

---

## 12. CONCLUSION

### Forces de l'architecture proposée
✅ Scalable (Bronze → Silver → Gold)
✅ Flexible (ajout sources facile)
✅ Performant (agrégations pré-calculées)
✅ Traçable (historisation SCD Type 2)
✅ ML-ready (features clean dans Silver)

### Prochaines étapes
1. ✅ Valider périmètre fonctionnel avec métier
2. ✅ Choisir stack technologique (Option 1, 2 ou 3)
3. ✅ POC sur 1-2 tables (2 semaines)
4. ✅ Développement Phase 1 (3 mois)
5. ✅ Formation utilisateurs
6. ✅ Déploiement progressif

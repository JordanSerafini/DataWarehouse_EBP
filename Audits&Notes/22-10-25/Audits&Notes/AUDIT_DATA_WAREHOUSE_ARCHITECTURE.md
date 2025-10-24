# ARCHITECTURE DATA WAREHOUSE - BRONZE/SILVER/GOLD
## EBP - Analytics, KPIs & Machine Learning

Date d'analyse: 23/10/2025

---

## 1. CONTEXTE & OBJECTIFS

### Vision Data-Driven
Construire un entrepôt de données moderne permettant:
- **Analyse décisionnelle** : KPIs métier en temps réel
- **Prédiction** : ML pour anticiper besoins, pannes, churn
- **Détection d'anomalies** : Alertes automatiques
- **Reporting avancé** : Dashboards exécutifs et opérationnels
- **Data Science** : Exploration et modélisation

### Architecture Medallion (Bronze → Silver → Gold)

```
┌─────────────────────────────────────────────────────────────┐
│                    SOURCES (EBP PostgreSQL)                  │
│                     670 349 lignes / 319 tables              │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│ BRONZE LAYER - Raw Data Lake                                │
│ • Copie brute des données sources                           │
│ • Historisation complète (SCD Type 2)                       │
│ • Format: Parquet/Delta Lake                                │
│ • Rétention: Infinie                                        │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│ SILVER LAYER - Cleaned & Conformed                          │
│ • Nettoyage et validation                                   │
│ • Dénormalisation partielle                                 │
│ • Enrichissement (géolocalisation, météo, etc.)            │
│ • Dimensions & Faits conformes                              │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│ GOLD LAYER - Business Aggregates                            │
│ • Tables métier agrégées                                    │
│ • KPIs pré-calculés                                         │
│ • Modèles ML (scoring, prédictions)                         │
│ • Cubes OLAP                                                │
└─────────────────────────────────────────────────────────────┘
                         │
                         ▼
         ┌───────────────┴───────────────┐
         ▼                               ▼
┌──────────────────┐          ┌──────────────────┐
│  BI & Reporting  │          │  ML & Analytics  │
│  • Power BI      │          │  • Python/R      │
│  • Tableau       │          │  • Jupyter       │
│  • Metabase      │          │  • MLflow        │
└──────────────────┘          └──────────────────┘
```

---

## 2. BRONZE LAYER - RAW DATA LAKE

### 2.1 Principes

**Objectif**: Copie conforme et historisée de toutes les données sources
- Format: **Parquet** (compression Snappy) ou **Delta Lake**
- Partitionnement: Par date d'ingestion + table
- Schéma: Identique à la source + métadonnées
- Fréquence: Temps réel (CDC) ou batch horaire

### 2.2 Tables Bronze prioritaires (50 tables sur 319)

#### Domaine VENTES (18 tables)
```
bronze.sale_document              (23 837 lignes)   ⭐⭐⭐
bronze.sale_document_line         (112 684 lignes) ⭐⭐⭐
bronze.sale_document_ex           (23 837 lignes)  ⭐⭐
bronze.sale_commitment            (15 924 lignes)  ⭐⭐
bronze.sale_settlement            (12 962 lignes)  ⭐⭐
bronze.sale_settlement_commitment (15 516 lignes)  ⭐⭐
bronze.deal                       (1 493 lignes)   ⭐⭐
bronze.deal_sale_document         (9 882 lignes)   ⭐⭐
bronze.deal_sale_document_line    (29 551 lignes)  ⭐⭐
bronze.deal_item                  (6 428 lignes)   ⭐
bronze.customer                   (1 338 lignes)   ⭐⭐⭐
bronze.customer_family            (3 lignes)       ⭐
bronze.customer_product           (405 lignes)     ⭐⭐
```

#### Domaine ACHATS (12 tables)
```
bronze.purchase_document          (12 477 lignes)  ⭐⭐⭐
bronze.purchase_document_line     (38 887 lignes)  ⭐⭐⭐
bronze.purchase_document_ex       (12 477 lignes)  ⭐⭐
bronze.purchase_commitment        (8 603 lignes)   ⭐⭐
bronze.purchase_settlement        (5 183 lignes)   ⭐⭐
bronze.supplier                   (268 lignes)     ⭐⭐
bronze.supplier_item              (5 007 lignes)   ⭐⭐
```

#### Domaine STOCK (10 tables)
```
bronze.item                       (3 837 lignes)   ⭐⭐⭐
bronze.item_family                (51 lignes)      ⭐⭐
bronze.item_account               (72 428 lignes)  ⭐
bronze.stock_item                 (6 831 lignes)   ⭐⭐
bronze.stock_movement             (12 158 lignes)  ⭐⭐⭐
bronze.stock_document             (245 lignes)     ⭐⭐
bronze.stock_document_line        (3 163 lignes)   ⭐⭐
```

#### Domaine PLANIFICATION & INTERVENTIONS (6 tables)
```
bronze.schedule_event             (11 935 lignes)  ⭐⭐⭐
bronze.activity                   (44 145 lignes)  ⭐⭐⭐
bronze.incident                   (0 lignes)       ⭐⭐⭐
bronze.maintenance_contract       (268 lignes)     ⭐⭐
bronze.construction_site          (272 lignes)     ⭐⭐
```

#### Domaine RÉFÉRENTIELS (4 tables)
```
bronze.colleague                  (31 lignes)      ⭐⭐
bronze.contact                    (2 615 lignes)   ⭐⭐
bronze.zipcode                    (38 893 lignes)  ⭐
bronze.country                    (247 lignes)     ⭐
```

### 2.3 Métadonnées Bronze

Chaque table Bronze contient:
```sql
-- Colonnes métier (toutes colonnes source)
...

-- Métadonnées techniques
_bronze_ingestion_timestamp    TIMESTAMP
_bronze_source_system          VARCHAR(50)    -- 'EBP_PG'
_bronze_source_table           VARCHAR(100)
_bronze_file_name              VARCHAR(255)
_bronze_record_hash            VARCHAR(64)    -- MD5 de la ligne
_bronze_is_deleted             BOOLEAN
_bronze_valid_from             TIMESTAMP
_bronze_valid_to               TIMESTAMP      -- NULL si current
```

### 2.4 Stratégie d'ingestion Bronze

**Change Data Capture (CDC)** recommandé:
- **PostgreSQL Logical Replication** avec **Debezium**
- Capture INSERT, UPDATE, DELETE en temps réel
- Publication sur **Kafka** topics
- Consommation par **Spark Streaming** ou **Flink**

**Alternative Batch**:
```python
# Ingestion horaire via timestamp
SELECT * FROM "SaleDocument"
WHERE "sysModifiedDate" > '{last_ingestion_timestamp}'
   OR "sysCreatedDate" > '{last_ingestion_timestamp}'
```

---

## 3. SILVER LAYER - CLEANED & CONFORMED

### 3.1 Principes

**Objectif**: Données nettoyées, validées, enrichies
- Dénormalisation pour performance
- Gestion des valeurs nulles
- Normalisation des formats (dates, montants, téléphones)
- Enrichissement externe (géocodage, météo, indices économiques)
- Schéma en étoile (Star Schema) ou flocon (Snowflake Schema)

### 3.2 Modèle dimensionnel Silver

#### DIMENSIONS (Tables de référence)

```sql
-- DIM_DATE (table générée)
silver.dim_date
├── date_id (PK)                    -- YYYYMMDD
├── date_value                      -- 2025-10-23
├── year, quarter, month, week
├── day_of_week, day_name
├── is_weekend, is_holiday
├── fiscal_year, fiscal_quarter
└── season

-- DIM_CUSTOMER (dénormalisée)
silver.dim_customer
├── customer_key (PK surrogate)     -- Clé technique
├── customer_id                     -- Id métier EBP
├── name, type
├── family_name, subfamily_name     -- Dénormalisé
├── main_contact_name, phone, email
├── billing_address_full           -- Concaténé
├── billing_city, billing_zipcode
├── billing_country
├── delivery_address_full
├── delivery_city, delivery_zipcode
├── delivery_latitude, delivery_longitude
├── segment                         -- A, B, C (calculé)
├── lifetime_value                  -- Calculé
├── is_active
├── created_date, first_order_date
├── valid_from, valid_to           -- SCD Type 2
└── is_current

-- DIM_PRODUCT (dénormalisée)
silver.dim_product
├── product_key (PK)
├── product_id
├── name, reference
├── family_name, subfamily_name    -- Dénormalisé
├── category_l1, category_l2, category_l3
├── type, unit
├── cost_price, selling_price
├── margin_percent
├── is_active
├── valid_from, valid_to
└── is_current

-- DIM_SUPPLIER
silver.dim_supplier
├── supplier_key (PK)
├── supplier_id
├── name, type
├── family_name
├── contact_name, phone, email
├── address_full, city, country
├── payment_terms
├── rating                         -- A, B, C
├── is_active
└── valid_from, valid_to, is_current

-- DIM_COLLEAGUE (Technicien/Commercial)
silver.dim_colleague
├── colleague_key (PK)
├── colleague_id
├── name, first_name
├── job_title, department
├── email, phone
├── hire_date, termination_date
├── is_active
├── team_name
└── manager_colleague_key

-- DIM_LOCATION (Géographie)
silver.dim_location
├── location_key (PK)
├── zipcode, city, state
├── country_code, country_name
├── latitude, longitude
├── region, department
├── population, density
└── urban_rural_flag

-- DIM_TIME (Heures pour interventions)
silver.dim_time
├── time_key (PK)                  -- HHMMSS
├── hour, minute
├── time_of_day                    -- Morning, Afternoon, Evening
└── business_hours_flag
```

#### FAITS (Tables de mesures)

```sql
-- FACT_SALES (Ventes)
silver.fact_sales
├── sale_key (PK)
├── date_key (FK → dim_date)
├── customer_key (FK → dim_customer)
├── product_key (FK → dim_product)
├── colleague_key (FK → dim_colleague)  -- Commercial
├── document_type                   -- Quote, Order, Invoice
├── document_number
├── line_number
├── quantity
├── unit_price_excl_tax
├── discount_amount
├── net_amount_excl_tax
├── tax_amount
├── net_amount_incl_tax
├── cost_amount
├── margin_amount
├── margin_percent
├── is_paid
├── payment_date_key
└── invoice_date_key

-- FACT_PURCHASES (Achats)
silver.fact_purchases
├── purchase_key (PK)
├── date_key (FK)
├── supplier_key (FK → dim_supplier)
├── product_key (FK → dim_product)
├── document_type
├── document_number, line_number
├── quantity
├── unit_price_excl_tax
├── discount_amount
├── net_amount_excl_tax
├── tax_amount
├── net_amount_incl_tax
├── is_paid
└── payment_date_key

-- FACT_INVENTORY (Stock)
silver.fact_inventory
├── inventory_key (PK)
├── date_key (FK)
├── product_key (FK → dim_product)
├── warehouse_key (FK → dim_warehouse)
├── quantity_on_hand
├── quantity_reserved
├── quantity_available
├── reorder_point
├── stock_value
└── days_of_supply

-- FACT_INTERVENTIONS (Terrain)
silver.fact_interventions
├── intervention_key (PK)
├── schedule_date_key (FK → dim_date)
├── start_time_key (FK → dim_time)
├── end_time_key (FK → dim_time)
├── customer_key (FK → dim_customer)
├── location_key (FK → dim_location)
├── colleague_key (FK → dim_colleague)  -- Technicien
├── product_key (FK → dim_product)      -- Équipement
├── intervention_type               -- Maintenance, Repair, Install
├── priority                        -- 1-5
├── state                           -- Scheduled, InProgress, Done, Cancelled
├── scheduled_duration_minutes
├── actual_duration_minutes
├── distance_km                     -- Calculé
├── is_first_call_resolution
├── customer_satisfaction_score     -- 1-5
├── resolution_notes
└── billable_amount

-- FACT_INCIDENTS (Tickets)
silver.fact_incidents
├── incident_key (PK)
├── creation_date_key (FK)
├── resolution_date_key (FK)
├── customer_key (FK)
├── product_key (FK)
├── assigned_colleague_key (FK)
├── incident_type
├── priority, severity
├── state
├── time_to_first_response_hours
├── time_to_resolution_hours
├── sla_met_flag
├── reopened_count
└── resolution_category

-- FACT_CUSTOMER_ACTIVITY (Interactions)
silver.fact_customer_activity
├── activity_key (PK)
├── date_key (FK)
├── customer_key (FK)
├── colleague_key (FK)
├── activity_type                  -- Call, Email, Visit, Quote, Order
├── duration_minutes
├── outcome                        -- Success, Failed, Pending
└── notes_summary
```

### 3.3 Transformations Silver

#### Nettoyage et validation
```python
# Exemple: Nettoyage téléphones
def clean_phone(phone_str):
    if not phone_str:
        return None
    # Supprimer espaces, points, tirets
    cleaned = re.sub(r'[^\d+]', '', phone_str)
    # Format international FR
    if cleaned.startswith('0'):
        cleaned = '+33' + cleaned[1:]
    return cleaned

# Validation emails
def validate_email(email_str):
    pattern = r'^[\w\.-]+@[\w\.-]+\.\w+$'
    return bool(re.match(pattern, email_str))

# Normalisation montants
def normalize_amount(amount, currency='EUR'):
    # Convertir tout en EUR
    # Gérer les valeurs nulles, négatives
    return round(float(amount or 0), 2)
```

#### Enrichissement géographique
```python
# Géocodage adresses
def geocode_address(address, city, zipcode):
    # API Nominatim, Google Maps, etc.
    coords = geocoding_service.geocode(
        f"{address}, {zipcode} {city}, France"
    )
    return coords['latitude'], coords['longitude']

# Distance entre 2 points
def calculate_distance(lat1, lon1, lat2, lon2):
    # Formule de Haversine
    return haversine_distance(lat1, lon1, lat2, lon2)
```

#### Enrichissement temporel
```python
# Jours fériés français
def is_french_holiday(date_value):
    # Bibliothèque workalendar
    cal = France()
    return cal.is_holiday(date_value)

# Météo historique (pour corrélations)
def get_weather_data(date, location):
    # API météo historique
    return weather_api.get_historical(date, location)
```

---

## 4. GOLD LAYER - BUSINESS AGGREGATES & KPIs

### 4.1 Principes

**Objectif**: Tables métier pré-agrégées pour dashboards
- Calculs complexes pré-exécutés
- Performance maximale pour BI
- Actualisés quotidiennement (ou temps réel)

### 4.2 Tables Gold - KPIs Commerciaux

```sql
-- GOLD_SALES_DAILY_KPI
gold.sales_daily_kpi
├── date_id (PK)
├── total_orders_count
├── total_revenue_excl_tax
├── total_revenue_incl_tax
├── total_cost
├── total_margin
├── margin_percent
├── average_order_value
├── new_customers_count
├── returning_customers_count
├── products_sold_count
├── avg_items_per_order
└── conversion_rate

-- GOLD_SALES_BY_CUSTOMER
gold.sales_by_customer
├── customer_key (PK)
├── period_start_date, period_end_date
├── total_orders
├── total_revenue
├── total_margin
├── average_order_value
├── days_since_last_order
├── rfm_recency                    -- 1-5
├── rfm_frequency                  -- 1-5
├── rfm_monetary                   -- 1-5
├── rfm_score                      -- Concatené "555"
├── customer_segment               -- VIP, Regular, At Risk, Lost
├── lifetime_value
├── churn_probability              -- ML model score
└── next_order_prediction_days     -- ML model

-- GOLD_SALES_BY_PRODUCT
gold.sales_by_product
├── product_key (PK)
├── period_start_date, period_end_date
├── total_quantity_sold
├── total_revenue
├── total_margin
├── units_per_order_avg
├── sell_through_rate
├── stock_turnover_ratio
├── abc_classification             -- A, B, C
└── forecast_next_30_days          -- ML model

-- GOLD_SALES_BY_REGION
gold.sales_by_region
├── location_key (PK)
├── period
├── total_customers
├── total_orders
├── total_revenue
├── revenue_per_customer
├── market_penetration_rate
└── growth_rate_vs_previous_period
```

### 4.3 Tables Gold - KPIs Opérationnels

```sql
-- GOLD_INTERVENTIONS_DAILY_KPI
gold.interventions_daily_kpi
├── date_id (PK)
├── total_interventions_count
├── interventions_completed_count
├── interventions_cancelled_count
├── avg_duration_minutes
├── first_call_resolution_rate
├── avg_customer_satisfaction
├── avg_distance_km
├── total_billable_amount
├── utilization_rate               -- % temps techniciens
└── sla_compliance_rate

-- GOLD_COLLEAGUE_PERFORMANCE
gold.colleague_performance
├── colleague_key (PK)
├── period_start, period_end
├── interventions_count
├── interventions_completed_count
├── avg_intervention_duration
├── total_distance_km
├── first_call_resolution_rate
├── avg_customer_satisfaction
├── revenue_generated
├── utilization_rate
└── efficiency_score               -- Calculé

-- GOLD_INCIDENTS_FUNNEL
gold.incidents_funnel
├── date_id (PK)
├── new_incidents_count
├── in_progress_incidents_count
├── resolved_incidents_count
├── reopened_incidents_count
├── avg_time_to_first_response_hours
├── avg_time_to_resolution_hours
├── sla_met_count
├── sla_missed_count
├── backlog_count
└── escalation_rate

-- GOLD_CUSTOMER_HEALTH_SCORE
gold.customer_health_score
├── customer_key (PK)
├── calculated_date
├── health_score                   -- 0-100
├── engagement_score               -- 0-100
├── satisfaction_score             -- 0-100
├── payment_score                  -- 0-100 (respect délais)
├── churn_risk_level              -- Low, Medium, High
├── recommended_action            -- Contact, Upsell, Monitor, Churn Prevention
└── next_review_date
```

### 4.4 Tables Gold - Stock & Achats

```sql
-- GOLD_INVENTORY_SNAPSHOT_DAILY
gold.inventory_snapshot_daily
├── date_id (PK)
├── product_key (PK)
├── warehouse_key (PK)
├── quantity_on_hand
├── quantity_reserved
├── quantity_available
├── reorder_point
├── stock_value
├── days_of_supply
├── stock_out_risk_level          -- Low, Medium, High
└── reorder_recommendation        -- Qty to order

-- GOLD_SUPPLIER_PERFORMANCE
gold.supplier_performance
├── supplier_key (PK)
├── period_start, period_end
├── total_orders_count
├── total_amount
├── on_time_delivery_rate
├── quality_defect_rate
├── avg_lead_time_days
├── price_variance_percent        -- vs market
├── payment_terms_compliance
└── supplier_score                -- 0-100
```

---

## 5. MACHINE LEARNING & ANALYTICS AVANCÉS

### 5.1 Cas d'usage ML prioritaires

#### 1. Prédiction de Churn Client
**Objectif**: Identifier clients à risque de départ

**Features**:
- RFM (Recency, Frequency, Monetary)
- Days since last order
- Trend revenue (montant, hausse/baisse)
- Number of incidents
- Satisfaction scores
- Payment delays
- Interaction frequency

**Model**: Random Forest ou XGBoost
**Target**: Binary (churn dans 90 jours: oui/non)

**Table résultat**:
```sql
gold.ml_customer_churn_prediction
├── customer_key (PK)
├── prediction_date
├── churn_probability             -- 0.0 - 1.0
├── churn_risk_level             -- Low/Medium/High
├── top_3_features               -- JSONB
├── recommended_action
└── model_version
```

#### 2. Prédiction de Pannes Équipements
**Objectif**: Maintenance prédictive

**Features**:
- Equipment age (days since install)
- Number of previous failures
- Time since last maintenance
- Seasonal factors
- Usage intensity (if available)
- Equipment type/brand

**Model**: Survival Analysis ou Time Series
**Target**: Jours avant prochaine panne

**Table résultat**:
```sql
gold.ml_equipment_failure_prediction
├── customer_product_key (PK)
├── prediction_date
├── predicted_failure_date
├── confidence_interval
├── recommended_maintenance_date
└── priority_level
```

#### 3. Optimisation Tournées Techniciens
**Objectif**: Routing optimal interventions

**Algorithme**: Genetic Algorithm ou OR-Tools
**Inputs**:
- Interventions à planifier (localisation GPS)
- Contraintes horaires clients
- Compétences techniciens
- Disponibilité techniciens
- Traffic estimé (API Google/Waze)

**Output**:
```sql
gold.ml_routing_optimization
├── optimization_run_id
├── run_date
├── colleague_key
├── intervention_sequence          -- JSONB array
├── total_distance_km
├── total_duration_minutes
├── utilization_rate
└── estimated_cost
```

#### 4. Détection d'Anomalies Ventes
**Objectif**: Alertes fraude, erreurs, opportunités

**Model**: Isolation Forest ou Autoencoders
**Anomalies détectées**:
- Commandes inhabituellement élevées
- Remises excessives
- Patterns de commande suspects
- Pics/chutes de vente

**Table résultat**:
```sql
gold.ml_sales_anomalies
├── anomaly_id (PK)
├── detection_date
├── sale_key (FK)
├── anomaly_score                 -- 0-1
├── anomaly_type                  -- fraud, error, spike, drop
├── explanation
├── is_investigated
└── resolution_notes
```

#### 5. Prévision de Demande
**Objectif**: Stock optimal & prévisions CA

**Model**: Prophet, ARIMA, LSTM
**Granularité**: Par produit, par jour

**Table résultat**:
```sql
gold.ml_demand_forecast
├── product_key (PK)
├── forecast_date (PK)
├── predicted_demand_quantity
├── confidence_interval_lower
├── confidence_interval_upper
├── trend_component
├── seasonal_component
├── model_name
└── mae_error                     -- Mean Absolute Error
```

### 5.2 Feature Store

Centraliser les features ML:
```sql
silver.feature_store
├── entity_type                    -- customer, product, colleague
├── entity_key
├── feature_name
├── feature_value
├── feature_type                   -- numeric, categorical, text
├── computed_date
└── ttl_days
```

Exemples features:
```python
# Customer features
- revenue_last_30_days
- revenue_last_90_days
- order_count_last_30_days
- avg_order_value_last_90_days
- days_since_last_order
- total_lifetime_revenue
- avg_payment_delay_days
- incident_count_last_year
- satisfaction_score_avg

# Product features
- sales_velocity_last_30_days
- stock_turnover_ratio
- margin_percent_avg
- return_rate
- customer_count_last_90_days
```

### 5.3 ML Pipeline Architecture

```
┌─────────────────────────────────────────────────────────┐
│ 1. FEATURE ENGINEERING (Spark/Databricks)              │
│    • silver.* → features extraction                     │
│    • silver.feature_store                               │
└────────────────────┬────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────┐
│ 2. MODEL TRAINING (Python/Jupyter)                     │
│    • scikit-learn, XGBoost, TensorFlow                  │
│    • MLflow tracking                                    │
│    • Hyperparameter tuning (Optuna)                     │
└────────────────────┬────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────┐
│ 3. MODEL REGISTRY (MLflow)                             │
│    • Version management                                 │
│    • A/B testing                                        │
│    • Champion/Challenger                                │
└────────────────────┬────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────┐
│ 4. BATCH INFERENCE (Airflow DAG)                       │
│    • Daily predictions                                  │
│    • Write to gold.ml_* tables                          │
└────────────────────┬────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────┐
│ 5. MONITORING (Evidently AI)                           │
│    • Data drift detection                               │
│    • Model performance degradation                      │
│    • Alerts                                             │
└─────────────────────────────────────────────────────────┘
```

---

## 6. STACK TECHNOLOGIQUE RECOMMANDÉ

### 6.1 Infrastructure Data

```yaml
Data Lake Storage:
  - MinIO (S3-compatible, self-hosted)
  - AWS S3 (cloud)
  - Azure Data Lake Storage Gen2 (cloud)

Data Processing:
  - Apache Spark (batch & streaming)
  - Apache Flink (streaming temps réel)
  - dbt (transformations SQL)

Orchestration:
  - Apache Airflow (workflows DAGs)
  - Prefect (alternative moderne)

Data Quality:
  - Great Expectations (validation)
  - deequ (Spark-based)

Cataloging:
  - Apache Atlas
  - DataHub (LinkedIn)
  - Amundsen (Lyft)
```

### 6.2 Stack ML

```yaml
Notebooks:
  - JupyterLab
  - Databricks Notebooks

Training:
  - scikit-learn (classical ML)
  - XGBoost, LightGBM (gradient boosting)
  - TensorFlow/Keras (deep learning)
  - PyTorch (deep learning)
  - Prophet (time series)

Experiment Tracking:
  - MLflow

Model Serving:
  - MLflow Models
  - TensorFlow Serving
  - FastAPI (custom)

Feature Store:
  - Feast
  - Tecton (managed)
```

### 6.3 Stack BI & Visualization

```yaml
BI Tools:
  - Metabase (open-source, simple)
  - Apache Superset (open-source, puissant)
  - Power BI (Microsoft)
  - Tableau (leader marché)

Real-time Dashboards:
  - Grafana (métriques temps réel)
  - Streamlit (Python apps)
  - Plotly Dash

Reverse ETL (Gold → Apps):
  - Hightouch
  - Census
  - Airbyte (avec destinations)
```

---

## 7. ARCHITECTURE TECHNIQUE DÉTAILLÉE

### 7.1 Diagramme flux de données

```
┌──────────────┐
│ EBP Postgres │
└──────┬───────┘
       │
       │ (1) CDC - Debezium
       ▼
┌──────────────┐
│ Kafka Topics │ ← Temps réel
└──────┬───────┘
       │
       ├─────────────────────────────────┐
       │                                 │
       ▼                                 ▼
┌─────────────┐                  ┌──────────────┐
│ Spark Stream│                  │ Flink Stream │
│ (Bronze)    │                  │ (Alerting)   │
└──────┬──────┘                  └──────────────┘
       │
       ▼
┌─────────────────────────────────────────────┐
│ Data Lake - Bronze Layer                    │
│ • S3/MinIO                                  │
│ • Format: Parquet/Delta Lake                │
│ • Partition: /year=2025/month=10/day=23/    │
└──────┬──────────────────────────────────────┘
       │
       │ (2) Transformations - dbt / Spark
       ▼
┌─────────────────────────────────────────────┐
│ Data Lake - Silver Layer                    │
│ • Cleaned & Conformed                       │
│ • Star Schema (Dims + Facts)                │
│ • Delta Lake (ACID transactions)            │
└──────┬──────────────────────────────────────┘
       │
       ├────────────────────────────┬──────────┐
       │                            │          │
       ▼                            ▼          ▼
┌──────────────┐          ┌─────────────┐  ┌─────────┐
│ Gold - KPIs  │          │ Gold - ML   │  │ Feature │
│ Aggregates   │          │ Predictions │  │ Store   │
└──────┬───────┘          └──────┬──────┘  └────┬────┘
       │                         │              │
       │                         │              │
       ▼                         ▼              ▼
┌──────────────┐          ┌─────────────┐  ┌─────────┐
│ BI Tools     │          │ ML Training │  │ Jupyter │
│ (Metabase)   │          │ (MLflow)    │  │ Lab     │
└──────────────┘          └─────────────┘  └─────────┘
```

### 7.2 Exemple DAG Airflow

```python
# dags/ebp_daily_pipeline.py
from airflow import DAG
from airflow.operators.python import PythonOperator
from airflow.providers.apache.spark.operators.spark_submit import SparkSubmitOperator
from datetime import datetime, timedelta

default_args = {
    'owner': 'data-team',
    'depends_on_past': False,
    'start_date': datetime(2025, 10, 23),
    'retries': 2,
    'retry_delay': timedelta(minutes=5),
}

dag = DAG(
    'ebp_daily_etl_pipeline',
    default_args=default_args,
    schedule_interval='0 2 * * *',  # 2h du matin
    catchup=False,
)

# BRONZE tasks
bronze_sales = SparkSubmitOperator(
    task_id='bronze_ingest_sales',
    application='/opt/spark/jobs/bronze_ingest_sales.py',
    dag=dag,
)

bronze_stock = SparkSubmitOperator(
    task_id='bronze_ingest_stock',
    application='/opt/spark/jobs/bronze_ingest_stock.py',
    dag=dag,
)

# SILVER tasks (dbt)
silver_transform = BashOperator(
    task_id='silver_dbt_transform',
    bash_command='cd /opt/dbt/ebp && dbt run --select silver.*',
    dag=dag,
)

# GOLD tasks
gold_kpis = SparkSubmitOperator(
    task_id='gold_compute_kpis',
    application='/opt/spark/jobs/gold_compute_kpis.py',
    dag=dag,
)

# ML tasks
ml_features = PythonOperator(
    task_id='ml_compute_features',
    python_callable=compute_ml_features,
    dag=dag,
)

ml_inference = PythonOperator(
    task_id='ml_batch_inference',
    python_callable=run_batch_predictions,
    dag=dag,
)

# Data quality
data_quality_check = PythonOperator(
    task_id='data_quality_validation',
    python_callable=run_great_expectations,
    dag=dag,
)

# Dependencies
[bronze_sales, bronze_stock] >> silver_transform >> gold_kpis
silver_transform >> ml_features >> ml_inference
gold_kpis >> data_quality_check
```

---

## 8. ROADMAP IMPLÉMENTATION

### Phase 1 - Fondations (2-3 mois)
**Objectif**: Bronze + Silver de base

- ✅ Setup infrastructure (Spark, MinIO, Airflow)
- ✅ CDC Postgres → Bronze (50 tables prioritaires)
- ✅ Transformations Silver (10 dimensions + 5 faits)
- ✅ Data quality framework (Great Expectations)
- ✅ Dashboards basiques (Metabase)

**Deliverables**:
- Pipeline batch fonctionnel
- 5 dashboards opérationnels
- Documentation technique

### Phase 2 - Enrichissement (2 mois)
**Objectif**: Gold + KPIs avancés

- ✅ Tables Gold (20 tables KPIs)
- ✅ Géocodage adresses clients
- ✅ Enrichissement météo/calendrier
- ✅ Dashboards exécutifs (15-20)
- ✅ Alerting automatique

**Deliverables**:
- 50+ KPIs trackés
- Alerts email/Slack
- Rapports automatisés hebdo/mensuels

### Phase 3 - ML & Prédictions (3-4 mois)
**Objectif**: Analytics avancés

- ✅ Feature Store
- ✅ MLflow setup
- ✅ 3 premiers modèles ML (churn, demand forecast, routing)
- ✅ Batch inference quotidien
- ✅ Monitoring models

**Deliverables**:
- Prédictions quotidiennes
- Recommandations automatisées
- Tableaux de bord ML

### Phase 4 - Temps Réel (2-3 mois)
**Objectif**: Streaming & temps réel

- ✅ Kafka + Flink streaming
- ✅ Dashboards temps réel (Grafana)
- ✅ Alerting temps réel (anomalies)
- ✅ API temps réel (FastAPI)

**Deliverables**:
- Latence < 1 minute Bronze → Silver
- Dashboards rafraîchis toutes les 30s
- API REST pour apps tierces

---

## 9. COÛTS & ROI ESTIMÉS

### 9.1 Coûts Infrastructure (estimés)

**Option Self-Hosted (On-Premise / Cloud VMs)**:
- Serveur Spark (8 cores, 32GB RAM): 150€/mois
- Serveur Airflow (4 cores, 16GB RAM): 80€/mois
- MinIO Storage (2TB): 40€/mois
- Serveur ML (GPU optionnel): 200€/mois
- **Total**: ~470€/mois = **5 640€/an**

**Option Cloud Managed**:
- Databricks (analytics): 1 500€/mois
- AWS S3 (2TB): 50€/mois
- AWS RDS Postgres (BI queries): 200€/mois
- Metabase Cloud: 80€/mois
- **Total**: ~1 830€/mois = **21 960€/an**

### 9.2 Coûts Humains

- Data Engineer (développement): 10-15 jours/homme initiaux
- Data Analyst (KPIs): 5 jours/homme
- Data Scientist (ML): 15-20 jours/homme
- **Total initial**: ~30-40 jours (20-30k€)
- **Maintenance**: 2-3 jours/mois (1,5-2k€/mois)

### 9.3 ROI Attendu

**Gains opérationnels**:
- Réduction 15% stocks morts → **~30k€/an**
- Optimisation tournées -10% distance → **~15k€/an**
- Rétention clients +5% (anti-churn) → **~50k€/an**
- Upsell ciblé +3% CA → **~40k€/an**
- Prévision demande → réduction ruptures → **~20k€/an**

**ROI estimé**: **155k€/an** pour investissement **25-50k€**
**Retour sur investissement**: 2-4 mois

---

## 10. NEXT STEPS IMMÉDIATS

### Semaine 1-2: Proof of Concept
1. ✅ Setup Spark local + MinIO
2. ✅ Ingestion Bronze: SaleDocument, Customer, Item
3. ✅ Transformation Silver: dim_customer, dim_product, fact_sales
4. ✅ Dashboard Metabase: CA par jour/client/produit

### Semaine 3-4: Validation
1. ✅ Industrialiser pipeline (Airflow)
2. ✅ Ajouter 20 tables Bronze
3. ✅ Créer 10 dashboards métier
4. ✅ Présentation Direction

### Mois 2: Production
1. ✅ Migration vers infra production
2. ✅ Toutes tables Bronze/Silver
3. ✅ Premières tables Gold
4. ✅ Formation utilisateurs BI

---

## 11. CONCLUSION

### Bénéfices attendus

**Décisionnel**:
- Vision 360° de l'activité en temps réel
- KPIs alignés stratégie d'entreprise
- Détection opportunités et risques

**Opérationnel**:
- Optimisation ressources (stocks, tournées)
- Amélioration satisfaction client
- Réduction coûts opérationnels

**Stratégique**:
- Culture data-driven
- Avantage concurrentiel
- Scalabilité croissance

### Recommandation

**Démarrer par Bronze/Silver** (Phase 1) pour valider ROI rapide, puis itérer vers ML (Phase 3-4).

Approche **Agile** recommandée: livraisons toutes les 2 semaines, feedback continu métier.

# RECOMMANDATIONS FINALES & PLAN D'ACTION
## Projet EBP - Mobile App & Data Warehouse

Date: 23/10/2025

---

## 📊 SYNTHÈSE DE L'AUDIT

### Base de données actuelle
- **319 tables** au total
- **670 349 lignes** de données
- **9 919 colonnes** (dont beaucoup redondantes)
- 13 domaines métier identifiés

### Problématiques identifiées

#### 🔴 **Critiques**
1. **Tables surchargées**:
   - `SaleDocument`: 538 colonnes (trop complexe)
   - `PurchaseDocument`: 508 colonnes
   - `ScheduleEvent`: 280 colonnes

2. **Données manquantes**:
   - Pas de géolocalisation (latitude/longitude) pour interventions
   - Table `Incident` vide (ticketing non utilisé)
   - Pas de photos/signatures structurées

3. **Pas d'index optimisés** pour:
   - Requêtes géographiques
   - Sync mobile
   - Dashboards BI

#### 🟡 **Importantes**
1. Pas de relations (foreign keys) définies en base
2. Nommage non cohérent (mix français/anglais)
3. Volumétrie élevée sur certaines tables (112K lignes `SaleDocumentLine`)

---

## 🎯 OBJECTIFS DU PROJET

### 1. Application Mobile Terrain (Priorité HAUTE)
**Usage**: Techniciens interventions, ticketing, SAV
- **10 tables** essentielles identifiées
- Réduction **92%** des données (670K → 50K lignes)
- Réduction **97%** des colonnes (9919 → 250 colonnes)

### 2. Data Warehouse Analytics (Priorité MOYENNE)
**Usage**: KPIs, BI, ML prédictif
- Architecture **Bronze/Silver/Gold**
- **50 tables** prioritaires Bronze
- **15 dimensions** + **6 faits** Silver
- **25+ tables KPIs** Gold
- **5 modèles ML** identifiés

---

## 🚀 PLAN D'ACTION RECOMMANDÉ

### PHASE 0 - Préparation (Semaine 1-2) ⏱️ 2 semaines

#### Actions immédiates sur la BDD
```sql
-- 1. Ajouter colonnes géolocalisation
ALTER TABLE "ScheduleEvent"
  ADD COLUMN latitude DECIMAL(10, 8),
  ADD COLUMN longitude DECIMAL(11, 8);

ALTER TABLE "ConstructionSite"
  ADD COLUMN latitude DECIMAL(10, 8),
  ADD COLUMN longitude DECIMAL(11, 8);

ALTER TABLE "Customer"
  ADD COLUMN main_delivery_latitude DECIMAL(10, 8),
  ADD COLUMN main_delivery_longitude DECIMAL(11, 8);

-- 2. Activer gestion mobile
ALTER TABLE "ScheduleEvent"
  ADD COLUMN photos_json JSONB,
  ADD COLUMN signature_url VARCHAR(255),
  ADD COLUMN mobile_sync_date TIMESTAMP,
  ADD COLUMN mobile_sync_status VARCHAR(20);

ALTER TABLE "Incident"
  ADD COLUMN latitude DECIMAL(10, 8),
  ADD COLUMN longitude DECIMAL(11, 8),
  ADD COLUMN photos_json JSONB,
  ADD COLUMN signature_url VARCHAR(255),
  ADD COLUMN mobile_sync_date TIMESTAMP;

-- 3. Index performance
CREATE INDEX idx_schedule_event_dates
  ON "ScheduleEvent"("StartDate", "EndDate");

CREATE INDEX idx_schedule_event_colleague
  ON "ScheduleEvent"("ColleagueId")
  WHERE "ActiveState" = 1;

CREATE INDEX idx_customer_active
  ON "Customer"("ActiveState");

-- 4. Géocodage addresses existantes (script Python)
-- Voir script: scripts/geocode_addresses.py
```

**Deliverables**:
- ✅ BDD mise à jour avec nouvelles colonnes
- ✅ Index créés
- ✅ Script géocodage développé
- ✅ Backup complet BDD

**Ressources**: 1 personne, 10 jours

---

### PHASE 1 - MVP App Mobile (Mois 1-3) ⏱️ 3 mois

#### Objectif
Application mobile minimaliste fonctionnelle pour 2-3 techniciens pilotes.

#### Fonctionnalités MVP
1. ✅ **Consultation agenda** interventions (read-only)
2. ✅ **Détail intervention**:
   - Client, contact, téléphone
   - Adresse + navigation GPS (Google Maps/Waze)
   - Historique interventions
3. ✅ **Capture photos** (3-5 par intervention)
4. ✅ **Signature client** (canvas HTML5)
5. ✅ **Clôture intervention** (statut + commentaire)
6. ✅ **Mode offline** basique (cache 7 jours)
7. ✅ **Sync bidirectionnelle** (montée données toutes les 15 min)

#### Stack technique recommandé
```yaml
Mobile:
  Framework: React Native (iOS + Android)
  State: Redux Toolkit
  Offline: WatermelonDB ou PouchDB
  Maps: react-native-maps
  Camera: react-native-camera
  Signature: react-native-signature-canvas

Backend API:
  Framework: Node.js + Express ou Fastify
  Database: PostgreSQL (existant)
  ORM: Prisma ou TypeORM
  Auth: JWT tokens
  File storage: MinIO (S3-like) ou AWS S3

Sync:
  Strategy: Incremental delta sync
  Conflict resolution: Last-write-wins + manual review
```

#### Tables mobile (10 tables simplifiées)
Voir détail dans: `AUDIT_APP_MOBILE_TERRAIN.md`

1. `mobile_schedule_event` (40 colonnes au lieu de 280)
2. `mobile_customer` (30 colonnes au lieu de 204)
3. `mobile_contact` (20 colonnes au lieu de 84)
4. `mobile_customer_product` (25 colonnes au lieu de 78)
5. `mobile_colleague` (15 colonnes au lieu de 102)
6. `mobile_activity` (25 colonnes au lieu de 46)
7. `mobile_incident` (35 colonnes)
8. `mobile_maintenance_contract` (20 colonnes)
9. `mobile_item` (20 colonnes au lieu de 245)
10. `mobile_construction_site` (30 colonnes)

#### API Endpoints
```
GET    /api/mobile/sync/delta?since={timestamp}
POST   /api/mobile/interventions/{id}/complete
POST   /api/mobile/interventions/{id}/photos
POST   /api/mobile/interventions/{id}/signature
POST   /api/mobile/incidents (création ticket terrain)
GET    /api/mobile/customers/{id}
GET    /api/mobile/interventions/calendar?start={date}&end={date}
```

#### Milestones
- **Semaine 1-4**: Backend API + schéma mobile
- **Semaine 5-8**: App mobile MVP
- **Semaine 9-10**: Tests internes
- **Semaine 11-12**: Pilote terrain (2-3 techniciens)

**Deliverables**:
- ✅ API REST fonctionnelle
- ✅ App mobile iOS + Android
- ✅ Documentation utilisateur
- ✅ Retours pilotes documentés

**Ressources**:
- 1 Backend dev: 2 mois
- 1 Mobile dev: 2.5 mois
- 1 QA: 0.5 mois

**Budget**: ~40-50k€

---

### PHASE 2 - App Mobile Production (Mois 4-6) ⏱️ 3 mois

#### Objectif
Déploiement à tous les techniciens + fonctionnalités avancées.

#### Nouvelles fonctionnalités
1. ✅ **Création tickets terrain** (incidents)
2. ✅ **Gestion stock mobile** (consommables)
3. ✅ **Temps passés** (timesheet)
4. ✅ **Bon d'intervention PDF** (génération + email client)
5. ✅ **Notifications push** (nouvelle intervention, urgent)
6. ✅ **Historique complet client**
7. ✅ **Mode offline avancé** (30 jours cache)
8. ✅ **Multi-sites** (plusieurs dépôts/régions)

#### Optimisations
- Performance sync (< 5s delta)
- Battery optimization (background sync intelligent)
- Compression photos (thumbnails)
- Gestion conflits avancée

**Deliverables**:
- ✅ App v2.0 production
- ✅ Formation techniciens (2h/personne)
- ✅ Support hotline

**Ressources**:
- 1 Backend dev: 1.5 mois
- 1 Mobile dev: 2 mois
- 1 Support: ongoing

**Budget**: ~30-40k€

---

### PHASE 3 - Data Warehouse Bronze/Silver (Mois 3-5) ⏱️ 3 mois
*Parallèle à Phase 2 mobile*

#### Objectif
Fondations data warehouse pour analytics.

#### Infrastructure
```yaml
Compute:
  - Apache Spark (3 workers: 8 cores, 32GB chacun)
  - Apache Airflow (orchestration)

Storage:
  - MinIO (S3-compatible) 5TB
  ou AWS S3

Database:
  - PostgreSQL source (existant)
  - PostgreSQL analytics (nouveau, pour BI queries)

Format:
  - Bronze: Parquet + Snappy
  - Silver: Delta Lake (ACID)
```

#### Livraisons
**Bronze Layer** (50 tables):
- Ingestion batch quotidienne (2h du matin)
- CDC temps réel (optionnel Phase 4)
- Historisation SCD Type 2
- Rétention: infinie

**Silver Layer** (dimensions + faits):
- 15 dimensions (Customer, Product, Supplier, Date, Time, etc.)
- 6 faits (Sales, Purchases, Inventory, Interventions, Incidents, Activity)
- Transformations dbt
- Data quality (Great Expectations)

**Dashboards Metabase** (10 dashboards):
1. Vue d'ensemble CA
2. Ventes par client
3. Ventes par produit
4. Performance commerciaux
5. Suivi stock
6. Interventions planning
7. Performance techniciens
8. Tickets SAV
9. Achats fournisseurs
10. Marges

**Deliverables**:
- ✅ Pipeline Bronze/Silver opérationnel
- ✅ 10 dashboards Metabase
- ✅ Documentation data catalog
- ✅ Formation utilisateurs métier

**Ressources**:
- 1 Data Engineer: 3 mois
- 1 Data Analyst: 1 mois

**Budget**: ~35-45k€ (dev) + 5-10k€/an (infra)

---

### PHASE 4 - Data Warehouse Gold + ML (Mois 6-9) ⏱️ 4 mois

#### Objectif
KPIs avancés + Machine Learning prédictif.

#### Gold Layer (25+ tables)
- KPIs ventes quotidiens/hebdo/mensuels
- RFM clients (Recency, Frequency, Monetary)
- ABC products
- Performance techniciens
- Health scores clients
- Prévisions stock
- (voir détail `AUDIT_DATA_WAREHOUSE_ARCHITECTURE.md`)

#### Machine Learning (5 modèles)

**1. Prédiction Churn Client** (Priorité 1)
- Model: XGBoost
- Features: RFM, satisfaction, incidents, paiements
- Target: Probabilité churn 90 jours
- **ROI**: Rétention +5% → ~50k€/an

**2. Prévision Demande Produits** (Priorité 2)
- Model: Prophet (time series)
- Granularité: Par produit, par jour
- **ROI**: Réduction stocks morts -15% → ~30k€/an

**3. Optimisation Tournées** (Priorité 3)
- Algorithme: OR-Tools (Google)
- **ROI**: -10% distance → ~15k€/an carburant

**4. Détection Anomalies Ventes** (Priorité 4)
- Model: Isolation Forest
- Alertes: Fraude, erreurs, opportunités

**5. Prédiction Pannes Équipements** (Priorité 5)
- Model: Survival Analysis
- Maintenance prédictive
- **ROI**: -20% interventions urgentes

#### MLOps Stack
- MLflow (tracking, registry)
- Jupyter notebooks
- Airflow (batch inference quotidien)
- Evidently AI (monitoring)

**Deliverables**:
- ✅ 25 tables Gold
- ✅ 5 modèles ML en production
- ✅ Dashboards ML (prédictions, alertes)
- ✅ API ML (scoring temps réel optionnel)

**Ressources**:
- 1 Data Scientist: 3 mois
- 1 ML Engineer: 2 mois
- 1 Data Engineer: 1 mois

**Budget**: ~50-65k€

---

### PHASE 5 - Temps Réel & Optimisations (Mois 10-12) ⏱️ 3 mois

#### Objectif
Streaming temps réel + optimisations avancées.

#### Fonctionnalités
- Kafka + CDC (Change Data Capture)
- Flink streaming analytics
- Dashboards temps réel (Grafana)
- Alerting temps réel (Slack/email)
- API REST temps réel (FastAPI)

**Deliverables**:
- ✅ Latence Bronze < 1 minute
- ✅ Dashboards rafraîchis 30s
- ✅ Alertes automatiques

**Ressources**:
- 1 Data Engineer: 2 mois
- 1 DevOps: 1 mois

**Budget**: ~25-35k€

---

## 💰 BUDGET TOTAL & ROI

### Investissement Total (12 mois)

| Phase | Durée | Budget Dev | Budget Infra/an | Total |
|-------|-------|------------|-----------------|-------|
| Phase 0 - Préparation | 2 sem | 5k€ | - | 5k€ |
| Phase 1 - Mobile MVP | 3 mois | 45k€ | - | 45k€ |
| Phase 2 - Mobile Prod | 3 mois | 35k€ | - | 35k€ |
| Phase 3 - DW Bronze/Silver | 3 mois | 40k€ | 8k€ | 48k€ |
| Phase 4 - DW Gold/ML | 4 mois | 60k€ | 3k€ | 63k€ |
| Phase 5 - Temps Réel | 3 mois | 30k€ | 5k€ | 35k€ |
| **TOTAL 12 mois** | **12 mois** | **215k€** | **16k€** | **231k€** |

### Coûts Récurrents (à partir année 2)

| Poste | Coût/an |
|-------|---------|
| Infrastructure cloud/serveurs | 16k€ |
| Maintenance & support (0.5 ETP) | 25k€ |
| Évolutions (0.3 ETP) | 15k€ |
| Licences BI (si Power BI/Tableau) | 5k€ |
| **TOTAL Année 2+** | **61k€/an** |

### ROI Estimé

| Gain | Montant/an | Source |
|------|------------|--------|
| Réduction stocks morts (-15%) | 30k€ | ML prévision demande |
| Optimisation tournées (-10% km) | 15k€ | ML routing |
| Rétention clients (+5%) | 50k€ | ML anti-churn + meilleur service |
| Upsell ciblé (+3% CA) | 40k€ | Analytics clients |
| Réduction ruptures stock | 20k€ | Prévisions |
| Productivité techniciens (+8%) | 35k€ | App mobile |
| Réduction tickets non résolus (-15%) | 10k€ | Meilleur suivi |
| **TOTAL Gains/an** | **200k€** | |

**ROI**: 200k€/an pour 231k€ investissement + 61k€/an maintenance
**Break-even**: **~14 mois**
**ROI 3 ans**: **200k x 3 - 231k - 61k x 2 = 477k€** net

---

## ⚠️ RISQUES & MITIGATION

### Risques Techniques

| Risque | Probabilité | Impact | Mitigation |
|--------|-------------|--------|------------|
| Volumétrie BDD trop élevée | Moyenne | Élevé | Archivage données > 2 ans, pagination API |
| Sync mobile conflits | Élevée | Moyen | Last-write-wins + revue manuelle conflits critiques |
| Performance ML inférée | Faible | Moyen | Monitoring continu, A/B testing modèles |
| Complexité temps réel (Phase 5) | Élevée | Faible | Optionnel, peut être retardé |

### Risques Projet

| Risque | Probabilité | Impact | Mitigation |
|--------|-------------|--------|------------|
| Adoption faible app mobile | Moyenne | Élevé | Formation, pilote, feedback continu |
| Manque ressources Data | Élevée | Élevé | Prioriser Phases 1-3, externaliser si besoin |
| Changement priorités métier | Moyenne | Moyen | Approche Agile, livraisons incrémentielles |
| Qualité données sources | Élevée | Élevé | Great Expectations, nettoyage progressif |

---

## 📋 PROCHAINES ÉTAPES IMMÉDIATES

### Cette semaine (Semaine 1)

**Validation stratégique**:
- [ ] Présentation audit à Direction
- [ ] Validation budget global
- [ ] Choix phases prioritaires (1+3 recommandé)
- [ ] Définition équipe projet

**Technique**:
- [ ] Backup complet BDD production
- [ ] Setup environnement dev/staging
- [ ] Commencer géocodage adresses
- [ ] Installer Metabase (demo BI)

### Semaine 2

**Mobile**:
- [ ] Choix stack technique mobile (React Native?)
- [ ] Setup repo Git
- [ ] Design wireframes app
- [ ] Schéma API REST

**Data**:
- [ ] Setup MinIO ou S3
- [ ] Installation Spark + Airflow
- [ ] Premier pipeline Bronze (SaleDocument)
- [ ] Première table Silver (dim_customer)

### Mois 1

- [ ] Backend API v0.1
- [ ] App mobile écran agenda (read-only)
- [ ] Pipeline Bronze 10 premières tables
- [ ] Dashboard Metabase "Vue CA"
- [ ] Présentation démo Direction

---

## 📚 DOCUMENTATION PRODUITE

Tous les documents d'audit sont dans `/Database/`:

1. **AUDIT_DATABASE.md** (33 pages)
   - Vue d'ensemble complète BDD
   - 319 tables analysées
   - Répartition par domaine métier
   - Top tables volumétrie/complexité

2. **AUDIT_APP_MOBILE_TERRAIN.md** (45 pages)
   - Tables pour app mobile (10 tables)
   - Schéma mobile simplifié
   - Stratégie sync
   - Fonctionnalités MVP vs v2
   - Optimisations BDD nécessaires

3. **AUDIT_DATA_WAREHOUSE_ARCHITECTURE.md** (75 pages)
   - Architecture Bronze/Silver/Gold
   - 50 tables Bronze prioritaires
   - Modèle dimensionnel Silver (15 dims + 6 faits)
   - 25 tables Gold KPIs
   - 5 modèles ML détaillés
   - Stack technique
   - Roadmap implémentation
   - ROI détaillé

4. **RECOMMANDATIONS_FINALES.md** (ce document)
   - Synthèse
   - Plan d'action 5 phases
   - Budget & ROI
   - Risques & prochaines étapes

5. **database_analysis.json**
   - Données brutes analyse (exploitables programmatiquement)

---

## 🎯 RECOMMANDATIONS CLÉS

### ✅ À FAIRE ABSOLUMENT

1. **Ajouter géolocalisation** (latitude/longitude) immédiatement
   - Critical pour app mobile
   - Script de géocodage adresses existantes

2. **Démarrer par Phase 1 (Mobile MVP)** en priorité
   - ROI rapide (productivité terrain)
   - Feedback utilisateurs réel
   - Validation technique

3. **Lancer Phase 3 (DW Bronze/Silver) en parallèle mois 3**
   - Fondations analytics
   - Dashboards métier quick-wins
   - Prépare ML (Phase 4)

4. **Approche Agile & Itérative**
   - Livraisons toutes les 2 semaines
   - Feedback continu métier
   - Ajustements rapides

5. **Investir dans qualité données**
   - Great Expectations (validation)
   - Monitoring data quality
   - Documentation data catalog

### ❌ À ÉVITER

1. **Big Bang** (tout développer d'un coup)
   - Trop risqué
   - Feedback trop tardif

2. **Négliger formation utilisateurs**
   - App mobile : 2h formation/technicien minimum
   - BI : ateliers dashboards

3. **Sous-estimer complexité sync mobile**
   - Conflits, performance, offline
   - Prévoir temps tests approfondis

4. **Vouloir faire du ML trop tôt**
   - Nécessite données quality (Silver)
   - Phase 4 seulement après Phase 3 validée

---

## 🤝 ÉQUIPE RECOMMANDÉE

### Phase 1-2 (Mobile)
- **1 Backend Developer** (Node.js/PostgreSQL): 4 mois
- **1 Mobile Developer** (React Native): 5 mois
- **1 QA Engineer**: 2 mois
- **1 Product Owner** (métier): 20% temps
- **1 UI/UX Designer**: 1 mois

### Phase 3-4 (Data Warehouse)
- **1 Data Engineer** (Spark/Airflow): 6 mois
- **1 Data Analyst** (SQL/BI): 3 mois
- **1 Data Scientist** (Python/ML): 3 mois
- **1 ML Engineer**: 2 mois

### Phase 5 (Temps Réel)
- **1 Data Engineer**: 2 mois
- **1 DevOps Engineer**: 1 mois

### Ongoing (Maintenance)
- **0.5 ETP Backend/Mobile**: Bugs, évolutions
- **0.3 ETP Data**: Nouveaux dashboards, modèles ML

---

## 📞 CONTACTS & SUPPORT

Pour toute question sur cet audit:

**Technique**:
- Scripts génération interfaces: `npm run generate`
- Script analyse BDD: `npm run analyze`
- Localisation: `/Database/`

**Documentation**:
- Interfaces TypeScript: `/Database/interface_EBP/`
- Rapports audit: `/Database/AUDIT_*.md`

---

## ✨ CONCLUSION

Cet audit démontre un **potentiel énorme** d'optimisation et création de valeur:

### Données
- Base riche: **670K lignes**, **319 tables**
- Domaines métier bien structurés
- Qualité globale correcte

### Opportunités
- **App mobile**: Productivité terrain x2
- **Analytics**: Vision 360° temps réel
- **ML**: Prédictions, optimisations automatiques
- **ROI**: 200k€/an pour 231k€ investissement

### Clés de succès
1. Approche **progressive** (phases)
2. Focus **métier** (valeur utilisateur)
3. **Quick wins** réguliers
4. **Feedback** continu
5. **Qualité** données

**Le projet est viable techniquement et financièrement. Recommandation: GO ✅**

---

*Document généré automatiquement le 23/10/2025*
*Basé sur analyse de la base de données EBP PostgreSQL (319 tables, 670 349 lignes)*

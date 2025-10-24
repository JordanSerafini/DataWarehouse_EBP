# PLAN D'ACTION GLOBAL
## Transformation Data EBP - App Mobile + Data Warehouse

Date: 23/10/2025

---

## SYNTHÈSE AUDIT

### État actuel
- ✅ **319 tables** PostgreSQL analysées
- ✅ **670 349 lignes** de données
- ✅ **9 919 colonnes** au total
- ✅ **13 domaines métier** identifiés

### Problématiques identifiées
1. ⚠️ **Tables surchargées**: jusqu'à 538 colonnes (SaleDocument)
2. ⚠️ **Absence de géolocalisation** pour interventions terrain
3. ⚠️ **Pas d'optimisation mobile**: structure trop complexe
4. ⚠️ **Pas de data warehouse**: analytics limité
5. ⚠️ **Incident table vide**: ticketing non utilisé

### Opportunités
1. 🚀 **App mobile terrain**: 11 935 interventions/an à optimiser
2. 🚀 **Data warehouse**: 670K lignes pour analytics et ML
3. 🚀 **Prédictif**: churn clients, maintenance équipements
4. 🚀 **Optimisation**: tournées techniciens, stock

---

## PROJETS IDENTIFIÉS

### Projet 1: Application Mobile Terrain
**Objectif**: Digitaliser interventions techniciens

**Fonctionnalités MVP**:
- Consultation agenda interventions
- Navigation GPS vers client
- Fiche client avec historique
- Prise de photos
- Signature client
- Clôture intervention
- Mode offline

**Bénéfices attendus**:
- -30% temps admin techniciens
- +25% interventions/jour
- +40% satisfaction client
- 100% traçabilité interventions

**Budget**: 40 000-60 000€
**Délai**: 4-6 mois

### Projet 2: Data Warehouse Bronze/Silver/Gold
**Objectif**: Analytics avancé + ML

**Livrables**:
- Architecture medallion (Bronze → Silver → Gold)
- ETL automatisé
- 15+ dashboards BI
- 5 modèles ML (churn, prédictif...)

**Bénéfices attendus**:
- Décisions data-driven
- -15% churn clients
- +10% marge via recommandations
- Maintenance prédictive équipements

**Budget**: 30 000-45 000€ (dev) + 360€/mois (infra)
**Délai**: 9-12 mois

---

## ROADMAP GLOBALE (18 mois)

### TRIMESTRE 1 (Mois 1-3)

#### Sprint 1-2: Préparation & POC (6 semaines)
**Actions**:
- [ ] Validation périmètre fonctionnel avec métier
- [ ] Choix stack technique (mobile + data)
- [ ] Setup environnements (dev, staging, prod)
- [ ] POC app mobile (1 technicien pilote)
- [ ] POC data warehouse (2 tables Bronze/Silver)

**Livrables**:
- POC mobile fonctionnel
- POC ETL Bronze → Silver
- Dashboard BI basique

**Équipe**:
- 1 Product Owner
- 1 Dev mobile (React Native/Flutter)
- 1 Data Engineer
- 1 DBA PostgreSQL

**Budget Q1**: 15 000€

#### Sprint 3-4: Optimisation BDD + API (6 semaines)
**Actions BDD**:
- [ ] Ajouter colonnes géolocalisation (ScheduleEvent, ConstructionSite, Customer)
- [ ] Créer index performance (dates, foreign keys)
- [ ] Activer table Incident pour ticketing
- [ ] Créer vues SQL simplifiées pour mobile

**Schéma SQL**:
```sql
-- Géolocalisation
ALTER TABLE "ScheduleEvent" ADD COLUMN latitude DECIMAL(10, 8);
ALTER TABLE "ScheduleEvent" ADD COLUMN longitude DECIMAL(11, 8);
ALTER TABLE "Customer" ADD COLUMN delivery_latitude DECIMAL(10, 8);
ALTER TABLE "Customer" ADD COLUMN delivery_longitude DECIMAL(11, 8);

-- Sync mobile
ALTER TABLE "ScheduleEvent" ADD COLUMN mobile_sync_date TIMESTAMP;
ALTER TABLE "ScheduleEvent" ADD COLUMN mobile_sync_status VARCHAR(20);

-- Média
ALTER TABLE "ScheduleEvent" ADD COLUMN photos_json JSONB;
ALTER TABLE "ScheduleEvent" ADD COLUMN signature_url VARCHAR(255);

-- Index
CREATE INDEX idx_schedule_event_dates ON "ScheduleEvent"("StartDate", "EndDate");
CREATE INDEX idx_schedule_event_colleague ON "ScheduleEvent"("ColleagueId");
CREATE INDEX idx_customer_active ON "Customer"("ActiveState");
```

**Actions API**:
- [ ] Développer API REST sync mobile
  - GET /api/mobile/interventions/:technicianId
  - GET /api/mobile/customers/:customerId
  - POST /api/mobile/interventions/:id/complete
  - POST /api/mobile/photos/upload
- [ ] Authentification JWT
- [ ] Rate limiting
- [ ] Documentation Swagger

**Livrables**:
- BDD optimisée
- API REST complète
- Tests unitaires

**Équipe**:
- 1 DBA
- 1 Backend Dev (Node.js/Python)
- 1 Data Engineer (vues SQL)

**Budget**: 12 000€

### TRIMESTRE 2 (Mois 4-6)

#### Sprint 5-8: App Mobile MVP (12 semaines)

**Développement mobile**:
- [ ] Architecture offline-first (Redux Persist / SQLite)
- [ ] Écrans principaux:
  - Dashboard technicien
  - Liste interventions (calendrier)
  - Détail intervention
  - Fiche client
  - Navigation GPS (Google Maps / Apple Maps)
  - Appareil photo + galerie
  - Signature manuscrite
  - Formulaire clôture
- [ ] Sync bidirectionnelle (optimistic UI)
- [ ] Gestion conflits (last-write-wins + alertes)
- [ ] Tests E2E

**Stockage photos**:
- [ ] Setup S3/Cloud Storage
- [ ] Compression images (WebP)
- [ ] Upload asynchrone
- [ ] Miniatures

**Livrables**:
- App iOS + Android
- 100% fonctionnel offline
- Tests passés (90%+ couverture)

**Équipe**:
- 2 Dev mobile
- 1 Backend Dev (API)
- 1 UX/UI Designer

**Budget Q2**: 30 000€

#### Déploiement pilote
- [ ] Onboarding 3 techniciens pilotes
- [ ] Formation terrain (2 jours)
- [ ] Accompagnement 1 mois
- [ ] Collecte feedback
- [ ] Ajustements

### TRIMESTRE 3 (Mois 7-9)

#### Sprint 9-10: Data Warehouse Phase 1 (6 semaines)

**Ingestion Bronze**:
- [ ] Scripts Python extraction EBP → Bronze
- [ ] 15 tables prioritaires
- [ ] Scheduling Airflow quotidien
- [ ] Logs & monitoring

**Transformation Silver**:
- [ ] Dimensions: Customer, Item, Colleague, Date
- [ ] Faits: Sale, Intervention
- [ ] dbt models
- [ ] Tests qualité (dbt tests)

**Livrables**:
- Bronze (15 tables) opérationnel
- Silver (6 tables) opérationnel
- Pipelines ETL automatisés

**Équipe**:
- 1 Data Engineer
- 1 Analytics Engineer (dbt)

**Budget**: 10 000€

#### Sprint 11-12: Dashboards BI (6 semaines)

**Dashboards Metabase**:
- [ ] Commercial (CA, commandes, top clients/produits)
- [ ] Interventions (volumétrie, SLA, satisfaction)
- [ ] Stock (rotation, ruptures, valeur)
- [ ] RH (charge techniciens, performance)

**Formation**:
- [ ] Formation équipe commerciale (2h)
- [ ] Formation managers (2h)
- [ ] Formation direction (1h)

**Livrables**:
- 10+ dashboards BI
- Documentation utilisateur

**Équipe**:
- 1 Data Analyst
- 1 BI Developer

**Budget Q3**: 8 000€

#### Déploiement app mobile (général)
- [ ] Rollout à tous techniciens (31 utilisateurs)
- [ ] Formation collective
- [ ] Support hotline
- [ ] Monitoring adoption

### TRIMESTRE 4 (Mois 10-12)

#### Sprint 13-16: Data Warehouse Phase 2 + ML (12 semaines)

**Gold Layer**:
- [ ] Agrégations quotidiennes
- [ ] KPIs business (20+ métriques)
- [ ] Tables gold optimisées BI

**Machine Learning**:
- [ ] Feature engineering
- [ ] Modèle 1: Churn client (Random Forest)
- [ ] Modèle 2: Défaillance équipement (Survival Analysis)
- [ ] Modèle 3: Anomalies ventes (Isolation Forest)
- [ ] MLflow tracking
- [ ] Scoring automatique mensuel

**Dashboards avancés**:
- [ ] Prédictions churn (alertes)
- [ ] Maintenance prédictive
- [ ] Recommandations produits
- [ ] Carte géographique interventions

**Livrables**:
- Gold layer complet
- 3 modèles ML en production
- Dashboards ML

**Équipe**:
- 1 Data Scientist
- 1 ML Engineer
- 1 Data Engineer

**Budget Q4**: 18 000€

### TRIMESTRE 5-6 (Mois 13-18)

#### Optimisations & Scale

**App Mobile**:
- [ ] Module ticketing complet
- [ ] Gestion stock mobile
- [ ] Chat entre techniciens
- [ ] Génération PDF bon d'intervention
- [ ] Optimisation tournées (routing)

**Data Warehouse**:
- [ ] Streaming CDC (Kafka + Debezium)
- [ ] Partitionnement tables (par date)
- [ ] Archivage données anciennes
- [ ] Monitoring Grafana
- [ ] Optimisation performances

**ML**:
- [ ] Modèle 4: Recommandation produits (Collaborative Filtering)
- [ ] Modèle 5: Prévision CA (LSTM/Prophet)
- [ ] A/B testing modèles
- [ ] Retraining automatique

**Budget Q5-Q6**: 25 000€

---

## ORGANISATION PROJET

### Équipe nécessaire

**Core Team**:
- 1 Product Owner (50%)
- 1 Tech Lead (100%)
- 2 Dev Mobile (100%)
- 1 Backend Dev (100%)
- 1 Data Engineer (100%)
- 1 Data Scientist (50%, à partir M10)
- 1 UX/UI Designer (30%)

**Support**:
- 1 DBA PostgreSQL (20%)
- 1 DevOps (20%)
- 1 QA Tester (50%)

### Gouvernance

**Sprints**: 2 semaines
**Cérémonies**:
- Daily standup (15min)
- Sprint planning (2h)
- Sprint review (1h)
- Rétrospective (1h)

**Comité de pilotage**: Mensuel
- Direction
- Métier (commercial, SAV, logistique)
- IT

---

## BUDGET GLOBAL

### Investissement initial (one-time)

| Poste | Montant |
|-------|---------|
| App Mobile (dev) | 40 000€ |
| API Backend | 12 000€ |
| Data Warehouse (dev) | 30 000€ |
| ML Models | 18 000€ |
| Formation | 3 000€ |
| Licences (1an) | 2 000€ |
| **TOTAL** | **105 000€** |

### Coûts récurrents (par mois)

| Poste | Montant/mois |
|-------|--------------|
| Infrastructure cloud | 360€ |
| App mobile (hosting API) | 150€ |
| Stockage photos (S3) | 50€ |
| Licences BI | 100€ |
| Support & maintenance | 2 000€ |
| **TOTAL** | **2 660€/mois** |

**Coût annuel récurrent**: ~32 000€/an

### Budget total 18 mois
- Développement: 105 000€
- Infrastructure 18 mois: 48 000€
- **TOTAL**: **153 000€**

---

## RETOUR SUR INVESTISSEMENT (ROI)

### Gains quantifiables (par an)

**App Mobile**:
- Gain productivité techniciens: 31 techniciens x 20% temps x 40 000€ = **248 000€/an**
- Réduction déplacements inutiles (-10%): **15 000€/an**
- Réduction papier/admin: **5 000€/an**

**Data Warehouse**:
- Réduction churn (-15% x 1338 clients x 5000€ CA moyen): **100 000€/an**
- Optimisation stock (-10% immobilisé): **30 000€/an**
- Meilleure marge (recommandations +2%): **50 000€/an**

**Total gains**: **448 000€/an**

### ROI
- Investissement: 153 000€
- Gains an 1: 448 000€
- **ROI**: 293% (payback < 5 mois) 🚀

---

## RISQUES & MITIGATION

| Risque | Impact | Probabilité | Mitigation |
|--------|--------|-------------|------------|
| Adoption faible app mobile | Élevé | Moyen | Formation intensive, implication techniciens dès POC |
| Qualité données insuffisante | Élevé | Moyen | Audit qualité Bronze, nettoyage Silver |
| Dépassement budget | Moyen | Moyen | Suivi hebdo burn rate, priorisation stricte |
| Turnover équipe | Moyen | Faible | Documentation, pair programming |
| Performance BDD | Moyen | Faible | Index, partitionnement, monitoring |
| Résistance changement | Élevé | Moyen | Change management, quick wins |

---

## CRITÈRES DE SUCCÈS

### App Mobile (6 mois)
- ✅ Adoption: > 90% techniciens utilisent quotidiennement
- ✅ Interventions digitalisées: > 95%
- ✅ Satisfaction utilisateurs: > 4/5
- ✅ Uptime: > 99%
- ✅ Temps sync: < 30 secondes

### Data Warehouse (12 mois)
- ✅ Fraîcheur données: < 24h
- ✅ Dashboards actifs: > 80% managers consultent hebdo
- ✅ Précision ML churn: > 80% AUC-ROC
- ✅ Alertes prédictives: génèrent actions concrètes

### Business (18 mois)
- ✅ Productivité: +20% interventions/technicien
- ✅ Satisfaction client: +15% NPS
- ✅ Churn: -15%
- ✅ Marge: +2%
- ✅ ROI: > 200%

---

## PROCHAINES ÉTAPES IMMÉDIATES

### Semaine 1-2
1. [ ] **Présenter audit à direction** (ce document)
2. [ ] **Valider budget & périmètre**
3. [ ] **Constituer équipe projet**
4. [ ] **Lancer appel d'offres** (si besoin prestataires)

### Semaine 3-4
5. [ ] **Kickoff projet**
6. [ ] **Setup environnements** (dev, staging)
7. [ ] **Optimisations BDD** (géolocalisation, index)
8. [ ] **POC mobile** (maquettes)

### Mois 2
9. [ ] **POC mobile fonctionnel** (1 technicien)
10. [ ] **POC data warehouse** (2 tables)
11. [ ] **Go/No-Go** décision
12. [ ] **Sprint 1** développement

---

## ANNEXES

### Documents produits
1. ✅ [AUDIT_DATABASE.md](./AUDIT_DATABASE.md) - Analyse complète BDD
2. ✅ [AUDIT_APP_MOBILE_TERRAIN.md](./AUDIT_APP_MOBILE_TERRAIN.md) - Spécifications app mobile
3. ✅ [ARCHITECTURE_DATA_WAREHOUSE.md](./ARCHITECTURE_DATA_WAREHOUSE.md) - Architecture Bronze/Silver/Gold
4. ✅ [database_analysis.json](./database_analysis.json) - Données brutes audit
5. ✅ [interface_EBP/](./interface_EBP/) - Interfaces TypeScript (319 fichiers)

### Ressources
- Documentation EBP: https://support.ebp.com
- PostgreSQL Best Practices: https://wiki.postgresql.org/wiki/Performance_Optimization
- Medallion Architecture: https://www.databricks.com/glossary/medallion-architecture
- dbt (data build tool): https://www.getdbt.com
- Metabase: https://www.metabase.com

---

## CONCLUSION

Ce projet de transformation data représente une **opportunité stratégique majeure** :

🎯 **Objectifs**:
- Moderniser interventions terrain (app mobile)
- Exploiter patrimoine data (data warehouse)
- Prédire & anticiper (ML)

💰 **ROI exceptionnel**: 293% (payback 5 mois)

📅 **Timeline réaliste**: 18 mois

✅ **Risques maîtrisés**: POC, déploiement progressif

**Recommandation**: GO pour démarrage immédiat 🚀

---

*Document généré automatiquement - Audit base de données EBP*
*Date: 23 octobre 2025*

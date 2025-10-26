# Audit Technique — DataWarehouse EBP

## 1. Contexte & périmètre

- **Modules couverts** : `EbpToPg_Module` (sync desktop), `backend` (NestJS mobile API), `mobile` (Expo Go app), `Database` (migrations/ETL), `ninja-one_api`.
- **Sources analysées** : code TypeScript/SQL, scripts Node, notes `Audits&Notes`, fichiers README et changelog.
- **Objectifs** : identifier vulnérabilités, dettes techniques et écarts par rapport aux promesses produit (offline-first, supervision terrain, etc.).

## 2. Méthodologie

1. Lecture des documents d’architecture (`CLAUDE.md`, notes PHASE1, README modules).
2. Inspection du code par module (routes, services critiques, migrations SQL, configuration mobile).
3. Vérification ciblée des usages sensibles (authentification, stockage fichiers, accès DB, scripts shell).
4. Synthèse des risques + recommandations actionnables.

## 3. Synthèse exécutive

| Priorité | Risque | Description | Modules |
| --- | --- | --- | --- |
| 🔴 Critique | Identifiants partagés `pass123` | Mot de passe par défaut commun à MSSQL, backend, mobile, import collègues et biométrie. Réutilisé en clair côté client. | Backend, Mobile, Database, EbpToPg |
| 🔴 Critique | API EbpToPg sans sécurité | Endpoints `/api/sync/*` et `/api/backup/*` exposés sans auth/rate limit; commandes shell construites à partir d’entrées utilisateur. | EbpToPg |
| 🟠 Majeur | Workflow calendrier incomplet | Mobile propose reschedule/complete mais backend reste read-only et Android n’affiche aucun prompt valide. | Backend, Mobile |
| 🟠 Majeur | Offline mode inopérant | WatermelonDB désactivé (`database = null`), aucune stratégie cache/sync malgré la promesse offline-first. | Mobile |
| 🟠 Majeur | Couverture de tests quasi nulle | Seul test e2e par défaut “Hello World”. Aucun test uploads, calendrier, intervention, NinjaOne. | Backend, ninja-one_api |
| 🟡 Moyen | Logs & dumps sensibles | `EbpToPg` loggue la config SQL complète, repo DB contient dumps potentiellement productifs. | EbpToPg, Database |
| 🟡 Moyen | Config API mobile figée | Ngrok hardcodé, `BACKEND_IP` inexploité, pas de sélection automatique par environnement. | Mobile |

## 4. Constat détaillé par module

### 4.1 EbpToPg (Desktop Sync)

- **Secrets codés en dur** : fallback `EBP_USER=sa`, `EBP_PASSWORD=@ebp78EBP` (`EbpToPg_Module/clients/ebp.clients.ts:19-20`) et logs en clair (`:40`). Impact : fuite console suffit à compromettre MSSQL.
- **Aucune authentification HTTP** : `src/server.ts` attache directement `syncRoutes`/`backupRoutes` sans guard. Un utilisateur LAN peut déclencher un `drop and create`.
- **Injection shell potentielle** : `BackupService.buildPgDumpCommand` concatène les noms de tables bruts (`src/services/backup.service.ts:101-148`), exposant `pg_dump` à `"; rm -rf /"` si un nom malveillant est fourni.
- **Audit trail absent** : suppression de backups (`backup.routes.ts:137-169`) n’enregistre rien (fichiers, IP, motif).

**Recommandations**
1. Externaliser secrets via OS keychain / `.env` chiffré, supprimer logs sensibles.
2. Ajouter auth (JWT + IP allow-list) et quotas avant d’exposer `/api`.
3. Construire les commandes en mode `spawn` avec arguments séparés + whitelists de tables.
4. Journaliser et notifier toute opération de backup/suppression; conserver au moins N dumps vérifiés.

### 4.2 Backend NestJS (mobile API)

- **`refresh` non fonctionnel** : `AuthController.refresh` recrée un `LoginDto` avec mot de passe vide (`backend/src/mobile/controllers/auth.controller.ts:133`), ce qui se traduira toujours par un `Unauthorized`. Aucun refresh token réel.
- **Workflow calendrier trompeur** : `CalendarService.rescheduleEvent` renvoie “success” mais ne persiste rien (`backend/src/mobile/services/calendar.service.ts:304`). Mobile croit que c’est acté alors que rien n’est modifié côté EBP.
- **Uploads locaux non sécurisés** : `FileService` écrit directement sur disque (`backend/src/mobile/services/file.service.ts:128`), sans antivirus, throttling ni offload vers S3. Concurrent uploads non testés.
- **Tests absents** : seul fichier `test/app.e2e-spec.ts` (sample). Aucun filet sur auth, interventions, calendrier.

**Recommandations**
1. Implémenter un vrai refresh token store (table dédiée + TTL) et endpoint séparé.
2. Créer `mobile.calendar_reschedule_requests` + jobs de synchronisation; documenter que le mode EBP est read-only tant que ce n’est pas fini.
3. Externaliser les fichiers vers stockage objet (S3/MinIO), ajouter redimensionnement et antivirus asynchrone.
4. Couvrir `/api/v1/interventions`, `/api/v1/calendar`, `/api/v1/files` avec tests e2e supervisés (Supertest + DB seed).

### 4.3 Mobile (Expo Go)

- **Identifiants codés en dur** : `LoginScreen` pré-remplit `jordan@… / pass123` (`mobile/src/screens/Auth/LoginScreen.tsx:32`), quick login/switch réutilisent `pass123` (`:188`, `ProfileScreen.tsx:75`). La biométrie l’utilise également (`ProfileScreen.tsx:105-115`).
- **Prompt iOS-only** : `Alert.prompt` dans `InterventionDetailsScreen.v2` (`:114`) n’existe pas sur Android → impossible de clôturer une intervention.
- **Offline inopérant** : `mobile/src/config/database.ts` force `database = null` et loggue un warning. Stores/écrans continuent à promettre le mode offline.
- **Configuration API figée** : `API_CONFIG.BASE_URL` pointe sur un tunnel ngrok (“f572…”) en dur, alors que `BACKEND_IP` n’est jamais utilisé.
- **Pas de caching/sync pour calendrier v2** : `calendar.service.v2` tape directement l’API sans memoisation ni fallback.

**Recommandations**
1. Envelopper les helpers `pass123` derrière un flag `DEV_ONLY`; pour les builds prod, exiger credentials réels + rotation automatique après import.
2. Remplacer `Alert.prompt` par un modal custom (RN Paper Dialog / bottom sheet) commun iOS/Android; profiter pour imposer la saisie de signature/photo avant completion.
3. Décider entre (a) investment offline → activer WatermelonDB via dev build `expo run:*` + synchronisation; ou (b) retirer la mention offline des écrans/notes tant que non livré.
4. Passer `API_CONFIG` sur `expo-constants` + remote config (dotenv) pour ne plus publier de tunnels.
5. Ajouter caching léger (Zustand/SWR) pour calendrier et interventions API-first afin de lisser l’UX.

### 4.4 Database

- **Migration 011** crée deux admins avec hash `pass123` et rappelle que tous les collègues importés auront le même mot de passe (`Database/migrations/011_create_test_users.sql:8-100`).
- **Migration 015** par défaut continue d’injecter ce hash lors des syncs (`Database/migrations/015_import_all_colleagues.sql:13-116`), même pour les inactifs.
- **Nettoyage sessions absent** : pas de migration garantissant index/TTL sur `mobile.user_sessions`, risque de gonflement.
- **Dumps sensibles** dans `Database/dump` + notes audit; potentiellement données clients si repo circule.

**Recommandations**
1. Modifier les migrations pour forcer un mot de passe généré aléatoirement (ou champ `password_reset_token`) et interdire l’utilisation du hash de dev.
2. Ajouter index (`token_jti`, `expires_at`) + job SQL de purge.
3. Chiffrer ou retirer les dumps. Utiliser `git-crypt` ou un stockage externe sécurisé.

### 4.5 NinjaOne API

- **Configuration DB minimale** : `TypeOrmModule` n’impose pas TLS ni pool tuning; `logging: true` exposera toutes les requêtes (PII) en prod (`ninja-one_api/src/app.module.ts:27-38`).
- **Dépendance forte au schéma** : entities pointent `schema: 'ninjaone'` mais aucune migration n’est intégrée dans le service → déploiement vierge échouera.
- **Tests inexistants** : aucune validation sur ingestion tickets/devices; pas de mocks des API NinjaOne.

**Recommandations**
1. Ajouter `ssl: { rejectUnauthorized: true }`, désactiver les logs en prod et régler `maxQueryExecutionTime`.
2. Intégrer les scripts SQL (ou migrations TypeORM) au pipeline de déploiement.
3. Créer tests d’intégration ciblant `TechniciansService`, `TicketsService` avec fixtures NinjaOne simulées.

## 5. Risques transverses

- **Surface d’attaque élargie** : même mot de passe pour EBP MSSQL, NestJS, mobile et import PostgreSQL → compromission chaîne complète.
- **Non-conformité RGPD** : logs/dumps contiennent potentiellement noms/prénoms, adresses, photos, signatures stockées en clair.
- **Dette qualité** : absence de tests automatisés, d’environnement staging documenté et de monitoring (aucun healthcheck authentifié).
- **Promesses produit non tenues** : offline-first, reschedule, biométrie “sécurisée” sont incomplets; risque d’insatisfaction client.

## 6. Plan d’action recommandé

1. **Sécurité & secrets (Semaine 1)**
   - Révoquer tous les comptes `pass123`, générer des mots de passe uniques, forcer reset à la première connexion.
   - Mettre sous coffre les variables MSSQL/Postgres, supprimer logs sensibles.
   - Ajouter auth (JWT + mTLS optionnel) autour d’EbpToPg.
2. **Stabilisation des workflows (Semaines 2‑3)**
   - Finaliser reschedule calendrier (API + UI multiplateforme).
   - Clarifier l’état offline (activer WatermelonDB ou masquer la feature).
   - Déplacer les uploads vers stockage objet et ajouter validations.
3. **Qualité & tests (Semaines 3‑4)**
   - Construire suites e2e NestJS (auth, interventions, calendar, files) + tests unitaires sur NinjaOne.
   - Mettre en place CI avec lint, tests, build mobile.
4. **Observabilité & conformité (Continu)**
   - Ajouter audit logs pour sync/backup, dashboards santé, nettoyage des dumps.
   - Documenter procédure d’accès (ngrok/BASE_URL) et diffuser aux équipes terrain.

---

_Document généré automatiquement par Codex – audit du **[date du jour]**. Mettre à jour après chaque lot de remédiations._ 

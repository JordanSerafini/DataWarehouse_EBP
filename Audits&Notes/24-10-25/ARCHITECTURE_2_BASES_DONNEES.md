# 🏗️ ARCHITECTURE: 2 BASES DE DONNÉES DISTINCTES

**Date**: 2025-10-24

---

## ✅ OUI, TU AS 2 BASES DE DONNÉES SÉPARÉES !

```
┌─────────────────────────────────────────────────────────┐
│  📱 APP MOBILE (sur téléphone technicien)                │
│  ───────────────────────────────────────────            │
│                                                          │
│  WatermelonDB / SQLite                                  │
│  ├─ Base de données LOCALE (embarquée)                 │
│  ├─ Fichier: /storage/database.db                      │
│  ├─ Taille: ~50 MB (50,000 lignes)                     │
│  ├─ Offline-first (fonctionne SANS internet)           │
│  └─ Synchronisée avec serveur                          │
│                                                          │
└─────────────────────────────────────────────────────────┘
                         ↓ ↑
                    SYNC REST API
                   (quand connecté)
                         ↓ ↑
┌─────────────────────────────────────────────────────────┐
│  🖥️  BACKEND NESTJS (sur serveur)                       │
│  ──────────────────────────────────                     │
│                                                          │
│  PostgreSQL (Serveur)                                   │
│  ├─ Base de données SERVEUR (cloud/datacenter)         │
│  ├─ Host: localhost / VPS / AWS RDS                    │
│  ├─ Port: 5432                                          │
│  ├─ Database: ebp_db                                    │
│  ├─ Taille: ~500 MB (670,000 lignes EBP)               │
│  ├─ Schémas: public (EBP) + mobile + ninjaone          │
│  └─ Source de vérité centrale                          │
│                                                          │
└─────────────────────────────────────────────────────────┘
```

---

## 🎯 RÔLES DES 2 BASES

### 1️⃣ PostgreSQL (Serveur) = SOURCE DE VÉRITÉ

**Localisation**: Serveur (VPS, cloud, datacenter)
**Technologie**: PostgreSQL 14+
**Accès**: Backend NestJS uniquement

```sql
-- Base: ebp_db
-- Host: localhost (ou IP serveur)
-- Port: 5432

-- Schémas:
├─ public.*          -- 319 tables EBP (670K lignes)
├─ mobile.*          -- 20+ tables optimisées (50K lignes)
└─ ninjaone.*        -- Tables RMM (965 tickets)
```

**Utilisé pour:**
- ✅ Stocker TOUTES les données EBP (319 tables)
- ✅ Source de vérité centrale
- ✅ Données partagées entre tous les users
- ✅ Logique métier complexe (fonctions PL/pgSQL)
- ✅ Reporting & analytics
- ✅ Synchronisation multi-devices

**TOUJOURS actif** (24/7 sur serveur)

---

### 2️⃣ SQLite (Mobile via WatermelonDB) = CACHE LOCAL

**Localisation**: Smartphone/tablette (stockage interne)
**Technologie**: SQLite 3 (via WatermelonDB)
**Accès**: App mobile uniquement

```
Fichier local: /data/app/com.ebp.mobile/database.db
Taille: ~50 MB (50,000 lignes)

Tables locales (mirror de mobile.*):
├─ interventions      -- Interventions du technicien
├─ customers          -- Clients du secteur
├─ projects           -- Chantiers en cours
├─ timesheets         -- Temps passés
├─ expenses           -- Notes de frais
├─ products           -- Catalogue produits
└─ colleagues         -- Équipe
```

**Utilisé pour:**
- ✅ Fonctionner OFFLINE (sans internet)
- ✅ Cache local des données du technicien
- ✅ Performance rapide (pas de latence réseau)
- ✅ Créer données offline (sync plus tard)
- ✅ Économiser batterie (moins de requêtes réseau)

**N'existe que sur le device** (perdu si app désinstallée)

---

## 🔄 SYNCHRONISATION ENTRE LES 2 BASES

### Flow Complet

```
┌─────────────────────────────────────────────────────────┐
│  ÉTAPE 1: INSTALLATION APP (Sync initiale)              │
└─────────────────────────────────────────────────────────┘

1. Technicien installe app mobile
2. Login avec JWT
3. App appelle: POST /api/v1/sync/initial

   Backend NestJS:
   ├─ Exécute: SELECT * FROM mobile.initial_sync_all()
   ├─ Retourne 50,000 lignes optimisées
   └─ Durée: ~30 secondes

4. WatermelonDB insère dans SQLite local
5. Technicien peut maintenant travailler OFFLINE


┌─────────────────────────────────────────────────────────┐
│  ÉTAPE 2: TRAVAIL OFFLINE                               │
└─────────────────────────────────────────────────────────┘

Technicien sur terrain (PAS de wifi/4G):

1. Consulte ses interventions → SQLite local ✅
2. Ajoute photos → Stockées localement ✅
3. Crée timesheet → SQLite local (synced_to_ebp=false) ✅
4. Crée note de frais → SQLite local (temp_id UUID) ✅

Tout fonctionne sans internet!


┌─────────────────────────────────────────────────────────┐
│  ÉTAPE 3: RETOUR CONNECTIVITÉ (Sync automatique)        │
└─────────────────────────────────────────────────────────┘

Technicien arrive chez lui (wifi):

1. App détecte connectivité (NetInfo)
2. Auto-sync déclenché

   A. PUSH (mobile → serveur):
      ├─ WatermelonDB détecte changements locaux
      ├─ POST /api/v1/sync/mark-synced
      ├─ Backend NestJS insère dans PostgreSQL
      └─ Retourne vrais IDs (remplace temp_id)

   B. PULL (serveur → mobile):
      ├─ GET /api/v1/sync/pending?since=lastPulledAt
      ├─ Backend retourne changements depuis dernière sync
      ├─ WatermelonDB applique dans SQLite local
      └─ Conflict resolution si nécessaire

3. Sync terminée ✅
4. Données cohérentes sur serveur + mobile


┌─────────────────────────────────────────────────────────┐
│  ÉTAPE 4: SYNC PÉRIODIQUE (Background)                  │
└─────────────────────────────────────────────────────────┘

Background task (toutes les 15 minutes si connecté):
├─ Push changements locaux
├─ Pull nouveaux changements serveur
└─ Durée: ~5 secondes (delta seulement)
```

---

## 📊 COMPARAISON TECHNIQUE

| Critère | PostgreSQL (Serveur) | SQLite (Mobile) |
|---------|---------------------|-----------------|
| **Localisation** | Serveur cloud/VPS | Smartphone |
| **Taille DB** | 500 MB (670K lignes) | 50 MB (50K lignes) |
| **Accès** | Backend NestJS | App mobile uniquement |
| **Architecture** | Client-Server (daemon) | Embedded (in-process) |
| **Connexion** | TCP/IP (port 5432) | Fichier local |
| **Multi-users** | ✅ Oui (100+ connexions) | ❌ Non (1 app) |
| **Transactions** | ✅ ACID complet | ✅ ACID local |
| **Schémas** | public, mobile, ninjaone | Tables mirror mobile.* |
| **Fonctions** | PL/pgSQL complexes | ❌ Minimal |
| **Full-text search** | ✅ tsvector | ⚠️ Limité |
| **JSON** | ✅ JSONB indexé | ⚠️ JSON texte |
| **PostGIS** | ✅ Géospatial | ❌ Non |
| **Offline** | ❌ Internet requis | ✅ Fonctionne offline |
| **Latence** | 50-300ms (réseau) | <1ms (local) |
| **Backup** | ✅ pg_dump quotidien | ⚠️ Sync = backup |

---

## 💡 EXEMPLE CONCRET

### Scénario: Technicien crée intervention

**Code mobile (React Native + WatermelonDB)**

```typescript
// Sur le smartphone (SQLite local)
import { database } from './database';

async function createIntervention() {
  await database.write(async () => {
    const intervention = await database.collections
      .get('interventions')
      .create(intervention => {
        intervention.tempId = uuid();              // ID temporaire
        intervention.subject = "Réparation chauffage";
        intervention.customerId = "CUST123";
        intervention.colleagueId = currentUser.id;
        intervention.syncedToEbp = false;         // Pas encore sur serveur
        intervention.deviceId = DeviceInfo.getUniqueId();
        intervention.createdAt = Date.now();
      });

    // ✅ Intervention créée dans SQLite LOCAL
    // ✅ Utilisateur continue à travailler OFFLINE
  });
}

// Plus tard: Sync automatique quand connecté
await synchronize({
  database,

  pushChanges: async ({ changes }) => {
    // Envoyer vers backend NestJS
    const response = await axios.post(
      'https://api.ebp.com/api/v1/sync/mark-synced',
      { changes, deviceId: DEVICE_ID }
    );

    // Backend insère dans PostgreSQL serveur
    return response.data;
  }
});
```

**Code backend (NestJS + PostgreSQL)**

```typescript
// Sur le serveur (PostgreSQL)
@Post('sync/mark-synced')
async markSynced(@Body() dto: SyncDto) {
  // Recevoir données du mobile
  const { changes, deviceId } = dto;

  // Insérer dans PostgreSQL serveur
  await this.databaseService.query(`
    INSERT INTO mobile.interventions (
      temp_id,
      subject,
      customer_id,
      colleague_id,
      device_id,
      synced_to_ebp,
      created_at
    ) VALUES ($1, $2, $3, $4, $5, true, $6)
    RETURNING id AS ebp_id
  `, [
    changes.tempId,
    changes.subject,
    changes.customerId,
    changes.colleagueId,
    deviceId,
    changes.createdAt
  ]);

  // ✅ Intervention maintenant dans PostgreSQL serveur
  // ✅ Accessible à tous les users connectés
  // ✅ Mobile recevra vrai ebp_id au prochain pull
}
```

---

## 🎯 AVANTAGES ARCHITECTURE 2 BASES

### ✅ Avantages

**Offline-first**
- Technicien travaille SANS internet
- Pas de "Loading..." permanent
- Performance maximale (local = instant)

**Scalabilité**
- 100 techniciens = 100 SQLite locaux indépendants
- PostgreSQL serveur = 1 seul (source de vérité)
- Pas de charge serveur si offline

**Batterie**
- Moins de requêtes réseau = économie batterie
- 4G/5G consomme beaucoup d'énergie

**User Experience**
- App fluide (60 FPS scroll)
- Pas de timeouts réseau
- Fonctionne en zone blanche (campagne)

**Sécurité**
- JWT expiré ? → Continue offline avec cache local
- Serveur down ? → App fonctionne quand même
- Données sensibles ? → Chiffrement SQLite local

### ⚠️ Inconvénients (gérables)

**Complexité sync**
- Code sync nécessaire (résolu par WatermelonDB)
- Conflict resolution (stratégie à définir)

**Duplication données**
- Même données sur serveur + mobile
- Mais seulement 50K lignes mobile vs 670K serveur (92% réduction)

**Cohérence différée**
- Changements pas immédiatement partagés
- Acceptable pour field service (sync toutes les 15 min OK)

---

## 🔒 SÉCURITÉ

### PostgreSQL Serveur

```
✅ Firewall (port 5432 fermé publiquement)
✅ SSL/TLS connections
✅ Rôles PostgreSQL (postgres, api_user, readonly)
✅ Row-level security (RLS)
✅ Backup quotidien (pg_dump)
✅ WAL archiving (point-in-time recovery)
```

### SQLite Mobile

```
✅ SQLCipher (chiffrement AES-256)
✅ Pas de données sensibles (mots de passe sur serveur)
✅ JWT stocké dans SecureStore (pas SQLite)
✅ App désinstallée = base supprimée
✅ Sync = backup automatique sur serveur
```

---

## 📈 SIZING

### PostgreSQL Serveur

```
Données actuelles:
├─ public.* (EBP): 670,000 lignes → ~450 MB
├─ mobile.*: 50,000 lignes → ~35 MB
└─ ninjaone.*: 1,000 lignes → ~5 MB
TOTAL: ~500 MB

Données dans 1 an (estimation):
├─ public.* (EBP): 1,000,000 lignes → ~700 MB
├─ mobile.*: 80,000 lignes → ~60 MB
└─ ninjaone.*: 5,000 lignes → ~20 MB
TOTAL: ~800 MB

Sizing serveur recommandé:
├─ CPU: 4 vCPU
├─ RAM: 16 GB
├─ Storage: 200 GB SSD
└─ Coût: ~100€/mois (AWS RDS / Hetzner)
```

### SQLite Mobile

```
Données synchronisées par device:
├─ Interventions (30 jours): ~2,000 lignes → 5 MB
├─ Customers (secteur): ~1,000 lignes → 8 MB
├─ Products (catalogue): ~5,000 lignes → 12 MB
├─ Timesheets (30 jours): ~500 lignes → 2 MB
├─ Expenses (30 jours): ~200 lignes → 1 MB
├─ Photos (cache): ~100 photos → 20 MB
TOTAL: ~50 MB par device

Sizing mobile:
├─ Stockage app: 50-100 MB
├─ Compatible: iPhone 8+ / Android 8+
├─ RAM: 2 GB minimum
└─ Offline viable: 30 jours sans sync
```

---

## 🎓 RÉSUMÉ SIMPLIFIÉ

### Pour expliquer à un non-tech:

```
┌────────────────────────────────────────────┐
│  ANALOGIE: Gmail                            │
├────────────────────────────────────────────┤
│                                             │
│  Gmail mobile app = SQLite local            │
│  ├─ Emails téléchargés sur smartphone      │
│  ├─ Lecture offline possible               │
│  └─ Rédaction brouillon offline            │
│                                             │
│  Gmail serveurs Google = PostgreSQL         │
│  ├─ Tous les emails stockés                │
│  ├─ Source de vérité                       │
│  └─ Synchronisation avec tous devices      │
│                                             │
│  Sync = Quand tu as internet                │
│  ├─ Envoi brouillons → serveur             │
│  ├─ Téléchargement nouveaux emails         │
│  └─ Cohérence multi-devices                │
└────────────────────────────────────────────┘
```

**C'est EXACTEMENT pareil pour ton app EBP mobile:**

- **SQLite mobile (WatermelonDB)** = Cache local pour travailler offline
- **PostgreSQL serveur** = Toutes les données centralisées
- **Sync API** = Synchronisation bidirectionnelle

---

## ✅ RÉPONSE À TA QUESTION

> "C'est que pour la DB embarquée ? Mon backend NestJS sera toujours sur PostgreSQL ?"

**OUI ! 100% CORRECT !**

```
✅ Backend NestJS → TOUJOURS sur PostgreSQL serveur
✅ App mobile → SQLite local (via WatermelonDB)
✅ Sync REST API → Synchronise les 2 bases
```

**Tu n'as RIEN à changer sur ton backend actuel:**
- ✅ PostgreSQL reste ton serveur de DB
- ✅ NestJS reste ton API REST
- ✅ Toute ta logique métier reste identique
- ✅ Tu ajoutes juste des endpoints de sync

**WatermelonDB = UNIQUEMENT pour le mobile:**
- Remplace PostgreSQL UNIQUEMENT sur le smartphone
- Pas de daemon PostgreSQL sur mobile (impossible)
- SQLite = seule option bases embarquées

---

## 📝 CHECKLIST

**Backend (ce qui NE CHANGE PAS):**
- ✅ PostgreSQL serveur (déjà configuré)
- ✅ NestJS (déjà développé)
- ✅ Schéma mobile.* (déjà créé)
- ✅ API REST (déjà fonctionnelle)

**Mobile (ce qui est NOUVEAU):**
- ⬜ App React Native + Expo
- ⬜ WatermelonDB (SQLite local)
- ⬜ Sync Manager (pull/push)
- ⬜ Offline mode

**Sync API (à ajouter backend):**
- ✅ POST /sync/initial (déjà fait!)
- ✅ POST /sync/mark-synced (déjà fait!)
- ✅ GET /sync/pending (déjà fait!)

**Tu as déjà tout le backend ! Il ne reste que le mobile à développer.**

---

**TL;DR**: Oui, 2 bases distinctes. PostgreSQL serveur (backend) + SQLite local (mobile). Sync automatique entre les 2. Backend NestJS ne change pas.

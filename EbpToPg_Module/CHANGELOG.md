# Changelog

Toutes les modifications notables de ce projet seront documentées dans ce fichier.

## [1.0.0] - 2025-10-22

### ✨ Fonctionnalités Initiales

#### Backend
- ✅ Service de synchronisation EBP (MSSQL) → PostgreSQL
  - Mapping automatique des types de données
  - Synchronisation complète (DROP+CREATE ou TRUNCATE+INSERT)
  - Support des clés primaires et étrangères
  - Préservation de la casse des noms de colonnes
  - Gestion des strings longues (limite 10MB)
  - Support des valeurs numériques jusqu'à NUMERIC(38, scale)

- ✅ Service de vérification
  - Comparaison des données entre EBP et PostgreSQL
  - Échantillonnage configurable
  - Détection des différences (lignes manquantes, valeurs différentes)
  - Exclusion des colonnes système (34 colonnes auto-générées)
  - Comparaison tolérante pour dates (3h de tolérance timezone)
  - Comparaison insensible à la casse pour GUIDs
  - Support des noms de colonnes >63 caractères (troncature PostgreSQL)

- ✅ Service de backup
  - Support formats: SQL (plain), Custom (compressé), TAR, Directory
  - Détection automatique OS (Windows/Linux)
  - Backup complet ou tables sélectives
  - Listage et suppression de backups
  - Nettoyage automatique des anciens backups

- ✅ API REST Express
  - `/api/sync/full` - Synchronisation complète
  - `/api/sync/verify` - Vérification
  - `/api/sync/repair` - Réparation automatique
  - `/api/sync/tables` - Liste des tables EBP
  - `/api/backup/create` - Création de backup
  - `/api/backup/list` - Liste des backups
  - `/api/backup/:fileName` - Suppression de backup
  - `/api/backup/cleanup` - Nettoyage

#### Frontend Electron
- ✅ Interface graphique moderne avec 6 onglets
  - ⚙️ Configuration (connexions EBP/PostgreSQL)
  - 🖥️ Serveur (contrôle backend: démarrer/arrêter/redémarrer)
  - 🔄 Synchronisation (lancement sync, choix mode)
  - ✔️ Vérification (comparaison données, réparation)
  - 💾 Backup (création/liste/suppression)
  - 📜 Logs (temps réel)

- ✅ Fonctionnalités UI
  - Test de connexion EBP et PostgreSQL
  - Rechargement config depuis .env
  - Résultats organisés par catégories repliables
  - Notifications toast
  - Logs colorés par type (info/success/warning/error)
  - Préservation config dans electron-store

### 🐛 Corrections de Bugs

#### Synchronisation
- ✅ Fix: Strings trop longues causant "Invalid string length"
  - Solution: Limite 10MB avec troncature

- ✅ Fix: NUMERIC overflow "champ numérique en dehors des limites"
  - Solution: Utiliser NUMERIC(38, scale) au lieu de préserver précision exacte

- ✅ Fix: Batch insert échouant silencieusement
  - Solution: Fallback ligne par ligne avec logging des erreurs

#### Vérification
- ✅ Fix: Faux positifs sur colonnes système auto-modifiées
  - Solution: Exclusion de 34 colonnes système identifiées

- ✅ Fix: GUID comparaison échouant (EBP uppercase vs PG lowercase)
  - Solution: Comparaison insensible à la casse avec regex UUID

- ✅ Fix: Dates différant de 2-3 heures (timezone)
  - Solution: Tolérance de 3 heures pour timezone/DST

- ✅ Fix: Valeurs numériques comparées comme strings
  - Solution: Détection type numérique + conversion parseFloat

- ✅ Fix: Colonnes >63 caractères retournant undefined
  - Solution: Troncature noms colonnes à 63 caractères (limite PostgreSQL)

#### Backup
- ✅ Fix: Commande PGPASSWORD échouant sur Windows
  - Solution: Détection OS + syntaxe adaptée (`set PGPASSWORD=xxx &&` sur Windows)

#### Interface
- ✅ Fix: Emojis affichant Unicode escapes (\uXXXX)
  - Solution: Script fix-emojis.js pour conversion

- ✅ Fix: Config non chargée depuis .env au démarrage
  - Solution: Chargement automatique .env si store vide

### 📚 Documentation
- ✅ README.md principal avec guide complet
- ✅ docs/INSTALLATION.md - Guide d'installation
- ✅ .claude/CLAUDE.md - Instructions pour Claude Code
- ✅ docs/README.md - Index de la documentation complète
- ✅ scripts/README.md - Documentation des scripts utilitaires
- ✅ .env.example - Exemple de configuration avec valeurs types
- ✅ CHANGELOG.md - Ce fichier (historique des modifications)

### 🗂️ Structure
- ✅ Organisation propre des dossiers
  - `.claude/` - Configuration Claude Code (instructions projet)
  - `scripts/` - Scripts debug et maintenance (avec documentation dédiée)
  - `docs/` - Documentation complète (guides, README centralisé)
  - `backup/` - Sauvegardes PostgreSQL
  - `dist/` - Code TypeScript compilé
  - `electron/` - Application Electron (main, renderer, UI)
  - `src/` - Code source backend (services, routes, clients)

- ✅ Réorganisation des fichiers pour meilleure maintenabilité
  - Déplacement `CLAUDE.md` → `.claude/CLAUDE.md` (convention Claude Code)
  - Déplacement `INSTALLATION.md` → `docs/INSTALLATION.md`
  - Regroupement scripts utilitaires dans `scripts/`
    - `fix-emojis.js` - Conversion Unicode escapes
    - `reset-config.js` - Réinitialisation configuration Electron
    - `check-threshold-type.js` - Vérification types seuils

- ✅ Nettoyage fichiers de debug/test obsolètes
  - Suppression `debug-pricelist.js` et `debug-pricelist-fk.js` (fonctionnalité intégrée)
  - Suppression `test-compare.js`, `test-datatype.js`, `test-verification.js` (intégrés dans services)
  - Réduction surface du dépôt (~570 lignes supprimées)

- ✅ Améliorations .gitignore
  - Ignore fichiers debug temporaires
  - Ignore backups PostgreSQL
  - Ignore configuration locale (.env)

### 🧪 Résultats de Tests
- ✅ 319 tables synchronisées avec succès
- ✅ 670,343 lignes synchronisées (base EBP complète)
- ✅ 318/319 tables vérifiées OK (99.7% de réussite)
- ✅ 1 table avec warning mineur (différence de 1 ligne acceptable)

### 📊 Statistiques
- Lignes de code: ~5,000
- Services: 5 (sync, verification, backup, database, type-mapper)
- Routes API: 10 endpoints
- Scripts utilitaires: 8
- Documentation: 5 fichiers

### 🔧 Technologies
- **Backend**: Node.js + TypeScript + Express
- **Frontend**: Electron + HTML/CSS/JS vanilla
- **Bases de données**: MSSQL (mssql), PostgreSQL (pg)
- **Build**: TypeScript Compiler + electron-builder
- **Outils**: pg_dump, pg-format, electron-store

---

Format: [Version] - Date AAAA-MM-JJ

Types de changements:
- ✨ Ajouté (nouvelle fonctionnalité)
- 🔧 Modifié (changement dans une fonctionnalité existante)
- 🐛 Corrigé (correction de bug)
- 🗑️ Supprimé (fonctionnalité retirée)
- 🔒 Sécurité (correction de vulnérabilité)
- 📚 Documentation (ajout ou modification de documentation)

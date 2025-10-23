# EBP Sync Manager

Application desktop pour synchroniser automatiquement votre base de données EBP vers PostgreSQL.

## 🎯 Fonctionnalités

- ✅ **Configuration simple** des connexions EBP et PostgreSQL
- 🔄 **Synchronisation complète** avec mapping automatique des types MSSQL → PostgreSQL
- ✔️ **Vérification de synchronisation** pour détecter les différences
- 🔧 **Réparation automatique** des problèmes détectés
- 💾 **Backup automatique** de la base PostgreSQL
- 📊 **Interface graphique intuitive** - conçue pour les non-techniciens
- 🖥️ **Contrôle du serveur backend** (démarrer, arrêter, redémarrer)
- 📜 **Logs en temps réel** pour suivre les opérations

## 📋 Prérequis

- **Node.js** version 18 ou supérieure
- **PostgreSQL** installé localement (version 12+)
- **pg_dump** (inclus avec PostgreSQL) pour les backups
- **Accès à votre serveur EBP** (MSSQL Server)

## 🚀 Installation

### 1. Installer les dépendances

```bash
npm install
```

### 2. Configurer les variables d'environnement

Le fichier `.env` est déjà configuré avec vos paramètres:

```env
# PostgreSQL (local)
PG_USER=postgres
PG_PASSWORD=postgres
PG_DATABASE=ebp_db
PG_PORT=5432

# EBP (source)
CLIENT_EBP_SERVER=SRVEBP-2022\SRVEBP
CLIENT_EBP_DATABASE=Solution Logique_0895452f-b7c1-4c00-a316-c6a6d0ea4bf4
EBP_USER=sa
EBP_PASSWORD=

# Application
PORT=3000
```

Vous pouvez aussi configurer ces paramètres directement dans l'interface graphique.

### 3. Compiler le code TypeScript

```bash
npm run build
```

### 4. Lancer l'application

```bash
npm run electron
```

Ou en mode développement (avec rechargement automatique):

```bash
npm run electron:dev
```

## 📖 Utilisation

### Configuration initiale

1. **Lancez l'application** avec `npm run electron`
2. Allez dans l'onglet **⚙️ Configuration**
3. **Vérifiez les paramètres** EBP et PostgreSQL
4. Cliquez sur **🔌 Tester la connexion** pour chaque base
5. Cliquez sur **💾 Sauvegarder la configuration**

### Contrôle du serveur backend

L'onglet **🖥️ Serveur** permet de:
- ▶️ **Démarrer** le serveur backend
- ⏹️ **Arrêter** le serveur
- 🔄 **Redémarrer** le serveur
- 📊 Voir l'**état du serveur** (PID, port, statut)
- 📜 Consulter les **logs en temps réel**
- 📋 Vérifier les **informations de connexion**

### Synchronisation complète

1. Allez dans l'onglet **🔄 Synchronisation**
2. Choisissez le mode:
   - ☑️ **Mode destructif**: Supprime et recrée les tables (recommandé pour la première synchro)
   - ☐ **Mode incrémental**: Vide seulement les tables existantes
3. (Optionnel) Spécifiez des tables spécifiques (ex: `customers,items`)
4. Cliquez sur **🚀 Lancer la Synchronisation Complète**

### Vérification de la synchronisation

1. Allez dans l'onglet **✔️ Vérification**
2. (Optionnel) Spécifiez les tables à vérifier
3. Ajustez le nombre d'échantillons (100 par défaut, 0 = toutes les lignes)
4. Cliquez sur **🔍 Lancer la Vérification**
5. Si des problèmes sont détectés, cliquez sur **🔧 Réparer**

### Création de backups

1. Allez dans l'onglet **💾 Backup**
2. Choisissez le format:
   - **SQL**: Fichier texte lisible
   - **Custom**: Format compressé PostgreSQL
3. (Optionnel) Spécifiez des tables spécifiques
4. Cliquez sur **💾 Créer un Backup**
5. Les backups sont sauvegardés dans le dossier `/backup`

### Consultation des logs

L'onglet **📜 Logs** affiche tous les événements en temps réel:
- ℹ️ Informations
- ✅ Succès
- ⚠️ Avertissements
- ❌ Erreurs

## 🛠️ Utilisation avancée (API REST)

Le serveur backend expose également une API REST sur `http://localhost:3000/api`:

### Synchronisation

```bash
# Synchronisation complète
curl -X POST http://localhost:3000/api/sync/full \
  -H "Content-Type: application/json" \
  -d '{"dropAndCreate": true}'

# Synchroniser des tables spécifiques
curl -X POST http://localhost:3000/api/sync/full \
  -H "Content-Type: application/json" \
  -d '{"tables": ["customers", "items"], "dropAndCreate": false}'
```

### Vérification

```bash
# Vérifier toutes les tables
curl -X POST http://localhost:3000/api/sync/verify \
  -H "Content-Type: application/json" \
  -d '{"sampleSize": 100}'
```

### Backup

```bash
# Créer un backup
curl -X POST http://localhost:3000/api/backup/create \
  -H "Content-Type: application/json" \
  -d '{"format": "plain"}'

# Lister les backups
curl http://localhost:3000/api/backup/list
```

## 📁 Structure du Projet

```
EbpToPg_Module/
├── clients/          # Clients de connexion (EBP, PostgreSQL)
├── src/              # Code source TypeScript
│   ├── services/     # Services métier (sync, verification, backup)
│   ├── routes/       # Routes API Express
│   └── server.ts     # Serveur backend
├── electron/         # Application Electron (interface graphique)
│   ├── main.js       # Process principal Electron
│   ├── index.html    # Interface utilisateur
│   ├── renderer.js   # Logique frontend
│   └── styles.css    # Styles
├── backup/           # Dossier de sauvegarde (généré automatiquement)
├── scripts/          # Scripts utilitaires et debug
│   └── README.md     # Documentation des scripts
├── docs/             # Documentation complète
│   ├── README.md     # Index de la documentation
│   ├── INSTALLATION.md
│   └── CLAUDE.md
├── dist/             # Code compilé (généré par TypeScript)
└── README.md         # Ce fichier
```

### 📚 Documentation

- **[docs/README.md](./docs/README.md)** - Index complet de la documentation
- **[docs/INSTALLATION.md](./docs/INSTALLATION.md)** - Guide d'installation détaillé
- **[scripts/README.md](./scripts/README.md)** - Documentation des scripts utilitaires

## 📦 Construction de l'exécutable

Pour créer un fichier exécutable autonome:

```bash
# Windows
npm run electron:build:win

# Le fichier .exe sera dans le dossier /release
```

## 🔧 Dépannage

### La base PostgreSQL n'existe pas

L'application crée automatiquement la base de données PostgreSQL si elle n'existe pas.

### Erreur de connexion EBP

- Vérifiez que le serveur EBP est accessible
- Vérifiez le format du serveur: `NOM_SERVEUR\INSTANCE`
- Vérifiez les identifiants (utilisateur/mot de passe)

### pg_dump non trouvé

Ajoutez PostgreSQL au PATH de votre système:
- Windows: `C:\Program Files\PostgreSQL\16\bin`

### Le serveur ne démarre pas

- Vérifiez que le port 3000 n'est pas déjà utilisé
- Consultez les logs dans l'onglet Serveur
- Essayez de redémarrer le serveur avec le bouton 🔄

## 📝 Mapping des types

L'application mappe automatiquement les types MSSQL vers PostgreSQL:

| MSSQL | PostgreSQL |
|-------|-----------|
| `bit` | `BOOLEAN` |
| `int` | `INTEGER` |
| `bigint` | `BIGINT` |
| `varchar(n)` | `VARCHAR(n)` |
| `nvarchar(n)` | `VARCHAR(n)` |
| `decimal(p,s)` | `NUMERIC(p,s)` |
| `datetime` | `TIMESTAMP` |
| `uniqueidentifier` | `UUID` |
| `varbinary` | `BYTEA` |

**Note**: Les noms de colonnes sont préservés avec leur casse exacte (ex: `customer.Id`, `caption`).

## 🤝 Support

Pour toute question ou problème:
1. Consultez d'abord les **logs** dans l'application
2. Vérifiez les **informations de connexion** dans l'onglet Serveur
3. Testez les **connexions** dans l'onglet Configuration

## 📄 Licence

ISC

## 👤 Auteur

Jordan S.

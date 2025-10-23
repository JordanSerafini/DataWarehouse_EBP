# Documentation EBP to PostgreSQL Sync

Documentation complète du projet de synchronisation EBP (MSSQL) vers PostgreSQL.

## 📚 Guides

### [INSTALLATION.md](./INSTALLATION.md)
Guide d'installation et de configuration du projet.

**Contenu:**
- Prérequis système
- Installation des dépendances
- Configuration de la base de données
- Premier lancement

### [CLAUDE.md](./CLAUDE.md)
Notes de développement et historique du projet avec Claude.

**Contenu:**
- Historique des modifications
- Décisions techniques
- Résolution de problèmes
- Améliorations futures

## 🔗 Liens Utiles

- [README Principal](../README.md) - Vue d'ensemble du projet
- [Scripts Utilitaires](../scripts/README.md) - Scripts de debug et maintenance
- [Configuration](../.env.example) - Exemple de configuration

## 📝 Structure du Projet

```
EbpToPg_Module/
├── clients/          # Clients de connexion aux bases de données
├── src/              # Code source TypeScript
│   ├── services/     # Services métier
│   ├── routes/       # Routes API Express
│   └── server.ts     # Serveur principal
├── electron/         # Interface Electron
│   ├── main.js       # Process principal
│   ├── index.html    # Interface utilisateur
│   └── renderer.js   # Logique frontend
├── backup/           # Dossier de sauvegarde
├── scripts/          # Scripts utilitaires
└── docs/             # Documentation (vous êtes ici)
```

## 🚀 Démarrage Rapide

1. **Installation:**
   ```bash
   npm install
   ```

2. **Configuration:**
   - Copier `.env.example` vers `.env`
   - Configurer les connexions EBP et PostgreSQL

3. **Lancement:**
   ```bash
   npm run electron
   ```

## 🔧 Développement

- **Backend:** `npm run dev`
- **Build:** `npm run build`
- **Electron (dev):** `npm run electron:dev`
- **Build Windows:** `npm run electron:build:win`

## ❓ Support

Pour toute question ou problème, consulter:
1. [README.md](../README.md) - Documentation générale
2. [INSTALLATION.md](./INSTALLATION.md) - Guide d'installation
3. [Issues GitHub](https://github.com/votre-repo/issues) - Signaler un bug

# 🚀 Guide d'Installation - EBP Sync Manager

Ce guide vous explique comment installer et utiliser l'application EBP Sync Manager.

## 📦 Première Installation (À faire une seule fois)

### Étape 1: Installer les dépendances

1. Ouvrez le dossier du projet
2. Double-cliquez sur le fichier **`Lancer EBP Sync.bat`**
3. La première fois, tapez `npm install` dans la fenêtre qui s'ouvre
4. Attendez que l'installation se termine (peut prendre quelques minutes)

**OU** ouvrez un terminal (PowerShell ou CMD) dans ce dossier et tapez:
```bash
npm install
```

### Étape 2: Compiler le code TypeScript

Dans le terminal, tapez:
```bash
npm run build
```

## 🎯 Utilisation Quotidienne

### Option 1: Fichier Batch (le plus simple)

Double-cliquez simplement sur **`Lancer EBP Sync.bat`**

L'application se lance automatiquement!

### Option 2: Terminal

Ouvrez un terminal dans le dossier et tapez:
```bash
npm run electron
```

## 📦 Créer un Exécutable Autonome (Recommandé pour distribution)

Pour créer un fichier `.exe` que vos clients peuvent utiliser sans Node.js:

### 1. Installer les dépendances (si pas déjà fait)

```bash
npm install
```

### 2. Compiler le code

```bash
npm run build
```

### 3. Créer l'exécutable

```bash
npm run electron:build:win
```

### 4. Récupérer l'exécutable

L'exécutable sera créé dans le dossier **`release/`**:
- Cherchez le fichier `EBP Sync Manager Setup.exe`
- C'est un installateur que vous pouvez donner à vos clients
- Ils n'auront qu'à double-cliquer dessus pour installer l'application

Une fois installée, ils trouveront "EBP Sync Manager" dans leur menu Démarrer Windows.

## 🎨 Personnalisation (Optionnel)

### Changer l'icône de l'application

1. Créez ou téléchargez une icône:
   - Format Windows: `.ico` (256x256 pixels recommandé)
   - Vous pouvez utiliser un service en ligne comme https://www.icoconverter.com/

2. Placez l'icône dans `electron/assets/icon.ico`

3. Reconstruisez l'exécutable:
   ```bash
   npm run electron:build:win
   ```

## ⚙️ Configuration

La première fois que vous lancez l'application:

1. Allez dans l'onglet **⚙️ Configuration**
2. Remplissez les informations de connexion:
   - **EBP**: Serveur, base de données, identifiants
   - **PostgreSQL**: Hôte, port, base de données, identifiants
3. Testez chaque connexion avec les boutons **🔌 Tester**
4. Sauvegardez avec **💾 Sauvegarder la configuration**

## 🔄 Workflow Typique

1. **Lancer l'application** (double-clic sur le .bat ou l'exe)
2. **Vérifier** que le serveur est démarré (onglet Serveur)
3. **Synchroniser** vos données (onglet Synchronisation)
4. **Vérifier** la synchronisation (onglet Vérification)
5. **Créer un backup** si nécessaire (onglet Backup)

## ❓ Problèmes Courants

### "npm n'est pas reconnu"

Vous devez installer Node.js:
1. Téléchargez sur https://nodejs.org/
2. Installez la version LTS (recommandée)
3. Redémarrez votre ordinateur
4. Relancez l'installation

### "Impossible de se connecter à EBP"

- Vérifiez que le serveur EBP est allumé et accessible
- Vérifiez le nom du serveur (format: `NOM\INSTANCE`)
- Vérifiez vos identifiants

### "PostgreSQL ne se connecte pas"

- Vérifiez que PostgreSQL est installé et démarré
- Par défaut: `localhost:5432`
- Utilisateur par défaut: `postgres`

### L'application ne se lance pas

1. Vérifiez que vous avez bien fait `npm install`
2. Vérifiez que vous avez fait `npm run build`
3. Consultez les logs dans la console

## 📞 Distribution aux Clients

Pour distribuer l'application à vos clients:

1. **Créez l'installateur** avec `npm run electron:build:win`
2. **Récupérez** le fichier dans `release/EBP Sync Manager Setup.exe`
3. **Envoyez** cet installateur à vos clients
4. Ils n'ont qu'à **double-cliquer** et suivre l'installation
5. L'application apparaîtra dans leur **menu Démarrer**

L'installateur inclut tout ce qui est nécessaire - pas besoin de Node.js pour les clients!

## 📋 Prérequis Clients

Vos clients auront seulement besoin de:
- ✅ Windows 10 ou supérieur
- ✅ PostgreSQL installé localement
- ✅ Accès réseau au serveur EBP

C'est tout! 🎉

## 🔐 Sécurité

Les mots de passe sont stockés localement sur l'ordinateur de l'utilisateur dans un fichier chiffré par Electron. Ils ne sont jamais envoyés ailleurs que vers les serveurs de bases de données configurés.

## 💡 Conseil

Pour une utilisation optimale, créez un raccourci de l'application sur le Bureau de vos clients après l'installation!

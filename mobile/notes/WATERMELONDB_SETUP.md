# WatermelonDB avec Expo - Guide Complet

## ⚠️ IMPORTANT: Expo Go ne supporte PAS WatermelonDB

**WatermelonDB nécessite du code natif** qui n'est pas disponible dans l'application Expo Go standard.

Vous avez **2 options**:

---

## Option 1: Créer un Development Build (RECOMMANDÉ)

Un Development Build est une version personnalisée de votre app qui inclut le code natif de WatermelonDB.

### Méthode A: Build Local (Plus Rapide)

#### Prérequis
- **Android**: Android Studio + SDK installés
- **iOS**: macOS + Xcode installés

#### Commandes

**Pour Android:**
```bash
cd mobile
npx expo run:android
```

Cette commande va:
1. Installer automatiquement le code natif de WatermelonDB
2. Compiler l'application
3. Lancer l'app sur votre émulateur/appareil Android

**Pour iOS (macOS uniquement):**
```bash
cd mobile
npx expo run:ios
```

#### Avantages
- ✅ Gratuit
- ✅ Rapide (pas de queue de build)
- ✅ Modifications natives appliquées immédiatement

#### Inconvénients
- ❌ Nécessite Android Studio (Windows/Linux) ou Xcode (macOS)
- ❌ Configuration initiale plus complexe

---

### Méthode B: EAS Build (Cloud) - Plus Simple

EAS Build compile votre application dans le cloud (serveurs Expo).

#### 1. Installation de EAS CLI
```bash
npm install -g eas-cli
```

#### 2. Connexion à votre compte Expo
```bash
eas login
```
(Créez un compte gratuit sur https://expo.dev si vous n'en avez pas)

#### 3. Configuration du projet
```bash
cd mobile
eas build:configure
```

#### 4. Créer un Development Build pour Android
```bash
eas build --profile development --platform android
```

Ou pour iOS:
```bash
eas build --profile development --platform ios
```

#### 5. Installation sur votre appareil

Une fois le build terminé (10-20 minutes):
1. Téléchargez le fichier APK (Android) ou IPA (iOS) depuis l'URL fournie
2. Installez-le sur votre appareil
3. Lancez l'app
4. Exécutez `npx expo start --dev-client` depuis votre terminal

#### Avantages
- ✅ Pas besoin d'Android Studio/Xcode
- ✅ Build sur n'importe quel OS (Windows, macOS, Linux)
- ✅ Configuration automatique

#### Inconvénients
- ❌ Nécessite un compte Expo (gratuit)
- ❌ Temps d'attente pour le build (10-20 min)
- ❌ Limitation du plan gratuit (30 builds/mois)

---

## Option 2: Désactiver Temporairement WatermelonDB (Pour Tests Rapides)

Si vous voulez juste tester l'UI et la navigation sans la base de données:

### 1. Créer une version sans DB de database.ts

Créez `/mobile/src/config/database.mock.ts`:
```typescript
// Mock pour tester sans WatermelonDB
export const database = null;
```

### 2. Modifier les imports

Dans vos écrans qui utilisent `database`, changez:
```typescript
// Avant
import { database } from '../config/database';

// Après (temporaire)
// import { database } from '../config/database';
const database = null; // Mock temporaire
```

### 3. Ajouter des guards

```typescript
const loadInterventions = async () => {
  if (!database) {
    console.log('Database non disponible - mode mock');
    setInterventions([]); // Données vides
    return;
  }
  // ... code normal
};
```

### Avantages
- ✅ Test rapide avec Expo Go
- ✅ Pas de configuration native nécessaire
- ✅ Validation de l'UI/navigation

### Inconvénients
- ❌ Pas de données réelles
- ❌ Ne teste pas la vraie fonctionnalité
- ❌ Code temporaire à retirer

---

## Configuration Actuelle ✅

Les fichiers suivants ont déjà été configurés pour WatermelonDB:

### package.json
```json
"dependencies": {
  "@nozbe/watermelondb": "^0.28.0",
  "@lovesworking/watermelondb-expo-plugin-sdk-52-plus": "^1.0.2",
  "expo-build-properties": "^1.0.9"
}
```

### app.json
```json
{
  "expo": {
    "plugins": [
      "@lovesworking/watermelondb-expo-plugin-sdk-52-plus",
      [
        "expo-build-properties",
        {
          "android": {
            "packagingOptions": {
              "pickFirst": ["**/libc++_shared.so"]
            }
          }
        }
      ]
    ]
  }
}
```

### src/config/database.ts
```typescript
const adapter = new SQLiteAdapter({
  schema,
  jsi: false, // Désactivé pour compatibilité
});
```

---

## Recommandation

**Pour continuer rapidement:**

1. **Méthode rapide (Android local)**:
   ```bash
   cd mobile
   npx expo run:android
   ```

2. **Méthode cloud (n'importe quel OS)**:
   ```bash
   npm install -g eas-cli
   cd mobile
   eas login
   eas build --profile development --platform android
   ```

3. **Test temporaire sans DB**:
   - Commentez les imports de `database` dans les screens
   - Testez uniquement l'UI avec Expo Go

---

## Dépannage

### Erreur "WatermelonDB native module not defined"
- ✅ **Solution**: Créez un development build (Option 1)
- ❌ **Ne fonctionnera jamais** avec Expo Go standard

### Build échoue
```bash
# Nettoyez tout
cd mobile
rm -rf node_modules package-lock.json .expo android ios
npm install --legacy-peer-deps

# Recréez le build
npx expo run:android
```

### JSI errors
Le plugin est configuré avec `jsi: false` pour éviter les problèmes avec Expo SDK 54.

---

## Prochaines Étapes

1. Choisissez votre méthode (build local ou EAS)
2. Créez le development build
3. Testez l'application avec WatermelonDB fonctionnel
4. Pour les mises à jour futures, utilisez le même development build

Le development build n'a besoin d'être recréé que si:
- Vous ajoutez/supprimez des modules natifs
- Vous modifiez app.json (plugins)
- Vous mettez à jour des dépendances natives

Pour les modifications de code JS/TS, le hot reload fonctionne normalement! 🚀

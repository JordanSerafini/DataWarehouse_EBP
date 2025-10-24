# 🚀 Démarrage Rapide - Android Studio

Vous avez installé Android Studio! Suivez ces étapes pour lancer votre app en **15 minutes**.

---

## Étape 1: Configuration Initiale (5 min)

### Dans la fenêtre "Welcome to Android Studio":

1. **Cliquez sur "More Actions"** (en bas)
2. **Sélectionnez "SDK Manager"**

### Installation du SDK:

**Onglet "SDK Platforms":**
- ✅ Cochez **"Android 14.0 (UpsideDownCake)"** - API Level 34
- Cliquez sur **"Apply"** en bas à droite
- Acceptez les licences
- Attendez le téléchargement (~2 GB, 3-5 min)

**Onglet "SDK Tools":**
- ✅ Cochez **"Android SDK Build-Tools"**
- ✅ Cochez **"Android SDK Platform-Tools"**
- ✅ Cochez **"Android Emulator"**
- ✅ Cochez **"Android SDK Command-line Tools (latest)"**
- Cliquez sur **"Apply"**
- Attendez le téléchargement (~500 MB, 2 min)

**Cliquez sur "OK"** quand c'est terminé.

---

## Étape 2: Variables d'Environnement (2 min)

### Ouvrez un NOUVEAU terminal et exécutez:

```bash
# Ajouter les variables d'environnement
echo '
# Android SDK
export ANDROID_HOME=$HOME/Android/Sdk
export PATH=$PATH:$ANDROID_HOME/emulator
export PATH=$PATH:$ANDROID_HOME/platform-tools
export PATH=$PATH:$ANDROID_HOME/cmdline-tools/latest/bin
export PATH=$PATH:$ANDROID_HOME/build-tools/34.0.0
' >> ~/.bashrc

# Recharger
source ~/.bashrc

# Vérifier
echo $ANDROID_HOME
adb --version
```

**Devrait afficher:**
- ANDROID_HOME: `/home/tinkerbell/Android/Sdk`
- ADB version: `Android Debug Bridge version ...`

---

## Étape 3: Créer un Émulateur (5 min)

### Dans Android Studio:

1. Cliquez sur **"More Actions"** > **"Virtual Device Manager"**

2. Cliquez sur **"Create Device"** (bouton +)

3. **Sélection du matériel:**
   - Choisissez **"Pixel 6"** ou **"Pixel 7"**
   - Cliquez sur **"Next"**

4. **Image système:**
   - Sélectionnez **"UpsideDownCake"** (API 34)
   - Cliquez sur le **Download** à côté (si pas déjà téléchargé)
   - Attendez le téléchargement (~1 GB, 3 min)
   - Une fois téléchargé, **sélectionnez-le**
   - Cliquez sur **"Next"**

5. **Finalisation:**
   - Nom: "Pixel_6_API_34"
   - Cliquez sur **"Finish"**

6. **Lancez l'émulateur:**
   - Cliquez sur le bouton **Play ▶️** à côté de votre émulateur
   - Attendez qu'il démarre (30 secondes)

---

## Étape 4: Lancer Votre App! (3 min)

### Dans votre terminal:

```bash
cd /home/tinkerbell/Desktop/Code/DataWarehouse_EBP/mobile

# Vérifier que l'émulateur est connecté
adb devices
# Devrait afficher: emulator-5554   device

# Nettoyer le cache
rm -rf .expo android node_modules/.cache

# Lancer l'app (compilation + installation)
npx expo run:android
```

**Attendez la compilation** (5-10 min la première fois)...

**🎉 L'app va s'installer et se lancer automatiquement!**

---

## Alternative: Utiliser Votre Téléphone Android

### C'est PLUS RAPIDE que l'émulateur!

1. **Sur votre téléphone:**
   - Paramètres > À propos du téléphone
   - Tapez 7 fois sur "Numéro de build"
   - Mode développeur activé!

2. **Activez le débogage USB:**
   - Paramètres > Options pour les développeurs
   - Activez "Débogage USB"

3. **Connectez en USB:**
   - Branchez le câble USB
   - Autorisez le débogage sur le téléphone (pop-up)

4. **Vérifiez la connexion:**
   ```bash
   adb devices
   # Devrait afficher votre appareil
   ```

5. **Lancez l'app:**
   ```bash
   cd /home/tinkerbell/Desktop/Code/DataWarehouse_EBP/mobile
   npx expo run:android
   ```

---

## 🛠️ Dépannage Rapide

### Erreur "ANDROID_HOME not set"
```bash
export ANDROID_HOME=$HOME/Android/Sdk
export PATH=$PATH:$ANDROID_HOME/platform-tools
```

### Erreur "No devices found"
- **Émulateur**: Vérifiez qu'il est lancé dans Android Studio
- **Téléphone**: Vérifiez le câble USB et autorisez le débogage
- Tapez: `adb devices` pour voir les appareils connectés

### Build échoue
```bash
cd mobile
rm -rf android .expo node_modules/.cache
npx expo run:android
```

---

## ✅ Checklist Rapide

- [ ] SDK Android installé (API 34)
- [ ] Variables d'environnement configurées (`echo $ANDROID_HOME`)
- [ ] Émulateur créé ET lancé ▶️ (ou téléphone connecté)
- [ ] `adb devices` affiche un appareil
- [ ] `npx expo run:android` compilé sans erreur

---

## 🎯 Après le Premier Build

**Prochaines fois, c'est BEAUCOUP plus rapide:**

```bash
# Lancez l'émulateur dans Android Studio
# Puis:
cd mobile
npx expo start --android
```

**Hot Reload fonctionne!** Modifiez votre code et voyez les changements instantanément! 🔥

---

**Temps total: ~15 minutes**
**Prochain lancement: ~30 secondes!**

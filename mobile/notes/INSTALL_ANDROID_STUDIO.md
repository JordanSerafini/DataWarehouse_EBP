# Installation d'Android Studio sur Ubuntu 24.04

Guide complet pour installer Android Studio et créer votre premier development build Expo.

---

## 📋 Prérequis Système

**Votre système:**
- OS: Ubuntu 24.04.3 LTS (Noble Numbat)
- Architecture: x86_64 ✅
- Espace disque requis: ~15 GB

---

## 🚀 Installation Étape par Étape

### Étape 1: Installer les dépendances système

```bash
# Mise à jour du système
sudo apt update && sudo apt upgrade -y

# Installation des dépendances
sudo apt install -y \
  openjdk-17-jdk \
  wget \
  unzip \
  git \
  adb \
  qemu-kvm \
  libvirt-daemon-system \
  libvirt-clients \
  bridge-utils
```

### Étape 2: Télécharger Android Studio

**Méthode A - Via Snap (RECOMMANDÉ - Plus Simple)**

```bash
sudo snap install android-studio --classic
```

**Méthode B - Téléchargement Manuel**

```bash
# Télécharger la dernière version
cd ~/Downloads
wget https://redirector.gvt1.com/edgedl/android/studio/ide-zips/2024.2.1.12/android-studio-2024.2.1.12-linux.tar.gz

# Extraire
sudo tar -xzf android-studio-*.tar.gz -C /opt/

# Lancer Android Studio
/opt/android-studio/bin/studio.sh
```

### Étape 3: Configuration Initiale d'Android Studio

1. **Lancez Android Studio**
   ```bash
   android-studio  # Si installé via snap
   # OU
   /opt/android-studio/bin/studio.sh  # Si installation manuelle
   ```

2. **Assistant de configuration**
   - Cliquez sur "Next"
   - Choisissez "Standard" installation
   - Sélectionnez le thème (Darcula ou Light)
   - **IMPORTANT**: Notez le chemin du SDK (généralement `/home/votre-nom/Android/Sdk`)
   - Cliquez sur "Finish" et laissez télécharger (~8 GB)

### Étape 4: Installer Android SDK Platform et Build Tools

1. Dans Android Studio, ouvrez **Tools > SDK Manager**

2. Onglet **SDK Platforms**:
   - ✅ Cochez "Android 14.0 (UpsideDownCake)" API Level 34
   - ✅ Cochez "Android 13.0 (Tiramisu)" API Level 33
   - Cliquez sur "Apply"

3. Onglet **SDK Tools**:
   - ✅ Android SDK Build-Tools 34
   - ✅ Android SDK Command-line Tools
   - ✅ Android Emulator
   - ✅ Android SDK Platform-Tools
   - ✅ Intel x86 Emulator Accelerator (HAXM installer)
   - Cliquez sur "Apply"

### Étape 5: Configurer les Variables d'Environnement

Ajoutez ces lignes à votre `~/.bashrc` ou `~/.zshrc`:

```bash
# Ouvrir le fichier
nano ~/.bashrc

# Ajouter à la fin du fichier:
export ANDROID_HOME=$HOME/Android/Sdk
export PATH=$PATH:$ANDROID_HOME/emulator
export PATH=$PATH:$ANDROID_HOME/platform-tools
export PATH=$PATH:$ANDROID_HOME/cmdline-tools/latest/bin
export PATH=$PATH:$ANDROID_HOME/build-tools/34.0.0

# Sauvegarder (Ctrl+O, Enter, Ctrl+X)

# Recharger le fichier
source ~/.bashrc
```

**Vérifier l'installation:**
```bash
echo $ANDROID_HOME
adb --version
```

### Étape 6: Créer un Émulateur Android (AVD)

1. Dans Android Studio, cliquez sur **Tools > Device Manager**

2. Cliquez sur **"Create Device"**

3. Sélectionnez un appareil:
   - Choisissez "Pixel 6" ou "Pixel 7"
   - Cliquez sur "Next"

4. Téléchargez une image système:
   - Sélectionnez "UpsideDownCake" (API 34) ou "Tiramisu" (API 33)
   - Architecture: **x86_64**
   - Cliquez sur le bouton "Download" à côté
   - Une fois téléchargé, cliquez sur "Next"

5. Configuration finale:
   - Nom: "Pixel_6_API_34" (ou autre)
   - Vérifiez les paramètres
   - Cliquez sur "Finish"

6. **Lancer l'émulateur** en cliquant sur le bouton Play ▶️

### Étape 7: Tester ADB

Avec l'émulateur lancé:

```bash
# Liste des appareils connectés
adb devices

# Devrait afficher quelque chose comme:
# List of devices attached
# emulator-5554   device
```

---

## 🎯 Créer Votre Development Build Expo

### Option A: Avec Émulateur (Plus Simple)

1. **Lancez l'émulateur** depuis Android Studio

2. **Dans votre terminal:**
   ```bash
   cd /home/tinkerbell/Desktop/Code/DataWarehouse_EBP/mobile
   npx expo run:android
   ```

3. **Attendez la compilation** (5-10 minutes la première fois)

4. **L'app se lance automatiquement** sur l'émulateur! 🎉

### Option B: Avec Téléphone Physique (Plus Rapide)

1. **Activez le Mode Développeur** sur votre téléphone Android:
   - Allez dans Paramètres > À propos du téléphone
   - Tapez 7 fois sur "Numéro de build"
   - Le mode développeur est activé!

2. **Activez le Débogage USB**:
   - Paramètres > Options pour les développeurs
   - Activez "Débogage USB"

3. **Connectez votre téléphone** via USB

4. **Autorisez le débogage** (pop-up sur le téléphone)

5. **Vérifiez la connexion:**
   ```bash
   adb devices
   # Devrait afficher votre appareil
   ```

6. **Compilez et installez:**
   ```bash
   cd /home/tinkerbell/Desktop/Code/DataWarehouse_EBP/mobile
   npx expo run:android
   ```

7. **L'app s'installe et se lance** sur votre téléphone! 🚀

---

## 🛠️ Dépannage

### Problème: "ANDROID_HOME not set"

```bash
# Vérifiez le chemin du SDK
ls ~/Android/Sdk

# Si le dossier existe, ajoutez à ~/.bashrc:
export ANDROID_HOME=$HOME/Android/Sdk
export PATH=$PATH:$ANDROID_HOME/platform-tools

# Rechargez
source ~/.bashrc
```

### Problème: "adb: command not found"

```bash
# Installez platform-tools
sudo apt install adb

# OU ajoutez au PATH
export PATH=$PATH:$ANDROID_HOME/platform-tools
```

### Problème: "Unable to install APK"

```bash
# Nettoyez le build
cd mobile
rm -rf android .expo node_modules/.cache
npm install --legacy-peer-deps

# Relancez
npx expo run:android
```

### Problème: Émulateur lent

1. Dans Android Studio > Tools > AVD Manager
2. Éditez votre AVD (icône crayon)
3. Cliquez sur "Show Advanced Settings"
4. Augmentez la RAM à 4096 MB
5. Cochez "Enable hardware acceleration"

### Problème: Build échoue avec erreur Gradle

```bash
# Nettoyez le cache Gradle
cd mobile/android
./gradlew clean

# OU supprimez le dossier
cd mobile
rm -rf android
npx expo prebuild --clean
npx expo run:android
```

---

## 📱 Après le Premier Build

### Pour les prochains lancements:

**Avec l'émulateur:**
```bash
# Lancez l'émulateur depuis Android Studio
# Puis:
npx expo start --android
```

**Avec le téléphone USB:**
```bash
adb devices  # Vérifier que connecté
npx expo start --android
```

### Hot Reload

Une fois le development build installé, le **hot reload fonctionne**!
Vous pouvez modifier votre code JS/TS et voir les changements instantanément.

### Quand Recréer le Build?

Seulement si vous:
- ✅ Ajoutez/supprimez des modules natifs
- ✅ Modifiez app.json (plugins, permissions)
- ✅ Mettez à jour des dépendances natives (WatermelonDB, etc.)

Pour du code JS/TS normal: **Pas besoin de rebuild**! 🎉

---

## ✅ Checklist d'Installation

- [ ] Java 17 installé (`java -version`)
- [ ] Android Studio installé
- [ ] SDK Platform API 33 ou 34 téléchargé
- [ ] SDK Build Tools installé
- [ ] Variables d'environnement configurées (`echo $ANDROID_HOME`)
- [ ] ADB fonctionne (`adb --version`)
- [ ] Émulateur créé et lancé OU téléphone connecté en USB
- [ ] `adb devices` affiche un appareil
- [ ] `npx expo run:android` compile et lance l'app

---

## 🎉 Prochaines Étapes

Une fois Android Studio installé:

```bash
cd /home/tinkerbell/Desktop/Code/DataWarehouse_EBP/mobile
npx expo run:android
```

L'app va compiler et se lancer avec **WatermelonDB fonctionnel**! 🍉

Durée totale: ~30-45 minutes (téléchargements inclus)

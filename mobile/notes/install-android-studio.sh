#!/bin/bash
#
# Script d'installation automatique d'Android Studio pour Ubuntu 24.04
# Usage: chmod +x install-android-studio.sh && ./install-android-studio.sh
#

set -e

echo "🚀 Installation d'Android Studio pour Expo/React Native"
echo "========================================================"
echo ""

# Couleurs pour le terminal
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Fonction pour afficher les messages
print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

# Vérifier si on est sur Ubuntu
if ! grep -q "Ubuntu" /etc/os-release; then
    print_error "Ce script est conçu pour Ubuntu. Distribution non supportée."
    exit 1
fi

print_success "Système: $(lsb_release -d | cut -f2)"

# Étape 1: Installation des dépendances
echo ""
echo "📦 Étape 1/5: Installation des dépendances système..."
sudo apt update -qq
sudo apt install -y \
    openjdk-17-jdk \
    wget \
    unzip \
    git \
    adb \
    qemu-kvm \
    libvirt-daemon-system \
    libvirt-clients \
    bridge-utils \
    cpu-checker \
    > /dev/null 2>&1

print_success "Dépendances installées"

# Vérifier Java
JAVA_VERSION=$(java -version 2>&1 | head -1 | cut -d'"' -f2)
print_success "Java: $JAVA_VERSION"

# Étape 2: Installer Android Studio via Snap
echo ""
echo "📱 Étape 2/5: Installation d'Android Studio..."

if command -v android-studio &> /dev/null; then
    print_warning "Android Studio est déjà installé"
else
    print_warning "Installation via Snap (~2 GB, cela peut prendre 5-10 minutes)..."
    sudo snap install android-studio --classic
    print_success "Android Studio installé"
fi

# Étape 3: Créer le dossier Android SDK
echo ""
echo "📂 Étape 3/5: Configuration du SDK Android..."

ANDROID_HOME="$HOME/Android/Sdk"
mkdir -p "$ANDROID_HOME"

# Étape 4: Configurer les variables d'environnement
echo ""
echo "⚙️  Étape 4/5: Configuration des variables d'environnement..."

# Détecter le shell de l'utilisateur
if [ -n "$ZSH_VERSION" ]; then
    SHELL_RC="$HOME/.zshrc"
elif [ -n "$BASH_VERSION" ]; then
    SHELL_RC="$HOME/.bashrc"
else
    SHELL_RC="$HOME/.profile"
fi

# Vérifier si déjà configuré
if grep -q "ANDROID_HOME" "$SHELL_RC"; then
    print_warning "Variables d'environnement déjà configurées dans $SHELL_RC"
else
    cat >> "$SHELL_RC" << 'EOF'

# Android SDK Configuration (ajouté par install-android-studio.sh)
export ANDROID_HOME=$HOME/Android/Sdk
export PATH=$PATH:$ANDROID_HOME/emulator
export PATH=$PATH:$ANDROID_HOME/platform-tools
export PATH=$PATH:$ANDROID_HOME/cmdline-tools/latest/bin
export PATH=$PATH:$ANDROID_HOME/build-tools/34.0.0
EOF
    print_success "Variables d'environnement ajoutées à $SHELL_RC"
fi

# Charger les variables pour cette session
export ANDROID_HOME=$HOME/Android/Sdk
export PATH=$PATH:$ANDROID_HOME/emulator
export PATH=$PATH:$ANDROID_HOME/platform-tools

# Étape 5: Vérifications finales
echo ""
echo "✔️  Étape 5/5: Vérifications finales..."

# Vérifier ADB
if command -v adb &> /dev/null; then
    ADB_VERSION=$(adb --version | head -1)
    print_success "ADB: $ADB_VERSION"
else
    print_warning "ADB non trouvé dans le PATH (normal si première installation)"
fi

# Vérifier Android Studio
if command -v android-studio &> /dev/null; then
    print_success "Android Studio: Installé"
else
    print_error "Android Studio non trouvé"
fi

# Instructions finales
echo ""
echo "========================================================"
echo -e "${GREEN}🎉 Installation de base terminée!${NC}"
echo "========================================================"
echo ""
echo "📋 PROCHAINES ÉTAPES:"
echo ""
echo "1️⃣  Fermez ce terminal et ouvrez-en un nouveau pour charger les variables"
echo ""
echo "2️⃣  Lancez Android Studio:"
echo "   android-studio"
echo ""
echo "3️⃣  Dans Android Studio, suivez l'assistant de configuration:"
echo "   - Choisissez 'Standard' installation"
echo "   - Laissez télécharger le SDK (~8 GB, 10-15 min)"
echo "   - Tools > SDK Manager:"
echo "     * SDK Platforms: Cochez 'Android 14.0 (API 34)'"
echo "     * SDK Tools: Cochez 'Build-Tools 34', 'Platform-Tools', 'Emulator'"
echo ""
echo "4️⃣  Créez un émulateur Android:"
echo "   - Tools > Device Manager > Create Device"
echo "   - Choisissez 'Pixel 6' ou 'Pixel 7'"
echo "   - Téléchargez 'UpsideDownCake (API 34)' x86_64"
echo ""
echo "5️⃣  Lancez votre app Expo:"
echo "   cd /home/tinkerbell/Desktop/Code/DataWarehouse_EBP/mobile"
echo "   npx expo run:android"
echo ""
echo "📖 Guide complet: mobile/INSTALL_ANDROID_STUDIO.md"
echo ""
echo -e "${YELLOW}⏱️  Temps total estimé: 30-45 minutes (téléchargements inclus)${NC}"
echo ""

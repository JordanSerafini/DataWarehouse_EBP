#!/bin/bash

##############################################################################
# Script d'installation et configuration Nginx pour ninjaone.jordan-s.org
# API NinjaOne RMM - Proxy vers localhost:3001
##############################################################################

set -e  # Arrêter en cas d'erreur

# Couleurs pour les logs
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}Configuration Nginx pour NinjaOne API${NC}"
echo -e "${GREEN}========================================${NC}"
echo ""

# Vérifier si on est root
if [ "$EUID" -ne 0 ]; then
    echo -e "${RED}❌ Ce script doit être exécuté en tant que root (sudo)${NC}"
    exit 1
fi

# Variables
DOMAIN="ninjaone.jordan-s.org"
NGINX_CONF_PATH="/etc/nginx/sites-available/$DOMAIN"
NGINX_ENABLED_PATH="/etc/nginx/sites-enabled/$DOMAIN"
CURRENT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
CONF_FILE="$CURRENT_DIR/nginx_ninjaone.conf"

echo -e "${YELLOW}📋 Configuration:${NC}"
echo "  Domaine: $DOMAIN"
echo "  Port API: 3001"
echo "  Fichier conf: $NGINX_CONF_PATH"
echo ""

# Étape 1: Vérifier que nginx est installé
echo -e "${YELLOW}🔍 Vérification de Nginx...${NC}"
if ! command -v nginx &> /dev/null; then
    echo -e "${RED}❌ Nginx n'est pas installé${NC}"
    echo -e "${YELLOW}Installation de Nginx...${NC}"
    apt update
    apt install -y nginx
    echo -e "${GREEN}✅ Nginx installé${NC}"
else
    echo -e "${GREEN}✅ Nginx est déjà installé${NC}"
fi

# Étape 2: Vérifier que le fichier de configuration existe
echo ""
echo -e "${YELLOW}📄 Copie du fichier de configuration...${NC}"
if [ ! -f "$CONF_FILE" ]; then
    echo -e "${RED}❌ Fichier nginx_ninjaone.conf introuvable${NC}"
    echo "Assurez-vous que nginx_ninjaone.conf est dans le même dossier que ce script"
    exit 1
fi

# Copier la configuration
cp "$CONF_FILE" "$NGINX_CONF_PATH"
echo -e "${GREEN}✅ Configuration copiée vers $NGINX_CONF_PATH${NC}"

# Étape 3: Créer le lien symbolique
echo ""
echo -e "${YELLOW}🔗 Activation du site...${NC}"
if [ -L "$NGINX_ENABLED_PATH" ]; then
    echo "  Lien symbolique existe déjà, suppression..."
    rm "$NGINX_ENABLED_PATH"
fi
ln -s "$NGINX_CONF_PATH" "$NGINX_ENABLED_PATH"
echo -e "${GREEN}✅ Site activé${NC}"

# Étape 4: Tester la configuration
echo ""
echo -e "${YELLOW}🧪 Test de la configuration Nginx...${NC}"
if nginx -t; then
    echo -e "${GREEN}✅ Configuration Nginx valide${NC}"
else
    echo -e "${RED}❌ Erreur dans la configuration Nginx${NC}"
    exit 1
fi

# Étape 5: Recharger Nginx
echo ""
echo -e "${YELLOW}🔄 Rechargement de Nginx...${NC}"
systemctl reload nginx
echo -e "${GREEN}✅ Nginx rechargé${NC}"

# Étape 6: Vérifier que l'API NinjaOne tourne
echo ""
echo -e "${YELLOW}🔍 Vérification de l'API NinjaOne (port 3001)...${NC}"
if netstat -tuln | grep -q ":3001 "; then
    echo -e "${GREEN}✅ API NinjaOne détectée sur le port 3001${NC}"
else
    echo -e "${YELLOW}⚠️  Aucun service détecté sur le port 3001${NC}"
    echo "Assurez-vous de démarrer l'API NinjaOne avec:"
    echo "  cd /path/to/ninja-one_api && npm run start:prod"
fi

# Étape 7: Instructions finales
echo ""
echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}✅ Configuration terminée !${NC}"
echo -e "${GREEN}========================================${NC}"
echo ""
echo -e "${YELLOW}📝 Prochaines étapes:${NC}"
echo ""
echo "1. Vérifier que l'API NinjaOne tourne:"
echo "   cd ~/DataWarehouse_EBP/ninja-one_api"
echo "   npm run start:prod"
echo ""
echo "2. Tester l'accès HTTP:"
echo "   curl http://ninjaone.jordan-s.org/health"
echo "   curl http://ninjaone.jordan-s.org/api/tickets/stats"
echo ""
echo "3. (Optionnel) Configurer HTTPS avec Let's Encrypt:"
echo "   sudo certbot --nginx -d ninjaone.jordan-s.org"
echo ""
echo "4. Vérifier les logs Nginx:"
echo "   tail -f /var/log/nginx/ninjaone_access.log"
echo "   tail -f /var/log/nginx/ninjaone_error.log"
echo ""
echo -e "${YELLOW}🔗 URLs de test:${NC}"
echo "  - Health: http://ninjaone.jordan-s.org/health"
echo "  - Stats: http://ninjaone.jordan-s.org/api/tickets/stats"
echo "  - Liste: http://ninjaone.jordan-s.org/api/tickets?limit=10"
echo ""
echo -e "${GREEN}✨ Configuration réussie !${NC}"

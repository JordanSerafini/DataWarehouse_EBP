#!/bin/bash
# Script d'exécution des migrations
# Usage: ./run_migrations.sh

set -e  # Exit on error

# Couleurs pour output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Déterminer le répertoire du script
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
cd "$SCRIPT_DIR"

echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}  EBP Database Migrations${NC}"
echo -e "${BLUE}========================================${NC}"
echo ""
echo "📁 Répertoire migrations: $SCRIPT_DIR"
echo ""

# Charger les variables d'environnement
if [ -f ../.env ]; then
    export $(cat ../.env | grep -v '^#' | xargs)
    echo -e "${GREEN}✓${NC} Variables d'environnement chargées depuis .env"
elif [ -f .env ]; then
    export $(cat .env | grep -v '^#' | xargs)
    echo -e "${GREEN}✓${NC} Variables d'environnement chargées depuis .env"
else
    echo -e "${YELLOW}⚠${NC}  Fichier .env non trouvé, utilisation des valeurs par défaut"
fi

# Variables par défaut
PG_HOST=${PG_HOST:-localhost}
PG_PORT=${PG_PORT:-5432}
PG_USER=${PG_USER:-postgres}
PG_PASSWORD=${PG_PASSWORD:-postgres}
PG_DATABASE=${PG_DATABASE:-ebp_db}

echo ""
echo -e "${BLUE}Configuration:${NC}"
echo "  Host: $PG_HOST:$PG_PORT"
echo "  Database: $PG_DATABASE"
echo "  User: $PG_USER"
echo ""

# Fonction pour exécuter une migration
run_migration() {
    local migration_file=$1
    local migration_name=$(basename "$migration_file" .sql)

    echo -e "${BLUE}➤${NC} Exécution: ${YELLOW}$migration_name${NC}"

    PGPASSWORD=$PG_PASSWORD psql \
        -h "$PG_HOST" \
        -p "$PG_PORT" \
        -U "$PG_USER" \
        -d "$PG_DATABASE" \
        -f "$migration_file"

    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✓${NC} $migration_name exécutée avec succès\n"
    else
        echo -e "${RED}✗${NC} Erreur lors de l'exécution de $migration_name\n"
        exit 1
    fi
}

# Vérifier la connexion
echo -e "${BLUE}➤${NC} Vérification connexion PostgreSQL..."
PGPASSWORD=$PG_PASSWORD psql \
    -h "$PG_HOST" \
    -p "$PG_PORT" \
    -U "$PG_USER" \
    -d "$PG_DATABASE" \
    -c "SELECT version();" > /dev/null 2>&1

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓${NC} Connexion PostgreSQL OK\n"
else
    echo -e "${RED}✗${NC} Impossible de se connecter à PostgreSQL"
    echo ""
    echo "Vérifiez:"
    echo "  - PostgreSQL est démarré"
    echo "  - Les credentials dans .env sont corrects"
    echo "  - L'utilisateur $PG_USER a les droits sur $PG_DATABASE"
    exit 1
fi

# Backup avant migration (recommandé)
echo -e "${BLUE}➤${NC} Backup recommandé avant migration"
echo -e "${YELLOW}⚠${NC}  Voulez-vous créer un backup ? (y/N)"
read -r response
if [[ "$response" =~ ^([yY][eE][sS]|[yY])$ ]]; then
    backup_file="../dump/backup_before_migration_$(date +%Y%m%d_%H%M%S).sql"
    echo "  Création backup: $backup_file"

    PGPASSWORD=$PG_PASSWORD pg_dump \
        -h "$PG_HOST" \
        -p "$PG_PORT" \
        -U "$PG_USER" \
        -d "$PG_DATABASE" \
        -F p \
        -f "$backup_file"

    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✓${NC} Backup créé avec succès\n"
    else
        echo -e "${RED}✗${NC} Erreur lors du backup"
        exit 1
    fi
else
    echo -e "${YELLOW}⚠${NC}  Backup ignoré - continuons...\n"
fi

# Exécuter les migrations dans l'ordre
echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}  Exécution des migrations${NC}"
echo -e "${BLUE}========================================${NC}"
echo ""

# Migration 001: Schéma mobile
run_migration "001_create_mobile_schema.sql"

# Migration 002: GPS (optionnel)
echo -e "${YELLOW}➤${NC} Migration 002 (GPS) - Optionnelle"
echo "  Cette migration:"
echo "  - Hérite GPS client → événements"
echo "  - Crée outils de géocodage"
echo "  - NE modifie PAS la structure"
echo ""
echo "Exécuter migration 002 ? (Y/n)"
read -r response
if [[ ! "$response" =~ ^([nN][oO]|[nN])$ ]]; then
    run_migration "002_populate_gps_coordinates.sql"
else
    echo -e "${YELLOW}⊘${NC} Migration 002 ignorée\n"
fi

# Résumé final
echo ""
echo -e "${BLUE}========================================${NC}"
echo -e "${GREEN}✓ Migrations terminées avec succès !${NC}"
echo -e "${BLUE}========================================${NC}"
echo ""
echo "Schéma 'mobile' créé avec:"
echo "  - 7 tables (photos, signatures, sync, etc.)"
echo "  - 2 vues simplifiées"
echo "  - Index performance"
echo ""
echo "Tables EBP: ${GREEN}INTACTES${NC} (aucune modification)"
echo ""
echo -e "${BLUE}Prochaines étapes:${NC}"
echo "  1. Vérifier: psql -d $PG_DATABASE -c '\dn' (schémas)"
echo "  2. Vérifier: psql -d $PG_DATABASE -c '\dt mobile.*' (tables mobile)"
echo "  3. Géocoder: cd .. && python scripts/geocode_addresses.py"
echo ""

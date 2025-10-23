#!/bin/bash

# ============================================================================
# Script de gestion des migrations de base de données EBP
# ============================================================================
# Usage: ./migrate.sh [options]
# Options:
#   --check        Vérifie l'état des migrations sans les appliquer
#   --rollback N   Rollback des N dernières migrations
#   --force        Force la ré-application de toutes les migrations
# ============================================================================

set -e  # Exit on error

# Couleurs pour output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration BDD
DB_HOST="${DB_HOST:-localhost}"
DB_PORT="${DB_PORT:-5432}"
DB_NAME="${DB_NAME:-ebp_db}"
DB_USER="${DB_USER:-postgres}"
DB_PASSWORD="${DB_PASSWORD:-postgres}"

# Répertoires
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
MIGRATIONS_DIR="${SCRIPT_DIR}/Database/migrations"

# ============================================================================
# Fonctions utilitaires
# ============================================================================

log_info() {
    echo -e "${BLUE}ℹ${NC}  $1"
}

log_success() {
    echo -e "${GREEN}✓${NC}  $1"
}

log_warning() {
    echo -e "${YELLOW}⚠${NC}  $1"
}

log_error() {
    echo -e "${RED}✗${NC}  $1"
}

# ============================================================================
# Fonction: Exécuter requête SQL
# ============================================================================

exec_sql() {
    local sql="$1"
    PGPASSWORD="$DB_PASSWORD" psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d "$DB_NAME" -t -A -c "$sql" 2>/dev/null
}

exec_sql_file() {
    local file="$1"
    PGPASSWORD="$DB_PASSWORD" psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d "$DB_NAME" -f "$file"
}

# ============================================================================
# Fonction: Vérifier connexion BDD
# ============================================================================

check_database_connection() {
    log_info "Vérification connexion à PostgreSQL..."

    if ! command -v psql &> /dev/null; then
        log_error "psql n'est pas installé"
        exit 1
    fi

    if ! exec_sql "SELECT 1" &> /dev/null; then
        log_error "Impossible de se connecter à la base de données"
        log_error "Host: $DB_HOST:$DB_PORT, Database: $DB_NAME, User: $DB_USER"
        exit 1
    fi

    log_success "Connecté à $DB_NAME@$DB_HOST:$DB_PORT"
}

# ============================================================================
# Fonction: Créer table de suivi des migrations
# ============================================================================

create_migration_table() {
    log_info "Initialisation table de suivi des migrations..."

    exec_sql "
    CREATE SCHEMA IF NOT EXISTS mobile;

    CREATE TABLE IF NOT EXISTS mobile.migration_history (
        id SERIAL PRIMARY KEY,
        migration_name VARCHAR(255) NOT NULL UNIQUE,
        applied_at TIMESTAMP NOT NULL DEFAULT NOW(),
        execution_time_ms INTEGER,
        status VARCHAR(20) NOT NULL DEFAULT 'success',
        error_message TEXT,
        checksum VARCHAR(64)
    );

    CREATE INDEX IF NOT EXISTS idx_migration_history_name
        ON mobile.migration_history(migration_name);
    " > /dev/null

    log_success "Table migration_history prête"
}

# ============================================================================
# Fonction: Calculer checksum d'un fichier
# ============================================================================

get_file_checksum() {
    local file="$1"
    md5sum "$file" | awk '{print $1}'
}

# ============================================================================
# Fonction: Vérifier si une migration a été appliquée
# ============================================================================

is_migration_applied() {
    local migration_name="$1"
    local count=$(exec_sql "SELECT COUNT(*) FROM mobile.migration_history WHERE migration_name = '$migration_name' AND status = 'success';")
    [ "$count" -gt 0 ]
}

# ============================================================================
# Fonction: Enregistrer migration appliquée
# ============================================================================

record_migration() {
    local migration_name="$1"
    local execution_time="$2"
    local status="$3"
    local error_msg="$4"
    local checksum="$5"

    error_msg="${error_msg//\'/\'\'}"  # Escape single quotes

    exec_sql "
    INSERT INTO mobile.migration_history
        (migration_name, execution_time_ms, status, error_message, checksum)
    VALUES
        ('$migration_name', $execution_time, '$status', '$error_msg', '$checksum')
    ON CONFLICT (migration_name)
    DO UPDATE SET
        applied_at = NOW(),
        execution_time_ms = $execution_time,
        status = '$status',
        error_message = '$error_msg',
        checksum = '$checksum';
    " > /dev/null
}

# ============================================================================
# Fonction: Appliquer une migration
# ============================================================================

apply_migration() {
    local migration_file="$1"
    local migration_name=$(basename "$migration_file" .sql)

    log_info "Application de la migration: $migration_name"

    # Calculer checksum
    local checksum=$(get_file_checksum "$migration_file")

    # Mesurer temps d'exécution
    local start_time=$(date +%s%3N)

    # Exécuter migration
    local error_output
    if error_output=$(exec_sql_file "$migration_file" 2>&1); then
        local end_time=$(date +%s%3N)
        local execution_time=$((end_time - start_time))

        # Enregistrer succès
        record_migration "$migration_name" "$execution_time" "success" "" "$checksum"

        log_success "Migration $migration_name appliquée avec succès (${execution_time}ms)"
        return 0
    else
        local end_time=$(date +%s%3N)
        local execution_time=$((end_time - start_time))

        # Enregistrer échec
        record_migration "$migration_name" "$execution_time" "failed" "$error_output" "$checksum"

        log_error "Échec de la migration $migration_name"
        echo "$error_output" | head -10
        return 1
    fi
}

# ============================================================================
# Fonction: Lister les migrations disponibles
# ============================================================================

list_migrations() {
    find "$MIGRATIONS_DIR" -name "*.sql" -not -name "*rollback*" | sort
}

# ============================================================================
# Fonction: Afficher l'état des migrations
# ============================================================================

show_migration_status() {
    log_info "État des migrations:"
    echo ""

    printf "%-40s %-15s %-25s\n" "MIGRATION" "STATUT" "DATE APPLICATION"
    printf "%-40s %-15s %-25s\n" "$(printf '%.0s-' {1..40})" "$(printf '%.0s-' {1..15})" "$(printf '%.0s-' {1..25})"

    while IFS= read -r migration_file; do
        local migration_name=$(basename "$migration_file" .sql)

        if is_migration_applied "$migration_name"; then
            local applied_at=$(exec_sql "SELECT TO_CHAR(applied_at, 'YYYY-MM-DD HH24:MI:SS') FROM mobile.migration_history WHERE migration_name = '$migration_name' AND status = 'success' ORDER BY applied_at DESC LIMIT 1;")
            printf "%-40s ${GREEN}%-15s${NC} %-25s\n" "$migration_name" "✓ Appliquée" "$applied_at"
        else
            printf "%-40s ${YELLOW}%-15s${NC} %-25s\n" "$migration_name" "⊙ En attente" "-"
        fi
    done < <(list_migrations)

    echo ""
}

# ============================================================================
# Fonction: Appliquer toutes les migrations en attente
# ============================================================================

apply_pending_migrations() {
    local force_mode="$1"
    local migrations_applied=0
    local migrations_failed=0

    log_info "Recherche des migrations en attente..."
    echo ""

    while IFS= read -r migration_file; do
        local migration_name=$(basename "$migration_file" .sql)

        if [ "$force_mode" = "true" ] || ! is_migration_applied "$migration_name"; then
            if apply_migration "$migration_file"; then
                ((migrations_applied++))
            else
                ((migrations_failed++))
                log_error "Arrêt à cause de l'échec de la migration"
                break
            fi
            echo ""
        fi
    done < <(list_migrations)

    echo ""
    log_info "Résumé:"
    log_success "$migrations_applied migration(s) appliquée(s)"

    if [ $migrations_failed -gt 0 ]; then
        log_error "$migrations_failed migration(s) échouée(s)"
        exit 1
    fi

    if [ $migrations_applied -eq 0 ]; then
        log_success "Aucune migration en attente, base de données à jour !"
    fi
}

# ============================================================================
# Fonction: Rollback
# ============================================================================

rollback_migration() {
    local migration_name="$1"
    local rollback_file="${MIGRATIONS_DIR}/${migration_name}_rollback.sql"

    if [ ! -f "$rollback_file" ]; then
        log_error "Fichier de rollback introuvable: $rollback_file"
        return 1
    fi

    log_info "Rollback de la migration: $migration_name"

    if exec_sql_file "$rollback_file" > /dev/null 2>&1; then
        exec_sql "DELETE FROM mobile.migration_history WHERE migration_name = '$migration_name';" > /dev/null
        log_success "Rollback effectué: $migration_name"
        return 0
    else
        log_error "Échec du rollback: $migration_name"
        return 1
    fi
}

rollback_last_n_migrations() {
    local n="$1"

    log_info "Rollback des $n dernière(s) migration(s)..."

    local migrations=$(exec_sql "SELECT migration_name FROM mobile.migration_history WHERE status = 'success' ORDER BY applied_at DESC LIMIT $n;")

    while IFS= read -r migration_name; do
        [ -z "$migration_name" ] && continue
        rollback_migration "$migration_name"
    done <<< "$migrations"
}

# ============================================================================
# Fonction: Afficher l'aide
# ============================================================================

show_help() {
    cat << EOF
${BLUE}Script de gestion des migrations EBP${NC}

${YELLOW}Usage:${NC}
    ./migrate.sh [options]

${YELLOW}Options:${NC}
    --check              Affiche l'état des migrations sans les appliquer
    --rollback N         Rollback des N dernières migrations
    --force              Force la ré-application de toutes les migrations
    -h, --help           Affiche cette aide

${YELLOW}Variables d'environnement:${NC}
    DB_HOST              Host PostgreSQL (défaut: localhost)
    DB_PORT              Port PostgreSQL (défaut: 5432)
    DB_NAME              Nom de la base (défaut: ebp_db)
    DB_USER              Utilisateur (défaut: postgres)
    DB_PASSWORD          Mot de passe (défaut: postgres)

${YELLOW}Exemples:${NC}
    ./migrate.sh                           # Applique les migrations en attente
    ./migrate.sh --check                   # Vérifie l'état sans rien modifier
    ./migrate.sh --rollback 1              # Rollback de la dernière migration
    DB_PASSWORD=secret ./migrate.sh        # Utilise un mot de passe custom

EOF
}

# ============================================================================
# MAIN
# ============================================================================

main() {
    local check_only=false
    local force_mode=false
    local rollback_count=0

    # Parser les arguments
    while [[ $# -gt 0 ]]; do
        case $1 in
            --check)
                check_only=true
                shift
                ;;
            --force)
                force_mode=true
                shift
                ;;
            --rollback)
                rollback_count="$2"
                shift 2
                ;;
            -h|--help)
                show_help
                exit 0
                ;;
            *)
                log_error "Option inconnue: $1"
                show_help
                exit 1
                ;;
        esac
    done

    # Banner
    echo ""
    echo -e "${BLUE}═══════════════════════════════════════════════════════════${NC}"
    echo -e "${BLUE}  Gestionnaire de migrations - DataWarehouse EBP${NC}"
    echo -e "${BLUE}═══════════════════════════════════════════════════════════${NC}"
    echo ""

    # Vérifications
    check_database_connection
    create_migration_table
    echo ""

    # Actions
    if [ "$rollback_count" -gt 0 ]; then
        rollback_last_n_migrations "$rollback_count"
    elif [ "$check_only" = true ]; then
        show_migration_status
    else
        show_migration_status
        apply_pending_migrations "$force_mode"
    fi

    echo ""
    log_success "Terminé !"
    echo ""
}

# Exécuter
main "$@"

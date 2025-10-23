-- ============================================================
-- Rollback Migration 004: Tables métier mobile
-- ============================================================
-- Description: Supprime toutes les tables créées dans migration 004
-- ============================================================

-- Supprimer les triggers
DROP TRIGGER IF EXISTS trigger_projects_updated ON mobile.projects;
DROP TRIGGER IF EXISTS trigger_quotes_updated ON mobile.quotes;
DROP TRIGGER IF EXISTS trigger_sales_updated ON mobile.sales;
DROP TRIGGER IF EXISTS trigger_timesheets_updated ON mobile.timesheets;
DROP TRIGGER IF EXISTS trigger_expenses_updated ON mobile.expenses;

-- Supprimer la fonction trigger
DROP FUNCTION IF EXISTS mobile.update_timestamp();

-- Supprimer les tables (ordre inverse des dépendances)
DROP TABLE IF EXISTS mobile.stock_movements CASCADE;
DROP TABLE IF EXISTS mobile.expenses CASCADE;
DROP TABLE IF EXISTS mobile.timesheets CASCADE;
DROP TABLE IF EXISTS mobile.colleagues CASCADE;
DROP TABLE IF EXISTS mobile.documents CASCADE;
DROP TABLE IF EXISTS mobile.products CASCADE;
DROP TABLE IF EXISTS mobile.contacts CASCADE;
DROP TABLE IF EXISTS mobile.sales CASCADE;
DROP TABLE IF EXISTS mobile.quote_lines CASCADE;
DROP TABLE IF EXISTS mobile.quotes CASCADE;
DROP TABLE IF EXISTS mobile.projects CASCADE;

-- Vérification
DO $$
BEGIN
    RAISE NOTICE '✅ Rollback Migration 004 terminé';
    RAISE NOTICE '🗑️  Toutes les tables métier mobile ont été supprimées';
END $$;

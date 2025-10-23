-- ============================================================
-- Rollback Migration 008: Mapping complet des documents
-- ============================================================
-- Description: Supprime toutes les tables et fonctions créées dans migration 008
-- ============================================================

-- Supprimer les fonctions
DROP FUNCTION IF EXISTS mobile.get_recent_documents(INTEGER[], INTEGER);
DROP FUNCTION IF EXISTS mobile.get_customer_documents_stats(VARCHAR);
DROP FUNCTION IF EXISTS mobile.sync_all_documents(INTEGER);
DROP FUNCTION IF EXISTS mobile.sync_deal_document_lines();
DROP FUNCTION IF EXISTS mobile.sync_deal_purchase_documents(INTEGER);
DROP FUNCTION IF EXISTS mobile.sync_deal_sale_documents(INTEGER);
DROP FUNCTION IF EXISTS mobile.sync_sale_document_lines();
DROP FUNCTION IF EXISTS mobile.sync_credit_notes(INTEGER);
DROP FUNCTION IF EXISTS mobile.sync_delivery_notes(INTEGER);
DROP FUNCTION IF EXISTS mobile.sync_invoices(INTEGER);

-- Supprimer les tables (ordre inverse des dépendances)
DROP TABLE IF EXISTS mobile.deal_document_lines CASCADE;
DROP TABLE IF EXISTS mobile.deal_documents CASCADE;
DROP TABLE IF EXISTS mobile.sale_document_lines CASCADE;
DROP TABLE IF EXISTS mobile.sale_documents CASCADE;

-- Vérification
DO $$
BEGIN
    RAISE NOTICE '✅ Rollback Migration 008 terminé';
    RAISE NOTICE '🗑️  Tables et fonctions de documents supprimées';
END $$;

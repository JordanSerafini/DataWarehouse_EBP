-- Rollback Migration 016: Supprimer table mobile.customer_gps
-- Date: 2025-10-28

BEGIN;

-- Supprimer les procédures et fonctions
DROP PROCEDURE IF EXISTS mobile.update_customer_gps(VARCHAR, NUMERIC, NUMERIC, VARCHAR, NUMERIC);
DROP FUNCTION IF EXISTS mobile.update_customer_gps(VARCHAR, NUMERIC, NUMERIC, VARCHAR, NUMERIC);

-- Supprimer la table
DROP TABLE IF EXISTS mobile.customer_gps CASCADE;

RAISE NOTICE 'Rollback 016: Table customer_gps supprimée';

COMMIT;

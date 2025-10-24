-- Rollback Migration: Drop dim_locations table
-- Date: 2025-10-24

-- Drop table (cascade will handle foreign keys from other tables)
DROP TABLE IF EXISTS ninjaone.dim_locations CASCADE;

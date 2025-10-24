-- Migration: Populate dim_ticket_statuses dimension table
-- Date: 2025-10-24
-- Description: Populates ticket statuses from common NinjaOne statuses

INSERT INTO ninjaone.dim_ticket_statuses (
    status_id,
    status_name,
    display_name,
    parent_status_id,
    is_open,
    is_closed,
    is_resolved,
    color,
    sort_order,
    is_active,
    etl_source
) VALUES
    (1000, 'NEW', 'Nouveau', 1000, TRUE, FALSE, FALSE, '#3B82F6', 1, TRUE, 'manual_seed'),
    (2000, 'OPEN', 'Ouvert', 2000, TRUE, FALSE, FALSE, '#10B981', 2, TRUE, 'manual_seed'),
    (2001, 'IN_PROGRESS', 'En cours', 2000, TRUE, FALSE, FALSE, '#F59E0B', 3, TRUE, 'manual_seed'),
    (2002, 'MAINTENANCE_TODO', 'Maintenance - A faire', 2000, TRUE, FALSE, FALSE, '#8B5CF6', 4, TRUE, 'manual_seed'),
    (3000, 'ON_HOLD', 'En attente', 3000, TRUE, FALSE, FALSE, '#6B7280', 5, TRUE, 'manual_seed'),
    (3001, 'PAUSED', 'En pause', 3000, TRUE, FALSE, FALSE, '#9CA3AF', 6, TRUE, 'manual_seed'),
    (4000, 'TO_BILL', 'A facturer', 4000, FALSE, FALSE, TRUE, '#EC4899', 7, TRUE, 'manual_seed'),
    (5000, 'RESOLVED', 'Résolu', 5000, FALSE, FALSE, TRUE, '#059669', 8, TRUE, 'manual_seed'),
    (6000, 'CLOSED', 'Fermé', 6000, FALSE, TRUE, TRUE, '#DC2626', 9, TRUE, 'manual_seed')
ON CONFLICT (status_id) DO NOTHING;

-- Verify the insertion
DO $$
DECLARE
    row_count INTEGER;
BEGIN
    SELECT COUNT(*) INTO row_count FROM ninjaone.dim_ticket_statuses;
    RAISE NOTICE 'dim_ticket_statuses populated with % rows', row_count;
END $$;

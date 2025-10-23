-- ============================================================
-- Migration 007: Synchronisation des lignes de documents
-- ============================================================
-- Description: Synchronise les lignes de devis/factures/documents
-- depuis SaleDocumentLine vers mobile.quote_lines
-- ============================================================

-- ============================================================
-- 1. SYNC LIGNES DE DEVIS
-- ============================================================

CREATE OR REPLACE FUNCTION mobile.sync_quote_lines()
RETURNS INTEGER AS $$
DECLARE
    v_synced_count INTEGER;
BEGIN
    -- Insérer les lignes pour tous les devis déjà synchronisés
    INSERT INTO mobile.quote_lines (
        quote_id,
        ebp_quote_id,
        line_number,
        line_type,
        item_id,
        item_name,
        item_reference,
        quantity,
        unit,
        unit_price_excl_tax,
        discount_percent,
        total_excl_tax,
        description
    )
    SELECT
        mq.id as quote_id,
        mq.ebp_id as ebp_quote_id,
        sdl."LineNumber",
        sdl."LineType",
        sdl."ItemId",
        sdl."ItemCaption",
        sdl."ItemId", -- Pas de colonne Reference, on utilise ItemId
        sdl."Quantity",
        sdl."Unit",
        sdl."SellingUnitPriceVatExcluded",
        sdl."DiscountRate",
        sdl."AmountVatExcluded",
        sdl."DescriptionClear"
    FROM public."SaleDocumentLine" sdl
    INNER JOIN mobile.quotes mq ON sdl."DocumentId"::VARCHAR(50) = mq.ebp_id
    WHERE NOT EXISTS (
        -- Éviter les doublons
        SELECT 1 FROM mobile.quote_lines mqr
        WHERE mqr.ebp_quote_id = mq.ebp_id
          AND mqr.line_number = sdl."LineNumber"
    )
    ORDER BY sdl."LineNumber";

    GET DIAGNOSTICS v_synced_count = ROW_COUNT;

    RETURN v_synced_count;
END;
$$ LANGUAGE plpgsql;

COMMENT ON FUNCTION mobile.sync_quote_lines() IS 'Synchronise les lignes de devis depuis SaleDocumentLine';

-- ============================================================
-- 2. AMÉLIORER SYNC QUOTES (TOUS les devis, pas juste 500)
-- ============================================================

CREATE OR REPLACE FUNCTION mobile.sync_all_quotes(
    p_years_back INTEGER DEFAULT 2
)
RETURNS INTEGER AS $$
DECLARE
    v_synced_count INTEGER;
BEGIN
    INSERT INTO mobile.quotes (
        ebp_id,
        ebp_doc_number,
        quote_number,
        quote_date,
        document_state,
        customer_id,
        customer_name,
        salesperson_id,
        total_excl_tax,
        total_incl_tax,
        validity_date,
        notes,
        last_sync_at
    )
    SELECT
        sd."Id"::VARCHAR(50),
        sd."DocumentNumber",
        sd."DocumentNumber",
        sd."DocumentDate"::DATE,
        sd."DocumentState",
        sd."CustomerId",
        sd."CustomerName",
        sd."ColleagueId",
        sd."AmountVatExcluded",
        sd."AmountVatIncluded",
        sd."ValidityDate"::DATE,
        sd."NotesClear",
        NOW()
    FROM public."SaleDocument" sd
    WHERE sd."DocumentType" = 1 -- Devis uniquement
      AND sd."DocumentDate" >= CURRENT_DATE - (p_years_back || ' years')::INTERVAL
    ORDER BY sd."DocumentDate" DESC
    ON CONFLICT (ebp_id)
    DO UPDATE SET
        quote_number = EXCLUDED.quote_number,
        quote_date = EXCLUDED.quote_date,
        document_state = EXCLUDED.document_state,
        customer_name = EXCLUDED.customer_name,
        total_excl_tax = EXCLUDED.total_excl_tax,
        total_incl_tax = EXCLUDED.total_incl_tax,
        validity_date = EXCLUDED.validity_date,
        notes = EXCLUDED.notes,
        last_sync_at = NOW();

    GET DIAGNOSTICS v_synced_count = ROW_COUNT;

    RETURN v_synced_count;
END;
$$ LANGUAGE plpgsql;

COMMENT ON FUNCTION mobile.sync_all_quotes(INTEGER) IS 'Synchronise TOUS les devis (pas de limite) des N dernières années';

-- ============================================================
-- 3. FONCTION GLOBALE: SYNC DOCUMENTS + LIGNES
-- ============================================================

CREATE OR REPLACE FUNCTION mobile.sync_quotes_with_lines(
    p_years_back INTEGER DEFAULT 2
)
RETURNS TABLE (
    step VARCHAR(50),
    synced_count INTEGER,
    duration_ms INTEGER
) AS $$
DECLARE
    v_start_time BIGINT;
    v_end_time BIGINT;
    v_count INTEGER;
BEGIN
    RAISE NOTICE '🔄 Synchronisation devis + lignes...';

    -- Step 1: Sync tous les devis
    v_start_time := EXTRACT(EPOCH FROM clock_timestamp()) * 1000;
    v_count := mobile.sync_all_quotes(p_years_back);
    v_end_time := EXTRACT(EPOCH FROM clock_timestamp()) * 1000;
    step := 'quotes';
    synced_count := v_count;
    duration_ms := (v_end_time - v_start_time)::INTEGER;
    RETURN NEXT;
    RAISE NOTICE '  ✓ Devis: % enregistrements (%ms)', v_count, duration_ms;

    -- Step 2: Sync lignes de devis
    v_start_time := EXTRACT(EPOCH FROM clock_timestamp()) * 1000;
    v_count := mobile.sync_quote_lines();
    v_end_time := EXTRACT(EPOCH FROM clock_timestamp()) * 1000;
    step := 'quote_lines';
    synced_count := v_count;
    duration_ms := (v_end_time - v_start_time)::INTEGER;
    RETURN NEXT;
    RAISE NOTICE '  ✓ Lignes de devis: % enregistrements (%ms)', v_count, duration_ms;

    RAISE NOTICE '✅ Synchronisation terminée';
END;
$$ LANGUAGE plpgsql;

COMMENT ON FUNCTION mobile.sync_quotes_with_lines(INTEGER) IS 'Synchronise devis + leurs lignes en une seule opération';

-- ============================================================
-- 4. STATISTIQUES SUR LES LIGNES
-- ============================================================

CREATE OR REPLACE FUNCTION mobile.get_quote_lines_stats()
RETURNS TABLE (
    quote_id INTEGER,
    quote_number VARCHAR(50),
    customer_name VARCHAR(100),
    total_excl_tax DECIMAL(15,2),
    lines_count BIGINT,
    has_lines BOOLEAN
) AS $$
BEGIN
    RETURN QUERY
    SELECT
        q.id,
        q.quote_number,
        q.customer_name,
        q.total_excl_tax,
        COUNT(ql.id) as lines_count,
        COUNT(ql.id) > 0 as has_lines
    FROM mobile.quotes q
    LEFT JOIN mobile.quote_lines ql ON q.id = ql.quote_id
    GROUP BY q.id, q.quote_number, q.customer_name, q.total_excl_tax
    ORDER BY q.quote_date DESC
    LIMIT 20;
END;
$$ LANGUAGE plpgsql;

COMMENT ON FUNCTION mobile.get_quote_lines_stats() IS 'Statistiques sur les devis et leurs lignes (top 20)';

-- ============================================================
-- FIN MIGRATION 007
-- ============================================================

DO $$
BEGIN
    RAISE NOTICE '✅ Migration 007 terminée avec succès';
    RAISE NOTICE '📊 Fonctions créées:';
    RAISE NOTICE '   - mobile.sync_quote_lines() - Sync lignes de devis';
    RAISE NOTICE '   - mobile.sync_all_quotes() - TOUS les devis (sans limite)';
    RAISE NOTICE '   - mobile.sync_quotes_with_lines() - Sync devis + lignes';
    RAISE NOTICE '   - mobile.get_quote_lines_stats() - Stats devis/lignes';
    RAISE NOTICE '';
    RAISE NOTICE '🎯 Prochaine étape: Exécuter mobile.sync_quotes_with_lines()';
END $$;

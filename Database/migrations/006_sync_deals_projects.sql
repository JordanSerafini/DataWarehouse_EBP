-- ============================================================
-- Migration 006: Sync Deals et Projects avec données réelles
-- ============================================================
-- Description: Crée les fonctions pour synchroniser:
--   - Deals (affaires commerciales) depuis table Deal
--   - Projects amélioré (tous les chantiers)
--   - Quotes depuis SaleDocument
-- ============================================================

-- ============================================================
-- 1. SYNC DEALS (Affaires commerciales)
-- ============================================================

CREATE OR REPLACE FUNCTION mobile.sync_deals(
    p_state_filter INTEGER[] DEFAULT NULL
)
RETURNS INTEGER AS $$
DECLARE
    v_synced_count INTEGER;
BEGIN
    INSERT INTO mobile.sales (
        ebp_id,
        opportunity_number,
        name,
        sales_stage,
        state,
        customer_id,
        customer_name,
        salesperson_id,
        estimated_amount,
        weighted_amount,
        creation_date,
        expected_closing_date,
        actual_closing_date,
        description,
        last_sync_at
    )
    SELECT
        d."Id"::VARCHAR(50),
        d."Id", -- Utiliser Id comme numéro
        d."Caption",
        0, -- sales_stage par défaut
        d."DealState",
        d."xx_Client",
        c."Name",
        d."xx_Commercial",
        d."PredictedSales",
        d."PredictedSales", -- weighted_amount = predicted par défaut
        d."DealDate"::DATE,
        d."xx_DateFin"::DATE,
        d."xx_Date_Fin_Reelle"::DATE,
        d."NotesClear",
        NOW()
    FROM public."Deal" d
    LEFT JOIN public."Customer" c ON d."xx_Client" = c."Id"
    WHERE (p_state_filter IS NULL OR d."DealState" = ANY(p_state_filter))
    ON CONFLICT (ebp_id)
    DO UPDATE SET
        name = EXCLUDED.name,
        state = EXCLUDED.state,
        customer_name = EXCLUDED.customer_name,
        salesperson_id = EXCLUDED.salesperson_id,
        estimated_amount = EXCLUDED.estimated_amount,
        expected_closing_date = EXCLUDED.expected_closing_date,
        actual_closing_date = EXCLUDED.actual_closing_date,
        description = EXCLUDED.description,
        last_sync_at = NOW();

    GET DIAGNOSTICS v_synced_count = ROW_COUNT;

    RETURN v_synced_count;
END;
$$ LANGUAGE plpgsql;

COMMENT ON FUNCTION mobile.sync_deals(INTEGER[]) IS 'Synchronise les affaires/deals depuis table Deal';

-- ============================================================
-- 2. SYNC PROJECTS AMÉLIORÉ (tous les chantiers)
-- ============================================================

CREATE OR REPLACE FUNCTION mobile.sync_projects_all()
RETURNS INTEGER AS $$
DECLARE
    v_synced_count INTEGER;
BEGIN
    INSERT INTO mobile.projects (
        ebp_id,
        name,
        customer_id,
        customer_name,
        start_date,
        end_date,
        address_line1,
        address_line2,
        city,
        zipcode,
        latitude,
        longitude,
        description,
        notes,
        estimated_amount,
        actual_amount,
        is_active,
        last_sync_at
    )
    SELECT
        cs."Id"::VARCHAR(50),
        cs."Caption",
        cs."CustomerId",
        c."Name",
        cs."StartDate",
        cs."EndDate",
        cs."ConstructionSiteAddress_Address1",
        cs."ConstructionSiteAddress_Address2",
        cs."ConstructionSiteAddress_City",
        cs."ConstructionSiteAddress_ZipCode",
        cs."ConstructionSiteAddress_Latitude",
        cs."ConstructionSiteAddress_Longitude",
        cs."DescriptionClear",
        cs."NotesClear",
        cs."PredictedSales",
        cs."AccomplishedSales",
        true,
        NOW()
    FROM public."ConstructionSite" cs
    LEFT JOIN public."Customer" c ON cs."CustomerId" = c."Id"
    ON CONFLICT (ebp_id)
    DO UPDATE SET
        name = EXCLUDED.name,
        customer_name = EXCLUDED.customer_name,
        start_date = EXCLUDED.start_date,
        end_date = EXCLUDED.end_date,
        address_line1 = EXCLUDED.address_line1,
        address_line2 = EXCLUDED.address_line2,
        city = EXCLUDED.city,
        zipcode = EXCLUDED.zipcode,
        latitude = EXCLUDED.latitude,
        longitude = EXCLUDED.longitude,
        description = EXCLUDED.description,
        notes = EXCLUDED.notes,
        estimated_amount = EXCLUDED.estimated_amount,
        actual_amount = EXCLUDED.actual_amount,
        last_sync_at = NOW();

    GET DIAGNOSTICS v_synced_count = ROW_COUNT;

    RETURN v_synced_count;
END;
$$ LANGUAGE plpgsql;

COMMENT ON FUNCTION mobile.sync_projects_all() IS 'Synchronise TOUS les chantiers depuis ConstructionSite';

-- ============================================================
-- 3. SYNC QUOTES (Devis) depuis SaleDocument
-- ============================================================

CREATE OR REPLACE FUNCTION mobile.sync_quotes(
    p_document_types INTEGER[] DEFAULT ARRAY[0], -- 0 = Devis
    p_limit INTEGER DEFAULT 500
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
        state,
        document_state,
        customer_id,
        customer_name,
        salesperson_id,
        total_excl_tax,
        total_incl_tax,
        validity_date,
        subject,
        notes,
        last_sync_at
    )
    SELECT
        sd."Id"::VARCHAR(50),
        sd."DocNumber",
        sd."DocNumber",
        sd."DocDate"::DATE,
        sd."State",
        sd."DocumentState",
        sd."CustomerId",
        c."Name",
        sd."SalespersonId",
        sd."TotalAmountVatExcluded",
        sd."TotalAmountVatIncluded",
        sd."ValidityDate"::DATE,
        sd."Caption",
        sd."NotesClear",
        NOW()
    FROM public."SaleDocument" sd
    LEFT JOIN public."Customer" c ON sd."CustomerId" = c."Id"
    WHERE sd."DocType" = ANY(p_document_types)
      AND sd."DocDate" >= CURRENT_DATE - INTERVAL '2 years'
    ORDER BY sd."DocDate" DESC
    LIMIT p_limit
    ON CONFLICT (ebp_id)
    DO UPDATE SET
        quote_number = EXCLUDED.quote_number,
        quote_date = EXCLUDED.quote_date,
        state = EXCLUDED.state,
        document_state = EXCLUDED.document_state,
        customer_name = EXCLUDED.customer_name,
        total_excl_tax = EXCLUDED.total_excl_tax,
        total_incl_tax = EXCLUDED.total_incl_tax,
        validity_date = EXCLUDED.validity_date,
        subject = EXCLUDED.subject,
        notes = EXCLUDED.notes,
        last_sync_at = NOW();

    GET DIAGNOSTICS v_synced_count = ROW_COUNT;

    RETURN v_synced_count;
END;
$$ LANGUAGE plpgsql;

COMMENT ON FUNCTION mobile.sync_quotes(INTEGER[], INTEGER) IS 'Synchronise les devis depuis SaleDocument';

-- ============================================================
-- 4. FONCTION GLOBALE DE SYNC COMPLÈTE
-- ============================================================

CREATE OR REPLACE FUNCTION mobile.full_sync_all()
RETURNS TABLE (
    entity VARCHAR(50),
    synced_count INTEGER,
    duration_ms INTEGER
) AS $$
DECLARE
    v_start_time BIGINT;
    v_end_time BIGINT;
    v_count INTEGER;
BEGIN
    RAISE NOTICE '🔄 Démarrage synchronisation complète...';

    -- Sync Contacts
    v_start_time := EXTRACT(EPOCH FROM clock_timestamp()) * 1000;
    v_count := mobile.sync_contacts();
    v_end_time := EXTRACT(EPOCH FROM clock_timestamp()) * 1000;
    entity := 'contacts';
    synced_count := v_count;
    duration_ms := (v_end_time - v_start_time)::INTEGER;
    RETURN NEXT;
    RAISE NOTICE '  ✓ Contacts: % enregistrements (%ms)', v_count, duration_ms;

    -- Sync Collègues
    v_start_time := EXTRACT(EPOCH FROM clock_timestamp()) * 1000;
    v_count := mobile.sync_colleagues();
    v_end_time := EXTRACT(EPOCH FROM clock_timestamp()) * 1000;
    entity := 'colleagues';
    synced_count := v_count;
    duration_ms := (v_end_time - v_start_time)::INTEGER;
    RETURN NEXT;
    RAISE NOTICE '  ✓ Collègues: % enregistrements (%ms)', v_count, duration_ms;

    -- Sync Projets (TOUS)
    v_start_time := EXTRACT(EPOCH FROM clock_timestamp()) * 1000;
    v_count := mobile.sync_projects_all();
    v_end_time := EXTRACT(EPOCH FROM clock_timestamp()) * 1000;
    entity := 'projects';
    synced_count := v_count;
    duration_ms := (v_end_time - v_start_time)::INTEGER;
    RETURN NEXT;
    RAISE NOTICE '  ✓ Projets: % enregistrements (%ms)', v_count, duration_ms;

    -- Sync Deals
    v_start_time := EXTRACT(EPOCH FROM clock_timestamp()) * 1000;
    v_count := mobile.sync_deals();
    v_end_time := EXTRACT(EPOCH FROM clock_timestamp()) * 1000;
    entity := 'deals';
    synced_count := v_count;
    duration_ms := (v_end_time - v_start_time)::INTEGER;
    RETURN NEXT;
    RAISE NOTICE '  ✓ Deals: % enregistrements (%ms)', v_count, duration_ms;

    -- Sync Devis
    v_start_time := EXTRACT(EPOCH FROM clock_timestamp()) * 1000;
    v_count := mobile.sync_quotes();
    v_end_time := EXTRACT(EPOCH FROM clock_timestamp()) * 1000;
    entity := 'quotes';
    synced_count := v_count;
    duration_ms := (v_end_time - v_start_time)::INTEGER;
    RETURN NEXT;
    RAISE NOTICE '  ✓ Devis: % enregistrements (%ms)', v_count, duration_ms;

    -- Sync Produits
    v_start_time := EXTRACT(EPOCH FROM clock_timestamp()) * 1000;
    v_count := mobile.sync_products(500);
    v_end_time := EXTRACT(EPOCH FROM clock_timestamp()) * 1000;
    entity := 'products';
    synced_count := v_count;
    duration_ms := (v_end_time - v_start_time)::INTEGER;
    RETURN NEXT;
    RAISE NOTICE '  ✓ Produits: % enregistrements (%ms)', v_count, duration_ms;

    RAISE NOTICE '✅ Synchronisation complète terminée';
END;
$$ LANGUAGE plpgsql;

COMMENT ON FUNCTION mobile.full_sync_all() IS 'Synchronisation complète de toutes les entités business';

-- ============================================================
-- FIN MIGRATION 006
-- ============================================================

DO $$
BEGIN
    RAISE NOTICE '✅ Migration 006 terminée avec succès';
    RAISE NOTICE '📊 Fonctions créées:';
    RAISE NOTICE '   - mobile.sync_deals() - Synchronise affaires depuis Deal';
    RAISE NOTICE '   - mobile.sync_projects_all() - TOUS les chantiers';
    RAISE NOTICE '   - mobile.sync_quotes() - Devis depuis SaleDocument';
    RAISE NOTICE '   - mobile.full_sync_all() - Sync complète';
    RAISE NOTICE '';
    RAISE NOTICE '🎯 Prochaine étape: Exécuter mobile.full_sync_all()';
END $$;

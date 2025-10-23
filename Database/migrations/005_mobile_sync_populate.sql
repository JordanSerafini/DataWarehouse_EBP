-- ============================================================
-- Migration 005: Fonctions de synchronisation et population
-- ============================================================
-- Description: Fonctions pour alimenter les tables mobile depuis EBP
-- et filtres par profil utilisateur
-- ============================================================

-- ============================================================
-- 1. SYNC PROJETS/CHANTIERS (depuis ConstructionSite)
-- ============================================================

CREATE OR REPLACE FUNCTION mobile.sync_projects(
    p_days_back INTEGER DEFAULT 90,
    p_days_forward INTEGER DEFAULT 365
)
RETURNS INTEGER AS $$
DECLARE
    v_synced_count INTEGER;
BEGIN
    -- Insérer ou mettre à jour les chantiers actifs
    INSERT INTO mobile.projects (
        ebp_id,
        ebp_unique_id,
        name,
        reference,
        project_type,
        state,
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
        is_active,
        last_sync_at
    )
    SELECT
        cs."Id"::VARCHAR(50),
        cs."UniqueId"::VARCHAR(50),
        cs."Name",
        cs."Reference",
        cs."Type"::VARCHAR(50),
        cs."State",
        cs."CustomerId",
        c."Name",
        cs."StartDate",
        cs."EndDate",
        cs."Address_Address1",
        cs."Address_Address2",
        cs."Address_City",
        cs."Address_ZipCode",
        cs."Address_Latitude",
        cs."Address_Longitude",
        cs."DescriptionClear",
        cs."NotesClear",
        CASE WHEN cs."ActiveState" = 1 THEN true ELSE false END,
        NOW()
    FROM public."ConstructionSite" cs
    LEFT JOIN public."Customer" c ON cs."CustomerId" = c."Id"
    WHERE cs."ActiveState" = 1
      AND (
        cs."StartDate" >= CURRENT_DATE - (p_days_back || ' days')::INTERVAL
        OR cs."EndDate" >= CURRENT_DATE - (p_days_back || ' days')::INTERVAL
        OR cs."EndDate" IS NULL
      )
    ON CONFLICT (ebp_id)
    DO UPDATE SET
        name = EXCLUDED.name,
        reference = EXCLUDED.reference,
        project_type = EXCLUDED.project_type,
        state = EXCLUDED.state,
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
        is_active = EXCLUDED.is_active,
        last_sync_at = NOW();

    GET DIAGNOSTICS v_synced_count = ROW_COUNT;

    RETURN v_synced_count;
END;
$$ LANGUAGE plpgsql;

COMMENT ON FUNCTION mobile.sync_projects(INTEGER, INTEGER) IS 'Synchronise les chantiers depuis ConstructionSite vers mobile.projects';

-- ============================================================
-- 2. SYNC CONTACTS (depuis Contact)
-- ============================================================

CREATE OR REPLACE FUNCTION mobile.sync_contacts()
RETURNS INTEGER AS $$
DECLARE
    v_synced_count INTEGER;
BEGIN
    INSERT INTO mobile.contacts (
        ebp_id,
        customer_id,
        customer_name,
        civility,
        last_name,
        first_name,
        full_name,
        phone,
        mobile,
        email,
        job_title,
        department,
        is_main_contact,
        opt_in,
        notes,
        is_active,
        last_sync_at
    )
    SELECT
        ct."Id"::VARCHAR(50),
        ct."ThirdId",
        c."Name",
        ct."Civility",
        ct."Name",
        ct."FirstName",
        CONCAT_WS(' ', ct."FirstName", ct."Name"),
        ct."Phone",
        ct."CellPhone",
        ct."Email",
        ct."Function",
        ct."Department",
        ct."IsMain",
        ct."OptIn",
        ct."NotesClear",
        CASE WHEN ct."ActiveState" = 1 THEN true ELSE false END,
        NOW()
    FROM public."Contact" ct
    LEFT JOIN public."Customer" c ON ct."ThirdId" = c."Id"
    WHERE ct."ActiveState" = 1
    ON CONFLICT (ebp_id)
    DO UPDATE SET
        customer_name = EXCLUDED.customer_name,
        last_name = EXCLUDED.last_name,
        first_name = EXCLUDED.first_name,
        full_name = EXCLUDED.full_name,
        phone = EXCLUDED.phone,
        mobile = EXCLUDED.mobile,
        email = EXCLUDED.email,
        job_title = EXCLUDED.job_title,
        is_main_contact = EXCLUDED.is_main_contact,
        is_active = EXCLUDED.is_active,
        last_sync_at = NOW();

    GET DIAGNOSTICS v_synced_count = ROW_COUNT;

    RETURN v_synced_count;
END;
$$ LANGUAGE plpgsql;

COMMENT ON FUNCTION mobile.sync_contacts() IS 'Synchronise les contacts clients depuis Contact vers mobile.contacts';

-- ============================================================
-- 3. SYNC PRODUITS (depuis Item - top utilisés uniquement)
-- ============================================================

CREATE OR REPLACE FUNCTION mobile.sync_products(
    p_limit INTEGER DEFAULT 500
)
RETURNS INTEGER AS $$
DECLARE
    v_synced_count INTEGER;
BEGIN
    INSERT INTO mobile.products (
        ebp_id,
        name,
        reference,
        item_type,
        family_id,
        family_name,
        selling_price_excl_tax,
        selling_price_incl_tax,
        description,
        is_active,
        last_sync_at
    )
    SELECT
        i."Id"::VARCHAR(50),
        i."Name",
        i."Reference",
        i."Type",
        i."ItemFamilyId",
        fam."Name",
        i."SellingPriceVatExcluded",
        i."SellingPriceVatIncluded",
        i."DescriptionClear",
        CASE WHEN i."ActiveState" = 1 THEN true ELSE false END,
        NOW()
    FROM public."Item" i
    LEFT JOIN public."ItemFamily" fam ON i."ItemFamilyId" = fam."Id"
    WHERE i."ActiveState" = 1
      AND i."Type" IN (0, 1) -- Produits et services uniquement
    ORDER BY i."ModifiedDate" DESC
    LIMIT p_limit
    ON CONFLICT (ebp_id)
    DO UPDATE SET
        name = EXCLUDED.name,
        reference = EXCLUDED.reference,
        selling_price_excl_tax = EXCLUDED.selling_price_excl_tax,
        selling_price_incl_tax = EXCLUDED.selling_price_incl_tax,
        description = EXCLUDED.description,
        is_active = EXCLUDED.is_active,
        last_sync_at = NOW();

    GET DIAGNOSTICS v_synced_count = ROW_COUNT;

    RETURN v_synced_count;
END;
$$ LANGUAGE plpgsql;

COMMENT ON FUNCTION mobile.sync_products(INTEGER) IS 'Synchronise le catalogue produits (top N) depuis Item';

-- ============================================================
-- 4. SYNC COLLÈGUES (depuis Colleague)
-- ============================================================

CREATE OR REPLACE FUNCTION mobile.sync_colleagues()
RETURNS INTEGER AS $$
DECLARE
    v_synced_count INTEGER;
BEGIN
    INSERT INTO mobile.colleagues (
        ebp_id,
        first_name,
        last_name,
        full_name,
        phone,
        mobile,
        email,
        job_title,
        is_active,
        last_sync_at
    )
    SELECT
        col."Id"::VARCHAR(50),
        col."FirstName",
        col."Name",
        CONCAT_WS(' ', col."FirstName", col."Name"),
        col."Phone",
        col."CellPhone",
        col."Email",
        col."Function",
        CASE WHEN col."ActiveState" = 1 THEN true ELSE false END,
        NOW()
    FROM public."Colleague" col
    WHERE col."ActiveState" = 1
    ON CONFLICT (ebp_id)
    DO UPDATE SET
        first_name = EXCLUDED.first_name,
        last_name = EXCLUDED.last_name,
        full_name = EXCLUDED.full_name,
        phone = EXCLUDED.phone,
        mobile = EXCLUDED.mobile,
        email = EXCLUDED.email,
        job_title = EXCLUDED.job_title,
        is_active = EXCLUDED.is_active,
        last_sync_at = NOW();

    GET DIAGNOSTICS v_synced_count = ROW_COUNT;

    RETURN v_synced_count;
END;
$$ LANGUAGE plpgsql;

COMMENT ON FUNCTION mobile.sync_colleagues() IS 'Synchronise l''équipe depuis Colleague';

-- ============================================================
-- 5. FONCTION GLOBALE DE SYNC INITIALE
-- ============================================================

CREATE OR REPLACE FUNCTION mobile.initial_sync_all()
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
    RAISE NOTICE '🔄 Démarrage synchronisation initiale...';

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

    -- Sync Projets
    v_start_time := EXTRACT(EPOCH FROM clock_timestamp()) * 1000;
    v_count := mobile.sync_projects(90, 365);
    v_end_time := EXTRACT(EPOCH FROM clock_timestamp()) * 1000;
    entity := 'projects';
    synced_count := v_count;
    duration_ms := (v_end_time - v_start_time)::INTEGER;
    RETURN NEXT;
    RAISE NOTICE '  ✓ Projets: % enregistrements (%ms)', v_count, duration_ms;

    -- Sync Produits
    v_start_time := EXTRACT(EPOCH FROM clock_timestamp()) * 1000;
    v_count := mobile.sync_products(500);
    v_end_time := EXTRACT(EPOCH FROM clock_timestamp()) * 1000;
    entity := 'products';
    synced_count := v_count;
    duration_ms := (v_end_time - v_start_time)::INTEGER;
    RETURN NEXT;
    RAISE NOTICE '  ✓ Produits: % enregistrements (%ms)', v_count, duration_ms;

    RAISE NOTICE '✅ Synchronisation initiale terminée';
END;
$$ LANGUAGE plpgsql;

COMMENT ON FUNCTION mobile.initial_sync_all() IS 'Synchronisation initiale complète de toutes les entités';

-- ============================================================
-- 6. FONCTIONS DE FILTRAGE PAR PROFIL
-- ============================================================

-- Fonction: Récupérer les projets pour un chef de chantier
CREATE OR REPLACE FUNCTION mobile.get_projects_for_manager(
    p_manager_id VARCHAR(50)
)
RETURNS TABLE (
    id INTEGER,
    name VARCHAR(200),
    reference VARCHAR(50),
    customer_name VARCHAR(100),
    state INTEGER,
    start_date TIMESTAMP,
    end_date TIMESTAMP,
    city VARCHAR(50),
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8)
) AS $$
BEGIN
    RETURN QUERY
    SELECT
        p.id,
        p.name,
        p.reference,
        p.customer_name,
        p.state,
        p.start_date,
        p.end_date,
        p.city,
        p.latitude,
        p.longitude
    FROM mobile.projects p
    WHERE p.site_manager_id = p_manager_id
      AND p.is_active = true
    ORDER BY p.start_date DESC;
END;
$$ LANGUAGE plpgsql;

-- Fonction: Récupérer les devis pour un commercial
CREATE OR REPLACE FUNCTION mobile.get_quotes_for_salesperson(
    p_salesperson_id VARCHAR(50),
    p_days_back INTEGER DEFAULT 180
)
RETURNS TABLE (
    id INTEGER,
    quote_number VARCHAR(50),
    quote_date DATE,
    customer_name VARCHAR(100),
    total_incl_tax DECIMAL(15, 2),
    state INTEGER,
    won_probability INTEGER
) AS $$
BEGIN
    RETURN QUERY
    SELECT
        q.id,
        q.quote_number,
        q.quote_date,
        q.customer_name,
        q.total_incl_tax,
        q.state,
        q.won_probability
    FROM mobile.quotes q
    WHERE q.salesperson_id = p_salesperson_id
      AND q.quote_date >= CURRENT_DATE - (p_days_back || ' days')::INTERVAL
    ORDER BY q.quote_date DESC;
END;
$$ LANGUAGE plpgsql;

-- Fonction: Dashboard patron - KPIs globaux
CREATE OR REPLACE FUNCTION mobile.get_dashboard_kpis(
    p_date_from DATE DEFAULT CURRENT_DATE - INTERVAL '30 days',
    p_date_to DATE DEFAULT CURRENT_DATE
)
RETURNS TABLE (
    kpi_name VARCHAR(50),
    kpi_value NUMERIC,
    kpi_unit VARCHAR(20),
    trend_percent NUMERIC
) AS $$
BEGIN
    -- Nombre de projets actifs
    kpi_name := 'active_projects';
    SELECT COUNT(*) INTO kpi_value
    FROM mobile.projects
    WHERE is_active = true
      AND (end_date IS NULL OR end_date >= p_date_from);
    kpi_unit := 'count';
    trend_percent := 0;
    RETURN NEXT;

    -- Nombre de devis en attente
    kpi_name := 'pending_quotes';
    SELECT COUNT(*) INTO kpi_value
    FROM mobile.quotes
    WHERE state IN (0, 1) -- En attente ou envoyé
      AND quote_date >= p_date_from;
    kpi_unit := 'count';
    trend_percent := 0;
    RETURN NEXT;

    -- Nombre de tickets ouverts
    kpi_name := 'open_tickets';
    SELECT COUNT(*) INTO kpi_value
    FROM mobile.mobile_incidents
    WHERE synced_to_ebp = false
      OR created_at >= p_date_from;
    kpi_unit := 'count';
    trend_percent := 0;
    RETURN NEXT;

    -- Nombre d'interventions programmées
    kpi_name := 'scheduled_interventions';
    SELECT COUNT(*) INTO kpi_value
    FROM mobile.v_interventions
    WHERE start_date BETWEEN p_date_from AND p_date_to;
    kpi_unit := 'count';
    trend_percent := 0;
    RETURN NEXT;

    -- Temps non validés
    kpi_name := 'unvalidated_hours';
    SELECT COALESCE(SUM(duration_hours), 0) INTO kpi_value
    FROM mobile.timesheets
    WHERE is_validated = false
      AND date >= p_date_from;
    kpi_unit := 'hours';
    trend_percent := 0;
    RETURN NEXT;

    -- Notes de frais en attente
    kpi_name := 'pending_expenses';
    SELECT COALESCE(SUM(amount), 0) INTO kpi_value
    FROM mobile.expenses
    WHERE is_validated = false
      AND expense_date >= p_date_from;
    kpi_unit := 'EUR';
    trend_percent := 0;
    RETURN NEXT;
END;
$$ LANGUAGE plpgsql;

COMMENT ON FUNCTION mobile.get_dashboard_kpis(DATE, DATE) IS 'KPIs dashboard pour profil Patron';

-- ============================================================
-- 7. FONCTIONS UTILITAIRES
-- ============================================================

-- Fonction: Obtenir les statistiques de sync
CREATE OR REPLACE FUNCTION mobile.get_sync_stats()
RETURNS TABLE (
    table_name VARCHAR(50),
    total_records BIGINT,
    last_sync TIMESTAMP,
    needs_sync BIGINT
) AS $$
BEGIN
    RETURN QUERY
    SELECT
        'projects'::VARCHAR(50),
        COUNT(*)::BIGINT,
        MAX(last_sync_at),
        COUNT(*) FILTER (WHERE last_sync_at < NOW() - INTERVAL '1 hour')::BIGINT
    FROM mobile.projects

    UNION ALL

    SELECT
        'quotes'::VARCHAR(50),
        COUNT(*)::BIGINT,
        MAX(last_sync_at),
        COUNT(*) FILTER (WHERE last_sync_at < NOW() - INTERVAL '1 hour')::BIGINT
    FROM mobile.quotes

    UNION ALL

    SELECT
        'contacts'::VARCHAR(50),
        COUNT(*)::BIGINT,
        MAX(last_sync_at),
        COUNT(*) FILTER (WHERE last_sync_at < NOW() - INTERVAL '1 hour')::BIGINT
    FROM mobile.contacts

    UNION ALL

    SELECT
        'products'::VARCHAR(50),
        COUNT(*)::BIGINT,
        MAX(last_sync_at),
        COUNT(*) FILTER (WHERE last_sync_at < NOW() - INTERVAL '1 hour')::BIGINT
    FROM mobile.products

    UNION ALL

    SELECT
        'colleagues'::VARCHAR(50),
        COUNT(*)::BIGINT,
        MAX(last_sync_at),
        COUNT(*) FILTER (WHERE last_sync_at < NOW() - INTERVAL '1 hour')::BIGINT
    FROM mobile.colleagues;
END;
$$ LANGUAGE plpgsql;

COMMENT ON FUNCTION mobile.get_sync_stats() IS 'Statistiques de synchronisation pour monitoring';

-- ============================================================
-- 8. COMMENTAIRES
-- ============================================================

COMMENT ON FUNCTION mobile.sync_projects(INTEGER, INTEGER) IS 'Sync projets/chantiers (Chef de chantier + Patron)';
COMMENT ON FUNCTION mobile.sync_contacts() IS 'Sync contacts clients (Tous profils)';
COMMENT ON FUNCTION mobile.sync_products(INTEGER) IS 'Sync catalogue produits top N (Commerciaux + Techniciens)';
COMMENT ON FUNCTION mobile.sync_colleagues() IS 'Sync équipe (Chef de chantier + Patron)';
COMMENT ON FUNCTION mobile.get_projects_for_manager(VARCHAR) IS 'Projets filtrés pour chef de chantier';
COMMENT ON FUNCTION mobile.get_quotes_for_salesperson(VARCHAR, INTEGER) IS 'Devis filtrés pour commercial';

-- ============================================================
-- FIN MIGRATION 005
-- ============================================================

DO $$
BEGIN
    RAISE NOTICE '✅ Migration 005 terminée avec succès';
    RAISE NOTICE '📊 Fonctions créées:';
    RAISE NOTICE '   - 4 fonctions de sync (projects, contacts, products, colleagues)';
    RAISE NOTICE '   - 1 fonction sync globale (initial_sync_all)';
    RAISE NOTICE '   - 3 fonctions de filtrage par profil';
    RAISE NOTICE '   - 1 fonction dashboard KPIs (patron)';
    RAISE NOTICE '   - 1 fonction stats de sync';
    RAISE NOTICE '';
    RAISE NOTICE '🎯 Prochaine étape: Exécuter mobile.initial_sync_all() pour alimenter les données';
END $$;

-- ============================================================
-- Migration 008: Mapping complet des documents vers mobile
-- ============================================================
-- Description: Synchronisation complète de tous les types de documents
--              (factures, BL, avoirs, documents Deal, etc.)
-- ============================================================

-- ============================================================
-- 1. TABLE: mobile.sale_documents (Factures, BL, Avoirs, etc.)
-- ============================================================
-- Pour tous les SaleDocument sauf Devis (qui sont dans mobile.quotes)

CREATE TABLE IF NOT EXISTS mobile.sale_documents (
    id SERIAL PRIMARY KEY,

    -- Identifiants EBP
    ebp_id VARCHAR(50) UNIQUE NOT NULL,
    ebp_doc_id VARCHAR(50),

    -- Type de document
    document_type INTEGER NOT NULL, -- 2=Facture, 3=Avoir, 6=BL, 7=Facture acompte, 8=Bon retour
    document_type_label VARCHAR(30),

    -- Numérotation
    document_number VARCHAR(50) NOT NULL,
    document_date DATE,

    -- État
    document_state INTEGER DEFAULT 0,
    state_label VARCHAR(50),
    is_validated BOOLEAN DEFAULT false,

    -- Client
    customer_id VARCHAR(50),
    customer_name VARCHAR(100),
    customer_reference VARCHAR(50),

    -- Commercial
    salesperson_id VARCHAR(50),
    salesperson_name VARCHAR(100),

    -- Montants
    amount_excl_tax DECIMAL(15, 2),
    amount_incl_tax DECIMAL(15, 2),
    vat_amount DECIMAL(15, 2),
    total_discount DECIMAL(15, 2),

    -- Référence devis/commande origine
    origin_quote_id VARCHAR(50),
    origin_quote_number VARCHAR(50),

    -- Dates importantes
    due_date DATE,
    delivery_date DATE,

    -- Informations de paiement (factures)
    payment_status INTEGER,
    paid_amount DECIMAL(15, 2),
    remaining_amount DECIMAL(15, 2),
    payment_method VARCHAR(50),

    -- Livraison (BL)
    delivery_address TEXT,
    delivery_contact_name VARCHAR(100),
    delivery_contact_phone VARCHAR(20),
    is_delivered BOOLEAN DEFAULT false,

    -- Notes
    notes TEXT,
    internal_notes TEXT,

    -- Pièces jointes
    has_attachments BOOLEAN DEFAULT false,
    attachments_count INTEGER DEFAULT 0,
    pdf_path TEXT,

    -- Sync
    is_active BOOLEAN DEFAULT true,
    last_sync_at TIMESTAMP DEFAULT NOW(),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_sale_docs_customer ON mobile.sale_documents(customer_id);
CREATE INDEX idx_sale_docs_type ON mobile.sale_documents(document_type);
CREATE INDEX idx_sale_docs_date ON mobile.sale_documents(document_date DESC);
CREATE INDEX idx_sale_docs_state ON mobile.sale_documents(document_state);
CREATE INDEX idx_sale_docs_number ON mobile.sale_documents(document_number);

COMMENT ON TABLE mobile.sale_documents IS 'Documents de vente (factures, BL, avoirs) - lecture seule mobile';

-- ============================================================
-- 2. TABLE: mobile.sale_document_lines (Lignes de tous documents)
-- ============================================================

CREATE TABLE IF NOT EXISTS mobile.sale_document_lines (
    id SERIAL PRIMARY KEY,

    -- Lien avec document
    document_id INTEGER,
    ebp_document_id VARCHAR(50) NOT NULL,
    document_type INTEGER, -- Pour faciliter les requêtes

    -- Ligne
    line_number INTEGER,
    line_type INTEGER DEFAULT 0, -- 0=produit, 1=commentaire, 2=sous-total

    -- Produit
    item_id VARCHAR(50),
    item_name VARCHAR(200),
    item_reference VARCHAR(50),
    item_description TEXT,

    -- Quantités
    quantity DECIMAL(15, 3),
    unit VARCHAR(20),

    -- Prix
    unit_price_excl_tax DECIMAL(15, 4),
    discount_percent DECIMAL(5, 2),
    total_excl_tax DECIMAL(15, 2),
    total_incl_tax DECIMAL(15, 2),
    vat_rate DECIMAL(5, 2),
    vat_amount DECIMAL(15, 2),

    -- Informations complémentaires
    warehouse_id VARCHAR(50),
    warehouse_name VARCHAR(100),

    -- Sync
    last_sync_at TIMESTAMP DEFAULT NOW(),
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_sale_doc_lines_doc ON mobile.sale_document_lines(ebp_document_id);
CREATE INDEX idx_sale_doc_lines_item ON mobile.sale_document_lines(item_id);
CREATE INDEX idx_sale_doc_lines_type ON mobile.sale_document_lines(document_type);

COMMENT ON TABLE mobile.sale_document_lines IS 'Lignes de tous les documents de vente';

-- ============================================================
-- 3. TABLE: mobile.deal_documents (Documents liés aux Affaires)
-- ============================================================

CREATE TABLE IF NOT EXISTS mobile.deal_documents (
    id SERIAL PRIMARY KEY,

    -- Identifiants EBP
    ebp_id VARCHAR(50) UNIQUE NOT NULL,
    ebp_doc_id VARCHAR(50),

    -- Source (vente ou achat)
    source_type VARCHAR(10) NOT NULL, -- 'sale' ou 'purchase'

    -- Type de document
    document_type INTEGER NOT NULL,
    document_type_label VARCHAR(30),

    -- Numérotation
    document_number VARCHAR(50) NOT NULL,
    document_date DATE,

    -- État
    document_state INTEGER DEFAULT 0,
    global_state VARCHAR(100),
    is_validated BOOLEAN DEFAULT false,

    -- Affaire liée
    deal_id VARCHAR(50),
    deal_name VARCHAR(200),

    -- Chantier lié
    construction_site_id VARCHAR(50),
    construction_site_name VARCHAR(200),

    -- Tiers (client ou fournisseur)
    third_party_id VARCHAR(50),
    third_party_name VARCHAR(100),
    third_party_type VARCHAR(20), -- 'customer' ou 'supplier'

    -- Commercial/Acheteur
    colleague_id VARCHAR(50),
    colleague_name VARCHAR(100),

    -- Montants
    amount_excl_tax DECIMAL(15, 2),
    amount_incl_tax DECIMAL(15, 2),
    net_amount_excl_tax DECIMAL(15, 2),
    net_amount_incl_tax DECIMAL(15, 2),

    -- Durées (pour services)
    achieved_duration DECIMAL(15, 2),
    expected_duration DECIMAL(15, 2),
    invoicable_duration DECIMAL(15, 2),

    -- Achat spécifique
    include_in_cost BOOLEAN DEFAULT false,
    included_amount DECIMAL(15, 2),

    -- Notes
    notes TEXT,

    -- Pièces jointes
    has_attachments BOOLEAN DEFAULT false,
    pdf_path TEXT,

    -- Sync
    is_active BOOLEAN DEFAULT true,
    last_sync_at TIMESTAMP DEFAULT NOW(),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_deal_docs_deal ON mobile.deal_documents(deal_id);
CREATE INDEX idx_deal_docs_site ON mobile.deal_documents(construction_site_id);
CREATE INDEX idx_deal_docs_type ON mobile.deal_documents(source_type, document_type);
CREATE INDEX idx_deal_docs_date ON mobile.deal_documents(document_date DESC);
CREATE INDEX idx_deal_docs_third ON mobile.deal_documents(third_party_id);

COMMENT ON TABLE mobile.deal_documents IS 'Documents liés aux affaires (vente ET achat) pour suivi chantier';

-- ============================================================
-- 4. TABLE: mobile.deal_document_lines (Lignes documents affaires)
-- ============================================================

CREATE TABLE IF NOT EXISTS mobile.deal_document_lines (
    id SERIAL PRIMARY KEY,

    -- Lien avec document
    deal_document_id INTEGER,
    ebp_document_id VARCHAR(50) NOT NULL,
    source_type VARCHAR(10) NOT NULL, -- 'sale' ou 'purchase'

    -- Ligne
    line_number INTEGER,
    line_type INTEGER DEFAULT 0,

    -- Produit/Service
    item_id VARCHAR(50),
    item_name VARCHAR(200),
    item_reference VARCHAR(50),
    item_description TEXT,

    -- Quantités
    quantity DECIMAL(15, 3),
    unit VARCHAR(20),

    -- Prix
    unit_price_excl_tax DECIMAL(15, 4),
    discount_percent DECIMAL(5, 2),
    total_excl_tax DECIMAL(15, 2),
    total_incl_tax DECIMAL(15, 2),
    vat_rate DECIMAL(5, 2),

    -- Informations complémentaires
    warehouse_id VARCHAR(50),
    deal_id VARCHAR(50),
    construction_site_id VARCHAR(50),

    -- Sync
    last_sync_at TIMESTAMP DEFAULT NOW(),
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_deal_doc_lines_doc ON mobile.deal_document_lines(ebp_document_id);
CREATE INDEX idx_deal_doc_lines_deal ON mobile.deal_document_lines(deal_id);
CREATE INDEX idx_deal_doc_lines_item ON mobile.deal_document_lines(item_id);
CREATE INDEX idx_deal_doc_lines_type ON mobile.deal_document_lines(source_type);

COMMENT ON TABLE mobile.deal_document_lines IS 'Lignes des documents affaires (vente + achat)';

-- ============================================================
-- FONCTION: Sync Factures (DocumentType 2, 7)
-- ============================================================

CREATE OR REPLACE FUNCTION mobile.sync_invoices(
    p_months_back INTEGER DEFAULT 24
)
RETURNS INTEGER AS $$
DECLARE
    v_synced INTEGER := 0;
    v_cutoff_date DATE;
BEGIN
    v_cutoff_date := CURRENT_DATE - (p_months_back || ' months')::INTERVAL;

    INSERT INTO mobile.sale_documents (
        ebp_id, ebp_doc_id, document_type, document_type_label,
        document_number, document_date, document_state,
        customer_id, customer_name,
        salesperson_id,
        amount_excl_tax, amount_incl_tax,
        origin_quote_number,
        due_date,
        notes,
        last_sync_at
    )
    SELECT
        sd."Id"::VARCHAR(50),
        sd."Id"::VARCHAR(50), -- SaleDocument.Id IS the document ID
        sd."DocumentType",
        CASE sd."DocumentType"
            WHEN 2 THEN 'Facture'
            WHEN 7 THEN 'Facture acompte'
        END,
        sd."DocumentNumber",
        sd."DocumentDate"::DATE,
        sd."DocumentState",
        sd."CustomerId",
        sd."CustomerName",
        sd."ColleagueId",
        sd."AmountVatExcluded",
        sd."AmountVatIncluded",
        sd."OriginDocumentNumber",
        sd."ValidityDate"::DATE,
        COALESCE(sd."NotesClear", sd."Notes"),
        NOW()
    FROM public."SaleDocument" sd
    WHERE sd."DocumentType" IN (2, 7)
      AND sd."DocumentDate"::DATE >= v_cutoff_date
      AND (sd."DocumentState" IS NULL OR sd."DocumentState" >= 0)
    ON CONFLICT (ebp_id) DO UPDATE SET
        document_state = EXCLUDED.document_state,
        amount_excl_tax = EXCLUDED.amount_excl_tax,
        amount_incl_tax = EXCLUDED.amount_incl_tax,
        last_sync_at = NOW();

    GET DIAGNOSTICS v_synced = ROW_COUNT;

    RAISE NOTICE '✅ Sync invoices: % factures synchronisées', v_synced;
    RETURN v_synced;
END;
$$ LANGUAGE plpgsql;

-- ============================================================
-- FONCTION: Sync Bons de livraison (DocumentType 6, 8)
-- ============================================================

CREATE OR REPLACE FUNCTION mobile.sync_delivery_notes(
    p_months_back INTEGER DEFAULT 24
)
RETURNS INTEGER AS $$
DECLARE
    v_synced INTEGER := 0;
    v_cutoff_date DATE;
BEGIN
    v_cutoff_date := CURRENT_DATE - (p_months_back || ' months')::INTERVAL;

    INSERT INTO mobile.sale_documents (
        ebp_id, ebp_doc_id, document_type, document_type_label,
        document_number, document_date, document_state,
        customer_id, customer_name,
        salesperson_id,
        amount_excl_tax, amount_incl_tax,
        delivery_date,
        delivery_address,
        delivery_contact_name,
        delivery_contact_phone,
        notes,
        last_sync_at
    )
    SELECT
        sd."Id"::VARCHAR(50),
        sd."Id"::VARCHAR(50), -- SaleDocument.Id IS the document ID
        sd."DocumentType",
        CASE sd."DocumentType"
            WHEN 6 THEN 'Bon de livraison'
            WHEN 8 THEN 'Bon de retour'
        END,
        sd."DocumentNumber",
        sd."DocumentDate"::DATE,
        sd."DocumentState",
        sd."CustomerId",
        sd."CustomerName",
        sd."ColleagueId",
        sd."AmountVatExcluded",
        sd."AmountVatIncluded",
        sd."DeliveryDate"::DATE,
        CONCAT_WS(', ',
            sd."DeliveryAddress_Address1",
            sd."DeliveryAddress_ZipCode",
            sd."DeliveryAddress_City"
        ),
        sd."DeliveryContact_Name",
        sd."DeliveryContact_Phone",
        COALESCE(sd."NotesClear", sd."Notes"),
        NOW()
    FROM public."SaleDocument" sd
    WHERE sd."DocumentType" IN (6, 8)
      AND sd."DocumentDate"::DATE >= v_cutoff_date
      AND (sd."DocumentState" IS NULL OR sd."DocumentState" >= 0)
    ON CONFLICT (ebp_id) DO UPDATE SET
        document_state = EXCLUDED.document_state,
        delivery_date = EXCLUDED.delivery_date,
        last_sync_at = NOW();

    GET DIAGNOSTICS v_synced = ROW_COUNT;

    RAISE NOTICE '✅ Sync delivery notes: % BL synchronisés', v_synced;
    RETURN v_synced;
END;
$$ LANGUAGE plpgsql;

-- ============================================================
-- FONCTION: Sync Avoirs (DocumentType 3)
-- ============================================================

CREATE OR REPLACE FUNCTION mobile.sync_credit_notes(
    p_months_back INTEGER DEFAULT 24
)
RETURNS INTEGER AS $$
DECLARE
    v_synced INTEGER := 0;
    v_cutoff_date DATE;
BEGIN
    v_cutoff_date := CURRENT_DATE - (p_months_back || ' months')::INTERVAL;

    INSERT INTO mobile.sale_documents (
        ebp_id, ebp_doc_id, document_type, document_type_label,
        document_number, document_date, document_state,
        customer_id, customer_name,
        salesperson_id,
        amount_excl_tax, amount_incl_tax,
        origin_quote_number,
        notes,
        last_sync_at
    )
    SELECT
        sd."Id"::VARCHAR(50),
        sd."Id"::VARCHAR(50), -- SaleDocument.Id IS the document ID
        sd."DocumentType",
        'Avoir',
        sd."DocumentNumber",
        sd."DocumentDate"::DATE,
        sd."DocumentState",
        sd."CustomerId",
        sd."CustomerName",
        sd."ColleagueId",
        sd."AmountVatExcluded",
        sd."AmountVatIncluded",
        sd."OriginDocumentNumber",
        COALESCE(sd."NotesClear", sd."Notes"),
        NOW()
    FROM public."SaleDocument" sd
    WHERE sd."DocumentType" = 3
      AND sd."DocumentDate"::DATE >= v_cutoff_date
      AND (sd."DocumentState" IS NULL OR sd."DocumentState" >= 0)
    ON CONFLICT (ebp_id) DO UPDATE SET
        document_state = EXCLUDED.document_state,
        amount_excl_tax = EXCLUDED.amount_excl_tax,
        amount_incl_tax = EXCLUDED.amount_incl_tax,
        last_sync_at = NOW();

    GET DIAGNOSTICS v_synced = ROW_COUNT;

    RAISE NOTICE '✅ Sync credit notes: % avoirs synchronisés', v_synced;
    RETURN v_synced;
END;
$$ LANGUAGE plpgsql;

-- ============================================================
-- FONCTION: Sync lignes de documents de vente
-- ============================================================

CREATE OR REPLACE FUNCTION mobile.sync_sale_document_lines()
RETURNS INTEGER AS $$
DECLARE
    v_synced INTEGER := 0;
BEGIN
    -- Supprimer les anciennes lignes
    DELETE FROM mobile.sale_document_lines;

    -- Insérer les nouvelles lignes depuis SaleDocumentLine
    INSERT INTO mobile.sale_document_lines (
        ebp_document_id, document_type,
        line_number, line_type,
        item_id, item_name, item_reference, item_description,
        quantity, unit,
        unit_price_excl_tax, discount_percent,
        total_excl_tax, total_incl_tax,
        vat_rate, vat_amount,
        last_sync_at
    )
    SELECT
        sdl."DocumentId"::VARCHAR(50),
        sd."DocumentType",
        sdl."LineOrder",
        CASE
            WHEN sdl."ItemId" IS NULL THEN 1
            ELSE 0
        END,
        sdl."ItemId",
        i."Caption",
        i."Id",
        COALESCE(sdl."DescriptionClear", sdl."Description"),
        sdl."Quantity",
        NULL, -- SaleDocumentLine has no Unit column
        sdl."NetPriceVatExcluded",
        sdl."TotalDiscountRate",
        sdl."NetAmountVatExcluded",
        sdl."NetAmountVatIncluded",
        CASE
            WHEN sdl."NetAmountVatExcluded" > 0
            THEN ROUND(((sdl."NetAmountVatIncluded" - sdl."NetAmountVatExcluded") / sdl."NetAmountVatExcluded" * 100)::NUMERIC, 2)
            ELSE 0
        END as vat_rate,
        (sdl."NetAmountVatIncluded" - sdl."NetAmountVatExcluded") as vat_amount,
        NOW()
    FROM public."SaleDocumentLine" sdl
    INNER JOIN public."SaleDocument" sd ON sdl."DocumentId" = sd."Id"
    INNER JOIN mobile.sale_documents msd ON sd."Id"::VARCHAR(50) = msd.ebp_id
    LEFT JOIN public."Item" i ON sdl."ItemId" = i."Id"
    WHERE sd."DocumentType" IN (2, 3, 6, 7, 8)
    ORDER BY sdl."DocumentId", sdl."LineOrder";

    GET DIAGNOSTICS v_synced = ROW_COUNT;

    -- Mettre à jour les FK document_id
    UPDATE mobile.sale_document_lines sdl
    SET document_id = msd.id
    FROM mobile.sale_documents msd
    WHERE sdl.ebp_document_id = msd.ebp_id;

    RAISE NOTICE '✅ Sync sale document lines: % lignes synchronisées', v_synced;
    RETURN v_synced;
END;
$$ LANGUAGE plpgsql;

-- ============================================================
-- FONCTION: Sync documents Deal (vente)
-- ============================================================

CREATE OR REPLACE FUNCTION mobile.sync_deal_sale_documents(
    p_months_back INTEGER DEFAULT 24
)
RETURNS INTEGER AS $$
DECLARE
    v_synced INTEGER := 0;
    v_cutoff_date DATE;
BEGIN
    v_cutoff_date := CURRENT_DATE - (p_months_back || ' months')::INTERVAL;

    INSERT INTO mobile.deal_documents (
        ebp_id, ebp_doc_id, source_type,
        document_type, document_type_label,
        document_number, document_date, document_state, global_state,
        deal_id, construction_site_id,
        third_party_id, third_party_name, third_party_type,
        colleague_id,
        amount_excl_tax, amount_incl_tax,
        net_amount_excl_tax, net_amount_incl_tax,
        achieved_duration, expected_duration, invoicable_duration,
        last_sync_at
    )
    SELECT
        dsd."Id"::VARCHAR(50),
        dsd."DocumentId"::VARCHAR(50),
        'sale',
        dsd."DocumentType",
        CASE dsd."DocumentType"
            WHEN 1 THEN 'Devis affaire'
            WHEN 2 THEN 'Facture affaire'
            WHEN 6 THEN 'BL affaire'
            ELSE 'Document vente'
        END,
        dsd."DocumentNumber",
        dsd."DocumentDate"::DATE,
        dsd."DocumentState",
        dsd."GlobalDocumentState",
        dsd."DealId",
        dsd."ConstructionSiteId",
        dsd."CustomerId",
        dsd."CustomerName",
        'customer',
        dsd."ColleagueId",
        dsd."AmountVatExcluded",
        dsd."AmountVatExcluded" * 1.20, -- Estimation TVA
        dsd."NetAmountVatExcludedWithDiscount",
        dsd."NetAmountVatIncludedWithDiscount",
        dsd."AchievedDuration",
        dsd."ExpectedDuration",
        dsd."InvoicableAchievedDuration",
        NOW()
    FROM public."DealSaleDocument" dsd
    WHERE dsd."DocumentDate"::DATE >= v_cutoff_date
      AND (dsd."DocumentState" IS NULL OR dsd."DocumentState" >= 0)
    ON CONFLICT (ebp_id) DO UPDATE SET
        document_state = EXCLUDED.document_state,
        global_state = EXCLUDED.global_state,
        amount_excl_tax = EXCLUDED.amount_excl_tax,
        last_sync_at = NOW();

    GET DIAGNOSTICS v_synced = ROW_COUNT;

    RAISE NOTICE '✅ Sync deal sale documents: % documents vente affaires synchronisés', v_synced;
    RETURN v_synced;
END;
$$ LANGUAGE plpgsql;

-- ============================================================
-- FONCTION: Sync documents Deal (achat)
-- ============================================================

CREATE OR REPLACE FUNCTION mobile.sync_deal_purchase_documents(
    p_months_back INTEGER DEFAULT 24
)
RETURNS INTEGER AS $$
DECLARE
    v_synced INTEGER := 0;
    v_cutoff_date DATE;
BEGIN
    v_cutoff_date := CURRENT_DATE - (p_months_back || ' months')::INTERVAL;

    INSERT INTO mobile.deal_documents (
        ebp_id, ebp_doc_id, source_type,
        document_type, document_type_label,
        document_number, document_date, document_state, global_state,
        deal_id, construction_site_id,
        third_party_id, third_party_name, third_party_type,
        amount_excl_tax, amount_incl_tax,
        net_amount_excl_tax, net_amount_incl_tax,
        include_in_cost, included_amount,
        last_sync_at
    )
    SELECT
        dpd."Id"::VARCHAR(50),
        dpd."DocumentId"::VARCHAR(50),
        'purchase',
        dpd."DocumentType",
        CASE dpd."DocumentType"
            WHEN 1 THEN 'Commande fournisseur'
            WHEN 2 THEN 'Facture fournisseur'
            WHEN 6 THEN 'BL fournisseur'
            ELSE 'Document achat'
        END,
        dpd."DocumentNumber",
        dpd."DocumentDate"::DATE,
        dpd."DocumentState",
        dpd."GlobalDocumentState",
        dpd."DealId",
        dpd."ConstructionSiteId",
        dpd."SupplierId",
        dpd."SupplierName",
        'supplier',
        dpd."AmountVatExcluded",
        dpd."AmountVatExcluded" * 1.20, -- Estimation TVA
        dpd."NetAmountVatExcludedWithDiscount",
        dpd."NetAmountVatIncludedWithDiscount",
        dpd."IncludeAmountInCost",
        dpd."IncludedAmount",
        NOW()
    FROM public."DealPurchaseDocument" dpd
    WHERE dpd."DocumentDate"::DATE >= v_cutoff_date
      AND (dpd."DocumentState" IS NULL OR dpd."DocumentState" >= 0)
    ON CONFLICT (ebp_id) DO UPDATE SET
        document_state = EXCLUDED.document_state,
        global_state = EXCLUDED.global_state,
        amount_excl_tax = EXCLUDED.amount_excl_tax,
        last_sync_at = NOW();

    GET DIAGNOSTICS v_synced = ROW_COUNT;

    RAISE NOTICE '✅ Sync deal purchase documents: % documents achat affaires synchronisés', v_synced;
    RETURN v_synced;
END;
$$ LANGUAGE plpgsql;

-- ============================================================
-- FONCTION: Sync lignes documents Deal (vente + achat)
-- ============================================================

CREATE OR REPLACE FUNCTION mobile.sync_deal_document_lines()
RETURNS INTEGER AS $$
DECLARE
    v_synced_sale INTEGER := 0;
    v_synced_purchase INTEGER := 0;
    v_total INTEGER := 0;
BEGIN
    -- Supprimer les anciennes lignes
    DELETE FROM mobile.deal_document_lines;

    -- Lignes de vente (DealSaleDocumentLine)
    INSERT INTO mobile.deal_document_lines (
        ebp_document_id, source_type,
        line_number, line_type,
        item_id, item_name, item_reference, item_description,
        quantity, unit,
        unit_price_excl_tax, discount_percent,
        total_excl_tax, total_incl_tax, vat_rate,
        deal_id, construction_site_id,
        last_sync_at
    )
    SELECT
        dsdl."DocumentId"::VARCHAR(50),
        'sale',
        dsdl."LineOrder",
        CASE
            WHEN dsdl."ItemId" IS NULL THEN 1
            ELSE 0
        END,
        dsdl."ItemId",
        i."Caption",
        i."Id",
        dsdl."DescriptionClear",
        dsdl."Quantity",
        NULL, -- No Unit column in DealSaleDocumentLine
        dsdl."PurchasePrice",
        CASE
            WHEN dsdl."AmountVatExcluded" > 0 AND dsdl."NetAmountVatExcludedWithDiscount" IS NOT NULL
            THEN ROUND(((dsdl."AmountVatExcluded" - dsdl."NetAmountVatExcludedWithDiscount") / dsdl."AmountVatExcluded" * 100)::NUMERIC, 2)
            ELSE 0
        END as discount_percent,
        dsdl."NetAmountVatExcludedWithDiscount",
        dsdl."NetAmountVatIncludedWithDiscount",
        CASE
            WHEN dsdl."NetAmountVatExcludedWithDiscount" > 0
            THEN ROUND(((dsdl."NetAmountVatIncludedWithDiscount" - dsdl."NetAmountVatExcludedWithDiscount") / dsdl."NetAmountVatExcludedWithDiscount" * 100)::NUMERIC, 2)
            ELSE 0
        END as vat_rate,
        dsd."DealId",
        dsd."ConstructionSiteId",
        NOW()
    FROM public."DealSaleDocumentLine" dsdl
    INNER JOIN public."DealSaleDocument" dsd ON dsdl."DocumentId" = dsd."Id"
    INNER JOIN mobile.deal_documents mdd ON dsd."Id"::VARCHAR(50) = mdd.ebp_id
    LEFT JOIN public."Item" i ON dsdl."ItemId" = i."Id"
    WHERE mdd.source_type = 'sale'
    ORDER BY dsdl."DocumentId", dsdl."LineOrder";

    GET DIAGNOSTICS v_synced_sale = ROW_COUNT;

    -- Lignes d'achat (DealPurchaseDocumentLine)
    INSERT INTO mobile.deal_document_lines (
        ebp_document_id, source_type,
        line_number, line_type,
        item_id, item_name, item_reference, item_description,
        quantity, unit,
        unit_price_excl_tax, discount_percent,
        total_excl_tax, total_incl_tax, vat_rate,
        deal_id, construction_site_id,
        last_sync_at
    )
    SELECT
        dpdl."DocumentId"::VARCHAR(50),
        'purchase',
        dpdl."LineOrder",
        CASE
            WHEN dpdl."ItemId" IS NULL THEN 1
            ELSE 0
        END,
        dpdl."ItemId",
        i."Caption",
        i."Id",
        dpdl."DescriptionClear",
        dpdl."Quantity",
        NULL, -- No Unit column in DealPurchaseDocumentLine
        dpdl."PurchasePrice",
        CASE
            WHEN dpdl."AmountVatExcluded" > 0 AND dpdl."NetAmountVatExcludedWithDiscount" IS NOT NULL
            THEN ROUND(((dpdl."AmountVatExcluded" - dpdl."NetAmountVatExcludedWithDiscount") / dpdl."AmountVatExcluded" * 100)::NUMERIC, 2)
            ELSE 0
        END as discount_percent,
        dpdl."NetAmountVatExcludedWithDiscount",
        dpdl."NetAmountVatIncludedWithDiscount",
        CASE
            WHEN dpdl."NetAmountVatExcludedWithDiscount" > 0
            THEN ROUND(((dpdl."NetAmountVatIncludedWithDiscount" - dpdl."NetAmountVatExcludedWithDiscount") / dpdl."NetAmountVatExcludedWithDiscount" * 100)::NUMERIC, 2)
            ELSE 0
        END as vat_rate,
        dpd."DealId",
        dpd."ConstructionSiteId",
        NOW()
    FROM public."DealPurchaseDocumentLine" dpdl
    INNER JOIN public."DealPurchaseDocument" dpd ON dpdl."DocumentId" = dpd."Id"
    INNER JOIN mobile.deal_documents mdd ON dpd."Id"::VARCHAR(50) = mdd.ebp_id
    LEFT JOIN public."Item" i ON dpdl."ItemId" = i."Id"
    WHERE mdd.source_type = 'purchase'
    ORDER BY dpdl."DocumentId", dpdl."LineOrder";

    GET DIAGNOSTICS v_synced_purchase = ROW_COUNT;

    -- Mettre à jour les FK deal_document_id
    UPDATE mobile.deal_document_lines ddl
    SET deal_document_id = mdd.id
    FROM mobile.deal_documents mdd
    WHERE ddl.ebp_document_id = mdd.ebp_id;

    v_total := v_synced_sale + v_synced_purchase;

    RAISE NOTICE '✅ Sync deal document lines: % lignes vente + % lignes achat = % total',
                 v_synced_sale, v_synced_purchase, v_total;
    RETURN v_total;
END;
$$ LANGUAGE plpgsql;

-- ============================================================
-- FONCTION: Sync complet de tous les documents
-- ============================================================

CREATE OR REPLACE FUNCTION mobile.sync_all_documents(
    p_months_back INTEGER DEFAULT 24
)
RETURNS TABLE(
    document_type VARCHAR(50),
    count INTEGER
) AS $$
DECLARE
    v_count INTEGER;
BEGIN
    RAISE NOTICE '====================================';
    RAISE NOTICE 'Synchronisation complète des documents';
    RAISE NOTICE '====================================';

    -- 1. Factures
    SELECT mobile.sync_invoices(p_months_back) INTO v_count;
    RETURN QUERY SELECT 'Factures'::VARCHAR(50), v_count;

    -- 2. Bons de livraison
    SELECT mobile.sync_delivery_notes(p_months_back) INTO v_count;
    RETURN QUERY SELECT 'Bons de livraison'::VARCHAR(50), v_count;

    -- 3. Avoirs
    SELECT mobile.sync_credit_notes(p_months_back) INTO v_count;
    RETURN QUERY SELECT 'Avoirs'::VARCHAR(50), v_count;

    -- 4. Lignes documents vente
    SELECT mobile.sync_sale_document_lines() INTO v_count;
    RETURN QUERY SELECT 'Lignes vente'::VARCHAR(50), v_count;

    -- 5. Documents Deal (vente)
    SELECT mobile.sync_deal_sale_documents(p_months_back) INTO v_count;
    RETURN QUERY SELECT 'Docs vente affaires'::VARCHAR(50), v_count;

    -- 6. Documents Deal (achat)
    SELECT mobile.sync_deal_purchase_documents(p_months_back) INTO v_count;
    RETURN QUERY SELECT 'Docs achat affaires'::VARCHAR(50), v_count;

    -- 7. Lignes documents Deal
    SELECT mobile.sync_deal_document_lines() INTO v_count;
    RETURN QUERY SELECT 'Lignes docs affaires'::VARCHAR(50), v_count;

    RAISE NOTICE '====================================';
    RAISE NOTICE 'Synchronisation terminée';
    RAISE NOTICE '====================================';
END;
$$ LANGUAGE plpgsql;

-- ============================================================
-- FONCTION: Statistiques documents pour un client
-- ============================================================

CREATE OR REPLACE FUNCTION mobile.get_customer_documents_stats(
    p_customer_id VARCHAR(50)
)
RETURNS TABLE(
    document_type_label VARCHAR(50),
    document_count BIGINT,
    total_amount DECIMAL(15,2)
) AS $$
BEGIN
    RETURN QUERY
    SELECT
        sd.document_type_label,
        COUNT(*)::BIGINT,
        SUM(sd.amount_excl_tax)
    FROM mobile.sale_documents sd
    WHERE sd.customer_id = p_customer_id
      AND sd.is_active = true
    GROUP BY sd.document_type_label
    ORDER BY sd.document_type_label;
END;
$$ LANGUAGE plpgsql;

-- ============================================================
-- FONCTION: Documents récents pour l'app mobile
-- ============================================================

CREATE OR REPLACE FUNCTION mobile.get_recent_documents(
    p_document_types INTEGER[] DEFAULT NULL,
    p_limit INTEGER DEFAULT 50
)
RETURNS TABLE(
    id INTEGER,
    document_number VARCHAR(50),
    document_type_label VARCHAR(30),
    document_date DATE,
    customer_name VARCHAR(100),
    amount_excl_tax DECIMAL(15,2),
    document_state INTEGER
) AS $$
BEGIN
    RETURN QUERY
    SELECT
        sd.id,
        sd.document_number,
        sd.document_type_label,
        sd.document_date,
        sd.customer_name,
        sd.amount_excl_tax,
        sd.document_state
    FROM mobile.sale_documents sd
    WHERE (p_document_types IS NULL OR sd.document_type = ANY(p_document_types))
      AND sd.is_active = true
    ORDER BY sd.document_date DESC, sd.id DESC
    LIMIT p_limit;
END;
$$ LANGUAGE plpgsql;

-- ============================================================
-- Vérification finale
-- ============================================================

DO $$
BEGIN
    RAISE NOTICE '';
    RAISE NOTICE '✅ Migration 008 appliquée avec succès';
    RAISE NOTICE '📊 Tables créées:';
    RAISE NOTICE '   - mobile.sale_documents (factures, BL, avoirs)';
    RAISE NOTICE '   - mobile.sale_document_lines';
    RAISE NOTICE '   - mobile.deal_documents (vente + achat affaires)';
    RAISE NOTICE '   - mobile.deal_document_lines';
    RAISE NOTICE '';
    RAISE NOTICE '🔄 Fonctions de sync disponibles:';
    RAISE NOTICE '   - mobile.sync_invoices(months)';
    RAISE NOTICE '   - mobile.sync_delivery_notes(months)';
    RAISE NOTICE '   - mobile.sync_credit_notes(months)';
    RAISE NOTICE '   - mobile.sync_sale_document_lines()';
    RAISE NOTICE '   - mobile.sync_deal_sale_documents(months)';
    RAISE NOTICE '   - mobile.sync_deal_purchase_documents(months)';
    RAISE NOTICE '   - mobile.sync_deal_document_lines()';
    RAISE NOTICE '   - mobile.sync_all_documents(months) -- Sync complet';
    RAISE NOTICE '';
    RAISE NOTICE '📱 Prochaine étape: SELECT * FROM mobile.sync_all_documents(24);';
    RAISE NOTICE '';
END $$;

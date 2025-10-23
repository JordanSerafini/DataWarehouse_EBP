-- ============================================================
-- Migration 004: Tables métier mobile pour multi-profils
-- ============================================================
-- Description: Création des tables allégées pour l'app mobile
-- Profils supportés:
--   1. Patron/Bureau (dashboard, KPIs)
--   2. Commerciaux (clients, devis, affaires)
--   3. Chef de chantier (chantiers, équipe, stock)
--   4. Employé/Technicien (interventions, tickets)
-- ============================================================

-- ============================================================
-- 1. PROJETS / CHANTIERS (Chef de chantier + Patron)
-- ============================================================

CREATE TABLE IF NOT EXISTS mobile.projects (
    id SERIAL PRIMARY KEY,

    -- Identifiants EBP
    ebp_id VARCHAR(50) UNIQUE NOT NULL,
    ebp_unique_id VARCHAR(50),

    -- Informations de base
    name VARCHAR(200) NOT NULL,
    reference VARCHAR(50),
    project_type VARCHAR(50),
    state INTEGER DEFAULT 0,

    -- Client
    customer_id VARCHAR(50),
    customer_name VARCHAR(100),

    -- Dates
    start_date TIMESTAMP,
    end_date TIMESTAMP,
    completion_date TIMESTAMP,

    -- Localisation
    address_line1 VARCHAR(100),
    address_line2 VARCHAR(100),
    city VARCHAR(50),
    zipcode VARCHAR(10),
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),

    -- Chef de chantier
    site_manager_id VARCHAR(50),
    site_manager_name VARCHAR(100),

    -- Financier (pour patron)
    estimated_amount DECIMAL(15, 2),
    actual_amount DECIMAL(15, 2),
    margin_percent DECIMAL(5, 2),

    -- Description
    description TEXT,
    notes TEXT,

    -- Métadonnées
    is_active BOOLEAN DEFAULT true,
    last_sync_at TIMESTAMP DEFAULT NOW(),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_mobile_projects_customer ON mobile.projects(customer_id);
CREATE INDEX idx_mobile_projects_manager ON mobile.projects(site_manager_id);
CREATE INDEX idx_mobile_projects_state ON mobile.projects(state) WHERE is_active = true;
CREATE INDEX idx_mobile_projects_dates ON mobile.projects(start_date, end_date);
CREATE INDEX idx_mobile_projects_gps ON mobile.projects(latitude, longitude) WHERE latitude IS NOT NULL;

COMMENT ON TABLE mobile.projects IS 'Chantiers/Projets allégés pour app mobile - sync bidirectionnelle';

-- ============================================================
-- 2. DEVIS (Commerciaux + Patron)
-- ============================================================

CREATE TABLE IF NOT EXISTS mobile.quotes (
    id SERIAL PRIMARY KEY,

    -- Identifiants EBP
    ebp_id VARCHAR(50) UNIQUE NOT NULL,
    ebp_doc_number VARCHAR(50),

    -- Informations de base
    quote_number VARCHAR(50) NOT NULL,
    quote_date DATE,
    state INTEGER DEFAULT 0,
    document_state INTEGER,

    -- Client
    customer_id VARCHAR(50) NOT NULL,
    customer_name VARCHAR(100),
    customer_contact_name VARCHAR(100),
    customer_contact_phone VARCHAR(20),
    customer_contact_email VARCHAR(100),

    -- Commercial
    salesperson_id VARCHAR(50),
    salesperson_name VARCHAR(100),

    -- Montants
    total_excl_tax DECIMAL(15, 2),
    total_incl_tax DECIMAL(15, 2),
    tax_amount DECIMAL(15, 2),
    discount_percent DECIMAL(5, 2),
    discount_amount DECIMAL(15, 2),

    -- Dates
    validity_date DATE,
    follow_up_date DATE,

    -- Description
    subject VARCHAR(200),
    notes TEXT,
    internal_notes TEXT,

    -- Statut commercial
    won_probability INTEGER, -- 0-100%
    expected_closing_date DATE,
    loss_reason VARCHAR(200),

    -- Pièces jointes
    has_attachments BOOLEAN DEFAULT false,
    attachments_count INTEGER DEFAULT 0,

    -- Sync
    is_editable BOOLEAN DEFAULT true,
    last_sync_at TIMESTAMP DEFAULT NOW(),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_mobile_quotes_customer ON mobile.quotes(customer_id);
CREATE INDEX idx_mobile_quotes_salesperson ON mobile.quotes(salesperson_id);
CREATE INDEX idx_mobile_quotes_state ON mobile.quotes(state, document_state);
CREATE INDEX idx_mobile_quotes_date ON mobile.quotes(quote_date DESC);

COMMENT ON TABLE mobile.quotes IS 'Devis allégés pour commerciaux - création/consultation mobile';

-- ============================================================
-- 3. LIGNES DE DEVIS (détail produits)
-- ============================================================

CREATE TABLE IF NOT EXISTS mobile.quote_lines (
    id SERIAL PRIMARY KEY,

    -- Lien avec devis
    quote_id INTEGER REFERENCES mobile.quotes(id) ON DELETE CASCADE,
    ebp_quote_id VARCHAR(50) NOT NULL,

    -- Ligne
    line_number INTEGER,
    line_type INTEGER DEFAULT 0, -- 0=produit, 1=commentaire, 2=sous-total

    -- Produit
    item_id VARCHAR(50),
    item_name VARCHAR(200),
    item_reference VARCHAR(50),

    -- Quantités
    quantity DECIMAL(15, 3),
    unit VARCHAR(20),

    -- Prix
    unit_price_excl_tax DECIMAL(15, 4),
    discount_percent DECIMAL(5, 2),
    total_excl_tax DECIMAL(15, 2),

    -- Description
    description TEXT,

    created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_mobile_quote_lines_quote ON mobile.quote_lines(quote_id);
CREATE INDEX idx_mobile_quote_lines_item ON mobile.quote_lines(item_id);

COMMENT ON TABLE mobile.quote_lines IS 'Lignes de devis (produits/services)';

-- ============================================================
-- 4. AFFAIRES / OPPORTUNITÉS (Commerciaux + Patron)
-- ============================================================

CREATE TABLE IF NOT EXISTS mobile.sales (
    id SERIAL PRIMARY KEY,

    -- Identifiants
    ebp_id VARCHAR(50) UNIQUE NOT NULL,
    opportunity_number VARCHAR(50),

    -- Informations
    name VARCHAR(200) NOT NULL,
    sales_stage INTEGER DEFAULT 0,
    state INTEGER DEFAULT 0,

    -- Client
    customer_id VARCHAR(50) NOT NULL,
    customer_name VARCHAR(100),

    -- Commercial
    salesperson_id VARCHAR(50),
    salesperson_name VARCHAR(100),

    -- Montants
    estimated_amount DECIMAL(15, 2),
    weighted_amount DECIMAL(15, 2),
    probability INTEGER DEFAULT 50, -- 0-100%

    -- Dates
    creation_date DATE,
    expected_closing_date DATE,
    actual_closing_date DATE,
    last_contact_date DATE,

    -- Détails
    description TEXT,
    next_action VARCHAR(200),
    competitor VARCHAR(100),
    sales_cycle_duration INTEGER, -- jours

    -- Résultat
    is_won BOOLEAN,
    is_lost BOOLEAN,
    loss_reason VARCHAR(200),

    -- Sync
    last_sync_at TIMESTAMP DEFAULT NOW(),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_mobile_sales_customer ON mobile.sales(customer_id);
CREATE INDEX idx_mobile_sales_salesperson ON mobile.sales(salesperson_id);
CREATE INDEX idx_mobile_sales_stage ON mobile.sales(sales_stage, state);
CREATE INDEX idx_mobile_sales_date ON mobile.sales(expected_closing_date);

COMMENT ON TABLE mobile.sales IS 'Affaires/Opportunités commerciales';

-- ============================================================
-- 5. CONTACTS (Tous profils)
-- ============================================================

CREATE TABLE IF NOT EXISTS mobile.contacts (
    id SERIAL PRIMARY KEY,

    -- Identifiants EBP
    ebp_id VARCHAR(50) UNIQUE NOT NULL,

    -- Client associé
    customer_id VARCHAR(50),
    customer_name VARCHAR(100),

    -- Identité
    civility VARCHAR(25),
    last_name VARCHAR(60),
    first_name VARCHAR(60),
    full_name VARCHAR(120),

    -- Contact
    phone VARCHAR(20),
    mobile VARCHAR(20),
    email VARCHAR(100),

    -- Fonction
    job_title VARCHAR(50),
    department VARCHAR(50),

    -- Préférences
    is_main_contact BOOLEAN DEFAULT false,
    opt_in BOOLEAN DEFAULT true,
    preferred_contact_method VARCHAR(20), -- phone, email, sms

    -- Notes
    notes TEXT,

    -- Sync
    is_active BOOLEAN DEFAULT true,
    last_sync_at TIMESTAMP DEFAULT NOW(),
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_mobile_contacts_customer ON mobile.contacts(customer_id);
CREATE INDEX idx_mobile_contacts_email ON mobile.contacts(email);
CREATE INDEX idx_mobile_contacts_main ON mobile.contacts(customer_id, is_main_contact) WHERE is_main_contact = true;

COMMENT ON TABLE mobile.contacts IS 'Contacts clients allégés - tous profils';

-- ============================================================
-- 6. PRODUITS / CATALOGUE (Commerciaux + Techniciens)
-- ============================================================

CREATE TABLE IF NOT EXISTS mobile.products (
    id SERIAL PRIMARY KEY,

    -- Identifiants EBP
    ebp_id VARCHAR(50) UNIQUE NOT NULL,

    -- Informations
    name VARCHAR(200) NOT NULL,
    reference VARCHAR(50),
    item_type INTEGER DEFAULT 0,

    -- Classification
    family_id VARCHAR(50),
    family_name VARCHAR(100),
    subfamily_id VARCHAR(50),
    subfamily_name VARCHAR(100),

    -- Prix
    selling_price_excl_tax DECIMAL(15, 4),
    selling_price_incl_tax DECIMAL(15, 4),
    purchase_price DECIMAL(15, 4),

    -- Stock
    stock_level DECIMAL(15, 3),
    stock_unit VARCHAR(20),
    min_stock DECIMAL(15, 3),

    -- Description
    description TEXT,
    technical_specs TEXT,

    -- Photo
    image_url VARCHAR(500),
    thumbnail_url VARCHAR(500),

    -- Métadonnées
    is_active BOOLEAN DEFAULT true,
    is_frequently_used BOOLEAN DEFAULT false,
    usage_count INTEGER DEFAULT 0,
    last_used_at TIMESTAMP,

    -- Sync
    last_sync_at TIMESTAMP DEFAULT NOW(),
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_mobile_products_reference ON mobile.products(reference);
CREATE INDEX idx_mobile_products_family ON mobile.products(family_id);
CREATE INDEX idx_mobile_products_active ON mobile.products(is_active) WHERE is_active = true;
CREATE INDEX idx_mobile_products_frequent ON mobile.products(is_frequently_used, usage_count DESC) WHERE is_frequently_used = true;

COMMENT ON TABLE mobile.products IS 'Catalogue produits allégé - commerciaux et techniciens';

-- ============================================================
-- 7. DOCUMENTS / FICHIERS (Tous profils)
-- ============================================================

CREATE TABLE IF NOT EXISTS mobile.documents (
    id SERIAL PRIMARY KEY,

    -- Type de parent (polymorphe)
    parent_type VARCHAR(50) NOT NULL, -- customer, project, quote, intervention, incident
    parent_id VARCHAR(50) NOT NULL,

    -- Document
    file_name VARCHAR(255) NOT NULL,
    file_extension VARCHAR(10),
    file_size BIGINT,
    mime_type VARCHAR(100),

    -- Stockage
    file_path VARCHAR(500),
    file_url VARCHAR(500),
    thumbnail_url VARCHAR(500),

    -- Métadonnées
    document_type VARCHAR(50), -- photo, pdf, contract, invoice, quote, other
    title VARCHAR(200),
    description TEXT,

    -- Sync
    is_downloaded BOOLEAN DEFAULT false,
    download_priority INTEGER DEFAULT 0, -- 0=low, 1=medium, 2=high

    uploaded_at TIMESTAMP,
    uploaded_by VARCHAR(100),
    last_sync_at TIMESTAMP DEFAULT NOW(),
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_mobile_documents_parent ON mobile.documents(parent_type, parent_id);
CREATE INDEX idx_mobile_documents_type ON mobile.documents(document_type);
CREATE INDEX idx_mobile_documents_download ON mobile.documents(is_downloaded, download_priority);

COMMENT ON TABLE mobile.documents IS 'Métadonnées documents/fichiers - tous types';

-- ============================================================
-- 8. COLLÈGUES / ÉQUIPE (Chef de chantier + Patron)
-- ============================================================

CREATE TABLE IF NOT EXISTS mobile.colleagues (
    id SERIAL PRIMARY KEY,

    -- Identifiants EBP
    ebp_id VARCHAR(50) UNIQUE NOT NULL,

    -- Identité
    first_name VARCHAR(60),
    last_name VARCHAR(60),
    full_name VARCHAR(120),

    -- Contact
    phone VARCHAR(20),
    mobile VARCHAR(20),
    email VARCHAR(100),

    -- Fonction
    job_title VARCHAR(100),
    department VARCHAR(100),
    role_type VARCHAR(50), -- technician, salesperson, manager, admin

    -- Compétences (pour affectation chantiers)
    skills JSONB, -- ["plomberie", "électricité", etc.]
    certifications JSONB,

    -- Disponibilité
    is_available BOOLEAN DEFAULT true,
    current_location_lat DECIMAL(10, 8),
    current_location_lng DECIMAL(11, 8),
    last_location_update TIMESTAMP,

    -- Stats (pour patron)
    interventions_count INTEGER DEFAULT 0,
    avg_rating DECIMAL(3, 2),

    -- Métadonnées
    is_active BOOLEAN DEFAULT true,
    hire_date DATE,

    last_sync_at TIMESTAMP DEFAULT NOW(),
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_mobile_colleagues_role ON mobile.colleagues(role_type) WHERE is_active = true;
CREATE INDEX idx_mobile_colleagues_available ON mobile.colleagues(is_available) WHERE is_available = true;
CREATE INDEX idx_mobile_colleagues_location ON mobile.colleagues(current_location_lat, current_location_lng) WHERE is_available = true;

COMMENT ON TABLE mobile.colleagues IS 'Équipe/Collègues - affectation et localisation';

-- ============================================================
-- 9. TEMPS PASSÉS (Chef de chantier + Techniciens)
-- ============================================================

CREATE TABLE IF NOT EXISTS mobile.timesheets (
    id SERIAL PRIMARY KEY,
    temp_id UUID DEFAULT gen_random_uuid(), -- pour création offline

    -- Collègue
    colleague_id VARCHAR(50) NOT NULL,
    colleague_name VARCHAR(100),

    -- Affectation
    project_id INTEGER REFERENCES mobile.projects(id),
    intervention_id VARCHAR(50),

    -- Client (dénormalisé)
    customer_id VARCHAR(50),
    customer_name VARCHAR(100),

    -- Temps
    date DATE NOT NULL,
    start_time TIMESTAMP NOT NULL,
    end_time TIMESTAMP,
    duration_hours DECIMAL(5, 2),

    -- Type
    activity_type VARCHAR(50), -- work, travel, meeting, admin
    is_billable BOOLEAN DEFAULT true,

    -- Description
    task_description TEXT,
    notes TEXT,

    -- Validation
    is_validated BOOLEAN DEFAULT false,
    validated_by VARCHAR(50),
    validated_at TIMESTAMP,

    -- Sync
    synced_to_ebp BOOLEAN DEFAULT false,
    ebp_id VARCHAR(50),
    device_id VARCHAR(100),

    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_mobile_timesheets_colleague ON mobile.timesheets(colleague_id, date DESC);
CREATE INDEX idx_mobile_timesheets_project ON mobile.timesheets(project_id);
CREATE INDEX idx_mobile_timesheets_sync ON mobile.timesheets(synced_to_ebp) WHERE synced_to_ebp = false;
CREATE INDEX idx_mobile_timesheets_validation ON mobile.timesheets(is_validated) WHERE is_validated = false;

COMMENT ON TABLE mobile.timesheets IS 'Temps passés - saisie mobile par techniciens';

-- ============================================================
-- 10. NOTES DE FRAIS (Tous profils)
-- ============================================================

CREATE TABLE IF NOT EXISTS mobile.expenses (
    id SERIAL PRIMARY KEY,
    temp_id UUID DEFAULT gen_random_uuid(),

    -- Collègue
    colleague_id VARCHAR(50) NOT NULL,
    colleague_name VARCHAR(100),

    -- Affectation
    project_id INTEGER REFERENCES mobile.projects(id),
    intervention_id VARCHAR(50),
    customer_id VARCHAR(50),

    -- Dépense
    expense_date DATE NOT NULL,
    expense_type VARCHAR(50), -- fuel, meal, accommodation, parking, tolls, other
    category VARCHAR(50),

    -- Montant
    amount DECIMAL(10, 2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'EUR',
    tax_amount DECIMAL(10, 2),

    -- Justificatif
    receipt_photo_url VARCHAR(500),
    receipt_number VARCHAR(50),
    vendor_name VARCHAR(100),

    -- Description
    description TEXT,
    notes TEXT,

    -- Kilométrage (si applicable)
    distance_km DECIMAL(8, 2),
    start_location VARCHAR(200),
    end_location VARCHAR(200),

    -- Validation
    is_validated BOOLEAN DEFAULT false,
    validated_by VARCHAR(50),
    validated_at TIMESTAMP,
    rejection_reason TEXT,

    -- Sync
    synced_to_ebp BOOLEAN DEFAULT false,
    ebp_id VARCHAR(50),
    device_id VARCHAR(100),

    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_mobile_expenses_colleague ON mobile.expenses(colleague_id, expense_date DESC);
CREATE INDEX idx_mobile_expenses_project ON mobile.expenses(project_id);
CREATE INDEX idx_mobile_expenses_type ON mobile.expenses(expense_type);
CREATE INDEX idx_mobile_expenses_sync ON mobile.expenses(synced_to_ebp) WHERE synced_to_ebp = false;
CREATE INDEX idx_mobile_expenses_validation ON mobile.expenses(is_validated) WHERE is_validated = false;

COMMENT ON TABLE mobile.expenses IS 'Notes de frais - saisie mobile tous profils';

-- ============================================================
-- 11. MOUVEMENTS STOCK MOBILE (Techniciens)
-- ============================================================

CREATE TABLE IF NOT EXISTS mobile.stock_movements (
    id SERIAL PRIMARY KEY,
    temp_id UUID DEFAULT gen_random_uuid(),

    -- Produit
    product_id INTEGER REFERENCES mobile.products(id),
    product_reference VARCHAR(50),
    product_name VARCHAR(200),

    -- Mouvement
    movement_type VARCHAR(20) NOT NULL, -- in, out, transfer, adjustment
    quantity DECIMAL(15, 3) NOT NULL,
    unit VARCHAR(20),

    -- Origine/Destination
    from_location VARCHAR(100), -- warehouse, vehicle, site
    to_location VARCHAR(100),
    from_location_id VARCHAR(50),
    to_location_id VARCHAR(50),

    -- Affectation
    project_id INTEGER REFERENCES mobile.projects(id),
    intervention_id VARCHAR(50),
    colleague_id VARCHAR(50),

    -- Dates
    movement_date TIMESTAMP NOT NULL DEFAULT NOW(),

    -- Description
    reason VARCHAR(200),
    notes TEXT,

    -- Sync
    synced_to_ebp BOOLEAN DEFAULT false,
    ebp_id VARCHAR(50),
    device_id VARCHAR(100),

    created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_mobile_stock_movements_product ON mobile.stock_movements(product_id, movement_date DESC);
CREATE INDEX idx_mobile_stock_movements_project ON mobile.stock_movements(project_id);
CREATE INDEX idx_mobile_stock_movements_colleague ON mobile.stock_movements(colleague_id);
CREATE INDEX idx_mobile_stock_movements_sync ON mobile.stock_movements(synced_to_ebp) WHERE synced_to_ebp = false;

COMMENT ON TABLE mobile.stock_movements IS 'Mouvements stock mobile - techniciens terrain';

-- ============================================================
-- 12. TRIGGERS AUTO-UPDATE
-- ============================================================

-- Trigger pour updated_at
CREATE OR REPLACE FUNCTION mobile.update_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Appliquer aux tables avec updated_at
CREATE TRIGGER trigger_projects_updated
    BEFORE UPDATE ON mobile.projects
    FOR EACH ROW EXECUTE FUNCTION mobile.update_timestamp();

CREATE TRIGGER trigger_quotes_updated
    BEFORE UPDATE ON mobile.quotes
    FOR EACH ROW EXECUTE FUNCTION mobile.update_timestamp();

CREATE TRIGGER trigger_sales_updated
    BEFORE UPDATE ON mobile.sales
    FOR EACH ROW EXECUTE FUNCTION mobile.update_timestamp();

CREATE TRIGGER trigger_timesheets_updated
    BEFORE UPDATE ON mobile.timesheets
    FOR EACH ROW EXECUTE FUNCTION mobile.update_timestamp();

CREATE TRIGGER trigger_expenses_updated
    BEFORE UPDATE ON mobile.expenses
    FOR EACH ROW EXECUTE FUNCTION mobile.update_timestamp();

-- ============================================================
-- FIN MIGRATION 004
-- ============================================================

DO $$
BEGIN
    RAISE NOTICE '✅ Migration 004 terminée avec succès';
    RAISE NOTICE '📊 Tables créées:';
    RAISE NOTICE '   - mobile.projects (chantiers)';
    RAISE NOTICE '   - mobile.quotes + quote_lines (devis)';
    RAISE NOTICE '   - mobile.sales (affaires commerciales)';
    RAISE NOTICE '   - mobile.contacts (contacts clients)';
    RAISE NOTICE '   - mobile.products (catalogue)';
    RAISE NOTICE '   - mobile.documents (fichiers)';
    RAISE NOTICE '   - mobile.colleagues (équipe)';
    RAISE NOTICE '   - mobile.timesheets (temps passés)';
    RAISE NOTICE '   - mobile.expenses (notes de frais)';
    RAISE NOTICE '   - mobile.stock_movements (stock mobile)';
    RAISE NOTICE '';
    RAISE NOTICE '🎯 Support multi-profils:';
    RAISE NOTICE '   ✓ Patron/Bureau (dashboard KPIs)';
    RAISE NOTICE '   ✓ Commerciaux (clients, devis, affaires)';
    RAISE NOTICE '   ✓ Chef de chantier (chantiers, équipe, stock)';
    RAISE NOTICE '   ✓ Employé/Technicien (interventions, tickets)';
END $$;

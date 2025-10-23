-- ============================================================
-- NinjaOne Data Warehouse Schema
-- Separated from EBP data for better organization
-- ============================================================

-- Create a separate schema for NinjaOne data
CREATE SCHEMA IF NOT EXISTS ninjaone;

-- ============================================================
-- DIMENSION TABLES
-- ============================================================

-- Organizations (Clients)
CREATE TABLE IF NOT EXISTS ninjaone.dim_organizations (
    organization_id INTEGER PRIMARY KEY,
    organization_uid VARCHAR(255),
    organization_name VARCHAR(255) NOT NULL,
    node_approval_mode VARCHAR(50),

    -- Additional fields
    description TEXT,
    address TEXT,
    city VARCHAR(100),
    state VARCHAR(100),
    country VARCHAR(100),
    postal_code VARCHAR(20),
    phone VARCHAR(50),
    email VARCHAR(255),
    website VARCHAR(255),

    -- Tags and metadata
    tags JSONB,
    custom_fields JSONB,

    -- Audit fields
    created_at TIMESTAMP WITH TIME ZONE,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    is_active BOOLEAN DEFAULT TRUE,

    -- ETL metadata
    etl_loaded_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    etl_source VARCHAR(50) DEFAULT 'ninjaone_api'
);

CREATE INDEX idx_org_name ON ninjaone.dim_organizations(organization_name);
CREATE INDEX idx_org_active ON ninjaone.dim_organizations(is_active);

-- Locations
CREATE TABLE IF NOT EXISTS ninjaone.dim_locations (
    location_id INTEGER PRIMARY KEY,
    organization_id INTEGER REFERENCES ninjaone.dim_organizations(organization_id),
    location_name VARCHAR(255),

    address TEXT,
    city VARCHAR(100),
    state VARCHAR(100),
    country VARCHAR(100),
    postal_code VARCHAR(20),

    -- Audit fields
    created_at TIMESTAMP WITH TIME ZONE,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    is_active BOOLEAN DEFAULT TRUE,

    -- ETL metadata
    etl_loaded_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    etl_source VARCHAR(50) DEFAULT 'ninjaone_api'
);

CREATE INDEX idx_loc_org ON ninjaone.dim_locations(organization_id);

-- Technicians (Users/Employees)
CREATE TABLE IF NOT EXISTS ninjaone.dim_technicians (
    technician_id INTEGER PRIMARY KEY,
    technician_uid VARCHAR(255) UNIQUE,

    -- Personal information
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    full_name VARCHAR(255),
    email VARCHAR(255),
    phone VARCHAR(50),

    -- Employment details
    user_type VARCHAR(50), -- TECHNICIAN, ADMIN, etc.
    is_administrator BOOLEAN DEFAULT FALSE,
    is_enabled BOOLEAN DEFAULT TRUE,

    -- Permissions
    permit_all_clients BOOLEAN DEFAULT FALSE,
    notify_all_clients BOOLEAN DEFAULT FALSE,

    -- Security
    mfa_configured BOOLEAN DEFAULT FALSE,
    must_change_password BOOLEAN DEFAULT FALSE,
    invitation_status VARCHAR(50),

    -- Organization
    organization_id INTEGER REFERENCES ninjaone.dim_organizations(organization_id),

    -- Tags and metadata
    tags JSONB,
    custom_fields JSONB,

    -- Audit fields
    created_at TIMESTAMP WITH TIME ZONE,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    last_login_at TIMESTAMP WITH TIME ZONE,

    -- ETL metadata
    etl_loaded_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    etl_source VARCHAR(50) DEFAULT 'ninjaone_api'
);

CREATE INDEX idx_tech_email ON ninjaone.dim_technicians(email);
CREATE INDEX idx_tech_active ON ninjaone.dim_technicians(is_enabled);
CREATE INDEX idx_tech_type ON ninjaone.dim_technicians(user_type);

-- Devices
CREATE TABLE IF NOT EXISTS ninjaone.dim_devices (
    device_id INTEGER PRIMARY KEY,
    device_uid VARCHAR(255) UNIQUE,

    -- Organization and location
    organization_id INTEGER REFERENCES ninjaone.dim_organizations(organization_id),
    location_id INTEGER REFERENCES ninjaone.dim_locations(location_id),

    -- Device information
    system_name VARCHAR(255),
    dns_name VARCHAR(255),
    node_class VARCHAR(100), -- WINDOWS_SERVER, WINDOWS_WORKSTATION, etc.
    node_role_id INTEGER,
    role_policy_id INTEGER,

    -- Status
    approval_status VARCHAR(50),
    is_offline BOOLEAN DEFAULT FALSE,

    -- Dates
    created_at TIMESTAMP WITH TIME ZONE,
    last_contact_at TIMESTAMP WITH TIME ZONE,
    last_update_at TIMESTAMP WITH TIME ZONE,

    -- Tags and metadata
    tags JSONB,
    custom_fields JSONB,

    -- ETL metadata
    etl_loaded_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    etl_source VARCHAR(50) DEFAULT 'ninjaone_api'
);

CREATE INDEX idx_device_org ON ninjaone.dim_devices(organization_id);
CREATE INDEX idx_device_loc ON ninjaone.dim_devices(location_id);
CREATE INDEX idx_device_class ON ninjaone.dim_devices(node_class);
CREATE INDEX idx_device_offline ON ninjaone.dim_devices(is_offline);

-- Ticket Statuses
CREATE TABLE IF NOT EXISTS ninjaone.dim_ticket_statuses (
    status_id INTEGER PRIMARY KEY,
    status_name VARCHAR(100) NOT NULL,
    status_code VARCHAR(50),
    status_type VARCHAR(50), -- OPEN, IN_PROGRESS, CLOSED, etc.

    description TEXT,
    color VARCHAR(20),
    sort_order INTEGER,

    is_open BOOLEAN DEFAULT TRUE,
    is_closed BOOLEAN DEFAULT FALSE,
    is_resolved BOOLEAN DEFAULT FALSE,

    -- Audit fields
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,

    -- ETL metadata
    etl_loaded_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    etl_source VARCHAR(50) DEFAULT 'ninjaone_api'
);

CREATE INDEX idx_status_type ON ninjaone.dim_ticket_statuses(status_type);

-- Time Dimension (for date-based analysis)
CREATE TABLE IF NOT EXISTS ninjaone.dim_time (
    time_id INTEGER PRIMARY KEY,

    -- Date components
    date DATE NOT NULL UNIQUE,
    year INTEGER NOT NULL,
    quarter INTEGER NOT NULL,
    month INTEGER NOT NULL,
    week INTEGER NOT NULL,
    day INTEGER NOT NULL,
    day_of_week INTEGER NOT NULL,
    day_of_year INTEGER NOT NULL,

    -- Display names
    month_name VARCHAR(20),
    day_name VARCHAR(20),
    quarter_name VARCHAR(20),

    -- Flags
    is_weekend BOOLEAN DEFAULT FALSE,
    is_holiday BOOLEAN DEFAULT FALSE,
    holiday_name VARCHAR(100),

    -- Fiscal periods (if applicable)
    fiscal_year INTEGER,
    fiscal_quarter INTEGER,
    fiscal_month INTEGER
);

CREATE INDEX idx_time_date ON ninjaone.dim_time(date);
CREATE INDEX idx_time_year_month ON ninjaone.dim_time(year, month);

-- ============================================================
-- FACT TABLES
-- ============================================================

-- Tickets Fact Table
CREATE TABLE IF NOT EXISTS ninjaone.fact_tickets (
    ticket_id INTEGER PRIMARY KEY,
    ticket_uid VARCHAR(255) UNIQUE,
    ticket_number VARCHAR(100),
    external_id VARCHAR(255),

    -- Dimension foreign keys
    organization_id INTEGER REFERENCES ninjaone.dim_organizations(organization_id),
    location_id INTEGER REFERENCES ninjaone.dim_locations(location_id),
    assigned_technician_id INTEGER REFERENCES ninjaone.dim_technicians(technician_id),
    created_by_technician_id INTEGER REFERENCES ninjaone.dim_technicians(technician_id),
    device_id INTEGER REFERENCES ninjaone.dim_devices(device_id),
    status_id INTEGER REFERENCES ninjaone.dim_ticket_statuses(status_id),

    -- Time dimension keys
    created_date_id INTEGER REFERENCES ninjaone.dim_time(time_id),
    resolved_date_id INTEGER REFERENCES ninjaone.dim_time(time_id),
    closed_date_id INTEGER REFERENCES ninjaone.dim_time(time_id),
    due_date_id INTEGER REFERENCES ninjaone.dim_time(time_id),

    -- Ticket details
    title TEXT NOT NULL,
    description TEXT,
    category VARCHAR(100),
    subcategory VARCHAR(100),

    -- Status and priority
    status VARCHAR(50),
    priority VARCHAR(50),
    severity VARCHAR(50),
    ticket_type VARCHAR(100),

    -- Dates (full timestamps)
    created_at TIMESTAMP WITH TIME ZONE NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE,
    resolved_at TIMESTAMP WITH TIME ZONE,
    closed_at TIMESTAMP WITH TIME ZONE,
    due_date TIMESTAMP WITH TIME ZONE,

    -- Metrics (in seconds)
    time_spent_seconds INTEGER DEFAULT 0,
    estimated_time_seconds INTEGER,
    time_to_resolution_seconds INTEGER,
    time_to_first_response_seconds INTEGER,

    -- Calculated metrics (in hours for easier analysis)
    time_spent_hours NUMERIC(10, 2) GENERATED ALWAYS AS (time_spent_seconds::NUMERIC / 3600) STORED,
    estimated_time_hours NUMERIC(10, 2) GENERATED ALWAYS AS (estimated_time_seconds::NUMERIC / 3600) STORED,
    time_to_resolution_hours NUMERIC(10, 2) GENERATED ALWAYS AS (time_to_resolution_seconds::NUMERIC / 3600) STORED,
    time_to_first_response_hours NUMERIC(10, 2) GENERATED ALWAYS AS (time_to_first_response_seconds::NUMERIC / 3600) STORED,

    -- Flags
    is_overdue BOOLEAN DEFAULT FALSE,
    is_resolved BOOLEAN DEFAULT FALSE,
    is_closed BOOLEAN DEFAULT FALSE,
    has_attachments BOOLEAN DEFAULT FALSE,
    has_comments BOOLEAN DEFAULT FALSE,

    -- Counts
    comments_count INTEGER DEFAULT 0,
    attachments_count INTEGER DEFAULT 0,
    activity_count INTEGER DEFAULT 0,

    -- Tags and categorization (JSON for flexibility)
    tags JSONB,
    custom_fields JSONB,

    -- Source tracking
    source VARCHAR(100),
    channel VARCHAR(100),

    -- Requester information (denormalized for performance)
    requester_name VARCHAR(255),
    requester_email VARCHAR(255),
    requester_phone VARCHAR(50),

    -- ETL metadata
    etl_loaded_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    etl_source VARCHAR(50) DEFAULT 'ninjaone_api',
    etl_version VARCHAR(20)
);

-- Indexes for fact_tickets
CREATE INDEX idx_ticket_org ON ninjaone.fact_tickets(organization_id);
CREATE INDEX idx_ticket_tech ON ninjaone.fact_tickets(assigned_technician_id);
CREATE INDEX idx_ticket_device ON ninjaone.fact_tickets(device_id);
CREATE INDEX idx_ticket_status ON ninjaone.fact_tickets(status_id);
CREATE INDEX idx_ticket_created ON ninjaone.fact_tickets(created_at);
CREATE INDEX idx_ticket_created_date ON ninjaone.fact_tickets(created_date_id);
CREATE INDEX idx_ticket_priority ON ninjaone.fact_tickets(priority);
CREATE INDEX idx_ticket_severity ON ninjaone.fact_tickets(severity);
CREATE INDEX idx_ticket_is_overdue ON ninjaone.fact_tickets(is_overdue);
CREATE INDEX idx_ticket_is_closed ON ninjaone.fact_tickets(is_closed);
CREATE INDEX idx_ticket_tags ON ninjaone.fact_tickets USING GIN(tags);

-- ============================================================
-- SUPPORTING TABLES
-- ============================================================

-- Ticket Comments
CREATE TABLE IF NOT EXISTS ninjaone.ticket_comments (
    comment_id SERIAL PRIMARY KEY,
    ticket_id INTEGER REFERENCES ninjaone.fact_tickets(ticket_id) ON DELETE CASCADE,

    comment_body TEXT,
    author_technician_id INTEGER REFERENCES ninjaone.dim_technicians(technician_id),
    author_name VARCHAR(255),

    is_internal BOOLEAN DEFAULT FALSE,

    created_at TIMESTAMP WITH TIME ZONE NOT NULL,

    -- Attachments
    has_attachments BOOLEAN DEFAULT FALSE,
    attachments JSONB,

    -- ETL metadata
    etl_loaded_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_comment_ticket ON ninjaone.ticket_comments(ticket_id);
CREATE INDEX idx_comment_created ON ninjaone.ticket_comments(created_at);

-- Ticket Activity Log
CREATE TABLE IF NOT EXISTS ninjaone.ticket_activity (
    activity_id SERIAL PRIMARY KEY,
    ticket_id INTEGER REFERENCES ninjaone.fact_tickets(ticket_id) ON DELETE CASCADE,

    activity_type VARCHAR(50), -- status_change, assignment, comment, update
    activity_description TEXT,

    author_technician_id INTEGER REFERENCES ninjaone.dim_technicians(technician_id),
    author_name VARCHAR(255),

    old_value VARCHAR(255),
    new_value VARCHAR(255),

    time_tracked_seconds INTEGER DEFAULT 0,

    created_at TIMESTAMP WITH TIME ZONE NOT NULL,

    details JSONB,

    -- ETL metadata
    etl_loaded_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_activity_ticket ON ninjaone.ticket_activity(ticket_id);
CREATE INDEX idx_activity_type ON ninjaone.ticket_activity(activity_type);
CREATE INDEX idx_activity_created ON ninjaone.ticket_activity(created_at);

-- Ticket Attachments
CREATE TABLE IF NOT EXISTS ninjaone.ticket_attachments (
    attachment_id SERIAL PRIMARY KEY,
    ticket_id INTEGER REFERENCES ninjaone.fact_tickets(ticket_id) ON DELETE CASCADE,

    file_name VARCHAR(255),
    file_url TEXT,
    file_size INTEGER,
    mime_type VARCHAR(100),

    uploaded_by_technician_id INTEGER REFERENCES ninjaone.dim_technicians(technician_id),
    uploaded_at TIMESTAMP WITH TIME ZONE,

    -- ETL metadata
    etl_loaded_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_attachment_ticket ON ninjaone.ticket_attachments(ticket_id);

-- ============================================================
-- AGGREGATED/MATERIALIZED VIEWS (for performance)
-- ============================================================

-- Daily Ticket Summary
CREATE MATERIALIZED VIEW IF NOT EXISTS ninjaone.mv_daily_ticket_summary AS
SELECT
    d.date,
    d.year,
    d.month,
    d.day,
    o.organization_id,
    o.organization_name,

    -- Counts
    COUNT(*) as total_tickets,
    COUNT(CASE WHEN t.status IN ('OPEN', 'NEW') THEN 1 END) as open_tickets,
    COUNT(CASE WHEN t.status = 'IN_PROGRESS' THEN 1 END) as in_progress_tickets,
    COUNT(CASE WHEN t.status = 'RESOLVED' THEN 1 END) as resolved_tickets,
    COUNT(CASE WHEN t.status = 'CLOSED' THEN 1 END) as closed_tickets,

    -- Priority counts
    COUNT(CASE WHEN t.priority = 'LOW' THEN 1 END) as low_priority,
    COUNT(CASE WHEN t.priority = 'MEDIUM' THEN 1 END) as medium_priority,
    COUNT(CASE WHEN t.priority = 'HIGH' THEN 1 END) as high_priority,
    COUNT(CASE WHEN t.priority = 'URGENT' THEN 1 END) as urgent_priority,
    COUNT(CASE WHEN t.priority = 'CRITICAL' THEN 1 END) as critical_priority,

    -- Metrics
    AVG(t.time_to_resolution_hours) as avg_resolution_time_hours,
    AVG(t.time_spent_hours) as avg_time_spent_hours,
    COUNT(CASE WHEN t.is_overdue THEN 1 END) as overdue_tickets,

    CURRENT_TIMESTAMP as last_refreshed
FROM
    ninjaone.fact_tickets t
    JOIN ninjaone.dim_time d ON t.created_date_id = d.time_id
    JOIN ninjaone.dim_organizations o ON t.organization_id = o.organization_id
GROUP BY
    d.date, d.year, d.month, d.day, o.organization_id, o.organization_name;

CREATE INDEX idx_mv_daily_date ON ninjaone.mv_daily_ticket_summary(date);
CREATE INDEX idx_mv_daily_org ON ninjaone.mv_daily_ticket_summary(organization_id);

-- ============================================================
-- HELPER FUNCTIONS
-- ============================================================

-- Function to refresh materialized views
CREATE OR REPLACE FUNCTION ninjaone.refresh_materialized_views()
RETURNS void AS $$
BEGIN
    REFRESH MATERIALIZED VIEW CONCURRENTLY ninjaone.mv_daily_ticket_summary;
END;
$$ LANGUAGE plpgsql;

-- Function to populate time dimension
CREATE OR REPLACE FUNCTION ninjaone.populate_time_dimension(start_date DATE, end_date DATE)
RETURNS void AS $$
DECLARE
    current_date DATE;
BEGIN
    current_date := start_date;

    WHILE current_date <= end_date LOOP
        INSERT INTO ninjaone.dim_time (
            time_id, date, year, quarter, month, week, day, day_of_week, day_of_year,
            month_name, day_name, quarter_name, is_weekend
        ) VALUES (
            TO_CHAR(current_date, 'YYYYMMDD')::INTEGER,
            current_date,
            EXTRACT(YEAR FROM current_date),
            EXTRACT(QUARTER FROM current_date),
            EXTRACT(MONTH FROM current_date),
            EXTRACT(WEEK FROM current_date),
            EXTRACT(DAY FROM current_date),
            EXTRACT(DOW FROM current_date),
            EXTRACT(DOY FROM current_date),
            TO_CHAR(current_date, 'Month'),
            TO_CHAR(current_date, 'Day'),
            'Q' || EXTRACT(QUARTER FROM current_date),
            CASE WHEN EXTRACT(DOW FROM current_date) IN (0, 6) THEN TRUE ELSE FALSE END
        )
        ON CONFLICT (date) DO NOTHING;

        current_date := current_date + INTERVAL '1 day';
    END LOOP;
END;
$$ LANGUAGE plpgsql;

-- Populate time dimension for 5 years (2020-2025)
SELECT ninjaone.populate_time_dimension('2020-01-01'::DATE, '2025-12-31'::DATE);

-- ============================================================
-- COMMENTS FOR DOCUMENTATION
-- ============================================================

COMMENT ON SCHEMA ninjaone IS 'NinjaOne data warehouse schema - separated from EBP data';
COMMENT ON TABLE ninjaone.fact_tickets IS 'Main fact table for NinjaOne tickets with all metrics and dimensions';
COMMENT ON TABLE ninjaone.dim_organizations IS 'Dimension table for organizations/clients';
COMMENT ON TABLE ninjaone.dim_technicians IS 'Dimension table for technicians/users';
COMMENT ON TABLE ninjaone.dim_devices IS 'Dimension table for managed devices';
COMMENT ON TABLE ninjaone.dim_time IS 'Time dimension for date-based analysis';

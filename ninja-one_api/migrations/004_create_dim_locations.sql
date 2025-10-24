-- Migration: Create dim_locations table for organization locations
-- Date: 2025-10-24
-- Description: Locations (sites/bureaux) des organisations NinjaOne

-- Create dim_locations table
CREATE TABLE IF NOT EXISTS ninjaone.dim_locations (
    location_id INTEGER PRIMARY KEY,
    location_uid VARCHAR,
    organization_id INTEGER NOT NULL,
    location_name VARCHAR NOT NULL,
    description TEXT,
    address TEXT,
    city VARCHAR(100),
    state VARCHAR(100),
    country VARCHAR(100),
    postal_code VARCHAR(20),
    phone VARCHAR(50),
    tags JSONB,
    custom_fields JSONB,
    created_at TIMESTAMP WITH TIME ZONE,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    is_active BOOLEAN DEFAULT true,
    etl_loaded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    etl_source VARCHAR DEFAULT 'ninjaone_api'
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_locations_organization_id ON ninjaone.dim_locations(organization_id);
CREATE INDEX IF NOT EXISTS idx_locations_name ON ninjaone.dim_locations(location_name);
CREATE INDEX IF NOT EXISTS idx_locations_active ON ninjaone.dim_locations(is_active);
CREATE INDEX IF NOT EXISTS idx_locations_tags ON ninjaone.dim_locations USING GIN(tags);
CREATE INDEX IF NOT EXISTS idx_locations_custom_fields ON ninjaone.dim_locations USING GIN(custom_fields);

-- Add foreign key constraint to organizations
ALTER TABLE ninjaone.dim_locations
    ADD CONSTRAINT dim_locations_organization_id_fkey
    FOREIGN KEY (organization_id)
    REFERENCES ninjaone.dim_organizations(organization_id)
    ON DELETE CASCADE;

-- Add comment
COMMENT ON TABLE ninjaone.dim_locations IS 'Dimension table for NinjaOne organization locations (sites/offices)';

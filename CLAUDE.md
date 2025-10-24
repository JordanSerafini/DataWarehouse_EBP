# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**DataWarehouse_EBP** is a multi-component system for syncing, managing, and exposing data from EBP (a French ERP system running on MSSQL Server) to PostgreSQL for use in mobile field service apps and data warehousing.

### Language
All documentation and comments are in **French**. The project serves a French business using EBP software.

## High-Level Architecture

The repository contains 4 main components:

### 1. Database/ - Database Analysis & TypeScript Generation
- **Purpose**: Analyzes the EBP PostgreSQL database (319 tables, 670K rows) and generates TypeScript interfaces
- **Key outputs**:
  - TypeScript interfaces for all 319 EBP tables (`interface_EBP/`)
  - Comprehensive audit documentation (`AUDIT_*.md`)
  - Mobile schema migrations (in `migrations/`)
- **Note**: This creates a separate `mobile` schema that does NOT modify EBP tables

### 2. EbpToPg_Module/ - EBP Sync Desktop Application
- **Purpose**: Electron desktop app that syncs data from EBP (MSSQL Server) to local PostgreSQL
- **Key features**:
  - GUI for non-technical users
  - Full sync with automatic type mapping (MSSQL → PostgreSQL)
  - Verification and repair tools
  - Backup creation (pg_dump)
  - Backend server control
- **Tech**: Electron + Express + TypeScript

### 3. ninja-one_api/ - NinjaOne RMM Integration
- **Purpose**: NestJS API for integrating with NinjaOne (EU region) to fetch RMM data
- **Endpoints**: Organizations, technicians, devices, tickets, ticket boards
- **Auth**: OAuth 2.0 Client Credentials
- **Has its own migrations** for NinjaOne-specific tables

### 4. backend/ - Main Mobile API Backend
- **Purpose**: NestJS REST API for the mobile field service application
- **Key module**: `mobile` - handles authentication, sync, and mobile-specific endpoints
- **User roles**: Super Admin, Admin, Patron (Boss), Commerciaux (Sales), Chef de chantier (Site Manager), Techniciens (Technicians)
- **Auth**: JWT with Passport
- **Swagger docs**: Available at `/api/docs` when running

### 5. migrate.sh - Root Migration Manager
- **Purpose**: Manages database migrations with tracking
- **Features**: Migration history tracking, rollback support, checksums, execution time logging
- **Migrations path**: `Database/migrations/`
- **History table**: `mobile.migration_history`

## Database Architecture

### Source Database
- **EBP Database**: MSSQL Server (connection: `SRVEBP-2022\SRVEBP`)
- **Synced to**: PostgreSQL (`ebp_db`)
- **Tables**: 319 tables in `public` schema
- **Important discovery**: EBP already has GPS columns (`Address_Latitude`, `Address_Longitude`)

### Mobile Schema Strategy
- **Separate schema**: `mobile` (never modifies EBP `public` tables)
- **Purpose**: Mobile-optimized views, tables, and functions for field service app
- **Key tables**: Reduced from 670K to ~50K rows (92% reduction) for mobile sync
- **Non-invasive**: EBP continues to function normally

### Data Warehouse Vision
The project is designed with a Bronze/Silver/Gold architecture (planned):
- **Bronze**: 50 priority tables (raw data)
- **Silver**: 15 dimensions + 6 facts (cleaned/normalized)
- **Gold**: 25 KPI tables + 5 ML models (analytics)

## Common Commands

### Database Migrations
```bash
# Run all pending migrations (recommended)
./migrate.sh

# Check migration status
./migrate.sh --check

# Rollback last N migrations
./migrate.sh --rollback N

# Force re-apply all migrations
./migrate.sh --force

# Set environment variables if needed
DB_HOST=localhost DB_PORT=5432 DB_NAME=ebp_db DB_USER=postgres DB_PASSWORD=postgres ./migrate.sh
```

### Database/ - Analysis & Interface Generation
```bash
cd Database
npm install

# Generate TypeScript interfaces for all 319 tables
npm run generate

# Analyze database structure
npm run analyze
```

### EbpToPg_Module/ - EBP Sync Application
```bash
cd EbpToPg_Module
npm install

# Build TypeScript
npm run build

# Launch Electron GUI
npm run electron

# Development mode (with auto-reload)
npm run electron:dev

# Build Windows executable
npm run electron:build:win
```

### ninja-one_api/ - NinjaOne Integration
```bash
cd ninja-one_api
npm install

# Development mode
npm run start:dev

# Production mode
npm run start:prod

# Build
npm run build

# API will be available at http://localhost:3000
# Key endpoints: /ninja-one/organizations, /ninja-one/technicians, /ninja-one/devices, /ninja-one/tickets
```

### backend/ - Main Mobile API
```bash
cd backend
npm install

# Development mode (with watch)
npm run start:dev

# Production mode
npm run start:prod

# Build
npm run build

# Testing
npm run test
npm run test:watch
npm run test:cov
npm run test:e2e

# Linting
npm run lint

# Formatting
npm run format

# API docs: http://localhost:3000/api/docs
```

## Environment Variables

Each module has its own `.env` file:

### Database/.env
```env
PG_HOST=localhost
PG_PORT=5432
PG_USER=postgres
PG_PASSWORD=postgres
PG_DATABASE=ebp_db
```

### EbpToPg_Module/.env
```env
# PostgreSQL (local target)
PG_USER=postgres
PG_PASSWORD=postgres
PG_DATABASE=ebp_db
PG_PORT=5432

# EBP MSSQL (source)
CLIENT_EBP_SERVER=SRVEBP-2022\SRVEBP
CLIENT_EBP_DATABASE=Solution Logique_0895452f-b7c1-4c00-a316-c6a6d0ea4bf4
EBP_USER=sa
EBP_PASSWORD=

# Application
PORT=3000
```

### ninja-one_api/.env
```env
CLIENT_ID=<NinjaOne OAuth Client ID>
CLIENT_SECRET=<NinjaOne OAuth Client Secret>
NINJA_ONE_BASE_URL=https://eu.ninjarmm.com
```

### backend/.env
```env
PORT=3000
CORS_ORIGIN=*
# Database connection details
# JWT secrets, etc.
```

## Key Architectural Patterns

### Mobile Module Structure (backend/src/mobile/)
The mobile module follows NestJS best practices:
- **Controllers**: Handle HTTP requests (`controllers/`)
- **Services**: Business logic (`services/`)
  - `auth.service.ts`: JWT authentication
  - `database.service.ts`: Database operations
- **DTOs**: Data transfer objects with validation (`dto/`)
- **Guards**: Route protection (`guards/`)
  - `jwt-auth.guard.ts`: JWT validation
  - `roles.guard.ts`: Role-based access control
- **Strategies**: Passport strategies (`strategies/`)
- **Decorators**: Custom decorators (`decorators/`)
- **Enums**: Type definitions (`enums/`)

### Authentication Flow
1. User logs in via `/auth/login` with credentials
2. Backend validates against EBP database
3. Returns JWT token with user role
4. Protected routes use `@UseGuards(JwtAuthGuard)` and `@Roles()` decorator
5. Swagger docs use Bearer auth

### Type Mapping (MSSQL → PostgreSQL)
The EbpToPg_Module automatically maps types:
- `bit` → `BOOLEAN`
- `int` → `INTEGER`
- `bigint` → `BIGINT`
- `varchar(n)` / `nvarchar(n)` → `VARCHAR(n)`
- `decimal(p,s)` → `NUMERIC(p,s)`
- `datetime` → `TIMESTAMP`
- `uniqueidentifier` → `UUID`
- `varbinary` → `BYTEA`

Column names preserve exact casing (e.g., `customer.Id`, `caption`).

## Important Files to Read

### Before Making Changes
1. **Database/GUIDE_DEMARRAGE.md** - Quick start guide (French)
2. **Database/migrations/MIGRATIONS_SUMMARY.md** - Migration summary with safety guarantees
3. **Database/RECOMMANDATIONS_FINALES.md** - 12-month project roadmap with budget/ROI
4. **EbpToPg_Module/README.md** - Sync application documentation
5. **ninja-one_api/README_API.md** - NinjaOne API documentation

### Architecture Documentation
- **Database/AUDIT_DATABASE.md** - Complete database audit (319 tables analysis)
- **Database/Audits&Notes/AUDIT_APP_MOBILE_TERRAIN.md** - Mobile app specifications
- **Database/Audits&Notes/AUDIT_DATA_WAREHOUSE_ARCHITECTURE.md** - Data warehouse design

## Migration Safety

### Critical Rules
1. **NEVER modify EBP `public` schema tables** - All mobile features use separate `mobile` schema
2. **Always backup before migrations**: `./migrate.sh` prompts for backup
3. **Test on DEV first** if available
4. **Migrations are tracked** in `mobile.migration_history` with checksums
5. **Rollback scripts exist** for all migrations (`rollback_*.sql`)

### Migration Execution
The `./migrate.sh` script:
- Checks database connection
- Creates migration history table if needed
- Applies pending migrations in order
- Records execution time and checksum
- Stops on first failure
- Provides detailed logs

## Development Workflow

### When Adding New Mobile Features
1. Check if data exists in EBP tables using `Database/interface_EBP/` interfaces
2. Create views in `mobile` schema if needed (don't modify `public` tables)
3. Add endpoints to `backend/src/mobile/controllers/`
4. Add business logic to `backend/src/mobile/services/`
5. Document in Swagger using decorators
6. Test with `npm run test`

### When Syncing New Tables
1. Update `EbpToPg_Module` configuration if needed
2. Run full sync via Electron GUI or API
3. Verify sync using built-in verification tool
4. Generate new TypeScript interfaces: `cd Database && npm run generate`

### When Integrating NinjaOne Data
1. Work in `ninja-one_api/` module
2. Use existing `ninja-one.service.ts` for API calls
3. Token is auto-cached and refreshed
4. Create migrations in `ninja-one_api/migrations/` for NinjaOne-specific tables

## Testing

### Backend Tests
```bash
cd backend

# Run all unit tests
npm run test

# Run specific test file
npm run test -- auth.service.spec.ts

# Watch mode
npm run test:watch

# Coverage report
npm run test:cov

# E2E tests
npm run test:e2e

# Debug tests
npm run test:debug
```

## Swagger Documentation

The backend exposes comprehensive API documentation:
- **URL**: `http://localhost:3000/api/docs`
- **Authentication**: Bearer token
- **Tags**: Authentication, Sync, Interventions, Sales, Projects, Dashboard, Admin

## PostgreSQL Direct Access

```bash
# Connect to database
psql -h localhost -U postgres -d ebp_db

# Useful queries
\dn                          # List schemas (should see: public, mobile)
\dt mobile.*                 # List mobile schema tables
\dv mobile.*                 # List mobile schema views
\dt public.*                 # List EBP tables
```

## Project Status & Roadmap

### Current Status (Phase 0)
- ✅ Database audit complete
- ✅ TypeScript interfaces generated
- ✅ Mobile schema migrations created
- ✅ EBP sync application functional
- ✅ NinjaOne integration functional
- ✅ Backend API with authentication functional

### Next Steps
1. Execute mobile schema migrations
2. Develop mobile app (React Native planned)
3. Implement offline sync (WatermelonDB planned)
4. Build data warehouse Bronze/Silver/Gold layers
5. Deploy ML models

**Total Project Timeline**: 12 months
**Budget**: 231k€
**Expected ROI**: 200k€/year
**Break-even**: 14 months

## Notes for AI Assistants

- The project is in **French** - maintain French in documentation and user-facing text
- **EBP tables are read-only** from the perspective of this project
- The `mobile` schema is the safe space for modifications
- When working with migrations, always emphasize safety and rollback capability
- User roles determine access levels in the mobile API
- Column names in EBP preserve original casing (mixed case) - respect this
- The project has extensive documentation - read relevant docs before making changes

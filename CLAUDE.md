# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**DataWarehouse_EBP** is a multi-component system for syncing, managing, and exposing data from EBP (a French ERP system running on MSSQL Server) to PostgreSQL for use in mobile field service apps and data warehousing.

### Language
All documentation and comments are in **French**. The project serves a French business using EBP software.

## High-Level Architecture

The repository contains 6 main components:

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

### 6. mobile/ - React Native Mobile Field Service App
- **Purpose**: Expo React Native mobile application for field technicians
- **Key features**:
  - Offline-first architecture with WatermelonDB
  - Biometric authentication (Face ID/Touch ID)
  - Complete intervention workflow (PENDING → IN_PROGRESS → COMPLETED)
  - Photo uploads with GPS tagging
  - Client signature capture
  - TimeSheet with stopwatch
  - GPS map view of interventions
  - Advanced customer search with 360° view
  - Material Design 3 UI
- **Tech**: Expo SDK 54 + React Native 0.81 + TypeScript + Zustand
- **Status**: Phases 1-4 complete, production-ready

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

# API runs on PORT 3001 (configured in .env to avoid conflicts with backend)
# API documentation: ninja-one_api/API_TICKETS.md
```

#### NinjaOne API - Vue d'ensemble complète

L'API NinjaOne expose des **APIs REST complètes** pour interroger et gérer les données RMM (organisations, techniciens, appareils, tickets).

**Documentation disponible:**
- **[API_ORGANIZATIONS.md](ninja-one_api/API_ORGANIZATIONS.md)** - API complète Organisations (clients RMM)
- **[API_TICKETS.md](ninja-one_api/API_TICKETS.md)** - API complète Tickets (filtres avancés, stats, cas d'usage)

**Architecture:**
- **NinjaOneService**: Service principal d'authentification OAuth et appels API
- **DatabaseSyncService**: Service de synchronisation vers PostgreSQL (schema `ninjaone`)
- **TicketQueryService**: Service de requêtes tickets avec filtres complexes et statistiques
- **3 Contrôleurs REST**:
  - `NinjaOneController`: Endpoints de base (`/ninja-one/*`)
  - `TicketsController`: Endpoints tickets généraux (`/api/tickets`)
  - `OrganizationTicketsController`: Par organisation (`/api/organizations/:id/tickets`)
  - `TechnicianTicketsController`: Par technicien (`/api/technicians/:id/tickets`)

#### NinjaOne Organizations API

**Endpoints implémentés:**
- `GET /ninja-one/organizations` - Liste toutes les organisations (114 actuellement)
- `POST /ninja-one/sync/organizations` - Synchronise les organisations vers PostgreSQL
- `POST /ninja-one/sync/all` - Synchronisation complète (orgs + techs + devices + tickets)

**Structure de données:** Table `ninjaone.dim_organizations` avec 114 organisations
- Informations complètes: nom, adresse, contact, tags, champs personnalisés
- Relations avec tickets, appareils, techniciens
- Support JSONB pour tags et custom fields

**Endpoints API NinjaOne disponibles (à implémenter):**
- `GET /v2/organization/{id}` - Détails d'une organisation
- `GET /v2/organization/{id}/locations` - Emplacements/sites multiples
- `GET /v2/organization/{id}/documents` - Documents attachés (contrats, SLA)
- `GET /v2/organization/documents/{id}/attributes` - Attributs de documents

**Documentation complète**: Voir [ninja-one_api/API_ORGANIZATIONS.md](ninja-one_api/API_ORGANIZATIONS.md)

#### NinjaOne Tickets API

**Endpoints principaux:**
```bash
# Liste de tickets avec filtres avancés
GET /api/tickets?page=1&limit=50&organizationId=123&priority=HIGH

# Détail d'un ticket avec relations
GET /api/tickets/:id

# Statistiques globales (peut être filtrées)
GET /api/tickets/stats?organizationId=123

# Stats par organisation
GET /api/tickets/stats/by-organization

# Stats par technicien
GET /api/tickets/stats/by-technician

# Stats par période (jour/semaine/mois)
GET /api/tickets/stats/by-period?groupBy=day

# Tickets d'une organisation
GET /api/organizations/:id/tickets?isClosed=false

# Tickets d'un technicien
GET /api/technicians/:id/tickets?isClosed=false
```

**Filtres disponibles:**
- **Par ID**: organizationId, assignedTechnicianId, createdByTechnicianId, deviceId, locationId, statusId
- **Par texte**: statusName, priority (NONE/LOW/MEDIUM/HIGH), severity, source, category, search (full-text)
- **Par dates**: createdAfter/Before, updatedAfter/Before, resolvedAfter/Before, closedAfter/Before, dueAfter/Before
- **Booléens**: isOverdue, isResolved, isClosed, hasComments, hasAttachments, **unassigned** (important!)
- **Spéciaux**: tag (recherche JSONB), search (titre + description)
- **Tri**: createdAt, updatedAt, priority, title, timeSpentSeconds, etc. (ASC/DESC)
- **Options**: includeOrganization, includeTechnicians, includeDevice

**Cas d'usage métier:**
1. **Dashboard Manager**: Vue organisation avec statistiques
2. **Vue Technicien**: Ses tickets + pool non assignés
3. **Admin globale**: Multi-organisation, identification tickets non assignés
4. **Reporting**: KPIs, tendances, charge par technicien
5. **Recherche avancée**: Combinaisons complexes de filtres

**État actuel (965 tickets):**
- 498 ouverts (51.6%), 467 fermés (48.4%)
- **⚠️ 760 tickets non assignés (78.8%)** - Point critique!
- 114 organisations, 11 techniciens
- Distribution: 48% Fermés, 37% Nouveaux, 6% Ouverts
- Priorités: 66% NONE, 22% HIGH, 12% MEDIUM

**Exemples d'utilisation:**
```bash
# Stats globales
curl http://localhost:3001/api/tickets/stats

# Tickets non assignés (IMPORTANT pour le pool)
curl http://localhost:3001/api/tickets?unassigned=true&isClosed=false

# Tickets urgents non assignés créés cette semaine
curl "http://localhost:3001/api/tickets?unassigned=true&priority=HIGH&createdAfter=2024-10-21&isClosed=false"

# Recherche par mot-clé dans une organisation
curl "http://localhost:3001/api/tickets?organizationId=123&search=wifi"

# Tendances par mois pour une organisation
curl "http://localhost:3001/api/tickets/stats/by-period?groupBy=month&organizationId=123"
```

**Documentation complète**: Voir `ninja-one_api/API_TICKETS.md` pour tous les détails, exemples et cas d'usage.

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

### mobile/ - React Native Mobile App
```bash
cd mobile
npm install

# Development mode (Expo Go)
npm start

# Android development
npm run android

# iOS development (requires macOS)
npm run ios

# Run on web (for quick testing)
npm run web

# Linting
npm run lint
npm run lint:fix

# Build for Android (requires EAS account)
eas build --platform android --profile preview

# Build for iOS (requires EAS account)
eas build --platform ios --profile preview
```

**Configuration**: Edit `src/config/api.config.ts` to set backend URL

**Development**: Use Expo Go app for rapid testing (WatermelonDB disabled in Expo Go)

**Production Build**: Requires development build or EAS for WatermelonDB support

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
PORT=3001  # Uses port 3001 to avoid conflict with backend on 3000

# Database (same as backend, uses ninjaone schema)
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=postgres
DB_NAME=ebp_db
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
  - `auth.controller.ts`: Authentication endpoints
  - `sync.controller.ts`: Mobile synchronization endpoints
  - `interventions.controller.ts`: Field service interventions
  - `customers.controller.ts`: Customer management
- **Services**: Business logic (`services/`)
  - `auth.service.ts`: JWT authentication
  - `database.service.ts`: Database operations
  - `sync.service.ts`: Mobile data synchronization (670K → 50K rows)
  - `interventions.service.ts`: Intervention management
  - `customers.service.ts`: Customer data access
  - `file.service.ts`: File and attachment handling
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

### Mobile Synchronization Architecture (backend/src/mobile/)

The mobile sync system reduces EBP's 670K rows to ~50K optimized rows (92% reduction) for mobile devices:

**Key Sync Endpoints** (`/api/v1/sync`):
- `POST /sync/initial` - First-time sync when mobile app is installed (all roles)
- `POST /sync/full` - Force complete refresh (admin only)
- `GET /sync/status` - Check sync state and progress
- `GET /sync/stats` - Per-table statistics
- `POST /sync/pending` - Get entities awaiting sync for a device
- `POST /sync/mark-synced` - Mark entity as successfully synced
- `POST /sync/mark-failed` - Record sync failure for retry

**How it works**:
1. Sync endpoints call PL/pgSQL functions in `mobile` schema
2. Functions like `initial_sync_all()` and `full_sync_all()` populate mobile tables
3. Device-level tracking with `mobile.sync_status` table
4. Supports bidirectional sync (up/down)
5. Automatic retry logic for failed syncs

**DTOs** in `dto/sync/`:
- `sync-request.dto.ts`: Request validation (MarkEntitySyncedDto, GetPendingSyncDto, etc.)
- `sync-response.dto.ts`: Response types (SyncResultDto, SyncStatsDto, SyncStatusDto, etc.)

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

### Mobile App Architecture (mobile/src/)

The mobile app follows an API-first, offline-ready architecture:

**Directory Structure:**
- **components/**: Reusable UI components
  - `PhotoPicker.tsx`: Camera/gallery with GPS tagging
  - `PhotoGallery.tsx`: Photo viewer with full-screen modal
  - `SignaturePad.tsx`: Canvas-based signature capture
  - `TimeSheet.tsx`: Stopwatch + manual time entry
  - `InterventionsMap.tsx`: GPS map with intervention markers
  - `BiometricPrompt.tsx`: Biometric authentication modal
- **screens/**: Main application screens
  - `Auth/LoginScreen.tsx`: Login with biometric option
  - `Planning/PlanningScreen.tsx`: Day/week/month views
  - `Tasks/TasksScreen.tsx`: Daily task dashboard
  - `Interventions/InterventionsScreen.tsx`: List + map toggle
  - `Interventions/InterventionDetailsScreen.v2.tsx`: Full workflow
  - `Customers/CustomersScreen.tsx`: Search with filters
  - `Customers/CustomerDetailsScreen.tsx`: 360° client view
  - `Profile/ProfileScreen.tsx`: User profile + settings
- **services/**: API communication layer
  - `api.service.ts`: Axios wrapper with auth
  - `intervention.service.ts`: Intervention endpoints (17 methods)
  - `customer.service.ts`: Customer endpoints (6 methods)
  - `biometric.service.ts`: Face ID/Touch ID integration
  - `secure-storage.service.ts`: Encrypted credential storage
- **stores/**: Zustand state management
  - `authStore.v2.ts`: Authentication + biometric + persistence
  - `syncStore.ts`: Sync status tracking
- **models/**: WatermelonDB models (for offline mode)
  - `schema.ts`, `Intervention.ts`, `Customer.ts`, `Project.ts`
- **types/**: TypeScript definitions
- **utils/**: Logger, toast notifications, permissions RBAC

**State Management:**
- **Zustand v5** with persist middleware (30% less code than Redux)
- **Immer** for immutable state updates
- Secure storage for credentials (Keychain/EncryptedSharedPreferences)

**Offline Strategy:**
- **WatermelonDB** (SQLite) for local data (requires development build)
- **API-first** in Expo Go (direct backend calls, no offline storage)
- Pull/Push synchronization with conflict resolution
- Device-level sync tracking

## Important Files to Read

### Before Making Changes
1. **Database/GUIDE_DEMARRAGE.md** - Quick start guide (French)
2. **Database/migrations/MIGRATIONS_SUMMARY.md** - Migration summary with safety guarantees
3. **Database/RECOMMANDATIONS_FINALES.md** - 12-month project roadmap with budget/ROI
4. **EbpToPg_Module/README.md** - Sync application documentation
5. **ninja-one_api/README_API.md** - NinjaOne API documentation
6. **ninja-one_api/API_TICKETS.md** - **API complète Tickets NinjaOne** (filtres avancés, stats, cas d'usage)

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

### When Working with NinjaOne Tickets API

1. **Read** `ninja-one_api/API_TICKETS.md` for complete endpoint documentation
2. **Use** `TicketQueryService` for all ticket queries (optimized with batch loading)
3. **Important business logic**:
   - 78.8% of tickets are unassigned → Use `?unassigned=true` filter
   - Organization-based views → Use `/api/organizations/:id/tickets`
   - Technician workload → Use `/api/technicians/:id/tickets`
   - Statistics → Use `/api/tickets/stats` endpoints
4. **Common patterns**:

   ```typescript
   // Get unassigned tickets for a pool
   GET /api/tickets?unassigned=true&isClosed=false&sortBy=priority&sortOrder=DESC

   // Get organization dashboard
   GET /api/organizations/123/tickets/stats
   GET /api/tickets/stats/by-period?groupBy=month&organizationId=123

   // Get technician workload
   GET /api/technicians/5/tickets?isClosed=false
   GET /api/tickets/stats/by-technician
   ```

5. **Database schema**: All NinjaOne data is in `ninjaone` schema (separate from `public` and `mobile`)
6. **Key tables**: `fact_tickets`, `dim_organizations`, `dim_technicians`, `dim_devices`, `dim_time`

### When Developing Mobile Features

1. **Start backend first**: `cd backend && npm run start:dev`
2. **Check API docs**: http://localhost:3000/api/docs
3. **Add service methods** in `mobile/src/services/` (use axios)
4. **Create/update screens** in `mobile/src/screens/`
5. **Use Zustand stores** for global state (auth, sync)
6. **Test in Expo Go** for rapid development
7. **Build dev build** when testing WatermelonDB or native modules
8. **Follow Material Design 3** for consistent UI
9. **Handle loading/error states** in all screens
10. **Add pull-to-refresh** for data fetching

**Important Notes:**
- WatermelonDB only works in development builds, not Expo Go
- Use `__DEV__` flag to detect development mode
- GPS features require physical device or simulator location
- Biometric features require physical device (iOS Simulator supports Face ID)
- Always check `mobile/notes/` for latest development documentation

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

## Mobile Backend API Endpoints

The backend exposes comprehensive REST APIs for the mobile field service application:

### Core APIs (`backend/src/mobile/`)

**Authentication** (`/auth`):
- `POST /auth/login` - User login (returns JWT token)
- `POST /auth/register` - User registration
- `GET /auth/profile` - Get current user profile

**Synchronization** (`/api/v1/sync`) - See "Mobile Synchronization Architecture" section above

**Customers** (`/api/v1/customers`):
- `GET /customers` - List all customers with pagination
- `GET /customers/:id` - Get customer details
- `GET /customers/search?query=...` - Search customers by name
- All endpoints support role-based access control

**Interventions** (`/api/v1/interventions`):
- `GET /interventions` - List interventions with filters (role-based)
- `GET /interventions/:id` - Get intervention details
- `POST /interventions/:id/files` - Upload files/photos
- `GET /interventions/:id/files` - List intervention files
- `GET /interventions/:id/files/:fileId` - Download specific file
- `DELETE /interventions/:id/files/:fileId` - Delete file

**File Management**:
- Handled by `FileService` with storage in `mobile.intervention_files` table
- Supports multipart uploads with file metadata
- File types tracked: photos, documents, signatures, etc.
- Role-based access: technicians can only see their own interventions

## Swagger Documentation

The backend exposes comprehensive API documentation:
- **URL**: `http://localhost:3000/api/docs`
- **Authentication**: Bearer token (click "Authorize" button)
- **Tags**: Authentication, Synchronisation, Clients, Interventions
- **Try it out**: Interactive testing available for all endpoints

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

## Database Migrations Status

### Completed Migrations (Database/migrations/)

The following migrations have been created and are ready for deployment:

1. **001_create_mobile_schema.sql** - Creates `mobile` schema (non-invasive)
2. **002_populate_gps_coordinates.sql** - Populates GPS data from existing EBP columns
3. **003_mobile_sync_functions.sql** - Core sync functions (`initial_sync_all()`, `full_sync_all()`, etc.)
4. **004_mobile_business_tables.sql** - Mobile-optimized business tables
5. **005_mobile_sync_populate.sql** - Initial data population
6. **006_sync_deals_projects.sql** - Deal and project sync
7. **007_sync_document_lines.sql** - Document line items sync
8. **008_complete_documents_mapping.sql** - Complete document relationships
9. **009_create_users_table.sql** - User authentication table with bcrypt password hashing
10. **010_create_files_tables.sql** - File storage for interventions (photos, signatures, etc.)

**Note**: Each migration has a corresponding rollback script (`*_rollback.sql`)

### Migration Management

Use `./migrate.sh` in the root directory:
- Tracks execution in `mobile.migration_history` table
- Validates checksums to prevent re-execution
- Provides rollback support
- Non-invasive: NEVER modifies EBP `public` schema

## Project Status & Roadmap

### Current Status (Phases 1-4 Complete - Mobile App Production-Ready)
- ✅ Database audit complete (319 tables analyzed)
- ✅ TypeScript interfaces generated for all EBP tables
- ✅ Mobile schema migrations created (10 migrations ready)
- ✅ EBP sync application functional (Electron GUI)
- ✅ NinjaOne integration functional (965 tickets, 114 orgs)
- ✅ Backend API complete (23 endpoints: interventions + customers + sync)
- ✅ **Mobile App Phases 1-4 Complete**:
  - Phase 1: Planning & Tasks screens
  - Phase 2: Biometric authentication (Face ID/Touch ID)
  - Phase 3: Intervention workflow (start/complete + photos + signature)
  - Phase 4: Customer search + 360° view
- ✅ Mobile features: GPS maps, TimeSheet, photo gallery, offline-ready

### Next Steps (Short-Term)
1. **Test mobile app** on physical devices (Android + iOS)
2. **Phase 5 - Calendar**: Monthly/weekly view + rescheduling
3. **Phase 6 - Dashboard**: Technician KPIs + performance charts
4. **Deploy migrations** to production PostgreSQL
5. **Build production APK/IPA** for field testing
6. **Implement WatermelonDB** in development build for true offline mode

### Long-Term Roadmap
1. Build data warehouse Bronze/Silver/Gold layers
2. Deploy ML models for predictive analytics
3. Multi-language support (FR/EN)
4. Push notifications
5. Advanced reporting & exports

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
- **Mobile app specifics**:
  - The mobile app uses **API-first architecture** during development (Expo Go)
  - WatermelonDB requires development build - don't expect it to work in Expo Go
  - Always test mobile features on physical device before production
  - Mobile app is in active development - check `Audits&Notes/26-10-25/` and `mobile/notes/` for latest status
  - Backend must be running on localhost:3000 for mobile development
  - Use Material Design 3 components from react-native-paper for consistency

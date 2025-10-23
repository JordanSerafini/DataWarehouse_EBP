# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

EBP Sync Manager is an Electron-based desktop application that synchronizes data from an EBP (MSSQL Server) database to PostgreSQL. The application provides a GUI for non-technical users and a REST API backend for programmatic access.

## Build Commands

```bash
# Install dependencies
npm install

# Compile TypeScript to JavaScript
npm run build

# Development
npm run dev              # Run backend server with ts-node
npm run server          # Run backend server only
npm run electron        # Run Electron app (production mode)
npm run electron:dev    # Run Electron app (development mode with auto-reload)

# Schema discovery
npm run discover        # Discover EBP database schema
npm run sync            # Run standalone sync script

# Build executable
npm run electron:build:win   # Build Windows installer (.exe)
```

## Project Architecture

### High-Level Structure

The project is split into three main components:

1. **Backend Server** (`src/`): Express REST API that handles database operations
2. **Electron Main Process** (`electron/main.js`): Desktop application shell that manages the backend server process
3. **Electron Renderer** (`electron/renderer.js` + `index.html`): GUI for end users

### Key Architectural Patterns

#### Database Connection Management

- **EBP Connection**: Singleton client in [clients/ebp.clients.ts](clients/ebp.clients.ts) connects to MSSQL Server using `mssql` package
- **PostgreSQL Connection**: Singleton service in [src/services/database.service.ts](src/services/database.service.ts) manages connection pooling with `pg` package
- Both connections are initialized at server startup and reused throughout the application lifecycle

#### Type Mapping System

The [src/services/type-mapper.service.ts](src/services/type-mapper.service.ts) handles MSSQL-to-PostgreSQL type conversion:
- Maps MSSQL types (e.g., `uniqueidentifier`, `datetime`, `nvarchar`) to PostgreSQL equivalents
- Preserves column name casing (critical for EBP databases where columns like `Id` and `caption` coexist)
- Handles special cases: `varchar(max)` → `TEXT`, `uniqueidentifier` → `UUID`, `bit` → `BOOLEAN`

#### Synchronization Flow

1. **Discovery Phase** (`SyncService.getTableMetadata`):
   - Query MSSQL `INFORMATION_SCHEMA` to get column definitions and primary keys
   - Count rows in source table

2. **Schema Creation** (`SyncService.createTableInPG`):
   - Drop existing table if `dropAndCreate=true`, otherwise `TRUNCATE`
   - Generate PostgreSQL `CREATE TABLE` statement with mapped types
   - Preserve primary key constraints

3. **Data Transfer** (`SyncService.syncTable`):
   - Paginate data from MSSQL using `OFFSET/FETCH` (default batch size: 1000 rows)
   - Convert values using `TypeMapperService.convertValue`
   - Insert batches using `pg-format` for SQL injection protection
   - Use quoted identifiers (`"columnName"`) to preserve casing

#### Configuration Storage

The Electron app uses `electron-store` to persist configuration:
- Database credentials (EBP server, PostgreSQL host, ports, usernames, passwords)
- Backend server port
- Stored in encrypted format on the user's machine
- Configuration changes trigger automatic backend server restart

#### Server Process Management

The Electron main process ([electron/main.js](electron/main.js)) manages the backend server:
- Forks `dist/server.js` as a child process (or `src/server.ts` with ts-node in dev mode)
- Passes configuration from electron-store as environment variables
- IPC handlers allow renderer to start/stop/restart the server
- Server process is automatically stopped when Electron app quits

### Important Implementation Details

#### Column Name Casing

EBP databases use mixed-case column names (e.g., `customer.Id`, `Items.Caption`). The sync service:
- Wraps MSSQL column names in brackets: `[columnName]`
- Wraps PostgreSQL column names in double quotes: `"columnName"`
- Never lowercases or transforms column names

#### Batch Processing

Large tables are synced in batches to avoid memory issues:
- Default batch size: 1000 rows (configurable via `SyncOptions.batchSize`)
- Progress logging shows `totalSynced/rowCount (%)` after each batch
- Uses PostgreSQL multi-row INSERT syntax for performance

#### Error Handling

- Each table sync is wrapped in try-catch; failures are logged but don't stop the entire sync
- `SyncResult` objects track status, rowsSynced, duration, and errors
- Verification service can detect and repair discrepancies between source and target

## REST API Endpoints

The backend server ([src/server.ts](src/server.ts)) exposes these endpoints:

- `GET /health` - Check EBP and PostgreSQL connection status
- `POST /api/sync/full` - Full sync with options: `{tables?, dropAndCreate?, batchSize?, schema?}`
- `POST /api/sync/verify` - Verify sync integrity: `{tables?, sampleSize?, checkAllRows?, schema?}`
- `POST /api/sync/repair` - Repair sync issues
- `GET /api/sync/tables` - List all EBP tables
- `POST /api/backup/create` - Create PostgreSQL dump: `{format?, compress?, tables?, schemaOnly?, dataOnly?}`
- `GET /api/backup/list` - List existing backups
- `DELETE /api/backup/:fileName` - Delete a backup
- `POST /api/backup/cleanup` - Clean old backups: `{keepCount?}`

## Testing and Debugging

To test changes:

1. **Backend-only testing**: Use `npm run server` and test API endpoints with curl/Postman
2. **Full application testing**: Use `npm run electron:dev` for hot-reload
3. **Production build testing**: Run `npm run build && npm run electron`

To view logs:
- Backend logs appear in the terminal (or Electron main process console)
- Renderer logs visible in Electron DevTools (opened automatically in dev mode)
- Server logs are also forwarded to the GUI's "Logs" tab via IPC

## Environment Variables

Configuration is managed via `.env` file (for CLI usage) or electron-store (for GUI):

```env
# PostgreSQL (target)
PG_HOST=localhost
PG_PORT=5432
PG_DATABASE=ebp_db
PG_USER=postgres
PG_PASSWORD=postgres

# EBP / MSSQL (source)
CLIENT_EBP_SERVER=SERVERNAME\INSTANCE
CLIENT_EBP_DATABASE=database_name
EBP_USER=sa
EBP_PASSWORD=password

# Backend server
PORT=3000
```

## Common Development Tasks

### Adding a New Sync Option

1. Update `SyncOptions` interface in [src/services/sync.service.ts](src/services/sync.service.ts)
2. Add handling logic in `SyncService.syncTable` method
3. Update API endpoint in [src/routes/sync.routes.ts](src/routes/sync.routes.ts) to accept new parameter
4. Update Electron renderer UI if exposing to end users

### Adding a New Type Mapping

1. Add mapping in `TypeMapperService.mapMSSQLToPG` method
2. Add value conversion logic in `TypeMapperService.convertValue` if special handling needed
3. Test with a table containing the new type

### Debugging Connection Issues

- Check `startServer()` function in [src/server.ts](src/server.ts:207) - this is where both database connections are initialized
- EBP connection failures often indicate incorrect server name format (must be `SERVER\INSTANCE`)
- PostgreSQL connection failures typically mean the service isn't running or credentials are wrong
- Use `/health` endpoint to verify connection status after server starts

## Distribution

To create a distributable Windows installer:

```bash
npm run build
npm run electron:build:win
```

The installer will be in `release/EBP Sync Manager Setup.exe`. This includes Node.js runtime, so end users don't need Node.js installed.

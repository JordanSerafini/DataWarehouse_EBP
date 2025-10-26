/**
 * Schéma WatermelonDB
 * Définit la structure de la base de données locale
 */

import { appSchema, tableSchema } from '@nozbe/watermelondb';

export const schema = appSchema({
  version: 1,
  tables: [
    // Table des interventions
    tableSchema({
      name: 'interventions',
      columns: [
        { name: 'server_id', type: 'string', isIndexed: true },
        { name: 'reference', type: 'string', isIndexed: true },
        { name: 'title', type: 'string' },
        { name: 'description', type: 'string', isOptional: true },

        // Dates
        { name: 'scheduled_date', type: 'number' }, // timestamp
        { name: 'scheduled_end_date', type: 'number', isOptional: true },
        { name: 'actual_start_date', type: 'number', isOptional: true },
        { name: 'actual_end_date', type: 'number', isOptional: true },

        // Statut et type
        { name: 'status', type: 'number' },
        { name: 'status_label', type: 'string' },
        { name: 'type', type: 'number' },
        { name: 'type_label', type: 'string' },
        { name: 'priority', type: 'number' },

        // Relations
        { name: 'customer_id', type: 'string', isOptional: true, isIndexed: true },
        { name: 'customer_name', type: 'string', isOptional: true },
        { name: 'project_id', type: 'number', isOptional: true, isIndexed: true },
        { name: 'project_name', type: 'string', isOptional: true },
        { name: 'technician_id', type: 'string', isOptional: true, isIndexed: true },
        { name: 'technician_name', type: 'string', isOptional: true },

        // Localisation
        { name: 'address', type: 'string', isOptional: true },
        { name: 'city', type: 'string', isOptional: true },
        { name: 'postal_code', type: 'string', isOptional: true },
        { name: 'latitude', type: 'number', isOptional: true },
        { name: 'longitude', type: 'number', isOptional: true },

        // Informations additionnelles
        { name: 'estimated_duration', type: 'number', isOptional: true },
        { name: 'actual_duration', type: 'number', isOptional: true },
        { name: 'notes', type: 'string', isOptional: true },

        // Sync
        { name: 'is_synced', type: 'boolean' },
        { name: 'last_synced_at', type: 'number', isOptional: true },

        // Timestamps
        { name: 'created_at', type: 'number' },
        { name: 'updated_at', type: 'number' },
      ],
    }),

    // Table des clients
    tableSchema({
      name: 'customers',
      columns: [
        { name: 'server_id', type: 'string', isIndexed: true },
        { name: 'name', type: 'string', isIndexed: true },
        { name: 'type', type: 'number' },
        { name: 'type_label', type: 'string' },

        // Coordonnées
        { name: 'email', type: 'string', isOptional: true },
        { name: 'phone', type: 'string', isOptional: true },
        { name: 'mobile', type: 'string', isOptional: true },
        { name: 'fax', type: 'string', isOptional: true },

        // Adresse
        { name: 'address', type: 'string', isOptional: true },
        { name: 'address_complement', type: 'string', isOptional: true },
        { name: 'city', type: 'string', isOptional: true, isIndexed: true },
        { name: 'postal_code', type: 'string', isOptional: true },
        { name: 'country', type: 'string', isOptional: true },
        { name: 'latitude', type: 'number', isOptional: true },
        { name: 'longitude', type: 'number', isOptional: true },

        // Informations commerciales
        { name: 'siret', type: 'string', isOptional: true },
        { name: 'vat_number', type: 'string', isOptional: true },
        { name: 'accounting_code', type: 'string', isOptional: true },

        // Métadonnées
        { name: 'is_active', type: 'boolean' },

        // Sync
        { name: 'is_synced', type: 'boolean' },
        { name: 'last_synced_at', type: 'number', isOptional: true },

        // Timestamps
        { name: 'created_at', type: 'number' },
        { name: 'updated_at', type: 'number' },
      ],
    }),

    // Table des projets
    tableSchema({
      name: 'projects',
      columns: [
        { name: 'server_id', type: 'number', isIndexed: true },
        { name: 'name', type: 'string', isIndexed: true },
        { name: 'reference', type: 'string', isOptional: true },

        // Relations
        { name: 'customer_id', type: 'string', isOptional: true, isIndexed: true },
        { name: 'customer_name', type: 'string', isOptional: true },
        { name: 'manager_id', type: 'string', isOptional: true, isIndexed: true },
        { name: 'manager_name', type: 'string', isOptional: true },

        // Statut
        { name: 'state', type: 'number' },
        { name: 'state_label', type: 'string' },

        // Dates
        { name: 'start_date', type: 'number', isOptional: true },
        { name: 'end_date', type: 'number', isOptional: true },
        { name: 'actual_end_date', type: 'number', isOptional: true },

        // Localisation
        { name: 'city', type: 'string', isOptional: true },
        { name: 'latitude', type: 'number', isOptional: true },
        { name: 'longitude', type: 'number', isOptional: true },

        // Sync
        { name: 'is_synced', type: 'boolean' },
        { name: 'last_synced_at', type: 'number', isOptional: true },

        // Timestamps
        { name: 'created_at', type: 'number' },
        { name: 'updated_at', type: 'number' },
      ],
    }),

    // Table des notes d'intervention
    tableSchema({
      name: 'intervention_notes',
      columns: [
        { name: 'server_id', type: 'string', isIndexed: true },
        { name: 'intervention_id', type: 'string', isIndexed: true },
        { name: 'content', type: 'string' },
        { name: 'created_by', type: 'string' },
        { name: 'created_by_name', type: 'string' },

        // Sync
        { name: 'is_synced', type: 'boolean' },
        { name: 'last_synced_at', type: 'number', isOptional: true },

        // Timestamps
        { name: 'created_at', type: 'number' },
        { name: 'updated_at', type: 'number' },
      ],
    }),

    // Table des photos d'intervention
    tableSchema({
      name: 'intervention_photos',
      columns: [
        { name: 'server_id', type: 'string', isOptional: true, isIndexed: true },
        { name: 'intervention_id', type: 'string', isIndexed: true },
        { name: 'filename', type: 'string' },
        { name: 'original_filename', type: 'string' },
        { name: 'file_path', type: 'string' },
        { name: 'file_url', type: 'string', isOptional: true },
        { name: 'mime_type', type: 'string' },
        { name: 'file_size', type: 'number' },
        { name: 'latitude', type: 'number', isOptional: true },
        { name: 'longitude', type: 'number', isOptional: true },
        { name: 'uploaded_by', type: 'string' },

        // Sync
        { name: 'is_synced', type: 'boolean' },
        { name: 'last_synced_at', type: 'number', isOptional: true },

        // Timestamps
        { name: 'created_at', type: 'number' },
        { name: 'updated_at', type: 'number' },
      ],
    }),

    // Table des contacts clients
    tableSchema({
      name: 'customer_contacts',
      columns: [
        { name: 'server_id', type: 'string', isIndexed: true },
        { name: 'customer_id', type: 'string', isIndexed: true },
        { name: 'first_name', type: 'string' },
        { name: 'last_name', type: 'string' },
        { name: 'email', type: 'string', isOptional: true },
        { name: 'phone', type: 'string', isOptional: true },
        { name: 'mobile', type: 'string', isOptional: true },
        { name: 'position', type: 'string', isOptional: true },
        { name: 'is_primary', type: 'boolean' },

        // Sync
        { name: 'is_synced', type: 'boolean' },
        { name: 'last_synced_at', type: 'number', isOptional: true },

        // Timestamps
        { name: 'created_at', type: 'number' },
        { name: 'updated_at', type: 'number' },
      ],
    }),

    // Table des événements calendrier
    tableSchema({
      name: 'calendar_events',
      columns: [
        { name: 'server_id', type: 'string', isIndexed: true },
        { name: 'title', type: 'string' },
        { name: 'description', type: 'string', isOptional: true },

        // Dates
        { name: 'start_datetime', type: 'number' }, // timestamp
        { name: 'end_datetime', type: 'number', isOptional: true },

        // Type et statut
        { name: 'event_type', type: 'string', isIndexed: true }, // intervention, appointment, maintenance, etc.
        { name: 'status', type: 'string' }, // planned, in_progress, completed, etc.

        // Relations
        { name: 'colleague_id', type: 'string', isOptional: true, isIndexed: true },
        { name: 'colleague_name', type: 'string', isOptional: true },
        { name: 'customer_id', type: 'string', isOptional: true, isIndexed: true },
        { name: 'customer_name', type: 'string', isOptional: true },

        // Localisation
        { name: 'address', type: 'string', isOptional: true },
        { name: 'city', type: 'string', isOptional: true },
        { name: 'zipcode', type: 'string', isOptional: true },
        { name: 'latitude', type: 'number', isOptional: true },
        { name: 'longitude', type: 'number', isOptional: true },

        // Métadonnées
        { name: 'creator_id', type: 'string', isOptional: true },

        // Sync
        { name: 'is_synced', type: 'boolean' },
        { name: 'last_synced_at', type: 'number', isOptional: true },

        // Timestamps
        { name: 'created_at', type: 'number' },
        { name: 'updated_at', type: 'number' },
      ],
    }),
  ],
});

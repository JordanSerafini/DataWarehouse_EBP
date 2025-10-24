/**
 * Configuration de la base de données WatermelonDB
 */

import { Database } from '@nozbe/watermelondb';
import SQLiteAdapter from '@nozbe/watermelondb/adapters/sqlite';
import { schema } from '../models/schema';
import { Intervention, Customer, Project } from '../models';

// Configuration de l'adaptateur SQLite
const adapter = new SQLiteAdapter({
  schema,
  // Optionnel: migrations pour les futures versions
  // migrations,
  jsi: false, // Désactivé JSI pour éviter les erreurs de runtime
  onSetUpError: (error) => {
    // Gérer les erreurs d'initialisation de la DB
    console.error('Erreur d\'initialisation de WatermelonDB:', error);
  },
});

// Création de l'instance de la base de données
export const database = new Database({
  adapter,
  modelClasses: [
    Intervention,
    Customer,
    Project,
    // Ajoutez les autres modèles ici au fur et à mesure
  ],
});

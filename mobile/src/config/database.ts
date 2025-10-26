/**
 * Configuration de la base de données WatermelonDB
 *
 * ⚠️ EXPO GO MODE - WatermelonDB DÉSACTIVÉ
 *
 * WatermelonDB nécessite du code natif qui n'est pas disponible dans Expo Go.
 * Pour utiliser WatermelonDB, créez un development build:
 *
 *   npx expo run:android
 *
 * Voir WATERMELONDB_SETUP.md pour plus d'informations.
 */

// TEMPORAIREMENT DÉSACTIVÉ POUR EXPO GO
export const database = null as any;

console.warn('🚨 MODE EXPO GO - WatermelonDB désactivé');
console.warn('📱 Pour tester avec la vraie base de données, créez un development build:');
console.warn('   cd mobile && npx expo run:android');

/*
// CODE WATERMELONDB - À RÉACTIVER AVEC DEVELOPMENT BUILD

import { Database } from '@nozbe/watermelondb';
import SQLiteAdapter from '@nozbe/watermelondb/adapters/sqlite';
import { schema } from '../models/schema';
import { Intervention, Customer, Project } from '../models';

// Configuration de l'adaptateur SQLite
const adapter = new SQLiteAdapter({
  schema,
  jsi: false, // Désactivé JSI pour éviter les erreurs de runtime
  onSetUpError: (error) => {
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
  ],
});
*/

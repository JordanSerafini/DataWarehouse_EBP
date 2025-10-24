/**
 * Mock de la base de données pour tests avec Expo Go
 * WatermelonDB ne fonctionne PAS avec Expo Go
 * Utilisez ce fichier temporairement pour tester l'UI
 */

export const database = null as any;

console.warn('🚨 MODE MOCK - WatermelonDB désactivé pour Expo Go');
console.warn('Pour utiliser la vraie DB, créez un development build:');
console.warn('npx expo run:android');

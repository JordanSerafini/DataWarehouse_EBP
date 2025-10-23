/**
 * Script pour réinitialiser la configuration stockée par Electron
 * Utile si vous voulez forcer le rechargement depuis .env
 */

const Store = require('electron-store');

const store = new Store();

console.log('\n========================================');
console.log('Réinitialisation de la configuration');
console.log('========================================\n');

console.log('Configuration actuelle:');
console.log(JSON.stringify(store.store, null, 2));

console.log('\nSuppression de la configuration...');
store.clear();

console.log('✓ Configuration réinitialisée!');
console.log('\nAu prochain lancement, l\'application chargera depuis le fichier .env\n');

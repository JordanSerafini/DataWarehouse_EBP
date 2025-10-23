# Scripts Utilitaires

Ce dossier contient des scripts de maintenance, debug et utilitaires pour le projet EBP to PostgreSQL.

## Scripts de Debug

### `debug-pricelist.js`
Analyse détaillée de la table `PriceListCalculationLine` pour identifier les problèmes de synchronisation.

**Usage:**
```bash
node scripts/debug-pricelist.js
```

### `debug-pricelist-fk.js`
Vérifie les clés étrangères et compare les lignes manquantes dans `PriceListCalculationLine`.

**Usage:**
```bash
node scripts/debug-pricelist-fk.js
```

### `check-threshold-type.js`
Teste les types de données et les limites numériques pour la colonne `Threshold`.

**Usage:**
```bash
node scripts/check-threshold-type.js
```

### `test-compare.js`
Teste la logique de comparaison des valeurs (numériques, dates, GUIDs) entre EBP et PostgreSQL.

**Usage:**
```bash
node scripts/test-compare.js
```

### `test-datatype.js`
Analyse les types de données MSSQL et vérifie la détection des types numériques.

**Usage:**
```bash
node scripts/test-datatype.js
```

### `test-verification.js`
Test complet du service de vérification avec connexion aux deux bases de données.

**Usage:**
```bash
node scripts/test-verification.js
```

## Scripts de Maintenance

### `fix-emojis.js`
Convertit les séquences Unicode en emojis réels dans les fichiers HTML (utilisé une fois après développement).

**Usage:**
```bash
node scripts/fix-emojis.js
```

### `reset-config.js`
Réinitialise la configuration Electron pour forcer le rechargement depuis `.env`.

**Usage:**
```bash
node scripts/reset-config.js
```

## Notes

- Ces scripts nécessitent un fichier `.env` configuré à la racine du projet
- Certains scripts se connectent aux bases de données EBP (MSSQL) et PostgreSQL
- Les fichiers de sortie (debug-*.json) sont ignorés par git

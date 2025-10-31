#!/usr/bin/env node
/**
 * Script pour appliquer automatiquement SafeAreaScreen à tous les écrans
 * Usage: node scripts/apply-safe-area.js
 */

const fs = require('fs');
const path = require('path');

// Configuration des écrans
const SCREENS = {
  // Écrans sans TabBar (protection complète)
  withoutTabBar: [
    'src/screens/Interventions/InterventionDetailsScreen.v2.tsx',
    'src/screens/Tickets/TicketDetailsScreen.tsx',
    'src/screens/Customers/CustomerDetailsScreen.tsx',
    'src/screens/Projects/ProjectDetailsScreen.tsx',
    'src/screens/Admin/UserFormScreen.tsx',
  ],
  // Écrans avec TabBar (protection top uniquement)
  withTabBar: [
    'src/screens/Planning/PlanningScreen.tsx',
    'src/screens/Calendar/CalendarScreen.tsx',
    'src/screens/Tasks/TasksScreen.tsx',
    'src/screens/Interventions/InterventionsScreen.tsx',
    'src/screens/Tickets/TicketsScreen.tsx',
    'src/screens/Customers/CustomersScreen.tsx',
    'src/screens/Projects/ProjectsScreen.tsx',
    'src/screens/Admin/AdminUsersScreen.tsx',
    'src/screens/Profile/ProfileScreen.tsx',
    'src/screens/Test/UITestScreen.tsx',
  ],
};

/**
 * Ajouter l'import SafeAreaScreen si nécessaire
 */
function addSafeAreaImport(content, filePath) {
  // Déterminer le chemin relatif pour l'import
  const depth = filePath.split('/').length - 2; // Nombre de niveaux de dossiers
  const importPath = '../'.repeat(depth) + 'components/SafeAreaScreen';

  // Vérifier si l'import existe déjà
  if (content.includes('SafeAreaScreen')) {
    console.log('  ✓ Import SafeAreaScreen déjà présent');
    return content;
  }

  // Trouver le dernier import de composant local
  const importRegex = /import .+ from ['"]\.\.?\/.+['"];?\n/g;
  const matches = [...content.matchAll(importRegex)];

  if (matches.length > 0) {
    const lastImport = matches[matches.length - 1];
    const insertPos = lastImport.index + lastImport[0].length;
    const importLine = `import { SafeAreaScreen } from '${importPath}';\n`;

    content = content.slice(0, insertPos) + importLine + content.slice(insertPos);
    console.log('  ✓ Import SafeAreaScreen ajouté');
  } else {
    console.warn('  ⚠ Impossible de trouver un emplacement pour l\'import');
  }

  return content;
}

/**
 * Envelopper le return principal avec SafeAreaScreen
 */
function wrapWithSafeArea(content, hasTabBar) {
  // Pattern pour trouver le return principal
  const returnPattern = /return\s*\(\s*\n/;
  const match = content.match(returnPattern);

  if (!match) {
    console.warn('  ⚠ Pattern return non trouvé');
    return content;
  }

  // Déterminer les props SafeAreaScreen
  const safeAreaProps = hasTabBar
    ? ' edges={[\'top\']}'
    : '';

  // Trouver le JSX root element après le return
  const returnIndex = match.index + match[0].length;
  const afterReturn = content.slice(returnIndex);

  // Trouver l'élément racine (généralement <View, <KeyboardAvoidingView, etc.)
  const rootElementMatch = afterReturn.match(/^\s*<(\w+)/);

  if (!rootElementMatch) {
    console.warn('  ⚠ Élément racine non trouvé');
    return content;
  }

  const rootElement = rootElementMatch[1];

  // Compter les indentations
  const indentMatch = afterReturn.match(/^(\s*)</);
  const indent = indentMatch ? indentMatch[1] : '    ';

  // Wrapper avec SafeAreaScreen
  const wrapped = content.slice(0, returnIndex) +
    `${indent}<SafeAreaScreen${safeAreaProps}>\n` +
    afterReturn.replace(
      new RegExp(`(\\s*)</${rootElement}>\\s*\\);?\\s*$`, 'm'),
      `$1</${rootElement}>\n${indent}</SafeAreaScreen>$1);`
    );

  console.log(`  ✓ Enveloppé dans <SafeAreaScreen${safeAreaProps}>`);
  return wrapped;
}

/**
 * Traiter un fichier
 */
function processFile(filePath, hasTabBar) {
  const fullPath = path.join(__dirname, '..', filePath);

  console.log(`\n📄 Traitement: ${filePath}`);

  if (!fs.existsSync(fullPath)) {
    console.error(`  ✗ Fichier introuvable: ${fullPath}`);
    return false;
  }

  try {
    let content = fs.readFileSync(fullPath, 'utf8');

    // Vérifier si déjà enveloppé
    if (content.includes('<SafeAreaScreen')) {
      console.log('  ⚠ Déjà enveloppé avec SafeAreaScreen - ignoré');
      return true;
    }

    // Ajouter l'import
    content = addSafeAreaImport(content, filePath);

    // Envelopper avec SafeAreaScreen
    content = wrapWithSafeArea(content, hasTabBar);

    // Écrire le fichier modifié
    fs.writeFileSync(fullPath, content, 'utf8');
    console.log('  ✅ Fichier mis à jour avec succès');

    return true;
  } catch (error) {
    console.error(`  ✗ Erreur: ${error.message}`);
    return false;
  }
}

/**
 * Main
 */
function main() {
  console.log('🚀 Application automatique de SafeAreaScreen\n');
  console.log('=' .repeat(60));

  let successCount = 0;
  let failCount = 0;

  console.log('\n📦 Écrans sans TabBar (protection complète)');
  SCREENS.withoutTabBar.forEach(filePath => {
    if (processFile(filePath, false)) {
      successCount++;
    } else {
      failCount++;
    }
  });

  console.log('\n\n📦 Écrans avec TabBar (protection top uniquement)');
  SCREENS.withTabBar.forEach(filePath => {
    if (processFile(filePath, true)) {
      successCount++;
    } else {
      failCount++;
    }
  });

  console.log('\n' + '='.repeat(60));
  console.log(`\n✅ Succès: ${successCount}`);
  console.log(`✗ Échecs: ${failCount}`);
  console.log('\n⚠️  IMPORTANT: Vérifiez manuellement chaque fichier modifié !');
  console.log('   Certains écrans peuvent nécessiter des ajustements manuels.\n');
}

// Exécuter
main();

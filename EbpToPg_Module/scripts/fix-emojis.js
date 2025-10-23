const fs = require('fs');
const path = require('path');

const htmlPath = path.join(__dirname, 'electron', 'index.html');
let content = fs.readFileSync(htmlPath, 'utf8');

// Remplacer les séquences unicode échappées par les vrais caractères
content = content.replace(/\\u([0-9a-fA-F]{4})/g, (match, hex) => {
  return String.fromCharCode(parseInt(hex, 16));
});

fs.writeFileSync(htmlPath, content, 'utf8');
console.log('✓ Emojis corrigés dans index.html');

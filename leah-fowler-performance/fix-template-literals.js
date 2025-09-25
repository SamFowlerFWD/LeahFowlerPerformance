const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'tests/ui-ux-inspection/full-inspection.spec.ts');

// Read the file
let content = fs.readFileSync(filePath, 'utf8');

// Replace all escaped backticks that should be regular backticks
// This regex finds \` followed by ${ which indicates a template literal
content = content.replace(/\\`(\$\{[^}]+\})/g, '`$1');

// Replace escaped backticks in template literals
content = content.replace(/\\`/g, '`');

// Write the file back
fs.writeFileSync(filePath, content);

console.log('Fixed all escaped template literals in', filePath);
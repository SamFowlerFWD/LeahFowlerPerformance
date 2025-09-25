const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'tests/ui-ux-inspection/full-inspection.spec.ts');

// Read the file
let content = fs.readFileSync(filePath, 'utf8');

// Replace \${ with ${ to fix template literal syntax
content = content.replace(/\\\$\{/g, '${');

// Replace \` with ` to fix template literal delimiters
content = content.replace(/\\`/g, '`');

// Replace \\ with \ in strings (for things like \\n that should be \n)
content = content.replace(/\\\\n/g, '\\n');
content = content.replace(/\\\\s/g, '\\s');

// Write the file back
fs.writeFileSync(filePath, content);

console.log('Fixed all template literal issues in', filePath);
console.log('- Fixed escaped dollar signs (\\${ to ${)');
console.log('- Fixed escaped backticks (\\` to `)');
console.log('- Fixed double backslashes (\\\\n to \\n)');
#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Function to fix unescaped entities
function fixUnescapedEntities(content) {
  // Fix apostrophes in JSX text content
  // This regex finds text between > and < that contains apostrophes
  content = content.replace(/>([\s\S]*?)</g, (match, textContent) => {
    // Skip if it's a code block or already escaped
    if (textContent.includes('{') || textContent.includes('&apos;')) {
      return match;
    }

    // Replace apostrophes with &apos;
    const fixed = textContent
      .replace(/'/g, '&apos;')
      .replace(/"/g, '&quot;')
      .replace(/–/g, '&ndash;')
      .replace(/—/g, '&mdash;');

    return `>${fixed}<`;
  });

  return content;
}

// Function to remove unused imports
function removeUnusedImports(content, filePath) {
  try {
    // Run ESLint on the file to get unused variables
    const eslintOutput = execSync(`npx eslint ${filePath} --format=json`, {
      encoding: 'utf8',
      stdio: ['pipe', 'pipe', 'pipe']
    });

    const results = JSON.parse(eslintOutput);
    if (!results[0] || !results[0].messages) return content;

    const unusedVars = results[0].messages
      .filter(m => m.ruleId === '@typescript-eslint/no-unused-vars')
      .map(m => {
        const match = m.message.match(/'([^']+)'/);
        return match ? match[1] : null;
      })
      .filter(Boolean);

    // Remove unused imports
    unusedVars.forEach(varName => {
      // Remove from import statements
      content = content.replace(
        new RegExp(`\\s*${varName}\\s*,?`, 'g'),
        (match) => match.includes(',') ? ',' : ''
      );
    });

    // Clean up empty imports and trailing commas
    content = content.replace(/import\s*{\s*,?\s*}\s*from\s*['"][^'"]+['"]\s*\n/g, '');
    content = content.replace(/,(\s*[}\]])/g, '$1');

  } catch (e) {
    // Silently continue if ESLint fails
  }

  return content;
}

// Function to fix TypeScript any types
function fixAnyTypes(content) {
  // Replace common any patterns
  content = content.replace(/:\s*any(\s|;|,|\)|\})/g, ': unknown$1');
  content = content.replace(/:\s*any\[\]/g, ': unknown[]');
  content = content.replace(/<unknown>/g, &apos;<unknown>&apos;);
  content = content.replace(/as\s+any/g, 'as unknown');

  // Fix Record<string, unknown>
  content = content.replace(/Record<string,\s*any>/g, &apos;Record<string, unknown>');

  return content;
}

// Function to process a single file
function processFile(filePath) {
  if (!filePath.endsWith('.tsx') && !filePath.endsWith('.ts')) {
    return false;
  }

  try {
    let content = fs.readFileSync(filePath, 'utf8');
    const originalContent = content;

    // Apply fixes
    content = fixUnescapedEntities(content);
    content = removeUnusedImports(content, filePath);
    content = fixAnyTypes(content);

    // Only write if content changed
    if (content !== originalContent) {
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`✅ Fixed: ${filePath}`);
      return true;
    }

    return false;
  } catch (error) {
    console.error(`❌ Error processing ${filePath}:`, error.message);
    return false;
  }
}

// Function to recursively process directories
function processDirectory(dir) {
  const filesFixed = 0;

  const items = fs.readdirSync(dir);

  for (const item of items) {
    const fullPath = path.join(dir, item);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory() && !item.startsWith('.') && item !== 'node_modules') {
      filesFixed += processDirectory(fullPath);
    } else if (stat.isFile()) {
      if (processFile(fullPath)) {
        filesFixed++;
      }
    }
  }

  return filesFixed;
}

// Main execution
console.log('🔧 Starting ESLint fixes...\n');

const directories = [
  'components',
  'app',
  'lib',
  'types',
  'tests'
];

const totalFixed = 0;

directories.forEach(dir => {
  const fullPath = path.join(process.cwd(), dir);
  if (fs.existsSync(fullPath)) {
    console.log(`📁 Processing ${dir}/...`);
    const fixed = processDirectory(fullPath);
    totalFixed += fixed;
    console.log(`   Fixed ${fixed} files in ${dir}\n`);
  }
});

console.log(`\n✨ Total files fixed: ${totalFixed}`);
console.log('\n🔍 Running ESLint to check remaining issues...');

// Run ESLint to show remaining issues
try {
  execSync('npm run lint', { stdio: 'inherit' });
  console.log('\n✅ All ESLint issues resolved!');
} catch (e) {
  console.log('\n⚠️ Some ESLint issues remain. Please check the output above.');
}
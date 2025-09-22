#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const totalFixedFiles = 0;
const totalFixedIssues = 0;

// Function to fix unescaped entities in JSX
function fixUnescapedEntities(content, filePath) {
  let fixed = false;
  let newContent = content;

  // Fix apostrophes in JSX text content - more comprehensive regex
  // This looks for text between > and < that contains apostrophes, avoiding code blocks
  newContent = newContent.replace(/>([^<{]*?)'([^<{]*?)</g, (match, before, after) => {
    fixed = true;
    return `>${before}&apos;${after}<`;
  });

  // Fix double quotes in JSX text content
  newContent = newContent.replace(/>([^<{]*?)"([^<{]*?)</g, (match, before, after) => {
    fixed = true;
    return `>${before}&quot;${after}<`;
  });

  // Fix closing quotes
  newContent = newContent.replace(/>([^<{]*?)"([^<{]*?)</g, (match, before, after) => {
    fixed = true;
    return `>${before}&quot;${after}<`;
  });

  // Fix em-dash and en-dash
  newContent = newContent.replace(/>([^<{]*?)—([^<{]*?)</g, (match, before, after) => {
    fixed = true;
    return `>${before}&mdash;${after}<`;
  });

  newContent = newContent.replace(/>([^<{]*?)–([^<{]*?)</g, (match, before, after) => {
    fixed = true;
    return `>${before}&ndash;${after}<`;
  });

  if (fixed) {
    totalFixedIssues++;
  }

  return newContent;
}

// Function to remove unused imports
function removeUnusedImports(content, unusedVars) {
  let newContent = content;

  unusedVars.forEach(varName => {
    // Handle multi-line imports
    const importRegex = new RegExp(
      `^import\\s+(?:type\\s+)?{([^}]*?\\b${varName}\\b[^}]*?)}\\s+from`,
      'gm'
    );

    newContent = newContent.replace(importRegex, (match, imports) => {
      const importsList = imports.split(',').map(i => i.trim());
      const filteredImports = importsList.filter(i => !i.includes(varName));

      if (filteredImports.length === 0) {
        return ''; // Remove entire import if no imports left
      }

      return match.replace(imports, `\n  ${filteredImports.join(',\n  ')}\n`);
    });

    // Handle single-line imports
    newContent = newContent.replace(
      new RegExp(`\\s*\\b${varName}\\b\\s*,?`, 'g'),
      (match, offset, str) => {
        // Check if this is within an import statement
        const lineStart = str.lastIndexOf('\n', offset);
        const lineEnd = str.indexOf('\n', offset);
        const line = str.substring(lineStart, lineEnd);

        if (line.includes('import') && line.includes('from')) {
          // It's an import line
          if (match.includes(',')) {
            return ',';
          }
          return '';
        }
        return match;
      }
    );

    // Handle default imports
    newContent = newContent.replace(
      new RegExp(`^import\\s+${varName}\\s+from\\s+['"][^'"]+['"].*$`, 'gm'),
      ''
    );
  });

  // Clean up empty imports
  newContent = newContent.replace(/^import\s*{\s*}\s*from\s*['"][^'"]+['"]\s*$/gm, '');

  // Clean up double commas and trailing commas
  newContent = newContent.replace(/,\s*,/g, ',');
  newContent = newContent.replace(/,\s*}/g, '\n}');
  newContent = newContent.replace(/{\s*,/g, '{\n  ');

  // Remove empty lines from removed imports
  newContent = newContent.replace(/^\n\n+/gm, '\n');

  return newContent;
}

// Function to fix TypeScript any types
function fixAnyTypes(content) {
  let newContent = content;

  // Replace : unknown with : unknown
  newContent = newContent.replace(/:\s*any(\s|;|,|\)|>|}|\]|$)/g, &apos;: unknown$1');

  // Replace : unknown[] with : unknown[]
  newContent = newContent.replace(/:\s*any\[\]/g, ': unknown[]');

  // Replace <unknown> with <unknown>
  newContent = newContent.replace(/<unknown>/g, &apos;<unknown>&apos;);

  // Replace as unknown with as unknown
  newContent = newContent.replace(/\bas\s+any\b/g, 'as unknown');

  // Replace Record<string, unknown> with Record<string, unknown>
  newContent = newContent.replace(/Record<([^,>]+),\s*any>/g, &apos;Record<$1, unknown>&apos;);

  // Replace Array<unknown> with Array<unknown>
  newContent = newContent.replace(/Array<unknown>/g, &apos;Array<unknown>');

  return newContent;
}

// Function to fix prefer-const issues
function fixPreferConst(content) {
  let newContent = content;

  // Look for let declarations that could be const
  // This is a simple approach - for complex cases, we'll rely on ESLint --fix
  newContent = newContent.replace(/\blet\s+(\w+)\s*=/g, (match, varName, offset, str) => {
    // Check if this variable is reassigned later
    const afterDeclaration = str.substring(offset + match.length);
    const reassignRegex = new RegExp(`\\b${varName}\\s*=`, 'g');

    if (!reassignRegex.test(afterDeclaration)) {
      return `const ${varName} =`;
    }

    return match;
  });

  return newContent;
}

// Function to process a single file
async function processFile(filePath) {
  if (!filePath.endsWith('.tsx') && !filePath.endsWith('.ts') && !filePath.endsWith('.jsx') && !filePath.endsWith('.js')) {
    return false;
  }

  try {
    let content = fs.readFileSync(filePath, 'utf8');
    const originalContent = content;

    // Get ESLint errors for this file
    let eslintIssues = [];
    try {
      const result = execSync(`npx eslint ${filePath} --format=json`, {
        encoding: 'utf8',
        stdio: ['pipe', 'pipe', 'pipe']
      });
      const parsed = JSON.parse(result);
      if (parsed[0]) {
        eslintIssues = parsed[0].messages || [];
      }
    } catch (e) {
      // ESLint found issues
      if (e.stdout) {
        try {
          const parsed = JSON.parse(e.stdout);
          if (parsed[0]) {
            eslintIssues = parsed[0].messages || [];
          }
        } catch (parseError) {
          // Ignore parse errors
        }
      }
    }

    // Extract unused variables
    const unusedVars = eslintIssues
      .filter(issue => issue.ruleId === '@typescript-eslint/no-unused-vars')
      .map(issue => {
        const match = issue.message.match(/'([^']+)'/);
        return match ? match[1] : null;
      })
      .filter(Boolean);

    // Apply fixes
    content = fixUnescapedEntities(content, filePath);

    if (unusedVars.length > 0) {
      content = removeUnusedImports(content, unusedVars);
    }

    content = fixAnyTypes(content);
    content = fixPreferConst(content);

    // Only write if content changed
    if (content !== originalContent) {
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`✅ Fixed: ${path.relative(process.cwd(), filePath)}`);
      totalFixedFiles++;
      return true;
    }

    return false;
  } catch (error) {
    console.error(`❌ Error processing ${filePath}:`, error.message);
    return false;
  }
}

// Function to recursively process directories
async function processDirectory(dir) {
  const filesFixed = 0;

  const items = fs.readdirSync(dir);

  for (const item of items) {
    const fullPath = path.join(dir, item);

    try {
      const stat = fs.statSync(fullPath);

      if (stat.isDirectory() && !item.startsWith('.') && item !== 'node_modules' && item !== '.next') {
        filesFixed += await processDirectory(fullPath);
      } else if (stat.isFile()) {
        if (await processFile(fullPath)) {
          filesFixed++;
        }
      }
    } catch (error) {
      console.error(`Error accessing ${fullPath}:`, error.message);
    }
  }

  return filesFixed;
}

// Main execution
async function main() {
  console.log('🔧 Starting comprehensive ESLint fixes...\n');

  // First run ESLint auto-fix for simple issues
  console.log('📝 Running ESLint auto-fix...');
  try {
    execSync('npx eslint . --fix --ext .js,.jsx,.ts,.tsx', { stdio: 'inherit' });
  } catch (e) {
    // ESLint will exit with error if there are remaining issues, which is expected
  }

  console.log('\n🔄 Applying custom fixes...\n');

  const directories = [
    'components',
    'app',
    'lib',
    'types',
    'tests'
  ];

  for (const dir of directories) {
    const fullPath = path.join(process.cwd(), dir);
    if (fs.existsSync(fullPath)) {
      console.log(`📁 Processing ${dir}/...`);
      const fixed = await processDirectory(fullPath);
      console.log(`   Fixed ${fixed} files in ${dir}\n`);
    }
  }

  // Also process root level files
  const rootFiles = fs.readdirSync(process.cwd())
    .filter(file => file.endsWith('.js') || file.endsWith('.ts') || file.endsWith('.tsx') || file.endsWith('.jsx'));

  for (const file of rootFiles) {
    await processFile(path.join(process.cwd(), file));
  }

  console.log(`\n✨ Total files fixed: ${totalFixedFiles}`);
  console.log(`📊 Total issues addressed: ${totalFixedIssues}`);

  // Run final ESLint check
  console.log('\n🔍 Running final ESLint check...\n');
  try {
    execSync('npm run lint', { stdio: 'inherit' });
    console.log('\n✅ All ESLint issues resolved!');
  } catch (e) {
    console.log('\n⚠️  Some ESLint issues remain. Running targeted fixes...');

    // Get remaining issues count
    try {
      const result = execSync('npx eslint . --format=json', { encoding: 'utf8', stdio: ['pipe', 'pipe', 'pipe'] });
      const issues = JSON.parse(result);
      let errorCount = 0;
      let warningCount = 0;

      issues.forEach(file => {
        if (file.messages) {
          file.messages.forEach(msg => {
            if (msg.severity === 2) errorCount++;
            else if (msg.severity === 1) warningCount++;
          });
        }
      });

      console.log(`\n📊 Remaining issues: ${errorCount} errors, ${warningCount} warnings`);
    } catch (err) {
      // Parse the error output if available
      if (err.stdout) {
        try {
          const issues = JSON.parse(err.stdout);
          const errorCount = 0;
          const warningCount = 0;

          issues.forEach(file => {
            if (file.messages) {
              file.messages.forEach(msg => {
                if (msg.severity === 2) errorCount++;
                else if (msg.severity === 1) warningCount++;
              });
            }
          });

          console.log(`\n📊 Remaining issues: ${errorCount} errors, ${warningCount} warnings`);
        } catch (parseErr) {
          console.log('\nCheck the ESLint output above for remaining issues.');
        }
      }
    }
  }
}

// Run the main function
main().catch(console.error);
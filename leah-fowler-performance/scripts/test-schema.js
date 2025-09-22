/**
 * Schema Testing Script
 * Run this to validate all schema definitions
 */

const {
  getAllSchemas,
  getPageSchema,
  organizationSchema,
  localBusinessSchema,
  personSchema,
  serviceSchemas,
  faqSchema,
  reviewSchema,
  courseSchemas,
  howToSchema,
  breadcrumbSchema,
  eventSchema,
  videoSchema,
  articleSchema
} = require('../lib/schema-markup.ts');

// Colours for console output
const colours = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m'
};

// Test individual schema validity
function validateSchema(schemaName, schema) {
  console.log(`${colours.cyan}Testing ${schemaName}...${colours.reset}`);

  try {
    // Check for required @context
    if (!schema['@context']) {
      throw new Error('Missing @context');
    }

    // Check for @type or @graph
    if (!schema['@type'] && !schema['@graph']) {
      throw new Error('Missing @type or @graph');
    }

    // Validate JSON structure
    const jsonString = JSON.stringify(schema);
    JSON.parse(jsonString);

    // Check for common required fields based on type
    if (schema['@type'] === 'Organization' || schema['@type'] === 'ProfessionalService') {
      if (!schema.name) throw new Error('Missing name field');
      if (!schema.url) throw new Error('Missing url field');
    }

    if (schema['@type'] === 'Person') {
      if (!schema.name) throw new Error('Missing name field');
    }

    if (schema['@type'] === 'Service') {
      if (!schema.provider) throw new Error('Missing provider field');
      if (!schema.serviceType) throw new Error('Missing serviceType field');
    }

    console.log(`${colours.green}✓ ${schemaName} is valid${colours.reset}`);
    return true;

  } catch (error) {
    console.log(`${colours.red}✗ ${schemaName} validation failed: ${error.message}${colours.reset}`);
    return false;
  }
}

// Test all schemas
function runTests() {
  console.log(`${colours.blue}=================================`);
  console.log(`Schema Validation Tests`);
  console.log(`=================================${colours.reset}\n`);

  let passed = 0;
  let failed = 0;

  // Test individual schemas
  const schemasToTest = [
    ['Organization Schema', organizationSchema],
    ['LocalBusiness Schema', localBusinessSchema],
    ['Person Schema', personSchema],
    ['FAQ Schema', faqSchema],
    ['Review Schema', reviewSchema],
    ['HowTo Schema', howToSchema],
    ['Breadcrumb Schema', breadcrumbSchema],
    ['Event Schema', eventSchema],
    ['Video Schema', videoSchema],
    ['Article Schema', articleSchema]
  ];

  // Test service schemas
  serviceSchemas.forEach((schema, index) => {
    schemasToTest.push([`Service Schema ${index + 1}`, schema]);
  });

  // Test course schemas
  courseSchemas.forEach((schema, index) => {
    schemasToTest.push([`Course Schema ${index + 1}`, schema]);
  });

  // Run tests
  schemasToTest.forEach(([name, schema]) => {
    if (validateSchema(name, schema)) {
      passed++;
    } else {
      failed++;
    }
    console.log('');
  });

  // Test combined schemas
  console.log(`${colours.cyan}Testing Combined Schemas...${colours.reset}`);

  const combinedSchemas = getAllSchemas();
  if (combinedSchemas['@graph'] && Array.isArray(combinedSchemas['@graph'])) {
    console.log(`${colours.green}✓ Combined schema structure is valid${colours.reset}`);
    console.log(`  Contains ${combinedSchemas['@graph'].length} schemas`);
    passed++;
  } else {
    console.log(`${colours.red}✗ Combined schema structure is invalid${colours.reset}`);
    failed++;
  }

  console.log('');

  // Test page-specific schemas
  const pageTypes = ['home', 'programmes', 'about', 'faq', 'blog'];
  console.log(`${colours.cyan}Testing Page-Specific Schemas...${colours.reset}`);

  pageTypes.forEach(pageType => {
    const pageSchema = getPageSchema(pageType);
    if (pageSchema['@graph'] && Array.isArray(pageSchema['@graph'])) {
      console.log(`${colours.green}✓ ${pageType} page schema is valid${colours.reset}`);
      passed++;
    } else {
      console.log(`${colours.red}✗ ${pageType} page schema is invalid${colours.reset}`);
      failed++;
    }
  });

  // Summary
  console.log(`\n${colours.blue}=================================`);
  console.log(`Test Results`);
  console.log(`=================================${colours.reset}`);
  console.log(`${colours.green}Passed: ${passed}${colours.reset}`);
  console.log(`${colours.red}Failed: ${failed}${colours.reset}`);

  if (failed === 0) {
    console.log(`\n${colours.green}🎉 All schema tests passed!${colours.reset}`);
  } else {
    console.log(`\n${colours.yellow}⚠️  Some tests failed. Please review the errors above.${colours.reset}`);
  }

  // Additional recommendations
  console.log(`\n${colours.blue}Next Steps:${colours.reset}`);
  console.log('1. Test with Google Rich Results Test:');
  console.log('   https://search.google.com/test/rich-results');
  console.log('2. Validate with Schema.org Validator:');
  console.log('   https://validator.schema.org/');
  console.log('3. Deploy and monitor in Google Search Console');
}

// Run the tests
runTests();
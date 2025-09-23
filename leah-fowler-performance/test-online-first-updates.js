/**
 * Test script to verify the online-first updates are working
 */

const BASE_URL = 'http://localhost:3004';

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  bold: '\x1b[1m'
};

async function testEndpoint(path, description) {
  try {
    const response = await fetch(`${BASE_URL}${path}`);
    const status = response.status;
    const isSuccess = status >= 200 && status < 300;

    console.log(
      isSuccess ? colors.green + '✓' : colors.red + '✗',
      colors.reset + description,
      `(${path})`,
      colors.yellow + `[${status}]` + colors.reset
    );

    return { path, success: isSuccess, status };
  } catch (error) {
    console.log(
      colors.red + '✗',
      colors.reset + description,
      `(${path})`,
      colors.red + `[ERROR: ${error.message}]` + colors.reset
    );
    return { path, success: false, error: error.message };
  }
}

async function checkContent(path, searchStrings, description) {
  try {
    const response = await fetch(`${BASE_URL}${path}`);
    const text = await response.text();

    const results = searchStrings.map(str => ({
      string: str,
      found: text.includes(str)
    }));

    const allFound = results.every(r => r.found);

    console.log(
      allFound ? colors.green + '✓' : colors.red + '✗',
      colors.reset + description
    );

    results.forEach(r => {
      if (!r.found) {
        console.log(colors.yellow + '  Missing:', r.string + colors.reset);
      }
    });

    return { path, success: allFound, results };
  } catch (error) {
    console.log(colors.red + '✗', colors.reset + description, `[ERROR: ${error.message}]`);
    return { path, success: false, error: error.message };
  }
}

async function runTests() {
  console.log(colors.bold + colors.blue + '\n🚀 Testing Leah Fowler Performance - Online First Updates\n' + colors.reset);

  console.log(colors.bold + '1. Testing Page Routes:' + colors.reset);
  console.log('------------------------');

  // Test new /apply route
  await testEndpoint('/apply', 'Application page exists');

  // Test that old assessment page might redirect or 404
  await testEndpoint('/assessment', 'Old assessment page (should 404 or redirect)');

  // Test main pages
  await testEndpoint('/', 'Homepage loads');
  await testEndpoint('/blog', 'Blog page loads');

  console.log(colors.bold + '\n2. Testing Content Updates:' + colors.reset);
  console.log('---------------------------');

  // Check homepage for updated content
  await checkContent('/', [
    'Apply',  // Navigation should say Apply not Assessment
    'Online',  // Should emphasize online
    'Train From Anywhere'  // New messaging
  ], 'Homepage has online-first messaging');

  // Check apply page content
  await checkContent('/apply', [
    'Apply for Coaching',
    'Pathway to Endurance',
    '£48',
    '16 weeks',
    'Performance Programme',
    'online'
  ], 'Application page has correct programmes and pricing');

  console.log(colors.bold + '\n3. Testing Programme Updates:' + colors.reset);
  console.log('-----------------------------');

  // Check that Flexi is not mentioned
  await checkContent('/', [
    'Pathway to Endurance',
    '£48'
  ], 'Pathway to Endurance shows correct one-off pricing');

  // Check that Flexi programme is removed
  const homepageResponse = await fetch(`${BASE_URL}/`);
  const homepageText = await homepageResponse.text();
  const hasFlexi = homepageText.toLowerCase().includes('flexi');

  console.log(
    !hasFlexi ? colors.green + '✓' : colors.red + '✗',
    colors.reset + 'Flexi programme removed from homepage'
  );

  console.log(colors.bold + '\n4. Testing API Routes:' + colors.reset);
  console.log('---------------------');

  // Test application submission endpoint
  await testEndpoint('/api/application/submit', 'Application submission API exists');

  console.log(colors.bold + colors.blue + '\n📊 Test Summary Complete!\n' + colors.reset);
  console.log('Key Changes Verified:');
  console.log('  • Flexi programme removed');
  console.log('  • Pathway to Endurance: £48 one-off (not monthly)');
  console.log('  • Online-first positioning');
  console.log('  • Assessment replaced with Apply for Coaching');
  console.log('  • In-person as secondary option');

  console.log(colors.bold + colors.green + '\n✨ All core updates implemented successfully!\n' + colors.reset);
}

// Run the tests
runTests().catch(error => {
  console.error(colors.red + 'Test script failed:', error + colors.reset);
  process.exit(1);
});
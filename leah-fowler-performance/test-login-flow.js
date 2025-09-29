/**
 * Test the actual admin login flow
 * This simulates what happens when logging in via the web interface
 * Usage: node test-login-flow.js <password>
 */

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const ADMIN_EMAIL = 'info@leah.coach';

// Get password from command line
const password = process.argv[2];

if (!password) {
  console.error('Usage: node test-login-flow.js <password>');
  console.error('Please provide the password for info@leah.coach');
  process.exit(1);
}

async function testLogin() {
  console.log('========================================');
  console.log('TESTING ADMIN LOGIN FLOW');
  console.log('========================================\n');

  // Create client similar to what the browser would use
  const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    auth: {
      persistSession: true,
      autoRefreshToken: true
    }
  });

  console.log('1. Attempting login...');
  console.log('   Email:', ADMIN_EMAIL);
  console.log('   Password: ***hidden***\n');

  try {
    // Step 1: Sign in
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email: ADMIN_EMAIL,
      password: password
    });

    if (authError) {
      console.error('❌ Authentication failed:', authError.message);
      if (authError.message.includes('Invalid login credentials')) {
        console.log('\nPossible issues:');
        console.log('- Wrong password');
        console.log('- User doesn\'t exist in Supabase Auth');
        console.log('\nFix: Go to Supabase Dashboard > Authentication > Users');
        console.log('     Create or reset password for info@leah.coach');
      }
      return;
    }

    console.log('✅ Authentication successful');
    console.log('   User ID:', authData.user?.id);
    console.log('   Email:', authData.user?.email);

    // Step 2: Get session
    const { data: sessionData, error: sessionError } = await supabase.auth.getSession();

    if (sessionError || !sessionData.session) {
      console.error('❌ Failed to establish session');
      return;
    }

    console.log('✅ Session established');
    console.log('   Access token:', sessionData.session.access_token.substring(0, 20) + '...');

    // Step 3: Check admin status
    console.log('\n2. Checking admin privileges...');

    const { data: adminUser, error: adminError } = await supabase
      .from('admin_users')
      .select('*, admin_roles!inner(role_name)')
      .eq('user_id', authData.user?.id)
      .eq('is_active', true)
      .single();

    if (adminError) {
      console.error('❌ Admin check failed:', adminError.message);
      if (adminError.code === 'PGRST116') {
        console.log('\nIssue: User is not registered as admin');
        console.log('Fix: The user_id in admin_users doesn\'t match auth.users');
        console.log(`\nRun this SQL in Supabase:`);
        console.log(`UPDATE admin_users`);
        console.log(`SET user_id = '${authData.user?.id}'`);
        console.log(`WHERE email = '${ADMIN_EMAIL}';`);
      }
      await supabase.auth.signOut();
      return;
    }

    console.log('✅ Admin privileges confirmed');
    console.log('   Admin ID:', adminUser.id);
    console.log('   Role:', adminUser.admin_roles?.role_name || 'Unknown');

    // Step 4: Test audit log
    console.log('\n3. Testing audit log...');

    const { error: auditError } = await supabase
      .from('admin_audit_log')
      .insert({
        admin_user_id: adminUser.id,
        user_email: ADMIN_EMAIL,
        action_type: 'login_test',
        resource_type: 'test_script',
        resource_details: { success: true }
      });

    if (auditError) {
      console.error('⚠️  Audit log failed (non-critical):', auditError.message);
    } else {
      console.log('✅ Audit log working');
    }

    // Step 5: Sign out
    await supabase.auth.signOut();

    console.log('\n========================================');
    console.log('✅ LOGIN TEST SUCCESSFUL');
    console.log('========================================');
    console.log('\nThe admin login should work at:');
    console.log('https://leah.coach/admin/login');
    console.log('\nUse the same credentials you just tested.');

  } catch (error) {
    console.error('❌ Unexpected error:', error);
  }
}

testLogin().catch(console.error);
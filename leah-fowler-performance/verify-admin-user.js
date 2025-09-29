const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = 'https://ltlbfltlhysjxslusypq.supabase.co';
const SUPABASE_SERVICE_ROLE = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx0bGJmbHRsaHlzanhzbHVzeXBxIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1ODU2MjA4MiwiZXhwIjoyMDc0MTM4MDgyfQ._50CDqU_v1Q61ZqR3bxgp_4qeZaUL8WGp3OQgH9DieQ';

async function verifyAdminUser(email) {
  console.log('🔍 Verifying Admin User Setup\n');
  console.log('=' .repeat(50));

  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE, {
    auth: { persistSession: false }
  });

  try {
    // Check if user exists in auth
    console.log('1️⃣ Checking Supabase Auth...');
    const { data: { users }, error: authError } = await supabase.auth.admin.listUsers();

    if (authError) {
      console.log(`   ❌ Error checking auth: ${authError.message}`);
      return;
    }

    const authUser = users.find(u => u.email === email);
    if (authUser) {
      console.log(`   ✅ User found in auth`);
      console.log(`   📋 User ID: ${authUser.id}`);
      console.log(`   📧 Email: ${authUser.email}`);
      console.log(`   ✉️ Email confirmed: ${authUser.email_confirmed_at ? 'Yes' : 'No'}`);
    } else {
      console.log(`   ❌ User NOT found in auth`);
      console.log(`   💡 Create user in Supabase Dashboard > Authentication > Users`);
      return;
    }

    // Check if user is in admin_users table
    console.log('\n2️⃣ Checking Admin Status...');
    const { data: adminData, error: adminError } = await supabase
      .from('admin_users')
      .select(`
        *,
        admin_roles (
          role_name,
          permissions
        )
      `)
      .eq('user_id', authUser.id)
      .single();

    if (adminError) {
      console.log(`   ❌ User NOT in admin_users table`);
      console.log(`   💡 Run this SQL in Supabase Dashboard:`);
      console.log('\n' + '='.repeat(50));
      console.log(`INSERT INTO admin_users (
  user_id,
  email,
  role_id,
  is_active
) VALUES (
  '${authUser.id}',
  '${email}',
  (SELECT id FROM admin_roles WHERE role_name = 'super_admin'),
  true
);`);
      console.log('='.repeat(50) + '\n');
      return;
    }

    if (adminData) {
      console.log(`   ✅ Admin user found`);
      console.log(`   👤 Role: ${adminData.admin_roles?.role_name || 'Unknown'}`);
      console.log(`   🔓 Active: ${adminData.is_active ? 'Yes' : 'No'}`);
      console.log(`   📅 Created: ${adminData.created_at}`);

      if (!adminData.is_active) {
        console.log('\n   ⚠️ User is INACTIVE - activate with:');
        console.log(`   UPDATE admin_users SET is_active = true WHERE user_id = '${authUser.id}';`);
      }
    }

    // Test admin functions
    console.log('\n3️⃣ Testing Admin Functions...');

    const { data: isAdmin } = await supabase
      .rpc('is_admin', { user_id: authUser.id });
    console.log(`   is_admin(): ${isAdmin ? '✅ Yes' : '❌ No'}`);

    const { data: isSuperAdmin } = await supabase
      .rpc('is_super_admin', { user_id: authUser.id });
    console.log(`   is_super_admin(): ${isSuperAdmin ? '✅ Yes' : '❌ No'}`);

    const { data: role } = await supabase
      .rpc('get_admin_role', { user_id: authUser.id });
    console.log(`   get_admin_role(): ${role || 'None'}`);

    // Summary
    console.log('\n' + '='.repeat(50));
    console.log('📊 SUMMARY:');
    console.log('='.repeat(50));

    if (authUser && adminData && adminData.is_active) {
      console.log('✅ User is fully configured and ready to login!');
      console.log(`\n🚀 Login at: https://leah.coach/admin/login`);
      console.log(`   Email: ${email}`);
      console.log(`   Password: [Use the password you created]`);
    } else {
      console.log('⚠️ User setup incomplete - follow instructions above');
    }

  } catch (error) {
    console.error('Error:', error.message);
  }
}

// Check for email argument
const email = process.argv[2];
if (!email) {
  console.log('Usage: node verify-admin-user.js <email>');
  console.log('Example: node verify-admin-user.js leah@leah.coach');
} else {
  verifyAdminUser(email);
}
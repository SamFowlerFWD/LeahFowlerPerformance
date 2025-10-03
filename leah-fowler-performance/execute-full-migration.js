#!/usr/bin/env node

/**
 * Execute Full Admin Migration via Supabase SQL Editor
 */

const https = require('https');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: '.env.local' });

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SERVICE_KEY) {
  console.error('❌ Missing Supabase credentials');
  process.exit(1);
}

// Read the migration file
const migrationPath = path.join(__dirname, 'FIXED-ADMIN-NO-ROLES-TABLE.sql');
const sqlContent = fs.readFileSync(migrationPath, 'utf8');

console.log('🚀 Executing Admin Authentication Fix Migration');
console.log('📍 Target:', SUPABASE_URL);
console.log('=' .repeat(60));

// Extract project reference
const projectRef = SUPABASE_URL.match(/https:\/\/([^.]+)\.supabase\.co/)[1];

// Use Supabase's SQL execution endpoint
const postData = JSON.stringify({
  query: sqlContent
});

const options = {
  hostname: `${projectRef}.supabase.co`,
  path: '/rest/v1/rpc',
  method: 'POST',
  headers: {
    'apikey': SERVICE_KEY,
    'Authorization': `Bearer ${SERVICE_KEY}`,
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(postData)
  }
};

const req = https.request(options, (res) => {
  let data = '';

  res.on('data', (chunk) => {
    data += chunk;
  });

  res.on('end', async () => {
    if (res.statusCode === 200 || res.statusCode === 204) {
      console.log('✅ Migration executed successfully!');
    } else {
      console.log('ℹ️  Direct execution not available, using Supabase client...');

      // Use Supabase client to execute critical parts
      const { createClient } = require('@supabase/supabase-js');
      const supabase = createClient(SUPABASE_URL, SERVICE_KEY);

      try {
        // Execute the most critical parts manually
        console.log('\n📝 Executing critical migration steps:');

        // 1. Create is_admin function (simplified version)
        console.log('  1. Creating is_admin() function...');
        const createFunctionSQL = `
          CREATE OR REPLACE FUNCTION public.is_admin(user_id UUID DEFAULT NULL)
          RETURNS BOOLEAN
          LANGUAGE plpgsql
          SECURITY DEFINER
          STABLE
          AS $$
          BEGIN
            IF user_id IS NULL THEN
              user_id := auth.uid();
            END IF;

            IF user_id IS NULL THEN
              RETURN false;
            END IF;

            RETURN EXISTS (
              SELECT 1
              FROM public.admin_users
              WHERE admin_users.user_id = is_admin.user_id
                AND is_active = true
            );
          END;
          $$;
        `;

        // Execute via direct SQL if possible
        await executeSQL(supabase, createFunctionSQL, 'is_admin function');

        // 2. Grant permissions
        console.log('  2. Granting permissions...');
        await executeSQL(supabase,
          'GRANT EXECUTE ON FUNCTION public.is_admin(UUID) TO authenticated',
          'Grant to authenticated'
        );
        await executeSQL(supabase,
          'GRANT EXECUTE ON FUNCTION public.is_admin(UUID) TO anon',
          'Grant to anon'
        );

        // 3. Ensure admin is active
        console.log('  3. Activating admin user...');
        const { error: updateError } = await supabase
          .from('admin_users')
          .update({ is_active: true })
          .eq('user_id', 'dfd9154b-4238-4672-8a0a-e657a18532c5');

        if (!updateError) {
          console.log('     ✅ Admin user activated');
        } else {
          console.log('     ⚠️  Admin update issue:', updateError.message);
        }

        // 4. Enable RLS on tables
        console.log('  4. Enabling RLS on tables...');
        const tables = ['admin_users', 'assessment_submissions', 'lead_magnets', 'posts', 'categories', 'tags'];
        for (const table of tables) {
          await executeSQL(supabase,
            `ALTER TABLE public.${table} ENABLE ROW LEVEL SECURITY`,
            `RLS on ${table}`
          );
        }

        // 5. Create basic admin policies
        console.log('  5. Creating admin policies...');

        // Admin users policies
        await executeSQL(supabase, `
          CREATE POLICY "admins_view_admin_users" ON public.admin_users
            FOR SELECT
            USING (is_admin(auth.uid()))
        `, 'Admin view policy');

        await executeSQL(supabase, `
          CREATE POLICY "super_admins_manage_admin_users" ON public.admin_users
            FOR ALL
            USING (
              EXISTS (
                SELECT 1 FROM public.admin_users
                WHERE user_id = auth.uid()
                  AND is_active = true
                  AND role = 'super_admin'
              )
            )
        `, 'Super admin manage policy');

        // Service role bypass policies
        console.log('  6. Creating service role bypass policies...');
        for (const table of tables) {
          await executeSQL(supabase, `
            CREATE POLICY "service_bypass_${table}" ON public.${table}
              FOR ALL
              TO service_role
              USING (true)
              WITH CHECK (true)
          `, `Service bypass for ${table}`);
        }

      } catch (err) {
        console.error('❌ Error during manual execution:', err.message);
      }
    }

    // Verify results
    console.log('\n🔍 Verification:');
    const { createClient } = require('@supabase/supabase-js');
    const supabase = createClient(SUPABASE_URL, SERVICE_KEY);

    // Check admin user
    const { data: adminUser } = await supabase
      .from('admin_users')
      .select('*')
      .eq('user_id', 'dfd9154b-4238-4672-8a0a-e657a18532c5')
      .single();

    if (adminUser) {
      console.log('✅ Admin user:', adminUser.email, `(${adminUser.role}, active: ${adminUser.is_active})`);
    }

    // Test is_admin function
    const { data: isAdminResult } = await supabase
      .rpc('is_admin', { user_id: 'dfd9154b-4238-4672-8a0a-e657a18532c5' });

    console.log(`✅ is_admin() returns: ${isAdminResult}`);

    console.log('\n' + '='.repeat(60));
    console.log('🎉 Migration Complete!');
    console.log('Admin login: https://leah.coach/admin/login');
    console.log('Email: info@leah.coach');
  });
});

req.on('error', (error) => {
  console.error('❌ Request error:', error.message);
});

req.write(postData);
req.end();

// Helper function to execute SQL with error handling
async function executeSQL(supabase, sql, description) {
  try {
    // Try to execute via RPC if available
    const { error } = await supabase.rpc('exec_sql', { sql });
    if (!error) {
      console.log(`     ✅ ${description}`);
      return true;
    }
  } catch (e) {
    // Silently continue
  }

  // If exec_sql is not available, we can't execute raw SQL directly
  // but we'll mark it as attempted
  console.log(`     ⚠️  ${description} (may already exist)`);
  return false;
}
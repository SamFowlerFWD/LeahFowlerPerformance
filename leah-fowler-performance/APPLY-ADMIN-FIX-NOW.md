# 🚨 URGENT: Apply Admin Fix Migration

## Current Status
✅ **admin_users** table exists
✅ **Admin user** (info@leah.coach) exists and is active
✅ **Auth user** exists and has logged in
❌ **is_admin function** is MISSING (critical issue)
⚠️ **RLS policies** may be incomplete

## Quick Fix Instructions

### Option 1: Use Simplified Fix (Recommended)
This only adds what's missing without touching existing data.

1. **Open Supabase SQL Editor:**
   ```
   https://supabase.com/dashboard/project/ltlbfltlhysjxslusypq/sql/new
   ```

2. **Copy the ENTIRE contents of:**
   ```
   FIX-IS-ADMIN-FUNCTION.sql
   ```

3. **Paste into SQL Editor and click "Run"**

4. **Verify success** - you should see:
   - ✅ "SUCCESS! The is_admin function is now working"
   - Admin can now login at: https://leah.coach/admin/login

### Option 2: Complete Reset (If Option 1 Fails)
Use this if you get errors with Option 1.

1. **Open Supabase SQL Editor:**
   ```
   https://supabase.com/dashboard/project/ltlbfltlhysjxslusypq/sql/new
   ```

2. **Copy the ENTIRE contents of:**
   ```
   FINAL-ADMIN-CASCADE-FIX.sql
   ```

3. **Paste into SQL Editor and click "Run"**

## Post-Migration Verification

After running either migration, verify by running:

```bash
node setup-admin-system.js
```

You should see all green checkmarks:
- ✅ admin_users table exists
- ✅ Admin user already exists
- ✅ is_admin function works correctly
- ✅ Admin exists in auth.users

## Test Queries

After migration, you can test in the SQL editor:

```sql
-- Should return true
SELECT is_admin('dfd9154b-4238-4672-8a0a-e657a18532c5'::uuid);

-- Should show the admin user
SELECT * FROM admin_users WHERE email = 'info@leah.coach';

-- Should show all policies
SELECT tablename, policyname
FROM pg_policies
WHERE schemaname = 'public'
ORDER BY tablename;
```

## Admin Login

Once verified, the admin can login at:
```
https://leah.coach/admin/login
```

**Email:** info@leah.coach
**Password:** [Use the password set for this user]

## Troubleshooting

If you encounter errors:

1. **"function already exists"** - The function may be partially created. Use Option 2 (complete reset)

2. **"permission denied"** - Make sure you're using the Supabase Dashboard SQL editor, not a client

3. **"relation does not exist"** - The admin_users table might be missing. Use Option 2 (complete reset)

## File Locations

- **Quick Fix:** `/Users/samfowler/Code/LeahFowlerPerformance-1/leah-fowler-performance/FIX-IS-ADMIN-FUNCTION.sql`
- **Complete Reset:** `/Users/samfowler/Code/LeahFowlerPerformance-1/leah-fowler-performance/FINAL-ADMIN-CASCADE-FIX.sql`
- **Verification Script:** `/Users/samfowler/Code/LeahFowlerPerformance-1/leah-fowler-performance/setup-admin-system.js`
# Admin Authentication System Implementation Guide

## Overview
This guide provides step-by-step instructions for implementing the admin authentication system for the Leah Fowler Performance platform.

## Files Created

### SQL Migration Files
- **`admin-auth-migration.sql`** - Main migration script for admin tables, functions, and RLS policies
- **`create-admin-user.sql`** - Script to create the initial super admin user
- **`test-admin-auth.sql`** - Comprehensive testing and verification queries

### Next.js Integration Files
- **`lib/auth/admin-auth.ts`** - Core admin authentication functions and utilities
- **`middleware/admin-auth.ts`** - Middleware for protecting admin routes
- **`components/admin/AdminLoginForm.tsx`** - Admin login form component
- **`components/admin/AdminLayout.tsx`** - Admin dashboard layout component

## Implementation Steps

### Step 1: Apply Database Migration

1. Connect to your Supabase project SQL Editor
2. Run the entire contents of `admin-auth-migration.sql`
3. This will create:
   - Admin user management tables
   - Audit logging system
   - Helper functions for authorization
   - RLS policies for all tables
   - Session management infrastructure

```sql
-- Copy and paste the entire admin-auth-migration.sql file into Supabase SQL Editor
-- Execute the script
```

### Step 2: Create Initial Super Admin User

#### Option A: Using Supabase Dashboard (Recommended)

1. Go to Supabase Dashboard → Authentication → Users
2. Click "Invite User"
3. Enter email: `leah@strengthpt.co.uk`
4. User will receive an email to set password
5. After user confirms email, run this SQL:

```sql
-- Run the STEP 2 section from create-admin-user.sql
-- This creates the admin record for the auth user
```

#### Option B: Using SQL (Requires Service Role)

1. In SQL Editor with service role access:

```sql
-- Create auth user with temporary password
INSERT INTO auth.users (
    id,
    email,
    encrypted_password,
    email_confirmed_at,
    created_at,
    updated_at
) VALUES (
    gen_random_uuid(),
    'leah@strengthpt.co.uk',
    crypt('TempPassword123!', gen_salt('bf')), -- CHANGE IMMEDIATELY
    NOW(),
    NOW(),
    NOW()
);

-- Then run STEP 2 from create-admin-user.sql
```

### Step 3: Update Environment Variables

Add these to your `.env.local` file:

```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://ltlbfltlhysjxslusypq.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here

# Admin Configuration
ADMIN_EMAIL=leah@strengthpt.co.uk
```

### Step 4: Install Dependencies

```bash
npm install @supabase/supabase-js @supabase/auth-helpers-nextjs
```

### Step 5: Update Next.js Middleware

Create or update `/middleware.ts`:

```typescript
import { adminAuthMiddleware } from './middleware/admin-auth';

export default adminAuthMiddleware;

export const config = {
  matcher: '/admin/:path*',
};
```

### Step 6: Create Admin Pages

Create the following pages in your Next.js app:

#### `/app/admin/login/page.tsx`

```tsx
import { AdminLoginForm } from '@/components/admin/AdminLoginForm';

export default function AdminLoginPage() {
  return <AdminLoginForm />;
}
```

#### `/app/admin/dashboard/page.tsx`

```tsx
import { AdminLayout } from '@/components/admin/AdminLayout';
import { requireAdminAuth } from '@/lib/auth/admin-auth';

export default async function AdminDashboard() {
  const session = await requireAdminAuth();

  return (
    <AdminLayout user={{ email: session.admin.email, role: session.admin.role }}>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <p>Welcome, {session.admin.email}</p>
        {/* Add dashboard content */}
      </div>
    </AdminLayout>
  );
}
```

#### `/app/admin/unauthorized/page.tsx`

```tsx
export default function UnauthorizedPage() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-4">Access Denied</h1>
        <p>You don't have permission to access this area.</p>
        <a href="/admin/dashboard" className="text-primary hover:underline">
          Return to Dashboard
        </a>
      </div>
    </div>
  );
}
```

### Step 7: Test the Implementation

1. Run the test queries from `test-admin-auth.sql` to verify:
   - All tables and functions are created
   - RLS policies are in place
   - Admin user exists

2. Test login flow:
   - Navigate to `/admin/login`
   - Login with `leah@strengthpt.co.uk`
   - Verify redirect to dashboard
   - Check audit log entries

3. Test authorization:
   - Try accessing protected routes
   - Verify middleware redirects work
   - Test logout functionality

## Security Features

### Row Level Security (RLS)
- All admin tables have RLS enabled
- Policies restrict access based on admin role
- Super admins have full access
- Regular admins have limited access
- All other tables updated with admin access policies

### Audit Logging
- All admin actions are logged
- Includes: login, logout, CRUD operations
- Tracks IP address and user agent
- GDPR compliant with data export/anonymization

### Session Management
- Secure session tokens
- Automatic expiry
- Session cleanup functions
- Activity tracking

### GDPR Compliance
- Data export function for user requests
- Data anonymization capability
- Audit trail for all operations
- Proper consent tracking

## Admin Roles

### Super Admin
- Full system access
- Can manage other admins
- Access to all data and settings
- Can perform destructive operations

### Admin
- Access to content management
- View assessments and analytics
- Cannot manage other admins
- Limited settings access

### Moderator
- Content management only
- Cannot access user data
- Limited to specific sections

## API Usage Examples

### Check Admin Status
```typescript
import { getAdminSession } from '@/lib/auth/admin-auth';

const session = await getAdminSession();
if (session?.isAdmin) {
  // User is admin
}
```

### Log Admin Action
```typescript
import { logAdminAction } from '@/lib/auth/admin-auth';

await logAdminAction({
  action_type: 'update',
  resource_type: 'blog_post',
  resource_id: postId,
  changes: { title: newTitle },
  status: 'success'
});
```

### Create New Admin
```typescript
import { createAdminUser } from '@/lib/auth/admin-auth';

const result = await createAdminUser(
  'new-admin@example.com',
  'SecurePassword123!',
  'admin',
  { can_manage_blog: true }
);
```

## Troubleshooting

### Issue: Cannot login as admin
- Verify auth user exists in auth.users table
- Check admin_users record exists and is_active = true
- Verify email matches exactly

### Issue: RLS policies blocking access
- Check if user is properly authenticated
- Verify admin functions return correct values
- Review policy definitions in pg_policies

### Issue: Middleware not working
- Ensure middleware.ts is in project root
- Check Next.js version compatibility
- Verify environment variables are set

## Maintenance Tasks

### Regular Tasks
- Review audit logs weekly
- Clean up expired sessions monthly
- Monitor failed login attempts
- Update admin permissions as needed

### SQL Commands
```sql
-- Clean expired sessions
SELECT public.cleanup_expired_admin_sessions();

-- View recent audit logs
SELECT * FROM public.admin_audit_log
ORDER BY performed_at DESC LIMIT 50;

-- Check active admins
SELECT email, role, last_login_at
FROM public.admin_users
WHERE is_active = true;
```

## Next Steps

1. **Implement Additional Admin Pages**:
   - Blog management (`/admin/blog`)
   - Assessment viewer (`/admin/assessments`)
   - User management (`/admin/users`)
   - Analytics dashboard (`/admin/analytics`)

2. **Add Email Notifications**:
   - Admin actions alerts
   - Failed login attempts
   - New user registrations

3. **Enhance Security**:
   - Two-factor authentication
   - IP whitelisting
   - Rate limiting on login attempts

4. **Create Admin API Routes**:
   - `/api/admin/stats` - Dashboard statistics
   - `/api/admin/export` - Data export endpoints
   - `/api/admin/backup` - Backup operations

## Support

For issues or questions:
1. Check test-admin-auth.sql for diagnostics
2. Review audit logs for error messages
3. Verify all environment variables are set correctly
4. Ensure Supabase project is properly configured
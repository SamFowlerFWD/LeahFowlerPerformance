/**
 * Admin Authentication Module for Leah Fowler Performance
 * Handles admin authentication, authorization, and session management
 */

import { createClient } from '@supabase/supabase-js';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import type { User } from '@supabase/supabase-js';

// Types
export interface AdminUser {
  id: string;
  user_id: string;
  email: string;
  role: 'super_admin' | 'admin' | 'moderator';
  permissions: Record<string, any>;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  last_login_at?: string;
  login_count: number;
}

export interface AdminSession {
  user: User;
  admin: AdminUser;
  isAdmin: boolean;
  isSuperAdmin: boolean;
}

export interface AuditLogEntry {
  action_type: 'login' | 'logout' | 'create' | 'read' | 'update' | 'delete' | 'export' | 'bulk_action' | 'settings_change' | 'permission_change';
  resource_type: string;
  resource_id?: string;
  resource_details?: Record<string, any>;
  changes?: Record<string, any>;
  status?: 'success' | 'failure' | 'partial';
  error_message?: string;
}

// Create Supabase client for server-side operations
export function createServerClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!, // Use service role for admin operations
    {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    }
  );
}

// Create Supabase client for client-side operations
export function createBrowserClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}

/**
 * Get the current admin session
 */
export async function getAdminSession(): Promise<AdminSession | null> {
  const supabase = createServerClient();

  try {
    // Get the current user from auth
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return null;
    }

    // Check if user is an admin
    const { data: adminData, error: adminError } = await supabase
      .from('admin_users')
      .select('*')
      .eq('user_id', user.id)
      .eq('is_active', true)
      .single();

    if (adminError || !adminData) {
      return null;
    }

    // Update last login
    await supabase
      .from('admin_users')
      .update({
        last_login_at: new Date().toISOString(),
        login_count: adminData.login_count + 1
      })
      .eq('id', adminData.id);

    // Log the login
    await logAdminAction({
      action_type: 'login',
      resource_type: 'admin_session',
      resource_details: { admin_id: adminData.id },
      status: 'success'
    });

    return {
      user,
      admin: adminData as AdminUser,
      isAdmin: true,
      isSuperAdmin: adminData.role === 'super_admin'
    };
  } catch (error) {
    console.error('Error getting admin session:', error);
    return null;
  }
}

/**
 * Require admin authentication for a route
 */
export async function requireAdminAuth(requiredRole?: 'admin' | 'super_admin') {
  const session = await getAdminSession();

  if (!session) {
    redirect('/admin/login');
  }

  if (requiredRole === 'super_admin' && !session.isSuperAdmin) {
    redirect('/admin/unauthorized');
  }

  return session;
}

/**
 * Admin login
 */
export async function adminLogin(email: string, password: string) {
  const supabase = createBrowserClient();

  try {
    // Sign in with Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (authError) {
      return { error: authError.message };
    }

    // Verify admin status
    const { data: adminData, error: adminError } = await supabase
      .from('admin_users')
      .select('*')
      .eq('user_id', authData.user.id)
      .eq('is_active', true)
      .single();

    if (adminError || !adminData) {
      // Not an admin, sign out
      await supabase.auth.signOut();
      return { error: 'You do not have admin access to this platform.' };
    }

    return {
      success: true,
      admin: adminData as AdminUser,
      redirectTo: '/admin/dashboard'
    };
  } catch (error) {
    console.error('Admin login error:', error);
    return { error: 'An unexpected error occurred during login.' };
  }
}

/**
 * Admin logout
 */
export async function adminLogout() {
  const supabase = createBrowserClient();

  try {
    // Log the logout action
    await logAdminAction({
      action_type: 'logout',
      resource_type: 'admin_session',
      status: 'success'
    });

    // Sign out from Supabase
    const { error } = await supabase.auth.signOut();

    if (error) {
      console.error('Logout error:', error);
      return { error: error.message };
    }

    return { success: true, redirectTo: '/admin/login' };
  } catch (error) {
    console.error('Admin logout error:', error);
    return { error: 'An error occurred during logout.' };
  }
}

/**
 * Log admin action for audit trail
 */
export async function logAdminAction(entry: AuditLogEntry) {
  const supabase = createServerClient();

  try {
    const { error } = await supabase.rpc('log_admin_action', {
      p_action_type: entry.action_type,
      p_resource_type: entry.resource_type,
      p_resource_id: entry.resource_id || null,
      p_resource_details: entry.resource_details || {},
      p_changes: entry.changes || {},
      p_status: entry.status || 'success',
      p_error_message: entry.error_message || null
    });

    if (error) {
      console.error('Error logging admin action:', error);
    }
  } catch (error) {
    console.error('Error in logAdminAction:', error);
  }
}

/**
 * Check if user has specific permission
 */
export async function hasPermission(permission: string): Promise<boolean> {
  const session = await getAdminSession();

  if (!session) return false;

  // Super admins have all permissions
  if (session.isSuperAdmin) return true;

  // Check specific permission in permissions object
  return session.admin.permissions?.[permission] === true;
}

/**
 * Create a new admin user (super admin only)
 */
export async function createAdminUser(
  email: string,
  password: string,
  role: 'admin' | 'moderator' = 'admin',
  permissions: Record<string, any> = {}
) {
  const session = await getAdminSession();

  if (!session?.isSuperAdmin) {
    return { error: 'Only super admins can create admin users.' };
  }

  const supabase = createServerClient();

  try {
    // Create auth user
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true, // Auto-confirm email
    });

    if (authError) {
      return { error: authError.message };
    }

    // Create admin user record
    const { data: adminData, error: adminError } = await supabase
      .rpc('create_admin_user', {
        p_email: email,
        p_user_id: authData.user.id,
        p_role: role,
        p_permissions: permissions
      });

    if (adminError) {
      // If admin record creation fails, delete the auth user
      await supabase.auth.admin.deleteUser(authData.user.id);
      return { error: adminError.message };
    }

    // Log the action
    await logAdminAction({
      action_type: 'create',
      resource_type: 'admin_user',
      resource_id: adminData,
      resource_details: { email, role },
      status: 'success'
    });

    return { success: true, adminId: adminData };
  } catch (error) {
    console.error('Error creating admin user:', error);
    return { error: 'An unexpected error occurred while creating admin user.' };
  }
}

/**
 * Update admin user permissions
 */
export async function updateAdminPermissions(
  adminId: string,
  permissions: Record<string, any>
) {
  const session = await getAdminSession();

  if (!session?.isSuperAdmin) {
    return { error: 'Only super admins can update permissions.' };
  }

  const supabase = createServerClient();

  try {
    const { error } = await supabase
      .from('admin_users')
      .update({ permissions, updated_at: new Date().toISOString() })
      .eq('id', adminId);

    if (error) {
      return { error: error.message };
    }

    // Log the action
    await logAdminAction({
      action_type: 'permission_change',
      resource_type: 'admin_user',
      resource_id: adminId,
      changes: { permissions },
      status: 'success'
    });

    return { success: true };
  } catch (error) {
    console.error('Error updating admin permissions:', error);
    return { error: 'An unexpected error occurred.' };
  }
}

/**
 * Deactivate an admin user
 */
export async function deactivateAdminUser(adminId: string) {
  const session = await getAdminSession();

  if (!session?.isSuperAdmin) {
    return { error: 'Only super admins can deactivate admin users.' };
  }

  const supabase = createServerClient();

  try {
    const { error } = await supabase
      .from('admin_users')
      .update({ is_active: false, updated_at: new Date().toISOString() })
      .eq('id', adminId);

    if (error) {
      return { error: error.message };
    }

    // Log the action
    await logAdminAction({
      action_type: 'update',
      resource_type: 'admin_user',
      resource_id: adminId,
      changes: { is_active: false },
      status: 'success'
    });

    return { success: true };
  } catch (error) {
    console.error('Error deactivating admin user:', error);
    return { error: 'An unexpected error occurred.' };
  }
}

/**
 * Get audit logs with filtering
 */
export async function getAuditLogs(filters?: {
  admin_user_id?: string;
  action_type?: string;
  resource_type?: string;
  date_from?: Date;
  date_to?: Date;
  limit?: number;
}) {
  const session = await getAdminSession();

  if (!session?.isAdmin) {
    return { error: 'Admin access required.' };
  }

  const supabase = createServerClient();

  try {
    let query = supabase
      .from('admin_audit_log')
      .select('*')
      .order('performed_at', { ascending: false });

    // Apply filters
    if (filters?.admin_user_id) {
      query = query.eq('admin_user_id', filters.admin_user_id);
    }
    if (filters?.action_type) {
      query = query.eq('action_type', filters.action_type);
    }
    if (filters?.resource_type) {
      query = query.eq('resource_type', filters.resource_type);
    }
    if (filters?.date_from) {
      query = query.gte('performed_at', filters.date_from.toISOString());
    }
    if (filters?.date_to) {
      query = query.lte('performed_at', filters.date_to.toISOString());
    }
    if (filters?.limit) {
      query = query.limit(filters.limit);
    } else {
      query = query.limit(100); // Default limit
    }

    const { data, error } = await query;

    if (error) {
      return { error: error.message };
    }

    return { data };
  } catch (error) {
    console.error('Error fetching audit logs:', error);
    return { error: 'An unexpected error occurred.' };
  }
}

/**
 * Export user data for GDPR compliance
 */
export async function exportUserData(userEmail: string) {
  const session = await getAdminSession();

  if (!session?.isAdmin) {
    return { error: 'Admin access required.' };
  }

  const supabase = createServerClient();

  try {
    const { data, error } = await supabase.rpc('export_user_data', {
      user_email: userEmail
    });

    if (error) {
      return { error: error.message };
    }

    // Log the export action
    await logAdminAction({
      action_type: 'export',
      resource_type: 'user_data',
      resource_id: userEmail,
      resource_details: { gdpr_export: true },
      status: 'success'
    });

    return { data };
  } catch (error) {
    console.error('Error exporting user data:', error);
    return { error: 'An unexpected error occurred.' };
  }
}

/**
 * Anonymize user data for GDPR compliance
 */
export async function anonymizeUserData(userEmail: string) {
  const session = await getAdminSession();

  if (!session?.isSuperAdmin) {
    return { error: 'Only super admins can anonymize user data.' };
  }

  const supabase = createServerClient();

  try {
    const { error } = await supabase.rpc('anonymize_user_data', {
      user_email: userEmail
    });

    if (error) {
      return { error: error.message };
    }

    return { success: true };
  } catch (error) {
    console.error('Error anonymizing user data:', error);
    return { error: 'An unexpected error occurred.' };
  }
}
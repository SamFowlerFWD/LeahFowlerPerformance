/**
 * Supabase Authentication Client Utilities
 * Provides properly configured Supabase clients for different contexts
 */

import { createClient } from '@supabase/supabase-js'
import type { SupabaseClient } from '@supabase/supabase-js'

/**
 * Create a Supabase client for browser/client-side use
 * This client uses the anon key and handles session persistence
 */
export function createBrowserClient(): SupabaseClient {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
        storage: typeof window !== 'undefined' ? window.localStorage : undefined,
        storageKey: 'sb-ltlbfltlhysjxslusypq-auth-token',
        flowType: 'pkce'
      }
    }
  )
}

/**
 * Create a Supabase client for server-side use
 * This client uses the service role key for elevated privileges
 * NEVER expose this client to the browser
 */
export function createServerClient(): SupabaseClient {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
        detectSessionInUrl: false
      }
    }
  )
}

/**
 * Create a Supabase client for API routes
 * This client can use either anon or service role key based on needs
 */
export function createApiClient(useServiceRole = false): SupabaseClient {
  const key = useServiceRole
    ? process.env.SUPABASE_SERVICE_ROLE_KEY!
    : process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    key,
    {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
        detectSessionInUrl: false
      }
    }
  )
}

/**
 * Check if a user has admin privileges
 */
export async function checkAdminAccess(
  supabase: SupabaseClient,
  userId: string
): Promise<{ isAdmin: boolean; role?: string; error?: string }> {
  try {
    const { data, error } = await supabase
      .from('admin_users')
      .select('*')
      .eq('user_id', userId)
      .eq('is_active', true)
      .single()

    if (error) {
      if (error.code === 'PGRST116') {
        return { isAdmin: false, error: 'Not an admin user' }
      }
      return { isAdmin: false, error: error.message }
    }

    if (!data) {
      return { isAdmin: false, error: 'Admin record not found' }
    }

    return {
      isAdmin: true,
      role: data.role || 'unknown'
    }
  } catch (err) {
    console.error('Error checking admin access:', err)
    return { isAdmin: false, error: 'Failed to check admin access' }
  }
}

/**
 * Verify a user session and return user info if valid
 */
export async function verifySession(
  supabase: SupabaseClient,
  accessToken?: string
): Promise<{ user?: any; error?: string }> {
  try {
    if (accessToken) {
      // Verify with provided token
      const { data, error } = await supabase.auth.getUser(accessToken)
      if (error) return { error: error.message }
      return { user: data.user }
    } else {
      // Get current session
      const { data, error } = await supabase.auth.getSession()
      if (error) return { error: error.message }
      if (!data.session) return { error: 'No active session' }
      return { user: data.session.user }
    }
  } catch (err) {
    console.error('Error verifying session:', err)
    return { error: 'Failed to verify session' }
  }
}

/**
 * Log an admin action to the audit log
 */
export async function logAdminAction(
  supabase: SupabaseClient,
  adminUserId: string,
  action: {
    type: string
    resource: string
    details?: Record<string, any>
  }
): Promise<void> {
  try {
    await supabase.from('admin_audit_log').insert({
      admin_user_id: adminUserId,
      action_type: action.type,
      resource_type: action.resource,
      resource_details: action.details || {}
    })
  } catch (error) {
    console.warn('Failed to log admin action:', error)
    // Don't throw - logging shouldn't break the main flow
  }
}

/**
 * Extract auth token from request headers or cookies
 */
export function extractAuthToken(request: Request): string | null {
  // Check Authorization header
  const authHeader = request.headers.get('authorization')
  if (authHeader?.startsWith('Bearer ')) {
    return authHeader.substring(7)
  }

  // Check cookies
  const cookieHeader = request.headers.get('cookie')
  if (cookieHeader) {
    const cookies = Object.fromEntries(
      cookieHeader.split(';').map(c => {
        const [key, value] = c.trim().split('=')
        return [key, value]
      })
    )
    return cookies['sb-access-token'] || null
  }

  return null
}
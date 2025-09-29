/**
 * FIXED Admin Authentication Middleware
 * Addresses critical security issues identified in security audit
 *
 * Changes:
 * - Uses service role key instead of anon key for proper server-side auth
 * - Adds rate limiting
 * - Improved error handling
 * - Security audit logging
 */

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Admin routes that require authentication
const protectedRoutes = [
  '/admin/dashboard',
  '/admin/blog',
  '/admin/assessments',
  '/admin/leads',
  '/admin/users',
  '/admin/settings',
  '/admin/analytics',
];

// Routes that require super admin access
const superAdminRoutes = [
  '/admin/users',
  '/admin/settings/security',
  '/admin/audit-logs',
];

// Rate limiting configuration
const RATE_LIMIT_WINDOW_MS = 60000; // 1 minute
const RATE_LIMIT_MAX_REQUESTS = 30; // 30 requests per minute
const requestCounts = new Map<string, { count: number; resetTime: number }>();

/**
 * Check rate limiting for a given identifier
 */
function checkRateLimit(identifier: string): boolean {
  const now = Date.now();
  const limit = requestCounts.get(identifier);

  if (!limit || now > limit.resetTime) {
    // Reset or initialize the counter
    requestCounts.set(identifier, {
      count: 1,
      resetTime: now + RATE_LIMIT_WINDOW_MS
    });
    return true;
  }

  if (limit.count >= RATE_LIMIT_MAX_REQUESTS) {
    return false; // Rate limit exceeded
  }

  // Increment counter
  limit.count++;
  requestCounts.set(identifier, limit);
  return true;
}

/**
 * Clean up old rate limit entries periodically
 */
setInterval(() => {
  const now = Date.now();
  for (const [key, value] of requestCounts.entries()) {
    if (now > value.resetTime + RATE_LIMIT_WINDOW_MS) {
      requestCounts.delete(key);
    }
  }
}, RATE_LIMIT_WINDOW_MS * 2);

export async function adminAuthMiddleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Check if route requires protection
  const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route));
  const isSuperAdminRoute = superAdminRoutes.some(route => pathname.startsWith(route));

  if (!isProtectedRoute) {
    return NextResponse.next();
  }

  // Get IP for rate limiting
  const clientIp = request.headers.get('x-forwarded-for') ||
                   request.headers.get('x-real-ip') ||
                   request.ip ||
                   'unknown';

  // Check rate limit
  if (!checkRateLimit(`admin:${clientIp}`)) {
    console.warn(`Rate limit exceeded for admin access from IP: ${clientIp}`);
    return NextResponse.json(
      { error: 'Too many requests. Please try again later.' },
      { status: 429 }
    );
  }

  // CRITICAL FIX: Use service role key for server-side authentication
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!, // FIXED: Using service role key
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    }
  );

  try {
    // Get auth token from cookies or Authorization header
    const authToken = request.cookies.get('sb-access-token')?.value ||
                     request.headers.get('authorization')?.replace('Bearer ', '');

    if (!authToken) {
      // Log authentication attempt
      await logSecurityEvent(supabase, 'AUTH_FAILED', {
        reason: 'No token provided',
        path: pathname,
        ip: clientIp
      });

      const loginUrl = new URL('/admin/login', request.url);
      loginUrl.searchParams.set('redirectTo', pathname);
      return NextResponse.redirect(loginUrl);
    }

    // Verify the token and get user
    const { data: { user }, error } = await supabase.auth.getUser(authToken);

    if (error || !user) {
      // Log failed authentication
      await logSecurityEvent(supabase, 'AUTH_FAILED', {
        reason: error?.message || 'Invalid token',
        path: pathname,
        ip: clientIp
      });

      const loginUrl = new URL('/admin/login', request.url);
      loginUrl.searchParams.set('redirectTo', pathname);
      return NextResponse.redirect(loginUrl);
    }

    // Check admin status
    const { data: adminData, error: adminError } = await supabase
      .from('admin_users')
      .select('id, role_id, is_active, admin_roles!inner(role_name)')
      .eq('user_id', user.id)
      .eq('is_active', true)
      .single();

    if (adminError || !adminData) {
      // Log unauthorized access attempt
      await logSecurityEvent(supabase, 'UNAUTHORIZED_ACCESS', {
        user_id: user.id,
        user_email: user.email,
        path: pathname,
        ip: clientIp
      });

      return NextResponse.redirect(new URL('/admin/unauthorized', request.url));
    }

    // Extract role name
    const roleName = adminData.admin_roles?.role_name;

    // Check super admin requirement
    if (isSuperAdminRoute && roleName !== 'super_admin') {
      // Log insufficient privileges
      await logSecurityEvent(supabase, 'INSUFFICIENT_PRIVILEGES', {
        user_id: user.id,
        user_email: user.email,
        required_role: 'super_admin',
        actual_role: roleName,
        path: pathname,
        ip: clientIp
      });

      return NextResponse.redirect(new URL('/admin/unauthorized', request.url));
    }

    // Add security headers
    const securityHeaders = new Headers(request.headers);

    // Add admin info for use in server components
    securityHeaders.set('x-admin-id', adminData.id);
    securityHeaders.set('x-admin-role', roleName || 'unknown');
    securityHeaders.set('x-user-id', user.id);

    // Add security headers
    securityHeaders.set('X-Frame-Options', 'DENY');
    securityHeaders.set('X-Content-Type-Options', 'nosniff');
    securityHeaders.set('Referrer-Policy', 'strict-origin-when-cross-origin');
    securityHeaders.set('X-XSS-Protection', '1; mode=block');

    // Log successful authentication (only on dashboard access to avoid spam)
    if (pathname === '/admin/dashboard') {
      await logSecurityEvent(supabase, 'ADMIN_LOGIN', {
        user_id: user.id,
        user_email: user.email,
        role: roleName,
        ip: clientIp
      });
    }

    return NextResponse.next({
      request: {
        headers: securityHeaders,
      },
    });

  } catch (error) {
    console.error('Admin auth middleware error:', error);

    // Log system error
    await logSecurityEvent(supabase, 'MIDDLEWARE_ERROR', {
      error: error instanceof Error ? error.message : 'Unknown error',
      path: pathname,
      ip: clientIp
    });

    // Fail securely - redirect to login
    return NextResponse.redirect(new URL('/admin/login', request.url));
  }
}

/**
 * Log security events to the audit log
 */
async function logSecurityEvent(
  supabase: any,
  eventType: string,
  details: Record<string, any>
) {
  try {
    await supabase
      .from('security_audit_log')
      .insert({
        action_type: eventType,
        resource_type: 'admin_access',
        details,
        ip_address: details.ip || 'unknown',
        created_at: new Date().toISOString()
      });
  } catch (error) {
    // Don't fail the request if logging fails
    console.error('Failed to log security event:', error);
  }
}

// Export for use in middleware.ts
export const config = {
  matcher: '/admin/:path*',
};

/**
 * Additional security checks for critical operations
 */
export async function verifySuperAdmin(request: NextRequest): Promise<boolean> {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    }
  );

  const authToken = request.cookies.get('sb-access-token')?.value ||
                   request.headers.get('authorization')?.replace('Bearer ', '');

  if (!authToken) return false;

  try {
    const { data: { user } } = await supabase.auth.getUser(authToken);
    if (!user) return false;

    const { data: adminData } = await supabase
      .from('admin_users')
      .select('admin_roles!inner(role_name)')
      .eq('user_id', user.id)
      .eq('is_active', true)
      .single();

    return adminData?.admin_roles?.role_name === 'super_admin';
  } catch {
    return false;
  }
}
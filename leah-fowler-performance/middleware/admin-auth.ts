/**
 * Admin Authentication Middleware
 * Protects admin routes and handles session management
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

export async function adminAuthMiddleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Check if route requires protection
  const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route));
  const isSuperAdminRoute = superAdminRoutes.some(route => pathname.startsWith(route));

  if (!isProtectedRoute) {
    return NextResponse.next();
  }

  // Create Supabase client
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get: (name: string) => {
          return request.cookies.get(name)?.value;
        },
      },
    }
  );

  try {
    // Get current session
    const { data: { session }, error } = await supabase.auth.getSession();

    if (error || !session) {
      // No session, redirect to login
      const loginUrl = new URL('/admin/login', request.url);
      loginUrl.searchParams.set('redirectTo', pathname);
      return NextResponse.redirect(loginUrl);
    }

    // Check admin status
    const { data: adminData, error: adminError } = await supabase
      .from('admin_users')
      .select('id, role, is_active')
      .eq('user_id', session.user.id)
      .eq('is_active', true)
      .single();

    if (adminError || !adminData) {
      // Not an admin, redirect to unauthorized
      return NextResponse.redirect(new URL('/admin/unauthorized', request.url));
    }

    // Check super admin requirement
    if (isSuperAdminRoute && adminData.role !== 'super_admin') {
      return NextResponse.redirect(new URL('/admin/unauthorized', request.url));
    }

    // Add admin info to headers for use in server components
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set('x-admin-id', adminData.id);
    requestHeaders.set('x-admin-role', adminData.role);

    return NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    });
  } catch (error) {
    console.error('Admin auth middleware error:', error);
    return NextResponse.redirect(new URL('/admin/login', request.url));
  }
}

// Export for use in middleware.ts
export const config = {
  matcher: '/admin/:path*',
};
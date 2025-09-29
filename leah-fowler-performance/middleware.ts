/**
 * Next.js Middleware Configuration
 * Routes all admin requests through the secure admin authentication middleware
 */

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { adminAuthMiddleware } from '@/middleware/admin-auth-fixed';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Apply admin authentication middleware to admin routes
  if (pathname.startsWith('/admin')) {
    // Skip login page from authentication
    if (pathname === '/admin/login') {
      return NextResponse.next();
    }

    return adminAuthMiddleware(request);
  }

  return NextResponse.next();
}

// Configuration for which routes the middleware should run on
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
# Critical Security Fixes - Implementation Guide
## Immediate Action Required

### 🚨 Priority 1: Apply Database Migration (5 minutes)

1. **Apply the critical security migration:**
```bash
cd /Users/samfowler/Code/LeahFowlerPerformance-1/leah-fowler-performance

# Apply migration to Supabase
npx supabase db push
# OR if using direct SQL
npx supabase db execute -f supabase/migrations/006_critical_security_fixes.sql
```

2. **Verify migration success:**
```sql
-- Run in Supabase SQL editor
SELECT table_name FROM information_schema.tables
WHERE table_name IN ('gdpr_verification_requests', 'api_rate_limits');
```

### 🔴 Priority 2: Fix Admin Middleware (10 minutes)

1. **Backup current middleware:**
```bash
cp middleware/admin-auth.ts middleware/admin-auth.backup.ts
```

2. **Replace with fixed version:**
```bash
cp middleware/admin-auth-fixed.ts middleware/admin-auth.ts
```

3. **Update environment variables:**
```bash
# Ensure you have SUPABASE_SERVICE_ROLE_KEY in .env.local
# Get it from Supabase Dashboard > Settings > API
echo "SUPABASE_SERVICE_ROLE_KEY=your-service-role-key" >> .env.local
```

4. **Test the fix:**
```bash
npm run dev
# Try accessing /admin/dashboard
# Check console for any errors
```

### 🟡 Priority 3: Implement Rate Limiting (15 minutes)

1. **Install rate limiting package:**
```bash
npm install @upstash/ratelimit @upstash/redis
```

2. **Create rate limiting utility:**
```typescript
// lib/rate-limit.ts
import { Ratelimit } from '@upstash/ratelimit'
import { Redis } from '@upstash/redis'

export const rateLimiter = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(10, '1 m'),
  analytics: true,
})
```

3. **Apply to vulnerable endpoints:**
```typescript
// Example: app/api/assessment/submit/route.ts
import { rateLimiter } from '@/lib/rate-limit'

export async function POST(request: NextRequest) {
  const ip = request.headers.get('x-forwarded-for') || 'unknown'
  const { success } = await rateLimiter.limit(ip)

  if (!success) {
    return NextResponse.json(
      { error: 'Too many requests' },
      { status: 429 }
    )
  }

  // ... rest of your code
}
```

### 🟢 Priority 4: Add Security Headers (10 minutes)

1. **Create middleware configuration:**
```typescript
// middleware.ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { adminAuthMiddleware } from './middleware/admin-auth'

export async function middleware(request: NextRequest) {
  // Admin routes
  if (request.nextUrl.pathname.startsWith('/admin')) {
    return adminAuthMiddleware(request)
  }

  // Add security headers to all responses
  const response = NextResponse.next()

  response.headers.set('X-Frame-Options', 'DENY')
  response.headers.set('X-Content-Type-Options', 'nosniff')
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')
  response.headers.set('X-XSS-Protection', '1; mode=block')
  response.headers.set(
    'Content-Security-Policy',
    "default-src 'self'; script-src 'self' 'unsafe-inline' https://js.stripe.com; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self'; connect-src 'self' https://*.supabase.co https://api.stripe.com;"
  )

  return response
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
}
```

### 📋 Verification Checklist

After implementing these fixes, verify:

- [ ] Admin login requires proper authentication
- [ ] Rate limiting blocks excessive requests
- [ ] GDPR endpoints work correctly
- [ ] Security headers appear in browser DevTools
- [ ] Database migrations applied successfully
- [ ] No errors in application logs

### 🔄 Rollback Plan

If issues occur:

1. **Database rollback:**
```sql
-- Run the rollback script from migration file
DROP TABLE IF EXISTS public.gdpr_verification_requests CASCADE;
DROP TABLE IF EXISTS public.api_rate_limits CASCADE;
```

2. **Code rollback:**
```bash
cp middleware/admin-auth.backup.ts middleware/admin-auth.ts
git checkout -- middleware.ts
```

### 📞 Support Contact

If you encounter issues:
1. Check Supabase logs: Dashboard > Logs > Edge Functions
2. Review application logs: `npm run dev` console output
3. Test endpoints with: `curl -v https://your-site.com/api/test`

### ⏱️ Estimated Time

- Database migration: 5 minutes
- Middleware fix: 10 minutes
- Rate limiting: 15 minutes
- Security headers: 10 minutes
- **Total: ~40 minutes**

### 🎯 Success Metrics

After implementation, you should see:
- ✅ Zero unauthorized admin access
- ✅ Rate limiting preventing abuse
- ✅ GDPR compliance operational
- ✅ Security headers in all responses
- ✅ Audit logs recording security events

---

**Remember:** These are CRITICAL security fixes. Deploy them immediately to production after testing.
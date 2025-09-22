# Assessment Backend Documentation

## Overview

The Leah Fowler Performance assessment backend provides a complete, production-ready system for collecting, storing, and managing performance assessment submissions with full GDPR compliance.

## Features

### Core Functionality
- ✅ Secure assessment submission with validation
- ✅ GDPR-compliant data handling with consent tracking
- ✅ Admin dashboard for managing submissions
- ✅ Automated qualification scoring and client profiling
- ✅ Email notification support (webhook integration)
- ✅ Data export capabilities (CSV)
- ✅ Complete audit logging

### Security & Compliance
- ✅ GDPR data subject rights (access, portability, deletion, rectification)
- ✅ Consent management and tracking
- ✅ Data anonymization for right to be forgotten
- ✅ Row-level security in database
- ✅ API authentication for admin endpoints
- ✅ Input validation and sanitization

## Database Schema

### Main Tables

#### `assessment_submissions`
Stores all assessment form submissions with complete user data and calculated profiles.

Key fields:
- User information (name, email, phone)
- Assessment answers (JSONB)
- Calculated profile (qualification, tier, investment level, etc.)
- GDPR consent tracking
- Admin management fields (status, contacted, notes)
- Analytics tracking (UTM parameters)

#### `gdpr_consent_log`
Tracks all consent actions for GDPR compliance.

#### `assessment_admin_log`
Audit log for all admin actions on submissions.

## API Endpoints

### 1. Submit Assessment
**POST** `/api/assessment/submit`

Submit a new assessment with automatic profile calculation and GDPR consent tracking.

**Request Body:**
```json
{
  "name": "John Smith",
  "email": "john@example.com",
  "phone": "+44 7123 456789",
  "answers": {
    "investment_capability": "5000_10000",
    "current_performance": "executive",
    // ... all assessment answers
  },
  "profile": {
    "qualified": true,
    "tier": "established",
    "investmentLevel": "high",
    "readinessScore": 75.5,
    // ... complete profile from analyzeClientProfile
  },
  "consent": {
    "dataProcessing": true,
    "marketing": false,
    "contactPreference": "email"
  },
  "completionTimeSeconds": 480,
  "analytics": {
    "source": "google",
    "medium": "cpc",
    "campaign": "performance-2024"
  }
}
```

**Response:**
```json
{
  "success": true,
  "submissionId": "uuid",
  "qualified": true,
  "message": "Thank you for completing the assessment...",
  "nextSteps": ["Schedule strategy session", "..."]
}
```

### 2. Admin - Get Submissions
**GET** `/api/assessment/admin`

Retrieve assessment submissions (requires authentication).

**Headers:**
- `Authorization: Bearer {token}` OR
- `x-api-key: {admin-api-key}`

**Query Parameters:**
- `filter`: 'all' | 'qualified' | 'new' | 'contacted'
- `limit`: number (default: 100)
- `offset`: number (default: 0)

### 3. Admin - Update Status
**PATCH** `/api/assessment/admin`

Update submission status and add admin notes.

**Request Body:**
```json
{
  "submissionId": "uuid",
  "status": "contacted",
  "adminNotes": "Called on 01/09, scheduled for consultation"
}
```

### 4. GDPR Requests
**POST** `/api/assessment/gdpr`

Handle GDPR data subject requests.

**Request Types:**
- `access`: Get all data held
- `portability`: Export data in machine-readable format
- `deletion`: Anonymize and delete personal data
- `rectification`: Update incorrect data

**Request Body:**
```json
{
  "email": "user@example.com",
  "requestType": "access",
  "verificationToken": "token-from-email"
}
```

## Setup Instructions

### 1. Environment Variables

Create a `.env.local` file with:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Admin & Security
ADMIN_API_KEY=generate-secure-random-key
ASSESSMENT_WEBHOOK_URL=https://your-webhook.com/notify
WEBHOOK_API_KEY=your-webhook-key

# Email Service (optional)
EMAIL_SERVICE_API_KEY=your-email-api-key
EMAIL_FROM_ADDRESS=noreply@leahfowlerperformance.com
```

### 2. Database Setup

1. Create a new Supabase project at https://supabase.com

2. Run the migration SQL:
   - Go to SQL Editor in Supabase Dashboard
   - Copy contents of `/supabase/migrations/001_assessment_submissions.sql`
   - Execute the SQL

3. Verify tables are created:
   - `assessment_submissions`
   - `gdpr_consent_log`
   - `assessment_admin_log`

### 3. Configure Authentication

For admin access, you need to:

1. Enable authentication in Supabase
2. Create admin users with role='admin' in profiles table
3. OR use the ADMIN_API_KEY for server-to-server access

### 4. Test the System

1. **Test Assessment Submission:**
   - Navigate to the assessment tool
   - Complete all questions
   - Submit with valid email
   - Check Supabase dashboard for new entry

2. **Test Admin Dashboard:**
   - Navigate to `/admin/assessments`
   - Authenticate with admin token
   - View and manage submissions

3. **Test GDPR Compliance:**
   ```bash
   # Request data access
   curl -X POST http://localhost:3000/api/assessment/gdpr \
     -H "Content-Type: application/json" \
     -d '{"email":"test@example.com","requestType":"access"}'
   ```

## Frontend Integration

The assessment tool automatically integrates with the backend when properly configured:

```typescript
// In AssessmentTool.tsx
const handleSubmitAssessment = async () => {
  const submissionData = {
    name,
    email,
    phone,
    answers,
    profile: clientProfile,
    consent: {
      dataProcessing: dataConsent,
      marketing: marketingConsent,
      contactPreference
    },
    completionTimeSeconds,
    analytics
  }
  
  const response = await fetch('/api/assessment/submit', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(submissionData)
  })
  
  // Handle response...
}
```

## Admin Dashboard Features

Access at `/admin/assessments`:

- **Statistics Overview**: Total submissions, qualified leads, conversion rate
- **Submission Management**: View, filter, search all submissions
- **Status Updates**: Mark as contacted, qualified, converted
- **Data Export**: Download submissions as CSV
- **GDPR Actions**: Anonymize data on request
- **Contact Actions**: Direct email/phone links

## Security Best Practices

1. **API Keys**: Generate strong, random API keys
2. **HTTPS Only**: Always use HTTPS in production
3. **Rate Limiting**: Implement rate limiting on submission endpoint
4. **Input Validation**: All inputs validated with Zod schemas
5. **SQL Injection**: Protected via Supabase parameterized queries
6. **XSS Protection**: React automatically escapes output
7. **CORS**: Configure appropriate CORS headers

## Monitoring & Analytics

### Key Metrics to Track
- Submission volume by day/week
- Qualification rate trends
- Average readiness scores
- Conversion funnel (new → contacted → converted)
- Time to contact after submission

### Webhook Integration
Configure `ASSESSMENT_WEBHOOK_URL` to receive real-time notifications:

```json
{
  "type": "new_assessment",
  "data": {
    "id": "uuid",
    "name": "John Smith",
    "email": "john@example.com",
    "qualified": true,
    "tier": "elite",
    "investment_level": "premium"
  }
}
```

## Troubleshooting

### Common Issues

1. **"Failed to submit assessment"**
   - Check Supabase connection in .env.local
   - Verify NEXT_PUBLIC_SUPABASE_URL and ANON_KEY

2. **Admin dashboard shows "Unauthorized"**
   - Verify ADMIN_API_KEY is set
   - Check authentication token is valid

3. **GDPR requests failing**
   - Ensure email service is configured for verification
   - Check gdpr_verification_requests table exists

4. **Data not appearing in dashboard**
   - Check Row Level Security policies
   - Verify admin role is properly set

## Maintenance

### Regular Tasks
1. **Weekly**: Review new submissions
2. **Monthly**: Export data for analysis
3. **Quarterly**: Archive old submissions
4. **Annually**: Review and update GDPR policies

### Database Cleanup
```sql
-- Archive old submissions (>1 year)
UPDATE assessment_submissions 
SET status = 'archived' 
WHERE created_at < NOW() - INTERVAL '1 year' 
AND status != 'converted';

-- Clean up expired GDPR requests
DELETE FROM gdpr_verification_requests 
WHERE expires_at < NOW();
```

## Support

For technical support or questions about the assessment backend:
- Review this documentation
- Check Supabase logs for errors
- Contact development team with specific error messages

## License

This assessment backend system is proprietary to Leah Fowler Performance and should not be shared or distributed without permission.
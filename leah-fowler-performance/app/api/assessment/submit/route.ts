import { NextRequest, NextResponse } from 'next/server'
import { assessmentSubmissionQueries, type AssessmentSubmission, type GDPRConsentLog } from '@/lib/supabase'
import { z } from 'zod'

// Validation schema for assessment submission
const submissionSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(100),
  email: z.string().email('Invalid email address'),
  phone: z.string().optional(),
  answers: z.record(z.string(), z.unknown()),
  profile: z.object({
    qualified: z.boolean(),
    tier: z.enum(['not-qualified', 'developing', 'established', 'elite']),
    investmentLevel: z.enum(['low', 'moderate', 'high', 'premium']),
    readinessScore: z.number().min(0).max(100),
    performanceLevel: z.string(),
    strengths: z.array(z.string()),
    gaps: z.array(z.string()),
    recommendedProgramme: z.string(),
    estimatedInvestment: z.string(),
    nextSteps: z.array(z.string()),
    disqualificationReason: z.string().optional()
  }),
  consent: z.object({
    dataProcessing: z.boolean(),
    marketing: z.boolean().optional(),
    contactPreference: z.enum(['email', 'phone', 'both', 'none']).optional()
  }),
  completionTimeSeconds: z.number().optional(),
  analytics: z.object({
    source: z.string().optional(),
    medium: z.string().optional(),
    campaign: z.string().optional(),
    referrer: z.string().optional()
  }).optional()
})

export async function POST(request: NextRequest) {
  try {
    // Parse request body
    const body = await request.json()
    
    // Validate input
    const validationResult = submissionSchema.safeParse(body)
    if (!validationResult.success) {
      return NextResponse.json(
        { 
          error: 'Validation failed', 
          details: validationResult.error.issues 
        },
        { status: 400 }
      )
    }

    const data = validationResult.data

    // Check for required GDPR consent
    if (!data.consent.dataProcessing) {
      return NextResponse.json(
        { 
          error: 'Data processing consent is required',
          code: 'CONSENT_REQUIRED' 
        },
        { status: 400 }
      )
    }

    // Get client information for GDPR logging
    const clientIp = request.headers.get('x-forwarded-for') || 
                    request.headers.get('x-real-ip') || 
                    'unknown'
    const userAgent = request.headers.get('user-agent') || 'unknown'

    // Prepare submission data
    const submission: Omit<AssessmentSubmission, 'id' | 'created_at' | 'updated_at'> = {
      // User Information
      name: data.name,
      email: data.email.toLowerCase(),
      phone: data.phone,
      
      // Assessment Data
      assessment_version: '1.0',
      submission_date: new Date().toISOString(),
      completion_time_seconds: data.completionTimeSeconds,
      answers: data.answers,
      profile: data.profile,
      
      // Flattened profile data for easier querying
      qualified: data.profile.qualified,
      tier: data.profile.tier,
      investment_level: data.profile.investmentLevel,
      readiness_score: data.profile.readinessScore,
      performance_level: data.profile.performanceLevel,
      recommended_programme: data.profile.recommendedProgramme,
      estimated_investment: data.profile.estimatedInvestment,
      
      // GDPR Compliance
      consent_given: data.consent.dataProcessing,
      consent_timestamp: new Date().toISOString(),
      consent_version: '1.0',
      marketing_consent: data.consent.marketing || false,
      contact_preference: data.consent.contactPreference || 'email',
      
      // Analytics
      source: data.analytics?.source,
      medium: data.analytics?.medium,
      campaign: data.analytics?.campaign,
      referrer: data.analytics?.referrer || request.headers.get('referer') || undefined,
      
      // Default status
      status: 'new'
    }

    // Submit to database
    const submittedAssessment = await assessmentSubmissionQueries.submitAssessment(submission)

    // Log GDPR consent
    const consentLog: Omit<GDPRConsentLog, 'id' | 'created_at'> = {
      submission_id: submittedAssessment.id,
      email: data.email.toLowerCase(),
      consent_type: 'data_processing',
      consent_given: true,
      consent_timestamp: new Date().toISOString(),
      consent_version: '1.0',
      ip_address: clientIp,
      user_agent: userAgent
    }

    await assessmentSubmissionQueries.logGDPRConsent(consentLog)

    // Log marketing consent if given
    if (data.consent.marketing) {
      const marketingConsent: Omit<GDPRConsentLog, 'id' | 'created_at'> = {
        submission_id: submittedAssessment.id,
        email: data.email.toLowerCase(),
        consent_type: 'marketing',
        consent_given: true,
        consent_timestamp: new Date().toISOString(),
        consent_version: '1.0',
        ip_address: clientIp,
        user_agent: userAgent
      }

      await assessmentSubmissionQueries.logGDPRConsent(marketingConsent)
    }

    // Prepare response (without sensitive data)
    const response = {
      success: true,
      submissionId: submittedAssessment.id,
      qualified: submittedAssessment.qualified,
      message: submittedAssessment.qualified 
        ? 'Thank you for completing the assessment. We will contact you shortly to schedule your strategy session.'
        : 'Thank you for completing the assessment. We will send you resources to help build your performance foundation.',
      nextSteps: submittedAssessment.profile.nextSteps
    }

    // Send webhook notification if configured (for admin notifications)
    if (process.env.ASSESSMENT_WEBHOOK_URL) {
      try {
        await fetch(process.env.ASSESSMENT_WEBHOOK_URL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-API-Key': process.env.WEBHOOK_API_KEY || ''
          },
          body: JSON.stringify({
            type: 'new_assessment',
            data: {
              id: submittedAssessment.id,
              name: submittedAssessment.name,
              email: submittedAssessment.email,
              qualified: submittedAssessment.qualified,
              tier: submittedAssessment.tier,
              investment_level: submittedAssessment.investment_level,
              created_at: submittedAssessment.created_at
            }
          })
        })
      } catch (webhookError) {
        // Log error but don't fail the submission
        console.error('Webhook notification failed:', webhookError)
      }
    }

    return NextResponse.json(response, { status: 201 })

  } catch (error) {
    console.error('Assessment submission error:', error)
    
    // Check for specific database errors
    if (error instanceof Error) {
      if (error.message.includes('duplicate')) {
        return NextResponse.json(
          { 
            error: 'This email has already submitted an assessment recently',
            code: 'DUPLICATE_SUBMISSION' 
          },
          { status: 409 }
        )
      }
    }

    return NextResponse.json(
      { 
        error: 'Failed to submit assessment',
        code: 'SUBMISSION_FAILED' 
      },
      { status: 500 }
    )
  }
}

// OPTIONS endpoint for CORS preflight
export async function OPTIONS(request: NextRequest) {
  return new NextResponse(null, { 
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type'
}
  })
}
import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { z } from 'zod'
import crypto from 'crypto'

// Schema for GDPR request
const gdprRequestSchema = z.object({
  email: z.string().email(),
  requestType: z.enum(['access', 'portability', 'deletion', 'rectification']),
  verificationToken: z.string().optional(),
  updates: z.record(z.any()).optional() // For rectification requests
})

// Generate verification token for GDPR requests
function generateVerificationToken(): string {
  return crypto.randomBytes(32).toString('hex')
}

// Send verification email (placeholder - integrate with your email service)
async function sendVerificationEmail(email: string, token: string, requestType: string) {
  // TODO: Integrate with email service (SendGrid, Resend, etc.)
  console.log(`Verification email would be sent to ${email} with token ${token} for ${requestType} request`)
  
  // In production, you would send an actual email with a verification link
  // Example: https://yoursite.com/gdpr/verify?token=${token}&email=${email}
}

// POST /api/assessment/gdpr - Handle GDPR requests
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validate input
    const validationResult = gdprRequestSchema.safeParse(body)
    if (!validationResult.success) {
      return NextResponse.json(
        { 
          error: 'Invalid request', 
          details: validationResult.error.errors 
        },
        { status: 400 }
      )
    }

    const { email, requestType, verificationToken, updates } = validationResult.data

    // If no verification token, initiate verification process
    if (!verificationToken) {
      const token = generateVerificationToken()
      
      // Store verification request temporarily (expires in 1 hour)
      const { error: storeError } = await supabase
        .from('gdpr_verification_requests')
        .insert({
          email,
          request_type: requestType,
          token,
          expires_at: new Date(Date.now() + 3600000).toISOString() // 1 hour
        })

      if (storeError && !storeError.message.includes('does not exist')) {
        throw storeError
      }

      // Send verification email
      await sendVerificationEmail(email, token, requestType)

      return NextResponse.json({
        success: true,
        message: 'Verification email sent. Please check your email to confirm your request.',
        requiresVerification: true
      })
    }

    // Verify the token
    const { data: verificationRequest } = await supabase
      .from('gdpr_verification_requests')
      .select('*')
      .eq('email', email)
      .eq('token', verificationToken)
      .eq('request_type', requestType)
      .gt('expires_at', new Date().toISOString())
      .single()

    if (!verificationRequest) {
      return NextResponse.json(
        { error: 'Invalid or expired verification token' },
        { status: 401 }
      )
    }

    // Process the GDPR request based on type
    switch (requestType) {
      case 'access': {
        // Right to Access - Return all data we have on the user
        const { data: submissions } = await supabase
          .from('assessment_submissions')
          .select('*')
          .eq('email', email)

        const { data: consentLogs } = await supabase
          .from('gdpr_consent_log')
          .select('*')
          .eq('email', email)

        return NextResponse.json({
          success: true,
          message: 'Your data has been retrieved',
          data: {
            assessmentSubmissions: submissions || [],
            consentHistory: consentLogs || [],
            dataCollectionPurpose: 'Performance assessment and consultancy qualification',
            dataRetentionPeriod: '3 years from last interaction',
            dataSharing: 'Data is not shared with third parties except for essential service providers'
          }
        })
      }

      case 'portability': {
        // Right to Data Portability - Return data in machine-readable format
        const { data: submissions } = await supabase
          .from('assessment_submissions')
          .select('*')
          .eq('email', email)

        const { data: consentLogs } = await supabase
          .from('gdpr_consent_log')
          .select('*')
          .eq('email', email)

        // Return as downloadable JSON
        return NextResponse.json({
          success: true,
          format: 'json',
          data: {
            exportDate: new Date().toISOString(),
            userEmail: email,
            assessmentData: submissions || [],
            consentHistory: consentLogs || []
          }
        }, {
          headers: {
            'Content-Disposition': `attachment; filename="gdpr-data-export-${email}-${Date.now()}.json"`
          }
        })
      }

      case 'deletion': {
        // Right to Erasure (Right to be Forgotten)
        const { data: submissions } = await supabase
          .from('assessment_submissions')
          .select('id')
          .eq('email', email)

        if (submissions && submissions.length > 0) {
          // Anonymize all submissions
          for (const submission of submissions) {
            await supabase.rpc('anonymize_assessment_submission', { 
              submission_id: submission.id 
            })
          }
        }

        // Delete verification requests
        await supabase
          .from('gdpr_verification_requests')
          .delete()
          .eq('email', email)

        return NextResponse.json({
          success: true,
          message: 'Your personal data has been anonymized and deleted',
          deletedRecords: submissions?.length || 0
        })
      }

      case 'rectification': {
        // Right to Rectification - Update incorrect data
        if (!updates || Object.keys(updates).length === 0) {
          return NextResponse.json(
            { error: 'No updates provided for rectification' },
            { status: 400 }
          )
        }

        // Only allow updating certain fields for security
        const allowedFields = ['name', 'phone', 'contact_preference']
        const filteredUpdates = Object.keys(updates)
          .filter(key => allowedFields.includes(key))
          .reduce((obj, key) => {
            obj[key] = updates[key]
            return obj
          }, {} as Record<string, unknown>)

        if (Object.keys(filteredUpdates).length === 0) {
          return NextResponse.json(
            { error: 'No valid fields to update' },
            { status: 400 }
          )
        }

        // Update all submissions for this email
        const { data: updated } = await supabase
          .from('assessment_submissions')
          .update(filteredUpdates)
          .eq('email', email)
          .select()

        return NextResponse.json({
          success: true,
          message: 'Your data has been updated',
          updatedRecords: updated?.length || 0,
          updatedFields: Object.keys(filteredUpdates)
        })
      }

      default:
        return NextResponse.json(
          { error: 'Invalid request type' },
          { status: 400 }
        )
    }

  } catch (error) {
    console.error('GDPR request error:', error)
    return NextResponse.json(
      { error: 'Failed to process GDPR request' },
      { status: 500 }
    )
  } finally {
    // Clean up expired verification requests
    await supabase
      .from('gdpr_verification_requests')
      .delete()
      .lt('expires_at', new Date().toISOString())
  }
}

// GET /api/assessment/gdpr/verify - Verify GDPR request token
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const token = searchParams.get('token')
    const email = searchParams.get('email')

    if (!token || !email) {
      return NextResponse.json(
        { error: 'Token and email required' },
        { status: 400 }
      )
    }

    // Check if token is valid
    const { data: verificationRequest } = await supabase
      .from('gdpr_verification_requests')
      .select('*')
      .eq('email', email)
      .eq('token', token)
      .gt('expires_at', new Date().toISOString())
      .single()

    if (!verificationRequest) {
      return NextResponse.json(
        { error: 'Invalid or expired token' },
        { status: 401 }
      )
    }

    return NextResponse.json({
      success: true,
      valid: true,
      requestType: verificationRequest.request_type,
      email: verificationRequest.email
    })

  } catch (error) {
    console.error('GDPR verification error:', error)
    return NextResponse.json(
      { error: 'Failed to verify request' },
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
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type'
}
  })
}
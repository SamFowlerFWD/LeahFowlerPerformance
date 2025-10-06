import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase'
import { Resend } from 'resend'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Validate required fields
    const { name, email, programme, goals, dataConsent } = body

    if (!name || !email || !programme || !goals || !dataConsent) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Initialize Supabase client
    const supabase = createClient()

    // Store application in database
    const { error: dbError } = await supabase
      .from('coaching_applications')
      .insert({
        name,
        email,
        phone: body.phone || null,
        programme,
        goals,
        experience: body.experience || null,
        availability: body.availability || null,
        location: body.location || null,
        message: body.message || null,
        data_consent: dataConsent,
        marketing_consent: body.marketingConsent || false,
        submitted_at: body.submittedAt || new Date().toISOString(),
        status: 'pending',
        metadata: {
          source: 'website',
          page: '/apply'
        }
      })

    if (dbError) {
      console.error('Database error:', dbError)
      return NextResponse.json(
        { error: 'Failed to submit application' },
        { status: 500 }
      )
    }

    // Send notification email to Leah using Resend
    try {
      const resend = new Resend(process.env.RESEND_API_KEY)

      await resend.emails.send({
        from: process.env.EMAIL_FROM_ADDRESS || 'onboarding@resend.dev',
        to: process.env.EMAIL_NOTIFICATION_TO || 'leah@aphroditefitness.co.uk',
        subject: `New Coaching Application - ${programme}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #e7007d;">New Coaching Application Received</h2>

            <div style="background-color: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3 style="margin-top: 0;">Applicant Details</h3>
              <p><strong>Name:</strong> ${name}</p>
              <p><strong>Email:</strong> ${email}</p>
              <p><strong>Phone:</strong> ${body.phone || 'Not provided'}</p>
              <p><strong>Location:</strong> ${body.location || 'Not provided'}</p>
            </div>

            <div style="background-color: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3 style="margin-top: 0;">Programme Information</h3>
              <p><strong>Programme:</strong> ${programme}</p>
              <p><strong>Experience Level:</strong> ${body.experience || 'Not provided'}</p>
              <p><strong>Availability:</strong> ${body.availability || 'Not provided'}</p>
            </div>

            <div style="background-color: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3 style="margin-top: 0;">Goals</h3>
              <p>${goals}</p>
            </div>

            ${body.message ? `
            <div style="background-color: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3 style="margin-top: 0;">Additional Message</h3>
              <p>${body.message}</p>
            </div>
            ` : ''}

            <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd;">
              <p style="color: #666; font-size: 14px;">
                View full application details in your admin dashboard at
                <a href="https://strengthpt.co.uk/admin/assessments" style="color: #e7007d;">
                  strengthpt.co.uk/admin/assessments
                </a>
              </p>
            </div>
          </div>
        `
      })

      console.log('Email notification sent successfully to:', process.env.EMAIL_NOTIFICATION_TO)
    } catch (emailError) {
      console.error('Failed to send email notification:', emailError)
      // Don't fail the whole request if email fails
    }

    return NextResponse.json({
      success: true,
      message: 'Application submitted successfully'
    })
  } catch (error) {
    console.error('Application submission error:', error)
    return NextResponse.json(
      { error: 'Failed to process application' },
      { status: 500 }
    )
  }
}
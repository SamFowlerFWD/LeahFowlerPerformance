import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase'

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

    // Send confirmation email (you can add email service here)
    // For now, we'll just log it
    console.log('New coaching application received:', {
      name,
      email,
      programme,
      goals
    })

    // Send notification email to Leah
    // TODO: Integrate with email service (Resend/SendGrid)
    // When email service is configured, send notification to:
    // Email: leah@aphroditefitness.co.uk
    // Subject: 'New Coaching Application'
    // Body: Application details from ${name} for ${programme}
    console.log('Email notification to be sent to: leah@aphroditefitness.co.uk')

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
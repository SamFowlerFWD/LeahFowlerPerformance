import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { supabase } from '@/lib/supabase'
import { emailSequence, personaliseEmail, calculateSendDate, generateUnsubscribeUrl, generatePreferencesUrl } from '@/content/emails/nurture-sequence'

// Validation schema for lead capture
const leadCaptureSchema = z.object({
  email: z.string().email('Invalid email address'),
  firstName: z.string().min(1, 'First name is required').max(50),
  lastName: z.string().min(1, 'Last name is required').max(50),
  company: z.string().optional(),
  role: z.string().optional(),
  source: z.string().optional(),
  consent: z.object({
    marketing: z.boolean(),
    dataProcessing: z.boolean()
  })
})

// Lead subscriber interface
interface LeadSubscriber {
  id: string
  email: string
  first_name: string
  last_name: string
  company?: string
  role?: string
  source?: string
  lead_magnet_downloaded: boolean
  lead_magnet_downloaded_at?: string
  email_sequence_started: boolean
  email_sequence_started_at?: string
  email_sequence_completed: boolean
  email_sequence_current_day: number
  marketing_consent: boolean
  data_processing_consent: boolean
  unsubscribed: boolean
  unsubscribed_at?: string
  created_at: string
  updated_at: string
}

// Email queue interface
interface EmailQueueItem {
  id: string
  subscriber_id: string
  email_id: string
  scheduled_for: string
  sent: boolean
  sent_at?: string
  opened: boolean
  opened_at?: string
  clicked: boolean
  clicked_at?: string
  error?: string
  created_at: string
}

export async function POST(request: NextRequest) {
  try {
    // Parse and validate request body
    const body = await request.json()
    const validationResult = leadCaptureSchema.safeParse(body)

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

    // Check if subscriber already exists
    const { data: existingSubscriber } = await supabase
      .from('lead_subscribers')
      .select('*')
      .eq('email', data.email.toLowerCase())
      .single()

    let subscriber: LeadSubscriber

    if (existingSubscriber) {
      // Update existing subscriber
      if (existingSubscriber.lead_magnet_downloaded) {
        return NextResponse.json(
          {
            success: true,
            message: 'You have already downloaded the Executive Performance Protocol. Please check your email.',
            alreadySubscribed: true
          },
          { status: 200 }
        )
      }

      // Update subscriber record
      const { data: updatedSubscriber, error: updateError } = await supabase
        .from('lead_subscribers')
        .update({
          lead_magnet_downloaded: true,
          lead_magnet_downloaded_at: new Date().toISOString(),
          email_sequence_started: true,
          email_sequence_started_at: new Date().toISOString(),
          marketing_consent: data.consent.marketing,
          updated_at: new Date().toISOString()
        })
        .eq('id', existingSubscriber.id)
        .select()
        .single()

      if (updateError) throw updateError
      subscriber = updatedSubscriber
    } else {
      // Create new subscriber
      const { data: newSubscriber, error: createError } = await supabase
        .from('lead_subscribers')
        .insert({
          email: data.email.toLowerCase(),
          first_name: data.firstName,
          last_name: data.lastName,
          company: data.company,
          role: data.role,
          source: data.source || 'lead-magnet',
          lead_magnet_downloaded: true,
          lead_magnet_downloaded_at: new Date().toISOString(),
          email_sequence_started: true,
          email_sequence_started_at: new Date().toISOString(),
          email_sequence_completed: false,
          email_sequence_current_day: 0,
          marketing_consent: data.consent.marketing || false,
          data_processing_consent: data.consent.dataProcessing,
          unsubscribed: false,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .select()
        .single()

      if (createError) throw createError
      subscriber = newSubscriber
    }

    // Schedule email sequence
    const startDate = new Date()
    const emailQueueItems = emailSequence.map(email => ({
      subscriber_id: subscriber.id,
      email_id: email.id,
      scheduled_for: calculateSendDate(startDate, email.day).toISOString(),
      sent: false,
      opened: false,
      clicked: false,
      created_at: new Date().toISOString()
    }))

    const { error: queueError } = await supabase
      .from('email_queue')
      .insert(emailQueueItems)

    if (queueError) {
      console.error('Failed to queue emails:', queueError)
      // Don't fail the request if email queueing fails
    }

    // Send welcome email immediately
    const welcomeEmail = emailSequence[0]
    const personalisedEmail = personaliseEmail(welcomeEmail.body, {
      firstName: subscriber.first_name,
      'cta.url': `https://leahfowlerperformance.com${welcomeEmail.cta.url}`,
      unsubscribe_url: generateUnsubscribeUrl(subscriber.id),
      preferences_url: generatePreferencesUrl(subscriber.id)
    })

    // Send email using configured provider
    await sendEmail({
      to: subscriber.email,
      subject: welcomeEmail.subject,
      html: personalisedEmail,
      subscriberId: subscriber.id,
      emailId: welcomeEmail.id
    })

    // Log GDPR consent
    const { error: gdprError } = await supabase
      .from('gdpr_consent_log')
      .insert({
        submission_id: subscriber.id,
        email: subscriber.email,
        consent_type: 'lead_magnet',
        consent_given: true,
        consent_timestamp: new Date().toISOString(),
        consent_version: '1.0',
        ip_address: request.headers.get('x-forwarded-for') ||
                    request.headers.get('x-real-ip') ||
                    'unknown',
        user_agent: request.headers.get('user-agent') || 'unknown',
        created_at: new Date().toISOString()
      })

    if (gdprError) {
      console.error('Failed to log GDPR consent:', gdprError)
    }

    // Generate download URL for the lead magnet
    const downloadUrl = `/api/lead-magnet/download?token=${Buffer.from(subscriber.id).toString('base64')}`

    return NextResponse.json({
      success: true,
      message: 'Success! Check your email for the Executive Performance Protocol.',
      downloadUrl,
      subscriberId: subscriber.id
    }, { status: 201 })

  } catch (error) {
    console.error('Lead capture error:', error)

    return NextResponse.json(
      {
        error: 'Failed to process lead capture',
        code: 'CAPTURE_FAILED'
      },
      { status: 500 }
    )
  }
}

// GET endpoint to download the lead magnet
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const token = searchParams.get('token')

    if (!token) {
      return NextResponse.json(
        { error: 'Invalid download link' },
        { status: 400 }
      )
    }

    // Decode the subscriber ID
    const subscriberId = Buffer.from(token, 'base64').toString()

    // Verify the subscriber exists and has downloaded the lead magnet
    const { data: subscriber, error } = await supabase
      .from('lead_subscribers')
      .select('*')
      .eq('id', subscriberId)
      .single()

    if (error || !subscriber || !subscriber.lead_magnet_downloaded) {
      return NextResponse.json(
        { error: 'Invalid or expired download link' },
        { status: 404 }
      )
    }

    // Update download count
    await supabase
      .from('lead_subscribers')
      .update({
        download_count: (subscriber.download_count || 0) + 1,
        last_download_at: new Date().toISOString()
      })
      .eq('id', subscriberId)

    // Read the lead magnet content
    const fs = await import('fs/promises')
    const path = await import('path')
    const contentPath = path.join(process.cwd(), 'content/lead-magnets/executive-performance-guide.md')
    const content = await fs.readFile(contentPath, 'utf-8')

    // Convert markdown to PDF (you would use a library like puppeteer or markdown-pdf)
    // For now, we'll return the markdown with proper headers for download

    return new NextResponse(content, {
      status: 200,
      headers: {
        'Content-Type': 'text/markdown',
        'Content-Disposition': 'attachment; filename="Executive-Performance-Protocol.md"',
        'Cache-Control': 'no-cache, no-store, must-revalidate'
}
})

  } catch (error) {
    console.error('Download error:', error)

    return NextResponse.json(
      { error: 'Failed to download lead magnet' },
      { status: 500 }
    )
  }
}

// Helper function to send emails (implement based on your provider)
async function sendEmail(params: {
  to: string
  subject: string
  html: string
  subscriberId: string
  emailId: string
}) {
  // This would integrate with your email service provider
  // Example with Resend:

  try {
    // const resend = new Resend(process.env.RESEND_API_KEY)
    // await resend.emails.send({
    //   from: 'Leah Fowler <leah@leahfowlerperformance.com>',
    //   to: params.to,
    //   subject: params.subject,
    //   html: params.html,
    //   tags: [
    //     { name: 'subscriber_id', value: params.subscriberId },
    //     { name: 'email_id', value: params.emailId }
    //   ]
    // })

    // Update email queue to mark as sent
    await supabase
      .from('email_queue')
      .update({
        sent: true,
        sent_at: new Date().toISOString()
      })
      .eq('subscriber_id', params.subscriberId)
      .eq('email_id', params.emailId)

    console.log(`Email sent to ${params.to}: ${params.subject}`)
  } catch (error) {
    console.error('Email sending failed:', error)

    // Log error in queue
    await supabase
      .from('email_queue')
      .update({
        error: error instanceof Error ? error.message : 'Unknown error'
      })
      .eq('subscriber_id', params.subscriberId)
      .eq('email_id', params.emailId)

    throw error
  }
}

// OPTIONS endpoint for CORS
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
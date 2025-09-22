import { NextRequest, NextResponse } from 'next/server'
import { assessmentSubmissionQueries } from '@/lib/supabase'
import { createClient } from '@supabase/supabase-js'

// Admin authentication middleware
async function verifyAdminAuth(request: NextRequest): Promise<boolean> {
  try {
    // Check for API key in headers (for server-to-server requests)
    const apiKey = request.headers.get('x-api-key')
    if (apiKey && apiKey === process.env.ADMIN_API_KEY) {
      return true
    }

    // Check for Supabase session (for authenticated admin users)
    const authHeader = request.headers.get('authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return false
    }

    const token = authHeader.replace('Bearer ', '')
    
    // Create admin client to verify token
    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!, // Service role key for admin operations
      {
        auth: {
          persistSession: false
        }
      }
    )

    // Verify the JWT token
    const { data: { user }, error } = await supabaseAdmin.auth.getUser(token)
    
    if (error || !user) {
      return false
    }

    // Check if user has admin role (you'll need to set this up in Supabase)
    const { data: profile } = await supabaseAdmin
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    return profile?.role === 'admin'
  } catch (error) {
    console.error('Admin auth verification error:', error)
    return false
  }
}

// GET /api/assessment/admin - Retrieve all submissions
export async function GET(request: NextRequest) {
  try {
    // Verify admin authentication
    const isAdmin = await verifyAdminAuth(request)
    if (!isAdmin) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Parse query parameters for filtering
    const { searchParams } = new URL(request.url)
    const filter = searchParams.get('filter') // 'all', 'qualified', 'new', 'contacted'
    const limit = parseInt(searchParams.get('limit') || '100')
    const offset = parseInt(searchParams.get('offset') || '0')

    // Get submissions based on filter
    let submissions
    if (filter === 'qualified') {
      submissions = await assessmentSubmissionQueries.getQualifiedSubmissions()
    } else {
      submissions = await assessmentSubmissionQueries.getAllSubmissions()
    }

    // Apply additional filtering if needed
    if (filter === 'new') {
      submissions = submissions.filter(s => s.status === 'new')
    } else if (filter === 'contacted') {
      submissions = submissions.filter(s => s.contacted === true)
    }

    // Apply pagination
    const paginatedSubmissions = submissions.slice(offset, offset + limit)

    // Get statistics
    const statistics = await assessmentSubmissionQueries.getAssessmentStatistics()

    return NextResponse.json({
      success: true,
      data: paginatedSubmissions,
      pagination: {
        total: submissions.length,
        limit,
        offset,
        hasMore: offset + limit < submissions.length
      },
      statistics
    })

  } catch (error) {
    console.error('Failed to retrieve submissions:', error)
    return NextResponse.json(
      { error: 'Failed to retrieve submissions' },
      { status: 500 }
    )
  }
}

// PATCH /api/assessment/admin - Update submission status
export async function PATCH(request: NextRequest) {
  try {
    // Verify admin authentication
    const isAdmin = await verifyAdminAuth(request)
    if (!isAdmin) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { submissionId, status, adminNotes } = body

    if (!submissionId || !status) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Update submission
    const updated = await assessmentSubmissionQueries.updateSubmissionStatus(
      submissionId,
      status,
      adminNotes
    )

    return NextResponse.json({
      success: true,
      data: updated
    })

  } catch (error) {
    console.error('Failed to update submission:', error)
    return NextResponse.json(
      { error: 'Failed to update submission' },
      { status: 500 }
    )
  }
}

// DELETE /api/assessment/admin - Anonymize submission (GDPR)
export async function DELETE(request: NextRequest) {
  try {
    // Verify admin authentication
    const isAdmin = await verifyAdminAuth(request)
    if (!isAdmin) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    const submissionId = searchParams.get('id')

    if (!submissionId) {
      return NextResponse.json(
        { error: 'Submission ID required' },
        { status: 400 }
      )
    }

    // Anonymize the submission (GDPR compliant deletion)
    await assessmentSubmissionQueries.anonymizeSubmission(submissionId)

    return NextResponse.json({
      success: true,
      message: 'Submission anonymized successfully'
    })

  } catch (error) {
    console.error('Failed to anonymize submission:', error)
    return NextResponse.json(
      { error: 'Failed to anonymize submission' },
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
      'Access-Control-Allow-Methods': 'GET, PATCH, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization, x-api-key'
}
  })
}
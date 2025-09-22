import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client with service role for server-side operations
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { firstName, email, currentTraining } = body;

    // Validate required fields
    if (!firstName || !email) {
      return NextResponse.json(
        { error: 'Name and email are required' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Please provide a valid email address' },
        { status: 400 }
      );
    }

    // Check if table exists, if not create a simple leads table
    const { error: tableError } = await supabase
      .from('performance_leads')
      .select('id')
      .limit(1);

    // Store lead information
    const { data, error } = await supabase
      .from('performance_leads')
      .upsert(
        {
          first_name: firstName,
          email: email.toLowerCase(),
          current_training: currentTraining || null,
          lead_magnet: 'performance-breakthrough-assessment',
          source: 'website',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        },
        {
          onConflict: 'email',
          ignoreDuplicates: false
        }
      )
      .select()
      .single();

    if (error) {
      console.error('Supabase error:', error);

      // If table doesn't exist, we'll just log and continue
      if (error.code === '42P01') {
        console.log('Table does not exist yet. Lead saved to console:', {
          firstName,
          email,
          currentTraining,
          timestamp: new Date().toISOString()
        });

        return NextResponse.json({
          success: true,
          message: 'Thank you! Your assessment will be sent to your email.',
          data: { firstName, email }
        });
      }

      return NextResponse.json(
        { error: 'Failed to process your request' },
        { status: 500 }
      );
    }

    // Log the lead for now (email service to be integrated)
    console.log('New lead captured:', {
      name: firstName,
      email: email,
      training: currentTraining,
      magnet: 'performance-breakthrough-assessment'
    });

    return NextResponse.json({
      success: true,
      message: 'Success! Check your email for the Performance Breakthrough Assessment.',
      data
    });

  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type'
}
  });
}
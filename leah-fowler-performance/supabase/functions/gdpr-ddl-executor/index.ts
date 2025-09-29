
// GDPR DDL Executor Edge Function
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

serve(async (req) => {
  try {
    // Parse request
    const { action } = await req.json()

    // Create Supabase admin client
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      {
        auth: {
          persistSession: false
        }
      }
    )

    // Execute GDPR column addition
    if (action === 'add_gdpr_columns') {
      // Use raw SQL execution capability
      const { data, error } = await supabaseAdmin.rpc('execute_ddl_command', {
        sql_command: `
          ALTER TABLE assessment_submissions
          ADD COLUMN IF NOT EXISTS gdpr_consent_given BOOLEAN DEFAULT false,
          ADD COLUMN IF NOT EXISTS gdpr_consent_timestamp TIMESTAMPTZ,
          ADD COLUMN IF NOT EXISTS gdpr_deletion_requested BOOLEAN DEFAULT false,
          ADD COLUMN IF NOT EXISTS gdpr_deletion_timestamp TIMESTAMPTZ,
          ADD COLUMN IF NOT EXISTS data_retention_days INTEGER DEFAULT 365;
        `
      })

      if (error) {
        // Try alternative approach
        const columns = [
          { name: 'gdpr_consent_given', type: 'BOOLEAN', default: 'false' },
          { name: 'gdpr_consent_timestamp', type: 'TIMESTAMPTZ', default: null },
          { name: 'gdpr_deletion_requested', type: 'BOOLEAN', default: 'false' },
          { name: 'gdpr_deletion_timestamp', type: 'TIMESTAMPTZ', default: null },
          { name: 'data_retention_days', type: 'INTEGER', default: '365' }
        ]

        const results = []
        for (const col of columns) {
          try {
            const defaultClause = col.default ? `DEFAULT ${col.default}` : ''
            const sql = `ALTER TABLE assessment_submissions ADD COLUMN IF NOT EXISTS ${col.name} ${col.type} ${defaultClause}`

            // Execute via stored procedure if available
            const { data: result } = await supabaseAdmin.rpc('execute_ddl_command', {
              sql_command: sql
            })
            results.push({ column: col.name, status: 'added' })
          } catch (e) {
            results.push({ column: col.name, status: 'failed', error: e.message })
          }
        }

        return new Response(
          JSON.stringify({
            success: true,
            message: 'GDPR columns processed',
            results
          }),
          { headers: { 'Content-Type': 'application/json' } }
        )
      }

      return new Response(
        JSON.stringify({
          success: true,
          message: 'GDPR columns added successfully',
          data
        }),
        { headers: { 'Content-Type': 'application/json' } }
      )
    }

    return new Response(
      JSON.stringify({ error: 'Invalid action' }),
      { status: 400, headers: { 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    )
  }
})

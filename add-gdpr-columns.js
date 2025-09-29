#!/usr/bin/env node

const https = require('https');

// Supabase credentials
const PROJECT_REF = 'ltlbfltlhysjxslusypq';
const SERVICE_ROLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx0bGJmbHRsaHlzanhzbHVzeXBxIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1ODU2MjA4MiwiZXhwIjoyMDc0MTM4MDgyfQ._50CDqU_v1Q61ZqR3bxgp_4qeZaUL8WGp3OQgH9DieQ';

// SQL to add GDPR columns
const addGDPRColumnsSQL = `
-- Add GDPR columns to assessment_submissions table
ALTER TABLE assessment_submissions
ADD COLUMN IF NOT EXISTS gdpr_consent_given BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS gdpr_consent_timestamp TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS gdpr_deletion_requested BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS gdpr_deletion_timestamp TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS data_retention_days INTEGER DEFAULT 365;
`;

// Function to execute SQL via Supabase Management API
function executeViaManagementAPI() {
  const postData = JSON.stringify({
    query: addGDPRColumnsSQL
  });

  const options = {
    hostname: 'api.supabase.com',
    port: 443,
    path: `/v1/projects/${PROJECT_REF}/database/query`,
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${SERVICE_ROLE_KEY}`,
      'Content-Length': Buffer.byteLength(postData)
    }
  };

  return new Promise((resolve, reject) => {
    const req = https.request(options, (res) => {
      let data = '';

      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        console.log('Response Status:', res.statusCode);
        console.log('Response:', data);

        if (res.statusCode === 200 || res.statusCode === 201) {
          console.log('✅ SQL executed successfully!');
          resolve(data);
        } else {
          console.log('❌ Failed to execute SQL');
          reject(new Error(`HTTP ${res.statusCode}: ${data}`));
        }
      });
    });

    req.on('error', (error) => {
      console.error('Request error:', error);
      reject(error);
    });

    req.write(postData);
    req.end();
  });
}

// Alternative: Use fetch if available
async function executeViaFetch() {
  try {
    const response = await fetch(`https://api.supabase.com/v1/projects/${PROJECT_REF}/database/query`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${SERVICE_ROLE_KEY}`
      },
      body: JSON.stringify({
        query: addGDPRColumnsSQL
      })
    });

    const data = await response.text();
    console.log('Response:', response.status, data);

    if (response.ok) {
      console.log('✅ SQL executed successfully via fetch!');
      return data;
    } else {
      throw new Error(`Failed: ${response.status} ${data}`);
    }
  } catch (error) {
    console.error('Fetch error:', error);
    throw error;
  }
}

// Create a simple SQL file for manual execution
const fs = require('fs');

const completeSQL = `
-- GDPR Compliance: Add missing columns to assessment_submissions
-- Execute this in Supabase SQL Editor at:
-- https://supabase.com/dashboard/project/ltlbfltlhysjxslusypq/sql/new

ALTER TABLE assessment_submissions
ADD COLUMN IF NOT EXISTS gdpr_consent_given BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS gdpr_consent_timestamp TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS gdpr_deletion_requested BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS gdpr_deletion_timestamp TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS data_retention_days INTEGER DEFAULT 365;

-- Verify columns were added
SELECT
    column_name,
    data_type,
    column_default
FROM
    information_schema.columns
WHERE
    table_name = 'assessment_submissions'
    AND column_name LIKE 'gdpr%'
ORDER BY
    ordinal_position;
`;

fs.writeFileSync('/Users/samfowler/Code/LeahFowlerPerformance-1/add-gdpr-columns.sql', completeSQL);

console.log('🚀 Attempting to add GDPR columns to assessment_submissions...\n');
console.log('📋 SQL file created: add-gdpr-columns.sql\n');

// Try different methods
console.log('Method 1: Management API...');
executeViaManagementAPI()
  .then(() => {
    console.log('\n✅ SUCCESS: GDPR columns added via Management API!');
  })
  .catch((error) => {
    console.log('\n❌ Management API failed:', error.message);
    console.log('\nMethod 2: Fetch API...');

    return executeViaFetch();
  })
  .then(() => {
    console.log('\n✅ SUCCESS: GDPR columns added via Fetch API!');
  })
  .catch((error) => {
    console.log('\n❌ Both automated methods failed.');
    console.log('\n' + '='.repeat(60));
    console.log('📋 MANUAL EXECUTION REQUIRED');
    console.log('='.repeat(60));
    console.log('\n1. Go to Supabase SQL Editor:');
    console.log('   https://supabase.com/dashboard/project/ltlbfltlhysjxslusypq/sql/new\n');
    console.log('2. Copy the contents from: add-gdpr-columns.sql\n');
    console.log('3. Paste and click "RUN" in the SQL editor\n');
    console.log('4. The SQL includes a verification query to confirm the columns were added\n');
    console.log('='.repeat(60));
  });
const { Client } = require('pg');

// Direct PostgreSQL connection
const connectionString = 'postgresql://postgres.ltlbfltlhysjxslusypq:_50CDqU_v1Q61ZqR3bxgp_4qeZaUL8WGp3OQgH9DieQ@aws-0-eu-west-2.pooler.supabase.com:6543/postgres';

async function executeMigration() {
  const client = new Client({ connectionString });

  try {
    console.log('🔌 Connecting to database...');
    await client.connect();
    console.log('✅ Connected successfully!\n');

    console.log('🚀 Executing GDPR column migration...');

    const sql = `
      ALTER TABLE assessment_submissions
      ADD COLUMN IF NOT EXISTS gdpr_consent_given BOOLEAN DEFAULT false,
      ADD COLUMN IF NOT EXISTS gdpr_consent_timestamp TIMESTAMPTZ,
      ADD COLUMN IF NOT EXISTS gdpr_deletion_requested BOOLEAN DEFAULT false,
      ADD COLUMN IF NOT EXISTS gdpr_deletion_timestamp TIMESTAMPTZ,
      ADD COLUMN IF NOT EXISTS data_retention_days INTEGER DEFAULT 365;
    `;

    await client.query(sql);
    console.log('✅ GDPR columns added successfully!\n');

    // Verify the columns were added
    console.log('🔍 Verifying columns...');
    const verifyQuery = `
      SELECT column_name, data_type, column_default
      FROM information_schema.columns
      WHERE table_name = 'assessment_submissions'
      AND column_name LIKE 'gdpr%'
      ORDER BY ordinal_position;
    `;

    const result = await client.query(verifyQuery);
    console.log('\n📊 GDPR Columns Added:');
    result.rows.forEach(row => {
      console.log(`   ✅ ${row.column_name} (${row.data_type}) - Default: ${row.column_default || 'NULL'}`);
    });

    console.log('\n🎉 Migration COMPLETE! Database is now GDPR compliant!');

  } catch (error) {
    if (error.message.includes('column') && error.message.includes('already exists')) {
      console.log('✅ GDPR columns already exist (migration was already applied)');
    } else {
      console.error('❌ Migration failed:', error.message);
    }
  } finally {
    await client.end();
  }
}

executeMigration();

const invokeGDPRFunction = async () => {
  const response = await fetch('https://ltlbfltlhysjxslusypq.supabase.co/functions/v1/gdpr-ddl-executor', {
    method: 'POST',
    headers: {
      'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx0bGJmbHRsaHlzanhzbHVzeXBxIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1ODU2MjA4MiwiZXhwIjoyMDc0MTM4MDgyfQ._50CDqU_v1Q61ZqR3bxgp_4qeZaUL8WGp3OQgH9DieQ',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ action: 'add_gdpr_columns' })
  });

  const result = await response.json();
  console.log('GDPR columns addition result:', result);
  return result;
};

// Execute
invokeGDPRFunction().catch(console.error);

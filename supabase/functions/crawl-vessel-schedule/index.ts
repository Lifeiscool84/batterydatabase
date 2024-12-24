import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

async function crawlZimSchedules() {
  console.log('Starting ZIM schedule crawl')
  
  try {
    // Use browserless.io API (they have a generous free tier)
    const response = await fetch('https://chrome.browserless.io/content', {
      method: 'POST',
      headers: {
        'Cache-Control': 'no-cache',
        'Content-Type': 'application/json',
        'Authorization': `Basic ${Deno.env.get('BROWSERLESS_API_KEY')}`
      },
      body: JSON.stringify({
        url: 'https://www.zim.com/schedules/schedule-by-port',
        gotoOptions: {
          waitUntil: 'networkidle0',
          timeout: 30000
        },
        evaluate: `async () => {
          // Wait for form elements
          await new Promise(r => setTimeout(r, 2000));
          
          // Select USA
          const countrySelect = document.querySelector('#country-select');
          countrySelect.value = 'USA';
          countrySelect.dispatchEvent(new Event('change'));
          
          // Wait for ports to load
          await new Promise(r => setTimeout(r, 1000));
          
          // Select Houston
          const portSelect = document.querySelector('#port-select');
          portSelect.value = 'Houston (TX)';
          
          // Set date range
          const startDate = document.querySelector('#start-date');
          startDate.value = new Date().toISOString().split('T')[0];
          
          // Set weeks ahead
          const weeksSelect = document.querySelector('#weeks-ahead');
          weeksSelect.value = '12';
          
          // Click search
          document.querySelector('#search-button').click();
          
          // Wait for results
          await new Promise(r => setTimeout(r, 3000));
          
          // Extract schedule data
          const schedules = [];
          document.querySelectorAll('.schedule-row').forEach(row => {
            const vesselName = row.querySelector('.vessel-name').textContent;
            if (vesselName.startsWith('ZIM')) {
              schedules.push({
                vessel_name: vesselName,
                carrier: 'ZIM',
                departure_date: row.querySelector('.departure-date').textContent,
                arrival_date: row.querySelector('.arrival-date').textContent,
                doc_cutoff_date: row.querySelector('.doc-cutoff').textContent,
                hazmat_doc_cutoff_date: row.querySelector('.hazmat-doc-cutoff').textContent,
                cargo_cutoff_date: row.querySelector('.cargo-cutoff').textContent,
                hazmat_cargo_cutoff_date: row.querySelector('.hazmat-cargo-cutoff').textContent,
                source: 'https://www.zim.com/schedules/schedule-by-port'
              });
            }
          });
          
          return schedules;
        }`
      })
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const schedules = await response.json();
    console.log(`Found ${schedules.length} ZIM schedules`);
    return schedules;
    
  } catch (error) {
    console.error('Error crawling ZIM schedules:', error);
    throw error;
  }
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { automated } = await req.json()
    console.log(`Starting ${automated ? 'automated' : 'manual'} crawl`)

    // Create Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')
    const supabase = createClient(supabaseUrl, supabaseKey)

    // Crawl ZIM schedules
    const schedules = await crawlZimSchedules()

    // Store schedules in database
    const { data, error } = await supabase
      .from('vessel_schedules')
      .upsert(
        schedules.map(schedule => ({
          ...schedule,
          // Use vessel_name and departure_date as unique identifier
          id: `${schedule.vessel_name}-${schedule.departure_date}`
        })),
        { onConflict: 'id' }
      )

    if (error) {
      console.error('Error storing schedules:', error)
      throw error
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: `Successfully crawled and stored ${schedules.length} schedules`,
        data: schedules
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Error processing request:', error)
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('Starting HMM schedule scraping...');
    
    // Use direct HTTP requests to fetch schedules
    const response = await fetch('https://api.hmm21.com/schedules', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${Deno.env.get('HMM_API_KEY')}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const scheduleData = await response.json();
    console.log(`Found ${scheduleData.length} HMM schedules`);

    // Create Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')
    const supabase = createClient(supabaseUrl, supabaseKey)

    // Transform and store schedules in database
    if (scheduleData.length > 0) {
      const schedules = scheduleData.map(schedule => ({
        vessel_name: schedule.vesselName,
        carrier: 'HMM',
        departure_date: new Date(schedule.departureDate),
        arrival_date: new Date(schedule.arrivalDate),
        doc_cutoff_date: new Date(schedule.docCutoff),
        hazmat_doc_cutoff_date: new Date(schedule.hazmatDocCutoff),
        cargo_cutoff_date: new Date(schedule.cargoCutoff),
        hazmat_cargo_cutoff_date: new Date(schedule.hazmatCargoCutoff),
        source: 'https://www.hmm21.com'
      }));

      const { error } = await supabase
        .from('vessel_schedules')
        .upsert(
          schedules.map(schedule => ({
            ...schedule,
            id: `${schedule.vessel_name}-${schedule.departure_date}`
          })),
          { onConflict: 'id' }
        );

      if (error) {
        console.error('Error storing schedules:', error);
        throw error;
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: `Successfully crawled and stored ${scheduleData.length} schedules`,
        data: scheduleData
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error processing request:', error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message,
        stack: error.stack
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }, 
        status: 500 
      }
    );
  }
});

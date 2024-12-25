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
    
    // Get today's date in YYYYMMDD format
    const today = new Date();
    const formattedDate = today.toISOString().split('T')[0].replace(/-/g, '');
    
    // Prepare the request to HMM API
    const response = await fetch('https://apigw.hmm21.com/gateway/ptpSchedule/v1/port-to-port-schedule', {
      method: 'POST',
      headers: {
        'x-Gateway-APIKey': Deno.env.get('HMM_API_KEY') || '',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        fromLocationCode: "USHOU", // Houston port code
        receiveTermCode: "CY",     // Container Yard
        toLocationCode: "KRPUS",   // Busan port code
        deliveryTermCode: "CY",    // Container Yard
        periodDate: formattedDate,
        weekTerm: "4",            // 4 weeks ahead
        webSort: "D",             // Sort by departure date
        webPriority: "A"          // Show all routes
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('HMM API error:', {
        status: response.status,
        statusText: response.statusText,
        body: errorText
      });
      throw new Error(`HMM API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    console.log('HMM API response:', data);

    if (data.resultCode !== "Success") {
      throw new Error(`HMM API returned error: ${data.resultMessage}`);
    }

    // Transform HMM schedule data to our format
    const schedules = data.resultData.map((schedule: any) => ({
      vessel_name: schedule.vessel[0]?.vesselName || '',
      carrier: 'HMM',
      departure_date: schedule.departureDate,
      arrival_date: schedule.arrivalDate,
      doc_cutoff_date: schedule.inlandCutOffTime,
      hazmat_doc_cutoff_date: schedule.inlandCutOffTime, // Using same as regular doc cutoff
      cargo_cutoff_date: schedule.cargoCutOffTime,
      hazmat_cargo_cutoff_date: schedule.cargoCutOffTime, // Using same as regular cargo cutoff
      source: 'HMM_API'
    }));

    // Create Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')
    const supabase = createClient(supabaseUrl, supabaseKey)

    // Store schedules in database
    if (schedules.length > 0) {
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
        message: `Successfully fetched and stored ${schedules.length} schedules`,
        data: schedules
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
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    console.log('Starting ZIM schedule crawl using browse.ai')
    
    // Use browse.ai API to fetch schedules
    const response = await fetch('https://api.browse.ai/v2/robots/default/tasks', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${Deno.env.get('BROWSE_AI_API_KEY')}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        robotId: 'zim-schedule-scraper', // You'll need to create this robot in browse.ai
        inputParameters: {
          origin: 'Houston (TX)',
          weeksAhead: '12'
        }
      })
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    console.log('Browse.ai task created:', result.taskId);

    // Wait for the task to complete (browse.ai processes asynchronously)
    const scheduleData = await pollTaskResult(result.taskId);
    console.log(`Found ${scheduleData.length} ZIM schedules`);

    // Create Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')
    const supabase = createClient(supabaseUrl, supabaseKey)

    // Transform and store schedules in database
    if (scheduleData.length > 0) {
      const schedules = scheduleData.map(schedule => ({
        vessel_name: schedule.vesselName,
        carrier: 'ZIM',
        departure_date: new Date(schedule.departureDate),
        arrival_date: new Date(schedule.arrivalDate),
        doc_cutoff_date: new Date(schedule.docCutoff),
        hazmat_doc_cutoff_date: new Date(schedule.hazmatDocCutoff),
        cargo_cutoff_date: new Date(schedule.cargoCutoff),
        hazmat_cargo_cutoff_date: new Date(schedule.hazmatCargoCutoff),
        source: 'https://www.zim.com/schedules/schedule-by-port'
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
      JSON.stringify({ success: false, error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

// Helper function to poll for task results
async function pollTaskResult(taskId: string, maxAttempts = 10): Promise<any[]> {
  let attempts = 0;
  
  while (attempts < maxAttempts) {
    const response = await fetch(`https://api.browse.ai/v2/tasks/${taskId}`, {
      headers: {
        'Authorization': `Bearer ${Deno.env.get('BROWSE_AI_API_KEY')}`
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    
    if (result.status === 'completed') {
      return result.data.schedules || [];
    } else if (result.status === 'failed') {
      throw new Error('Task failed: ' + result.error);
    }

    // Wait 5 seconds before next attempt
    await new Promise(resolve => setTimeout(resolve, 5000));
    attempts++;
  }

  throw new Error('Timeout waiting for task completion');
}
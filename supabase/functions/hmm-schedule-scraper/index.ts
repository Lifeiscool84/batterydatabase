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
    console.log('Starting HMM schedule scraping using browse.ai...');
    
    // Use browse.ai API to fetch schedules
    const response = await fetch('https://api.browse.ai/v2/robots/8f3e9c3f-f8c7-4d6c-9e9c-3ff8c74d6c9e/tasks', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${Deno.env.get('BROWSE_AI_API_KEY')}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        inputParameters: {
          origin: 'Houston',
          destination: 'Busan',
          weeksAhead: '8'
        }
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Browse.ai API error:', {
        status: response.status,
        statusText: response.statusText,
        body: errorText
      });
      throw new Error(`Browse.ai API error: ${response.status} ${response.statusText} - ${errorText}`);
    }

    const result = await response.json();
    console.log('Browse.ai task created:', result.taskId);

    // Wait for the task to complete
    const scheduleData = await pollTaskResult(result.taskId);
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

// Helper function to poll for task results
async function pollTaskResult(taskId: string, maxAttempts = 10): Promise<any[]> {
  let attempts = 0;
  
  while (attempts < maxAttempts) {
    console.log(`Polling attempt ${attempts + 1} for task ${taskId}`);
    
    const response = await fetch(`https://api.browse.ai/v2/tasks/${taskId}`, {
      headers: {
        'Authorization': `Bearer ${Deno.env.get('BROWSE_AI_API_KEY')}`
      }
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Error polling task:', {
        status: response.status,
        statusText: response.statusText,
        body: errorText
      });
      throw new Error(`HTTP error! status: ${response.status} - ${errorText}`);
    }

    const result = await response.json();
    console.log('Task status:', result.status);
    
    if (result.status === 'completed') {
      console.log('Task completed successfully');
      return result.data.schedules || [];
    } else if (result.status === 'failed') {
      console.error('Task failed:', result.error);
      throw new Error('Task failed: ' + result.error);
    }

    // Wait 5 seconds before next attempt
    await new Promise(resolve => setTimeout(resolve, 5000));
    attempts++;
  }

  throw new Error('Timeout waiting for task completion');
}
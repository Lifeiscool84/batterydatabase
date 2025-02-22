import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import puppeteer from "https://deno.land/x/puppeteer@16.2.0/mod.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    console.log('Starting ZIM schedule scraping...');
    
    const browser = await puppeteer.launch({
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    
    const page = await browser.newPage();
    
    await page.goto('https://zimchina.com/schedules/point-to-point', {
      waitUntil: 'networkidle0',
      timeout: 60000,
    });

    console.log('Page loaded, extracting schedule data...');

    await page.waitForSelector('table', { timeout: 30000 });

    const schedules = await page.evaluate(() => {
      const rows = Array.from(document.querySelectorAll('table tr'));
      return rows.slice(1).map(row => {
        const cells = Array.from(row.querySelectorAll('td'));
        return {
          vessel_name: cells[0]?.textContent?.trim() || '',
          departure_date: cells[1]?.textContent?.trim() || '',
          arrival_date: cells[2]?.textContent?.trim() || '',
          doc_cutoff: cells[3]?.textContent?.trim() || '',
          cargo_cutoff: cells[4]?.textContent?.trim() || ''
        };
      }).filter(schedule => schedule.vessel_name && schedule.departure_date);
    });

    await browser.close();
    console.log(`Extracted ${schedules.length} schedules`);

    const transformedSchedules = schedules.map(schedule => ({
      vessel_name: schedule.vessel_name,
      carrier: 'ZIM' as const, // Type assertion to fix carrier type
      departure_date: new Date(schedule.departure_date).toISOString(),
      arrival_date: new Date(schedule.arrival_date).toISOString(),
      doc_cutoff_date: new Date(schedule.doc_cutoff).toISOString(),
      hazmat_doc_cutoff_date: new Date(schedule.doc_cutoff).toISOString(),
      cargo_cutoff_date: new Date(schedule.cargo_cutoff).toISOString(),
      hazmat_cargo_cutoff_date: new Date(schedule.cargo_cutoff).toISOString(),
      source: 'https://zimchina.com/schedules/point-to-point'
    }));

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const { error } = await supabase
      .from('vessel_schedules')
      .upsert(
        transformedSchedules,
        { onConflict: 'vessel_name,departure_date' }
      );

    if (error) throw error;

    return new Response(
      JSON.stringify({
        success: true,
        message: `Successfully scraped and stored ${transformedSchedules.length} schedules`,
        data: transformedSchedules
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error processing request:', error);
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    );
  }
});
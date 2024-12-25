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
    console.log('Starting HMM schedule scraping...');
    
    const browser = await puppeteer.launch({
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    
    const page = await browser.newPage();
    
    // Navigate to HMM schedules page
    await page.goto('https://www.hmm21.com/company.do', {
      waitUntil: 'networkidle0',
      timeout: 60000,
    });

    console.log('Page loaded, filling search form...');

    // Fill the form
    await page.type('input[name="from"]', 'NEW YORK, NY');
    await page.type('input[name="to"]', 'BUSAN, KOREA');
    
    // Select 8 weeks duration
    await page.select('select[name="duration"]', '8');
    
    // Click search button
    await page.click('button[type="submit"]');

    // Wait for results table
    await page.waitForSelector('table.schedule-table', { timeout: 30000 });

    console.log('Search results loaded, extracting data...');

    // Extract schedule data
    const schedules = await page.evaluate(() => {
      const rows = Array.from(document.querySelectorAll('table.schedule-table tbody tr'));
      return rows.map(row => {
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

    // Transform dates and create final schedule objects
    const transformedSchedules = schedules.map(schedule => ({
      vessel_name: schedule.vessel_name,
      carrier: 'HMM' as const, // Type assertion to fix carrier type
      departure_date: new Date(schedule.departure_date).toISOString(),
      arrival_date: new Date(schedule.arrival_date).toISOString(),
      doc_cutoff_date: new Date(schedule.doc_cutoff).toISOString(),
      hazmat_doc_cutoff_date: new Date(schedule.doc_cutoff).toISOString(),
      cargo_cutoff_date: new Date(schedule.cargo_cutoff).toISOString(),
      hazmat_cargo_cutoff_date: new Date(schedule.cargo_cutoff).toISOString(),
      source: 'https://www.hmm21.com'
    }));

    // Store in Supabase
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
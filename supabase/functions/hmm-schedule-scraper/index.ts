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
    console.log('Navigating to HMM website...');
    await page.goto('https://www.hmm21.com/company.do', {
      waitUntil: 'networkidle0',
      timeout: 60000,
    });

    console.log('Page loaded, filling search form...');

    // Fill the form with explicit wait times
    await page.waitForSelector('input[name="from"]');
    await page.type('input[name="from"]', 'NEW YORK, NY', { delay: 100 });
    
    await page.waitForSelector('input[name="to"]');
    await page.type('input[name="to"]', 'BUSAN, KOREA', { delay: 100 });
    
    // Select 8 weeks duration
    await page.waitForSelector('select[name="duration"]');
    await page.select('select[name="duration"]', '8');
    
    console.log('Form filled, clicking search button...');
    
    // Click search button with explicit wait
    await page.waitForSelector('button[type="submit"]');
    await page.click('button[type="submit"]');

    // Wait for results table with longer timeout
    console.log('Waiting for results table...');
    await page.waitForSelector('table.schedule-table', { timeout: 30000 });

    console.log('Results loaded, extracting data...');

    // Extract schedule data with detailed logging
    const schedules = await page.evaluate(() => {
      const rows = Array.from(document.querySelectorAll('table.schedule-table tbody tr'));
      console.log(`Found ${rows.length} schedule rows`);
      
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
      carrier: 'HMM',
      departure_date: new Date(schedule.departure_date).toISOString(),
      arrival_date: new Date(schedule.arrival_date).toISOString(),
      doc_cutoff_date: new Date(schedule.doc_cutoff).toISOString(),
      hazmat_doc_cutoff_date: new Date(schedule.doc_cutoff).toISOString(),
      cargo_cutoff_date: new Date(schedule.cargo_cutoff).toISOString(),
      hazmat_cargo_cutoff_date: new Date(schedule.cargo_cutoff).toISOString(),
      source: 'https://www.hmm21.com'
    }));

    // Store in Supabase with detailed logging
    console.log('Storing schedules in Supabase...');
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    for (const schedule of transformedSchedules) {
      const { error } = await supabase
        .from('vessel_schedules')
        .upsert(schedule, {
          onConflict: 'vessel_name,departure_date'
        });

      if (error) {
        console.error('Error storing schedule:', error);
        throw error;
      }
    }

    console.log('Successfully stored all schedules');

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
      JSON.stringify({ 
        success: false, 
        error: error.message,
        stack: error.stack // Including stack trace for debugging
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    );
  }
});
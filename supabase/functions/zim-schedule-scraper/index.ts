import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import puppeteer from "https://deno.land/x/puppeteer@16.2.0/mod.ts";

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
    console.log('Starting ZIM schedule scraping...');
    
    // Launch browser
    const browser = await puppeteer.launch({
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    
    const page = await browser.newPage();
    
    // Navigate to ZIM schedules page
    await page.goto('https://zimchina.com/schedules/point-to-point', {
      waitUntil: 'networkidle0',
      timeout: 30000,
    });

    console.log('Page loaded, starting data extraction...');

    // Extract schedule data
    const schedules = await page.evaluate(() => {
      const rows = document.querySelectorAll('table tr');
      return Array.from(rows, row => {
        const cells = row.querySelectorAll('td');
        return Array.from(cells, cell => cell.textContent.trim());
      }).filter(row => row.length > 0); // Filter out empty rows
    });

    await browser.close();
    console.log(`Extracted ${schedules.length} schedules`);

    // Transform the data to match our vessel_schedules table structure
    const transformedSchedules = schedules.map(schedule => ({
      vessel_name: schedule[0],
      carrier: 'ZIM',
      departure_date: new Date(schedule[1]),
      arrival_date: new Date(schedule[2]),
      doc_cutoff_date: new Date(schedule[3]),
      hazmat_doc_cutoff_date: new Date(schedule[3]), // Using same as doc cutoff if not provided
      cargo_cutoff_date: new Date(schedule[4]),
      hazmat_cargo_cutoff_date: new Date(schedule[4]), // Using same as cargo cutoff if not provided
      source: 'https://zimchina.com/schedules/point-to-point'
    }));

    // Store in Supabase
    const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? '';
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';
    const supabase = createClient(supabaseUrl, supabaseKey);

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
      { 
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json'
        } 
      }
    );

  } catch (error) {
    console.error('Error processing request:', error);
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { 
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json'
        },
        status: 500
      }
    );
  }
});
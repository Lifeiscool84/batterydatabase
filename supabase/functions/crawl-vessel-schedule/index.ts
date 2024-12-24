import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import puppeteer from 'https://deno.land/x/puppeteer@16.2.0/mod.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

async function crawlZimSchedules() {
  const browser = await puppeteer.launch()
  const page = await browser.newPage()
  
  try {
    console.log('Starting ZIM schedule crawl')
    
    // Navigate to ZIM schedules page
    await page.goto('https://zimchina.com/schedules/schedule-by-port')
    
    // Select USA in country dropdown
    await page.select('#country-select', 'USA')
    await page.waitForTimeout(1000) // Wait for port options to load
    
    // Select Houston port
    await page.select('#port-select', 'Houston (TX)')
    
    // Set start date to today
    const today = new Date().toISOString().split('T')[0]
    await page.$eval('#start-date', (el, value) => el.value = value, today)
    
    // Set weeks ahead to 12
    await page.select('#weeks-ahead', '12')
    
    // Click search button
    await page.click('#search-button')
    await page.waitForSelector('.schedule-results')
    
    // Extract schedule data
    const schedules = await page.evaluate(() => {
      const rows = document.querySelectorAll('.schedule-row')
      return Array.from(rows).map(row => {
        const vesselName = row.querySelector('.vessel-name').textContent
        // Only include vessels starting with "ZIM"
        if (!vesselName.startsWith('ZIM')) return null
        
        return {
          vessel_name: vesselName,
          carrier: 'ZIM',
          departure_date: row.querySelector('.departure-date').textContent,
          arrival_date: row.querySelector('.arrival-date').textContent,
          doc_cutoff_date: row.querySelector('.doc-cutoff').textContent,
          hazmat_doc_cutoff_date: row.querySelector('.hazmat-doc-cutoff').textContent,
          cargo_cutoff_date: row.querySelector('.cargo-cutoff').textContent,
          hazmat_cargo_cutoff_date: row.querySelector('.hazmat-cargo-cutoff').textContent,
          source: 'https://zimchina.com/schedules/schedule-by-port'
        }
      }).filter(schedule => schedule !== null)
    })
    
    console.log(`Found ${schedules.length} ZIM schedules`)
    return schedules
    
  } catch (error) {
    console.error('Error crawling ZIM schedules:', error)
    throw error
  } finally {
    await browser.close()
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
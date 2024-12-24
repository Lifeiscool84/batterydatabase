import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import FirecrawlApp from 'npm:@mendable/firecrawl-js'
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
    const { url, carrier } = await req.json()
    console.log(`Starting crawl for ${carrier} at URL: ${url}`)

    const firecrawl = new FirecrawlApp({ 
      apiKey: Deno.env.get('FIRECRAWL_API_KEY') 
    })

    const crawlResponse = await firecrawl.crawlUrl(url, {
      limit: 100,
      scrapeOptions: {
        formats: ['markdown', 'html'],
      }
    })

    if (!crawlResponse.success) {
      console.error('Crawl failed:', crawlResponse.error)
      return new Response(
        JSON.stringify({ success: false, error: crawlResponse.error }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Create Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')
    const supabase = createClient(supabaseUrl, supabaseKey)

    // Process and store the crawled data
    const scheduleData = crawlResponse.data.map(item => ({
      vessel_name: item.title || 'Unknown Vessel',
      carrier: carrier,
      departure_date: new Date().toISOString(), // You'll need to extract this from the crawled data
      arrival_date: new Date().toISOString(), // You'll need to extract this from the crawled data
      doc_cutoff_date: new Date().toISOString(),
      hazmat_doc_cutoff_date: new Date().toISOString(),
      cargo_cutoff_date: new Date().toISOString(),
      hazmat_cargo_cutoff_date: new Date().toISOString(),
      source: url
    }))

    // Insert the processed data into the vessel_schedules table
    const { data, error } = await supabase
      .from('vessel_schedules')
      .insert(scheduleData)

    if (error) {
      console.error('Error storing schedules:', error)
      throw error
    }

    return new Response(
      JSON.stringify({
        success: true,
        status: crawlResponse.status,
        completed: crawlResponse.completed,
        total: crawlResponse.total,
        creditsUsed: crawlResponse.creditsUsed,
        expiresAt: crawlResponse.expiresAt,
        data: scheduleData
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
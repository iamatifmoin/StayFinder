
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const authHeader = req.headers.get('Authorization')!
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { auth: { autoRefreshToken: false, persistSession: false } }
    )
    supabase.auth.setSession({ access_token: authHeader.replace('Bearer ', ''), refresh_token: '' })

    const url = new URL(req.url)
    const pathSegments = url.pathname.split('/').filter(Boolean)
    
    if (req.method === 'GET') {
      // GET /bookings/user/:userId or /bookings/host/:hostId
      const { data: profile } = await supabase
        .from('profiles')
        .select('id')
        .single()

      if (!profile) throw new Error('User not found')

      let query = supabase
        .from('bookings')
        .select(`
          *,
          listing:listings(*),
          guest:profiles!bookings_guest_id_fkey(full_name, email)
        `)

      if (pathSegments[1] === 'user') {
        query = query.eq('guest_id', profile.id)
      } else if (pathSegments[1] === 'host') {
        query = query.in('listing_id', 
          supabase
            .from('listings')
            .select('id')
            .eq('host_id', profile.id)
        )
      }

      const { data, error } = await query.order('created_at', { ascending: false })

      if (error) throw error

      return new Response(JSON.stringify(data), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    } else if (req.method === 'POST') {
      // POST /bookings - Create new booking
      const booking = await req.json()
      
      // Get guest profile
      const { data: profile } = await supabase
        .from('profiles')
        .select('id')
        .single()

      if (!profile) throw new Error('User not found')

      const bookingData = {
        ...booking,
        guest_id: profile.id
      }
      
      const { data, error } = await supabase
        .from('bookings')
        .insert([bookingData])
        .select(`
          *,
          listing:listings(*),
          guest:profiles!bookings_guest_id_fkey(full_name, email)
        `)
        .single()

      if (error) throw error

      return new Response(JSON.stringify(data), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    return new Response('Not Found', { status: 404, headers: corsHeaders })
  } catch (error) {
    console.error('Error:', error)
    return new Response(JSON.stringify({ error: error.message }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})

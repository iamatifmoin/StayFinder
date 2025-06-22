import { serve } from "https://deo.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? "",
      { auth: { autoRefreshToken: false, persistSession: false } }
    );

    const authHeader = req.headers.get("Authorization")!;
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? "",
      { auth: { autoRefreshToken: false, persistSession: false } }
    );
    supabase.auth.setSession({
      access_token: authHeader.replace("Bearer ", ""),
      refresh_token: "",
    });

    const url = new URL(req.url);
    const pathSegments = url.pathname.split("/").filter(Boolean);

    if (req.method === "GET") {
      if (pathSegments.length === 2) {
        // GET /listings - Get all listings with filters
        const { city, minPrice, maxPrice, guests, type } = Object.fromEntries(
          url.searchParams
        );

        let query = supabaseClient
          .from("listings")
          .select(
            `
            *,
            host:profiles!listings_host_id_fkey(full_name, avatar_url),
            reviews(rating)
          `
          )
          .eq("is_active", true);

        if (city) query = query.ilike("city", `%${city}%`);
        if (minPrice) query = query.gte("price_per_night", parseInt(minPrice));
        if (maxPrice) query = query.lte("price_per_night", parseInt(maxPrice));
        if (guests) query = query.gte("guests", parseInt(guests));
        if (type) query = query.eq("type", type);

        const { data, error } = await query;

        if (error) throw error;

        // Calculate average rating for each listing
        const listingsWithRating = data.map((listing) => {
          const ratings = listing.reviews.map((r: any) => r.rating);
          const avgRating =
            ratings.length > 0
              ? ratings.reduce((a: number, b: number) => a + b, 0) /
                ratings.length
              : 0;
          return {
            ...listing,
            rating: Math.round(avgRating * 10) / 10,
            reviewCount: ratings.length,
          };
        });

        return new Response(JSON.stringify(listingsWithRating), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      } else if (pathSegments.length === 3) {
        // GET /listings/:id - Get single listing
        const listingId = pathSegments[2];

        const { data, error } = await supabaseClient
          .from("listings")
          .select(
            `
            *,
            host:profiles!listings_host_id_fkey(full_name, avatar_url, phone),
            reviews(rating, comment, created_at, reviewer:profiles!reviews_reviewer_id_fkey(full_name, avatar_url))
          `
          )
          .eq("id", listingId)
          .eq("is_active", true)
          .single();

        if (error) throw error;

        const ratings = data.reviews.map((r: any) => r.rating);
        const avgRating =
          ratings.length > 0
            ? ratings.reduce((a: number, b: number) => a + b, 0) /
              ratings.length
            : 0;

        const listingWithRating = {
          ...data,
          rating: Math.round(avgRating * 10) / 10,
          reviewCount: ratings.length,
        };

        return new Response(JSON.stringify(listingWithRating), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
    } else if (req.method === "POST") {
      // POST /listings - Create new listing (host only)
      const listing = await req.json();

      const { data, error } = await supabase
        .from("listings")
        .insert([listing])
        .select()
        .single();

      if (error) throw error;

      return new Response(JSON.stringify(data), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response("Not Found", { status: 404, headers: corsHeaders });
  } catch (error) {
    console.error("Error:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});

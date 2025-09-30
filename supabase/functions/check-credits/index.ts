import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const supabaseClient = createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
    { auth: { persistSession: false } }
  );

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) throw new Error("No authorization header");

    const token = authHeader.replace("Bearer ", "");
    const { data: userData, error: userError } = await supabaseClient.auth.getUser(token);
    if (userError) throw userError;
    const user = userData.user;
    if (!user) throw new Error("User not authenticated");

    console.log("[CHECK-CREDITS] Checking credits for user:", user.id);

    // Get user credits
    const { data: credits, error: creditsError } = await supabaseClient
      .from("user_credits")
      .select("*")
      .eq("user_id", user.id)
      .single();

    if (creditsError) {
      console.error("[CHECK-CREDITS] Error fetching credits:", creditsError);
      // If no credits record exists, create one with 5 free credits
      const { data: newCredits, error: insertError } = await supabaseClient
        .from("user_credits")
        .insert({
          user_id: user.id,
          credits_balance: 5,
        })
        .select()
        .single();

      if (insertError) throw insertError;

      return new Response(
        JSON.stringify({
          credits_balance: 5,
          total_credits_purchased: 0,
          total_images_downloaded: 0,
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log("[CHECK-CREDITS] Credits found:", credits);

    return new Response(
      JSON.stringify({
        credits_balance: credits.credits_balance,
        total_credits_purchased: credits.total_credits_purchased,
        total_images_downloaded: credits.total_images_downloaded,
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("[CHECK-CREDITS] Error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});

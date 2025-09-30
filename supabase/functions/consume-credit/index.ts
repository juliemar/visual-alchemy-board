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

    const { node_id } = await req.json();
    console.log("[CONSUME-CREDIT] User:", user.id, "Node:", node_id);

    // Check if already downloaded
    const { data: node, error: nodeError } = await supabaseClient
      .from("nodes")
      .select("downloaded_at, downloaded_by")
      .eq("id", node_id)
      .single();

    if (nodeError) throw nodeError;

    if (node.downloaded_at && node.downloaded_by === user.id) {
      console.log("[CONSUME-CREDIT] Already downloaded by this user");
      return new Response(
        JSON.stringify({ success: true, already_downloaded: true }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Get current credits with row lock to prevent race conditions
    const { data: currentCredits, error: fetchError } = await supabaseClient
      .from("user_credits")
      .select("*")
      .eq("user_id", user.id)
      .single();

    if (fetchError) throw fetchError;

    if (currentCredits.credits_balance < 1) {
      console.log("[CONSUME-CREDIT] Insufficient credits");
      return new Response(
        JSON.stringify({ error: "Insufficient credits" }),
        { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const newBalance = currentCredits.credits_balance - 1;
    const newTotalDownloaded = currentCredits.total_images_downloaded + 1;

    // Update credits
    const { error: updateError } = await supabaseClient
      .from("user_credits")
      .update({
        credits_balance: newBalance,
        total_images_downloaded: newTotalDownloaded,
      })
      .eq("user_id", user.id);

    if (updateError) throw updateError;

    // Mark node as downloaded
    const { error: nodeUpdateError } = await supabaseClient
      .from("nodes")
      .update({
        downloaded_at: new Date().toISOString(),
        downloaded_by: user.id,
      })
      .eq("id", node_id);

    if (nodeUpdateError) {
      console.error("[CONSUME-CREDIT] Node update error:", nodeUpdateError);
    }

    // Log transaction
    const { error: transactionError } = await supabaseClient
      .from("credit_transactions")
      .insert({
        user_id: user.id,
        transaction_type: "download",
        credits_amount: -1,
        credits_balance_after: newBalance,
        image_node_id: node_id,
      });

    if (transactionError) {
      console.error("[CONSUME-CREDIT] Transaction log error:", transactionError);
    }

    console.log("[CONSUME-CREDIT] Credit consumed successfully. New balance:", newBalance);

    return new Response(
      JSON.stringify({
        success: true,
        new_balance: newBalance,
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("[CONSUME-CREDIT] Error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});

import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@18.5.0";
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

    const { session_id } = await req.json();
    console.log("[VERIFY-PAYMENT] Verifying session:", session_id);

    const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") || "", {
      apiVersion: "2025-08-27.basil",
    });

    // Retrieve the session
    const session = await stripe.checkout.sessions.retrieve(session_id);

    if (session.payment_status !== "paid") {
      throw new Error("Payment not completed");
    }

    const creditsToAdd = parseInt(session.metadata?.credits || "0");
    if (creditsToAdd === 0) {
      throw new Error("Invalid credits amount");
    }

    console.log("[VERIFY-PAYMENT] Adding credits:", creditsToAdd);

    // Get current credits
    const { data: currentCredits, error: fetchError } = await supabaseClient
      .from("user_credits")
      .select("*")
      .eq("user_id", user.id)
      .single();

    if (fetchError) throw fetchError;

    const newBalance = currentCredits.credits_balance + creditsToAdd;
    const newTotalPurchased = currentCredits.total_credits_purchased + creditsToAdd;

    // Update credits
    const { error: updateError } = await supabaseClient
      .from("user_credits")
      .update({
        credits_balance: newBalance,
        total_credits_purchased: newTotalPurchased,
      })
      .eq("user_id", user.id);

    if (updateError) throw updateError;

    // Log transaction
    const { error: transactionError } = await supabaseClient
      .from("credit_transactions")
      .insert({
        user_id: user.id,
        transaction_type: "purchase",
        credits_amount: creditsToAdd,
        credits_balance_after: newBalance,
        stripe_payment_intent_id: session.payment_intent as string,
        metadata: {
          session_id: session_id,
          amount_paid: session.amount_total,
        },
      });

    if (transactionError) {
      console.error("[VERIFY-PAYMENT] Transaction log error:", transactionError);
    }

    console.log("[VERIFY-PAYMENT] Credits added successfully");

    return new Response(
      JSON.stringify({
        success: true,
        credits_added: creditsToAdd,
        new_balance: newBalance,
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("[VERIFY-PAYMENT] Error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});

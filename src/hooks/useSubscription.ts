import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface Subscription {
  subscribed: boolean;
  plan: "free" | "pro";
  subscription_end?: string;
}

export const useSubscription = () => {
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const checkSubscription = async () => {
    try {
      const { data, error } = await supabase.functions.invoke("check-subscription");
      
      if (error) throw error;
      
      setSubscription(data);
    } catch (error) {
      console.error("Error checking subscription:", error);
      setSubscription({ subscribed: false, plan: "free" });
    } finally {
      setLoading(false);
    }
  };

  const checkBoardLimit = async () => {
    const { data: boards } = await supabase
      .from("boards")
      .select("id");
    
    const boardCount = boards?.length || 0;
    
    if (!subscription) return { canCreate: false, boardCount, limit: 2 };
    
    const limit = subscription.plan === "pro" ? 999 : 2;
    return {
      canCreate: boardCount < limit,
      boardCount,
      limit,
    };
  };

  const checkNodeLimit = async (boardId: string) => {
    const { data: nodes } = await supabase
      .from("nodes")
      .select("id")
      .eq("board_id", boardId);
    
    const nodeCount = nodes?.length || 0;
    
    if (!subscription) return { canAdd: false, nodeCount, limit: 7 };
    
    const limit = subscription.plan === "pro" ? 30 : 7;
    return {
      canAdd: nodeCount < limit,
      nodeCount,
      limit,
    };
  };

  const upgradeToPro = async () => {
    try {
      const { data, error } = await supabase.functions.invoke("create-checkout");
      
      if (error) throw error;
      
      if (data?.url) {
        window.open(data.url, "_blank");
      }
    } catch (error: any) {
      toast({
        title: "Erro ao processar upgrade",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    checkSubscription();
    
    // Check subscription every minute
    const interval = setInterval(checkSubscription, 60000);
    
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange(() => {
      checkSubscription();
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  return {
    subscription,
    loading,
    checkSubscription,
    checkBoardLimit,
    checkNodeLimit,
    upgradeToPro,
  };
};

import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface Subscription {
  subscribed: boolean;
  plan: "free" | "pro";
  subscription_end?: string;
}

export const useSubscription = () => {
  // Simplified - no actual subscription check, just allow everything for now
  const [subscription, setSubscription] = useState<Subscription>({ 
    subscribed: true, 
    plan: "pro" 
  });
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const checkBoardLimit = async () => {
    const { data: boards } = await supabase
      .from("boards")
      .select("id");
    
    const boardCount = boards?.length || 0;
    
    // No limits for now - allow unlimited boards
    return {
      canCreate: true,
      boardCount,
      limit: 999,
    };
  };

  const checkNodeLimit = async (boardId: string) => {
    const { data: nodes } = await supabase
      .from("nodes")
      .select("id")
      .eq("board_id", boardId);
    
    const nodeCount = nodes?.length || 0;
    
    // No limits for now - allow unlimited nodes
    return {
      canAdd: true,
      nodeCount,
      limit: 999,
    };
  };

  const upgradeToPro = async () => {
    toast({
      title: "Already Pro",
      description: "You have unlimited access",
    });
  };

  return {
    subscription,
    loading,
    checkSubscription: async () => {}, // No-op
    checkBoardLimit,
    checkNodeLimit,
    upgradeToPro,
  };
};

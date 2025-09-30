import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface Credits {
  balance: number;
  totalPurchased: number;
  totalDownloaded: number;
}

export const useCredits = () => {
  const [credits, setCredits] = useState<Credits | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const checkCredits = async () => {
    try {
      // Check if user is authenticated
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        // Not authenticated - show 5 free credits (visual only)
        setCredits({ balance: 5, totalPurchased: 0, totalDownloaded: 0 });
        setLoading(false);
        return;
      }

      const { data, error } = await supabase.functions.invoke("check-credits");
      
      if (error) throw error;
      
      setCredits({
        balance: data.credits_balance,
        totalPurchased: data.total_credits_purchased,
        totalDownloaded: data.total_images_downloaded,
      });
    } catch (error) {
      console.error("Error checking credits:", error);
      setCredits({ balance: 5, totalPurchased: 0, totalDownloaded: 0 });
    } finally {
      setLoading(false);
    }
  };

  const purchaseCredits = async (creditAmount: 1 | 5 | 10 | 100) => {
    try {
      const { data, error } = await supabase.functions.invoke("purchase-credits", {
        body: { credits: creditAmount }
      });
      
      if (error) throw error;
      
      if (data?.url) {
        window.open(data.url, "_blank");
      }
    } catch (error: any) {
      toast({
        title: "Error processing purchase",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const consumeCredit = async (nodeId: string): Promise<{ success: boolean; needsAuth: boolean }> => {
    try {
      // Check if user is authenticated
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        // User needs to authenticate to download
        return { success: false, needsAuth: true };
      }

      const { data, error } = await supabase.functions.invoke("consume-credit", {
        body: { node_id: nodeId }
      });
      
      // Check for insufficient credits error (status 402)
      if (error) {
        const errorMessage = error.message || "";
        if (errorMessage.includes("Insufficient credits") || error.context?.status === 402) {
          toast({
            title: "Insufficient credits",
            description: "You need to purchase more credits to download this image.",
            variant: "destructive",
          });
          return { success: false, needsAuth: false };
        }
        console.error("Error consuming credit:", error);
        throw error;
      }
      
      if (data?.already_downloaded) {
        toast({
          title: "Already downloaded",
          description: "You have already downloaded this image before.",
        });
        // Still return success so download proceeds
        return { success: true, needsAuth: false };
      }

      // Refresh credits after consumption
      await checkCredits();
      
      if (data?.new_balance !== undefined) {
        toast({
          title: "Credit consumed",
          description: `New balance: ${data.new_balance} credits`,
        });
      }
      
      return { success: true, needsAuth: false };
    } catch (error: any) {
      console.error("Exception in consumeCredit:", error);
      toast({
        title: "Error consuming credit",
        description: error.message || "Unknown error",
        variant: "destructive",
      });
      return { success: false, needsAuth: false };
    }
  };

  useEffect(() => {
    checkCredits();
    
    // Check credits every minute
    const interval = setInterval(checkCredits, 60000);
    
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange(() => {
      checkCredits();
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  return {
    credits,
    loading,
    checkCredits,
    purchaseCredits,
    consumeCredit,
  };
};

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
        title: "Erro ao processar compra",
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
            title: "Créditos insuficientes",
            description: "Você precisa comprar mais créditos para baixar esta imagem.",
            variant: "destructive",
          });
          return { success: false, needsAuth: false };
        }
        console.error("Error consuming credit:", error);
        throw error;
      }
      
      if (data?.already_downloaded) {
        toast({
          title: "Imagem já baixada",
          description: "Você já baixou esta imagem antes.",
        });
        // Still return success so download proceeds
        return { success: true, needsAuth: false };
      }

      // Refresh credits after consumption
      await checkCredits();
      
      if (data?.new_balance !== undefined) {
        toast({
          title: "Crédito consumido",
          description: `Novo saldo: ${data.new_balance} créditos`,
        });
      }
      
      return { success: true, needsAuth: false };
    } catch (error: any) {
      console.error("Exception in consumeCredit:", error);
      toast({
        title: "Erro ao consumir crédito",
        description: error.message || "Erro desconhecido",
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

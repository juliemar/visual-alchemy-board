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
      const { data, error } = await supabase.functions.invoke("check-credits");
      
      if (error) throw error;
      
      setCredits({
        balance: data.credits_balance,
        totalPurchased: data.total_credits_purchased,
        totalDownloaded: data.total_images_downloaded,
      });
    } catch (error) {
      console.error("Error checking credits:", error);
      setCredits({ balance: 0, totalPurchased: 0, totalDownloaded: 0 });
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

  const consumeCredit = async (nodeId: string): Promise<boolean> => {
    try {
      const { data, error } = await supabase.functions.invoke("consume-credit", {
        body: { node_id: nodeId }
      });
      
      if (error) {
        if (error.message === "Insufficient credits") {
          toast({
            title: "Créditos insuficientes",
            description: "Você precisa comprar mais créditos para baixar esta imagem.",
            variant: "destructive",
          });
          return false;
        }
        throw error;
      }
      
      if (data?.already_downloaded) {
        toast({
          title: "Imagem já baixada",
          description: "Você já baixou esta imagem antes.",
        });
        return true;
      }

      // Refresh credits after consumption
      await checkCredits();
      
      toast({
        title: "Crédito consumido",
        description: `Novo saldo: ${data.new_balance} créditos`,
      });
      
      return true;
    } catch (error: any) {
      toast({
        title: "Erro ao consumir crédito",
        description: error.message,
        variant: "destructive",
      });
      return false;
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

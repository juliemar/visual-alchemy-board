import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { CheckCircle, Loader2, Sparkles } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function PaymentSuccess() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [verifying, setVerifying] = useState(true);
  const [creditsAdded, setCreditsAdded] = useState(0);
  const [newBalance, setNewBalance] = useState(0);

  useEffect(() => {
    const verifyPayment = async () => {
      const sessionId = searchParams.get("session_id");
      
      if (!sessionId) {
        toast({
          title: "Error",
          description: "Session ID not found",
          variant: "destructive",
        });
        navigate("/");
        return;
      }

      try {
        const { data, error } = await supabase.functions.invoke("verify-payment", {
          body: { session_id: sessionId }
        });

        if (error) throw error;

        setCreditsAdded(data.credits_added);
        setNewBalance(data.new_balance);
        
        toast({
          title: "Payment confirmed!",
          description: `${data.credits_added} credits added to your account`,
        });
      } catch (error: any) {
        console.error("Error verifying payment:", error);
        toast({
          title: "Error verifying payment",
          description: error.message,
          variant: "destructive",
        });
      } finally {
        setVerifying(false);
      }
    };

    verifyPayment();
  }, [searchParams, navigate, toast]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="max-w-md w-full bg-card border rounded-lg p-8 text-center">
        {verifying ? (
          <>
            <Loader2 className="h-16 w-16 text-primary animate-spin mx-auto mb-4" />
            <h1 className="text-2xl font-bold mb-2">Verificando pagamento...</h1>
            <p className="text-muted-foreground">
              Aguarde enquanto confirmamos sua compra
            </p>
          </>
        ) : (
          <>
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
            <h1 className="text-2xl font-bold mb-2">Pagamento Confirmado!</h1>
            <p className="text-muted-foreground mb-6">
              Seus créditos foram adicionados com sucesso
            </p>

            <div className="bg-primary/10 rounded-lg p-6 mb-6">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Sparkles className="h-6 w-6 text-primary" />
                <span className="text-3xl font-bold">+{creditsAdded}</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Novo saldo: {newBalance} créditos
              </p>
            </div>

            <Button onClick={() => navigate("/")} className="w-full">
              Voltar ao Canvas
            </Button>
          </>
        )}
      </div>
    </div>
  );
}

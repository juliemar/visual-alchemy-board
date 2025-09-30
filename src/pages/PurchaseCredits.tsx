import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Sparkles, Check, ArrowLeft } from "lucide-react";
import { useCredits } from "@/hooks/useCredits";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";

const PACKAGES = [
  {
    credits: 1 as const,
    price: 1,
    pricePerCredit: 1,
    savings: 0,
    popular: false,
  },
  {
    credits: 5 as const,
    price: 4.5,
    pricePerCredit: 0.9,
    savings: 10,
    popular: true,
  },
  {
    credits: 10 as const,
    price: 8,
    pricePerCredit: 0.8,
    savings: 20,
    popular: false,
  },
  {
    credits: 100 as const,
    price: 70,
    pricePerCredit: 0.7,
    savings: 30,
    popular: false,
  },
];

const formatBRL = (value: number) => {
  return `R$ ${value.toFixed(2).replace('.', ',')}`;
};

const PurchaseCredits = () => {
  const { credits, purchaseCredits } = useCredits();
  const [purchasing, setPurchasing] = useState(false);
  const navigate = useNavigate();

  const handlePurchase = async (creditAmount: 1 | 5 | 10 | 100) => {
    setPurchasing(true);
    await purchaseCredits(creditAmount);
    setPurchasing(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-accent/20">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate(-1)}
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar
          </Button>
          
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Compre Créditos
            </h1>
            <p className="text-lg text-muted-foreground mb-2">
              Cada crédito permite fazer download de 1 imagem gerada.
            </p>
            {credits && (
              <p className="text-xl font-semibold text-primary">
                Saldo atual: {credits.balance} créditos
              </p>
            )}
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {PACKAGES.map((pkg) => (
            <div
              key={pkg.credits}
              className={cn(
                "relative border rounded-xl p-6 hover:shadow-lg transition-all bg-card",
                pkg.popular && "border-primary border-2 shadow-md scale-105"
              )}
            >
              {pkg.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground px-4 py-1 rounded-full text-sm font-semibold">
                  Mais Popular
                </div>
              )}

              <div className="text-center mb-6">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Sparkles className="h-6 w-6 text-primary" />
                  <h3 className="text-3xl font-bold">{pkg.credits}</h3>
                </div>
                <p className="text-muted-foreground">
                  {pkg.credits === 1 ? "crédito" : "créditos"}
                </p>
              </div>

              {pkg.savings > 0 && (
                <div className="bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-100 px-3 py-1 rounded-full text-sm font-semibold text-center mb-4">
                  Economize {pkg.savings}%
                </div>
              )}

              <div className="text-center mb-6">
                <div className="text-4xl font-bold mb-2">
                  {formatBRL(pkg.price)}
                </div>
                <p className="text-sm text-muted-foreground">
                  {formatBRL(pkg.pricePerCredit)} por crédito
                </p>
              </div>

              <Button
                onClick={() => handlePurchase(pkg.credits)}
                disabled={purchasing}
                className="w-full mb-4"
                size="lg"
                variant={pkg.popular ? "default" : "outline"}
              >
                Comprar Agora
              </Button>

              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Check className="h-4 w-4 text-green-500 flex-shrink-0" />
                  <span>{pkg.credits} {pkg.credits === 1 ? "download" : "downloads"}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Check className="h-4 w-4 text-green-500 flex-shrink-0" />
                  <span>Pagamento único via Stripe</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Check className="h-4 w-4 text-green-500 flex-shrink-0" />
                  <span>Sem assinatura</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Info Box */}
        <div className="max-w-3xl mx-auto p-6 bg-muted rounded-xl text-center">
          <p className="text-lg">
            💡 <strong>Dica:</strong> Pacotes maiores oferecem melhor custo-benefício.
            Gere quantas imagens quiser - você só paga quando faz o download!
          </p>
        </div>
      </div>
    </div>
  );
};

export default PurchaseCredits;

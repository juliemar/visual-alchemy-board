import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Sparkles, Check } from "lucide-react";
import { useCredits } from "@/hooks/useCredits";
import { cn } from "@/lib/utils";

interface CreditsPurchaseModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

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

export const CreditsPurchaseModal = ({
  open,
  onOpenChange,
}: CreditsPurchaseModalProps) => {
  const { credits, purchaseCredits } = useCredits();
  const [purchasing, setPurchasing] = useState(false);

  const handlePurchase = async (creditAmount: 1 | 5 | 10 | 100) => {
    setPurchasing(true);
    await purchaseCredits(creditAmount);
    setPurchasing(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle className="text-2xl">Purchase Credits</DialogTitle>
          <DialogDescription>
            Each credit allows you to download 1 generated image.
            {credits && (
              <span className="block mt-2 text-foreground font-semibold">
                Current balance: {credits.balance} credits
              </span>
            )}
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          {PACKAGES.map((pkg) => (
            <div
              key={pkg.credits}
              className={cn(
                "relative border rounded-lg p-6 hover:border-primary transition-colors",
                pkg.popular && "border-primary border-2"
              )}
            >
              {pkg.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground px-3 py-1 rounded-full text-xs font-semibold">
                  Most Popular
                </div>
              )}

              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <Sparkles className="h-5 w-5 text-primary" />
                    <h3 className="text-2xl font-bold">{pkg.credits}</h3>
                    <span className="text-muted-foreground">
                      {pkg.credits === 1 ? "credit" : "credits"}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    ${pkg.pricePerCredit.toFixed(2)} per credit
                  </p>
                </div>

                {pkg.savings > 0 && (
                  <div className="bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-100 px-2 py-1 rounded text-xs font-semibold">
                    Save {pkg.savings}%
                  </div>
                )}
              </div>

              <div className="text-3xl font-bold mb-4">
                ${pkg.price.toFixed(2)}
              </div>

              <Button
                onClick={() => handlePurchase(pkg.credits)}
                disabled={purchasing}
                className="w-full"
                variant={pkg.popular ? "default" : "outline"}
              >
                Buy Now
              </Button>

              <div className="mt-4 space-y-2">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Check className="h-4 w-4 text-green-500" />
                  <span>{pkg.credits} {pkg.credits === 1 ? "download" : "downloads"}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Check className="h-4 w-4 text-green-500" />
                  <span>One-time payment via Stripe</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Check className="h-4 w-4 text-green-500" />
                  <span>No subscription</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 p-4 bg-muted rounded-lg text-sm text-muted-foreground">
          <p>
            💡 <strong>Tip:</strong> Larger packages offer better value.
            Generate as many images as you want - you only pay when you download!
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};

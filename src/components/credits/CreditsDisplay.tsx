import { Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCredits } from "@/hooks/useCredits";

interface CreditsDisplayProps {
  onPurchaseClick: () => void;
}

export const CreditsDisplay = ({ onPurchaseClick }: CreditsDisplayProps) => {
  const { credits, loading } = useCredits();

  if (loading) {
    return (
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Sparkles className="h-4 w-4 animate-pulse" />
        <span>Carregando...</span>
      </div>
    );
  }

  return (
    <Button
      onClick={onPurchaseClick}
      variant="outline"
      size="sm"
      className="gap-2"
    >
      <Sparkles className="h-4 w-4 text-primary" />
      <span className="font-semibold">{credits?.balance || 0} créditos</span>
    </Button>
  );
};

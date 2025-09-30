import { Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCredits } from "@/hooks/useCredits";
import { useNavigate } from "react-router-dom";

interface CreditsDisplayProps {
  onPurchaseClick?: () => void;
}

export const CreditsDisplay = ({ onPurchaseClick }: CreditsDisplayProps) => {
  const { credits, loading } = useCredits();
  const navigate = useNavigate();

  const handleClick = () => {
    if (onPurchaseClick) {
      onPurchaseClick();
    } else {
      navigate("/purchase-credits");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Sparkles className="h-4 w-4 animate-pulse" />
        <span>Loading...</span>
      </div>
    );
  }

  // Always show the credits balance (defaults to 5 for non-authenticated users)
  const balance = credits?.balance ?? 5;

  return (
    <Button
      onClick={handleClick}
      variant="outline"
      size="sm"
      className="gap-2"
    >
      <Sparkles className="h-4 w-4 text-primary" />
      <span className="font-semibold">{balance} créditos</span>
    </Button>
  );
};

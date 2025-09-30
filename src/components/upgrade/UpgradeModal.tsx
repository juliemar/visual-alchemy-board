import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Check, Sparkles } from "lucide-react";

interface UpgradeModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUpgrade: () => void;
  type: "board" | "node";
  currentCount?: number;
  limit?: number;
}

export const UpgradeModal = ({
  open,
  onOpenChange,
  onUpgrade,
  type,
  currentCount,
  limit,
}: UpgradeModalProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl flex items-center gap-2">
            <Sparkles className="h-6 w-6 text-primary" />
            Upgrade to Pro
          </DialogTitle>
          <DialogDescription>
            {type === "board"
              ? `You've reached the limit of ${limit} boards. Upgrade to create unlimited boards!`
              : `You've reached the limit of ${limit} objects in this board. Upgrade to add up to 30 objects per board!`}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 my-4">
          <div className="bg-primary/10 border-2 border-primary rounded-lg p-6">
            <div className="text-center mb-4">
              <h3 className="text-2xl font-bold mb-2">Pro Plan</h3>
              <div className="text-4xl font-bold text-primary mb-1">
                $19.90
                <span className="text-lg font-normal text-muted-foreground">/month</span>
              </div>
            </div>

            <ul className="space-y-3">
              <li className="flex items-start gap-2">
                <Check className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                <span>Up to 30 objects per board</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                <span>Unlimited boards</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                <span>Unlimited image generation</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                <span>Priority support</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="flex-1"
          >
            Not Now
          </Button>
          <Button onClick={onUpgrade} className="flex-1">
            <Sparkles className="mr-2 h-4 w-4" />
            Upgrade Now
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

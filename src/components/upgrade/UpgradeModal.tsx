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
            Upgrade para Pro
          </DialogTitle>
          <DialogDescription>
            {type === "board"
              ? `Você atingiu o limite de ${limit} boards. Atualize para criar boards ilimitados!`
              : `Você atingiu o limite de ${limit} objetos neste board. Atualize para adicionar até 30 objetos por board!`}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 my-4">
          <div className="bg-primary/10 border-2 border-primary rounded-lg p-6">
            <div className="text-center mb-4">
              <h3 className="text-2xl font-bold mb-2">Plano Pro</h3>
              <div className="text-4xl font-bold text-primary mb-1">
                R$ 19,90
                <span className="text-lg font-normal text-muted-foreground">/mês</span>
              </div>
            </div>

            <ul className="space-y-3">
              <li className="flex items-start gap-2">
                <Check className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                <span>Até 30 objetos por board</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                <span>Boards ilimitados</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                <span>Geração ilimitada de imagens</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                <span>Suporte prioritário</span>
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
            Agora não
          </Button>
          <Button onClick={onUpgrade} className="flex-1">
            <Sparkles className="mr-2 h-4 w-4" />
            Fazer Upgrade
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

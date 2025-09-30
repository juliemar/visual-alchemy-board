import { Handle, Position } from "@xyflow/react";
import { Loader2, Download, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useCredits } from "@/hooks/useCredits";
import { CreditsPurchaseModal } from "@/components/credits/CreditsPurchaseModal";

interface GeneratedImageNodeProps {
  data: {
    imageUrl?: string;
    isGenerating?: boolean;
  };
  id: string;
}

export const GeneratedImageNode = ({ data, id }: GeneratedImageNodeProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const [showPurchaseModal, setShowPurchaseModal] = useState(false);
  const { credits, consumeCredit } = useCredits();

  const handleDownload = async () => {
    if (!data.imageUrl) return;
    
    // Check if user has credits
    if (!credits || credits.balance < 1) {
      setShowPurchaseModal(true);
      return;
    }

    // Consume credit first
    const success = await consumeCredit(id);
    if (!success) {
      // If consumption failed, show purchase modal
      setShowPurchaseModal(true);
      return;
    }
    
    try {
      const response = await fetch(data.imageUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `generated-image-${Date.now()}.png`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Error downloading image:', error);
    }
  };

  return (
    <>
      <div className="bg-canvas-node border-2 border-canvas-nodeBorder rounded-xl shadow-lg p-4 min-w-[200px]">
        <Handle type="target" position={Position.Left} className="!bg-primary" />
        <Handle type="source" position={Position.Right} className="!bg-primary" />
        
        {data.isGenerating ? (
          <div className="flex flex-col items-center justify-center h-48 gap-3">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="text-sm text-muted-foreground">Sending to AI...</p>
          </div>
        ) : data.imageUrl ? (
          <div 
            className="relative group"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            <img
              src={data.imageUrl}
              alt="Generated"
              className="w-full h-48 object-cover rounded-lg"
            />
            {isHovered && (
              <div className="absolute inset-0 bg-background/80 rounded-lg flex flex-col items-center justify-center gap-2 animate-fade-in">
                <div className="flex items-center gap-1 text-xs text-muted-foreground mb-2">
                  <Sparkles className="h-3 w-3 text-primary" />
                  <span>1 crédito necessário</span>
                </div>
                <Button
                  onClick={handleDownload}
                  size="lg"
                  className="gap-2"
                >
                  <Download className="h-5 w-5" />
                  Download
                </Button>
              </div>
            )}
          </div>
        ) : (
          <div className="flex items-center justify-center h-48 text-muted-foreground">
            <p className="text-sm">Waiting for generation...</p>
          </div>
        )}
      </div>

      <CreditsPurchaseModal
        open={showPurchaseModal}
        onOpenChange={setShowPurchaseModal}
      />
    </>
  );
};

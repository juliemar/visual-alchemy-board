import { Handle, Position } from "@xyflow/react";
import { Loader2, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";

interface GeneratedImageNodeProps {
  data: {
    imageUrl?: string;
    isGenerating?: boolean;
  };
}

export const GeneratedImageNode = ({ data }: GeneratedImageNodeProps) => {
  const [isHovered, setIsHovered] = useState(false);

  const handleDownload = async () => {
    if (!data.imageUrl) return;
    
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
            <div className="absolute inset-0 bg-background/80 rounded-lg flex items-center justify-center animate-fade-in">
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
  );
};

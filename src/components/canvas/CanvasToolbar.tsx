import { ZoomIn, ZoomOut, Maximize2, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useReactFlow } from "@xyflow/react";

interface CanvasToolbarProps {
  zoomLevel: number;
}

export const CanvasToolbar = ({ zoomLevel }: CanvasToolbarProps) => {
  const { zoomIn, zoomOut, fitView } = useReactFlow();

  return (
    <div className="absolute top-4 left-1/2 -translate-x-1/2 z-10">
      <div className="bg-card border border-border rounded-lg shadow-lg px-2 py-1 flex items-center gap-2">
        <Button
          size="icon"
          variant="ghost"
          onClick={() => zoomIn()}
          className="h-8 w-8"
        >
          <ZoomIn className="h-4 w-4" />
        </Button>
        
        <div className="text-sm font-medium min-w-[60px] text-center">
          {Math.round(zoomLevel * 100)}%
        </div>
        
        <Button
          size="icon"
          variant="ghost"
          onClick={() => zoomOut()}
          className="h-8 w-8"
        >
          <ZoomOut className="h-4 w-4" />
        </Button>
        
        <div className="h-4 w-px bg-border mx-1" />
        
        <Button
          size="icon"
          variant="ghost"
          onClick={() => fitView()}
          className="h-8 w-8"
        >
          <Maximize2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

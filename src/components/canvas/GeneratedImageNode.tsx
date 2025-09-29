import { Handle, Position } from "@xyflow/react";
import { Loader2 } from "lucide-react";

interface GeneratedImageNodeProps {
  data: {
    imageUrl?: string;
    isGenerating?: boolean;
  };
}

export const GeneratedImageNode = ({ data }: GeneratedImageNodeProps) => {
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
        <img
          src={data.imageUrl}
          alt="Generated"
          className="w-full h-48 object-cover rounded-lg"
        />
      ) : (
        <div className="flex items-center justify-center h-48 text-muted-foreground">
          <p className="text-sm">Waiting for generation...</p>
        </div>
      )}
    </div>
  );
};

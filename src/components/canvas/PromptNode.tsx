import { useState } from "react";
import { Handle, Position } from "@xyflow/react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Sparkles } from "lucide-react";

interface PromptNodeProps {
  data: {
    prompt?: string;
    isGenerating?: boolean;
    onGenerate?: (prompt: string) => void;
    onPromptChange?: (prompt: string) => void;
  };
}

export const PromptNode = ({ data }: PromptNodeProps) => {
  const [localPrompt, setLocalPrompt] = useState(data.prompt || "");

  const handleGenerate = () => {
    if (localPrompt.trim() && data.onGenerate) {
      data.onGenerate(localPrompt);
    }
  };

  const handlePromptChange = (value: string) => {
    setLocalPrompt(value);
    if (data.onPromptChange) {
      data.onPromptChange(value);
    }
  };

  return (
    <div className="bg-canvas-node border-2 border-canvas-nodeBorder rounded-xl shadow-lg p-4 min-w-[280px]">
      <Handle type="target" position={Position.Left} className="!bg-primary" />
      <Handle type="source" position={Position.Right} className="!bg-primary" />
      
      <div className="space-y-3">
        <Textarea
          placeholder="What are you thinking?"
          value={localPrompt}
          onChange={(e) => handlePromptChange(e.target.value)}
          className="min-h-[80px] resize-none"
          disabled={data.isGenerating}
        />
        
        <Button
          onClick={handleGenerate}
          disabled={!localPrompt.trim() || data.isGenerating}
          className="w-full"
        >
          {data.isGenerating ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Generating...
            </>
          ) : (
            <>
              <Sparkles className="mr-2 h-4 w-4" />
              Generate
            </>
          )}
        </Button>
      </div>
    </div>
  );
};

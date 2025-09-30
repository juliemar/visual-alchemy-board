import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Sparkles } from "lucide-react";

interface DemoPromptNodeProps {
  prompt?: string;
  onGenerate?: (prompt: string) => void;
  onPromptChange?: (prompt: string) => void;
}

export const DemoPromptNode = ({ prompt = "", onGenerate, onPromptChange }: DemoPromptNodeProps) => {
  const [localPrompt, setLocalPrompt] = useState(prompt);

  const handleGenerate = () => {
    if (localPrompt.trim() && onGenerate) {
      onGenerate(localPrompt);
    }
  };

  const handlePromptChange = (value: string) => {
    setLocalPrompt(value);
    if (onPromptChange) {
      onPromptChange(value);
    }
  };

  return (
    <div className="bg-canvas-node border-2 border-canvas-nodeBorder rounded-xl shadow-lg p-4 min-w-[280px]">
      <div className="space-y-3">
        <Textarea
          placeholder="What are you thinking?"
          value={localPrompt}
          onChange={(e) => handlePromptChange(e.target.value)}
          className="min-h-[80px] resize-none"
        />
        
        <Button
          onClick={handleGenerate}
          disabled={!localPrompt.trim()}
          className="w-full"
        >
          <Sparkles className="mr-2 h-4 w-4" />
          Generate
        </Button>
      </div>
    </div>
  );
};

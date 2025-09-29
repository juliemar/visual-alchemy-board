import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus, Upload, FileText, X } from "lucide-react";

interface NodeCreationMenuProps {
  onCreateNode: (type: "image_upload" | "prompt") => void;
}

export const NodeCreationMenu = ({ onCreateNode }: NodeCreationMenuProps) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="fixed bottom-8 right-8 z-20">
      {isOpen && (
        <div className="absolute bottom-16 right-0 bg-card border border-border rounded-lg shadow-lg p-2 space-y-2 min-w-[200px]">
          <Button
            variant="ghost"
            className="w-full justify-start"
            onClick={() => {
              onCreateNode("image_upload");
              setIsOpen(false);
            }}
          >
            <Upload className="mr-2 h-4 w-4" />
            Add Image Upload
          </Button>
          <Button
            variant="ghost"
            className="w-full justify-start"
            onClick={() => {
              onCreateNode("prompt");
              setIsOpen(false);
            }}
          >
            <FileText className="mr-2 h-4 w-4" />
            Add Prompt Node
          </Button>
        </div>
      )}
      
      <Button
        size="icon"
        className="h-14 w-14 rounded-full shadow-lg"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? (
          <X className="h-6 w-6" />
        ) : (
          <Plus className="h-6 w-6" />
        )}
      </Button>
    </div>
  );
};

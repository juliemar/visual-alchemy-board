import { useState } from "react";
import { Handle, Position } from "@xyflow/react";
import { Upload, X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ImageUploadNodeProps {
  data: {
    imageUrl?: string;
    onImageUpload?: (file: File) => void;
    onImageRemove?: () => void;
  };
}

export const ImageUploadNode = ({ data }: ImageUploadNodeProps) => {
  const [isDragging, setIsDragging] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && data.onImageUpload) {
      data.onImageUpload(file);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file && data.onImageUpload) {
      data.onImageUpload(file);
    }
  };

  return (
    <div className="bg-canvas-node border-2 border-canvas-nodeBorder rounded-xl shadow-lg p-4 min-w-[180px]">
      <Handle type="source" position={Position.Right} className="!bg-primary" />
      
      {!data.imageUrl ? (
        <div
          className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
            isDragging
              ? "border-primary bg-primary/5"
              : "border-muted-foreground/30 hover:border-primary/50"
          }`}
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
        >
          <label className="cursor-pointer flex flex-col items-center gap-2">
            <Upload className="h-8 w-8 text-muted-foreground" />
            <span className="text-sm text-primary font-medium">Upload Image</span>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />
          </label>
        </div>
      ) : (
        <div className="relative">
          <img
            src={data.imageUrl}
            alt="Uploaded"
            className="w-full h-32 object-cover rounded-lg"
          />
          <Button
            size="icon"
            variant="destructive"
            className="absolute top-1 right-1 h-6 w-6"
            onClick={data.onImageRemove}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  );
};

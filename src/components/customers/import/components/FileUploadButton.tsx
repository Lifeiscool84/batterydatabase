import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";

interface FileUploadButtonProps {
  onFileSelect: (event: React.ChangeEvent<HTMLInputElement>) => void;
  isProcessing: boolean;
}

export const FileUploadButton = ({ onFileSelect, isProcessing }: FileUploadButtonProps) => {
  const handleClick = () => {
    const fileInput = document.getElementById('file-upload') as HTMLInputElement;
    if (fileInput) {
      fileInput.click();
    }
  };

  return (
    <div className="flex flex-col items-center justify-center p-8 border-2 border-dashed rounded-lg">
      <input
        type="file"
        accept=".xlsx,.xls"
        onChange={onFileSelect}
        className="hidden"
        id="file-upload"
      />
      <Button 
        variant="outline" 
        onClick={handleClick}
        disabled={isProcessing}
        className="w-full"
      >
        <Upload className="w-4 h-4 mr-2" />
        Choose Excel File
      </Button>
      <p className="text-sm text-muted-foreground mt-2">
        Upload .xlsx or .xls file (max 10MB)
      </p>
    </div>
  );
};
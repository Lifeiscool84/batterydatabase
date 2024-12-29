import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";

interface FileUploadButtonProps {
  onFileSelect: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export const FileUploadButton = ({ onFileSelect }: FileUploadButtonProps) => {
  return (
    <div className="flex flex-col items-center justify-center p-8 border-2 border-dashed rounded-lg">
      <input
        type="file"
        accept=".xlsx,.xls"
        onChange={onFileSelect}
        className="hidden"
        id="file-upload"
      />
      <label htmlFor="file-upload" className="cursor-pointer">
        <div className="flex flex-col items-center space-y-2">
          <Button variant="outline" className="w-full">
            <Upload className="w-4 h-4 mr-2" />
            Choose Excel File
          </Button>
          <p className="text-sm text-muted-foreground">
            Upload .xlsx or .xls file
          </p>
        </div>
      </label>
    </div>
  );
};
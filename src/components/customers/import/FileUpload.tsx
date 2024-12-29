import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { FileUploadButton } from "./components/FileUploadButton";
import { TemplateDownloadButton } from "./components/TemplateDownloadButton";
import { processExcelFile } from "./utils/fileUtils";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { FileText } from "lucide-react";

interface FileUploadProps {
  onDataProcessed: (data: string) => void;
}

export const FileUpload = ({ onDataProcessed }: FileUploadProps) => {
  const { toast } = useToast();
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentFile, setCurrentFile] = useState<File | null>(null);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsProcessing(true);
    setCurrentFile(file);

    try {
      await processExcelFile(file, onDataProcessed, toast);
      toast({
        title: "File processed successfully",
        description: `File "${file.name}" (${(file.size / 1024).toFixed(2)} KB) has been processed.`,
      });
    } catch (error) {
      console.error('File processing error:', error);
      toast({
        title: "Error processing file",
        description: error instanceof Error ? error.message : "Please try again",
        variant: "destructive",
      });
      setCurrentFile(null);
    } finally {
      setIsProcessing(false);
    }
    
    // Clear the input value to allow uploading the same file again
    const fileInput = document.getElementById('file-upload') as HTMLInputElement;
    if (fileInput) fileInput.value = '';
  };

  return (
    <div className="space-y-4">
      <FileUploadButton onFileSelect={handleFileUpload} isProcessing={isProcessing} />
      
      {currentFile && (
        <Alert>
          <FileText className="h-4 w-4" />
          <AlertDescription>
            Current file: {currentFile.name} ({(currentFile.size / 1024).toFixed(2)} KB)
          </AlertDescription>
        </Alert>
      )}
      
      <TemplateDownloadButton />
    </div>
  );
};
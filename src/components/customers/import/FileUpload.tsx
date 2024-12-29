import { useState } from "react";
import { FileUploadButton } from "./components/FileUploadButton";
import { TemplateDownloadButton } from "./components/TemplateDownloadButton";
import { processExcelFile } from "./utils/fileUtils";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { FileText, AlertCircle } from "lucide-react";

interface FileUploadProps {
  onDataProcessed: (data: string) => void;
}

export const FileUpload = ({ onDataProcessed }: FileUploadProps) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentFile, setCurrentFile] = useState<File | null>(null);
  const [uploadStatus, setUploadStatus] = useState<string>("");

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsProcessing(true);
    setCurrentFile(file);
    setUploadStatus("Processing file...");

    try {
      await processExcelFile(file, onDataProcessed, setUploadStatus);
    } catch (error) {
      console.error('File processing error:', error);
      setUploadStatus(error instanceof Error ? error.message : "Please try again");
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

      {uploadStatus && (
        <Alert variant={uploadStatus.includes("error") ? "destructive" : "default"}>
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Upload Status</AlertTitle>
          <AlertDescription>{uploadStatus}</AlertDescription>
        </Alert>
      )}
      
      <TemplateDownloadButton />
    </div>
  );
};
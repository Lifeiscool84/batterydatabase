import { useToast } from "@/hooks/use-toast";
import { FileUploadButton } from "./components/FileUploadButton";
import { TemplateDownloadButton } from "./components/TemplateDownloadButton";
import { processExcelFile } from "./utils/fileUtils";

interface FileUploadProps {
  onDataProcessed: (data: string) => void;
}

export const FileUpload = ({ onDataProcessed }: FileUploadProps) => {
  const { toast } = useToast();

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    await processExcelFile(file, onDataProcessed, toast);
    
    // Clear the input value to allow uploading the same file again
    const fileInput = document.getElementById('file-upload') as HTMLInputElement;
    if (fileInput) fileInput.value = '';
  };

  return (
    <div className="space-y-4">
      <FileUploadButton onFileSelect={handleFileUpload} />
      <TemplateDownloadButton />
    </div>
  );
};
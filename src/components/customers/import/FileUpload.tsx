import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import * as XLSX from 'xlsx';

interface FileUploadProps {
  onDataProcessed: (data: string) => void;
}

export const FileUpload = ({ onDataProcessed }: FileUploadProps) => {
  const { toast } = useToast();

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const reader = new FileReader();
      reader.onload = (e) => {
        const data = e.target?.result;
        const workbook = XLSX.read(data, { type: 'binary' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
        
        // Convert to CSV format
        const csvData = jsonData
          .map(row => (row as any[])
            .map(cell => typeof cell === 'string' ? `"${cell}"` : cell)
            .join(','))
          .join('\n');

        onDataProcessed(csvData);
      };
      reader.readAsBinaryString(file);

    } catch (error) {
      console.error('Error reading file:', error);
      toast({
        title: "Error reading file",
        description: "Please check your file format and try again",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="flex flex-col items-center justify-center p-8 border-2 border-dashed rounded-lg">
      <input
        type="file"
        accept=".xlsx,.xls"
        onChange={handleFileUpload}
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
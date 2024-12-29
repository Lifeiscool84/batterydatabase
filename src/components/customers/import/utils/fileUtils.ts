import { useToast } from "@/hooks/use-toast";
import * as XLSX from 'xlsx';

export const processExcelFile = async (
  file: File,
  onSuccess: (csvData: string) => void,
  toast: ReturnType<typeof useToast>['toast']
) => {
  try {
    // Validate file type
    const fileType = file.name.split('.').pop()?.toLowerCase();
    if (!['xlsx', 'xls'].includes(fileType || '')) {
      toast({
        title: "Invalid file type",
        description: "Please upload an Excel file (.xlsx or .xls)",
        variant: "destructive",
      });
      return;
    }

    // Validate file size (10MB limit)
    const MAX_FILE_SIZE = 10 * 1024 * 1024;
    if (file.size > MAX_FILE_SIZE) {
      toast({
        title: "File too large",
        description: "Please upload a file smaller than 10MB",
        variant: "destructive",
      });
      return;
    }

    const data = await file.arrayBuffer();
    const workbook = XLSX.read(data, { type: 'array' });
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

    // Validate minimum rows (header + at least one data row)
    if (jsonData.length < 2) {
      toast({
        title: "Invalid file content",
        description: "File must contain a header row and at least one data row",
        variant: "destructive",
      });
      return;
    }

    // Convert to CSV format
    const csvData = jsonData
      .map(row => (row as any[])
        .map(cell => typeof cell === 'string' ? `"${cell}"` : cell)
        .join(','))
      .join('\n');

    onSuccess(csvData);
    
    toast({
      title: "File processed successfully",
      description: "Your data is ready for review",
    });

  } catch (error) {
    console.error('Error processing Excel file:', error);
    toast({
      title: "Error processing file",
      description: "Please make sure your file follows the template format",
      variant: "destructive",
    });
  }
};
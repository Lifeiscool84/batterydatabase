import { useToast } from "@/hooks/use-toast";
import * as XLSX from 'xlsx';

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ALLOWED_EXTENSIONS = ['xlsx', 'xls'];

export const processExcelFile = async (
  file: File,
  onSuccess: (csvData: string) => void,
  toast: ReturnType<typeof useToast>['toast']
) => {
  try {
    // Validate file name and extension
    const fileExt = file.name.split('.').pop()?.toLowerCase();
    if (!fileExt || !ALLOWED_EXTENSIONS.includes(fileExt)) {
      throw new Error(`Invalid file type. Please upload an Excel file (${ALLOWED_EXTENSIONS.join(' or ')})`);
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      throw new Error('File size exceeds 10MB limit');
    }

    const data = await file.arrayBuffer();
    const workbook = XLSX.read(data, { type: 'array' });
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

    // Validate minimum rows (header + at least one data row)
    if (!Array.isArray(jsonData) || jsonData.length < 2) {
      throw new Error('File must contain a header row and at least one data row');
    }

    // Validate required columns
    const headers = (jsonData[0] as string[]).map(h => h.toLowerCase());
    const requiredColumns = ['name', 'status', 'address', 'phone', 'size'];
    const missingColumns = requiredColumns.filter(col => !headers.includes(col));

    if (missingColumns.length > 0) {
      throw new Error(`Missing required columns: ${missingColumns.join(', ')}`);
    }

    // Convert to CSV format
    const csvData = jsonData
      .map(row => (row as any[])
        .map(cell => typeof cell === 'string' ? `"${cell}"` : cell)
        .join(','))
      .join('\n');

    // Show detailed success message
    toast({
      title: "File processed successfully",
      description: `Found ${jsonData.length - 1} records in "${file.name}" (${(file.size / 1024).toFixed(2)} KB)`,
    });

    onSuccess(csvData);
    
  } catch (error) {
    console.error('Error processing Excel file:', error);
    throw error;
  }
};
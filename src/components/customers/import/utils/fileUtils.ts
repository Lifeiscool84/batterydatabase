import * as XLSX from 'xlsx';

export const processExcelFile = async (
  file: File,
  onDataProcessed: (data: string) => void,
  setUploadStatus: (status: string) => void
) => {
  try {
    const data = await file.arrayBuffer();
    const workbook = XLSX.read(data);
    const worksheet = workbook.Sheets[workbook.SheetNames[0]];
    const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

    if (jsonData.length < 2) {
      throw new Error("File must contain at least one header row and one data row");
    }

    // Convert to CSV
    const csvString = jsonData
      .map(row => 
        (row as any[])
          .map(cell => 
            typeof cell === 'string' ? `"${cell.replace(/"/g, '""')}"` : cell
          )
          .join(',')
      )
      .join('\n');

    onDataProcessed(csvString);
    setUploadStatus("File processed successfully");
  } catch (error) {
    console.error('Error processing file:', error);
    throw new Error(error instanceof Error ? error.message : "Error processing file");
  }
};

export const parsePrice = (price: string | null | undefined): number | null => {
  if (!price) return null;
  
  // First remove currency symbols, units, and any other non-numeric characters
  // except decimal points and negative signs
  const numericValue = price
    .replace(/[^0-9.-]/g, '') // Remove everything except numbers, dots, and minus signs
    .replace(/\.(?=.*\.)/g, ''); // Keep only the last decimal point if multiple exist
  
  const parsedValue = parseFloat(numericValue);
  return isNaN(parsedValue) ? null : parsedValue;
};
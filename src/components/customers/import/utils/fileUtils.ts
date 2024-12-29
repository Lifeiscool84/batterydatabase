const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ALLOWED_EXTENSIONS = ['csv'];

const parseCSVLine = (line: string): string[] => {
  const result = [];
  let current = '';
  let inQuotes = false;
  
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    
    if (char === '"') {
      if (i + 1 < line.length && line[i + 1] === '"') {
        current += '"';
        i++; // Skip next quote
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === ',' && !inQuotes) {
      result.push(current.trim().replace(/^"|"$/g, ''));
      current = '';
    } else {
      current += char;
    }
  }
  
  result.push(current.trim().replace(/^"|"$/g, ''));
  return result;
};

export const processExcelFile = async (
  file: File,
  onDataProcessed: (data: string) => void,
  setStatus: (status: string) => void
) => {
  try {
    // Validate file extension
    const fileExt = file.name.split('.').pop()?.toLowerCase();
    if (!fileExt || !ALLOWED_EXTENSIONS.includes(fileExt)) {
      throw new Error('Invalid file type. Please upload a CSV file');
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      throw new Error('File size exceeds 10MB limit');
    }

    // Read CSV file
    const text = await file.text();
    const lines = text.split(/\r?\n/).filter(line => line.trim());
    
    // Parse CSV lines with proper handling of quoted fields
    const rows = lines.map(parseCSVLine);
    console.log("Parsed CSV rows:", rows);

    // Validate minimum rows (header + at least one data row)
    if (rows.length < 2) {
      throw new Error('File must contain a header row and at least one data row');
    }

    // Validate headers
    const headers = rows[0].map(h => h.toLowerCase());
    const requiredColumns = ['name', 'status', 'address', 'phone', 'size'];
    const missingColumns = requiredColumns.filter(col => !headers.includes(col));

    if (missingColumns.length > 0) {
      throw new Error(`Missing required columns: ${missingColumns.join(', ')}`);
    }

    setStatus(`Successfully processed ${rows.length - 1} records from "${file.name}"`);
    onDataProcessed(text);
    
  } catch (error) {
    console.error('Error processing CSV file:', error);
    throw error;
  }
};
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ALLOWED_EXTENSIONS = ['csv'];

export const processExcelFile = async (
  file: File,
  onSuccess: (csvData: string) => void,
  setStatus: (status: string) => void
) => {
  try {
    // Validate file name and extension
    const fileExt = file.name.split('.').pop()?.toLowerCase();
    if (!fileExt || !ALLOWED_EXTENSIONS.includes(fileExt)) {
      throw new Error('Invalid file type. Please upload a CSV file');
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      throw new Error('File size exceeds 10MB limit');
    }

    // Read CSV file directly
    const text = await file.text();
    const rows = text.split('\n').map(row => 
      row.trim().split(',').map(cell => 
        cell.trim().replace(/^"|"$/g, '') // Remove quotes if present
      )
    );

    // Validate minimum rows (header + at least one data row)
    if (!Array.isArray(rows) || rows.length < 2) {
      throw new Error('File must contain a header row and at least one data row');
    }

    // Validate required columns
    const headers = rows[0].map(h => h.toLowerCase());
    const requiredColumns = ['name', 'status', 'address', 'phone', 'size'];
    const missingColumns = requiredColumns.filter(col => !headers.includes(col));

    if (missingColumns.length > 0) {
      throw new Error(`Missing required columns: ${missingColumns.join(', ')}`);
    }

    setStatus(`Successfully processed ${rows.length - 1} records from "${file.name}"`);
    onSuccess(text);
    
  } catch (error) {
    console.error('Error processing CSV file:', error);
    throw error;
  }
};
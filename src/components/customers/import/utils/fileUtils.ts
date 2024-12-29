const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ALLOWED_EXTENSIONS = ['csv'];

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
    
    setStatus(`Successfully processed file "${file.name}"`);
    onDataProcessed(text);
    
  } catch (error) {
    console.error('Error processing CSV file:', error);
    throw error;
  }
};
import { VALID_STATUSES, VALID_SIZES } from "../../constants";

export const downloadTemplate = () => {
  // Define headers with clear format examples
  const headers = [
    'name',
    'status',
    'address',
    'phone',
    'size',
    'email',
    'website',
    'buying_price',
    'selling_price',
    'general_remarks',
    'internal_notes',
    'location'
  ];

  // Add example row with valid data
  const exampleRow = [
    'ABC Recycling',
    VALID_STATUSES[0].value,
    '"123 Main St, Houston, TX"', // Quoted to handle commas
    '(555) 123-4567',
    VALID_SIZES[0].value,
    'contact@abc.com',
    'www.abc.com',
    '250',
    '300',
    'Example remarks',
    'Internal notes example',
    'Houston'
  ];

  // Convert to CSV format
  const csvContent = [
    headers.join(','),
    exampleRow.join(',')
  ].join('\n');

  // Create and download the file
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = 'facilities_import_template.csv';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
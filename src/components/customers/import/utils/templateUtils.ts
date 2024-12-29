import { VALID_STATUSES, VALID_SIZES } from "../../constants";

export const downloadTemplate = () => {
  // Define headers
  const headers = [
    'name',
    'status',
    'address',
    'phone',
    'email',
    'website',
    'buying_price',
    'selling_price',
    'size',
    'general_remarks',
    'internal_notes',
    'location'
  ];

  // Add example row with valid status and size values
  const exampleRow = [
    'Facility Name',
    VALID_STATUSES[0].value,
    '123 Main St, City, State',
    '(555) 555-5555',
    'contact@facility.com',
    'www.facility.com',
    '1000',
    '1500',
    VALID_SIZES[0].value,
    'General remarks here',
    'Internal notes here',
    'Houston'
  ];

  // Convert to CSV format
  const csvContent = [
    headers.join(','),
    exampleRow.map(value => `"${value}"`).join(',')
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
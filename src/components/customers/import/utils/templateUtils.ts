import * as XLSX from 'xlsx';
import { VALID_STATUSES, VALID_SIZES } from "../../constants";

export const downloadTemplate = () => {
  // Create worksheet with headers
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

  const ws = XLSX.utils.aoa_to_sheet([headers, exampleRow]);

  // Add column widths and formatting
  const colWidths = [
    { wch: 20 }, // name
    { wch: 15 }, // status
    { wch: 30 }, // address
    { wch: 15 }, // phone
    { wch: 25 }, // email
    { wch: 25 }, // website
    { wch: 12 }, // buying_price
    { wch: 12 }, // selling_price
    { wch: 10 }, // size
    { wch: 30 }, // general_remarks
    { wch: 30 }, // internal_notes
    { wch: 15 }, // location
  ];

  ws['!cols'] = colWidths;

  // Add data validation for status and size columns
  if (!ws['!dataValidation']) {
    ws['!dataValidation'] = [];
  }

  // Add validation to status column (B2:B1000)
  ws['!dataValidation'].push({
    sqref: 'B2:B1000',
    type: 'list',
    values: VALID_STATUSES.map(status => status.value)
  });

  // Add validation to size column (I2:I1000)
  ws['!dataValidation'].push({
    sqref: 'I2:I1000',
    type: 'list',
    values: VALID_SIZES.map(size => size.value)
  });

  // Create workbook and add the worksheet
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Facilities Template');

  // Save the file
  XLSX.writeFile(wb, 'facilities_import_template.xlsx');
};
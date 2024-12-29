import { Button } from "@/components/ui/button";
import { Download, Upload } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import * as XLSX from 'xlsx';
import { VALID_STATUSES, VALID_SIZES } from "../constants";

interface FileUploadProps {
  onDataProcessed: (data: string) => void;
}

export const FileUpload = ({ onDataProcessed }: FileUploadProps) => {
  const { toast } = useToast();

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

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
      const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB in bytes
      if (file.size > MAX_FILE_SIZE) {
        toast({
          title: "File too large",
          description: "Please upload a file smaller than 10MB",
          variant: "destructive",
        });
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const data = e.target?.result;
          const workbook = XLSX.read(data, { type: 'binary' });
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

          onDataProcessed(csvData);
          
          // Clear the input value to allow uploading the same file again
          const fileInput = document.getElementById('file-upload') as HTMLInputElement;
          if (fileInput) fileInput.value = '';

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

      reader.onerror = () => {
        toast({
          title: "Error reading file",
          description: "Please try again or use a different file",
          variant: "destructive",
        });
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

  const downloadTemplate = () => {
    try {
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
        VALID_STATUSES[0].value, // Use first valid status
        '123 Main St, City, State',
        '(555) 555-5555',
        'contact@facility.com',
        'www.facility.com',
        '1000',
        '1500',
        VALID_SIZES[0].value, // Use first valid size
        'General remarks here',
        'Internal notes here',
        'Houston'
      ];

      // Add dropdown validation for status and size columns
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
      const statusValidation = {
        type: 'list',
        values: VALID_STATUSES.map(status => status.value)
      };

      const sizeValidation = {
        type: 'list',
        values: VALID_SIZES.map(size => size.value)
      };

      if (!ws['!dataValidation']) {
        ws['!dataValidation'] = [];
      }

      // Add validation to status column (B2:B1000)
      ws['!dataValidation'].push({
        sqref: 'B2:B1000',
        ...statusValidation
      });

      // Add validation to size column (I2:I1000)
      ws['!dataValidation'].push({
        sqref: 'I2:I1000',
        ...sizeValidation
      });

      // Create workbook and add the worksheet
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Facilities Template');

      // Save the file
      XLSX.writeFile(wb, 'facilities_import_template.xlsx');

      toast({
        title: "Template downloaded",
        description: "Fill in the template and upload it back to import facilities",
      });
    } catch (error) {
      console.error('Error creating template:', error);
      toast({
        title: "Error creating template",
        description: "Please try again later",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-4">
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
      
      <div className="flex justify-center">
        <Button variant="outline" onClick={downloadTemplate}>
          <Download className="w-4 h-4 mr-2" />
          Download Template
        </Button>
      </div>
    </div>
  );
};
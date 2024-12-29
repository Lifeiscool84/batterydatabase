import { useState } from "react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { ImportPreview } from "./import/ImportPreview";
import { ImportActions } from "./import/ImportActions";
import { ImportGrid } from "./import/ImportGrid";
import { EXAMPLE_DATA } from "./import/ImportConstants";
import { validateImportData, type FacilityImportData } from "./validation/importValidation";
import * as XLSX from 'xlsx';
import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";

export const FacilityImporter = () => {
  const [rawData, setRawData] = useState("");
  const [preview, setPreview] = useState<FacilityImportData[]>([]);
  const [errors, setErrors] = useState<Record<number, string[]>>({});
  const { toast } = useToast();

  const handlePaste = (text: string) => {
    processData(text);
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const reader = new FileReader();
      reader.onload = (e) => {
        const data = e.target?.result;
        const workbook = XLSX.read(data, { type: 'binary' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
        
        // Convert to CSV format
        const csvData = jsonData
          .map(row => (row as any[])
            .map(cell => typeof cell === 'string' ? `"${cell}"` : cell)
            .join(','))
          .join('\n');

        processData(csvData);
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

  const processData = (text: string) => {
    setRawData(text);
    if (!text.trim()) {
      setPreview([]);
      setErrors({});
      return;
    }

    try {
      const rows = text.trim().split('\n').map(row => 
        row.split(',').map(cell => cell.trim().replace(/^"|"$/g, ''))
      );
      
      if (rows.length < 2) {
        toast({
          title: "Invalid data format",
          description: "Please include a header row and at least one data row",
          variant: "destructive",
        });
        return;
      }

      const headers = rows[0].map(h => h.toLowerCase());
      const data = rows.slice(1).map(row => {
        const obj: Record<string, any> = {};
        headers.forEach((header, i) => {
          const value = row[i];
          if (value === undefined || value === '') return;
          obj[header] = value;
        });
        return obj;
      });

      const { validData, errors } = validateImportData(data);
      setPreview(validData);
      setErrors(errors);

      if (Object.keys(errors).length > 0) {
        toast({
          title: "Validation issues found",
          description: "Please review the errors below and correct the data",
          variant: "destructive",
        });
      } else if (validData.length > 0) {
        toast({
          title: "Data validated successfully",
          description: `${validData.length} records ready to import`,
        });
      }
    } catch (error) {
      console.error('Parse error:', error);
      toast({
        title: "Error parsing data",
        description: "Please check your data format and try again",
        variant: "destructive",
      });
    }
  };

  const handleSuccess = () => {
    setRawData("");
    setPreview([]);
    setErrors({});
    toast({
      title: "Import completed",
      description: "Facilities have been successfully imported",
    });
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Import Facilities</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="upload">
          <TabsList>
            <TabsTrigger value="paste">Paste Data</TabsTrigger>
            <TabsTrigger value="upload">Upload File</TabsTrigger>
          </TabsList>
          
          <TabsContent value="paste">
            <div className="space-y-4">
              <ImportGrid 
                rawData={rawData}
                onDataChange={handlePaste}
                exampleData={EXAMPLE_DATA}
              />
            </div>
          </TabsContent>

          <TabsContent value="upload">
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
            </div>
          </TabsContent>
        </Tabs>

        {preview.length > 0 && (
          <ImportPreview data={preview} errors={errors} />
        )}
      </CardContent>
      <CardFooter>
        <ImportActions 
          data={preview}
          onSuccess={handleSuccess}
          disabled={preview.length === 0 || Object.keys(errors).length > 0}
        />
      </CardFooter>
    </Card>
  );
};
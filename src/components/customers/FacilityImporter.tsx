import { useState } from "react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { ImportPreview } from "./import/ImportPreview";
import { ImportActions } from "./import/ImportActions";
import { validateImportData, type FacilityImportData } from "./validation/importValidation";

const EXAMPLE_DATA = `name,status,address,phone,size,email,website,buying_price,selling_price
ABC Recycling,active,"123 Main St, Houston, TX",(555) 123-4567,Medium,contact@abc.com,www.abc.com,250,300
XYZ Metals,engaged,"456 Oak Ave, Houston, TX",(555) 987-6543,Large,info@xyz.com,www.xyz.com,275,325`;

export const FacilityImporter = () => {
  const [rawData, setRawData] = useState("");
  const [preview, setPreview] = useState<FacilityImportData[]>([]);
  const [errors, setErrors] = useState<Record<number, string[]>>({});
  const { toast } = useToast();

  const handlePaste = (text: string) => {
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
        <Tabs defaultValue="paste">
          <TabsList>
            <TabsTrigger value="paste">Paste Data</TabsTrigger>
            <TabsTrigger value="upload" disabled>Upload File</TabsTrigger>
          </TabsList>
          
          <TabsContent value="paste">
            <div className="space-y-4">
              <div>
                <Label htmlFor="data">Paste your data here</Label>
                <div className="border rounded-md p-4 bg-white">
                  <div className="grid grid-cols-[repeat(9,1fr)] gap-0.5 mb-2">
                    {['Name', 'Status', 'Address', 'Phone', 'Size', 'Email', 'Website', 'Buying Price', 'Selling Price'].map((header, i) => (
                      <div key={i} className="p-2 font-semibold text-sm bg-gray-100 first:rounded-tl-md last:rounded-tr-md border-b border-gray-200">
                        {header}
                      </div>
                    ))}
                  </div>
                  <div className="grid grid-cols-[repeat(9,1fr)] gap-0.5">
                    <textarea
                      id="data"
                      className="col-span-9 min-h-[200px] w-full font-mono text-sm focus-visible:outline-none focus-visible:ring-0 bg-gray-50 p-2 border border-gray-100 rounded-md"
                      placeholder={`Paste CSV data here...\n\nExample format:\n${EXAMPLE_DATA}`}
                      value={rawData}
                      onChange={(e) => handlePaste(e.target.value)}
                    />
                  </div>
                </div>
              </div>

              {preview.length > 0 && (
                <ImportPreview data={preview} errors={errors} />
              )}
            </div>
          </TabsContent>
        </Tabs>
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
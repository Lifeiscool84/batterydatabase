import { useState } from "react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";
import { ImportPreview } from "./import/ImportPreview";
import { ImportActions } from "./import/ImportActions";
import { validateImportData, type FacilityImportData } from "./validation/importValidation";

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
          
          // Convert numeric values
          if (['buying_price', 'selling_price'].includes(header)) {
            obj[header] = parseFloat(value);
          } else {
            obj[header] = value;
          }
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
                <textarea
                  id="data"
                  className="min-h-[200px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  placeholder="Paste CSV data here... 
Example:
name,status,address,phone,size,email,website,buying_price,selling_price
ABC Recycling,active,123 Main St,(555) 123-4567,Medium,contact@abc.com,www.abc.com,250,300"
                  value={rawData}
                  onChange={(e) => handlePaste(e.target.value)}
                />
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
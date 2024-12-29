import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ImportPreview } from "./import/ImportPreview";
import { ImportActions } from "./import/ImportActions";
import { ImportGrid } from "./import/ImportGrid";
import { FileUpload } from "./import/FileUpload";
import { EXAMPLE_DATA } from "./import/ImportConstants";
import { useImportData } from "./import/useImportData";
import { useToast } from "@/hooks/use-toast";

export const FacilityImporter = () => {
  const { rawData, preview, errors, processData, resetData } = useImportData();
  const { toast } = useToast();

  const handleSuccess = () => {
    resetData();
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
                onDataChange={processData}
                exampleData={EXAMPLE_DATA}
              />
            </div>
          </TabsContent>

          <TabsContent value="upload">
            <div className="space-y-4">
              <FileUpload onDataProcessed={processData} />
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
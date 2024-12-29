import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ImportPreview } from "./import/ImportPreview";
import { ImportActions } from "./import/ImportActions";
import { FileUpload } from "./import/FileUpload";
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
        <div className="space-y-4">
          <FileUpload onDataProcessed={processData} />
        </div>

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
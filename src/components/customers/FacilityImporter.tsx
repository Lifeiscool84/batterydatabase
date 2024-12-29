import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ImportPreview } from "./import/ImportPreview";
import { ImportActions } from "./import/ImportActions";
import { FileUpload } from "./import/FileUpload";
import { useImportData } from "./import/useImportData";
import { useToast } from "@/hooks/use-toast";
import { DialogDescription, DialogTitle } from "@/components/ui/dialog";

export const FacilityImporter = () => {
  const { rawData, preview, errors, processData, resetData } = useImportData();
  const { toast } = useToast();

  const handleSuccess = () => {
    resetData();
    toast({
      title: "Import completed",
      description: `${preview.length} facilities have been successfully imported`,
    });
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <DialogTitle>Import Facilities</DialogTitle>
        <DialogDescription>
          Upload an Excel file containing facility data. Download the template for the correct format.
        </DialogDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <FileUpload onDataProcessed={processData} />
          {preview.length > 0 && (
            <ImportPreview data={preview} errors={errors} />
          )}
        </div>
      </CardContent>
      <CardFooter>
        <ImportActions 
          data={preview}
          onSuccess={handleSuccess}
          disabled={Object.keys(errors).length > 0}
        />
      </CardFooter>
    </Card>
  );
};
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
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
    <Card className="w-full h-[600px] flex flex-col">
      <CardHeader>
        <DialogTitle>Import Facilities</DialogTitle>
        <DialogDescription>
          Upload an Excel file containing facility data. Download the template for the correct format.
        </DialogDescription>
      </CardHeader>
      <CardContent className="flex-1 overflow-hidden">
        <div className="h-full flex flex-col space-y-4">
          <FileUpload onDataProcessed={processData} />
          {preview.length > 0 && (
            <ImportPreview data={preview} errors={errors} />
          )}
        </div>
      </CardContent>
      <CardFooter className="flex-shrink-0">
        <ImportActions 
          data={preview}
          onSuccess={handleSuccess}
          disabled={preview.length === 0}
        />
      </CardFooter>
    </Card>
  );
};
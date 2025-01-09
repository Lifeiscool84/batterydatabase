import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { FileUpload } from "./FileUpload";
import { ImportPreview } from "./ImportPreview";
import { ImportActions } from "./ImportActions";
import { TemplateDownloadButton } from "./TemplateDownloadButton";

interface FacilityImporterProps {
  onSuccess?: () => void;
}

export const FacilityImporter = ({ onSuccess }: FacilityImporterProps) => {
  const [data, setData] = useState<any>(null);
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold">Import Facilities</h2>
        <TemplateDownloadButton />
      </div>
      
      <FileUpload onDataLoad={setData} />
      
      {data && (
        <>
          <ImportPreview data={data} />
          <ImportActions 
            data={data} 
            onSuccess={() => {
              toast({
                title: "Import successful",
                description: "All facilities have been imported successfully.",
              });
              onSuccess?.();
            }}
            disabled={isLoading} 
          />
        </>
      )}
    </div>
  );
};

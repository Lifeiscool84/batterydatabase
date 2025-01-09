import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { FileUpload } from "./import/FileUpload";
import { ImportPreview } from "./import/ImportPreview";
import { ImportActions } from "./import/ImportActions";
import { TemplateDownloadButton } from "./import/components/TemplateDownloadButton";

interface FacilityImporterProps {
  onSuccess?: () => void;
}

export const FacilityImporter = ({ onSuccess }: FacilityImporterProps) => {
  const [data, setData] = useState<any>(null);
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<number, string[]>>({});

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold">Import Facilities</h2>
        <TemplateDownloadButton />
      </div>
      
      <FileUpload onDataProcessed={setData} />
      
      {data && (
        <>
          <ImportPreview data={data} errors={errors} />
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
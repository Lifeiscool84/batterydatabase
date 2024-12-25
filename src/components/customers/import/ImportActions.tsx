import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import type { FacilityImportData } from "../validation/importValidation";

interface ImportActionsProps {
  data: FacilityImportData[];
  onSuccess: () => void;
  disabled: boolean;
}

export const ImportActions = ({ data, onSuccess, disabled }: ImportActionsProps) => {
  const { toast } = useToast();

  const handleImport = async () => {
    try {
      for (const facility of data) {
        const { error } = await supabase
          .from('facilities')
          .insert([facility]);

        if (error) throw error;
      }

      toast({
        title: "Import successful",
        description: `Imported ${data.length} facilities`,
      });

      onSuccess();
    } catch (error) {
      toast({
        title: "Import failed",
        description: "An error occurred while importing the data",
        variant: "destructive",
      });
    }
  };

  return (
    <Button 
      onClick={handleImport}
      disabled={disabled}
    >
      Import Data
    </Button>
  );
};
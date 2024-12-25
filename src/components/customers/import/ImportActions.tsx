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
      const preparedData = data.map(facility => ({
        name: facility.name,
        status: facility.status,
        address: facility.address,
        phone: facility.phone,
        size: facility.size,
        email: facility.email,
        website: facility.website,
        buying_price: facility.buying_price,
        selling_price: facility.selling_price,
        last_contact: facility.last_contact,
        general_remarks: facility.general_remarks,
        internal_notes: facility.internal_notes,
      }));

      const { error } = await supabase
        .from('facilities')
        .insert(preparedData);

      if (error) throw error;

      toast({
        title: "Import successful",
        description: `Imported ${data.length} facilities`,
      });

      onSuccess();
    } catch (error) {
      console.error('Import error:', error);
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
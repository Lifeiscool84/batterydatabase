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
      // Ensure all required fields are present before insertion
      const preparedData = data.map(facility => ({
        name: facility.name,
        status: facility.status,
        address: facility.address,
        phone: facility.phone,
        size: facility.size,
        email: facility.email || null,
        website: facility.website || null,
        buying_price: facility.buying_price || null,
        selling_price: facility.selling_price || null,
        last_contact: facility.last_contact || null,
        general_remarks: facility.general_remarks || null,
        internal_notes: facility.internal_notes || null,
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
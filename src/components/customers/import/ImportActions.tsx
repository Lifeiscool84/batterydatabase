import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import type { FacilityImportData } from "../validation/importValidation";
import type { Database } from "@/integrations/supabase/types";

interface ImportActionsProps {
  data: FacilityImportData[];
  onSuccess: () => void;
  disabled: boolean;
}

type FacilityInsert = Database['public']['Tables']['facilities']['Insert'];

export const ImportActions = ({ data, onSuccess, disabled }: ImportActionsProps) => {
  const { toast } = useToast();

  const handleImport = async () => {
    if (data.length === 0) return;

    try {
      // Transform the data to match the facilities table schema
      const preparedData: FacilityInsert[] = data.map(facility => {
        const transformed = {
          name: facility.name,
          status: facility.status,
          address: facility.address,
          phone: facility.phone,
          size: facility.size,
          email: facility.email || null,
          website: facility.website || null,
          buying_price: facility.buying_price ? Number(facility.buying_price) : null,
          selling_price: facility.selling_price ? Number(facility.selling_price) : null,
          last_contact: facility.last_contact || null,
          general_remarks: facility.general_remarks || null,
          internal_notes: facility.internal_notes || null,
          location: 'Houston' // Default location
        };
        console.log('Transformed facility data:', transformed);
        return transformed;
      });

      console.log('Final data to be inserted:', preparedData);

      const { error } = await supabase
        .from('facilities')
        .insert(preparedData);

      if (error) throw error;

      onSuccess();
    } catch (error) {
      console.error('Import error:', error);
      toast({
        title: "Import failed",
        description: error instanceof Error ? error.message : "Please try again",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="flex justify-between items-center w-full">
      <p className="text-sm text-muted-foreground">
        {data.length > 0 ? 
          `${data.length} records ready to import` : 
          'No records to import'}
      </p>
      <Button 
        onClick={handleImport}
        disabled={disabled || data.length === 0}
        variant="default"
      >
        Import Data
      </Button>
    </div>
  );
};
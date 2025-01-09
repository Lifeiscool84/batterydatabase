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

const parsePrice = (price: string | null | undefined): number | null => {
  if (!price) return null;
  
  // First remove currency symbols, units, and any other non-numeric characters
  // except decimal points and negative signs
  const numericValue = price
    .replace(/[^0-9.-]/g, '') // Remove everything except numbers, dots, and minus signs
    .replace(/\.(?=.*\.)/g, ''); // Keep only the last decimal point if multiple exist
  
  const parsedValue = parseFloat(numericValue);
  return isNaN(parsedValue) ? null : parsedValue;
};

export const ImportActions = ({ data, onSuccess, disabled }: ImportActionsProps) => {
  const { toast } = useToast();

  const handleImport = async () => {
    if (data.length === 0) return;

    try {
      // Transform the data to match the facilities table schema
      const preparedData: FacilityInsert[] = data.map(facility => ({
        name: facility.name,
        status: facility.status,
        address: facility.address,
        phone: facility.phone,
        size: facility.size,
        email: facility.email || null,
        website: facility.website || null,
        buying_price: parsePrice(facility.buying_price),
        selling_price: parsePrice(facility.selling_price),
        general_remarks: facility.general_remarks || null,
        internal_notes: facility.internal_notes || null,
        location: facility.location || 'Houston'
      }));

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
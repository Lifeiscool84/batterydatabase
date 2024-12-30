import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import type { Facility } from "../types/database";

export const useFacilityActions = (refetchFacilities: () => void) => {
  const { toast } = useToast();

  const handleCellChange = async (id: string, field: keyof Facility, value: any) => {
    try {
      const { error } = await supabase
        .from('facilities')
        .update({ [field]: value })
        .eq('id', id);

      if (error) throw error;
      refetchFacilities();
    } catch (error) {
      console.error('Error updating facility:', error);
      toast({
        title: "Error updating facility",
        description: error instanceof Error ? error.message : "Please try again",
        variant: "destructive",
      });
    }
  };

  const addNewRow = async (location: string) => {
    const newFacility = {
      name: "New Facility",
      status: "No response" as const,
      address: "",
      phone: "",
      size: "Medium" as const,
      location
    };

    try {
      const { data, error } = await supabase
        .from('facilities')
        .insert([newFacility])
        .select()
        .single();

      if (error) throw error;
      if (data) {
        refetchFacilities();
        toast({
          title: "Added new facility",
          description: "You can now edit its details",
        });
      }
    } catch (error) {
      console.error('Error adding facility:', error);
      toast({
        title: "Error adding facility",
        description: "Please try again",
        variant: "destructive",
      });
    }
  };

  return { handleCellChange, addNewRow };
};
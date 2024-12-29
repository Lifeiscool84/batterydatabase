import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import type { DbPriceHistory, DbInteraction, DbStatusHistory } from "../types";

export const useFacilityData = () => {
  const { toast } = useToast();

  const fetchFacilityData = async (facilityId: string) => {
    try {
      const [
        { data: priceHistory },
        { data: interactions },
        { data: statusHistory },
        { data: capabilities }
      ] = await Promise.all([
        supabase
          .from('facility_price_history')
          .select('*')
          .eq('facility_id', facilityId)
          .order('created_at', { ascending: false }),
        supabase
          .from('facility_interactions')
          .select('*')
          .eq('facility_id', facilityId)
          .order('created_at', { ascending: false }),
        supabase
          .from('facility_status_history')
          .select('*')
          .eq('facility_id', facilityId)
          .order('created_at', { ascending: false }),
        supabase
          .from('facility_capabilities')
          .select('capability')
          .eq('facility_id', facilityId)
      ]);

      return {
        price_history: (priceHistory || []) as DbPriceHistory[],
        interactions: (interactions || []) as DbInteraction[],
        status_history: (statusHistory || []) as DbStatusHistory[],
        capabilities: capabilities?.map(c => c.capability) || []
      };
    } catch (error) {
      console.error('Error fetching facility data:', error);
      toast({
        title: "Error fetching facility data",
        description: "Please try again later",
        variant: "destructive",
      });
      return {
        price_history: [],
        interactions: [],
        status_history: [],
        capabilities: []
      };
    }
  };

  return { fetchFacilityData };
};
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import type { DbFacility } from "../types";

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
        price_history: priceHistory || [],
        interactions: interactions || [],
        status_history: statusHistory || [],
        capabilities: capabilities?.map(c => c.capability) || []
      };
    } catch (error) {
      console.error('Error fetching facility data:', error);
      toast({
        title: "Error fetching facility data",
        description: "Please try again later",
        variant: "destructive",
      });
      return null;
    }
  };

  return { fetchFacilityData };
};
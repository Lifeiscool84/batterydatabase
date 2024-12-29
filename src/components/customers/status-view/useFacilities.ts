import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import type { Location } from "@/pages/Customers";
import type { FacilityGroups } from "../types/display";
import { useFacilityData } from "./hooks/useFacilityData";
import { mapFacilityToCardProps } from "./utils/facilityMappers";

export const useFacilities = (location: Location) => {
  const [facilities, setFacilities] = useState<FacilityGroups>({
    activePartners: [],
    engagedProspects: [],
    noResponseContacts: [],
    declinedContacts: []
  });
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const { fetchFacilityData } = useFacilityData();

  useEffect(() => {
    fetchFacilities();
  }, [location]);

  const fetchFacilities = async () => {
    try {
      const { data: facilityData, error: facilityError } = await supabase
        .from('facilities')
        .select('*')
        .order('name');

      if (facilityError) throw facilityError;

      const enrichedFacilities = await Promise.all(
        (facilityData || []).map(async (facility) => {
          const additionalData = await fetchFacilityData(facility.id);
          return {
            ...facility,
            ...additionalData
          };
        })
      );

      const mappedFacilities = enrichedFacilities.map(mapFacilityToCardProps);
      
      setFacilities({
        activePartners: mappedFacilities.filter(f => f.status === "active"),
        engagedProspects: mappedFacilities.filter(f => f.status === "engaged"),
        noResponseContacts: mappedFacilities.filter(f => f.status === "past"),
        declinedContacts: mappedFacilities.filter(f => f.status === "general")
      });
    } catch (error) {
      console.error('Error fetching facilities:', error);
      toast({
        title: "Error fetching facilities",
        description: "Please try again later",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return { facilities, isLoading };
};
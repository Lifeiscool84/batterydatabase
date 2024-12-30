import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import type { Location } from "@/pages/Customers";
import type { Facility } from "../types/database";

export const useFacilities = (
  location: Location,
  onLocationCountsChange: (counts: Record<Location, number>) => void
) => {
  const [facilities, setFacilities] = useState<Facility[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const fetchFacilities = async () => {
    try {
      const { data: allFacilities, error: countError } = await supabase
        .from('facilities')
        .select('location');

      if (countError) throw countError;

      const counts: Record<Location, number> = {
        "Houston": 0,
        "New York/New Jersey": 0,
        "Seattle": 0,
        "Mobile": 0,
        "Los Angeles": 0
      };

      allFacilities?.forEach(facility => {
        const loc = facility.location as Location;
        if (counts[loc] !== undefined) {
          counts[loc]++;
        }
      });

      onLocationCountsChange(counts);

      const { data: locationFacilities, error } = await supabase
        .from('facilities')
        .select('*')
        .eq('location', location)
        .order('name');

      if (error) throw error;
      
      setFacilities(locationFacilities);
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

  useEffect(() => {
    fetchFacilities();
  }, [location]);

  return { facilities, isLoading, refetch: fetchFacilities };
};
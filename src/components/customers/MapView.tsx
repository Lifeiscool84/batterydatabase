import { useState, useEffect } from "react";
import "mapbox-gl/dist/mapbox-gl.css";
import type { Location } from "@/pages/Customers";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useMapInitialization } from "./map-view/hooks/useMapInitialization";
import { useMarkers } from "./map-view/hooks/useMarkers";
import type { Facility } from "./types/database";

interface MapViewProps {
  location: Location;
}

export const MapView = ({ location }: MapViewProps) => {
  const [facilities, setFacilities] = useState<Facility[]>([]);
  const { toast } = useToast();
  const { mapContainer, map } = useMapInitialization(location);
  const markersRef = useMarkers(map, facilities);

  useEffect(() => {
    const fetchFacilities = async () => {
      try {
        const { data, error } = await supabase
          .from('facilities')
          .select('id, name, address')
          .eq('location', location);

        if (error) throw error;
        setFacilities(data || []);
      } catch (error) {
        console.error('Error fetching facilities:', error);
        toast({
          title: "Error fetching facilities",
          description: "Could not load facility locations",
          variant: "destructive",
        });
      }
    };

    fetchFacilities();
  }, [location]);

  return (
    <div className="h-[calc(100vh-300px)] rounded-lg overflow-hidden border">
      <div ref={mapContainer} className="w-full h-full" />
    </div>
  );
};
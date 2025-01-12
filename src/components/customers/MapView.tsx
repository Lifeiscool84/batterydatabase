import { useState, useEffect } from "react";
import "mapbox-gl/dist/mapbox-gl.css";
import type { Location } from "@/pages/Customers";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { MapContainer } from "./map-view/MapContainer";

interface MapViewProps {
  location: Location;
}

interface MapFacility {
  id: string;
  name: string;
  address: string;
}

export const MapView = ({ location }: MapViewProps) => {
  const [facilities, setFacilities] = useState<MapFacility[]>([]);
  const { toast } = useToast();

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
      <MapContainer facilities={facilities} location={location} />
    </div>
  );
};
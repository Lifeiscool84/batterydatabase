import { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import type { Location } from "@/pages/Customers";
import { getLocationCoordinates } from "./utils/coordinates";
import { createMarkerElement } from "./utils/markers";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface MapFacility {
  id: string;
  name: string;
  address: string;
  location: Location;
}

interface MapContainerProps {
  location: Location;
  facilities: MapFacility[];
  onFacilityClick?: (facilityId: string) => void;
}

export const MapContainer = ({ location, facilities, onFacilityClick }: MapContainerProps) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const markers = useRef<mapboxgl.Marker[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  // Initialize map
  useEffect(() => {
    const initializeMap = async () => {
      if (!mapContainer.current) return;

      try {
        // Get Mapbox token from edge function
        const { data: { token } = {}, error } = await supabase.functions.invoke('get-mapbox-token');
        
        if (error) throw error;
        if (!token) throw new Error('No token received');

        mapboxgl.accessToken = token;
        const coordinates = getLocationCoordinates(location);
        
        map.current = new mapboxgl.Map({
          container: mapContainer.current,
          style: 'mapbox://styles/mapbox/light-v11',
          center: coordinates,
          zoom: 9
        });

        map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');
        setIsLoading(false);
      } catch (error) {
        console.error('Error initializing map:', error);
        toast({
          title: "Error initializing map",
          description: "Could not load the map. Please try again later.",
          variant: "destructive",
        });
      }
    };

    initializeMap();

    return () => {
      map.current?.remove();
    };
  }, [location]);

  // Handle markers
  useEffect(() => {
    if (!map.current || isLoading) return;

    // Clear existing markers
    markers.current.forEach(marker => marker.remove());
    markers.current = [];

    // Add new markers
    facilities.forEach(facility => {
      const coordinates = getLocationCoordinates(facility.location);
      
      // Create marker element
      const el = createMarkerElement();
      
      // Create popup
      const popup = new mapboxgl.Popup({ offset: 25 }).setHTML(`
        <div class="p-2">
          <h3 class="font-semibold">${facility.name}</h3>
          <p class="text-sm text-gray-600">${facility.address}</p>
        </div>
      `);

      // Create and add marker
      const marker = new mapboxgl.Marker(el)
        .setLngLat(coordinates)
        .setPopup(popup)
        .addTo(map.current!);

      // Add click handler
      if (onFacilityClick) {
        el.addEventListener('click', () => {
          onFacilityClick(facility.id);
        });
      }

      markers.current.push(marker);
    });

    // Cleanup function
    return () => {
      markers.current.forEach(marker => marker.remove());
      markers.current = [];
    };
  }, [facilities, map.current, isLoading, onFacilityClick]);

  if (isLoading) {
    return <div className="w-full h-full flex items-center justify-center">Loading map...</div>;
  }

  return <div ref={mapContainer} className="w-full h-full" />;
};
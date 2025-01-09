import { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import type { Location } from "@/pages/Customers";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface MapViewProps {
  location: Location;
}

interface Facility {
  id: string;
  name: string;
  address: string;
}

export const MapView = ({ location }: MapViewProps) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [facilities, setFacilities] = useState<Facility[]>([]);
  const { toast } = useToast();
  const markersRef = useRef<mapboxgl.Marker[]>([]);

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

  useEffect(() => {
    if (!mapContainer.current) return;

    // Initialize map
    mapboxgl.accessToken = "pk.eyJ1IjoiZ2xlbm5zaGluIiwiYSI6ImNtNXB5MnhvaTA2amcyaXB5a3R4eXMxZzUifQ.q-ubkcVSOz0HJ9XoIMySLQ";
    
    const coordinates: Record<Location, [number, number]> = {
      "Houston": [-95.3698, 29.7604],
      "New York/New Jersey": [-74.0060, 40.7128],
      "Seattle": [-122.3321, 47.6062],
      "Mobile": [-88.0399, 30.6954],
      "Los Angeles": [-118.2437, 34.0522]
    };

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/light-v11",
      center: coordinates[location],
      zoom: 10
    });

    return () => {
      // Clean up markers
      markersRef.current.forEach(marker => marker.remove());
      markersRef.current = [];
      // Remove map
      map.current?.remove();
    };
  }, [location]);

  useEffect(() => {
    if (!map.current || !facilities.length) return;

    // Clean up existing markers
    markersRef.current.forEach(marker => marker.remove());
    markersRef.current = [];

    // Add markers for each facility
    facilities.forEach(async (facility) => {
      try {
        // Skip if address is empty
        if (!facility.address.trim()) {
          console.warn(`Empty address for facility: ${facility.name}`);
          return;
        }

        // Create geocoding URL
        const params = new URLSearchParams({
          access_token: mapboxgl.accessToken,
        });
        
        const geocodingUrl = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(facility.address)}.json?${params.toString()}`;

        // Perform geocoding request
        const response = await fetch(geocodingUrl);
        
        if (!response.ok) {
          throw new Error(`Geocoding failed: ${response.statusText}`);
        }
        
        const data = await response.json();

        if (data.features && data.features.length > 0) {
          const [lng, lat] = data.features[0].center as [number, number];

          // Create marker element
          const el = document.createElement('div');
          el.className = 'w-6 h-6 bg-primary rounded-full border-2 border-white shadow-lg';

          // Create popup
          const popup = new mapboxgl.Popup({ offset: 25 })
            .setHTML(`
              <div class="p-2">
                <h3 class="font-semibold">${facility.name}</h3>
                <p class="text-sm">${facility.address}</p>
              </div>
            `);

          // Add marker to map
          const marker = new mapboxgl.Marker(el)
            .setLngLat([lng, lat])
            .setPopup(popup)
            .addTo(map.current!);

          markersRef.current.push(marker);
        }
      } catch (error) {
        console.error('Error geocoding address:', error);
      }
    });
  }, [facilities, map.current]);

  return (
    <div className="h-[calc(100vh-300px)] rounded-lg overflow-hidden border">
      <div ref={mapContainer} className="w-full h-full" />
    </div>
  );
};
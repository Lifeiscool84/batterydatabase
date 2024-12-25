import { useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import type { Location } from "@/pages/Customers";

interface MapViewProps {
  location: Location;
}

export const MapView = ({ location }: MapViewProps) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);

  useEffect(() => {
    if (!mapContainer.current) return;

    // Initialize map
    mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN || ""; // Use environment variable
    
    if (!mapboxgl.accessToken) {
      console.error("Mapbox token is required");
      return;
    }
    
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/light-v11",
      center: [-95.3698, 29.7604], // Houston coordinates
      zoom: 10
    });

    return () => {
      map.current?.remove();
    };
  }, []);

  return (
    <div className="h-[calc(100vh-300px)] rounded-lg overflow-hidden border">
      <div ref={mapContainer} className="w-full h-full" />
    </div>
  );
};
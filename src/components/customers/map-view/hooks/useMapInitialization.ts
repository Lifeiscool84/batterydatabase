import { useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";
import type { Location } from "@/pages/Customers";

const coordinates: Record<Location, [number, number]> = {
  "Houston": [-95.3698, 29.7604],
  "New York/New Jersey": [-74.0060, 40.7128],
  "Seattle": [-122.3321, 47.6062],
  "Mobile": [-88.0399, 30.6954],
  "Los Angeles": [-118.2437, 34.0522]
};

export const useMapInitialization = (location: Location) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);

  useEffect(() => {
    if (!mapContainer.current) return;

    mapboxgl.accessToken = "pk.eyJ1IjoiZ2xlbm5zaGluIiwiYSI6ImNtNXB5MnhvaTA2amcyaXB5a3R4eXMxZzUifQ.q-ubkcVSOz0HJ9XoIMySLQ";
    
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/light-v11",
      center: coordinates[location],
      zoom: 10
    });

    return () => {
      map.current?.remove();
    };
  }, [location]);

  return { mapContainer, map };
};
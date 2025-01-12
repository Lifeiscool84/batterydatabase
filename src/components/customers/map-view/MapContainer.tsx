import { useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";
import type { Location } from "@/pages/Customers";
import { getLocationCoordinates } from "./utils/coordinates";
import { createMarkerElement } from "./utils/markers";

interface MapFacility {
  id: string;
  name: string;
  address: string;
}

interface MapContainerProps {
  facilities: MapFacility[];
  location: Location;
}

export const MapContainer = ({ facilities, location }: MapContainerProps) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const markers = useRef<mapboxgl.Marker[]>([]);

  // Initialize map
  useEffect(() => {
    if (!mapContainer.current) return;

    const coordinates = getLocationCoordinates(location);
    
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/light-v11',
      center: coordinates,
      zoom: 9
    });

    map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');

    return () => {
      map.current?.remove();
    };
  }, [location]);

  // Handle markers
  useEffect(() => {
    if (!map.current) return;

    // Clear existing markers
    markers.current.forEach(marker => marker.remove());
    markers.current = [];

    // Add new markers
    facilities.forEach(facility => {
      if (!facility.address?.trim()) {
        console.warn(`Skipping marker for facility "${facility.name}": Empty address`);
        return;
      }

      const geocodeUrl = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(facility.address)}.json?access_token=${mapboxgl.accessToken}`;
      
      const xhr = new XMLHttpRequest();
      xhr.open('GET', geocodeUrl);
      
      xhr.onload = () => {
        if (xhr.status === 200) {
          const response = JSON.parse(xhr.responseText);
          if (response.features?.length) {
            const [lng, lat] = response.features[0].center;
            
            const markerElement = createMarkerElement();
            const popup = new mapboxgl.Popup({ offset: 25 })
              .setHTML(`
                <div class="p-2">
                  <h3 class="font-semibold">${facility.name}</h3>
                  <p class="text-sm">${facility.address}</p>
                </div>
              `);

            const marker = new mapboxgl.Marker(markerElement)
              .setLngLat([lng, lat])
              .setPopup(popup)
              .addTo(map.current!);

            markers.current.push(marker);
          }
        }
      };
      
      xhr.send();
    });

    return () => {
      markers.current.forEach(marker => marker.remove());
      markers.current = [];
    };
  }, [facilities, map.current]);

  return <div ref={mapContainer} className="w-full h-full" />;
};
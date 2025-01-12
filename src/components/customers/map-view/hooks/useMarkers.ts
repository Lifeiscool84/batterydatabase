import { useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";
import { geocodeAddress } from "../utils/geocoding";

interface MapFacility {
  id: string;
  name: string;
  address: string;
}

export const useMarkers = (map: React.RefObject<mapboxgl.Map | null>, facilities: MapFacility[]) => {
  const markersRef = useRef<mapboxgl.Marker[]>([]);

  useEffect(() => {
    const addMarkersToMap = async () => {
      if (!map.current || !facilities.length) return;

      // Clean up existing markers
      markersRef.current.forEach(marker => marker.remove());
      markersRef.current = [];

      // Process each facility
      for (const facility of facilities) {
        try {
          if (!facility.address?.trim()) {
            console.warn(`Skipping geocoding for facility "${facility.name}": Empty or invalid address`);
            continue;
          }

          const coordinates = await geocodeAddress(facility.address);

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
            .setLngLat(coordinates)
            .setPopup(popup)
            .addTo(map.current);

          markersRef.current.push(marker);
        } catch (error) {
          console.error(`Error processing facility "${facility.name}":`, error);
        }
      }
    };

    addMarkersToMap();
  }, [facilities, map.current]);

  return markersRef;
};
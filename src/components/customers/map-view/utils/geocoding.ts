import mapboxgl from "mapbox-gl";

export const geocodeAddress = (address: string): Promise<[number, number]> => {
  return new Promise((resolve, reject) => {
    if (!address?.trim()) {
      reject(new Error('Empty or invalid address'));
      return;
    }

    const xhr = new XMLHttpRequest();
    const encodedAddress = encodeURIComponent(address.trim());
    const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodedAddress}.json?access_token=${mapboxgl.accessToken}&limit=1`;
    
    xhr.open('GET', url);
    xhr.onload = () => {
      if (xhr.status === 200) {
        const response = JSON.parse(xhr.responseText);
        if (response.features?.length) {
          resolve(response.features[0].center);
        } else {
          reject(new Error('No results found'));
        }
      } else {
        reject(new Error(`Geocoding failed: ${xhr.statusText}`));
      }
    };
    xhr.onerror = () => reject(new Error('Network error'));
    xhr.send();
  });
};
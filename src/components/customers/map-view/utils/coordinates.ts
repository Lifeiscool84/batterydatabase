import type { Location } from "@/pages/Customers";

type Coordinates = [number, number];

const locationCoordinates: Record<Location, Coordinates> = {
  "Houston": [-95.3698, 29.7604],
  "New York/New Jersey": [-74.0060, 40.7128],
  "Seattle": [-122.3321, 47.6062],
  "Mobile": [-88.0399, 30.6954],
  "Los Angeles": [-118.2437, 34.0522]
};

export const getLocationCoordinates = (location: Location): Coordinates => {
  return locationCoordinates[location];
};
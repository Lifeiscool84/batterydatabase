import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { Location } from "@/pages/Customers";

interface LocationNavProps {
  selectedLocation: Location;
  onLocationChange: (location: Location) => void;
  locationCounts: Record<Location, number>;
}

export const LocationNav = ({ 
  selectedLocation, 
  onLocationChange,
  locationCounts 
}: LocationNavProps) => {
  const locations: Location[] = [
    "Houston",
    "New York/New Jersey",
    "Seattle",
    "Mobile",
    "Los Angeles",
  ];

  return (
    <nav className="flex flex-wrap gap-2 p-2 bg-background rounded-lg border">
      {locations.map((id) => (
        <Button
          key={id}
          variant={selectedLocation === id ? "default" : "ghost"}
          className={cn(
            "flex items-center gap-2",
            selectedLocation === id && "shadow-sm"
          )}
          onClick={() => onLocationChange(id)}
        >
          {id}
          <Badge variant="secondary" className="ml-1">
            {locationCounts[id] || 0}
          </Badge>
        </Button>
      ))}
    </nav>
  );
};
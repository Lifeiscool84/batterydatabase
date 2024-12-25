import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { Location } from "@/pages/Customers";

const locations: { id: Location; count: number }[] = [
  { id: "Houston", count: 45 },
  { id: "New York/New Jersey", count: 38 },
  { id: "Seattle", count: 22 },
  { id: "Mobile", count: 15 },
  { id: "Los Angeles", count: 31 },
];

interface LocationNavProps {
  selectedLocation: Location;
  onLocationChange: (location: Location) => void;
}

export const LocationNav = ({ selectedLocation, onLocationChange }: LocationNavProps) => {
  return (
    <nav className="flex flex-wrap gap-2 p-2 bg-background rounded-lg border">
      {locations.map(({ id, count }) => (
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
            {count}
          </Badge>
        </Button>
      ))}
    </nav>
  );
};
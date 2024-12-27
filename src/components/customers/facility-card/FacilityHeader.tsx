import { CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin } from "lucide-react";
import { cn } from "@/lib/utils";

interface FacilityHeaderProps {
  name: string;
  address: string;
  size: "Small" | "Medium" | "Large";
}

const sizeColors = {
  Small: "bg-blue-100 text-blue-800",
  Medium: "bg-purple-100 text-purple-800",
  Large: "bg-pink-100 text-pink-800",
};

export const FacilityHeader = ({ name, address, size }: FacilityHeaderProps) => {
  return (
    <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
      <div className="space-y-1">
        <h3 className="font-semibold text-lg leading-none">
          {name}
        </h3>
        <div className="flex items-center text-sm text-muted-foreground">
          <MapPin className="mr-1 h-3 w-3" />
          {address}
        </div>
      </div>
      <Badge className={cn("ml-2", sizeColors[size])}>
        {size}
      </Badge>
    </CardHeader>
  );
};
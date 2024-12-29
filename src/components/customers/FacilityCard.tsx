import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { Status } from "@/pages/Customers";
import { useState } from "react";
import { Collapsible, CollapsibleContent } from "@/components/ui/collapsible";
import { FacilityDetails } from "./FacilityDetails";
import { FacilityHeader } from "./facility-card/FacilityHeader";
import { FacilityContact } from "./facility-card/FacilityContact";
import { FacilityPricing } from "./facility-card/FacilityPricing";
import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";
import { CollapsibleTrigger } from "@/components/ui/collapsible";

interface FacilityCardProps {
  facility: {
    id: string;
    name: string;
    status: Status;
    address: string;
    phone: string;
    email?: string;
    website?: string;
    buyingPrice?: number;
    sellingPrice?: number;
    size: "Small" | "Medium" | "Large";
    remarks?: string;
  };
}

const statusColors: Record<Status, string> = {
  active: "bg-success",
  engaged: "bg-warning",
  past: "bg-danger",
  general: "bg-secondary",
};

export const FacilityCard = ({ facility }: FacilityCardProps) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <Card className="relative overflow-hidden">
      <div 
        className={cn(
          "absolute left-0 top-0 bottom-0 w-1",
          statusColors[facility.status]
        )} 
      />
      
      <FacilityHeader 
        name={facility.name}
        address={facility.address}
        size={facility.size}
      />

      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="min-w-0">
            <FacilityContact 
              phone={facility.phone}
              email={facility.email}
              website={facility.website}
            />
          </div>
          <div className="min-w-0">
            <FacilityPricing 
              buyingPrice={facility.buyingPrice}
              sellingPrice={facility.sellingPrice}
            />
          </div>
        </div>

        <Collapsible open={isExpanded} onOpenChange={setIsExpanded}>
          <div className="flex justify-end pt-2">
            <CollapsibleTrigger asChild>
              <Button variant="ghost" size="sm">
                <ChevronDown className={cn("h-4 w-4 transition-transform", {
                  "transform rotate-180": isExpanded
                })} />
                Details
              </Button>
            </CollapsibleTrigger>
          </div>
          
          <CollapsibleContent className="mt-4">
            <FacilityDetails
              facilityId={facility.id}
              notes={facility.remarks || "No additional notes."}
            />
          </CollapsibleContent>
        </Collapsible>
      </CardContent>
    </Card>
  );
};

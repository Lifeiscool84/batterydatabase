import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { Status } from "@/pages/Customers";
import { useState } from "react";
import { Collapsible, CollapsibleContent } from "@/components/ui/collapsible";
import { FacilityDetails } from "./FacilityDetails";
import { FacilityHeader } from "./facility-card/FacilityHeader";
import { FacilityContact } from "./facility-card/FacilityContact";
import { FacilityPricing } from "./facility-card/FacilityPricing";
import { FacilityActions } from "./facility-card/FacilityActions";
import type { PriceHistory, Interaction, StatusHistory } from "./types";

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
    lastContact: string;
    size: "Small" | "Medium" | "Large";
    remarks?: string;
    priceHistory: PriceHistory[];
    interactions: Interaction[];
    statusHistory: StatusHistory[];
    capabilities: string[];
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
        <div className="grid grid-cols-2 gap-4">
          <FacilityContact 
            phone={facility.phone}
            email={facility.email}
            website={facility.website}
          />
          <FacilityPricing 
            buyingPrice={facility.buyingPrice}
            sellingPrice={facility.sellingPrice}
            lastContact={facility.lastContact}
          />
        </div>

        <Collapsible open={isExpanded} onOpenChange={setIsExpanded}>
          <FacilityActions isExpanded={isExpanded} />
          
          <CollapsibleContent className="mt-4">
            <FacilityDetails
              facilityId={facility.id}
              priceHistory={facility.priceHistory}
              interactions={facility.interactions}
              statusHistory={facility.statusHistory}
              capabilities={facility.capabilities}
              notes={facility.remarks || "No additional notes."}
            />
          </CollapsibleContent>
        </Collapsible>
      </CardContent>
    </Card>
  );
};
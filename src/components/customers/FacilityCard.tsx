import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Building2, 
  Edit, 
  MessageSquare, 
  DollarSign, 
  PhoneCall,
  ChevronDown,
  Globe,
  Mail,
  MapPin
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { Status } from "@/pages/Customers";

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
  };
}

const statusColors: Record<Status, string> = {
  active: "bg-success",
  engaged: "bg-warning",
  past: "bg-danger",
  general: "bg-secondary",
};

const sizeColors = {
  Small: "bg-blue-100 text-blue-800",
  Medium: "bg-purple-100 text-purple-800",
  Large: "bg-pink-100 text-pink-800",
};

export const FacilityCard = ({ facility }: FacilityCardProps) => {
  return (
    <Card className="relative overflow-hidden">
      <div 
        className={cn(
          "absolute left-0 top-0 bottom-0 w-1",
          statusColors[facility.status]
        )} 
      />
      
      <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
        <div className="space-y-1">
          <h3 className="font-semibold text-lg leading-none">
            {facility.name}
          </h3>
          <div className="flex items-center text-sm text-muted-foreground">
            <MapPin className="mr-1 h-3 w-3" />
            {facility.address}
          </div>
        </div>
        <Badge className={cn("ml-2", sizeColors[facility.size])}>
          {facility.size}
        </Badge>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="flex items-center text-sm">
              <PhoneCall className="mr-2 h-4 w-4" />
              {facility.phone}
            </div>
            {facility.email && (
              <div className="flex items-center text-sm">
                <Mail className="mr-2 h-4 w-4" />
                {facility.email}
              </div>
            )}
            {facility.website && (
              <div className="flex items-center text-sm">
                <Globe className="mr-2 h-4 w-4" />
                {facility.website}
              </div>
            )}
          </div>
          <div className="space-y-2">
            {facility.buyingPrice && (
              <div className="text-sm">
                Buying: ${facility.buyingPrice}/ton
              </div>
            )}
            {facility.sellingPrice && (
              <div className="text-sm">
                Selling: ${facility.sellingPrice}/ton
              </div>
            )}
            <div className="text-sm text-muted-foreground">
              Last Contact: {facility.lastContact}
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between pt-2">
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <Edit className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="sm">
              <MessageSquare className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="sm">
              <DollarSign className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="sm">
              <PhoneCall className="h-4 w-4" />
            </Button>
          </div>
          <Button variant="ghost" size="sm">
            <ChevronDown className="h-4 w-4" />
            Details
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
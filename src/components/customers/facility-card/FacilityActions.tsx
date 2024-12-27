import { Button } from "@/components/ui/button";
import { Edit, MessageSquare, DollarSign, PhoneCall, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { CollapsibleTrigger } from "@/components/ui/collapsible";

interface FacilityActionsProps {
  isExpanded: boolean;
  onEdit?: () => void;
  onMessage?: () => void;
  onPrice?: () => void;
  onCall?: () => void;
}

export const FacilityActions = ({ 
  isExpanded, 
  onEdit, 
  onMessage, 
  onPrice, 
  onCall 
}: FacilityActionsProps) => {
  return (
    <div className="flex items-center justify-between pt-2">
      <div className="flex gap-2">
        <Button variant="outline" size="sm" onClick={onEdit}>
          <Edit className="h-4 w-4" />
        </Button>
        <Button variant="outline" size="sm" onClick={onMessage}>
          <MessageSquare className="h-4 w-4" />
        </Button>
        <Button variant="outline" size="sm" onClick={onPrice}>
          <DollarSign className="h-4 w-4" />
        </Button>
        <Button variant="outline" size="sm" onClick={onCall}>
          <PhoneCall className="h-4 w-4" />
        </Button>
      </div>
      <CollapsibleTrigger asChild>
        <Button variant="ghost" size="sm">
          <ChevronDown className={cn("h-4 w-4 transition-transform", {
            "transform rotate-180": isExpanded
          })} />
          Details
        </Button>
      </CollapsibleTrigger>
    </div>
  );
};
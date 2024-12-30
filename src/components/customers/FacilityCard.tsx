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
import { ChevronDown, Trash2 } from "lucide-react";
import { CollapsibleTrigger } from "@/components/ui/collapsible";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

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
    size: "Small" | "Medium" | "Large" | "Invalid";
    remarks?: string;
    updatedAt?: string;
  };
  onDelete?: () => void;
}

const statusColors: Record<Status, string> = {
  active: "bg-success",
  engaged: "bg-warning",
  past: "bg-danger",
  general: "bg-secondary",
};

export const FacilityCard = ({ facility, onDelete }: FacilityCardProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const { toast } = useToast();

  const handleDelete = async () => {
    try {
      const { error } = await supabase
        .from('facilities')
        .delete()
        .eq('id', facility.id);

      if (error) throw error;

      toast({
        title: "Facility deleted",
        description: `${facility.name} has been removed`,
      });

      if (onDelete) {
        onDelete();
      }
    } catch (error) {
      console.error('Error deleting facility:', error);
      toast({
        title: "Error deleting facility",
        description: "Please try again later",
        variant: "destructive",
      });
    }
    setShowDeleteDialog(false);
  };

  return (
    <>
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
                updatedAt={facility.updatedAt}
              />
            </div>
          </div>

          <Collapsible open={isExpanded} onOpenChange={setIsExpanded}>
            <div className="flex justify-between items-center pt-2">
              <Button 
                variant="destructive" 
                size="sm"
                onClick={() => setShowDeleteDialog(true)}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </Button>
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

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete {facility.name} and all associated data. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};
import { Button } from "@/components/ui/button";
import { Edit, MessageSquare, DollarSign, PhoneCall, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { CollapsibleTrigger } from "@/components/ui/collapsible";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface FacilityActionsProps {
  isExpanded: boolean;
  facilityId: string;
  facilityName: string;
  phone?: string;
  email?: string;
}

export const FacilityActions = ({ 
  isExpanded, 
  facilityId,
  facilityName,
  phone,
  email
}: FacilityActionsProps) => {
  const { toast } = useToast();

  const handleEdit = () => {
    // For now, just show a toast - this would be connected to an edit modal/form
    toast({
      title: "Edit Facility",
      description: `Opening edit form for ${facilityName}`,
    });
  };

  const handleMessage = async () => {
    if (!email) {
      toast({
        title: "Cannot Send Message",
        description: "No email address available for this facility",
        variant: "destructive"
      });
      return;
    }

    // Log interaction in database
    const { error } = await supabase
      .from('facility_interactions')
      .insert({
        facility_id: facilityId,
        type: 'email',
        notes: `Email interaction initiated with ${facilityName}`,
        user_name: 'Current User' // In a real app, this would be the logged-in user's name
      });

    if (error) {
      console.error('Error logging interaction:', error);
      toast({
        title: "Error",
        description: "Could not log the interaction",
        variant: "destructive"
      });
      return;
    }

    // Open email client
    window.location.href = `mailto:${email}`;
  };

  const handlePricing = async () => {
    // Log pricing review interaction
    const { error } = await supabase
      .from('facility_interactions')
      .insert({
        facility_id: facilityId,
        type: 'pricing_review',
        notes: `Pricing review initiated for ${facilityName}`,
        user_name: 'Current User'
      });

    if (error) {
      console.error('Error logging interaction:', error);
      toast({
        title: "Error",
        description: "Could not log the pricing review",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "Pricing Review",
      description: `Opening pricing details for ${facilityName}`,
    });
  };

  const handleCall = async () => {
    if (!phone) {
      toast({
        title: "Cannot Initiate Call",
        description: "No phone number available for this facility",
        variant: "destructive"
      });
      return;
    }

    // Log call interaction
    const { error } = await supabase
      .from('facility_interactions')
      .insert({
        facility_id: facilityId,
        type: 'call',
        notes: `Phone call initiated with ${facilityName}`,
        user_name: 'Current User'
      });

    if (error) {
      console.error('Error logging interaction:', error);
      toast({
        title: "Error",
        description: "Could not log the call",
        variant: "destructive"
      });
      return;
    }

    // Open phone dialer
    window.location.href = `tel:${phone}`;
  };

  return (
    <div className="flex items-center justify-between pt-2">
      <div className="flex gap-2">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={handleEdit}
          title="Edit facility details"
        >
          <Edit className="h-4 w-4" />
        </Button>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={handleMessage}
          title="Send email"
          disabled={!email}
        >
          <MessageSquare className="h-4 w-4" />
        </Button>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={handlePricing}
          title="Review pricing"
        >
          <DollarSign className="h-4 w-4" />
        </Button>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={handleCall}
          title="Make phone call"
          disabled={!phone}
        >
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
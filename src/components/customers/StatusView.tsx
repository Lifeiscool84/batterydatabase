import { useState, useEffect } from "react";
import { FacilityCard } from "./FacilityCard";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import type { Location } from "@/pages/Customers";
import { DbStatus, DisplayStatus, statusMapping } from "./constants";
import type { InteractionType } from "./types";

interface Facility {
  id: string;
  name: string;
  status: DbStatus;
  address: string;
  phone: string;
  email?: string;
  website?: string;
  buying_price?: number;
  selling_price?: number;
  last_contact?: string;
  size: "Small" | "Medium" | "Large";
  general_remarks?: string;
  internal_notes?: string;
  price_history?: {
    date: string;
    buyingPrice: number;
    sellingPrice: number;
    updatedBy: string;
  }[];
  interactions?: {
    date: string;
    type: string;
    notes: string;
    user: string;
  }[];
  status_history?: {
    date: string;
    from: string;
    to: string;
    reason: string;
    user: string;
  }[];
  capabilities?: string[];
}

interface StatusViewProps {
  location: Location;
}

// Helper function to validate interaction type
const validateInteractionType = (type: string): InteractionType => {
  const validTypes: InteractionType[] = ["call", "email", "meeting", "other"];
  return validTypes.includes(type as InteractionType) 
    ? (type as InteractionType) 
    : "other";
};

export const StatusView = ({ location }: StatusViewProps) => {
  const [facilities, setFacilities] = useState<Facility[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchFacilities();
  }, [location]);

  const fetchFacilities = async () => {
    try {
      // First, fetch the main facility data
      const { data: facilityData, error: facilityError } = await supabase
        .from('facilities')
        .select('*')
        .order('name');

      if (facilityError) throw facilityError;

      // For each facility, fetch the related data
      const enrichedFacilities = await Promise.all((facilityData || []).map(async (facility) => {
        const [
          { data: priceHistory },
          { data: interactions },
          { data: statusHistory },
          { data: capabilities }
        ] = await Promise.all([
          supabase
            .from('facility_price_history')
            .select('*')
            .eq('facility_id', facility.id)
            .order('created_at', { ascending: false }),
          supabase
            .from('facility_interactions')
            .select('*')
            .eq('facility_id', facility.id)
            .order('created_at', { ascending: false }),
          supabase
            .from('facility_status_history')
            .select('*')
            .eq('facility_id', facility.id)
            .order('created_at', { ascending: false }),
          supabase
            .from('facility_capabilities')
            .select('capability')
            .eq('facility_id', facility.id)
        ]);

        return {
          ...facility,
          price_history: priceHistory?.map(ph => ({
            date: ph.created_at,
            buyingPrice: ph.buying_price,
            sellingPrice: ph.selling_price,
            updatedBy: ph.updated_by
          })) || [],
          interactions: interactions?.map(int => ({
            date: int.created_at,
            type: validateInteractionType(int.type),
            notes: int.notes,
            user: int.user_name
          })) || [],
          status_history: statusHistory?.map(sh => ({
            date: sh.created_at,
            from: sh.from_status,
            to: sh.to_status,
            reason: sh.reason,
            user: sh.user_name
          })) || [],
          capabilities: capabilities?.map(c => c.capability) || []
        };
      }));

      setFacilities(enrichedFacilities);
    } catch (error) {
      console.error('Error fetching facilities:', error);
      toast({
        title: "Error fetching facilities",
        description: "Please try again later",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const mapFacilityToCardProps = (facility: Facility) => ({
    id: facility.id,
    name: facility.name,
    status: statusMapping[facility.status],
    address: facility.address,
    phone: facility.phone,
    email: facility.email,
    website: facility.website,
    buyingPrice: facility.buying_price,
    sellingPrice: facility.selling_price,
    lastContact: facility.last_contact || 'No contact recorded',
    size: facility.size,
    remarks: facility.general_remarks,
    priceHistory: facility.price_history || [],
    interactions: facility.interactions || [],
    statusHistory: facility.status_history || [],
    capabilities: facility.capabilities || []
  });

  const activePartners = facilities.filter(f => f.status === "Active");
  const engagedProspects = facilities.filter(f => f.status === "Engaged");
  const noResponseContacts = facilities.filter(f => f.status === "No response");
  const declinedContacts = facilities.filter(f => f.status === "Declined");

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-8">
      <section>
        <h2 className="text-xl font-semibold mb-4 text-success">
          Active Partners ({activePartners.length})
        </h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {activePartners.map(facility => (
            <FacilityCard 
              key={facility.id} 
              facility={mapFacilityToCardProps(facility)} 
            />
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-4 text-warning">
          Engaged Prospects ({engagedProspects.length})
        </h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {engagedProspects.map(facility => (
            <FacilityCard 
              key={facility.id} 
              facility={mapFacilityToCardProps(facility)} 
            />
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-4 text-danger">
          No Response ({noResponseContacts.length})
        </h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {noResponseContacts.map(facility => (
            <FacilityCard 
              key={facility.id} 
              facility={mapFacilityToCardProps(facility)} 
            />
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-4 text-muted-foreground">
          Declined ({declinedContacts.length})
        </h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {declinedContacts.map(facility => (
            <FacilityCard 
              key={facility.id} 
              facility={mapFacilityToCardProps(facility)} 
            />
          ))}
        </div>
      </section>
    </div>
  );
};
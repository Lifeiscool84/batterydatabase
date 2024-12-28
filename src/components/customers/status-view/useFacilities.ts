import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import type { Location } from "@/pages/Customers";
import { statusMapping } from "../constants";
import type { InteractionType } from "../types";
import type { DbFacility, MappedFacility, FacilityGroups } from "./types";

// Helper function to validate interaction type with proper type guard
const validateInteractionType = (type: string): InteractionType => {
  const validTypes = ["call", "email", "meeting", "other"] as const;
  return validTypes.includes(type as InteractionType) 
    ? (type as InteractionType) 
    : "other";
};

export const useFacilities = (location: Location) => {
  const [facilities, setFacilities] = useState<FacilityGroups>({
    activePartners: [],
    engagedProspects: [],
    noResponseContacts: [],
    declinedContacts: []
  });
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchFacilities();
  }, [location]);

  const fetchFacilities = async () => {
    try {
      const { data: facilityData, error: facilityError } = await supabase
        .from('facilities')
        .select('*')
        .order('name');

      if (facilityError) throw facilityError;

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
            type: validateInteractionType(int.type), // Using the validation function here
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

      const mappedFacilities = enrichedFacilities.map(mapFacilityToCardProps);
      
      setFacilities({
        activePartners: mappedFacilities.filter(f => f.status === "active"),
        engagedProspects: mappedFacilities.filter(f => f.status === "engaged"),
        noResponseContacts: mappedFacilities.filter(f => f.status === "past"),
        declinedContacts: mappedFacilities.filter(f => f.status === "general")
      });
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

  return { facilities, isLoading };
};

const mapFacilityToCardProps = (facility: DbFacility): MappedFacility => ({
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
import { useState, useEffect } from "react";
import { FacilityCard } from "./FacilityCard";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import type { Location } from "@/pages/Customers";
import { DbStatus, DisplayStatus, statusMapping } from "./constants";

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
}

interface StatusViewProps {
  location: Location;
}

export const StatusView = ({ location }: StatusViewProps) => {
  const [facilities, setFacilities] = useState<Facility[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchFacilities();
  }, [location]);

  const fetchFacilities = async () => {
    try {
      const { data, error } = await supabase
        .from('facilities')
        .select('*')
        .order('name');

      if (error) throw error;
      setFacilities(data || []);
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
  });

  const activePartners = facilities.filter(f => f.status === "Active");
  const engagedProspects = facilities.filter(f => f.status === "Engaged");
  const noResponseContacts = facilities.filter(f => f.status === "No response");
  const declinedContacts = facilities.filter(f => f.status === "Declined");

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